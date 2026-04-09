"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Mail, MessageSquare, Send, Users, Target, Sparkles, Loader2,
  ChevronRight, Clock, CheckCircle2, XCircle, Eye, Zap,
  ArrowRight, Filter, MailPlus, MessageSquarePlus, Search
} from "lucide-react";
import { EMAIL_TEMPLATES, SMS_TEMPLATES, mergeVariables } from "@/lib/email-templates";

type AudienceType = "all_paid" | "all_applicants" | "abandoned_drafts" | "partial_payers" | "full_payers" | "by_tier" | "by_city" | "custom";
type Channel = "email" | "sms";
type Tab = "compose" | "templates" | "history" | "triggers";

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  tier: string;
  status: "draft" | "paid" | "applied";
  amount_ghs: number;
};

interface Props {
  audiences: Record<string, { count: number; label: string }>;
  allContacts: Contact[];
  cities: string[];
  tiers: string[];
  campaigns: any[];
}

const TRIGGER_EVENTS = [
  { id: "application_submitted", label: "Application Submitted", desc: "When someone submits their application", icon: "📝" },
  { id: "payment_completed", label: "Payment Completed", desc: "When payment is confirmed", icon: "✅" },
  { id: "payment_failed", label: "Payment Failed", desc: "When a payment attempt fails", icon: "❌" },
  { id: "draft_abandoned_1h", label: "Draft Abandoned (1 hour)", desc: "1 hour after starting but not finishing", icon: "⏰" },
  { id: "draft_abandoned_24h", label: "Draft Abandoned (24 hours)", desc: "24 hours after starting but not finishing", icon: "📢" },
  { id: "balance_reminder_weekly", label: "Weekly Balance Reminder", desc: "Weekly reminder for partial payers", icon: "💰" },
  { id: "cohort_starts_tomorrow", label: "Cohort Starts Tomorrow", desc: "Day before cohort start date", icon: "🚀" },
  { id: "cohort_starts_week", label: "Cohort Starts This Week", desc: "Week before cohort start date", icon: "📅" },
];

export function MarketingClient({ audiences, allContacts, cities, tiers, campaigns }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("compose");
  const [channel, setChannel] = useState<Channel>("email");
  const [audienceType, setAudienceType] = useState<AudienceType>("all_paid");
  const [tierFilter, setTierFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [contactSearch, setContactSearch] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState<string>("all");

  const emailTemplateList = Object.entries(EMAIL_TEMPLATES);
  const smsTemplateList = Object.entries(SMS_TEMPLATES);

  const filteredContacts = useMemo(() => {
    return allContacts.filter(c => {
      const matchesSearch = !contactSearch || [c.first_name, c.last_name, c.email, c.phone, c.city]
        .some(f => f?.toLowerCase().includes(contactSearch.toLowerCase()));
      const matchesStatus = contactStatusFilter === "all" || c.status === contactStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allContacts, contactSearch, contactStatusFilter]);

  const currentAudienceCount = useMemo(() => {
    if (audienceType === "custom") return selectedContacts.size;
    if (audienceType === "by_tier" || audienceType === "by_city") return "Filtered";
    return audiences[audienceType]?.count ?? 0;
  }, [audienceType, audiences, selectedContacts.size]);

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    const allVisibleIds = filteredContacts.map(c => c.id);
    const allSelected = allVisibleIds.every(id => selectedContacts.has(id));
    setSelectedContacts(prev => {
      const next = new Set(prev);
      if (allSelected) {
        allVisibleIds.forEach(id => next.delete(id));
      } else {
        allVisibleIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const loadTemplate = (templateBody: string, templateSubject?: string) => {
    setMessageBody(templateBody);
    if (templateSubject) setSubject(templateSubject);
    toast.success("Template loaded");
    setActiveTab("compose");
  };

  const handleSend = async () => {
    if (!messageBody.trim()) { toast.warning("Please enter a message"); return; }
    if (channel === "email" && !subject.trim()) { toast.warning("Please enter a subject line"); return; }
    if (audienceType === "custom" && selectedContacts.size === 0) { toast.warning("Select at least one recipient"); return; }

    setSending(true);
    try {
      const customRecipients = audienceType === "custom"
        ? allContacts.filter(c => selectedContacts.has(c.id)).map(c => ({
            email: c.email, phone: c.phone,
            first_name: c.first_name, last_name: c.last_name,
            tier: c.tier, amount_ghs: c.amount_ghs,
          }))
        : undefined;

      const res = await fetch("/api/admin/send-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          subject: subject.trim(),
          messageBody: messageBody.trim(),
          audienceType,
          audienceFilter: {
            ...(audienceType === "by_tier" && { tier: tierFilter }),
            ...(audienceType === "by_city" && { city: cityFilter }),
          },
          customRecipients,
          campaignName: campaignName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send campaign");
      toast.success(data.message);
      setCampaignName("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Campaign failed");
    } finally {
      setSending(false);
    }
  };

  const tabs = [
    { id: "compose" as Tab, label: "Compose", icon: channel === "email" ? MailPlus : MessageSquarePlus },
    { id: "templates" as Tab, label: "Templates", icon: Sparkles },
    { id: "history" as Tab, label: "Campaign Log", icon: Clock },
    { id: "triggers" as Tab, label: "Triggers", icon: Zap },
  ];

  const previewVars: Record<string, string> = {
    first_name: "John", last_name: "Doe", email: "john@example.com",
    amount: "1100", balance: "1100", tier: "50",
    login_url: "#", cohort_name: "2026 Elite Web Development & SaaS Masterclass",
    subject_line: subject, message_body: messageBody,
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200/60 rounded-2xl w-fit shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* COMPOSE TAB */}
      {activeTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Compose Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Channel Selector */}
            <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
              <CardHeader className="px-6 pt-6 pb-3">
                <CardTitle className="text-[15px] font-extrabold text-slate-900">Channel</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "email" as Channel, label: "Email", icon: Mail, desc: "HTML email with templates" },
                    { id: "sms" as Channel, label: "SMS", icon: MessageSquare, desc: "Text message (160 chars)" },
                  ].map(ch => (
                    <button
                      key={ch.id}
                      onClick={() => setChannel(ch.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        channel === ch.id
                          ? "border-blue-500 bg-blue-50/50 shadow-[0_0_0_1px_rgba(37,99,235,0.2)]"
                          : "border-slate-200/60 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${channel === ch.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                          <ch.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-[13px] text-slate-900">{ch.label}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{ch.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Composer */}
            <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
              <CardHeader className="px-6 pt-6 pb-3">
                <CardTitle className="text-[15px] font-extrabold text-slate-900 flex items-center gap-2">
                  {channel === "email" ? <Mail className="w-4 h-4 text-blue-600" /> : <MessageSquare className="w-4 h-4 text-emerald-600" />}
                  Compose {channel === "email" ? "Email" : "SMS"}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-4">
                <div>
                  <Label className="text-[12px] font-bold text-slate-500">Campaign Name (internal)</Label>
                  <Input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g. March payment reminder" className="mt-1.5 rounded-xl h-10 text-[13px]" />
                </div>

                {channel === "email" && (
                  <div>
                    <Label className="text-[12px] font-bold text-slate-500">Subject Line</Label>
                    <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Hey {{first_name}}, important update!" className="mt-1.5 rounded-xl h-10 text-[13px]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-[12px] font-bold text-slate-500">
                      {channel === "email" ? "HTML Body" : "Message"} 
                      {channel === "sms" && <span className="text-slate-400 ml-1">({messageBody.length}/160)</span>}
                    </Label>
                    <button onClick={() => setActiveTab("templates")} className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Use Template
                    </button>
                  </div>
                  <Textarea
                    value={messageBody}
                    onChange={e => setMessageBody(e.target.value)}
                    placeholder={channel === "email"
                      ? `<h2>Hey {{first_name}},</h2>\n<p>Your message here...</p>`
                      : `Hi {{first_name}}, your message here...`}
                    rows={channel === "email" ? 12 : 4}
                    className="rounded-xl resize-none font-mono text-[13px]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Variables: {"{{first_name}}"}, {"{{last_name}}"}, {"{{email}}"}, {"{{amount}}"}, {"{{balance}}"}, {"{{tier}}"}, {"{{login_url}}"}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={handleSend} disabled={sending} className="bg-blue-600 hover:bg-blue-700 rounded-xl h-11 px-6 font-bold flex-1">
                    {sending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...</>
                      : <><Send className="w-4 h-4 mr-2" /> Send Campaign ({currentAudienceCount} recipients)</>}
                  </Button>
                  {channel === "email" && (
                    <Button variant="outline" onClick={() => setPreviewOpen(!previewOpen)} className="rounded-xl h-11 px-5 font-bold">
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Email Preview */}
            {previewOpen && channel === "email" && (
              <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
                <CardHeader className="px-6 pt-6 pb-3 border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-[15px] font-extrabold text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-slate-500" /> Email Preview
                  </CardTitle>
                  <CardDescription className="text-[12px]">How the email will look with sample data</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-b border-slate-100 px-6 py-3 bg-slate-50/30">
                    <p className="text-[12px] text-slate-500"><strong>Subject:</strong> {mergeVariables(subject || "(no subject)", previewVars)}</p>
                    <p className="text-[12px] text-slate-500"><strong>To:</strong> john@example.com</p>
                  </div>
                  <div className="p-4 bg-[#f8fafc]">
                    <div
                      className="max-w-[600px] mx-auto bg-white rounded-xl shadow-sm overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: mergeVariables(messageBody, previewVars) }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Audience Selector */}
          <div className="space-y-5">
            <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] sticky top-24">
              <CardHeader className="px-6 pt-6 pb-3">
                <CardTitle className="text-[15px] font-extrabold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" /> Target Audience
                </CardTitle>
                <CardDescription className="text-[12px]">Who should receive this campaign?</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-2">
                {Object.entries(audiences).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setAudienceType(key as AudienceType)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      audienceType === key
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                        audienceType === key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[12px] font-bold text-slate-700">{val.label}</span>
                    </div>
                    <span className={`text-[13px] font-extrabold ${audienceType === key ? "text-blue-600" : "text-slate-400"}`}>{val.count}</span>
                  </button>
                ))}

                <div className="pt-2 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Filter className="w-3 h-3" /> Advanced</p>

                  {/* Custom Selection */}
                  <button
                    onClick={() => setAudienceType("custom")}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      audienceType === "custom" ? "border-amber-500 bg-amber-50/50" : "border-slate-200/60 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                        audienceType === "custom" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[12px] font-bold text-slate-700">Pick Specific People</span>
                    </div>
                    {audienceType === "custom" && selectedContacts.size > 0 && (
                      <span className="text-[13px] font-extrabold text-amber-600">{selectedContacts.size}</span>
                    )}
                  </button>

                  <button
                    onClick={() => setAudienceType("by_tier")}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      audienceType === "by_tier" ? "border-purple-500 bg-purple-50/50" : "border-slate-200/60 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-[12px] font-bold text-slate-700">Filter by Tier</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                  {audienceType === "by_tier" && (
                    <div className="flex gap-2 pl-4">
                      {tiers.map(t => (
                        <button key={t} onClick={() => setTierFilter(t)} className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-colors ${tierFilter === t ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                          {t}%
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setAudienceType("by_city")}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      audienceType === "by_city" ? "border-purple-500 bg-purple-50/50" : "border-slate-200/60 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-[12px] font-bold text-slate-700">Filter by City</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                  {audienceType === "by_city" && (
                    <div className="pl-4">
                      <Input value={cityFilter} onChange={e => setCityFilter(e.target.value)} placeholder="e.g. Accra" className="rounded-xl h-9 text-[12px]" />
                      {cities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cities.slice(0, 8).map(c => (
                            <button key={c} onClick={() => setCityFilter(c)} className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${cityFilter === c ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* CUSTOM CONTACT PICKER (shown below compose when custom is selected) */}
      {activeTab === "compose" && audienceType === "custom" && (
        <Card className="border-amber-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-amber-100/50 bg-amber-50/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                  <Target className="w-4 h-4 text-amber-600" />
                  Select Recipients
                  {selectedContacts.size > 0 && (
                    <span className="text-[12px] font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-lg">{selectedContacts.size} selected</span>
                  )}
                </CardTitle>
                <CardDescription className="text-[12px] mt-1">Check the people you want to send this campaign to.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedContacts(new Set())} className="text-[11px] font-bold text-slate-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                  Clear All
                </button>
                <button onClick={toggleAllVisible} className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100">
                  {filteredContacts.every(c => selectedContacts.has(c.id)) ? "Deselect All" : "Select All Visible"}
                </button>
              </div>
            </div>
          </CardHeader>

          {/* Search + Filters */}
          <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, phone, or city..."
                value={contactSearch}
                onChange={e => setContactSearch(e.target.value)}
                className="pl-9 h-9 rounded-xl text-[12px] border-slate-200/60"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {["all", "paid", "applied", "draft"].map(s => (
                <button
                  key={s}
                  onClick={() => setContactStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    contactStatusFilter === s ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {s === "all" ? "All" : s === "paid" ? "Paid" : s === "applied" ? "Applied" : "Drafts"}
                </button>
              ))}
            </div>
          </div>

          {/* Contact List */}
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100/80">
              {filteredContacts.length > 0 ? filteredContacts.map(contact => {
                const isSelected = selectedContacts.has(contact.id);
                return (
                  <label
                    key={contact.id}
                    className={`flex items-center gap-4 px-6 py-3.5 cursor-pointer transition-colors ${
                      isSelected ? "bg-amber-50/50" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleContact(contact.id)}
                      className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 shrink-0"
                    />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                        contact.status === "paid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" :
                        contact.status === "draft" ? "bg-red-50 text-red-600 border border-red-200/60" :
                        "bg-blue-50 text-blue-600 border border-blue-200/60"
                      }`}>
                        {contact.first_name[0]}{(contact.last_name || " ")[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-900 truncate">{contact.first_name} {contact.last_name}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{contact.email || contact.phone || "No contact"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {contact.city && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 hidden md:inline">{contact.city}</span>}
                      {contact.tier && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 hidden md:inline">{contact.tier}%</span>}
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-widest ${
                        contact.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                        contact.status === "draft" ? "bg-red-50 text-red-600 border-red-200/60" :
                        "bg-blue-50 text-blue-600 border-blue-200/60"
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  </label>
                );
              }) : (
                <div className="text-center py-12 text-[13px] text-slate-400 font-medium">
                  {contactSearch || contactStatusFilter !== "all" ? "No contacts match your filters" : "No contacts available"}
                </div>
              )}
            </div>
            {filteredContacts.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30 text-[12px] font-medium text-slate-400">
                Showing {filteredContacts.length} contacts • {selectedContacts.size} selected
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TEMPLATES TAB */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setChannel("email")} className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${channel === "email" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
              <Mail className="w-4 h-4 inline mr-1.5" /> Email Templates ({emailTemplateList.length})
            </button>
            <button onClick={() => setChannel("sms")} className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${channel === "sms" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
              <MessageSquare className="w-4 h-4 inline mr-1.5" /> SMS Templates ({smsTemplateList.length})
            </button>
          </div>

          {channel === "email" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emailTemplateList.map(([key, template]) => (
                <Card key={key} className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all group">
                  <CardContent className="p-0">
                    <div className="p-5 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                          template.category === "welcome" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                          template.category === "payment" ? "bg-amber-50 text-amber-700 border-amber-200/60" :
                          template.category === "retarget" ? "bg-red-50 text-red-700 border-red-200/60" :
                          template.category === "reminder" ? "bg-blue-50 text-blue-700 border-blue-200/60" :
                          template.category === "completion" ? "bg-purple-50 text-purple-700 border-purple-200/60" :
                          "bg-slate-50 text-slate-600 border-slate-200/60"
                        }`}>
                          {template.category}
                        </span>
                        <Mail className="w-4 h-4 text-slate-300" />
                      </div>
                      <h3 className="text-[15px] font-extrabold text-slate-900">{template.name}</h3>
                      <p className="text-[12px] text-slate-400 font-medium mt-1">Subject: {template.subject}</p>
                    </div>
                    <div className="p-5 bg-slate-50/30 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 4).map(v => (
                          <span key={v} className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200/60">{`{{${v}}}`}</span>
                        ))}
                      </div>
                      <Button size="sm" onClick={() => loadTemplate(template.body, template.subject)} className="bg-blue-600 hover:bg-blue-700 rounded-lg h-8 text-[11px] font-bold px-4">
                        Use Template <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {smsTemplateList.map(([key, template]) => (
                <Card key={key} className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                        template.category === "payment" ? "bg-amber-50 text-amber-700 border-amber-200/60" :
                        template.category === "welcome" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                        template.category === "retarget" ? "bg-red-50 text-red-700 border-red-200/60" :
                        template.category === "reminder" ? "bg-blue-50 text-blue-700 border-blue-200/60" :
                        "bg-slate-50 text-slate-600 border-slate-200/60"
                      }`}>
                        {template.category}
                      </span>
                      <MessageSquare className="w-4 h-4 text-slate-300" />
                    </div>
                    <h3 className="text-[14px] font-extrabold text-slate-900">{template.name}</h3>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[12px] text-slate-600 font-medium leading-relaxed">{template.body}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{template.body.length} chars</span>
                      <Button size="sm" onClick={() => { loadTemplate(template.body); setChannel("sms"); }} className="bg-emerald-600 hover:bg-emerald-700 rounded-lg h-8 text-[11px] font-bold px-4">
                        Use <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "history" && (
        <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Campaign History
              <span className="text-[12px] font-bold text-slate-400 ml-1">({campaigns.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {campaigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30">
                      <th className="text-left px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Campaign</th>
                      <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Channel</th>
                      <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Audience</th>
                      <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Sent</th>
                      <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Failed</th>
                      <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="text-right px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {campaigns.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-[13px] font-bold text-slate-900">{c.name}</p>
                          {c.subject && <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate max-w-[200px]">{c.subject}</p>}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                            c.channel === "email" ? "bg-blue-50 text-blue-700 border-blue-200/60" : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                          }`}>{c.channel}</span>
                        </td>
                        <td className="px-4 py-4 text-center text-[13px] font-bold text-slate-600">{c.total_recipients}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-[13px] font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {c.total_sent || 0}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {(c.total_failed || 0) > 0 ? (
                            <span className="text-[13px] font-extrabold text-red-500 flex items-center justify-center gap-1">
                              <XCircle className="w-3 h-3" /> {c.total_failed}
                            </span>
                          ) : <span className="text-[12px] text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                            c.status === "sent" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                            c.status === "sending" ? "bg-blue-50 text-blue-700 border-blue-200/60" :
                            c.status === "failed" ? "bg-red-50 text-red-700 border-red-200/60" :
                            "bg-slate-50 text-slate-600 border-slate-200/60"
                          }`}>{c.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-[12px] font-medium text-slate-400">
                          {c.sent_at ? new Date(c.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) :
                           new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-[15px] font-extrabold text-slate-900 mb-1">No campaigns yet</h3>
                <p className="text-[13px] text-slate-400 font-medium">Your sent campaigns will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TRIGGERS TAB */}
      {activeTab === "triggers" && (
        <div className="space-y-6">
          <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Automated Triggers
              </CardTitle>
              <CardDescription className="text-[13px]">Set up automatic messages that fire when specific events happen.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRIGGER_EVENTS.map((trigger) => (
                  <div key={trigger.id} className="p-5 rounded-xl border border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/20 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl shrink-0 mt-0.5">{trigger.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-[14px] font-bold text-slate-900">{trigger.label}</h4>
                        <p className="text-[12px] text-slate-400 font-medium mt-1">{trigger.desc}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => {
                              toast.info(`To activate "${trigger.label}", configure the trigger in the database (message_triggers table) and connect it to a template.`);
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" /> Set Email
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={() => {
                              toast.info(`To activate SMS for "${trigger.label}", configure in the message_triggers table with channel = "sms".`);
                            }}
                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" /> Set SMS
                          </button>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer group-hover:bg-slate-300 transition-colors">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[13px] font-bold text-amber-800">How Triggers Work</h4>
                    <p className="text-[12px] text-amber-700 font-medium mt-1 leading-relaxed">
                      Triggers fire automatically when events occur in the system. Each trigger can be linked to an email or SMS template. 
                      You can set a delay (e.g. send 1 hour after the event) and add conditions (e.g. only for tier 20 students).
                      Configure triggers in the <code className="bg-amber-100 px-1.5 py-0.5 rounded text-[11px] font-bold">message_triggers</code> table.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

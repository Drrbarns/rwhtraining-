import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Send, Users, Zap, Clock } from "lucide-react";
import { MarketingClient } from "./MarketingClient";

export const revalidate = 0;

async function getMarketingData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) return null;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [appsRes, enrollmentsRes, campaignsRes] = await Promise.all([
        supabase.from("applications").select("*").order("created_at", { ascending: false }),
        supabase.from("enrollments").select("*, applications(*)"),
        supabase.from("campaigns").select("*").order("created_at", { ascending: false }).limit(20),
    ]);

    const allApps = appsRes.data || [];
    const enrollments = enrollmentsRes.data || [];
    const campaigns = campaignsRes.data || [];

    const paidApps = allApps.filter((a: any) => a.payment_status === "PAID" && !a.is_unfinished);
    const completedApps = allApps.filter((a: any) => !a.is_unfinished);
    const drafts = allApps.filter((a: any) => a.is_unfinished && (a.email || a.phone));
    const partialPayers = enrollments.filter((e: any) => Number(e.balance_due || 0) > 0);
    const fullPayers = enrollments.filter((e: any) => Number(e.balance_due || 0) === 0);

    const cities = [...new Set(completedApps.map((a: any) => a.city).filter(Boolean))] as string[];
    const tiers = ["20", "50", "100"];

    const totalEmailsSent = campaigns.filter((c: any) => c.channel === "email").reduce((acc: number, c: any) => acc + (c.total_sent || 0), 0);
    const totalSmsSent = campaigns.filter((c: any) => c.channel === "sms").reduce((acc: number, c: any) => acc + (c.total_sent || 0), 0);

    const allContacts = allApps
        .filter((a: any) => a.email || a.phone)
        .map((a: any) => ({
            id: a.id,
            first_name: a.first_name || "Guest",
            last_name: a.last_name || "",
            email: a.email || "",
            phone: a.phone || "",
            city: a.city || "",
            tier: a.tier || "",
            status: (a.is_unfinished ? "draft" : a.payment_status === "PAID" ? "paid" : "applied") as "draft" | "paid" | "applied",
            amount_ghs: a.amount_ghs || 0,
        }));

    return {
        audiences: {
            all_paid: { count: paidApps.length, label: "All Paid Students" },
            all_applicants: { count: completedApps.length, label: "All Applicants" },
            abandoned_drafts: { count: drafts.length, label: "Abandoned Drafts (Retarget)" },
            partial_payers: { count: partialPayers.length, label: "Partial Payers (Outstanding Balance)" },
            full_payers: { count: fullPayers.length, label: "Full Payers" },
        },
        allContacts,
        cities,
        tiers,
        campaigns,
        stats: {
            totalEmailsSent,
            totalSmsSent,
            totalCampaigns: campaigns.length,
            totalAudienceSize: completedApps.length + drafts.length,
        }
    };
}

export default async function MarketingPage() {
    const data = await getMarketingData();

    if (!data) return <div className="p-10 text-slate-900 font-bold">Error loading marketing data.</div>;

    const statCards = [
        { title: "Emails Sent", value: data.stats.totalEmailsSent.toString(), icon: Mail, color: "blue" },
        { title: "SMS Sent", value: data.stats.totalSmsSent.toString(), icon: MessageSquare, color: "emerald" },
        { title: "Campaigns", value: data.stats.totalCampaigns.toString(), icon: Send, color: "purple" },
        { title: "Total Audience", value: data.stats.totalAudienceSize.toString(), icon: Users, color: "amber" },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Marketing Hub</span>
                    </div>
                    <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-none">Marketing & Outreach</h1>
                    <p className="text-slate-500 text-[15px] font-medium max-w-lg">Send targeted emails and SMS campaigns. Retarget leads, remind partial payers, and keep your cohort engaged.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <Card key={i} className="bg-white border-slate-200/60 rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                                <div className={`p-2 rounded-xl bg-${stat.color}-50 border border-${stat.color}-100/50`}>
                                    <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                                </div>
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <MarketingClient
                audiences={data.audiences}
                allContacts={data.allContacts}
                cities={data.cities}
                tiers={data.tiers}
                campaigns={data.campaigns}
            />
        </div>
    );
}

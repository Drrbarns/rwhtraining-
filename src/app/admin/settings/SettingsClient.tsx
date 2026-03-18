"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Shield, ShieldOff, UserPlus, Edit3, Check, CalendarDays, Hash, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import {
    updateCohortAction,
    createCohortAction,
    setActiveCohortAction,
    promoteToAdminAction,
    demoteFromAdminAction,
    manualEnrollStudentAction,
} from "@/app/actions/admin-control";

type Cohort = { id: string; name: string; start_date: string; capacity: number; is_active: boolean };
type Admin = { id: string; full_name?: string; role: string };

export function SettingsClient({ cohorts, admins, activeCohort }: { cohorts: Cohort[]; admins: Admin[]; activeCohort: Cohort | null }) {
    return (
        <div className="space-y-6">
            <CohortManager cohorts={cohorts} activeCohort={activeCohort} />
            <AdminManager admins={admins} />
            <WalkInEnrollment />
        </div>
    );
}

function CohortManager({ cohorts, activeCohort }: { cohorts: Cohort[]; activeCohort: Cohort | null }) {
    const router = useRouter();
    const [editing, setEditing] = useState<string | null>(null);
    const [editFields, setEditFields] = useState<{ name: string; start_date: string; capacity: string }>({ name: "", start_date: "", capacity: "" });
    const [saving, setSaving] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newCap, setNewCap] = useState("10");
    const [showCreate, setShowCreate] = useState(false);

    async function handleSave(cohortId: string) {
        setSaving(true);
        const res = await updateCohortAction(cohortId, {
            name: editFields.name || undefined,
            start_date: editFields.start_date || undefined,
            capacity: editFields.capacity ? Number(editFields.capacity) : undefined,
        });
        setSaving(false);
        if (res.success) { toast.success("Cohort updated"); setEditing(null); router.refresh(); }
        else toast.error(res.error);
    }

    async function handleCreate() {
        if (!newName.trim() || !newDate) { toast.error("Name and date are required"); return; }
        setCreating(true);
        const res = await createCohortAction({ name: newName.trim(), start_date: newDate, capacity: Number(newCap) || 10 });
        setCreating(false);
        if (res.success) { toast.success("Cohort created"); setShowCreate(false); setNewName(""); setNewDate(""); setNewCap("10"); router.refresh(); }
        else toast.error(res.error);
    }

    async function handleActivate(id: string) {
        if (!confirm("Set this cohort as the active one? All other cohorts will be deactivated.")) return;
        const res = await setActiveCohortAction(id);
        if (res.success) { toast.success("Active cohort updated"); router.refresh(); }
        else toast.error(res.error);
    }

    return (
        <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <CardHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><CalendarDays className="w-4 h-4" /></div>
                        All Cohorts
                    </CardTitle>
                    <CardDescription className="text-[13px] text-slate-500 font-medium">Edit capacity, dates, or set the active cohort</CardDescription>
                </div>
                <Button size="sm" className="rounded-xl text-[12px] font-bold h-9 gap-1.5" onClick={() => setShowCreate(!showCreate)}>
                    <Plus className="w-3.5 h-3.5" /> New Cohort
                </Button>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3">
                {showCreate && (
                    <div className="p-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 space-y-3">
                        <p className="text-[12px] font-bold text-blue-700 uppercase tracking-wider">Create new cohort</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">Name</Label>
                                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Q3 2026 Cohort" className="mt-1 h-9 text-[13px]" />
                            </div>
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">Start date</Label>
                                <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="mt-1 h-9 text-[13px]" />
                            </div>
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">Capacity</Label>
                                <Input type="number" min={1} value={newCap} onChange={(e) => setNewCap(e.target.value)} className="mt-1 h-9 text-[13px]" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleCreate} disabled={creating} className="rounded-xl text-[12px] font-bold h-8">
                                {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Create"}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setShowCreate(false)} className="rounded-xl text-[12px] font-bold h-8">Cancel</Button>
                        </div>
                    </div>
                )}
                {cohorts.length === 0 && <p className="text-slate-400 text-[13px] font-medium text-center py-6">No cohorts yet. Create your first one.</p>}
                {cohorts.map((c) => (
                    <div key={c.id} className={`p-4 rounded-xl border ${c.is_active ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200/60"} transition-colors`}>
                        {editing === c.id ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-500">Name</Label>
                                        <Input value={editFields.name} onChange={(e) => setEditFields({ ...editFields, name: e.target.value })} className="mt-1 h-9 text-[13px]" />
                                    </div>
                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-500">Start date</Label>
                                        <Input type="date" value={editFields.start_date} onChange={(e) => setEditFields({ ...editFields, start_date: e.target.value })} className="mt-1 h-9 text-[13px]" />
                                    </div>
                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-500">Capacity</Label>
                                        <Input type="number" min={1} value={editFields.capacity} onChange={(e) => setEditFields({ ...editFields, capacity: e.target.value })} className="mt-1 h-9 text-[13px]" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleSave(c.id)} disabled={saving} className="rounded-xl text-[12px] font-bold h-8 gap-1">
                                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="rounded-xl text-[12px] font-bold h-8">Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[14px] font-bold text-slate-900">{c.name}</p>
                                        {c.is_active && (
                                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-widest">Active</span>
                                        )}
                                    </div>
                                    <p className="text-[12px] text-slate-500 font-medium">
                                        {new Date(c.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                        {" · "}{c.capacity} seats
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!c.is_active && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleActivate(c.id)}
                                            className="rounded-xl text-[11px] font-bold h-8 gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                        >
                                            <ToggleRight className="w-3.5 h-3.5" /> Set Active
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setEditing(c.id);
                                            setEditFields({
                                                name: c.name,
                                                start_date: c.start_date?.split("T")[0] || "",
                                                capacity: String(c.capacity),
                                            });
                                        }}
                                        className="rounded-xl text-[11px] font-bold h-8 gap-1"
                                    >
                                        <Edit3 className="w-3 h-3" /> Edit
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function AdminManager({ admins }: { admins: Admin[] }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [promoting, setPromoting] = useState(false);
    const [demotingId, setDemotingId] = useState<string | null>(null);

    async function handlePromote() {
        if (!email.trim()) { toast.error("Enter an email"); return; }
        setPromoting(true);
        const res = await promoteToAdminAction(email.trim());
        setPromoting(false);
        if (res.success) { toast.success(`${email} promoted to Admin`); setEmail(""); router.refresh(); }
        else toast.error(res.error);
    }

    async function handleDemote(id: string, name: string) {
        if (!confirm(`Remove admin privileges from ${name}?`)) return;
        setDemotingId(id);
        const res = await demoteFromAdminAction(id);
        setDemotingId(null);
        if (res.success) { toast.success("Admin privileges removed"); router.refresh(); }
        else toast.error(res.error);
    }

    return (
        <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600"><Shield className="w-4 h-4" /></div>
                    Admin Users
                </CardTitle>
                <CardDescription className="text-[13px] text-slate-500 font-medium">Manage who can access the admin panel</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
                <div className="flex gap-2">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@email.com"
                        className="h-10 text-[13px] flex-1"
                    />
                    <Button onClick={handlePromote} disabled={promoting} className="rounded-xl text-[12px] font-bold h-10 gap-1.5 bg-purple-600 hover:bg-purple-700">
                        {promoting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                        Promote
                    </Button>
                </div>
                <div className="space-y-2">
                    {admins.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-3.5 border border-slate-200/60 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-200/60 flex items-center justify-center font-bold text-[11px] text-purple-700">
                                    {a.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "A"}
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-slate-900">{a.full_name || "Admin"}</p>
                                    <p className="text-[11px] text-slate-400 font-medium">ID: {a.id.slice(0, 8)}...</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                                    a.role === "SUPER_ADMIN" ? "bg-red-50 text-red-700 border-red-200/60" : "bg-blue-50 text-blue-700 border-blue-200/60"
                                }`}>
                                    {a.role}
                                </span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDemote(a.id, a.full_name || "Admin")}
                                    disabled={demotingId === a.id}
                                    className="rounded-xl text-[11px] font-bold h-7 text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                                >
                                    {demotingId === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldOff className="w-3 h-3" />}
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function WalkInEnrollment() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", city: "", tier: "50", amount_ghs: "500" });

    const tierAmounts: Record<string, string> = { "20": "200", "50": "500", "100": "1000" };

    function updateField(field: string, value: string) {
        const next = { ...form, [field]: value };
        if (field === "tier" && tierAmounts[value]) next.amount_ghs = tierAmounts[value];
        setForm(next);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
            toast.error("First name, last name, and email are required");
            return;
        }
        setSubmitting(true);
        const res = await manualEnrollStudentAction({
            ...form,
            amount_ghs: Number(form.amount_ghs) || 0,
        });
        setSubmitting(false);
        if (res.success) {
            toast.success("Student enrolled! Credentials sent.");
            setForm({ first_name: "", last_name: "", email: "", phone: "", city: "", tier: "50", amount_ghs: "500" });
            setOpen(false);
            router.refresh();
        } else {
            toast.error(res.error);
        }
    }

    return (
        <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600"><UserPlus className="w-4 h-4" /></div>
                        Walk-in Enrollment
                    </CardTitle>
                    <CardDescription className="text-[13px] text-slate-500 font-medium">Manually enroll a student who didn&apos;t apply online (e.g. paid cash)</CardDescription>
                </div>
                <Button size="sm" onClick={() => setOpen(!open)} className="rounded-xl text-[12px] font-bold h-9 gap-1.5 bg-amber-600 hover:bg-amber-700">
                    <UserPlus className="w-3.5 h-3.5" /> {open ? "Close" : "Enroll Student"}
                </Button>
            </CardHeader>
            {open && (
                <CardContent className="px-6 pb-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">First name *</Label>
                                <Input value={form.first_name} onChange={(e) => updateField("first_name", e.target.value)} className="mt-1 h-9 text-[13px]" />
                            </div>
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">Last name *</Label>
                                <Input value={form.last_name} onChange={(e) => updateField("last_name", e.target.value)} className="mt-1 h-9 text-[13px]" />
                            </div>
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">Email *</Label>
                                <Input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="mt-1 h-9 text-[13px]" />
                            </div>
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">Phone</Label>
                                <Input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="0XX XXX XXXX" className="mt-1 h-9 text-[13px]" />
                            </div>
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">City</Label>
                                <Input value={form.city} onChange={(e) => updateField("city", e.target.value)} className="mt-1 h-9 text-[13px]" />
                            </div>
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">Payment tier</Label>
                                <select
                                    value={form.tier}
                                    onChange={(e) => updateField("tier", e.target.value)}
                                    className="flex h-9 w-full mt-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="20">20% — GHS 200</option>
                                    <option value="50">50% — GHS 500</option>
                                    <option value="100">100% — GHS 1,000</option>
                                </select>
                            </div>
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-500">Amount paid (GHS)</Label>
                                <Input type="number" min={0} max={1000} value={form.amount_ghs} onChange={(e) => updateField("amount_ghs", e.target.value)} className="mt-1 h-9 text-[13px]" />
                            </div>
                        </div>
                        <Button type="submit" disabled={submitting} className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 gap-1.5">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            Enroll &amp; Send Credentials
                        </Button>
                    </form>
                </CardContent>
            )}
        </Card>
    );
}

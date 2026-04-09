"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    GraduationCap, Phone, MapPin, Clock, Loader2, Edit3, Check, X, KeyRound,
    ToggleLeft, ToggleRight, Banknote, Copy, Mail, User, CreditCard, Calendar,
    LogIn, Briefcase, BookOpen, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
    updateEnrollmentFinancialsAction,
    setEnrollmentActiveAction,
    adminGeneratePasswordResetLinkAction,
} from "@/app/actions/admin-control";

type Enrollment = {
    id: string;
    user_id: string;
    is_active: boolean;
    total_paid: number;
    balance_due: number;
    created_at: string;
    applications: {
        id?: string;
        email?: string;
        phone?: string;
        city?: string;
        first_name?: string;
        last_name?: string;
        tier?: string;
        amount_ghs?: number;
        occupation?: string;
        experience?: string;
        reason?: string;
        payment_status?: string;
        created_at?: string;
    } | null;
};

type Student = {
    id: string;
    full_name: string;
    phone?: string;
    city?: string;
    created_at: string;
};

type Payment = {
    id: string;
    reference: string;
    email: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    amount_ghs: number;
    gateway?: string;
    network?: string;
    status: string;
    payment_type?: string;
    paid_at?: string;
    created_at: string;
};

export function StudentsTable({
    students,
    enrollments,
    payments,
    lastSignInMap,
}: {
    students: Student[];
    enrollments: Enrollment[];
    payments: Payment[];
    lastSignInMap: Record<string, string | null>;
}) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selected = students.find((s) => s.id === selectedId);
    const selectedEnrollment = enrollments.find((e) => e.user_id === selectedId);

    return (
        <>
            <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
                <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-600 text-white"><GraduationCap className="w-4 h-4" /></div>
                        Student Roster
                        <span className="text-[12px] font-bold text-slate-400 ml-2">({students.length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {students.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/30">
                                        <th className="text-left px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Student</th>
                                        <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Contact</th>
                                        <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Location</th>
                                        <th className="text-right px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Paid</th>
                                        <th className="text-right px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Balance</th>
                                        <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="text-right px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Last Login</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/80">
                                    {students.map((student, i) => {
                                        const enrollment = enrollments.find((e) => e.user_id === student.id);
                                        const app = enrollment?.applications;
                                        const balance = Number(enrollment?.balance_due || 0);
                                        const paid = Number(enrollment?.total_paid || 0);
                                        const active = enrollment?.is_active !== false;
                                        const lastLogin = lastSignInMap[student.id];

                                        return (
                                            <tr
                                                key={i}
                                                onClick={() => setSelectedId(student.id)}
                                                className={`hover:bg-blue-50/30 transition-colors group cursor-pointer ${!active ? "opacity-50" : ""}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl border border-slate-200/60 flex items-center justify-center font-extrabold text-[13px] bg-slate-50 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                                                            {student.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "?"}
                                                        </div>
                                                        <div>
                                                            <p className="text-[14px] font-bold text-slate-900">{student.full_name}</p>
                                                            <p className="text-[11px] text-slate-400 font-medium">{app?.email || "No email"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                                                        <Phone className="w-3 h-3 text-slate-400" />
                                                        {student.phone || app?.phone || "—"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                                                        <MapPin className="w-3 h-3 text-slate-400" />
                                                        {student.city || app?.city || "—"}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right text-[14px] font-extrabold text-emerald-600">
                                                    GHS {paid.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4 text-right text-[14px] font-bold">
                                                    <span className={balance > 0 ? "text-amber-600" : "text-emerald-600"}>
                                                        {balance > 0 ? `GHS ${balance.toLocaleString()}` : "Fully Paid"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {!active ? (
                                                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 border border-slate-200/60 uppercase tracking-widest">Inactive</span>
                                                    ) : balance > 0 ? (
                                                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 uppercase tracking-widest">
                                                            Partially paid
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-widest">Fully paid</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {lastLogin ? (
                                                            <span className="text-[11px] text-slate-400 font-medium">
                                                                {new Date(lastLogin).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-300 font-medium italic">Never</span>
                                                        )}
                                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-blue-100 blur-2xl rounded-full opacity-50" />
                                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
                                    <GraduationCap className="w-10 h-10 text-slate-300" />
                                </div>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">No Students Yet</h3>
                            <p className="text-slate-500 max-w-sm font-medium leading-relaxed text-center">When applicants complete payment, they&apos;ll be automatically onboarded and appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {selected && selectedEnrollment && (
                <StudentProfileModal
                    student={selected}
                    enrollment={selectedEnrollment}
                    payments={payments}
                    lastLogin={lastSignInMap[selected.id] || null}
                    onClose={() => setSelectedId(null)}
                />
            )}
        </>
    );
}

function StudentProfileModal({
    student,
    enrollment,
    payments,
    lastLogin,
    onClose,
}: {
    student: Student;
    enrollment: Enrollment;
    payments: Payment[];
    lastLogin: string | null;
    onClose: () => void;
}) {
    const router = useRouter();
    const app = enrollment.applications;
    const email = app?.email || "";

    const studentPayments = payments.filter(
        (p) => p.email?.toLowerCase() === email.toLowerCase()
    );

    const [tab, setTab] = useState<"profile" | "payments" | "manage">("profile");
    const [totalPaid, setTotalPaid] = useState(String(enrollment.total_paid ?? 0));
    const [balanceDue, setBalanceDue] = useState(String(enrollment.balance_due ?? 0));
    const [saving, setSaving] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetLink, setResetLink] = useState<string | null>(null);

    async function handleSaveFinancials() {
        setSaving(true);
        const res = await updateEnrollmentFinancialsAction(enrollment.id, Number(totalPaid), Number(balanceDue));
        setSaving(false);
        if (res.success) { toast.success("Enrollment financials updated"); router.refresh(); }
        else toast.error(res.error);
    }

    async function handleToggleActive() {
        const next = !enrollment.is_active;
        if (!confirm(next ? "Reactivate this enrollment?" : "Deactivate this enrollment? The student will lose access.")) return;
        setToggling(true);
        const res = await setEnrollmentActiveAction(enrollment.id, next);
        setToggling(false);
        if (res.success) { toast.success(next ? "Enrollment reactivated" : "Enrollment deactivated"); router.refresh(); onClose(); }
        else toast.error(res.error);
    }

    async function handlePasswordReset() {
        if (!email) { toast.error("No email on file"); return; }
        setResetLoading(true);
        const res = await adminGeneratePasswordResetLinkAction(email);
        setResetLoading(false);
        if (res.success && res.action_link) {
            setResetLink(res.action_link);
            toast.success("Password reset link generated");
        } else toast.error(res.error || "Failed");
    }

    const balance = Number(enrollment.balance_due ?? 0);
    const paid = Number(enrollment.total_paid ?? 0);

    const statusColor = (s: string) => {
        if (s === "PAID" || s === "SUCCESS") return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
        if (s === "REVERSED") return "bg-slate-100 text-slate-500 border-slate-200/60";
        return "bg-amber-50 text-amber-700 border-amber-200/60";
    };

    const tabs = [
        { id: "profile" as const, label: "Profile" },
        { id: "payments" as const, label: `Payments (${studentPayments.length})` },
        { id: "manage" as const, label: "Manage" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/60 animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex-shrink-0 p-6 border-b border-slate-100 bg-white">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                                {student.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{student.full_name}</h2>
                                <p className="text-[13px] text-slate-400 font-medium">{email}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-widest ${
                                        balance > 0
                                            ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                    }`}>
                                        {balance > 0 ? `GHS ${balance} due` : "Fully paid"}
                                    </span>
                                    {!enrollment.is_active && (
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200/60 uppercase tracking-widest">Inactive</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-9 w-9 shrink-0">
                            <X className="w-5 h-5 text-slate-400" />
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-5 bg-slate-100 rounded-xl p-1">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex-1 px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${
                                    tab === t.id
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {tab === "profile" && (
                        <>
                            {/* Quick stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100/60 text-center">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Paid</p>
                                    <p className="text-lg font-extrabold text-emerald-700">GHS {paid.toLocaleString()}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/60 text-center">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Balance</p>
                                    <p className="text-lg font-extrabold text-amber-700">GHS {balance.toLocaleString()}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100/60 text-center">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Last Login</p>
                                    <p className="text-[13px] font-extrabold text-blue-700">
                                        {lastLogin
                                            ? new Date(lastLogin).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                                            : "Never"}
                                    </p>
                                </div>
                            </div>

                            {/* Contact info */}
                            <Card className="border-slate-200/60 rounded-xl overflow-hidden">
                                <CardHeader className="px-5 pt-4 pb-3">
                                    <CardTitle className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-3.5 h-3.5" /> Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-5 pb-5 space-y-3">
                                    <InfoRow icon={Mail} label="Email" value={email} />
                                    <InfoRow icon={Phone} label="Phone" value={student.phone || app?.phone} />
                                    <InfoRow icon={MapPin} label="City" value={student.city || app?.city} />
                                    <InfoRow icon={Briefcase} label="Occupation" value={app?.occupation} />
                                    <InfoRow icon={BookOpen} label="Experience" value={app?.experience} />
                                    <InfoRow icon={CreditCard} label="Payment Tier" value={app?.tier ? `${app.tier}%` : undefined} />
                                    <InfoRow icon={Calendar} label="Enrolled" value={enrollment.created_at ? new Date(enrollment.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : undefined} />
                                    <InfoRow
                                        icon={LogIn}
                                        label="Last Portal Login"
                                        value={
                                            lastLogin
                                                ? new Date(lastLogin).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
                                                : "Never logged in"
                                        }
                                    />
                                </CardContent>
                            </Card>

                            {/* Motivation */}
                            {app?.reason && (
                                <Card className="border-slate-200/60 rounded-xl overflow-hidden">
                                    <CardHeader className="px-5 pt-4 pb-3">
                                        <CardTitle className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest">Why they want to join</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-5 pb-5">
                                        <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">{app.reason}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {tab === "payments" && (
                        <div className="space-y-3">
                            {studentPayments.length > 0 ? studentPayments.map((p) => (
                                <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            p.status === "REVERSED" ? "bg-slate-100" : "bg-emerald-50"
                                        }`}>
                                            <CreditCard className={`w-4 h-4 ${p.status === "REVERSED" ? "text-slate-400" : "text-emerald-600"}`} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-900">
                                                GHS {Number(p.amount_ghs).toLocaleString()}
                                                {p.status === "REVERSED" && <span className="text-slate-400 ml-1">(voided)</span>}
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-medium">
                                                {p.gateway || "moolre"} · {p.network || "—"} · {p.payment_type || "initial"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-widest ${statusColor(p.status)}`}>
                                            {p.status}
                                        </span>
                                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                                            {p.paid_at
                                                ? new Date(p.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                                : new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-[13px] text-slate-400 font-medium">No payment records found</div>
                            )}

                            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-slate-500 font-medium">Total from payment records</span>
                                    <span className="font-extrabold text-slate-900">
                                        GHS {studentPayments
                                            .filter((p) => p.status !== "REVERSED")
                                            .reduce((s, p) => s + Number(p.amount_ghs || 0), 0)
                                            .toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[13px] mt-2">
                                    <span className="text-slate-500 font-medium">Enrollment shows paid</span>
                                    <span className="font-extrabold text-emerald-600">GHS {paid.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[13px] mt-2">
                                    <span className="text-slate-500 font-medium">Balance due</span>
                                    <span className={`font-extrabold ${balance > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                                        GHS {balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "manage" && (
                        <>
                            {/* Adjust balance */}
                            <Card className="border-slate-200/60 rounded-xl overflow-hidden">
                                <CardHeader className="px-5 pt-4 pb-3">
                                    <CardTitle className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Banknote className="w-3.5 h-3.5" /> Adjust Balance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-5 pb-5 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-[11px] font-semibold text-slate-500">Total Paid (GHS)</Label>
                                            <Input type="number" min={0} value={totalPaid} onChange={(e) => setTotalPaid(e.target.value)} className="mt-1 h-9 text-[13px]" />
                                        </div>
                                        <div>
                                            <Label className="text-[11px] font-semibold text-slate-500">Balance Due (GHS)</Label>
                                            <Input type="number" min={0} value={balanceDue} onChange={(e) => setBalanceDue(e.target.value)} className="mt-1 h-9 text-[13px]" />
                                        </div>
                                    </div>
                                    <Button size="sm" onClick={handleSaveFinancials} disabled={saving} className="rounded-xl text-[12px] font-bold h-8 gap-1">
                                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Active toggle */}
                            <Card className="border-slate-200/60 rounded-xl overflow-hidden">
                                <CardHeader className="px-5 pt-4 pb-3">
                                    <CardTitle className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        {enrollment.is_active ? <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                                        Enrollment Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-5 pb-5">
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/60">
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-900">{enrollment.is_active ? "Active" : "Inactive"}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{enrollment.is_active ? "Student has full access" : "Student access suspended"}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleToggleActive}
                                            disabled={toggling}
                                            className={`rounded-xl text-[11px] font-bold h-8 gap-1 ${enrollment.is_active ? "border-red-200 text-red-700 hover:bg-red-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
                                        >
                                            {toggling ? <Loader2 className="w-3 h-3 animate-spin" /> : enrollment.is_active ? <ToggleLeft className="w-3 h-3" /> : <ToggleRight className="w-3 h-3" />}
                                            {enrollment.is_active ? "Deactivate" : "Reactivate"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Password reset */}
                            <Card className="border-slate-200/60 rounded-xl overflow-hidden">
                                <CardHeader className="px-5 pt-4 pb-3">
                                    <CardTitle className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <KeyRound className="w-3.5 h-3.5" /> Password Reset
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-5 pb-5 space-y-3">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handlePasswordReset}
                                        disabled={resetLoading || !email}
                                        className="rounded-xl text-[12px] font-bold h-8 gap-1"
                                    >
                                        {resetLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <KeyRound className="w-3 h-3" />}
                                        Generate Reset Link
                                    </Button>
                                    {resetLink && (
                                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/60 space-y-2">
                                            <p className="text-[11px] font-bold text-blue-700">Send this link to the student:</p>
                                            <code className="text-[10px] text-blue-600 bg-white px-2 py-1 rounded block break-all">{resetLink}</code>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => { navigator.clipboard.writeText(resetLink); toast.success("Copied"); }}
                                                className="rounded-xl text-[11px] font-bold h-7 gap-1 text-blue-600"
                                            >
                                                <Copy className="w-3 h-3" /> Copy Link
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-slate-100/80 last:border-0">
            <Icon className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">{label}</span>
                <span className="text-[13px] font-bold text-slate-900 text-right">{value}</span>
            </div>
        </div>
    );
}

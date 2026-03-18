"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Phone, MapPin, Clock, Loader2, Edit3, Check, X, KeyRound, ToggleLeft, ToggleRight, Banknote, Copy } from "lucide-react";
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
    applications: {
        email?: string;
        phone?: string;
        city?: string;
        first_name?: string;
        last_name?: string;
    } | null;
};

type Student = {
    id: string;
    full_name: string;
    phone?: string;
    city?: string;
    created_at: string;
};

export function StudentsTable({ students, enrollments }: { students: Student[]; enrollments: Enrollment[] }) {
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
                                        <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/80">
                                    {students.map((student, i) => {
                                        const enrollment = enrollments.find((e: any) => e.user_id === student.id);
                                        const app = enrollment?.applications;
                                        const balance = Number(enrollment?.balance_due || 0);
                                        const paid = Number(enrollment?.total_paid || 0);
                                        const active = enrollment?.is_active !== false;

                                        return (
                                            <tr key={i} className={`hover:bg-blue-50/30 transition-colors group ${!active ? "opacity-50" : ""}`}>
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
                                                            Partial — GHS {balance.toLocaleString()} due
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-widest">Fully paid</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setSelectedId(student.id)}
                                                        className="rounded-xl h-7 text-[11px] font-bold text-blue-600 hover:bg-blue-50 gap-1"
                                                    >
                                                        <Edit3 className="w-3 h-3" /> Manage
                                                    </Button>
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
                <StudentManageModal
                    student={selected}
                    enrollment={selectedEnrollment}
                    onClose={() => setSelectedId(null)}
                />
            )}
        </>
    );
}

function StudentManageModal({ student, enrollment, onClose }: { student: Student; enrollment: Enrollment; onClose: () => void }) {
    const router = useRouter();
    const app = enrollment.applications;
    const email = app?.email || "";
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/60 animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900">{student.full_name}</h2>
                        <p className="text-[12px] text-slate-400 font-medium">{email || "No email"}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-9 w-9">
                        <X className="w-5 h-5 text-slate-500" />
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Adjust balance */}
                    <section className="space-y-3">
                        <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Banknote className="w-3.5 h-3.5" /> Adjust Balance
                        </h3>
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
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save Financials
                        </Button>
                    </section>

                    {/* Active toggle */}
                    <section className="space-y-3">
                        <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            {enrollment.is_active ? <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> : <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />}
                            Enrollment Status
                        </h3>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/60">
                            <div>
                                <p className="text-[13px] font-bold text-slate-900">
                                    {enrollment.is_active ? "Active" : "Inactive"}
                                </p>
                                <p className="text-[11px] text-slate-400 font-medium">
                                    {enrollment.is_active ? "Student has full access" : "Student access suspended"}
                                </p>
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
                    </section>

                    {/* Password reset */}
                    <section className="space-y-3">
                        <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <KeyRound className="w-3.5 h-3.5" /> Password Reset
                        </h3>
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
                                    onClick={() => { navigator.clipboard.writeText(resetLink); toast.success("Copied to clipboard"); }}
                                    className="rounded-xl text-[11px] font-bold h-7 gap-1 text-blue-600"
                                >
                                    <Copy className="w-3 h-3" /> Copy Link
                                </Button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

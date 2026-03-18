"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Enrollment = {
    id: string;
    total_paid: number;
    balance_due: number;
    applications: {
        first_name?: string;
        last_name?: string;
        email?: string;
    } | null;
};

export function RecordCashPayment({ enrollments }: { enrollments: Enrollment[] }) {
    const router = useRouter();
    const [enrollmentId, setEnrollmentId] = useState("");
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const options = enrollments.map((e) => ({
        id: e.id,
        label: `${e.applications?.first_name ?? ""} ${e.applications?.last_name ?? ""}`.trim() || "Unknown",
        email: e.applications?.email ?? "",
        balance: Number(e.balance_due ?? 0),
    }));

    const selected = options.find((o) => o.id === enrollmentId);
    const balanceDue = selected?.balance ?? 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const num = Number(amount);
        if (!enrollmentId) {
            toast.error("Please select a student.");
            return;
        }
        if (!Number.isFinite(num) || num <= 0) {
            toast.error("Enter a valid amount (GHS).");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/record-cash-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({
                    enrollment_id: enrollmentId,
                    amount_ghs: num,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error ?? "Failed to record payment");
                return;
            }
            toast.success(`Recorded GHS ${num} cash payment. Balance due: GHS ${data.new_balance_due ?? 0}`);
            setAmount("");
            setEnrollmentId("");
            router.refresh();
        } catch {
            toast.error("Request failed");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card className="bg-white border-slate-200/60 rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-amber-50/50">
                <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-600 text-white">
                        <Banknote className="w-4 h-4" />
                    </div>
                    Record cash payment
                </CardTitle>
                <CardDescription className="text-[13px] text-slate-500">
                    Manually record a cash (or other offline) payment for a student. This updates their enrollment and adds a payment record.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="grid flex-1 w-full sm:max-w-xs gap-2">
                        <Label htmlFor="record-student" className="text-[12px] font-semibold text-slate-600">Student</Label>
                        <select
                            id="record-student"
                            value={enrollmentId}
                            onChange={(e) => setEnrollmentId(e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                        >
                            <option value="">Select student…</option>
                            {options.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.label} {o.email ? `(${o.email})` : ""} — GHS {o.balance} due
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid w-full sm:w-32 gap-2">
                        <Label htmlFor="record-amount" className="text-[12px] font-semibold text-slate-600">Amount (GHS)</Label>
                        <Input
                            id="record-amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="font-medium"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={submitting || !enrollmentId || !amount}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Record payment"}
                    </Button>
                </form>
                {balanceDue > 0 && selected && (
                    <p className="text-[12px] text-slate-500 mt-3">
                        Balance due for this student: <strong>GHS {balanceDue}</strong>
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

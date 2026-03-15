import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Banknote, Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { PaymentsClient } from "./PaymentsClient";

export const revalidate = 0;

async function getPaymentsData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) return null;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [paymentsRes, enrollmentsRes] = await Promise.all([
        supabase.from("payments").select("*").order("created_at", { ascending: false }),
        supabase.from("enrollments").select("*, applications(*)")
    ]);

    const payments = paymentsRes.data || [];
    const enrollments = enrollmentsRes.data || [];

    const paid = payments.filter((p: any) => p.status === "PAID" || p.status === "SUCCESS");
    // Only count initial (not balance) PENDING payments — balance PENDING are abandoned button clicks
    const pending = payments.filter((p: any) => p.status === "PENDING" && (!p.payment_type || p.payment_type === "initial"));
    const failed = payments.filter((p: any) => p.status === "FAILED" || p.status === "CANCELLED");

    // Total Collected = what students have actually paid per enrollment records (source of truth)
    // This includes manually approved students who paid outside the gateway
    const realEnrollments = enrollments.filter((e: any) => e.applications?.email !== "teststudent@remoteworkhub.org");
    const totalCollected = realEnrollments.reduce((acc: number, e: any) => acc + Number(e.total_paid || 0), 0);
    const totalPending = pending.reduce((acc: number, p: any) => acc + Number(p.amount_ghs || 0), 0);
    const outstandingBalance = realEnrollments.reduce((acc: number, e: any) => acc + Number(e.balance_due || 0), 0);

    return {
        payments,
        stats: {
            totalCollected,
            totalPending,
            outstandingBalance,
            paidCount: realEnrollments.length,
            pendingCount: pending.length,
            failedCount: failed.length,
            totalTransactions: payments.length,
        }
    };
}

export default async function PaymentsPage() {
    const data = await getPaymentsData();

    if (!data) {
        return <div className="p-10 text-slate-900 font-bold">Error loading payments data.</div>;
    }

    const statCards = [
        { title: "Total Collected", value: `GHS ${data.stats.totalCollected.toLocaleString()}`, desc: `${data.stats.paidCount} enrolled students`, icon: Banknote, color: "emerald" },
        { title: "Pending", value: `GHS ${data.stats.totalPending.toLocaleString()}`, desc: `${data.stats.pendingCount} awaiting confirmation`, icon: Clock, color: "amber" },
        { title: "Outstanding Balance", value: `GHS ${data.stats.outstandingBalance.toLocaleString()}`, desc: "From partial-payment students", icon: AlertTriangle, color: "orange" },
        { title: "Failed", value: data.stats.failedCount.toString(), desc: "Failed or cancelled", icon: XCircle, color: "red" },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-none">Finance & Payments</h1>
                    <p className="text-slate-500 text-[15px] font-medium">Complete transaction ledger across all payment gateways.</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <Card key={i} className="bg-white border-slate-200/60 rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                                <div className={`p-2 rounded-xl bg-${stat.color}-50 border border-${stat.color}-100/50`}>
                                    <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                                </div>
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
                            <p className="text-[11px] font-medium mt-2 text-slate-400">{stat.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Payments Table */}
            <PaymentsClient payments={data.payments} />
        </div>
    );
}

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Search, Download, RefreshCw, Loader2, Filter, ChevronLeft, ChevronRight, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { voidManualPaymentAction } from "@/app/actions/admin-control";

type Payment = {
    id: string;
    reference: string;
    email: string;
    phone: string;
    first_name?: string;
    last_name?: string;
    network: string;
    amount_ghs: number;
    tier: string;
    status: string;
    gateway?: string;
    paid_at?: string;
    created_at: string;
};

const PAGE_SIZE = 15;

export function PaymentsClient({ payments }: { payments: Payment[] }) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [gatewayFilter, setGatewayFilter] = useState<string>("ALL");
    const [page, setPage] = useState(1);
    const [reconciling, setReconciling] = useState(false);
    const [voidingId, setVoidingId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return payments.filter((p) => {
            const matchesSearch = !search || [p.email, p.phone, p.reference, p.first_name, p.last_name]
                .some(f => f?.toLowerCase().includes(search.toLowerCase()));
            const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
            const matchesGateway = gatewayFilter === "ALL" || p.gateway === gatewayFilter;
            return matchesSearch && matchesStatus && matchesGateway;
        });
    }, [payments, search, statusFilter, gatewayFilter]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleReconcile = async () => {
        setReconciling(true);
        try {
            const [moolreRes, paystackRes] = await Promise.all([
                fetch("/api/admin/reconcile-moolre-payments", { method: "POST", credentials: "same-origin" }),
                fetch("/api/admin/reconcile-paystack-payments", { method: "POST", credentials: "same-origin" }),
            ]);
            const moolreData = await moolreRes.json();
            const paystackData = await paystackRes.json();
            const moolreOk = moolreRes.ok;
            const paystackOk = paystackRes.ok;
            const updated = (moolreOk ? moolreData.updated ?? 0 : 0) + (paystackOk ? paystackData.updated ?? 0 : 0);
            if (moolreOk && paystackOk) {
                if (updated > 0) {
                    toast.success(`Reconciliation complete: ${updated} payment(s) marked as paid.`);
                    router.refresh();
                } else {
                    toast.success(moolreData.message && paystackData.message ? "No pending payments to reconcile." : "Reconciliation complete.");
                }
            } else {
                const moolreErr = !moolreOk ? moolreData.error : null;
                const paystackErr = !paystackOk ? paystackData.error : null;
                const err = [moolreErr, paystackErr].filter(Boolean).join("; ") || "Reconciliation failed";
                toast.error(err);
            }
        } catch {
            toast.error("Reconciliation request failed");
        } finally {
            setReconciling(false);
        }
    };

    const handleExport = () => {
        if (!filtered.length) {
            toast.warning("No payments to export");
            return;
        }
        const headers = ["Reference", "Name", "Email", "Phone", "Gateway", "Network", "Tier", "Amount (GHS)", "Status", "Date"];
        const rows = filtered.map(p => [
            p.reference,
            `${p.first_name || ""} ${p.last_name || ""}`.trim(),
            p.email, p.phone, p.gateway || "moolre", p.network, p.tier,
            p.amount_ghs, p.status,
            p.paid_at ? new Date(p.paid_at).toLocaleDateString() : new Date(p.created_at).toLocaleDateString()
        ]);
        const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Payment_Ledger_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        a.remove();
        toast.success(`Exported ${filtered.length} transactions`);
    };

    const handleVoid = async (id: string) => {
        if (!confirm("Void this manual/cash payment? The enrollment balance will be adjusted back.")) return;
        setVoidingId(id);
        const res = await voidManualPaymentAction(id);
        setVoidingId(null);
        if (res.success) { toast.success("Payment voided and balance adjusted"); router.refresh(); }
        else toast.error(res.error || "Failed");
    };

    const isVoidable = (p: Payment) =>
        (p.status === "PAID" || p.status === "SUCCESS") &&
        (p.gateway === "manual" || p.network === "CASH");

    const statusColor = (s: string) => {
        if (s === "PAID" || s === "SUCCESS") return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
        if (s === "PENDING") return "bg-amber-50 text-amber-700 border-amber-200/60";
        if (s === "REVERSED") return "bg-slate-100 text-slate-500 border-slate-200/60";
        return "bg-red-50 text-red-700 border-red-200/60";
    };

    return (
        <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><CreditCard className="w-4 h-4" /></div>
                        Transaction Ledger
                        <span className="text-[12px] font-bold text-slate-400 ml-2">({filtered.length})</span>
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleReconcile} disabled={reconciling} className="rounded-xl text-[12px] font-bold h-9 border-amber-200/80 bg-amber-50/80 text-amber-800 hover:bg-amber-100/80">
                            {reconciling ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
                            Reconcile
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExport} className="rounded-xl text-[12px] font-bold h-9">
                            <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by name, email, phone, or reference..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="pl-9 h-10 rounded-xl text-[13px] border-slate-200/60"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    {["ALL", "PAID", "PENDING", "FAILED"].map(s => (
                        <button
                            key={s}
                            onClick={() => { setStatusFilter(s === "PAID" ? "PAID" : s); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${
                                statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                    <span className="w-px h-6 bg-slate-200 mx-1" />
                    {["ALL", "moolre", "paystack", "manual"].map(g => (
                        <button
                            key={g}
                            onClick={() => { setGatewayFilter(g); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${
                                gatewayFilter === g ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                            {g === "ALL" ? "All Gateways" : g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30">
                                <th className="text-left px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Reference</th>
                                <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Gateway</th>
                                <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tier</th>
                                <th className="text-right px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="text-right px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                            {paginated.length > 0 ? paginated.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-900">{p.first_name || "—"} {p.last_name || ""}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{p.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <code className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{p.reference.slice(0, 20)}...</code>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-widest ${
                                            p.gateway === "paystack" ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60" :
                                            p.gateway === "manual" ? "bg-orange-50 text-orange-700 border border-orange-200/60" :
                                            "bg-amber-50 text-amber-700 border border-amber-200/60"
                                        }`}>
                                            {p.gateway || "moolre"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-[13px] font-bold text-slate-600">{p.tier}%</td>
                                    <td className="px-4 py-4 text-right text-[14px] font-extrabold text-slate-900">GHS {Number(p.amount_ghs).toLocaleString()}</td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${statusColor(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right text-[12px] font-medium text-slate-400">
                                        {p.paid_at ? new Date(p.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) :
                                         new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {isVoidable(p) && p.status !== "REVERSED" && (
                                            <button
                                                onClick={() => handleVoid(p.id)}
                                                disabled={voidingId === p.id}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                                                title="Void this manual payment"
                                            >
                                                {voidingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Undo2 className="w-3 h-3" />}
                                                Void
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-16 text-[13px] text-slate-400 font-medium">
                                        {search || statusFilter !== "ALL" || gatewayFilter !== "ALL"
                                            ? "No transactions match your filters"
                                            : "No transactions recorded yet"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                        <span className="text-[12px] font-medium text-slate-400">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg h-8 w-8 p-0">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-[12px] font-bold text-slate-600 px-2">{page} / {totalPages}</span>
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg h-8 w-8 p-0">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

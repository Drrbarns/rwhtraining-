"use client";

import { Card } from "@/components/ui/card";
import { CreditCard, Download, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PaymentsPage() {
    const [reconciling, setReconciling] = useState(false);
    const [reconcileResult, setReconcileResult] = useState<{ message?: string; updated?: number; processed?: number } | null>(null);

    const handleReconcile = async () => {
        setReconciling(true);
        setReconcileResult(null);
        try {
            const res = await fetch("/api/admin/reconcile-moolre-payments", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setReconcileResult(data);
            } else {
                setReconcileResult({ message: data.error || "Reconciliation failed" });
            }
        } catch {
            setReconcileResult({ message: "Request failed" });
        } finally {
            setReconciling(false);
        }
    };
    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-none">Finance & Payments</h1>
                    <p className="text-slate-500 text-[15px] font-medium">Detailed ledger of Moolre gateway transactions and invoices.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleReconcile}
                        disabled={reconciling}
                        className="border-amber-200/80 bg-amber-50/80 text-amber-800 hover:bg-amber-100/80 rounded-xl font-bold text-[13px] h-11 px-5"
                    >
                        {reconciling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Reconcile Moolre Payments
                    </Button>
                    <Button variant="outline" className="border-slate-200/60 bg-white text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] font-bold text-[13px] h-11 px-5">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200/60 bg-white min-h-[500px] flex flex-col items-center justify-center text-center p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] rounded-2xl">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-100 blur-2xl rounded-full opacity-50" />
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
                        <CreditCard className="w-10 h-10 text-slate-300" />
                    </div>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Ledger Offline</h3>
                <p className="text-slate-500 max-w-md font-medium leading-relaxed mb-4">Detailed transaction mapping is synchronizing. Active revenue insights are pinned to your Master Dashboard.</p>
                {reconcileResult && (
                    <p className={`text-sm font-medium max-w-md ${reconcileResult.updated ? "text-emerald-600" : "text-slate-600"}`}>
                        {reconcileResult.message}
                        {reconcileResult.updated !== undefined && reconcileResult.updated > 0 && " Students have been onboarded."}
                    </p>
                )}
            </Card>
        </div>
    );
}

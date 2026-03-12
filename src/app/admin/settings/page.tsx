import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Users, CreditCard, Globe, Shield, Database } from "lucide-react";
import { SettingsClient } from "./SettingsClient";

export const revalidate = 0;

async function getSettingsData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) return null;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [cohortsRes, adminsRes, configRes] = await Promise.all([
        supabase.from("cohorts").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").in("role", ["ADMIN", "SUPER_ADMIN"]),
        supabase.from("cohorts").select("*").eq("is_active", true).limit(1).single()
    ]);

    return {
        cohorts: cohortsRes.data || [],
        admins: adminsRes.data || [],
        activeCohort: configRes.data,
    };
}

export default async function SettingsPage() {
    const data = await getSettingsData();

    if (!data) {
        return <div className="p-10 text-slate-900 font-bold">Error loading settings.</div>;
    }

    const systemInfo = [
        { label: "Database", value: "Supabase PostgreSQL", icon: Database, status: "Connected" },
        { label: "Payment (MoMo)", value: "Moolre API", icon: CreditCard, status: process.env.MOOLRE_API_KEY ? "Active" : "Not Configured" },
        { label: "Payment (Card)", value: "Paystack API", icon: CreditCard, status: process.env.PAYSTACK_SECRET_KEY ? "Active" : "Not Configured" },
        { label: "Email Service", value: "Resend", icon: Globe, status: process.env.RESEND_API_KEY ? "Active" : "Not Configured" },
        { label: "Auth Provider", value: "Supabase Auth", icon: Shield, status: "Active" },
    ];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-none">System Settings</h1>
                    <p className="text-slate-500 text-[15px] font-medium">Cohort management, admin users, and platform configuration.</p>
                </div>
            </div>

            {/* Cohort Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                    <CardHeader className="px-6 pt-6 pb-4">
                        <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Users className="w-4 h-4" /></div>
                            Active Cohort
                        </CardTitle>
                        <CardDescription className="text-[13px] text-slate-500 font-medium">Currently active cohort configuration</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-4">
                        {data.activeCohort ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[13px] border-b border-slate-100 pb-3">
                                    <span className="text-slate-500 font-medium">Name</span>
                                    <span className="font-bold text-slate-900 text-right max-w-[60%]">{data.activeCohort.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px] border-b border-slate-100 pb-3">
                                    <span className="text-slate-500 font-medium">Start Date</span>
                                    <span className="font-bold text-slate-900">{new Date(data.activeCohort.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px] border-b border-slate-100 pb-3">
                                    <span className="text-slate-500 font-medium">Capacity</span>
                                    <span className="font-bold text-slate-900">{data.activeCohort.capacity} seats</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-slate-500 font-medium">Status</span>
                                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                                        data.activeCohort.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" : "bg-slate-100 text-slate-600 border-slate-200/60"
                                    }`}>
                                        {data.activeCohort.is_active ? "ACTIVE" : "INACTIVE"}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-[13px] font-medium text-center py-8">No active cohort found</p>
                        )}
                    </CardContent>
                </Card>

                {/* Admin Users */}
                <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <CardHeader className="px-6 pt-6 pb-4">
                        <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600"><Shield className="w-4 h-4" /></div>
                            Admin Users
                        </CardTitle>
                        <CardDescription className="text-[13px] text-slate-500 font-medium">Users with admin access</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-3">
                        {data.admins.length > 0 ? data.admins.map((admin: any) => (
                            <div key={admin.id} className="flex items-center justify-between p-4 border border-slate-200/60 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200/60 flex items-center justify-center font-bold text-[11px] text-purple-700">
                                        {admin.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "A"}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900">{admin.full_name || "Admin"}</p>
                                        <p className="text-[11px] text-slate-400 font-medium">ID: {admin.id.slice(0, 8)}...</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                                    admin.role === "SUPER_ADMIN" ? "bg-red-50 text-red-700 border-red-200/60" : "bg-blue-50 text-blue-700 border-blue-200/60"
                                }`}>
                                    {admin.role}
                                </span>
                            </div>
                        )) : (
                            <p className="text-slate-400 text-[13px] font-medium text-center py-8">No admin users found</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Pricing Configuration */}
            <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
                <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><CreditCard className="w-4 h-4" /></div>
                        Pricing Tiers
                    </CardTitle>
                    <CardDescription className="text-[13px] text-slate-500 font-medium">Current pricing configuration for the masterclass</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { tier: "20%", amount: "GHS 200", desc: "Deposit — secures seat", color: "blue" },
                            { tier: "50%", amount: "GHS 500", desc: "Half payment — popular", color: "purple" },
                            { tier: "100%", amount: "GHS 1,000", desc: "Full payment — all access", color: "emerald" },
                        ].map((t) => (
                            <div key={t.tier} className={`p-5 rounded-xl border border-${t.color}-200/60 bg-${t.color}-50/30`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.tier} Tier</span>
                                </div>
                                <div className={`text-2xl font-extrabold text-${t.color}-700 mb-1`}>{t.amount}</div>
                                <p className="text-[12px] text-slate-500 font-medium">{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
                <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-100"><Settings className="w-4 h-4 text-slate-600" /></div>
                        System Status
                    </CardTitle>
                    <CardDescription className="text-[13px] text-slate-500 font-medium">Connected services and integrations</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <div className="space-y-3">
                        {systemInfo.map((info) => (
                            <div key={info.label} className="flex items-center justify-between p-4 border border-slate-200/60 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-50">
                                        <info.icon className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900">{info.label}</p>
                                        <p className="text-[11px] text-slate-400 font-medium">{info.value}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                                    info.status === "Active" || info.status === "Connected"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                        : "bg-amber-50 text-amber-700 border-amber-200/60"
                                }`}>
                                    {info.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

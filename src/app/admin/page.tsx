import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertCircle, Banknote, ArrowUpRight, TrendingUp, UserPlus, GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@supabase/supabase-js";
import { ExportReportButton, OpenRegistrationsButton } from "./ClientButtons";
import { SendMessageToStudents } from "./components/SendMessageToStudents";

export const revalidate = 0; // Dynamic rendering

async function getAdminData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) return null;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [appsRes, enrollmentsRes, profilesRes] = await Promise.all([
        supabase.from("applications").select("*").order("created_at", { ascending: false }),
        supabase.from("enrollments").select("*, applications(*)"),
        supabase.from("profiles").select("*").eq("role", "STUDENT")
    ]);

    const applications = (appsRes.data || []).filter((a: any) => !a.is_unfinished);
    const unfinishedApps = (appsRes.data || []).filter((a: any) => a.is_unfinished);
    const enrollments = enrollmentsRes.data || [];
    const students = profilesRes.data || [];

    const totalRevenue = applications.filter((a: any) => a.payment_status === "PAID").reduce((acc: number, curr: any) => acc + Number(curr.amount_ghs || 0), 0);
    const pendingInvoices = applications.filter((a: any) => a.payment_status !== "PAID" && a.status === "APPROVED").reduce((acc: number, curr: any) => acc + Number(curr.amount_ghs || 0), 0);
    const filledSeats = enrollments.length;
    const totalWhoStarted = applications.length + unfinishedApps.length;

    return { applications, unfinishedApps, enrollments, students, totalRevenue, pendingInvoices, filledSeats, totalWhoStarted };
}

export default async function AdminDashboardPage() {
    const data = await getAdminData();

    if (!data) return <div className="p-10 text-slate-900 font-bold">Error: Supabase config missing.</div>;

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-1000">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                            Cohort 2026 Admin
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-none">Mission Control</h1>
                    <p className="text-slate-500 text-[15px] font-medium">Real-time statistics and student management for the Masterclass.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportReportButton applications={data.applications} />
                    <OpenRegistrationsButton />
                </div>
            </div>

            {/* Primary KPI Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                {[
                    { title: "Total Who Started", value: data.totalWhoStarted.toString(), desc: "All intents (completed + abandoned)", icon: Users, color: "text-blue-600", bg: "bg-blue-50/50", border: "border-blue-100/50" },
                    { title: "Completed Applications", value: data.applications.length.toString(), desc: "Fully submitted forms", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50/50", border: "border-indigo-100/50" },
                    { title: "Abandoned Drafts", value: data.unfinishedApps.length.toString(), desc: "Started but did not finish", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50/50", border: "border-red-100/50" },
                    { title: "Seats Confirmed", value: `${data.filledSeats} / 10`, desc: `${10 - data.filledSeats} seats remaining`, icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50/50", border: "border-amber-100/50" },
                    { title: "Total Revenue", value: `GHS ${data.totalRevenue.toLocaleString()}`, desc: "Collected deposits & full", icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50/50", border: "border-emerald-100/50" },
                ].map((kpi, idx) => (
                    <Card key={idx} className="bg-white border-slate-200/60 hover:border-slate-300/80 transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 rounded-2xl overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-5 pt-5">
                            <CardTitle className="text-[13px] font-bold text-slate-500">{kpi.title}</CardTitle>
                            <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.border} border transition-colors group-hover:bg-white`}>
                                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <div className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{kpi.value}</div>
                            <p className="text-[11px] font-semibold mt-3 text-slate-400 flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1.5 text-emerald-500" />
                                {kpi.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Stats & Activity */}
                <div className="col-span-1 border-slate-200 space-y-8">
                    {/* Seats Progress */}
                    <Card className="border-slate-200/60 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                        <CardHeader className="px-6 pt-6 pb-4">
                            <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                Cohort Capacity
                            </CardTitle>
                            <CardDescription className="text-slate-500 text-[13px] font-medium">Current fill rate based on cleared payments.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="flex justify-between text-[13px] font-bold text-slate-900 mb-3">
                                <span className="text-slate-400">0%</span>
                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{data.filledSeats * 10}% Filled</span>
                                <span className="text-slate-400">100%</span>
                            </div>
                            <Progress value={data.filledSeats * 10} className="h-3 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600 rounded-full" />
                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center text-[13px] border-b border-slate-100 pb-3">
                                    <span className="text-slate-500 font-medium">Confirmed Students</span>
                                    <span className="font-extrabold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/60">{data.filledSeats} / 10</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column: Quick Links */}
                <div className="col-span-1 space-y-8">
                    <Card className="border-slate-200/60 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden h-full">
                        <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 gap-4">
                            <Link href="/admin/applications" className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">View Applications</h4>
                                        <p className="text-xs text-slate-500 font-medium">Review submitted forms</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </Link>
                            
                            <Link href="/admin/drafts" className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:border-red-200 hover:bg-red-50/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Abandoned Drafts</h4>
                                        <p className="text-xs text-slate-500 font-medium">Follow up with leads</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
                            </Link>
                            
                            <Link href="/admin/students" className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Active Students</h4>
                                        <p className="text-xs text-slate-500 font-medium">Manage enrolled cohort</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                            </Link>

                            <SendMessageToStudents paidCount={data.applications.filter((a: any) => a.payment_status === "PAID").length} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}

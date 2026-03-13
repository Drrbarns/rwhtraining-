"use client";

import { useState, useEffect } from "react";
import { createClient as createSupabaseBrowser, type User, type SupabaseClient } from "@supabase/supabase-js";
import { LogOut, BookOpen, Clock, Loader2, ShieldCheck, ArrowRight, Play, FileText, Settings, Trophy, CreditCard, Mail, Phone, MapPin, Lock, ChevronRight, User as UserIcon, Banknote, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

type Tab = "dashboard" | "curriculum" | "profile" | "payments";

export default function StudentPortal() {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<Tab>("dashboard");

    useEffect(() => {
        setSupabase(createSupabaseBrowser(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        ));
    }, []);

    useEffect(() => {
        if (!supabase) return;
        // Restore session from localStorage on mount — no onAuthStateChange to avoid spurious events
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                fetchDashboardData(session.user.id, supabase);
            } else {
                setLoading(false);
            }
        });
    }, [supabase]);

    async function fetchDashboardData(userId: string, client: SupabaseClient) {
        setLoading(true);
        try {
            const [profileRes, enrollRes, appRes] = await Promise.all([
                client.from("profiles").select("*").eq("id", userId).single(),
                client.from("enrollments").select("*").eq("user_id", userId).single(),
                client.from("applications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).single()
            ]);
            setDashboardData({
                profile: profileRes.data,
                enrollment: enrollRes.data,
                application: appRes.data
            });
        } catch (error) {
            console.error("Dashboard error:", error);
        }
        setLoading(false);
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (!supabase) return;
        setLoading(true);
        setAuthError("");
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setAuthError(error.message);
            setLoading(false);
        } else if (data?.user) {
            // Set user directly from sign-in response — no reliance on onAuthStateChange
            setUser(data.user);
            await fetchDashboardData(data.user.id, supabase);
        }
    }

    async function handleLogout() {
        if (!supabase) return;
        await supabase.auth.signOut();
        setUser(null);
        setDashboardData(null);
        setLoading(false);
    }

    if (!supabase || (loading && !user && !authError)) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
                    <p className="text-gray-500 text-sm font-medium">Loading student portal...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] py-12 px-4 selection:bg-[#2563EB]/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-[#0a0a0a]" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px]" />

                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#2563EB]/10 rounded-2xl border border-[#2563EB]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                            <ShieldCheck className="w-8 h-8 text-[#2563EB]" />
                        </div>
                        <h2 className="mt-6 text-3xl font-serif font-extrabold text-white tracking-tight">Student Portal</h2>
                        <p className="mt-2 text-sm text-gray-400">Sign in with the credentials sent to your email after payment.</p>
                    </div>
                    <form className="mt-8 space-y-6 bg-[#121212]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl" onSubmit={handleLogin}>
                        {authError && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-semibold text-center">
                                {authError}
                            </div>
                        )}
                        <div className="space-y-5">
                            <div className="space-y-2 relative group">
                                <Label className="text-gray-400 font-bold uppercase tracking-widest text-xs transition-colors group-focus-within:text-[#2563EB]">Email address</Label>
                                <Input type="email" required className="bg-black/50 border-white/5 rounded-2xl h-14 px-5 text-gray-200 placeholder:text-gray-600 focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/20 transition-all font-medium" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2 relative group">
                                <Label className="text-gray-400 font-bold uppercase tracking-widest text-xs transition-colors group-focus-within:text-[#2563EB]">Password</Label>
                                <Input type="password" required className="bg-black/50 border-white/5 rounded-2xl h-14 px-5 text-gray-200 placeholder:text-gray-600 focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/20 transition-all font-medium" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 transition-all">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                        </Button>
                        <div className="text-center pt-2">
                            <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-white transition-colors">Return to masterclass</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    const profile = dashboardData?.profile;
    const enrollment = dashboardData?.enrollment;
    const application = dashboardData?.application;
    const firstName = profile?.full_name?.split(" ")[0] || "Student";
    const totalPaid = Number(enrollment?.total_paid || 0);
    const balanceDue = Number(enrollment?.balance_due || 0);
    const totalCost = 1000;
    const paymentProgress = totalCost > 0 ? (totalPaid / totalCost) * 100 : 0;

    const tabs = [
        { id: "dashboard" as Tab, label: "Dashboard", icon: ShieldCheck },
        { id: "curriculum" as Tab, label: "Curriculum", icon: BookOpen },
        { id: "payments" as Tab, label: "Payments", icon: CreditCard },
        { id: "profile" as Tab, label: "Profile", icon: UserIcon },
    ];

    const modules = [
        { title: "Module 1: Infrastructure & Auth", duration: "2h 45m", desc: "Supabase, Next.js setup, authentication flows" },
        { title: "Module 2: The Core Product", duration: "3h 10m", desc: "Building the main product features" },
        { title: "Module 3: Payments & Webhooks", duration: "1h 50m", desc: "Integrating Paystack, Moolre, and webhook handlers" },
        { title: "Module 4: Deployment & DevOps", duration: "1h 30m", desc: "Vercel deployment, CI/CD, monitoring" },
        { title: "Module 5: SaaS Launch Strategy", duration: "2h 00m", desc: "Marketing, pricing, launch checklist" },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-100 font-sans selection:bg-[#2563EB]/30">
            {/* Top Nav */}
            <nav className="border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#2563EB]/20 border border-[#2563EB]/40 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                        </div>
                        <h1 className="font-extrabold text-[15px] tracking-tight text-white hidden sm:block">CohortHQ</h1>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-all ${
                                    activeTab === tab.id
                                        ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[12px] font-semibold text-gray-400 items-center gap-2 hidden md:flex">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                            {user.email}
                        </span>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg px-3 gap-2 h-9">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {loading && !dashboardData ? (
                    <div className="flex items-center justify-center p-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[#2563EB]" />
                    </div>
                ) : (
                    <>
                        {/* DASHBOARD TAB */}
                        {activeTab === "dashboard" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">Welcome back, <span className="text-[#2563EB]">{firstName}</span></h1>
                                        <p className="text-gray-400 text-[15px] max-w-xl">Your seat is secured. Here&apos;s your enrollment overview and preparation materials.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: "Total Paid", value: `GHS ${totalPaid}`, icon: Banknote, color: "emerald" },
                                        { label: "Balance Due", value: `GHS ${balanceDue}`, icon: CreditCard, color: balanceDue > 0 ? "amber" : "emerald" },
                                        { label: "Modules", value: `0 / ${modules.length}`, icon: BookOpen, color: "blue" },
                                        { label: "Status", value: "Active", icon: Trophy, color: "green" },
                                    ].map((stat, i) => (
                                        <Card key={i} className="bg-[#121212] border-white/5 hover:border-white/10 transition-colors">
                                            <CardContent className="p-4 md:p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                                                    <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                                                </div>
                                                <div className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{stat.value}</div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Payment Progress */}
                                {balanceDue > 0 && (
                                    <Card className="bg-gradient-to-r from-[#2563EB]/10 to-indigo-600/10 border-[#2563EB]/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-[15px] font-bold text-white">Payment Progress</h3>
                                                    <p className="text-[12px] text-gray-400 mt-0.5">GHS {totalPaid} of GHS {totalCost} paid</p>
                                                </div>
                                                <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl h-9 text-[12px] font-bold">
                                                    Pay Balance <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                                </Button>
                                            </div>
                                            <Progress value={paymentProgress} className="h-3 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-[#2563EB] [&>div]:to-indigo-500 rounded-full" />
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Quick Links */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button onClick={() => setActiveTab("curriculum")} className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-[#121212] hover:border-[#2563EB]/30 hover:bg-[#2563EB]/5 transition-all group text-left">
                                        <div className="p-3 rounded-xl bg-[#2563EB]/10 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-[14px]">View Curriculum</h4>
                                            <p className="text-[12px] text-gray-500">{modules.length} modules to complete</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-[#2563EB] transition-colors" />
                                    </button>

                                    <button onClick={() => setActiveTab("payments")} className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-[#121212] hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group text-left">
                                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-[14px]">Payment History</h4>
                                            <p className="text-[12px] text-gray-500">View transactions</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-amber-500 transition-colors" />
                                    </button>

                                    <button onClick={() => setActiveTab("profile")} className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-[#121212] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group text-left">
                                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-[14px]">My Profile</h4>
                                            <p className="text-[12px] text-gray-500">View your details</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-purple-500 transition-colors" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* CURRICULUM TAB */}
                        {activeTab === "curriculum" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Core Curriculum</h1>
                                    <p className="text-gray-400 text-[15px]">Video modules and code repositories for the masterclass.</p>
                                </div>

                                <div className="space-y-4">
                                    {modules.map((mod, i) => (
                                        <Card key={i} className="bg-[#121212] border-white/5 hover:border-white/10 transition-colors overflow-hidden group cursor-not-allowed opacity-60">
                                            <CardContent className="p-0">
                                                <div className="flex items-center gap-5 p-5">
                                                    <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 shrink-0">
                                                        <Lock className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-300 text-[15px]">{mod.title}</h4>
                                                        <p className="text-[12px] text-gray-500 mt-1">{mod.desc}</p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {mod.duration}</span>
                                                            <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1"><Play className="w-3 h-3" /> Video</span>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 text-gray-500 border border-white/10 uppercase tracking-wider shrink-0">
                                                        Locked
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <Card className="bg-[#2563EB]/10 border-[#2563EB]/20">
                                    <CardContent className="p-6 text-center">
                                        <Calendar className="w-8 h-8 text-[#2563EB] mx-auto mb-3" />
                                        <h3 className="text-[15px] font-bold text-white mb-1">Content unlocks on Cohort Start Date</h3>
                                        <p className="text-[13px] text-[#2563EB]">March 16, 2026</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* PAYMENTS TAB */}
                        {activeTab === "payments" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Payment History</h1>
                                    <p className="text-gray-400 text-[15px]">Your payment records and balance information.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="bg-[#121212] border-white/5">
                                        <CardContent className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Paid</span>
                                                <Banknote className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div className="text-2xl font-extrabold text-emerald-400">GHS {totalPaid}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-[#121212] border-white/5">
                                        <CardContent className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Balance Due</span>
                                                <CreditCard className="w-4 h-4 text-amber-500" />
                                            </div>
                                            <div className={`text-2xl font-extrabold ${balanceDue > 0 ? "text-amber-400" : "text-emerald-400"}`}>GHS {balanceDue}</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-[#121212] border-white/5">
                                        <CardContent className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tier</span>
                                                <Trophy className="w-4 h-4 text-[#D4AF37]" />
                                            </div>
                                            <div className="text-2xl font-extrabold text-[#D4AF37]">{application?.tier || "—"}%</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {balanceDue > 0 && (
                                    <Card className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-500/20">
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-[15px] font-bold text-white">Outstanding Balance</h3>
                                                <p className="text-[13px] text-gray-400 mt-1">Complete your payment to unlock all benefits.</p>
                                            </div>
                                            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl h-11 px-6">
                                                Pay GHS {balanceDue} <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card className="bg-[#121212] border-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-[15px] font-bold text-white">Transaction Record</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {application ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                            application.payment_status === "PAID" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                                        }`}>
                                                            {application.payment_status === "PAID" ? <Banknote className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-bold text-white">Masterclass — {application.tier}% Tier</p>
                                                            <p className="text-[11px] text-gray-500">Ref: {application.payment_reference?.slice(0, 20) || "—"}...</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[14px] font-extrabold text-white">GHS {application.amount_ghs}</p>
                                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${
                                                            application.payment_status === "PAID" ? "text-emerald-400" : "text-amber-400"
                                                        }`}>{application.payment_status}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-[13px] text-center py-8">No payment records found.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* PROFILE TAB */}
                        {activeTab === "profile" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">My Profile</h1>
                                    <p className="text-gray-400 text-[15px]">Your account information and enrollment details.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="bg-[#121212] border-white/5">
                                        <CardHeader>
                                            <CardTitle className="text-[15px] font-bold text-white flex items-center gap-2"><UserIcon className="w-4 h-4 text-[#2563EB]" /> Personal Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {[
                                                { icon: UserIcon, label: "Full Name", value: profile?.full_name || "—" },
                                                { icon: Mail, label: "Email", value: user.email || "—" },
                                                { icon: Phone, label: "Phone", value: profile?.phone || application?.phone || "—" },
                                                { icon: MapPin, label: "City", value: profile?.city || application?.city || "—" },
                                            ].map((field, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-black/30">
                                                    <div className="p-2 rounded-lg bg-white/5"><field.icon className="w-4 h-4 text-gray-400" /></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{field.label}</p>
                                                        <p className="text-[14px] font-bold text-white">{field.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-[#121212] border-white/5">
                                        <CardHeader>
                                            <CardTitle className="text-[15px] font-bold text-white flex items-center gap-2"><Trophy className="w-4 h-4 text-[#D4AF37]" /> Enrollment Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {[
                                                { label: "Seat Status", value: enrollment?.is_active ? "Active — Secured" : "Pending", highlight: true },
                                                { label: "Payment Tier", value: application?.tier ? `${application.tier}%` : "—" },
                                                { label: "Total Paid", value: `GHS ${totalPaid}` },
                                                { label: "Balance Due", value: `GHS ${balanceDue}` },
                                                { label: "Enrolled Since", value: enrollment?.created_at ? new Date(enrollment.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
                                            ].map((field, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-black/30">
                                                    <span className="text-[12px] font-medium text-gray-400">{field.label}</span>
                                                    <span className={`text-[13px] font-bold ${field.highlight ? "text-emerald-400" : "text-white"}`}>{field.value}</span>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Prep Materials */}
                                <Card className="bg-[#121212] border-white/5">
                                    <CardHeader>
                                        <CardTitle className="text-[15px] font-bold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-purple-400" /> Preparation Materials</CardTitle>
                                        <CardDescription className="text-[12px] text-gray-500">Get ready before the cohort starts</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Button variant="outline" className="justify-start text-left font-semibold text-gray-300 border-white/10 bg-black/40 hover:bg-white/5 rounded-xl h-14 px-5">
                                            <FileText className="w-4 h-4 mr-3 text-purple-400 shrink-0" /> Pre-requisite Checklist
                                        </Button>
                                        <Button variant="outline" className="justify-start text-left font-semibold text-gray-300 border-white/10 bg-black/40 hover:bg-white/5 rounded-xl h-14 px-5">
                                            <Settings className="w-4 h-4 mr-3 text-gray-400 shrink-0" /> Environment Setup Guide
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

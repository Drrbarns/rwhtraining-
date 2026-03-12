"use client";

import { useState, useEffect } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { LogOut, BookOpen, Clock, Loader2, ShieldCheck, ArrowRight, Play, FileText, Settings, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StudentPortal() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [dashboardData, setDashboardData] = useState<any>(null);

    useEffect(() => {
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user || null);
                if (session?.user) await fetchDashboardData(session.user.id);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    async function checkUser() {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        if (session?.user) {
            await fetchDashboardData(session.user.id);
        } else {
            setLoading(false);
        }
    }

    async function fetchDashboardData(userId: string) {
        setLoading(true);
        try {
            // Fetch profile and enrollment data securely
            const [profileRes, enrollRes] = await Promise.all([
                supabase.from("profiles").select("*").eq("id", userId).single(),
                supabase.from("enrollments").select("*, cohort_id(*)").eq("user_id", userId).single()
            ]);

            setDashboardData({
                profile: profileRes.data,
                enrollment: enrollRes.data
            });
        } catch (error) {
            console.error("Dashboard error:", error);
        }
        setLoading(false);
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setAuthError("");

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setAuthError(error.message);
            setLoading(false);
        }
    }

    async function handleLogout() {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setDashboardData(null);
        setLoading(false);
    }

    if (loading && !user && !authError) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
            </div>
        );
    }

    // --- LOGIN VIEW ---
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] bg-[url('/hero3.jpeg')] bg-cover bg-center py-12 px-4 selection:bg-[#2563EB]/30 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/80 to-[#121212] backdrop-blur-[2px]" />

                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#2563EB]/10 rounded-2xl border border-[#2563EB]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                            <ShieldCheck className="w-8 h-8 text-[#2563EB]" />
                        </div>
                        <h2 className="mt-6 text-3xl font-serif font-extrabold text-white tracking-tight">Student Access</h2>
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
                                <Label className="text-gray-400 font-bold uppercase tracking-widest text-[#2563EB] text-xs transition-colors group-focus-within:text-[#2563EB]">Email address</Label>
                                <Input
                                    type="email"
                                    required
                                    className="bg-black/50 border-white/5 rounded-2xl h-14 px-5 text-gray-200 placeholder:text-gray-600 focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/20 transition-all font-medium"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 relative group">
                                <div className="flex items-center justify-between">
                                    <Label className="text-gray-400 font-bold uppercase tracking-widest text-[#2563EB] text-xs transition-colors group-focus-within:text-[#2563EB]">Password</Label>
                                </div>
                                <Input
                                    type="password"
                                    required
                                    className="bg-black/50 border-white/5 rounded-2xl h-14 px-5 text-gray-200 placeholder:text-gray-600 focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/20 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 transition-all"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate & Enter"}
                        </Button>
                        <div className="text-center pt-2">
                            <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-white transition-colors">Return to masterclass registration</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // --- DASHBOARD VIEW ---
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-100 font-sans selection:bg-[#2563EB]/30 pb-20">
            {/* Top Nav */}
            <nav className="border-b border-white/5 bg-[#121212]/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#2563EB]/20 border border-[#2563EB]/40 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                        </div>
                        <h1 className="font-serif font-extrabold text-xl tracking-tight text-white hidden sm:block">CohortHQ.</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                            {user.email}
                        </span>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg px-3 gap-2">
                            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">

                {/* Welcome Banner */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2">Welcome Back, <span className="text-[#2563EB]">{dashboardData?.profile?.full_name?.split(' ')[0] || 'Engineer'}</span>.</h1>
                        <p className="text-gray-400 text-lg max-w-xl">Your masterclass seat is secured. Below are your onboarding steps and core materials for the upcoming sessions.</p>
                    </div>
                    <Button className="bg-[#D4AF37] hover:bg-[#B5952F] text-black font-bold h-12 px-6 rounded-xl shadow-[0_0_20px_-5px_rgba(212,175,55,0.4)] transition-all shrink-0">
                        Join Discord Community <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                {loading && !dashboardData && (
                    <div className="flex items-center justify-center p-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[#2563EB]" />
                    </div>
                )}

                {dashboardData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">

                        {/* Left Content (2 cols) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Course modules */}
                            <Card className="bg-[#121212] border-white/5 hover:border-white/10 transition-colors duration-500 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB]/40 to-purple-500/40" />
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-[#2563EB]" /> Core Curriculum
                                            </CardTitle>
                                            <CardDescription className="text-gray-400">Access the video modules and code repositories.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { title: "Module 1: Infrastructure & Auth", status: "Locked", duration: "2h 45m" },
                                        { title: "Module 2: The Core Product", status: "Locked", duration: "3h 10m" },
                                        { title: "Module 3: Payments & Webhooks", status: "Locked", duration: "1h 50m" },
                                    ].map((mod, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-black/40 hover:bg-black/60 transition-colors group cursor-not-allowed opacity-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                                                    <Play className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-300 group-hover:text-white transition-colors">{mod.title}</h4>
                                                    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase mt-1 block">Video • {mod.duration}</span>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 rounded-md text-xs font-bold bg-white/5 text-gray-400 border border-white/10">
                                                {mod.status}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                                <div className="p-4 bg-[#2563EB]/10 border-t border-[#2563EB]/20 text-center">
                                    <p className="text-sm font-semibold text-[#2563EB]">Content unlocks on Cohort Start Date (March 16, 2026).</p>
                                </div>
                            </Card>

                        </div>

                        {/* Right Content (1 col) */}
                        <div className="space-y-8">

                            {/* Enrollment Status */}
                            <Card className="bg-[#121212] border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-yellow-500" /> Enrollment Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="flex justify-between items-center text-sm font-semibold border-b border-white/5 pb-3">
                                        <span className="text-gray-400">Total Paid</span>
                                        <span className="text-white">GHS {dashboardData.enrollment?.total_paid || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-semibold border-b border-white/5 pb-3">
                                        <span className="text-gray-400">Balance Due</span>
                                        <span className="text-[#D4AF37]">GHS {dashboardData.enrollment?.balance_due || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-semibold">
                                        <span className="text-gray-400">Assigned Seat</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] tracking-widest uppercase font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                            VIP SECURED
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Resources */}
                            <Card className="bg-[#121212] border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-purple-400" /> Prep Materials
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button variant="outline" className="w-full justify-start text-left font-semibold text-gray-300 border-white/10 bg-black/40 hover:bg-white/5 rounded-xl h-12">
                                        <FileText className="w-4 h-4 mr-3 text-purple-400" /> Download Pre-req Checklist
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start text-left font-semibold text-gray-300 border-white/10 bg-black/40 hover:bg-white/5 rounded-xl h-12">
                                        <Settings className="w-4 h-4 mr-3 text-gray-400" /> Environment Setup Guide
                                    </Button>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

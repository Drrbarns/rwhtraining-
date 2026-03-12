"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Settings as SettingsIcon, LogOut, ChevronRight, Menu, Bell, Loader2, ShieldCheck, ArrowUpRight, AlertCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");

    const navigation = [
        { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Applications Pipeline", href: "/admin/applications", icon: Users },
        { name: "Abandoned Drafts", href: "/admin/drafts", icon: AlertCircle },
        { name: "Active Students", href: "/admin/students", icon: GraduationCap },
        { name: "Finance & Payments", href: "/admin/payments", icon: CreditCard },
        { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
    ];

    useEffect(() => {
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    verifyAdmin(session.user);
                } else {
                    setUser(null);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    async function verifyAdmin(loggedInUser: User) {
        // Enforce admin check
        const { data, error } = await supabase.from('profiles').select('role').eq('id', loggedInUser.id).single();

        if (data && (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN')) {
            setUser(loggedInUser);
        } else {
            console.warn("Unauthorized access attempt by non-admin.");
            setAuthError("Unauthorized payload. Administrator privileges required.");
            await supabase.auth.signOut();
            setUser(null);
        }
        setLoading(false);
    }

    async function checkUser() {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await verifyAdmin(session.user);
        } else {
            setLoading(false);
        }
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setAuthError("");

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setAuthError(error.message);
            setLoading(false);
        } else if (data.user) {
            await verifyAdmin(data.user);
        }
    }

    async function handleLogout() {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
    }

    if (loading && !user && !authError) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // --- LOGIN VIEW ---
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 selection:bg-blue-600/20 relative overflow-hidden">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-blue-50/50 backdrop-blur-[1px]" />

                <div className="w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200/60 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="mt-6 text-[28px] font-extrabold text-slate-900 tracking-tight">Mission Control</h2>
                        <p className="mt-2 text-[15px] font-medium text-slate-500">Restricted analytics and operations.</p>
                    </div>
                    <form className="mt-8 space-y-6 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-white shadow-[0_8px_40px_rgb(0,0,0,0.04)]" onSubmit={handleLogin}>
                        {authError && (
                            <div className="p-4 bg-red-50/80 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold text-center animate-in fade-in zoom-in-95">
                                {authError}
                            </div>
                        )}
                        <div className="space-y-5">
                            <div className="space-y-2.5 relative group">
                                <Label className="text-slate-400 font-bold uppercase tracking-widest text-[11px] transition-colors group-focus-within:text-blue-600">Admin Email</Label>
                                <Input
                                    type="email"
                                    required
                                    className="bg-white/50 border-slate-200/60 rounded-2xl h-14 px-5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium shadow-sm hover:bg-white"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2.5 relative group">
                                <div className="flex items-center justify-between">
                                    <Label className="text-slate-400 font-bold uppercase tracking-widest text-[11px] transition-colors group-focus-within:text-blue-600">Master Password</Label>
                                </div>
                                <Input
                                    type="password"
                                    required
                                    className="bg-white/50 border-slate-200/60 rounded-2xl h-14 px-5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium shadow-sm hover:bg-white"
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide shadow-[0_4px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.35)] disabled:opacity-50 transition-all duration-300 group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <span className="flex items-center gap-2">
                                    Authorize Clearance
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                        <div className="text-center pt-4">
                            <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors">&larr; Return to public site</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600/20">

            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-[280px] border-r border-slate-200/60 bg-white/50 backdrop-blur-xl flex-shrink-0 z-20">
                <div className="h-20 flex items-center px-8 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_2px_10px_rgba(37,99,235,0.3)]">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-[15px] font-extrabold tracking-tight text-slate-900">
                            Mission Control
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5 relative">
                    {/* Subtle glow */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <span className={`group relative flex items-center px-4 py-3.5 text-[13px] font-bold rounded-2xl transition-all duration-300 ${isActive ? "bg-white text-blue-600 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100" : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-900 border border-transparent"
                                    }`}>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                                    )}
                                    <item.icon className={`mr-3 h-4 w-4 transition-colors ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                                    {item.name}
                                    {isActive && <ChevronRight className="ml-auto w-3.5 h-3.5 text-blue-600/50" />}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-200/60 bg-white/50">
                    <div className="flex items-center gap-3 px-4 py-3.5 mb-3 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-600">HQ</div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[12px] font-bold text-slate-900 truncate">{user.email}</span>
                            <span className="text-[10px] text-blue-600 uppercase tracking-widest font-bold mt-0.5">Administrator</span>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-bold text-[13px] h-11 transition-colors" onClick={handleLogout}>
                        <LogOut className="mr-3 h-4 w-4" />
                        Secure Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
                    <Menu className="w-6 h-6 text-slate-500" />
                    <div className="text-[15px] font-extrabold text-slate-900 tracking-tight">Mission Control</div>
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white shadow-sm">HQ</div>
                </header>

                {/* Desktop Topbar */}
                <header className="hidden md:flex h-20 items-center justify-between px-10 border-b border-slate-200/60 bg-white/60 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400 tracking-wide uppercase">
                        <span>Operational Overview</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative cursor-pointer group">
                            <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center group-hover:border-slate-300 transition-colors shadow-sm">
                                <Bell className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
                            </div>
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                        </div>
                        <Link href="/" target="_blank" className="text-[12px] font-bold px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-all shadow-[0_2px_10px_rgba(37,99,235,0.2)] flex items-center gap-2">
                            Live Website <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                        </Link>
                    </div>
                </header>

                {/* Main Viewport */}
                <main className="flex-1 overflow-y-auto w-full p-4 md:p-10 relative">
                    {/* Subtle background element */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 blur-[100px] rounded-full pointer-events-none -z-10" />
                    <div className="max-w-[1400px] mx-auto relative z-0">
                        {children}
                    </div>
                </main>
            </div>

        </div>
    );
}

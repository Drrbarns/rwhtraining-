import { createClient } from "@supabase/supabase-js";
import { ExportRosterButton } from "../ClientButtons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Mail, Clock, Phone, MapPin, Banknote, CreditCard, Users } from "lucide-react";

export const revalidate = 0;

async function getStudentsData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) return null;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [enrollmentsRes, profilesRes] = await Promise.all([
        supabase.from("enrollments").select("*, applications(*)"),
        supabase.from("profiles").select("*").eq("role", "STUDENT")
    ]);

    const enrollments = enrollmentsRes.data || [];
    const students = profilesRes.data || [];

    const totalPaid = enrollments.reduce((acc: number, e: any) => acc + Number(e.total_paid || 0), 0);
    const totalBalance = enrollments.reduce((acc: number, e: any) => acc + Number(e.balance_due || 0), 0);
    const fullPayers = enrollments.filter((e: any) => Number(e.balance_due || 0) === 0).length;

    return { enrollments, students, totalPaid, totalBalance, fullPayers };
}

export default async function ActiveStudentsPage() {
    const data = await getStudentsData();

    if (!data) {
        return <div className="p-10 text-slate-900 font-bold">Error loading students data.</div>;
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-none">Active Students</h1>
                    <p className="text-slate-500 text-[15px] font-medium">Enrolled members with payment confirmation and credentials.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportRosterButton students={data.students} enrollments={data.enrollments} />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { title: "Total Students", value: data.students.length.toString(), icon: Users, color: "blue" },
                    { title: "Total Collected", value: `GHS ${data.totalPaid.toLocaleString()}`, icon: Banknote, color: "emerald" },
                    { title: "Outstanding", value: `GHS ${data.totalBalance.toLocaleString()}`, icon: CreditCard, color: "amber" },
                    { title: "Fully Paid", value: data.fullPayers.toString(), icon: GraduationCap, color: "purple" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-white border-slate-200/60 rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                                <div className={`p-2 rounded-xl bg-${stat.color}-50 border border-${stat.color}-100/50`}>
                                    <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                                </div>
                            </div>
                            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Students Table */}
            <Card className="border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
                <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-600 text-white"><GraduationCap className="w-4 h-4" /></div>
                        Student Roster
                        <span className="text-[12px] font-bold text-slate-400 ml-2">({data.students.length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {data.students.length > 0 ? (
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
                                        <th className="text-right px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/80">
                                    {data.students.map((student: any, i: number) => {
                                        const enrollment = data.enrollments.find((e: any) => e.user_id === student.id);
                                        const app = enrollment?.applications;
                                        const balance = Number(enrollment?.balance_due || 0);
                                        const paid = Number(enrollment?.total_paid || 0);

                                        return (
                                            <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl border border-slate-200/60 flex items-center justify-center font-extrabold text-[13px] bg-slate-50 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                                                            {student.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '?'}
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
                                                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-widest">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-[12px] font-medium text-slate-400 flex items-center justify-end gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(student.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
        </div>
    );
}

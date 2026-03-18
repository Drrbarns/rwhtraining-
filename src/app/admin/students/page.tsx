import { createClient } from "@supabase/supabase-js";
import { ExportRosterButton } from "../ClientButtons";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Banknote, CreditCard, Users } from "lucide-react";
import { StudentsTable } from "./StudentsClient";

export const revalidate = 0;

async function getStudentsData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) return null;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const [enrollmentsRes, profilesRes, paymentsRes] = await Promise.all([
        supabase.from("enrollments").select("*, applications(*)"),
        supabase.from("profiles").select("*").eq("role", "STUDENT"),
        supabase.from("payments").select("*").in("status", ["PAID", "SUCCESS", "REVERSED"]).order("created_at", { ascending: false }),
    ]);

    const enrollments = enrollmentsRes.data || [];
    const students = profilesRes.data || [];
    const payments = paymentsRes.data || [];

    // Get last sign-in times from auth users
    const lastSignInMap: Record<string, string | null> = {};
    try {
        const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 500 });
        if (authData?.users) {
            for (const u of authData.users) {
                if (u.last_sign_in_at) lastSignInMap[u.id] = u.last_sign_in_at;
            }
        }
    } catch {}

    const totalPaid = enrollments.reduce((acc: number, e: any) => acc + Number(e.total_paid || 0), 0);
    const totalBalance = enrollments.reduce((acc: number, e: any) => acc + Number(e.balance_due || 0), 0);
    const fullPayers = enrollments.filter((e: any) => Number(e.balance_due || 0) === 0).length;

    return { enrollments, students, payments, lastSignInMap, totalPaid, totalBalance, fullPayers };
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

            {/* Students Table (interactive) */}
            <StudentsTable students={data.students} enrollments={data.enrollments} payments={data.payments} lastSignInMap={data.lastSignInMap} />
        </div>
    );
}

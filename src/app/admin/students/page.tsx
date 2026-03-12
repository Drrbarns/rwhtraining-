import { createClient } from "@supabase/supabase-js";
import { ExportRosterButton } from "../ClientButtons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Mail, Clock } from "lucide-react";

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

    return { enrollments, students };
}

export default async function ActiveStudentsPage() {
    const data = await getStudentsData();

    if (!data) {
        return (
            <div className="p-10 text-slate-900 font-bold">Error loading students data.</div>
        );
    }

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-none">
                        Active Students
                    </h1>
                    <p className="text-slate-500 text-[15px] font-medium">
                        Enrolled members who have successfully completed payment and received credentials.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportRosterButton students={data.students} enrollments={data.enrollments} />
                </div>
            </div>

            <Card className="border-slate-200/60 bg-white min-h-[690px] flex flex-col shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-5 pt-6 px-6 border-b border-slate-100 mb-2 bg-slate-50/50">
                    <div>
                        <CardTitle className="text-[22px] font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
                            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            Active Students Roster
                        </CardTitle>
                        <CardDescription className="text-slate-500 mt-1.5 font-medium">
                            {data.students.length} students enrolled.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-6">
                    {data.students.length > 0 ? (
                        <div className="space-y-3">
                            {data.students.map((student, i) => {
                                const enrollment = data.enrollments.find(e => e.user_id === student.id);
                                const app = enrollment?.applications;

                                return (
                                    <div key={i} className="flex items-center justify-between p-5 border border-slate-200/60 rounded-2xl bg-white hover:border-blue-200 hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.1)] transition-all duration-300 group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 p-0 h-full bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500" />
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl border border-slate-200/60 flex items-center justify-center font-extrabold text-lg bg-slate-50 text-slate-700 shadow-sm group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                                                {student.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 text-[17px] tracking-tight">{student.full_name}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-[12px] font-medium text-slate-500">
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {app?.email || "No email linked"}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-blue-600 uppercase tracking-widest font-bold">{student.city || app?.city || "Unknown Location"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2.5">
                                            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
                                                SECURED SEAT
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                Joined: {new Date(student.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[500px] text-center px-4">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-blue-100 blur-2xl rounded-full opacity-50" />
                                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
                                    <GraduationCap className="w-10 h-10 text-slate-300" />
                                </div>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">No Students Enrolled Yet</h3>
                            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">When applicants complete their payment via Moolre, they will automatically be provisioned an account and appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

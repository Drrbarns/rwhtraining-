import { createClient } from "@supabase/supabase-js";
import { ApplicationsListWithDetail } from "../components/ApplicationsListWithDetail";
import { ExportReportButton, ExportUnfinishedButton } from "../ClientButtons";

export const revalidate = 0;

async function getApplicationsData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) return null;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return null;

    const all = data ?? [];
    const applications = all.filter((a: any) => !a.is_unfinished);
    const unfinishedApps = all.filter((a: any) => a.is_unfinished);

    return { applications, unfinishedApps };
}

export default async function ApplicationsPipelinePage() {
    const data = await getApplicationsData();

    if (!data) {
        return (
            <div className="p-10 text-slate-900 font-bold">Error loading applications.</div>
        );
    }

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-8">
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-slate-900 leading-none">
                        Applications Pipeline
                    </h1>
                    <p className="text-slate-500 text-[15px] font-medium">
                        Completed applications. Click any row to view full details.
                    </p>
                </div>
            </div>

            <div>
                <ApplicationsListWithDetail
                    applications={data.applications}
                    unfinishedApps={data.unfinishedApps}
                    ExportReportButton={<ExportReportButton applications={data.applications} />}
                    ExportUnfinishedButton={<ExportUnfinishedButton unfinishedApps={data.unfinishedApps} />}
                    hideDrafts={true}
                />
            </div>
        </div>
    );
}

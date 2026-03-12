"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

export function ExportReportButton({ applications }: { applications: any[] }) {
    const handleExport = () => {
        if (!applications || applications.length === 0) {
            toast.warning("No applications data available to export.");
            return;
        }

        const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "City", "Status", "Payment Status", "Tier", "Amount GHS", "Created At"];
        const rows = applications.map(app => [
            app.id,
            app.first_name,
            app.last_name,
            app.email,
            app.phone,
            app.city || "",
            app.status,
            app.payment_status,
            app.tier || "",
            app.amount_ghs || "",
            app.created_at || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Masterclass_Applications_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(`Exported ${applications.length} applications successfully.`);
    };

    return (
        <Button onClick={handleExport} variant="outline" className="border-slate-200/60 bg-white text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] font-bold text-[13px] h-11 px-5">
            <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
    );
}

export function OpenRegistrationsButton() {
    return (
        <Button onClick={() => window.open("/apply", "_blank")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_4px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.35)] transition-all duration-300 h-11 px-6">
            Open Registrations
        </Button>
    );
}

export function ExportRosterButton({ students, enrollments }: { students: any[], enrollments: any[] }) {
    const handleExport = () => {
        if (!students || students.length === 0) {
            toast.warning("No active students to export.");
            return;
        }

        const headers = ["ID", "Full Name", "Email", "Phone", "City", "Joined Date", "Total Paid", "Balance Due"];
        const rows = students.map(student => {
            const enrollment = enrollments.find((e: any) => e.user_id === student.id);
            const app = enrollment?.applications;

            return [
                student.id,
                student.full_name,
                app?.email || "N/A",
                student.phone || "N/A",
                student.city || app?.city || "N/A",
                new Date(student.created_at).toLocaleDateString(),
                enrollment?.total_paid || "0",
                enrollment?.balance_due || "0"
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Student_Roster_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(`Exported ${students.length} students successfully.`);
    };

    return (
        <Button onClick={handleExport} variant="outline" className="text-[13px] font-bold border-slate-200/60 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 h-10 px-5">
            <Download className="w-4 h-4 mr-2" /> Export Roster
        </Button>
    );
}

export function ExportUnfinishedButton({ unfinishedApps }: { unfinishedApps: any[] }) {
    const handleExport = () => {
        if (!unfinishedApps || unfinishedApps.length === 0) {
            toast.warning("No abandoned drafts to export.");
            return;
        }

        const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "City", "Occupation", "Experience", "Last Update"];
        const rows = unfinishedApps.map(app => [
            app.id,
            app.first_name || "Guest",
            app.last_name || "Applicant",
            app.email || "N/A",
            app.phone || "N/A",
            app.city || "N/A",
            app.occupation || "N/A",
            app.experience || "N/A",
            new Date(app.updated_at).toLocaleString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Abandoned_Leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(`Exported ${unfinishedApps.length} leads successfully.`);
    };

    return (
        <Button onClick={handleExport} variant="ghost" size="sm" className="text-[11px] h-8 font-extrabold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 uppercase tracking-widest rounded-lg transition-colors">
            <Download className="w-3 h-3 mr-1" /> Export Leads
        </Button>
    );
}

"use client";

import { Button } from "@/components/ui/button";

export function ExportReportButton({ applications }: { applications: any[] }) {
    const handleExport = () => {
        if (!applications || applications.length === 0) {
            alert("No applications data available to export.");
            return;
        }

        const headers = ["ID", "Record Tag", "First Name", "Last Name", "Email", "Phone", "LinkedIn", "Status", "Payment Status", "Amount GHS"];
        const rows = applications.map(app => [
            app.id,
            app.record_tag || "",
            app.first_name,
            app.last_name,
            app.email,
            app.phone,
            app.linkedin_url || "",
            app.status,
            app.payment_status,
            app.amount_ghs || ""
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
        alert("Applications report exported successfully.");
    };

    return (
        <Button onClick={handleExport} variant="outline" className="border-slate-200/60 bg-white text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] font-bold text-[13px] h-11 px-5">
            Export Report List
        </Button>
    );
}

export function OpenRegistrationsButton() {
    const handleClick = () => {
        window.open("/apply", "_blank");
    };

    return (
        <Button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_4px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.35)] transition-all duration-300 h-11 px-6">
            Open Registrations
        </Button>
    );
}

export function ExportRosterButton({ students, enrollments }: { students: any[], enrollments: any[] }) {
    const handleExport = () => {
        if (!students || students.length === 0) {
            alert("No active students to export.");
            return;
        }

        const headers = ["ID", "Full Name", "Email", "Phone", "City", "Joined Date", "Role"];
        const rows = students.map(student => {
            const enrollment = enrollments.find(e => e.user_id === student.id);
            const app = enrollment?.applications;

            return [
                student.id,
                student.full_name,
                app?.email || "N/A",
                student.phone || "N/A",
                student.city || app?.city || "Unknown Location",
                new Date(student.created_at).toLocaleDateString(),
                student.role
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
        alert("Student Roster exported successfully.");
    };

    return (
        <Button onClick={handleExport} variant="outline" className="text-[13px] font-bold border-slate-200/60 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 h-10 px-5">
            Export Roster
        </Button>
    );
}

export function ExportUnfinishedButton({ unfinishedApps }: { unfinishedApps: any[] }) {
    const handleExport = () => {
        if (!unfinishedApps || unfinishedApps.length === 0) {
            alert("No data available to export.");
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
        link.setAttribute("download", `Unfinished_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        alert("Unfinished registrations report exported.");
    };

    return (
        <Button onClick={handleExport} variant="ghost" size="sm" className="text-[11px] h-8 font-extrabold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 uppercase tracking-widest rounded-lg transition-colors">
            Export Leads
        </Button>
    );
}

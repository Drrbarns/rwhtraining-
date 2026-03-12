"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationDetailModal, type ApplicationRecord } from "./ApplicationDetailModal";

interface ApplicationsListWithDetailProps {
  applications: ApplicationRecord[];
  unfinishedApps: ApplicationRecord[];
  ExportReportButton: React.ReactNode;
  ExportUnfinishedButton: React.ReactNode;
}

export function ApplicationsListWithDetail({
  applications,
  unfinishedApps,
  ExportReportButton,
  ExportUnfinishedButton,
  hideDrafts = false,
  hidePipeline = false,
}: ApplicationsListWithDetailProps & { hideDrafts?: boolean, hidePipeline?: boolean }) {
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  return (
    <>
      <div className="space-y-8">
          {/* Completed Applications - Application Pipeline */}
          {!hidePipeline && (
          <div className="border border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[19px] font-extrabold text-slate-900 tracking-tight">Application Pipeline</h3>
                  <p className="text-slate-500 text-[13px] font-medium mt-1">Completed applications. Click to view full details.</p>
                </div>
                {ExportReportButton}
              </div>
            </div>
            <div className="h-[350px] overflow-y-auto p-4 divide-y divide-slate-100/80">
              {applications.length > 0 ? (
                applications.map((app, i) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedApp(app)}
                    className="w-full text-left flex flex-col py-4 group hover:bg-blue-50/30 -mx-4 px-4 transition-all duration-300 rounded-xl gap-3 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-blue-500 group-hover:h-full transition-all duration-300 rounded-r-full opacity-0 group-hover:opacity-100" />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-[13px] font-extrabold text-slate-500 group-hover:bg-white group-hover:text-blue-600 group-hover:border-blue-200 group-hover:shadow-sm transition-all duration-300">
                          {(app.first_name || "?")[0]}
                          {(app.last_name || "?")[0]}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-[14px] tracking-tight group-hover:text-blue-900 transition-colors">
                            {app.first_name || "—"} {app.last_name || "—"}
                          </h4>
                          <span className="text-slate-500 text-[11px] font-medium block mt-0.5">{app.email || "No email"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm
                          ${app.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : ""}
                          ${app.status === "PENDING_REVIEW" ? "bg-amber-50 text-amber-700 border border-amber-200/60" : ""}
                          ${app.status === "WAITLISTED" ? "bg-slate-100 text-slate-600 border border-slate-200/60" : ""}
                          ${!app.status ? "bg-slate-100 text-slate-600 border border-slate-200/60" : ""}
                        `}
                      >
                        {app.status?.replace("_", " ") || "—"}
                      </span>
                      <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                        Payment: <span className={app.payment_status === "PAID" ? "text-emerald-600" : "text-amber-600"}>{app.payment_status || "—"}</span>
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-[13px] font-medium text-slate-400 mt-10 py-8">No completed applications yet.</div>
              )}
            </div>
          </div>
          )}

          {/* Abandoned Drafts - Unfinished Registrations */}
          {!hideDrafts && (
          <div className="border border-red-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-red-100/50 bg-red-50/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[19px] font-extrabold text-red-700 flex items-center gap-2 tracking-tight">
                    <AlertCircle className="w-5 h-5" />
                    Abandoned Drafts
                  </h3>
                  <p className="text-slate-500 text-[13px] font-medium mt-1">
                    Users who started the form but did not complete it. Click to view saved data.
                  </p>
                </div>
                {ExportUnfinishedButton}
              </div>
            </div>
            <div className="h-[350px] overflow-y-auto p-4 divide-y divide-slate-100/80">
              {unfinishedApps.length > 0 ? (
                unfinishedApps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedApp(app)}
                    className="w-full text-left flex flex-col py-4 group hover:bg-red-50/30 -mx-4 px-4 transition-all duration-300 rounded-xl gap-3 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-red-400 group-hover:h-full transition-all duration-300 rounded-r-full opacity-0 group-hover:opacity-100" />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[12px] font-extrabold text-red-600 group-hover:bg-white group-hover:border-red-200 group-hover:shadow-sm transition-all duration-300">
                          {(app.first_name || "?")[0]}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-[14px] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] group-hover:text-red-900 transition-colors">
                            {app.first_name || "Guest"} {app.last_name || "Applicant"}
                          </h4>
                          <span className="text-slate-500 text-[11px] font-medium block mt-0.5">{app.email || "No email yet"}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                          {app.phone || "No phone"}
                        </span>
                        <span className="text-slate-400 text-[10px] font-medium">
                          {app.updated_at ? new Date(app.updated_at).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-1 relative z-10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px] font-extrabold text-red-600 border-red-200/60 hover:bg-white hover:border-red-300 hover:text-red-700 hover:shadow-sm transition-all duration-300 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApp(app);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-[13px] font-medium text-slate-400 mt-10 py-8 px-4">
                  No abandoned drafts yet. Anyone who starts the form will appear here if they leave before completing.
                </div>
              )}
            </div>
          </div>
          )}
        </div>

      <ApplicationDetailModal application={selectedApp} onClose={() => setSelectedApp(null)} />
    </>
  );
}

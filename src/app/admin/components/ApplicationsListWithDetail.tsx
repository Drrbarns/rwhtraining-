"use client";

import { useState, useMemo } from "react";
import { AlertCircle, Search, Filter, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApplicationDetailModal, type ApplicationRecord } from "./ApplicationDetailModal";

interface ApplicationsListWithDetailProps {
  applications: ApplicationRecord[];
  unfinishedApps: ApplicationRecord[];
  balanceDueByApplicationId?: Record<string, number>;
  ExportReportButton: React.ReactNode;
  ExportUnfinishedButton: React.ReactNode;
  hideDrafts?: boolean;
  hidePipeline?: boolean;
}

const PAGE_SIZE = 12;

export function ApplicationsListWithDetail({
  applications,
  unfinishedApps,
  balanceDueByApplicationId,
  ExportReportButton,
  ExportUnfinishedButton,
  hideDrafts = false,
  hidePipeline = false,
}: ApplicationsListWithDetailProps) {
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [draftsPage, setDraftsPage] = useState(1);

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch = !search || [app.first_name, app.last_name, app.email, app.phone, app.city]
        .some(f => f?.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
      const matchesPayment = paymentFilter === "ALL" || app.payment_status === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [applications, search, statusFilter, paymentFilter]);

  const filteredDrafts = useMemo(() => {
    return unfinishedApps.filter((app) => {
      return !search || [app.first_name, app.last_name, app.email, app.phone]
        .some(f => f?.toLowerCase().includes(search.toLowerCase()));
    });
  }, [unfinishedApps, search]);

  const totalPages = Math.ceil(filteredApps.length / PAGE_SIZE);
  const paginatedApps = filteredApps.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const draftsTotalPages = Math.ceil(filteredDrafts.length / PAGE_SIZE);
  const paginatedDrafts = filteredDrafts.slice((draftsPage - 1) * PAGE_SIZE, draftsPage * PAGE_SIZE);

  const statusColor = (s?: string | null) => {
    if (s === "APPROVED") return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    if (s === "PENDING_REVIEW") return "bg-amber-50 text-amber-700 border-amber-200/60";
    if (s === "REJECTED") return "bg-red-50 text-red-700 border-red-200/60";
    if (s === "WAITLISTED") return "bg-slate-100 text-slate-600 border-slate-200/60";
    return "bg-slate-100 text-slate-600 border-slate-200/60";
  };

  const paymentColor = (s?: string | null) => {
    if (s === "PAID") return "text-emerald-600";
    if (s === "PENDING") return "text-amber-600";
    return "text-red-500";
  };

  return (
    <>
      <div className="space-y-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, phone, or city..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); setDraftsPage(1); }}
              className="pl-9 h-10 rounded-xl text-[13px] border-slate-200/60"
            />
          </div>
          {!hidePipeline && (
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400" />
              {["ALL", "PENDING_REVIEW", "APPROVED", "WAITLISTED", "REJECTED"].map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    statusFilter === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {s === "ALL" ? "All" : s.replace("_", " ")}
                </button>
              ))}
              <span className="w-px h-6 bg-slate-200 mx-1" />
              {["ALL", "PAID", "PENDING"].map(p => (
                <button
                  key={p}
                  onClick={() => { setPaymentFilter(p); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    paymentFilter === p ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {p === "ALL" ? "All Payments" : p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Completed Applications */}
        {!hidePipeline && (
          <div className="border border-slate-200/60 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[19px] font-extrabold text-slate-900 tracking-tight">Application Pipeline</h3>
                  <p className="text-slate-500 text-[13px] font-medium mt-1">{filteredApps.length} applications • Click to view full details</p>
                </div>
                {ExportReportButton}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="text-left px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Applicant</th>
                    <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">City</th>
                    <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tier</th>
                    <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="text-center px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Payment</th>
                    <th className="text-right px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {paginatedApps.length > 0 ? paginatedApps.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp({ ...app, balance_due: app.id ? (balanceDueByApplicationId?.[app.id] ?? undefined) : undefined })}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-[12px] font-extrabold text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                            {(app.first_name || "?")[0]}{(app.last_name || "?")[0]}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-900">{app.first_name || "—"} {app.last_name || "—"}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{app.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px] font-medium text-slate-600">{app.city || "—"}</td>
                      <td className="px-4 py-4 text-[13px] font-bold text-slate-600">{app.tier ? `${app.tier}%` : "—"}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest ${statusColor(app.status)}`}>
                          {app.status?.replace("_", " ") || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {(() => {
                          const balanceDue = app.id ? (balanceDueByApplicationId?.[app.id] ?? null) : null;
                          const isPaid = app.payment_status === "PAID";
                          const isFullyPaid = isPaid && (balanceDue === null || balanceDue === 0);
                          const isPartial = isPaid && balanceDue != null && balanceDue > 0;
                          if (isPartial) {
                            return (
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600" title={`GHS ${balanceDue} still due`}>
                                Partial — GHS {balanceDue} due
                              </span>
                            );
                          }
                          if (isFullyPaid) {
                            return (
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                                PAID (full)
                              </span>
                            );
                          }
                          return (
                            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${paymentColor(app.payment_status)}`}>
                              {app.payment_status || "—"}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-right text-[12px] font-medium text-slate-400 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {app.created_at ? new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-[13px] text-slate-400 font-medium">
                        {search || statusFilter !== "ALL" || paymentFilter !== "ALL"
                          ? "No applications match your filters"
                          : "No completed applications yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                <span className="text-[12px] font-medium text-slate-400">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredApps.length)} of {filteredApps.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg h-8 w-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-[12px] font-bold text-slate-600 px-2">{page} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg h-8 w-8 p-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Abandoned Drafts */}
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
                    {filteredDrafts.length} leads who started but did not finish
                  </p>
                </div>
                {ExportUnfinishedButton}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-100/30 bg-red-50/10">
                    <th className="text-left px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Lead</th>
                    <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Phone</th>
                    <th className="text-left px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">City</th>
                    <th className="text-right px-6 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {paginatedDrafts.length > 0 ? paginatedDrafts.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp({ ...app, balance_due: app.id ? (balanceDueByApplicationId?.[app.id] ?? undefined) : undefined })}
                      className="hover:bg-red-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[12px] font-extrabold text-red-600">
                            {(app.first_name || "?")[0]}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-900">{app.first_name || "Guest"} {app.last_name || ""}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{app.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px] font-medium text-slate-600">{app.phone || "—"}</td>
                      <td className="px-4 py-4 text-[12px] font-medium text-slate-600">{app.city || "—"}</td>
                      <td className="px-6 py-4 text-right text-[12px] font-medium text-slate-400">
                        {app.updated_at ? new Date(app.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—"}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-[13px] text-slate-400 font-medium">
                        No abandoned drafts
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {draftsTotalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-red-100/30 bg-red-50/10">
                <span className="text-[12px] font-medium text-slate-400">
                  Page {draftsPage} of {draftsTotalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDraftsPage(p => Math.max(1, p - 1))} disabled={draftsPage === 1} className="rounded-lg h-8 w-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDraftsPage(p => Math.min(draftsTotalPages, p + 1))} disabled={draftsPage === draftsTotalPages} className="rounded-lg h-8 w-8 p-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ApplicationDetailModal application={selectedApp} onClose={() => setSelectedApp(null)} />
    </>
  );
}

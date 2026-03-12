"use client";

import { X, Mail, Phone, MapPin, Briefcase, BookOpen, FileText, CreditCard, Clock, Trash2, Loader2, CheckCircle2, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { deleteApplicationAction } from "@/app/actions/delete-application";
import { approveApplicationAction } from "@/app/actions/approve-application";
import { toast } from "sonner";

export type ApplicationRecord = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  age?: number | null;
  city?: string | null;
  occupation?: string | null;
  experience?: string | null;
  reason?: string | null;
  tier?: string | null;
  amount_ghs?: number | null;
  payment_reference?: string | null;
  payment_status?: string | null;
  status?: string | null;
  is_unfinished?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

interface ApplicationDetailModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
}

export function ApplicationDetailModal({ application, onClose }: ApplicationDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!application) return;
    document.addEventListener("keydown", handleEscapeKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [application, handleEscapeKey]);

  if (!application) return null;

  const fullName = [application.first_name, application.last_name].filter(Boolean).join(" ") || "Unknown";
  const isDraft = application.is_unfinished === true;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete this ${isDraft ? 'draft' : 'application'}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteApplicationAction(application.id);
      if (res.success) {
        toast.success(`${isDraft ? 'Draft' : 'Application'} deleted successfully.`);
        onClose();
      } else {
        toast.error(`Failed to delete: ${res.error}`);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("An unexpected error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm(`Approve this application and mark as PAID?\n\nThis will:\n• Set payment status to PAID\n• Set status to APPROVED\n• Create a student account\n• Send login credentials via email\n\nProceed?`)) {
      return;
    }

    setIsApproving(true);
    try {
      const res = await approveApplicationAction(application.id);
      if (res.success) {
        if ('warning' in res && res.warning) {
          toast.warning(res.warning);
        } else {
          toast.success("Application approved! Student account created and credentials sent.");
        }
        onClose();
      } else {
        toast.error(`Failed: ${res.error}`);
      }
    } catch (error) {
      console.error("Approve failed:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsApproving(false);
    }
  };

  const isAlreadyApproved = application.payment_status === "PAID" && application.status === "APPROVED";

  const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) => {
    if (value == null || value === "") return null;
    return (
      <div className="flex items-start gap-3.5 py-3.5 border-b border-slate-100/80 last:border-0">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
          <p className="text-[14px] text-slate-900 font-bold tracking-tight">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/60 animate-in fade-in zoom-in-95 duration-300 flex flex-col">
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-100 bg-white/80 backdrop-blur-xl z-10">
          <div>
            <h2 className="text-[22px] font-extrabold text-slate-900 tracking-tight">{fullName}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm ${
                  isDraft ? "bg-red-50 text-red-700 border border-red-200/60" : "bg-blue-50 text-blue-700 border border-blue-200/60"
                }`}
              >
                {isDraft ? "Abandoned Draft" : "Completed Application"}
              </span>
              {!isDraft && application.status && (
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60 uppercase tracking-widest shadow-sm">
                  {application.status.replace("_", " ")}
                </span>
              )}
              {!isDraft && application.payment_status && (
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-widest shadow-sm ${application.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'}`}>
                  Payment: {application.payment_status}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isAlreadyApproved && (
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="rounded-xl h-9 px-4 text-[12px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all gap-1.5"
                title="Approve & Mark as Paid"
              >
                {isApproving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                {isApproving ? "Approving..." : "Approve & Mark Paid"}
              </Button>
            )}
            {isAlreadyApproved && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                Approved & Paid
              </span>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="rounded-full hover:bg-red-50 hover:text-red-600 h-10 w-10 shrink-0 transition-colors text-slate-400 group"
              title="Delete Record"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100 h-10 w-10 shrink-0 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
          <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Contact & Identity
            </h3>
            <div className="space-y-1">
              <DetailRow icon={Mail} label="Email" value={application.email} />
              <DetailRow icon={Phone} label="Phone / WhatsApp" value={application.phone} />
              <DetailRow icon={User} label="Age" value={application.age != null ? `${application.age} years old` : null} />
              <DetailRow icon={MapPin} label="City / Location" value={application.city} />
            </div>
          </section>

          <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Background
            </h3>
            <div className="space-y-1">
              <DetailRow icon={Briefcase} label="Occupation" value={application.occupation} />
              <DetailRow icon={BookOpen} label="Experience Level" value={application.experience} />
            </div>
          </section>

          <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Motivation
            </h3>
            {application.reason ? (
              <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                <p className="text-[14px] text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{application.reason}</p>
              </div>
            ) : (
              <p className="text-slate-400 text-[13px] italic font-medium">Not provided</p>
            )}
          </section>

          {!isDraft && (
            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" /> Payment
              </h3>
              <div className="space-y-1">
                <DetailRow icon={CreditCard} label="Tier" value={application.tier ? `${application.tier}%` : null} />
                <DetailRow
                  icon={CreditCard}
                  label="Amount (GHS)"
                  value={application.amount_ghs != null ? String(application.amount_ghs) : null}
                />
                <DetailRow icon={CreditCard} label="Payment Reference" value={application.payment_reference} />
              </div>
            </section>
          )}

          <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Timestamps
            </h3>
            <div className="space-y-1">
              <DetailRow
                icon={Clock}
                label="Started"
                value={application.created_at ? new Date(application.created_at).toLocaleString() : null}
              />
              <DetailRow
                icon={Clock}
                label="Last Updated"
                value={application.updated_at ? new Date(application.updated_at).toLocaleString() : null}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

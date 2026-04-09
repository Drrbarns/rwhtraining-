"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CohortOption = {
  id: string;
  name: string | null;
  start_date?: string | null;
};

export function CohortScopePicker({
  cohorts,
  activeCohortId,
}: {
  cohorts: CohortOption[];
  activeCohortId: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("cohort") || "active";

  function setScope(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!next || next === "active") params.delete("cohort");
    else params.set("cohort", next);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Scope
      </span>
      <select
        value={current}
        onChange={(event) => setScope(event.target.value)}
        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        <option value="active">Active Cohort</option>
        <option value="all">All Cohorts</option>
        {cohorts.map((cohort) => (
          <option key={cohort.id} value={cohort.id}>
            {cohort.id === activeCohortId ? "Live: " : ""}
            {cohort.name || "Unnamed Cohort"}
          </option>
        ))}
      </select>
    </div>
  );
}

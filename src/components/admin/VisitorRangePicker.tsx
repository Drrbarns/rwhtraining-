"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function VisitorRangePicker() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("visitors") || "week";

  function setRange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!next || next === "week") params.delete("visitors");
    else params.set("visitors", next);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Visitors
      </span>
      <select
        value={current}
        onChange={(event) => setRange(event.target.value)}
        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        <option value="day">Per day</option>
        <option value="week">Per week</option>
        <option value="month">Per month</option>
      </select>
    </div>
  );
}

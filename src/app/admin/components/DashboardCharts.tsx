"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

interface ChartProps {
  revenueByDay: { date: string; amount: number }[];
  tierBreakdown: { name: string; value: number; amount: number }[];
  gatewayBreakdown: { name: string; value: number }[];
  funnelData: { stage: string; count: number; color: string }[];
}

const TIER_COLORS = ["#3B82F6", "#8B5CF6", "#10B981"];
const GATEWAY_COLORS = ["#F59E0B", "#6366F1"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-4 py-3 rounded-xl border border-slate-200/60 shadow-lg">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-[13px] font-extrabold text-slate-900">
          GHS {Number(entry.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-4 py-3 rounded-xl border border-slate-200/60 shadow-lg">
      <p className="text-[13px] font-extrabold text-slate-900">{payload[0].name}</p>
      <p className="text-[12px] font-bold text-slate-500">{payload[0].value} students</p>
    </div>
  );
}

export function RevenueChart({ data }: { data: ChartProps["revenueByDay"] }) {
  if (!data.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-slate-400 text-[13px] font-medium">
        No revenue data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2.5} fill="url(#revenueGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TierPieChart({ data }: { data: ChartProps["tierBreakdown"] }) {
  if (!data.length || data.every(d => d.value === 0)) {
    return (
      <div className="h-[220px] flex items-center justify-center text-slate-400 text-[13px] font-medium">
        No tier data yet
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width="50%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" strokeWidth={0}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={TIER_COLORS[index % TIER_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-3">
        {data.map((tier, i) => (
          <div key={tier.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TIER_COLORS[i] }} />
              <span className="text-[12px] font-bold text-slate-600">{tier.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[13px] font-extrabold text-slate-900">{tier.value}</span>
              <span className="text-[11px] text-slate-400 ml-1">/ GHS {tier.amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GatewayPieChart({ data }: { data: ChartProps["gatewayBreakdown"] }) {
  if (!data.length || data.every(d => d.value === 0)) {
    return (
      <div className="h-[180px] flex items-center justify-center text-slate-400 text-[13px] font-medium">
        No gateway data yet
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width="40%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value" strokeWidth={0}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={GATEWAY_COLORS[index % GATEWAY_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-3">
        {data.map((gw, i) => (
          <div key={gw.name} className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GATEWAY_COLORS[i] }} />
            <span className="text-[12px] font-bold text-slate-600">{gw.name}</span>
            <span className="text-[13px] font-extrabold text-slate-900 ml-auto">{gw.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FunnelChart({ data }: { data: ChartProps["funnelData"] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((stage, i) => {
        const widthPercent = Math.max((stage.count / maxCount) * 100, 8);
        const conversionRate = i > 0 && data[i - 1].count > 0
          ? ((stage.count / data[i - 1].count) * 100).toFixed(0)
          : null;

        return (
          <div key={stage.stage} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-bold text-slate-600">{stage.stage}</span>
              <div className="flex items-center gap-2">
                {conversionRate && (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                    {conversionRate}% conv.
                  </span>
                )}
                <span className="text-[14px] font-extrabold text-slate-900">{stage.count}</span>
              </div>
            </div>
            <div className="h-8 bg-slate-50 rounded-lg overflow-hidden relative">
              <div
                className="h-full rounded-lg transition-all duration-700 ease-out"
                style={{ width: `${widthPercent}%`, backgroundColor: stage.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

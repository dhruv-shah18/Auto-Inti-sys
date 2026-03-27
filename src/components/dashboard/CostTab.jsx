import React from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const C = {
  accent: "#ea7c21",
  green: "#059669",
  blue: "#2563eb",
  purple: "#7c3aed",
  textMuted: "#9ca3af",
};

export function CostTab({ data, stats }) {
  const { totalCost, totalFuel, avgCostKm, projMonthlyCost, projYearlyCost, projMonthlyKm } = stats;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Spent", value: `₹${totalCost.toLocaleString()}`, color: C.green },
          { label: "Avg / Fill", value: `₹${(totalCost / data.length).toFixed(0)}`, color: C.accent },
          { label: "Per km", value: `₹${avgCostKm.toFixed(2)}`, color: C.blue },
          { label: "Per Litre", value: `₹${(totalCost / totalFuel).toFixed(2)}`, color: C.purple },
        ].map(k => (
          <div key={k.label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm text-center">
            <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-2 font-semibold">{k.label}</div>
            <div className="text-2xl font-extrabold font-sans" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Cost Per KM Trend</div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" vertical />
              <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[1.7, 2.1]} tickFormatter={(v) => `₹${v}`} tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <RechartsTooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-xl shadow">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</div>
                    <div className="text-emerald-600 font-bold">₹{Number(payload[0].value).toFixed(2)} /km</div>
                  </div>
                )
              }} />
              <ReferenceLine y={avgCostKm} stroke={C.green} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="costPerKm" stroke={C.green} fill="url(#cg)" strokeWidth={2.5} dot={{ fill: C.green, r: 3.5, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
           <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Fuel Price Trend</div>
           <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" vertical />
                <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[90, 100]} tickFormatter={(v) => `₹${v.toFixed(0)}`} tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-xl shadow">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</div>
                      <div className="text-purple-600 font-bold">₹{Number(payload[0].value).toFixed(2)} /L</div>
                    </div>
                  )
                }} />
                <Line type="monotone" dataKey="pricePerLitre" stroke={C.purple} strokeWidth={2.5} dot={{ fill: C.purple, r: 3.5, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
           </div>
         </div>

         <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
           <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Projections</div>
           <div className="flex flex-col gap-0">
             {[
               { l: "Monthly", v: `₹${projMonthlyCost.toLocaleString()}` },
               { l: "Quarterly", v: `₹${(projMonthlyCost * 3).toLocaleString()}` },
               { l: "Yearly", v: `₹${projYearlyCost.toLocaleString()}` },
               { l: "Per 1000 km", v: `₹${(avgCostKm * 1000).toFixed(0)}` },
               { l: "Monthly km", v: `${projMonthlyKm.toLocaleString()} km` },
             ].map(p => (
               <div key={p.l} className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                 <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{p.l}</span>
                 <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold font-sans">{p.v}</span>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
}

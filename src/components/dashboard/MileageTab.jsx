import React from 'react';
import { ComposedChart, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const C = { accent: "#ea7c21", textMuted: "#9ca3af", borderLight: "#f0f2f5", green: "#059669", red: "#dc2626", blue: "#2563eb", purple: "#7c3aed" };

export function MileageTab({ data, stats }) {
  const { overallEff, avgInterval, effGrade } = stats;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Mileage Trend (km/L)</div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.accent} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" vertical />
              <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[42, 56]} tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-xl shadow-lg">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{label}</div>
                      <div className="text-sm font-bold text-orange-600">{Number(payload[0].value).toFixed(2)} km/L</div>
                    </div>
                  );
                }} 
              />
              <ReferenceLine y={overallEff} stroke={C.accent} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="avg" stroke={C.accent} fill="url(#eg)" strokeWidth={2.5}
                dot={(p) => {
                  const isMerged = p.payload.mergedCount > 0;
                  return <circle key={p.cx} cx={p.cx} cy={p.cy} r={isMerged ? 5 : 3.5} fill={isMerged ? C.purple : C.accent} strokeWidth={0} />;
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Litres / Fill</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" />
                <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[5.28, 5.35]} tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: 'rgba(200,200,200,0.1)'}} content={({ active, payload }) => active && payload?.length ? <div className="bg-white dark:bg-gray-800 p-2 shadow rounded-md border text-xs">{payload[0].value} L</div> : null} />
                <Bar dataKey="litre" fill={C.blue} radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Days Between Fills</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(1)} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" />
                <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: 'rgba(200,200,200,0.1)'}} content={({ active, payload }) => active && payload?.length ? <div className="bg-white dark:bg-gray-800 p-2 shadow rounded-md border text-xs">{payload[0].value} days</div> : null} />
                <ReferenceLine y={avgInterval} stroke={C.purple} strokeDasharray="4 4" />
                <Bar dataKey="daysSinceLast" fill={C.purple} radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold ${overallEff >= 51 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : overallEff >= 47 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
            {effGrade}
          </div>
          <div>
            <div className="text-sm font-bold font-sans dark:text-gray-100">Efficiency Score</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{overallEff.toFixed(1)} km/L overall</div>
            <div className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold text-white ${overallEff >= 51 ? 'bg-emerald-500' : overallEff >= 47 ? 'bg-orange-500' : 'bg-red-500'}`}>
              {overallEff >= 51 ? "Above average" : overallEff >= 47 ? "Average" : "Needs attention"}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm overflow-x-auto">
          <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Breakdown</div>
          <div className="min-w-[400px]">
             <div className="grid grid-cols-5 text-[9px] text-gray-400 tracking-wider uppercase pb-2 border-b border-gray-100 dark:border-gray-700">
               <div>Date</div><div>Dist</div><div>Fuel</div><div>km/L</div><div>±Avg</div>
             </div>
             {data.map((d, i) => {
               const diff = d.avg - overallEff;
               return (
                 <div key={i} className={`grid grid-cols-5 py-2.5 border-b border-gray-50 dark:border-gray-700 text-xs items-center ${d.mergedCount > 0 ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}>
                   <div className="text-gray-500 dark:text-gray-400">
                     {d.label}
                     {d.mergedCount > 0 && <span className="ml-1 inline-block px-1 rounded bg-blue-100 text-blue-600 text-[8px] font-bold">+{d.mergedCount} MERGED</span>}
                   </div>
                   <div className="text-gray-700 dark:text-gray-300">{d.diff} km</div>
                   <div className="text-blue-600 font-medium">{d.litre} L</div>
                   <div className="text-orange-600 font-bold">{d.avg.toFixed(2)}</div>
                   <div className={`font-bold ${diff >= 0 ? "text-emerald-500" : "text-red-500"}`}>{diff >= 0 ? "+" : ""}{diff.toFixed(1)}</div>
                 </div>
               )
             })}
          </div>
        </div>
      </div>
    </div>
  );
}

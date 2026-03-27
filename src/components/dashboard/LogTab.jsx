import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ChevronUp, ChevronDown } from 'lucide-react';

const C = {
  accent: "#ea7c21",
  green: "#059669",
  blue: "#2563eb",
  purple: "#7c3aed",
  red: "#dc2626",
  textMuted: "#9ca3af",
};

export function LogTab({ stats }) {
  const { rawLogData, data, totalDist, totalCost, totalFuel, avgRange, monthlySpend, cumData } = stats;
  const [exp, setExp] = useState({ log: true, summary: true });

  const toggleLog = () => setExp(p => ({ ...p, log: !p.log }));
  const toggleSummary = () => setExp(p => ({ ...p, summary: !p.summary }));

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Refuel Log Section */}
      <button onClick={toggleLog} className="w-full flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-2 rounded-lg">
        <span className="text-sm font-bold font-sans text-gray-900 dark:text-gray-100">Refuel Log</span>
        <span className="text-gray-400">{exp.log ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
      </button>

      {exp.log && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[1fr_.75fr_.75fr_.6fr_.6fr_.7fr_.7fr_.7fr] text-[9px] text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100 dark:border-gray-700">
              <div>Date</div><div>From</div><div>To</div><div>Dist</div><div>Fuel</div><div>Paid</div><div>km/L</div><div>₹/km</div>
            </div>
            <div className="flex flex-col">
               {rawLogData.map((d, i) => {
                 let trend = 0;
                 if (!d.isPartial && i > 0) {
                   const prevFull = rawLogData.slice(0, i).filter(x => !x.isPartial).pop();
                   if (prevFull) trend = d.avg - prevFull.avg;
                 }
                 return (
                   <div key={i} className={`grid grid-cols-[1fr_.75fr_.75fr_.6fr_.6fr_.7fr_.7fr_.7fr] py-2.5 items-center border-b border-gray-50 dark:border-gray-700/50 last:border-0 text-xs ${d.isPartial ? "bg-purple-50 dark:bg-purple-900/10" : ""}`}>
                      <div className={`font-medium ${d.isPartial ? 'text-purple-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        {d.label}
                        {d.isPartial && <span className="ml-1 inline-block px-1 rounded bg-purple-100 text-purple-700 text-[8px] font-bold">PARTIAL</span>}
                      </div>
                      <div className="text-gray-400">{d.from.toLocaleString()}</div>
                      <div className="text-gray-400">{d.to.toLocaleString()}</div>
                      <div className={`font-bold ${d.isPartial ? 'text-purple-600' : 'text-blue-600'}`}>{d.diff}</div>
                      <div className="text-gray-700 dark:text-gray-300">{d.litre}</div>
                      <div className="text-emerald-600 font-medium">₹{d.rupees}</div>
                      <div className={`font-bold ${d.isPartial ? 'text-gray-400' : 'text-orange-600'}`}>
                        {d.isPartial ? <span className="italic font-normal text-[10px]">pending</span> : (
                          <div className="flex items-center gap-1">
                            {d.avg.toFixed(2)}
                            {trend !== 0 && <span className={`text-[8px] ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{trend >= 0 ? '▲' : '▼'}</span>}
                          </div>
                        )}
                      </div>
                      <div className={d.isPartial ? 'text-gray-400' : 'text-purple-600 font-medium'}>
                        {d.isPartial ? <span className="italic font-normal text-[10px]">—</span> : `₹${d.costPerKm.toFixed(2)}`}
                      </div>
                   </div>
                 )
               })}
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats Section */}
      <button onClick={toggleSummary} className="w-full flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-2 rounded-lg mt-2">
        <span className="text-sm font-bold font-sans text-gray-900 dark:text-gray-100">Summary Stats</span>
        <span className="text-gray-400">{exp.summary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
      </button>

      {exp.summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
          {[
            { title: "Distance", items: [["Total", `${totalDist} km`], ["Avg/fill", `${avgRange.toFixed(0)} km`], ["Best", `${Math.max(...data.map(d => d.diff))} km`], ["Worst", `${Math.min(...data.map(d => d.diff))} km`]] },
             { title: "Fuel", items: [["Total", `${totalFuel.toFixed(2)} L`], ["Avg/fill", `${(totalFuel / data.length).toFixed(2)} L`], ["Avg ₹/L", `₹${(totalCost / totalFuel).toFixed(2)}`], ["Max cost", `₹${Math.max(...data.map(d => d.rupees))}`]] },
            { title: "Cost", items: [["Total", `₹${totalCost}`], ["Avg/fill", `₹${(totalCost / data.length).toFixed(0)}`], ["Best ₹/km", `₹${Math.min(...data.map(d => d.costPerKm)).toFixed(2)}`], ["Worst ₹/km", `₹${Math.max(...data.map(d => d.costPerKm)).toFixed(2)}`]] }
          ].map(s => (
            <div key={s.title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-3 font-semibold">{s.title}</div>
              <div className="flex flex-col gap-0">
                {s.items.map(([k,v]) => (
                  <div key={k} className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0 text-xs">
                     <span className="text-gray-500 dark:text-gray-400">{k}</span>
                     <span className="font-bold text-gray-900 dark:text-gray-100 font-sans">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm font-bold font-sans text-gray-900 dark:text-gray-100 py-3 border-b border-gray-200 dark:border-gray-700">Monthly Breakdown</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
           <div className="grid grid-cols-[1.2fr_.6fr_1fr_.8fr] text-[9px] text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100 dark:border-gray-700">
             <div>Month</div><div>Fills</div><div>Dist</div><div>Spent</div>
           </div>
           {monthlySpend.map((m,i) => (
             <div key={i} className="grid grid-cols-[1.2fr_.6fr_1fr_.8fr] py-2.5 items-center border-b border-gray-50 dark:border-gray-700/50 last:border-0 text-xs">
                <div className="text-orange-600 font-bold">{m.month}</div>
                <div className="text-gray-500 dark:text-gray-400">{m.fills}×</div>
                <div className="text-blue-600 font-medium">{m.dist} km</div>
                <div className="text-emerald-600 font-medium">₹{m.cost}</div>
             </div>
           ))}
         </div>
         <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
           <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Cumulative Spend</div>
           <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <defs>
                   <linearGradient id="cmg" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={C.green} stopOpacity={0.15} />
                     <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" vertical />
                <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 10 }} tickFormatter={(v) => `₹${v}`} axisLine={false} tickLine={false} />
                <RechartsTooltip content={({ active, payload, label }) => {
                  if(!active || !payload?.length) return null;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 shadow rounded-xl text-[10px] text-gray-500 uppercase tracking-widest">
                       {label} <div className="text-emerald-600 font-bold text-sm mt-1">₹{payload[0].value} total</div>
                    </div>
                  )
                }} />
                <Area type="monotone" dataKey="cumCost" stroke={C.green} fill="url(#cmg)" strokeWidth={2.5} dot={{ fill: C.green, r: 3.5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
           </div>
         </div>
      </div>
    </div>
  );
}

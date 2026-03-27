import React from 'react';
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';

const C = {
  accent: "#ea7c21",
  green: "#059669",
  blue: "#2563eb",
  purple: "#7c3aed",
  red: "#dc2626",
  textMuted: "#9ca3af",
};

export function ForecastTab({ stats }) {
  const { data, pendingPartials, nextRefuelDate, nextRefuelOdo, avgCostKm, avgRange, totalFuel, daysToNext, kmToNext, TODAY, lastDate, avgInterval, forecastData, milestones, currentOdo } = stats;

  const elapsed = Math.round((TODAY - lastDate) / 86400000);
  const rawPct = avgInterval > 0 ? (elapsed / avgInterval) * 100 : 0;
  const pct = Math.min(100, Math.max(0, rawPct));
  const bc = pct > 85 ? C.red : pct > 60 ? C.accent : C.green;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200/50 dark:border-orange-500/20 rounded-2xl p-5 shadow-sm">
        <div className="text-[10px] text-orange-600/80 dark:text-orange-400/80 tracking-widest uppercase mb-4 font-bold text-center">Next Refuel Prediction</div>
        <div className="grid grid-cols-3 gap-4 text-center">
           {[
             { sub: "Date", val: nextRefuelDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), extra: daysToNext > 0 ? `in ~${daysToNext}d` : "overdue", c: "text-orange-600 dark:text-orange-500" },
             { sub: "Odometer", val: nextRefuelOdo.toLocaleString(), extra: `+${kmToNext} km`, c: "text-blue-600 dark:text-blue-400" },
             { sub: "Cost", val: `₹${Math.round(avgCostKm * avgRange)}`, extra: `~${(totalFuel / data.length).toFixed(1)}L`, c: "text-emerald-600 dark:text-emerald-500" },
           ].map(it => (
             <div key={it.sub}>
               <div className="text-[9px] text-orange-600/60 dark:text-orange-400/60 uppercase tracking-widest mb-1.5 font-bold">{it.sub}</div>
               <div className={`text-xl md:text-2xl font-extrabold font-sans ${it.c}`}>{it.val}</div>
               <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{it.extra}</div>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-3 font-semibold">Fill Cycle Progress</div>
        <div className="flex justify-between text-[10px] text-gray-500 mb-2">
           <span>{data.length ? data[data.length - 1].label : 'N/A'}</span>
           <span className="font-bold text-orange-600">{Math.round(pct)}%</span>
           <span>~{nextRefuelDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
           <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, backgroundImage: `linear-gradient(90deg, ${C.green}, ${bc})` }} />
        </div>
        {pendingPartials.length > 0 && (
          <div className="mt-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{pendingPartials.length} partial top-up(s) in current cycle (₹{pendingPartials.reduce((s,p) => s+p.rupees, 0)})</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Trend + Forecast</div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <defs>
                   <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={C.accent} stopOpacity={0.1} />
                     <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.2)" vertical />
                <XAxis dataKey="label" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[42, 56]} tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={({ active, payload, label }) => {
                  if(!active || !payload?.length) return null;
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-xl shadow">
                      <div className="text-[10px] text-gray-500 uppercase">{label}</div>
                      <div className={`${payload[0].payload.type === 'forecast' ? 'text-blue-600' : 'text-orange-600'} font-bold text-sm`}>
                        {payload[0].value} km/L
                      </div>
                    </div>
                  )
                }} />
                <Area type="monotone" dataKey="efficiency" stroke={C.accent} fill="url(#fg)" strokeWidth={2.5} 
                  dot={(p) => {
                    const isFc = p.payload.type === "forecast";
                    return <circle key={p.cx} cx={p.cx} cy={p.cy} r={isFc ? 5 : 3.5} fill={isFc ? C.blue : C.accent} strokeWidth={0} />
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
           <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">Upcoming Fills</div>
           <div className="flex flex-col text-xs">
             <div className="grid grid-cols-[.4fr_1fr_1fr_.8fr_.8fr] text-[9px] text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100 dark:border-gray-700">
                <div>#</div><div>Date</div><div>Odo</div><div>Dist</div><div>Cost</div>
             </div>
             {[1,2,3,4].map(n => {
                const d = new Date(lastDate.getTime() + n * avgInterval * 86400000);
                const odo = Math.round(currentOdo + n * avgRange);
                const cost = Math.round(avgCostKm * avgRange);
                const isN = n === 1;
                return (
                  <div key={n} className="grid grid-cols-[.4fr_1fr_1fr_.8fr_.8fr] py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0 items-center">
                    <div className={`${isN ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>#{n}</div>
                    <div className={`${isN ? 'text-orange-600 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>{d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: '2-digit' })}</div>
                    <div className="text-gray-700 dark:text-gray-300 font-medium">{odo.toLocaleString()}</div>
                    <div className="text-blue-600 font-medium">~{Math.round(avgRange)}</div>
                    <div className="text-emerald-600 font-bold">₹{cost}</div>
                  </div>
                )
             })}
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-4 font-semibold">Odometer Milestones</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
           {milestones.map((m, i) => {
              const bgCols = ["bg-orange-50 dark:bg-orange-900/20", "bg-blue-50 dark:bg-blue-900/20", "bg-purple-50 dark:bg-purple-900/20", "bg-emerald-50 dark:bg-emerald-900/20"];
              const txtCols = ["text-orange-600 dark:text-orange-400", "text-blue-600 dark:text-blue-400", "text-purple-600 dark:text-purple-400", "text-emerald-600 dark:text-emerald-400"];
              return (
                <div key={m.milestone} className={`${bgCols[i % 4]} rounded-2xl p-4 text-center border border-transparent dark:border-gray-700/30`}>
                   <div className={`text-xl font-extrabold font-sans ${txtCols[i % 4]}`}>{m.milestone.toLocaleString()}</div>
                   <div className="text-[8px] text-gray-500 tracking-widest uppercase mt-0.5 mb-1.5">km milestone</div>
                   <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{m.date}</div>
                   <div className="text-[10px] text-gray-500 mt-1">+{m.kmNeeded.toLocaleString()} km</div>
                </div>
              )
           })}
        </div>
      </div>
    </div>
  );
}

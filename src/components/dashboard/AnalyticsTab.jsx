import React, { useMemo } from "react";
import {
  ComposedChart,
  AreaChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Legend
} from "recharts";
import { Calendar, TrendingUp, ScatterChart as ScatterIcon, Activity } from "lucide-react";

const C = {
  accent: "#ea7c21",
  green: "#059669",
  blue: "#2563eb",
  purple: "#7c3aed",
  red: "#dc2626",
};

export function AnalyticsTab({ data, stats }) {
  const { monthlySpend } = stats;

  const cumulativeData = useMemo(() => {
    let accCost = 0;
    let accDist = 0;
    return data.map(d => {
      accCost += d.rupees;
      accDist += d.diff;
      return {
        label: d.label,
        cumCost: accCost,
        cumDist: accDist
      };
    });
  }, [data]);

  const scatterData = useMemo(() => {
    return data.map(d => ({
      price: parseFloat(d.pricePerLitre.toFixed(2)),
      efficiency: parseFloat(d.avg.toFixed(2)),
      name: d.label
    }));
  }, [data]);

  const daysScatterData = useMemo(() => {
    return data.filter(d => d.daysSinceLast != null).map(d => ({
      days: d.daysSinceLast,
      efficiency: parseFloat(d.avg.toFixed(2)),
      name: d.label
    }));
  }, [data]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Monthly Performance Aggregation */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-purple-500" />
          <div className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
            Monthly Spend vs Distance
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlySpend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" className="dark:stroke-gray-700" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}km`} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" dataKey="cost" name="Total Spend (₹)" fill={C.purple} radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Line yAxisId="right" type="monotone" dataKey="dist" name="Distance (km)" stroke={C.accent} strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price vs Efficiency Correlation */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ScatterIcon size={16} className="text-blue-500" />
            <div className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
              Fuel Price vs Efficiency
            </div>
          </div>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ec" className="dark:stroke-gray-700" />
                 <XAxis type="number" dataKey="price" name="Fuel Price" unit="₹/L" domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                 <YAxis type="number" dataKey="efficiency" name="Efficiency" unit="km/L" domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                 <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Scatter name="Logs" data={scatterData} fill={C.blue} />
               </ScatterChart>
             </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">Analyze if paying for premium fuel affects your mileage.</p>
        </div>

        {/* Fill Interval vs Efficiency */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-green-500" />
            <div className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
              Days Between Fills vs Efficiency
            </div>
          </div>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ec" className="dark:stroke-gray-700" />
                 <XAxis type="number" dataKey="days" name="Days" unit="d" domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                 <YAxis type="number" dataKey="efficiency" name="Efficiency" unit="km/L" domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                 <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Scatter name="Logs" data={daysScatterData} fill={C.green} />
               </ScatterChart>
             </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">See if leaving fuel in the tank longer impacts efficiency.</p>
        </div>
      </div>

      {/* Cumulative Data */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-orange-500" />
          <div className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
            Cumulative Trajectory
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cumulativeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" className="dark:stroke-gray-700" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}km`} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area yAxisId="left" type="monotone" dataKey="cumCost" name="Accumulated Cost (₹)" stroke={C.green} fillOpacity={1} fill="url(#colorCumCost)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="cumDist" name="Accumulated Dist (km)" stroke={C.blue} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

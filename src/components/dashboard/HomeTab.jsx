import React from "react";
import { StatCard } from "./StatCard";
import { MiniGauge } from "./MiniGauge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  MapPin,
  IndianRupee,
  Droplet,
  Repeat,
  Activity,
  Gauge,
} from "lucide-react";

const C = {
  accent: "#ea7c21",
  accentLight: "#fef3e2",
  green: "#059669",
  greenLight: "#e6f9f0",
  blue: "#2563eb",
  blueLight: "#eff4ff",
  purple: "#7c3aed",
  purpleLight: "#f3eeff",
  red: "#dc2626",
  redLight: "#fef2f2",
};

export function HomeTab({ data, stats }) {
  const {
    currentOdo,
    totalDist,
    totalCost,
    totalFuel,
    savedVsWorst,
    overallEff,
    avgCostKm,
    avgRange,
    avgInterval,
    bestEff,
    worstEff,
  } = stats;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <StatCard
          label="Current Odometer"
          value={`${currentOdo.toLocaleString()} km`}
          color={C.accent}
          ic={<Gauge size={20} />}
          soft={C.accentLight}
        />
        <StatCard
          label="Distance Tracked"
          value={`${totalDist.toLocaleString()} km`}
          color={C.blue}
          ic={<MapPin size={20} />}
          soft={C.blueLight}
        />
        <StatCard
          label="Total Spent"
          value={`₹${totalCost}`}
          color={C.green}
          ic={<IndianRupee size={20} />}
          soft={C.greenLight}
        />
        <StatCard
          label="Total Fuel"
          value={`${totalFuel.toFixed(1)} L`}
          color={C.blue}
          ic={<Droplet size={20} />}
          soft={C.blueLight}
        />
        <StatCard
          label="Fill-ups"
          value={data.length}
          sub={
            data.some((d) => d.mergedCount > 0)
              ? `${data.filter((d) => d.mergedCount > 0).length} include merged partials`
              : "times"
          }
          color={C.purple}
          ic={<Repeat size={20} />}
          soft={C.purpleLight}
        />
        <StatCard
          label="Saved vs Worst"
          value={`₹${savedVsWorst}`}
          sub="vs worst mileage"
          color={C.green}
          ic={<Activity size={20} />}
          soft={C.greenLight}
          className="col-span-2 xl:col-span-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">
            Performance Snapshot
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
            <MiniGauge
              value={overallEff}
              min={40}
              max={60}
              unit="km/L"
              color={C.accent}
              label="Mileage"
            />
            <MiniGauge
              value={avgCostKm}
              min={1.5}
              max={2.5}
              unit="₹/km"
              color={C.green}
              label="Cost"
            />
            <MiniGauge
              value={avgRange}
              min={220}
              max={300}
              unit="km"
              color={C.blue}
              label="Range"
            />
            <MiniGauge
              value={avgInterval}
              min={8}
              max={30}
              unit="days"
              color={C.purple}
              label="Interval"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
          <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-3 font-semibold">
            Distance Per Fill
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 4, bottom: 0, left: -20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e4e7ec"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[220, 300]}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const entry = payload[0]?.payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl shadow-lg">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 flex items-center">
                          {label}
                        </div>
                        <div
                          className="text-sm font-bold"
                          style={{
                            color: entry?.mergedCount > 0 ? C.purple : C.accent,
                          }}
                        >
                          {payload[0].value} km
                        </div>
                        {entry?.mergedCount > 0 && (
                          <div className="text-[10px] text-purple-600 mt-1">
                            Includes {entry.mergedCount} partial fill(s)
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  y={avgRange}
                  stroke={C.accent}
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                />
                <Bar
                  dataKey="diff"
                  fill={C.accent}
                  radius={[5, 5, 0, 0]}
                  opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            l: "Best",
            v: bestEff.toFixed(1),
            c: C.green,
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            txt: "text-emerald-700 dark:text-emerald-400",
            d: data.find((d) => d.avg === bestEff)?.label,
          },
          {
            l: "Average",
            v: overallEff.toFixed(1),
            c: C.accent,
            bg: "bg-orange-50 dark:bg-orange-900/20",
            txt: "text-orange-700 dark:text-orange-400",
            d: "overall",
          },
          {
            l: "Worst",
            v: worstEff.toFixed(1),
            c: C.red,
            bg: "bg-red-50 dark:bg-red-900/20",
            txt: "text-red-700 dark:text-red-400",
            d: data.find((d) => d.avg === worstEff)?.label,
          },
        ].map((s) => (
          <div
            key={s.l}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-center shadow-sm"
          >
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-semibold">
              {s.l}
            </div>
            <div
              className="text-[26px] font-extrabold font-sans"
              style={{ color: s.c }}
            >
              {s.v}
            </div>
            <div className="text-[11px] text-gray-500 mb-2">km/L</div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${s.bg} ${s.txt}`}
            >
              {s.d}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

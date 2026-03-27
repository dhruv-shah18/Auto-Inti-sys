import { useMemo } from 'react';

export const RAW_DATA = [
  { from: 32837, to: 33103, diff: 266, avg: 50.09, rupees: 500, litre: 5.31, date: "2025-11-07", isPartial: false },
  { from: 33103, to: 33387, diff: 284, avg: 53.48, rupees: 500, litre: 5.31, date: "2025-11-19", isPartial: false },
  { from: 33387, to: 33662, diff: 275, avg: 51.69, rupees: 510, litre: 5.32, date: "2025-12-02", isPartial: false },
  { from: 34119, to: 34394, diff: 275, avg: 51.89, rupees: 500, litre: 5.3, date: "2026-01-01", isPartial: false },
  { from: 34394, to: 34679, diff: 285, avg: 53.67, rupees: 500, litre: 5.31, date: "2026-01-13", isPartial: false },
  { from: 34679, to: 34955, diff: 276, avg: 51.98, rupees: 500, litre: 5.31, date: "2026-01-30", isPartial: false },
  { from: 34955, to: 35195, diff: 240, avg: 45.2, rupees: 500, litre: 5.31, date: "2026-02-08", isPartial: false },
  { from: 35195, to: 35451, diff: 256, avg: 48.21, rupees: 500, litre: 5.31, date: "2026-03-03", isPartial: false },
  { from: 35451, to: 35729, diff: 278, avg: 52.35, rupees: 500, litre: 5.31, date: "2026-03-15", isPartial: false },
];

function mergePartialFills(rawData) {
  const merged = [];
  let pendingPartials = [];
  for (const entry of rawData) {
    if (entry.isPartial) {
      pendingPartials.push(entry);
    } else {
      if (pendingPartials.length > 0) {
        const firstPartial = pendingPartials[0];
        const totalLitres = pendingPartials.reduce((s, p) => s + p.litre, 0) + entry.litre;
        const totalRupees = pendingPartials.reduce((s, p) => s + p.rupees, 0) + entry.rupees;
        const from = firstPartial.from;
        const diff = entry.to - from;
        merged.push({
          ...entry,
          from,
          diff,
          litre: parseFloat(totalLitres.toFixed(2)),
          rupees: totalRupees,
          avg: parseFloat((diff / totalLitres).toFixed(2)),
          mergedCount: pendingPartials.length,
          partialEntries: [...pendingPartials],
        });
        pendingPartials = [];
      } else {
        merged.push({ ...entry, mergedCount: 0, partialEntries: [] });
      }
    }
  }
  return { merged, pendingPartials };
}

export function useFuelData() {
  return useMemo(() => {
    const { merged: MERGED_DATA, pendingPartials } = mergePartialFills(RAW_DATA);
    
    const data = MERGED_DATA.map((d, i) => {
      const pricePerLitre = d.rupees / d.litre;
      const costPerKm = d.rupees / d.diff;
      const dateObj = new Date(d.date);
      const label = dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      const prev = i > 0 ? new Date(MERGED_DATA[i - 1].date) : null;
      const daysSinceLast = prev ? Math.round((dateObj - prev) / 86400000) : null;
      return { ...d, pricePerLitre, costPerKm, label, daysSinceLast, dateObj };
    });

    const rawLogData = RAW_DATA.map((d) => {
      const pricePerLitre = d.rupees / d.litre;
      const costPerKm = d.isPartial ? null : d.rupees / d.diff;
      const dateObj = new Date(d.date);
      const label = dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      return { ...d, pricePerLitre, costPerKm, label, dateObj };
    });

    const totalDist = data.reduce((s, d) => s + d.diff, 0);
    const totalFuel = data.reduce((s, d) => s + d.litre, 0);
    const totalCost = data.reduce((s, d) => s + d.rupees, 0);
    const overallEff = totalDist / totalFuel;
    const avgCostKm = totalCost / totalDist;
    const avgRange = totalDist / Math.max(1, data.length);
    const avgInterval = data.length > 1 ? data.slice(1).reduce((s, d) => s + d.daysSinceLast, 0) / (data.length - 1) : 0;
    const bestEff = data.length ? Math.max(...data.map((d) => d.avg)) : 0;
    const worstEff = data.length ? Math.min(...data.map((d) => d.avg)) : 0;
    
    const currentOdo = data.length ? data[data.length - 1].to : 0;
    const lastDate = data.length ? new Date(data[data.length - 1].date) : new Date();
    const nextRefuelDate = new Date(lastDate.getTime() + avgInterval * 86400000);
    const nextRefuelOdo = Math.round(currentOdo + avgRange);
    
    const projMonthlyKm = avgInterval ? Math.round((avgRange / avgInterval) * 30) : 0;
    const projMonthlyCost = Math.round(projMonthlyKm * avgCostKm);
    const projYearlyCost = projMonthlyCost * 12;
    const kmToNext = nextRefuelOdo - currentOdo;
    const TODAY = new Date();
    const daysToNext = Math.round((nextRefuelDate - TODAY) / 86400000);
    
    const worstCostTotal = data.reduce((s, d) => s + (d.diff / worstEff) * (d.rupees / d.litre), 0);
    const savedVsWorst = Math.round(worstCostTotal - totalCost);
    const effGrade = overallEff >= 53 ? "A+" : overallEff >= 51 ? "A" : overallEff >= 49 ? "B+" : overallEff >= 47 ? "B" : "C";

    const forecastData = [
      ...data.map((d) => ({ label: d.label, efficiency: d.avg, type: "actual" })),
      {
        label: nextRefuelDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        efficiency: parseFloat(overallEff.toFixed(2)),
        type: "forecast",
      },
    ];

    const milestones = [40000, 50000, 75000, 100000]
      .filter((m) => m > currentOdo)
      .slice(0, 4)
      .map((m) => {
        const kmNeeded = m - currentOdo;
        const daysNeeded = Math.round((kmNeeded / avgRange) * avgInterval);
        const date = new Date(TODAY.getTime() + daysNeeded * 86400000);
        return {
          milestone: m,
          kmNeeded,
          date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", }),
        };
      });

    const monthlySpend = Object.values(
      data.reduce((acc, d) => {
        const key = new Date(d.date).toLocaleDateString("en-IN", { month: "short", year: "2-digit", });
        if (!acc[key]) acc[key] = { month: key, cost: 0, dist: 0, fills: 0 };
        acc[key].cost += d.rupees;
        acc[key].dist += d.diff;
        acc[key].fills += 1;
        return acc;
      }, {})
    );

    return {
      RAW_DATA,
      data,
      rawLogData,
      pendingPartials,
      totalDist,
      totalFuel,
      totalCost,
      overallEff,
      avgCostKm,
      avgRange,
      avgInterval,
      bestEff,
      worstEff,
      currentOdo,
      lastDate,
      nextRefuelDate,
      nextRefuelOdo,
      projMonthlyKm,
      projMonthlyCost,
      projYearlyCost,
      kmToNext,
      daysToNext,
      savedVsWorst,
      effGrade,
      forecastData,
      milestones,
      monthlySpend,
      TODAY
    };
  }, []);
}

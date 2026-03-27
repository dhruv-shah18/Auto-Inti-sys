import React from 'react';

export function MiniGauge({ value, min, max, unit, color, label: gl }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = 38, cx = 50, cy = 50;
  
  const toRad = (d) => ((d - 90) * Math.PI) / 180;
  
  const arc = (s, e) => {
    const x1 = cx + r * Math.cos(toRad(s));
    const y1 = cy + r * Math.sin(toRad(s));
    const x2 = cx + r * Math.cos(toRad(e));
    const y2 = cy + r * Math.sin(toRad(e));
    return `M ${x1} ${y1} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };

  return (
    <div className="text-center">
      <svg className="w-full max-w-[120px] mx-auto" viewBox="0 0 100 75">
        <path
          d={arc(-135, 135)}
          fill="none"
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <path
          d={arc(-135, -135 + pct * 270)}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          className="fill-gray-900 dark:fill-white text-sm font-bold"
        >
          {value < 10 ? value.toFixed(2) : value.toFixed(1)}
        </text>
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-gray-400 text-[9px]"
        >
          {unit}
        </text>
      </svg>
      <div className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wider -mt-1 uppercase font-semibold">
        {gl}
      </div>
    </div>
  );
}

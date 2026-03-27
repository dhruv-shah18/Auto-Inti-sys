import React from 'react';

export function StatCard({ label, value, sub, color, ic, soft, cls }) {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 transition-shadow hover:shadow-lg ${cls || ""}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1.5 font-semibold">
            {label}
          </div>
          <div className="text-2xl font-extrabold font-sans" style={{ color }}>
            {value}
          </div>
          {sub && (
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {sub}
            </div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: soft, color }}
        >
          {ic}
        </div>
      </div>
    </div>
  );
}

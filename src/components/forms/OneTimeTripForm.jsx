import React, { useState } from "react";
import { X, Navigation, Plus, Check } from "lucide-react";

export default function OneTimeTripForm({ isOpen, onClose, onSubmit, avgKmPerLitre, avgPricePerLitre }) {
  const [tripName, setTripName] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = () => {
    if (!tripName || !distanceKm) return alert("Fill all fields");
    onSubmit?.({ type: "onetime_trip", name: tripName, distanceKm: parseFloat(distanceKm) });
    setSubmitSuccess(true);
    setTimeout(() => { onClose(); setSubmitSuccess(false); }, 1000);
  };

  const estFuel = parseFloat(distanceKm) / avgKmPerLitre || 0;
  const estCost = estFuel * avgPricePerLitre || 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl animate-in zoom-in-95">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center"><Navigation size={20} /></div>
              <div>
                <h2 className="text-xl font-extrabold font-outfit text-gray-900 dark:text-gray-100">One-Time Trip</h2>
                <p className="text-xs text-gray-500 mt-0.5">Plan a single journey</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500"><X size={18} /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Trip Name</label>
              <input type="text" value={tripName} onChange={e => setTripName(e.target.value)} placeholder="Weekend Gateway" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-orange-500 dark:text-white" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Total Distance (km)</label>
              <input type="number" value={distanceKm} onChange={e => setDistanceKm(e.target.value)} placeholder="450" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-orange-500 dark:text-white" />
            </div>

            {distanceKm > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                 <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-200 dark:border-orange-800/30">
                    <div className="text-[10px] font-bold text-orange-600/70 uppercase">Est. Fuel Needed</div>
                    <div className="text-xl font-bold text-orange-600">{estFuel.toFixed(1)} L</div>
                 </div>
                 <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                    <div className="text-[10px] font-bold text-emerald-600/70 uppercase">Est. Fuel Cost</div>
                    <div className="text-xl font-bold text-emerald-600">₹{estCost.toFixed(0)}</div>
                 </div>
              </div>
            )}

            <button onClick={handleSubmit} className={`w-full py-3.5 mt-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-colors ${submitSuccess ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-700'}`}>
              {submitSuccess ? <><Check size={18} /> Planned</> : <><Plus size={18} /> Plan Trip</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

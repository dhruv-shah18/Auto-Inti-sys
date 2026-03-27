import React, { useState, useEffect } from "react";
import { X, Repeat, Plus, Check } from "lucide-react";

export default function DailyTripForm({ isOpen, onClose, onSubmit }) {
  const [tripName, setTripName] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [selectedDays, setSelectedDays] = useState(["mon", "tue", "wed", "thu", "fri"]);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => { if (isOpen) setSubmitSuccess(false); }, [isOpen]);

  const toggleDay = (day) => setSelectedDays((pr) => pr.includes(day) ? pr.filter((d) => d !== day) : [...pr, day]);

  const handleSubmit = () => {
    if (!tripName || !distanceKm || selectedDays.length === 0) return alert("Fill all fields");
    const oneWayKm = parseFloat(distanceKm);
    
    onSubmit?.({
      type: "daily_trip", name: tripName, oneWayKm, dailyKm: isRoundTrip ? oneWayKm * 2 : oneWayKm,
      activeDays: selectedDays, isRoundTrip,
    });
    setSubmitSuccess(true);
    setTimeout(() => onClose(), 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl animate-in zoom-in-95">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><Repeat size={20} /></div>
              <div>
                <h2 className="text-xl font-extrabold font-outfit text-gray-900 dark:text-gray-100">Daily Trip</h2>
                <p className="text-xs text-gray-500 mt-0.5">Recurring commute routes</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500"><X size={18} /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Trip Name</label>
              <input type="text" value={tripName} onChange={e => setTripName(e.target.value)} placeholder="Office Commute" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-orange-500 dark:text-white" />
            </div>

            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">One-Way Dist (km)</label>
                 <input type="number" value={distanceKm} onChange={e => setDistanceKm(e.target.value)} placeholder="12.5" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-orange-500 dark:text-white" />
               </div>
               <div className="pt-7 flex items-center gap-2">
                 <button type="button" onClick={() => setIsRoundTrip(p => !p)} className={`w-10 h-6 rounded-full relative transition-colors ${isRoundTrip ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isRoundTrip ? 'left-5' : 'left-1'}`} />
                 </button>
                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Round Trip</span>
               </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Active Days</label>
              <div className="flex justify-between">
                {[ {k:'mon',l:'M'}, {k:'tue',l:'T'}, {k:'wed',l:'W'}, {k:'thu',l:'T'}, {k:'fri',l:'F'}, {k:'sat',l:'S'}, {k:'sun',l:'S'} ].map(d => (
                  <button key={d.k} onClick={() => toggleDay(d.k)} className={`w-10 h-10 rounded-full font-bold text-xs transition-colors ${selectedDays.includes(d.k) ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'}`}>{d.l}</button>
                 ))}
              </div>
            </div>

            <button onClick={handleSubmit} className={`w-full py-3.5 mt-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-colors ${submitSuccess ? 'bg-green-500' : 'bg-orange-500 hover:bg-orange-600'}`}>
              {submitSuccess ? <><Check size={18} /> Added</> : <><Plus size={18} /> Add Trip</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

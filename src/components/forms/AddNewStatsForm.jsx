import React, { useState, useEffect } from "react";
import { X, Droplet, Info, Zap } from "lucide-react";

export default function AddNewStatsForm({ isOpen, onClose, onSubmit, lastOdometer }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({ date: today, from: lastOdometer ?? "", to: "", rupees: "", litre: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [isPartial, setIsPartial] = useState(false);

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

  const diff = parseFloat(form.to) - parseFloat(form.from);
  const validDiff = !isNaN(diff) && diff > 0;
  const validCalc = validDiff && parseFloat(form.rupees) > 0 && parseFloat(form.litre) > 0;
  const mileage = validCalc ? (diff / parseFloat(form.litre)).toFixed(2) : null;
  const cpk = validCalc ? (parseFloat(form.rupees) / diff).toFixed(2) : null;
  const ppl = validCalc ? (parseFloat(form.rupees) / parseFloat(form.litre)).toFixed(2) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
    const e = {};
    if (!form.date) e.date = "Required";
    if (!form.from) e.from = "Required";
    if (!form.to || parseFloat(form.to) <= parseFloat(form.from)) e.to = "Must be > From";
    if (!form.rupees || parseFloat(form.rupees) <= 0) e.rupees = "Required";
    if (!form.litre || parseFloat(form.litre) <= 0) e.litre = "Required";
    setErrors(e);

    if (Object.keys(e).length > 0) return;

    onSubmit({
      from: parseFloat(form.from), to: parseFloat(form.to), diff, avg: parseFloat(mileage),
      rupees: parseFloat(form.rupees), litre: parseFloat(form.litre), date: form.date, notes: form.notes, isPartial,
    });
    handleClose();
  };

  const handleClose = () => {
    setForm({ date: today, from: lastOdometer ?? "", to: "", rupees: "", litre: "", notes: "" });
    setIsPartial(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-extrabold font-outfit text-gray-900 dark:text-gray-100">
                {isPartial ? <><span className="text-purple-600">Partial</span> Fill-up</> : "Add Fuel Entry"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">{isPartial ? "Merges with next full fill" : "Log a new fill-up session"}</p>
            </div>
            <button onClick={handleClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"><X size={18} /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border ${errors.date ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl outline-none focus:border-orange-500 dark:text-white`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">From Odo</label>
                <input type="number" name="from" value={form.from} onChange={handleChange} placeholder="e.g. 35451" className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border ${errors.from ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl outline-none focus:border-orange-500 dark:text-white`} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">To Odo</label>
                <input type="number" name="to" value={form.to} onChange={handleChange} placeholder="e.g. 35720" className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border ${errors.to ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl outline-none focus:border-orange-500 dark:text-white`} />
              </div>
            </div>

            {validDiff && (
              <div className={`p-3 rounded-xl flex justify-between items-center ${isPartial ? 'bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30' : 'bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30'}`}>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Distance</span>
                <span className={`text-lg font-extrabold ${isPartial ? 'text-purple-600' : 'text-orange-600'}`}>{diff} km</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Amount (₹)</label>
                <input type="number" name="rupees" value={form.rupees} onChange={handleChange} placeholder="500" className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border ${errors.rupees ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl outline-none focus:border-orange-500 dark:text-white`} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Litres</label>
                <input type="number" step="0.01" name="litre" value={form.litre} onChange={handleChange} placeholder="5.31" className={`w-full p-3 bg-gray-50 dark:bg-gray-800 border ${errors.litre ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl outline-none focus:border-orange-500 dark:text-white`} />
              </div>
            </div>

            {validCalc && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                {isPartial && (
                  <div className="absolute inset-0 bg-purple-50/90 dark:bg-purple-900/90 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                     <Info className="text-purple-600 mb-2" />
                     <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Mileage calculated on next full fill</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg"><div className="text-[9px] text-orange-600 uppercase font-bold">Mileage</div><div className="text-lg font-bold text-orange-600">{mileage}</div></div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg"><div className="text-[9px] text-green-600 uppercase font-bold">Cost/km</div><div className="text-lg font-bold text-green-600">₹{cpk}</div></div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg"><div className="text-[9px] text-blue-600 uppercase font-bold">Price/L</div><div className="text-lg font-bold text-blue-600">₹{ppl}</div></div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Notes</label>
              <input type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="City, AC on" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-orange-500 dark:text-white" />
            </div>

            <div className={`mt-4 p-4 rounded-xl border flex items-center justify-between ${isPartial ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}>
               <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPartial ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}><Droplet size={20} /></div>
                  <div>
                    <div className={`text-sm font-bold ${isPartial ? 'text-purple-700 dark:text-purple-400' : 'text-gray-900 dark:text-gray-100'}`}>Partial Refill</div>
                    <div className="text-[10px] text-gray-500">Topped up before empty</div>
                  </div>
               </div>
               <button type="button" onClick={() => setIsPartial(p => !p)} className={`w-12 h-6 rounded-full relative transition-colors ${isPartial ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                 <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isPartial ? 'left-6' : 'left-0.5'}`} />
               </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleClose} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleSubmit} className={`flex-[1.5] py-3 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2 ${isPartial ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'}`}>Save Entry</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

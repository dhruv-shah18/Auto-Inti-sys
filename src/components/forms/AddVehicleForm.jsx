import React, { useState } from "react";
import { X, Bike, Car, Plus } from "lucide-react";

export default function AddVehicleForm({ isOpen, onClose, onSubmit }) {
  const [vehicle, setVehicle] = useState({ id: Date.now(), name: '', type: '2-wheeler', fuelType: 'Petrol', maxAvg: '' });

  const handleChange = (field, value) => setVehicle(p => ({ ...p, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicle.name || !vehicle.maxAvg) return alert("Please fill all details!");
    onSubmit({ ...vehicle, id: Date.now(), maxAvg: parseFloat(vehicle.maxAvg) });
    setVehicle({ id: Date.now(), name: '', type: '2-wheeler', fuelType: 'Petrol', maxAvg: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 animate-in zoom-in-95">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-extrabold font-outfit text-gray-900 dark:text-gray-100">Add New Vehicle</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 font-bold uppercase tracking-widest">Vehicle Name</label>
                <input type="text" value={vehicle.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Honda City" required className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 dark:text-white" />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 font-bold uppercase tracking-widest">Type</label>
                   <div className="flex gap-2">
                      <button type="button" onClick={() => handleChange('type', '2-wheeler')} className={`flex-1 py-3 rounded-xl border transition-colors flex items-center justify-center ${vehicle.type === '2-wheeler' ? 'bg-orange-100 border-orange-500 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700'}`}><Bike size={18} /></button>
                      <button type="button" onClick={() => handleChange('type', '4-wheeler')} className={`flex-1 py-3 rounded-xl border transition-colors flex items-center justify-center ${vehicle.type === '4-wheeler' ? 'bg-orange-100 border-orange-500 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700'}`}><Car size={18} /></button>
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 font-bold uppercase tracking-widest">Fuel</label>
                   <select value={vehicle.fuelType} onChange={e => handleChange('fuelType', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 dark:text-white cursor-pointer h-[46px]">
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>EV</option>
                      <option>CNG</option>
                   </select>
                </div>
             </div>

             <div>
                <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1.5 font-bold uppercase tracking-widest">Max Average (km/L)</label>
                <input type="number" step="0.1" value={vehicle.maxAvg} onChange={e => handleChange('maxAvg', e.target.value)} placeholder="e.g. 18.5" required className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 dark:text-white" />
             </div>

             <button type="submit" className="w-full py-3.5 mt-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-transform active:scale-95">
                <Plus size={18} /> Add Vehicle
             </button>
          </form>
        </div>
      </div>
    </div>
  );
}

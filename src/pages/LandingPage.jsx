import React, { useState } from 'react';
import { Bike, Car, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export function LandingPage({ onComplete }) {
  const [email, setEmail] = useState('');
  const [vehicles, setVehicles] = useState([
    { id: 1, name: '', type: '2-wheeler', fuelType: 'Petrol', maxAvg: '' }
  ]);

  const addVehicle = () => {
    setVehicles([...vehicles, { id: Date.now(), name: '', type: '2-wheeler', fuelType: 'Petrol', maxAvg: '' }]);
  };

  const removeVehicle = (id) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const updateVehicle = (id, field, value) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email.");
    if (vehicles.some(v => !v.name || !v.maxAvg)) return alert("Please fill all vehicle details.");
    
    const userData = { email, vehicles };
    localStorage.setItem("fuelpulse_user", JSON.stringify(userData));
    onComplete(userData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#121212] transition-colors">
       <div className="absolute top-4 right-4"><ThemeToggle /></div>
       
       <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-500">
         <div className="bg-orange-500 p-8 text-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1iaWtlIj48Y2lyY2xlIGN4PSIxOC41IiBjeT0iMTcuNSIgcj0iMy41Ii8+PGNpcmNsZSBjeD0iNS41IiBjeT0iMTcuNSIgcj0iMy41Ii8+PHBhdGggZD0iTTE1IDZhMSAxIDAgMSAwIDAtMiAxIDEgMCAwIDAgMCAyem0xIDUtMy41LTMuNUw4IDEybDMgM2g0bDItNCIvPjwvc3ZnPg==')] bg-repeat opacity-90">
            <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-orange-500 shadow-xl mb-4">
              <Bike size={32} />
            </div>
            <h1 className="text-3xl font-extrabold font-outfit text-white tracking-tight">Welcome to FuelPulse</h1>
            <p className="text-orange-100 mt-2 text-sm font-medium">Your personal vehicle and fuel tracker.</p>
         </div>

         <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div>
               <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Your Email</label>
               <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@example.com" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-gray-100 transition-all" />
            </div>

            <div>
               <div className="flex items-center justify-between mb-4">
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Your Vehicles</label>
                 <button type="button" onClick={addVehicle} className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                    <Plus size={14} /> Add Another
                 </button>
               </div>
               
               <div className="space-y-4">
                 {vehicles.map((v, index) => (
                   <div key={v.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 relative group">
                      {vehicles.length > 1 && (
                        <button type="button" onClick={() => removeVehicle(v.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow hover:bg-red-200 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-semibold">Vehicle Name</label>
                          <input type="text" value={v.name} onChange={e => updateVehicle(v.id, 'name', e.target.value)} placeholder="e.g. Honda City" required className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-semibold">Max Average (km/L)</label>
                          <input type="number" step="0.1" value={v.maxAvg} onChange={e => updateVehicle(v.id, 'maxAvg', e.target.value)} placeholder="e.g. 18.5" required className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-semibold">Type</label>
                          <div className="grid grid-cols-2 gap-2">
                             <button type="button" onClick={() => updateVehicle(v.id, 'type', '2-wheeler')} className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${v.type === '2-wheeler' ? 'bg-orange-50 border-orange-500 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400'}`}>
                               <Bike size={14} /> 2-Wheeler
                             </button>
                             <button type="button" onClick={() => updateVehicle(v.id, 'type', '4-wheeler')} className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${v.type === '4-wheeler' ? 'bg-orange-50 border-orange-500 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400'}`}>
                               <Car size={14} /> 4-Wheeler
                             </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-semibold">Fuel Type</label>
                          <select value={v.fuelType} onChange={e => updateVehicle(v.id, 'fuelType', e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 dark:text-white appearance-none cursor-pointer">
                             <option>Petrol</option>
                             <option>Diesel</option>
                             <option>EV</option>
                             <option>CNG</option>
                          </select>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 transition-transform active:scale-[0.98]">
              Go to Dashboard <ArrowRight size={18} />
            </button>
         </form>
       </div>
    </div>
  );
}

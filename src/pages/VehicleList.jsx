import React, { useState } from 'react';
import { Bike, Car, Plus, ChevronRight, Fuel, Droplet, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import AddVehicleForm from '../components/forms/AddVehicleForm';

export function VehicleList({ user, onSelect, setUserData }) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col p-6 animate-in fade-in duration-300">
       <div className="w-full mx-auto flex-1 flex flex-col">
          <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center shadow-inner"><Bike size={24} /></div>
               <div>
                  <h1 className="text-2xl font-extrabold font-outfit text-gray-900 dark:text-gray-100 tracking-tight">Your Garage</h1>
                  <p className="text-sm text-gray-500 font-medium">Select a vehicle to view its dashboard</p>
               </div>
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => setAddOpen(true)} className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                   <Plus size={18} /> Add Vehicle
                </button>
                <div className="hidden sm:block"><ThemeToggle /></div>
             </div>
          </header>

          <div className="flex flex-col gap-4">
             {user.vehicles.map(v => (
               <button key={v.id} onClick={() => onSelect(v.id)} className="text-left group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden flex flex-row items-center w-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 dark:bg-orange-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  
                  <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center shadow-inner z-10 ${v.type === '2-wheeler' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                     {v.type === '2-wheeler' ? <Bike size={24} className="md:w-7 md:h-7" /> : <Car size={24} className="md:w-7 md:h-7" />}
                  </div>
                  
                  <div className="ml-4 md:ml-6 flex-1 z-10">
                     <h3 className="text-xl font-extrabold font-outfit text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{v.name}</h3>
                     <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded-lg">
                           <Droplet size={14} className="text-blue-500" /> {v.fuelType}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded-lg">
                           <Fuel size={14} className="text-emerald-500" /> {v.maxAvg} km/L
                        </div>
                     </div>
                  </div>

                  <div className="w-10 h-10 shrink-0 rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 z-10 ml-4">
                     <ChevronRight size={20} />
                  </div>
               </button>
             ))}

             <button onClick={() => setAddOpen(true)} className="group bg-gray-50/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 rounded-2xl p-4 flex flex-row items-center gap-4 md:gap-6 w-full transition-all duration-300">
                <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600 dark:group-hover:bg-orange-900/40 dark:group-hover:text-orange-400 flex items-center justify-center transition-colors">
                   <Plus size={24} />
                </div>
                <div className="text-sm md:text-base font-extrabold text-gray-500 dark:text-gray-400 group-hover:text-orange-600 transition-colors">Add New Vehicle</div>
             </button>
          </div>
       </div>

       <div className="fixed bottom-6 left-6 right-6 sm:hidden flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <ThemeToggle />
          <button onClick={() => setAddOpen(true)} className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20"><Plus size={18} /> Add Vehicle</button>
       </div>

       <AddVehicleForm isOpen={addOpen} onClose={() => setAddOpen(false)} onSubmit={(newV) => { 
          const updated = { ...user, vehicles: [...user.vehicles, newV] };
          localStorage.setItem("fuelpulse_user", JSON.stringify(updated));
          setUserData(updated);
       }} />
    </div>
  );
}

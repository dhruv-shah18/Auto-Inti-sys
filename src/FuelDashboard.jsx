import React, { useState, useEffect, useRef } from "react";
import { useFuelData } from "./hooks/useFuelData";
import { playChime } from "./utils/audio";
import { HomeTab } from "./components/dashboard/HomeTab";
import { MileageTab } from "./components/dashboard/MileageTab";
import { CostTab } from "./components/dashboard/CostTab";
import { ForecastTab } from "./components/dashboard/ForecastTab";
import { LogTab } from "./components/dashboard/LogTab";
import AddNewStatsForm from "./components/forms/AddNewStatsForm";
import DailyTripForm from "./components/forms/DailyTripForm";
import OneTimeTripForm from "./components/forms/OneTimeTripForm";
import AddVehicleForm from "./components/forms/AddVehicleForm";
import { ThemeToggle } from "./components/ThemeToggle";
import { useTheme } from "./context/ThemeContext";
import Select from "react-select";

import { Home, TrendingUp, IndianRupee, LineChart, ScrollText, MapPin, Fuel, Repeat, Navigation, Plus, ChevronDown, Bike } from "lucide-react";

export default function FuelDashboard({ user, setUserData }) {
  const { theme } = useTheme();
  const [activeVehicle, setActiveVehicle] = useState(user?.vehicles?.[0]?.id || null);
  const [tab, setTab] = useState("home");
  const [newEntryOpen, setNewEntry] = useState(false);
  const [dailyTripOpen, setDailyTripOpen] = useState(false);
  const [oneTimeTripOpen, setOneTimeTripOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  
  const contentRef = useRef(null);
  const addMenuRef = useRef(null);
  const fabMenuRef = useRef(null);
  const fabBtnRef = useRef(null);

  const stats = useFuelData();

  const switchTab = (id) => {
    if (tab !== id) {
      playChime();
      setTab(id);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (!addMenuRef.current?.contains(e.target) && !fabMenuRef.current?.contains(e.target) && !fabBtnRef.current?.contains(e.target)) {
        setAddMenuOpen(false);
      }
    };
    if (addMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [addMenuOpen]);

  const navItems = [
    { id: "home", icon: <Home size={20} />, label: "Home", desc: "Overview & key metrics" },
    { id: "mileage", icon: <TrendingUp size={20} />, label: "Mileage", desc: "Efficiency trends & analysis" },
    { id: "cost", icon: <IndianRupee size={20} />, label: "Cost", desc: "Spending patterns & projections" },
    { id: "forecast", icon: <LineChart size={20} />, label: "Forecast", desc: "Predictions & milestones" },
    { id: "log", icon: <ScrollText size={20} />, label: "Log", desc: "Complete records breakdown" },
  ];

  const handleOpenNewEntry = () => { setNewEntry(true); setAddMenuOpen(false); };
  const handleDailyOpen = () => { setDailyTripOpen(true); setAddMenuOpen(false); };
  const handleOneTimeOpen = () => { setOneTimeTripOpen(true); setAddMenuOpen(false); };

  const addMenuItems = [
    { id: "fuel", label: "Fuel Entry", desc: "Log a fill-up", icon: <Fuel size={18} />, bg: "bg-orange-100 text-orange-600 dark:bg-orange-900/40", action: handleOpenNewEntry },
    { id: "daily", label: "Daily Trip", desc: "Recurring commute", icon: <Repeat size={18} />, bg: "bg-blue-100 text-blue-600 dark:bg-blue-900/40", action: handleDailyOpen },
    { id: "onetime", label: "One-Time Trip", desc: "Single journey", icon: <Navigation size={18} />, bg: "bg-purple-100 text-purple-600 dark:bg-purple-900/40", action: handleOneTimeOpen },
  ];

  const AddMenuDropdown = ({ mobile }) => (
    <div className={`${mobile ? 'fixed bottom-[120px] right-4 w-52' : 'absolute bottom-[calc(100%+8px)] right-0 w-56'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-20 animate-in zoom-in-95 duration-200`}>
      <div className="px-4 py-3 text-[10px] text-gray-500 uppercase tracking-widest font-semibold bg-gray-50/50 dark:bg-gray-800/50">Add New</div>
      <div className="flex flex-col">
        {addMenuItems.map(item => (
          <button key={item.id} onClick={item.action} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left transition-colors border-t border-gray-100 dark:border-gray-700/50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>{item.icon}</div>
            <div>
               <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{item.label}</div>
               <div className="text-[10px] text-gray-500">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-hidden w-full">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-6">
        <div className="px-6 pb-6 border-b border-gray-200 dark:border-gray-700 mb-2">
           <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center shrink-0"><Bike size={24} /></div>
              <div>
                 <div className="text-xl font-extrabold font-outfit tracking-tight">Fuel<span className="text-orange-500">Pulse</span></div>
                 <div className="text-[9px] text-gray-500 tracking-widest uppercase">Vehicle Tracker</div>
              </div>
           </div>
        </div>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 mb-4">
           <div className="text-[9px] text-gray-500 tracking-widest uppercase mb-1 font-semibold">Odometer</div>
           <div className="text-2xl font-extrabold font-outfit text-orange-600">{stats.currentOdo.toLocaleString()} <span className="text-xs text-gray-400 font-sans">km</span></div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {navItems.map(n => {
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => switchTab(n.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 font-bold' : 'text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <span className={active ? 'opacity-100' : 'opacity-70'}>{n.icon}</span>
                <span className="text-[13px] tracking-wide">{n.label}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-auto px-4 pt-4 relative" ref={addMenuRef}>
           {addMenuOpen && <AddMenuDropdown />}
           <button onClick={() => setAddMenuOpen(p => !p)} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-transform active:scale-95">
             <Plus size={18} className={`transition-transform duration-200 ${addMenuOpen ? 'rotate-45' : ''}`} />
             Add Entry
             <ChevronDown size={14} className="ml-1 opacity-70" />
           </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-3 md:py-5 shrink-0 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
             <div className="md:hidden flex items-center gap-3 mr-2">
               <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center"><Bike size={20} /></div>
               <div>
                  <div className="text-base font-extrabold font-outfit leading-none">Fuel<span className="text-orange-500">Pulse</span></div>
               </div>
             </div>
             <div className="hidden md:block">
                <div className="text-xl font-bold font-outfit capitalize text-gray-900 dark:text-gray-100">
                  {navItems.find(n => n.id === tab)?.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {navItems.find(n => n.id === tab)?.desc}
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
             {user?.vehicles && user.vehicles.length > 0 && (
               <div className="flex items-center gap-2">
                 <Select 
                   options={user.vehicles.map(v => ({ value: v.id, label: v.name }))}
                   value={{ value: activeVehicle, label: user.vehicles.find(v => v.id === activeVehicle)?.name }}
                   onChange={opt => setActiveVehicle(opt.value)}
                   className="w-36 md:w-44 text-xs font-bold"
                   isSearchable={false}
                   styles={{
                     control: (base) => ({ ...base, background: theme === 'dark' ? '#111827' : '#ffffff', borderColor: theme === 'dark' ? '#374151' : '#e5e7eb', color: theme === 'dark' ? '#f3f4f6' : '#111827', borderRadius: '0.75rem', padding: '0px', minHeight: '38px', boxShadow: 'none', cursor: 'pointer', outline: 'none', '&:hover': { borderColor: '#ea7c21' } }),
                     singleValue: (base) => ({ ...base, color: theme === 'dark' ? '#f3f4f6' : '#111827' }),
                     menu: (base) => ({ ...base, background: theme === 'dark' ? '#1f2937' : '#ffffff', borderRadius: '0.75rem', zIndex: 100, border: `1px solid ${theme==='dark'?'#374151':'#e5e7eb'}`, padding: '4px' }),
                     option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#ea7c21' : state.isFocused ? (theme === 'dark' ? '#374151' : '#f3f4f6') : 'transparent', color: state.isSelected ? '#ffffff' : (theme === 'dark' ? '#f3f4f6' : '#111827'), cursor: 'pointer', borderRadius: '0.5rem', marginBottom: '2px', padding: '8px 12px' }),
                   }}
                 />
                 <button onClick={() => setAddVehicleOpen(true)} className="w-9 h-9 md:w-[38px] md:h-[38px] shrink-0 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center hover:bg-orange-200 dark:hover:bg-orange-900/60 transition-colors" title="Add Vehicle">
                    <Plus size={18} />
                 </button>
               </div>
             )}
             <div className="hidden md:block"><ThemeToggle /></div>
             <div className="text-right">
                <div className="text-[9px] text-gray-500 tracking-widest uppercase font-semibold">Odometer</div>
                <div className="text-lg md:text-xl font-extrabold font-outfit text-orange-600">{stats.currentOdo.toLocaleString()} <span className="text-[10px] text-gray-400 font-sans">km</span></div>
             </div>
          </div>
        </header>

        <main ref={contentRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 bg-gray-50/50 dark:bg-[#121212]">
          
          {/* Modals */}
          <AddVehicleForm isOpen={addVehicleOpen} onClose={() => setAddVehicleOpen(false)} onSubmit={(newV) => { const updated = { ...user, vehicles: [...user.vehicles, newV] }; localStorage.setItem("fuelpulse_user", JSON.stringify(updated)); setUserData?.(updated); setActiveVehicle(newV.id); }} />
          <AddNewStatsForm isOpen={newEntryOpen} onClose={() => setNewEntry(false)} lastOdometer={stats.RAW_DATA[stats.RAW_DATA.length - 1]?.to} onSubmit={() => {}} />
          <DailyTripForm isOpen={dailyTripOpen} onClose={() => setDailyTripOpen(false)} onSubmit={() => {}} />
          <OneTimeTripForm isOpen={oneTimeTripOpen} onClose={() => setOneTimeTripOpen(false)} onSubmit={() => {}} avgKmPerLitre={parseFloat(stats.overallEff.toFixed(2))} avgPricePerLitre={parseFloat((stats.totalCost / stats.totalFuel).toFixed(2))} />

          {tab === "home" && <HomeTab data={stats.data} stats={stats} />}
          {tab === "mileage" && <MileageTab data={stats.data} stats={stats} />}
          {tab === "cost" && <CostTab data={stats.data} stats={stats} />}
          {tab === "forecast" && <ForecastTab stats={stats} />}
          {tab === "log" && <LogTab stats={stats} />}
          
          <div className="h-20 md:h-0" />
        </main>

        {/* Bottom Nav (Mobile) */}
        <nav className="md:hidden flex bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-1 pb-safe pt-1 shrink-0 z-20">
          {navItems.map(n => {
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => switchTab(n.id)} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 relative">
                {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-orange-500 rounded-b-full transition-all" />}
                <div className={`transition-all duration-300 ${active ? 'text-orange-500 scale-110 -translate-y-0.5' : 'text-gray-400'}`}>
                  {n.icon}
                </div>
                <span className={`text-[10px] font-semibold tracking-wide transition-colors ${active ? 'text-orange-600' : 'text-gray-500'}`}>{n.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Floating Action Button (Mobile) */}
      <div className="md:hidden z-30" ref={fabMenuRef}>
         {addMenuOpen && <AddMenuDropdown mobile />}
         <button ref={fabBtnRef} onClick={() => setAddMenuOpen(p => !p)} className={`fixed bottom-20 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30 transition-transform active:scale-90 ${addMenuOpen ? 'bg-gray-800 rotate-45' : 'bg-orange-500'}`}>
           <Plus size={24} />
         </button>
      </div>
    </div>
  );
}

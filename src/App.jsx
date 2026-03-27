import React, { useState, useEffect } from 'react';
import FuelDashboard from './FuelDashboard';
import { LandingPage } from './pages/LandingPage';
import { VehicleList } from './pages/VehicleList';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem("fuelpulse_user");
      return saved ? JSON.parse(saved) : null;
    } catch(e) {
      return null;
    }
  });

  const [activeVehicleId, setActiveVehicleId] = useState(null);

  return (
    <ThemeProvider>
      <div className="antialiased min-h-screen text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 selection:bg-orange-500/30">
        {!userData ? (
          <LandingPage onComplete={(data) => setUserData(data)} />
        ) : !activeVehicleId ? (
          <VehicleList user={userData} onSelect={id => setActiveVehicleId(id)} setUserData={setUserData} />
        ) : (
          <FuelDashboard user={userData} setUserData={setUserData} activeVehicleId={activeVehicleId} onBack={() => setActiveVehicleId(null)} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App;

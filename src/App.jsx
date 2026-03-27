import React, { useState, useEffect } from 'react';
import FuelDashboard from './FuelDashboard';
import { LandingPage } from './pages/LandingPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user already completed onboarding
    const saved = localStorage.getItem("fuelpulse_user");
    if (saved) {
      try {
        setUserData(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  return (
    <ThemeProvider>
      <div className="antialiased min-h-screen text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 selection:bg-orange-500/30">
        {!userData ? (
          <LandingPage onComplete={(data) => setUserData(data)} />
        ) : (
          <FuelDashboard user={userData} setUserData={setUserData} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App;

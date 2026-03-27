# FuelPulse - Vehicle & Fuel Tracker

FuelPulse is a modern, responsive React application designed to help users track their vehicle's fuel efficiency, costs, and upcoming milestones. Built with a sleek UI, it features a comprehensive dashboard with data visualization, an onboarding flow for managing multiple vehicles, and full dark mode support.

## 🚀 Features

- **Multi-Vehicle Management:** Track metrics for multiple cars or bikes simultaneously. Add new vehicles seamlessly from the dashboard.
- **Onboarding Flow:** Clean landing page that captures vehicle configurations (2-wheeler/4-wheeler, fuel type, expected mileage) and user preferences.
- **Comprehensive Dashboard:**
  - **Home:** At-a-glance summaries, current efficiency, and cost metrics.
  - **Mileage:** Trend analysis charts showing km/L over time.
  - **Cost:** Spending breakdowns (Price per Litre, Cost per km, and future graphical projections).
  - **Forecast:** Predictive modeling for your next refuel date, estimated cost, and upcoming odometer milestones.
  - **Log:** A detailed tabular and graphical breakdown of all your past refill entries.
- **Smart Data Entry:** Log full fill-ups, partial top-ups, daily recurring trips, and one-time planned journeys. The system smartly merges partial refills into your next full tank for accurate overall baseline calculations.
- **True Dark/Light Mode:** Seamlessly switch themes with a persistent UI toggle utilizing Tailwind's native dark variant configuration.
- **Interactive UI:** Smooth transitions, responsive sidebar/bottom navigation, and subtle audio cues (chimes) when navigating tabs.

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (configured with precise layout utilities and theme support)
- **Icons:** `lucide-react`
- **Charts:** `recharts` for robust, responsive data visualizations.
- **Form Controls:** `react-select` for advanced, theme-aware dropdown selections.

## 📂 Project Structure

```text
src/
├── components/
│   ├── dashboard/       # Dashboard Core Tabs (HomeTab, MileageTab, CostTab, etc.)
│   ├── forms/           # Modular Forms (AddNewStatsForm, AddVehicleForm, etc.)
│   └── ThemeToggle.jsx  # Dark/Light Mode Switcher Component
├── context/
│   └── ThemeContext.jsx # Global Theme State Provider
├── hooks/
│   └── useFuelData.js   # Custom hook centralizing data manipulation and calculations
├── pages/
│   └── LandingPage.jsx  # User Onboarding interface
├── utils/
│   └── audio.js         # Zero-dependency browser oscillator for UI transition chimes
├── App.jsx              # Main Application Router & Settings
├── FuelDashboard.jsx    # Primary Dashboard Assembly
├── index.css            # Tailwind Directives & Font setups
└── main.jsx             # React DOM root entry
```

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js installed on your local machine.

### Installation

1. Clone the repository and navigate to the project root:
   ```bash
   cd auto-ini-sys
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit the local port (usually `http://localhost:5173/` or `http://localhost:5174/`).

## 🔮 Future Architecture (Backend)
Currently, the application runs entirely on the frontend with data persisting via `localStorage`. For production scaling, a full backend architecture has been planned. Please reference `backend_features.md` in the root directory for a detailed breakdown of the proposed Node.js/Express database schema and API endpoints.

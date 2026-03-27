import "./styles.css";
import { ThemeProvider } from "./ThemeProvider";
import FuelDashboard from "./FuelDashboard";

export default function App() {
  return (
    <ThemeProvider>
      <FuelDashboard />
    </ThemeProvider>
  );
}

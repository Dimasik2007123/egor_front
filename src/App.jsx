import { BrowserRouter, useRoutes } from "react-router-dom";
import "./assets/animations.css";
import "./assets/styles_new.css";
import { routesConfig } from "./routes";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AppRoutes() {
  const routes = useRoutes(routesConfig);
  return routes;
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
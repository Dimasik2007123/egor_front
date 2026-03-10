// App.js
import { BrowserRouter, useRoutes } from "react-router-dom";
import "./assets/animations.css";
import "./assets/styles_new.css";
//import "bootstrap/dist/css/bootstrap.min.css";
import { routesConfig } from "./routes";

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

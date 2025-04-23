import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";
import "./styles/breakpoints.css";
import {TasksProvider} from "./context/TasksContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TasksProvider>
      <App />
    </TasksProvider>
  </StrictMode>
);

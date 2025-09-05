import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { register as registerServiceWorker } from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Registrar el service worker para PWA
registerServiceWorker();

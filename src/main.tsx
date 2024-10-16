import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./app/providers";


// components
import { Toaster } from "./app/components/sonner";

// styles
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Providers />
    <Toaster />
  </React.StrictMode>,
);

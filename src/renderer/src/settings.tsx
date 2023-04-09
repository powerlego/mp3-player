import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Settings from "@renderer/components/Settings/Settings";

const root = ReactDOM.createRoot(document.getElementById("settings") as HTMLElement);
root.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>
);

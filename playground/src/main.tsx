import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider } from "@farena/farena-ui";
import "./styles/styles.scss";
import "@farena/farena-ui/styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
);

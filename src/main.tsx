import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./store/useThemeStore";
import { LocalStoreProvider } from "./store/useLocalStore";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LocalStoreProvider>
        <App />
      </LocalStoreProvider>
    </ThemeProvider>
  </StrictMode>
);

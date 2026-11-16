import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import "./fonts-critical.css";
import App from "./CinematicApp";

const root = document.getElementById("root");
if (root) {
  startTransition(() => {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
}

const warmFonts = () => {
  void import("./fonts-display.css");
};

const idle = window as Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

if (typeof idle.requestIdleCallback === "function") {
  idle.requestIdleCallback(warmFonts, { timeout: 1800 });
} else {
  window.setTimeout(warmFonts, 400);
}

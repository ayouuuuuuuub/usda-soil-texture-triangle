import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { detectLocale } from "./site/Chrome";
import "./styles/index.css";

const root = document.getElementById("root")!;
const locale = detectLocale();
const app = (
  <StrictMode>
    <BrowserRouter>
      <App locale={locale} />
    </BrowserRouter>
  </StrictMode>
);

// The built pages already hold their HTML, in English (scripts/prerender.mjs). When that HTML is the
// page being opened and the visitor reads English, React attaches to it; otherwise (French, or an
// address that has no page of its own) the page is drawn afresh.
const path = window.location.pathname.replace(/(.)\/$/, "$1");
if (root.firstElementChild && root.dataset.route === path && locale === "en") {
  hydrateRoot(root, app);
} else {
  root.textContent = "";
  createRoot(root).render(app);
}

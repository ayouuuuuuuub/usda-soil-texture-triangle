// The app rendered to a string for one address: used only at build time, by scripts/prerender.mjs and
// scripts/check.mjs. The feature article bodies are read here, all at once, so they end up in the HTML.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { FeatureBodies } from "./articles/FeatureBody";

const files = import.meta.glob<string>("./data/features/*.js", { import: "default", eager: true });
const bodies = Object.fromEntries(
  Object.entries(files).map(([file, html]) => [file.replace(/^.*\/(.+)\.js$/, "$1"), html]),
);

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <FeatureBodies.Provider value={bodies}>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </FeatureBodies.Provider>
    </StrictMode>,
  );
}

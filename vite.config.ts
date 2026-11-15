import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // two pages: the app (calculator, articles, and the portfolio as a route) and the portfolio's own
      // page, which link previews and search engines read (see scripts/prerender-portfolio.mjs)
      input: { main: "index.html", portfolio: "portfolio/index.html" },
    },
  },
});

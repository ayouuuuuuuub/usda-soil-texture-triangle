// Runs after `vite build`: writes the portfolio's HTML into dist/portfolio/index.html, so link previews
// (LinkedIn, WhatsApp) and search engines read the real page without running JavaScript. The browser then
// attaches React to that HTML (src/portfolio/entry.jsx).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const file = 'dist/portfolio/index.html';
const slot = '<div id="root"></div>';

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const { default: Portfolio } = await vite.ssrLoadModule('/src/portfolio/Portfolio.jsx');
  const { meta } = await vite.ssrLoadModule('/src/portfolio/meta.js');
  const markup = renderToString(React.createElement(React.StrictMode, null, React.createElement(Portfolio)));
  const html = fs.readFileSync(file, 'utf8');
  assert.ok(html.includes(slot), `${file}: empty #root not found`);
  assert.ok(html.includes(`<title>${meta.title}</title>`), `${file}: title differs from src/portfolio/meta.js`);
  assert.ok(markup.includes('pf-hero') && markup.includes('pf-contact'), 'portfolio markup is incomplete');
  fs.writeFileSync(file, html.replace(slot, () => `<div id="root">${markup}</div>`));
  console.log(`prerendered ${file} (${Math.round(markup.length / 1024)} kB of HTML)`);
} finally {
  await vite.close();
}

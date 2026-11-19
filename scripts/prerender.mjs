// Runs after `vite build`. Writes the real HTML of every page into dist, so search engines and link
// previews (LinkedIn, WhatsApp) read each page without running JavaScript, and visitors see the page
// before the script arrives. The browser then attaches React to that HTML (src/main.tsx and
// src/portfolio/entry.jsx).
//
//   dist/index.html                  the calculator
//   dist/articles/index.html         the guides
//   dist/articles/<slug>/index.html  one guide each
//   dist/portfolio/index.html        the portfolio (its own entry)
//   dist/app.html                    the empty shell, served for any other address (see vercel.json)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const slot = '<div id="root"></div>';
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
});

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
  const { PAGES, SITE } = await vite.ssrLoadModule('/src/site/pages.js');

  const shell = fs.readFileSync('dist/index.html', 'utf8');
  assert.ok(shell.includes(slot), 'dist/index.html: empty #root not found');
  fs.writeFileSync('dist/app.html', shell);

  let total = 0;
  for (const page of PAGES) {
    const markup = render(page.path);
    assert.ok(markup.includes('site-header') && markup.includes('site-footer'), `${page.path}: markup is incomplete`);
    const url = SITE + (page.path === '/' ? '/' : page.path);
    const title = escapeHtml(page.title);
    const description = escapeHtml(page.description);
    const html = shell
      .replace(slot, () => `<div id="root" data-route="${page.path}">${markup}</div>`)
      .replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*"/, (_, start) => `${start}${description}"`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*"/, (_, start) => `${start}${title}"`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/, (_, start) => `${start}${description}"`)
      .replace(/(<meta\s+property="og:url"\s+content=")[^"]*"/, (_, start) => `${start}${url}"`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*"/, (_, start) => `${start}${title}"`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*"/, (_, start) => `${start}${description}"`)
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*"/, (_, start) => `${start}${url}"`);
    const file = page.path === '/' ? 'dist/index.html' : `dist${page.path}/index.html`;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    total += markup.length;
  }
  console.log(`prerendered ${PAGES.length} app pages (${Math.round(total / 1024)} kB of HTML)`);

  // the portfolio: its own page and entry
  const { default: Portfolio } = await vite.ssrLoadModule('/src/portfolio/Portfolio.jsx');
  const { meta } = await vite.ssrLoadModule('/src/portfolio/meta.js');
  const file = 'dist/portfolio/index.html';
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

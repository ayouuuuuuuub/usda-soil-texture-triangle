// Render real app routes without a browser; no additional test dependencies.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: file,
  }).outputText;
  const localRequire = (specifier) => {
    if (specifier.endsWith('.css')) return {};
    if (!specifier.startsWith('.')) return require(specifier);
    const base = path.resolve(path.dirname(file), specifier);
    const resolved = [base, ...['.ts', '.tsx', '.js', '.jsx'].map(ext => base + ext)].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    assert.ok(resolved, `Missing import: ${specifier}`);
    return load(resolved);
  };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, module, module.exports);
  return module.exports;
}

const App = load('src/App.tsx').default;
const render = route => renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(App)));
const portfolio = render('/portfolio');
assert.match(portfolio, /Agronomy, soil and water expertise for your projects/);
assert.match(portfolio, /href="mailto:contact@soil-logic.com">Contact/);
assert.match(portfolio, /href="\/portfolio\/assets\/ayoub-professional-pitch-deck.pdf" download="Ayoub-Professional-Pitch-Deck.pdf"/);
for (const asset of ['landscape.svg', 'soil-profile.svg', 'contours.svg', 'ayoub-professional-pitch-deck.pdf']) {
  assert.deepEqual(fs.readFileSync(`public/portfolio/assets/${asset}`), fs.readFileSync(`dist/portfolio/assets/${asset}`));
}
assert.equal(fs.readFileSync('dist/portfolio/assets/ayoub-professional-pitch-deck.pdf').subarray(0, 5).toString(), '%PDF-');
assert.ok(!fs.existsSync('dist/Soil-Logic-Portfolio.html'));
assert.ok(!fs.existsSync('dist/portfolio/index.html'), 'React Router owns the portfolio route');
const homepage = render('/');
assert.match(homepage, /href="\/portfolio"[^>]*>Need a consultant\?/);
assert.match(homepage, /Export PNG/);
assert.match(homepage, /Export SVG/);
assert.match(homepage, /Export table CSV/);
assert.match(homepage, /<svg/);
assert.match(render('/articles'), /Sand/);
const { articles } = load('src/data/articles.js');
for (const article of articles) {
  const markup = render(`/articles/${article.slug}`);
  assert.match(markup, /<h1/);
  assert.ok(!markup.includes('Article not found'), article.slug);
}
assert.match(render('/articles/unknown-class'), /Article not found/);
const soil = load('src/soilTexture.ts');
for (const [sand, silt, clay, expected] of [
  [95,3,2,'sand'], [82,13,5,'loamy sand'], [65,25,10,'sandy loam'],
  [40,40,20,'loam'], [20,65,15,'silt loam'], [5,90,5,'silt'],
  [60,15,25,'sandy clay loam'], [35,30,35,'clay loam'],
  [10,55,35,'silty clay loam'], [52,8,40,'sandy clay'],
  [10,45,45,'silty clay'], [20,20,60,'clay'],
]) assert.equal(soil.classifySoilTexture({sand,silt,clay}), expected);
assert.equal(soil.isValidSoilFractions({sand:40,silt:40,clay:20}), true);
assert.equal(soil.isValidSoilFractions({sand:40,silt:40,clay:40}), false);
assert.deepEqual(soil.ternaryToPoint({sand:100,silt:0,clay:0}), soil.TRIANGLE.vertices.sand);
const rewrites = JSON.parse(fs.readFileSync('vercel.json')).rewrites;
assert.ok(rewrites.some(rule => new RegExp(`^${rule.source}$`).test('/portfolio') && rule.destination === '/index.html'));
console.log('PASS: portfolio markup, contact/download links, built assets, homepage exports/plot, all 12 articles, 12 texture classes, validation, coordinates, Vercel rewrite. Browser clicks/layout require separate checks.');

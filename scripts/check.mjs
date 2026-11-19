// `npm run check`, after `npm run build`. No browser and no test dependencies: it reads the built
// pages and loads the source modules through Vite.
//   - every page has its own prerendered HTML, title, description and canonical address
//   - the calculator page still offers everything it did (inputs, import, exports, styles, legend)
//   - the portfolio page carries its content, contact and download links, and share tags
//   - the 12 USDA classes, validation and plot coordinates behave
//   - the Vercel rewrites send each address to the right file
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer } from 'vite';

const read = (file) => fs.readFileSync(file, 'utf8');
const escapeRe = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
});

try {
  const { PAGES, SITE } = await vite.ssrLoadModule('/src/site/pages.js');
  const { articles } = await vite.ssrLoadModule('/src/data/articles.js');
  const { meta } = await vite.ssrLoadModule('/src/portfolio/meta.js');
  const data = await vite.ssrLoadModule('/src/portfolio/data.js');
  const soil = await vite.ssrLoadModule('/src/soilTexture.ts');
  const { TRIANGLE_STYLES, STYLE_VISUALS, STYLE_NAMES } = await vite.ssrLoadModule('/src/home/triangleStyles.ts');
  const { UI_TEXT, EXTRA } = await vite.ssrLoadModule('/src/site/i18n.ts');
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

  // every page: its own file, head and content
  assert.equal(PAGES.length, 2 + articles.length);
  for (const page of PAGES) {
    const file = page.path === '/' ? 'dist/index.html' : `dist${page.path}/index.html`;
    const html = read(file);
    const url = SITE + page.path;
    assert.ok(html.includes(`<title>${escapeHtml(page.title)}</title>`), `${file}: title`);
    assert.match(html, new RegExp(`name="description"\\s+content="${escapeRe(escapeHtml(page.description))}"`), `${file}: description`);
    assert.match(html, new RegExp(`rel="canonical" href="${escapeRe(url)}"`), `${file}: canonical`);
    assert.match(html, new RegExp(`<div id="root" data-route="${escapeRe(page.path)}"><div class="page`), `${file}: not prerendered`);
    assert.match(html, /<h1/, `${file}: no h1`);
    assert.ok(!html.includes('not found'), `${file}: renders the not-found page`);
  }
  assert.match(read('dist/app.html'), /<div id="root"><\/div>/, 'dist/app.html must stay an empty shell');

  // the calculator keeps every function
  const home = read('dist/index.html');
  for (const text of [
    'Classify and compare soil texture samples', 'Import CSV', 'Reset', 'Add sample', 'Export PNG', 'Export SVG',
    'Export table CSV', 'Outside legend', 'Point size', 'Triangle style', 'Classification results', 'How to use',
    'North field', 'Orchard block', 'Low terrace', 'Need a consultant?', 'contact@soil-logic.com',
  ]) assert.ok(home.includes(text), `calculator page lacks: ${text}`);
  assert.match(home, /type="file"[^>]*accept=".csv,text\/csv"/, 'CSV file input');
  assert.match(home, /type="range"[^>]*min="4"[^>]*max="14"/, 'point size slider');
  assert.equal((home.match(/name="triangle-style"/g) || []).length, TRIANGLE_STYLES.length, 'one radio per triangle style');
  assert.equal((home.match(/class="class-card"/g) || []).length, 12, '12 class cards');
  assert.match(home, /href="\/portfolio"[^>]*>Need a consultant\?/);
  assert.match(home, /<svg[^>]*class="plot__svg"[^>]*viewBox="0 0 760 660"/);
  assert.match(home, /lang="en"[^>]*aria-pressed="true"/, 'language switch');
  for (const style of TRIANGLE_STYLES) {
    assert.equal(style.colors.length, 12, `${style.id}: 12 class colours`);
    assert.ok(STYLE_VISUALS[style.id] && STYLE_NAMES[style.id].en && STYLE_NAMES[style.id].fr, `${style.id}: visuals and names`);
  }
  for (const key of Object.keys(UI_TEXT.en)) assert.ok(key in UI_TEXT.fr, `French text missing: ${key}`);
  for (const key of Object.keys(EXTRA.en)) assert.ok(key in EXTRA.fr, `French text missing: ${key}`);

  // the guides
  const guides = read('dist/articles/index.html');
  for (const article of articles) assert.ok(guides.includes(`href="/articles/${article.slug}"`), `guides index lacks ${article.slug}`);
  // the long-form articles: each has its own body file, written into its page at build time, with its
  // equation pictures on disk; none of that text is in the scripts every page loads
  const features = articles.filter((article) => article.feature);
  assert.deepEqual(features.map((a) => a.slug), ['sand', 'loamy-sand', 'sandy-loam', 'loam', 'silt-loam', 'silt', 'sandy-clay', 'clay']);
  for (const article of features) {
    const page = read(`dist/articles/${article.slug}/index.html`);
    assert.match(page, new RegExp(`<div id="feature-body" data-slug="${article.slug}" class="feature-article-body">\\s*<`), `${article.slug}: body not prerendered`);
    assert.match(page, /class="feature-hero"/, `${article.slug}: hero`);
    for (const [, src] of page.matchAll(/<img class="eq" src="([^"]+)"/g)) assert.ok(fs.existsSync(`public${src}`), `${article.slug}: missing ${src}`);
    for (const [, n] of page.matchAll(new RegExp(`href="#${article.slug}-ref-(\\d+)"`, 'g'))) assert.ok(page.includes(`id="${article.slug}-ref-${n}"`), `${article.slug}: citation ${n} has no reference`);
  }
  for (const file of fs.readdirSync('dist/assets').filter((f) => /^(main|index)-.*\.js$/.test(f))) {
    assert.ok(!read(`dist/assets/${file}`).includes('Dominant Apex of the Pedosphere'), `${file} carries article text`);
  }
  assert.match(render('/articles/unknown-class'), /Article not found/);
  assert.match(render('/nowhere'), /Page not found/);

  // the portfolio: its own page, prerendered, with its share tags
  for (const [name, page] of [['portfolio/index.html', read('portfolio/index.html')], ['dist/portfolio/index.html', read('dist/portfolio/index.html')]]) {
    assert.ok(page.includes(`<title>${meta.title}</title>`), `${name}: title`);
    assert.match(page, new RegExp(`name="description"\\s+content="${escapeRe(meta.description)}"`), `${name}: description`);
    assert.match(page, new RegExp(`property="og:title" content="${escapeRe(meta.title)}"`), `${name}: og:title`);
    assert.match(page, new RegExp(`property="og:image" content="${escapeRe(meta.image)}"`), `${name}: og:image`);
    assert.match(page, new RegExp(`rel="canonical" href="${escapeRe(meta.canonical)}"`), `${name}: canonical`);
    assert.ok(!page.includes('USDA Soil Texture Triangle Tool'), `${name}: must not carry the calculator's title`);
  }
  const portfolio = read('dist/portfolio/index.html');
  assert.ok(!/<div id="root"><\/div>/.test(portfolio), 'dist/portfolio/index.html was not prerendered');
  assert.match(portfolio, /<h1[^>]*aria-label="I read the land before the project is drawn\."/);
  assert.match(portfolio, /href="mailto:contact@soil-logic.com"[^>]*>Email Ayoub/);
  assert.match(portfolio, /href="\/portfolio\/assets\/ayoub-professional-pitch-deck.pdf" download="Ayoub-Professional-Pitch-Deck.pdf"/);
  for (const text of ['3,000 hectares', 'Every study is', 'PADERMO', 'CESAR II', 'The toolkit', 'State Engineer in Agronomy', 'contact@soil-logic.com']) {
    assert.ok(portfolio.includes(text), `prerendered portfolio lacks: ${text}`);
  }
  for (const project of data.PROJECTS) {
    assert.equal(project.mix.reduce((sum, n) => sum + n, 0), 100, `${project.id}: mix must add up to 100`);
    assert.ok(portfolio.includes(`id="project-${project.id}"`), `portfolio lacks project ${project.id}`);
    const picture = project.art ? `public${project.art}` : `public/portfolio/photos/${project.photo}-640.webp`;
    assert.ok(fs.existsSync(picture), `${project.id}: missing picture ${picture}`);
  }
  for (const step of data.METHOD) assert.ok(fs.existsSync(`public/portfolio/photos/${step.photo}-${step.wide}.webp`), `method photo ${step.photo}`);
  for (const group of data.TOOL_GROUPS) for (const tool of group.tools) assert.ok(fs.existsSync(`public/portfolio/tools/${tool.logo}.svg`), `tool logo ${tool.logo}`);
  assert.equal(fs.readFileSync('dist/portfolio/assets/ayoub-professional-pitch-deck.pdf').subarray(0, 5).toString(), '%PDF-');
  assert.equal(fs.readFileSync('dist/portfolio/share.jpg').subarray(0, 3).toString('hex'), 'ffd8ff');
  assert.ok(fs.existsSync('dist/portfolio/credits.html'));

  // the 12 USDA classes, validation and coordinates
  for (const [sand, silt, clay, expected] of [
    [95, 3, 2, 'sand'], [82, 13, 5, 'loamy sand'], [65, 25, 10, 'sandy loam'],
    [40, 40, 20, 'loam'], [20, 65, 15, 'silt loam'], [5, 90, 5, 'silt'],
    [60, 15, 25, 'sandy clay loam'], [35, 30, 35, 'clay loam'],
    [10, 55, 35, 'silty clay loam'], [52, 8, 40, 'sandy clay'],
    [10, 45, 45, 'silty clay'], [20, 20, 60, 'clay'],
  ]) assert.equal(soil.classifySoilTexture({ sand, silt, clay }), expected);
  assert.equal(soil.isValidSoilFractions({ sand: 40, silt: 40, clay: 20 }), true);
  assert.equal(soil.isValidSoilFractions({ sand: 40, silt: 40, clay: 40 }), false);
  assert.deepEqual(soil.ternaryToPoint({ sand: 100, silt: 0, clay: 0 }), soil.TRIANGLE.vertices.sand);

  // hosting: which file answers which address
  const rewrites = JSON.parse(read('vercel.json')).rewrites;
  const route = (url) => {
    for (const rule of rewrites) {
      const match = new RegExp(`^${rule.source}$`).exec(url);
      if (match) return rule.destination.replace('$1', match[1]);
    }
    return undefined;
  };
  assert.equal(route('/portfolio'), '/portfolio/index.html');
  assert.equal(route('/articles'), '/articles/index.html');
  for (const article of articles) {
    assert.equal(route(`/articles/${article.slug}`), `/articles/${article.slug}/index.html`);
    assert.ok(fs.existsSync(`dist/articles/${article.slug}/index.html`));
  }
  for (const url of ['/articles/unknown', '/nowhere']) assert.equal(route(url), '/app.html', url);
  for (const url of ['/', '/portfolio/share.jpg', '/portfolio/credits.html', '/robots.txt', '/sitemap.xml', '/assets/index.js']) assert.equal(route(url), undefined, url);
  const sitemap = read('public/sitemap.xml');
  for (const page of PAGES) assert.ok(sitemap.includes(`<loc>${SITE}${page.path}</loc>`), `sitemap lacks ${page.path}`);

  console.log(`PASS: ${PAGES.length} prerendered app pages and the portfolio (titles, descriptions, canonicals, content), calculator functions present, ${TRIANGLE_STYLES.length} triangle styles, French text complete, 12 texture classes, validation, coordinates, pictures and logos on disk, Vercel rewrites, sitemap. Clicks and layout are checked in a browser.`);
} finally {
  await vite.close();
}

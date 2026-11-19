# Soil Logic

The Soil Logic website: a free USDA soil texture calculator, guides to the 12 texture classes, and the
consulting portfolio of the practice behind it. React, TypeScript and Vite; every page is written to
static HTML at build time.

| Address | What it is | Source |
|---|---|---|
| `/` | The calculator: sample ledger, live texture triangle, results table | `src/home/` |
| `/articles`, `/articles/<class>` | The soil guides | `src/articles/`, `src/data/articles.js` |
| `/portfolio` | The consulting portfolio | `src/portfolio/` |

## Run it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run check
```

```bash
npm run preview
```

`build` type-checks, bundles, then prerenders every page (`scripts/prerender.mjs`). `check` reads the
built pages and verifies titles, content, the calculator's functions, the classification rules, the
pictures on disk, the sitemap and the hosting rewrites; run it after `build`.

## Where things are

```text
src/
  main.tsx              browser entry of the app (attaches to the prerendered HTML)
  entry-server.tsx      the app rendered to a string, for the prerender step
  App.tsx               routes
  soilTexture.ts        the USDA rules, class polygons and plot coordinates
  site/                 header, footer, language, texts (i18n.ts), class cards, page titles (pages.js)
  home/                 the calculator page, the triangle, the 19 triangle styles
  articles/             the guides index, the article page, styles of the long-form articles
  data/articles.js      the articles themselves
  portfolio/            the portfolio page; all its words are in data.js
  styles/               design tokens and shared styles (base.css), one file per page
portfolio/index.html    the portfolio's own HTML shell and share tags
public/                 photographs, drawings, tool logos, pitch deck, robots.txt, sitemap.xml
scripts/                prerender, check, and the Python scripts that built the map and share image
```

## The calculator

- Rows auto-calculate the third fraction once two have been entered.
- CSV import appends rows; it needs the headers `sample`, `sand`, `clay` (comma, semicolon, pipe or
  tab separated). Silt is `100 - sand - clay`.
- The triangle reads the composition under the pointer, with one guide line to each axis, and names
  its class. Click to drop a sample there; drag a plotted point to change it. On a phone, tap to
  read, then "Add as sample".
- 19 triangle styles, point size, an outside legend, PNG and SVG export of the drawing, CSV export of
  the results table. The reading overlay is never part of an export.
- English and French; the choice is remembered in the browser.

Classification follows the USDA NRCS textural triangle: `src/soilTexture.ts` holds the rules as
inequalities over sand, silt and clay. Sand and loamy sand use the NRCS expressions
`silt + 1.5 * clay` and `silt + 2 * clay`.

References: [NRCS Soil Texture Calculator](https://www.nrcs.usda.gov/resources/education-and-teaching-materials/soil-texture-calculator).

## Editing content

- **Articles:** `src/data/articles.js` (the header comment explains the fields). A new article also
  needs a line in `public/sitemap.xml` and its slug in the `/articles/(...)` rule of `vercel.json`.
- **Portfolio:** `src/portfolio/data.js`. Each study has a `mix` (share of soil, data and territory
  work, adding up to 100) that places it on the mixture diagram: these are estimates, adjust them.
  Title and description for link previews are in `src/portfolio/meta.js` and must match
  `portfolio/index.html` (`npm run check` verifies it).
- **Interface texts and French:** `src/site/i18n.ts`.
- **Colours and type:** the tokens at the top of `src/styles/base.css`.

Photographs on the portfolio are stand-ins from Wikimedia Commons, credited in
`public/portfolio/credits.html`, to be replaced by fieldwork photographs.

## Hosting

Vercel, Vite preset, build command `npm run build`, output `dist`. `vercel.json` sends each address to
its prerendered file and anything unknown to `app.html` (an empty shell that shows the not-found page).

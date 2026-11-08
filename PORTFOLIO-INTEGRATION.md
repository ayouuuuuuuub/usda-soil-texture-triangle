# Portfolio integration

The existing React/Vite app now serves `/portfolio` through React Router.
The calculator intro links to it with the keyboard-accessible "Need a consultant?" link.

## Files and editing

- `src/portfolio/Portfolio.jsx`: package's complete React page and route metadata.
- `src/portfolio/portfolio.css`: package stylesheet, scoped to `.sl-portfolio`.
- `public/portfolio/assets/`: three SVG illustrations and the PDF pitch deck.
- `src/App.tsx`: route and homepage link only; calculator logic is unchanged.
- `src/styles.css`: homepage link styling.
- `public/sitemap.xml`: adds the canonical portfolio URL.

Edit the component and stylesheet directly. Internal navigation uses same-origin URLs
so local previews and production both work. The Contact link uses
`mailto:contact@soil-logic.com`; opening a compose window requires a configured mail app.
The pitch deck uses the browser's native download attribute.

The package's local-preview `Soil-Logic-Portfolio.html` is not included in production.
The working tree previously had a standalone portfolio in `index.html`, preventing
the React calculator from mounting. That draft was preserved at
`.integration-backup/index-before-portfolio.html` (ignored by Git and not built),
and the tracked calculator entry point and static SEO metadata were restored.
The existing root-level draft CSS, JavaScript, content and README were left intact.

## Build and check

```sh
npm ci
npm run build
node scripts/check-portfolio.mjs
npm run preview -- --port 4175
```

The check renders the actual React routes, checks the PDF and bundled assets,
and exercises representative classification/validation/coordinate cases.
Browser verification covered direct `/portfolio` loading and refresh, PDF download,
PNG/SVG/CSV downloads, adding a sample, keyboard navigation to the portfolio,
article index and clay article navigation, and a 390px mobile viewport.
Contact was verified as the correct mailto destination; no email was sent.

## Hosting

Use the existing Vercel project connected to this repository, with the Vite preset,
`npm run build` and output directory `dist`. Keep the existing `vercel.json` SPA
rewrite: it sends `/portfolio` and article routes to the React entry point while
allowing assets and PDFs through. No new dependencies or hosting rules are needed.

This checkout has no `.vercel` project link or available Vercel CLI credentials.
Deployment was not performed. Deploy these changes through the existing Git/Vercel
workflow, then verify `https://soil-logic.com/portfolio` and its PDF link in production.
Existing calculator metadata and sitemap URLs are retained; only the new portfolio
entry uses the supplied soil-logic.com domain.

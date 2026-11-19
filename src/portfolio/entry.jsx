// Entry of the portfolio's own page (portfolio/index.html). The built page already holds the portfolio's
// HTML (scripts/prerender-portfolio.mjs), so React attaches to it instead of drawing it again; in
// development the root is empty and the page is rendered as usual. The same component is still a route of
// the app (src/App.tsx), which is how the link on the homepage opens it without a page load.
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Portfolio from './Portfolio.jsx';
import '../styles/index.css';

const root = document.getElementById('root');
const page = <StrictMode><Portfolio /></StrictMode>;
if (root.firstElementChild) hydrateRoot(root, page);
else createRoot(root).render(page);

// Every page of the app that is written to its own HTML file at build time, with what search engines
// and link previews should say about it. Read by scripts/prerender.mjs and scripts/check.mjs; the pages
// themselves set the same titles when they are opened in the browser.
import { articles } from '../data/articles.js';

export const SITE = 'https://soil-logic.com';

export const HOME = {
  path: '/',
  title: 'USDA Soil Texture Triangle Tool | Free Soil Texture Calculator',
  description:
    'Free USDA soil texture triangle tool to classify and compare soil samples using sand, silt, and clay percentages. Useful for agronomy, pedology, irrigation, and soil analysis.',
};

export const GUIDES = {
  path: '/articles',
  title: 'USDA Soil Texture Class Articles | Soil Texture Triangle Guides',
  description:
    'Guides to the 12 USDA soil texture classes: where each class sits in the texture triangle, the sand, silt and clay it spans, and what it means for agronomy, irrigation and drainage.',
};

export function articleTitle(article) {
  return `${article.title} | USDA Soil Texture Triangle`;
}

export const PAGES = [
  HOME,
  GUIDES,
  ...articles.map((article) => ({
    path: `/articles/${article.slug}`,
    title: articleTitle(article),
    description: article.excerpt,
  })),
];

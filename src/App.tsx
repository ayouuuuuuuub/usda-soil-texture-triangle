import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ArticlePage, ArticlesIndexPage, NotFoundPage } from "./articles/ArticlePages";
import HomePage from "./home/HomePage";
import { LocaleProvider } from "./site/Chrome";
import type { Locale } from "./site/i18n";

// The portfolio has its own page and entry (portfolio/index.html); inside the app it is only loaded
// when a link to it is followed.
const Portfolio = lazy(() => import("./portfolio/Portfolio"));

function App({ locale = "en" }: { locale?: Locale }) {
  return (
    <LocaleProvider initial={locale}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/portfolio"
          element={
            <Suspense fallback={null}>
              <Portfolio />
            </Suspense>
          }
        />
        <Route path="/articles" element={<ArticlesIndexPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </LocaleProvider>
  );
}

export default App;

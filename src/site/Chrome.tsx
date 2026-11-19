// What every page of the app shares: the language (English or French), the header and the footer.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { EXTRA, UI_TEXT, type Locale } from "./i18n";

const LOCALE_STORAGE_KEY = "soil-logic-locale";

// English by default; French when the visitor's browser prefers French,
// unless they already picked a language on this site.
export function detectLocale(): Locale {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "en" || saved === "fr") return saved;
  } catch {
    // Storage can be blocked; fall back to the browser preference.
  }
  const preferred = navigator.languages?.length ? navigator.languages[0] : navigator.language;
  return preferred?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

type LocaleValue = { locale: Locale; setLocale: (next: Locale) => void };
const LocaleContext = createContext<LocaleValue>({ locale: "en", setLocale: () => {} });

export function LocaleProvider({ initial = "en", children }: { initial?: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Ignore: the choice simply won't persist.
    }
  }

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

// Sets <html lang> for pages written in the visitor's language (the calculator); other pages stay "en".
export function useDocumentLang(lang: Locale) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [lang]);
}

// The Soil Logic mark: three slanted soil strata.
export function Mark() {
  return (
    <span className="brand__mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader() {
  const { locale, setLocale } = useLocale();
  const t = UI_TEXT[locale];
  const x = EXTRA[locale];
  return (
    <header className="site-header">
      <div className="wrap site-header__in">
        <Link className="brand" to="/">
          <Mark />
          Soil Logic
        </Link>
        <nav className="site-nav" aria-label={t.mainNav}>
          <NavLink to="/" end>
            {t.calculator}
          </NavLink>
          <NavLink to="/articles">{t.soilGuides}</NavLink>
          <NavLink to="/portfolio">{x.consulting}</NavLink>
        </nav>
        <div className="site-actions">
          <div className="lang" role="group" aria-label={t.language}>
            <button type="button" lang="en" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>
              <span aria-hidden="true">EN</span>
              <span className="sr-only">English</span>
            </button>
            <button type="button" lang="fr" aria-pressed={locale === "fr"} onClick={() => setLocale("fr")}>
              <span aria-hidden="true">FR</span>
              <span className="sr-only">Français</span>
            </button>
          </div>
          <div className="consult">
            <Link className="btn btn--small" to="/portfolio" aria-describedby="consultant-specialties">
              {t.consultant}
            </Link>
            <p id="consultant-specialties">{t.consultantSpecialties}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { locale } = useLocale();
  const t = UI_TEXT[locale];
  const x = EXTRA[locale];
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__in">
        <div className="site-footer__lead">
          <Link className="brand" to="/">
            <Mark />
            Soil Logic
          </Link>
          <p>{x.footLead}</p>
        </div>
        <nav aria-label={t.footerNav}>
          <h2 className="mono">{x.footTool}</h2>
          <ul>
            <li>
              <Link to="/">{t.calculator}</Link>
            </li>
            <li>
              <Link to="/articles">{t.soilGuides}</Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="mono">{x.footPractice}</h2>
          <ul>
            <li>
              <Link to="/portfolio">{t.consultant}</Link>
            </li>
            <li>
              <a href="mailto:contact@soil-logic.com">contact@soil-logic.com</a>
            </li>
          </ul>
        </div>
        <p className="site-footer__base mono">
          <span>&copy; 2026 Soil Logic</span>
          <span>{x.footNote}</span>
        </p>
      </div>
      <div className="site-footer__word" aria-hidden="true">
        Soil Logic
      </div>
    </footer>
  );
}

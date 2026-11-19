// The body of a long-form ("feature") article. Each body is its own file in src/data/features/, so the
// calculator and the guides index never download the articles' text.
//
// At build time the bodies are handed in through FeatureBodies (src/entry-server.tsx) and written into
// the page's HTML. In the browser, a page that arrives with its body already in the HTML keeps it as it
// is; a body reached by following a link inside the app is fetched then.
import { createContext, useContext, useEffect, useState, type MouseEvent } from "react";

export const FeatureBodies = createContext<Record<string, string> | null>(null);

const loaders = import.meta.glob<string>("../data/features/*.js", { import: "default" });

function fromPage(slug: string) {
  if (typeof document === "undefined") return null;
  const node = document.getElementById("feature-body");
  return node && node.dataset.slug === slug ? node.innerHTML : null;
}

export default function FeatureBody({ slug }: { slug: string }) {
  const server = useContext(FeatureBodies);
  const [html, setHtml] = useState<string | null>(() => server?.[slug] ?? fromPage(slug));

  useEffect(() => {
    if (html !== null) return undefined;
    const load = loaders[`../data/features/${slug}.js`];
    if (!load) return undefined;
    let live = true;
    load().then((body) => {
      if (live) setHtml(body);
    });
    return () => {
      live = false;
    };
  }, [slug, html]);

  // a citation opens the folded works-cited list before the browser jumps to the reference
  function openReference(event: MouseEvent<HTMLDivElement>) {
    const link = (event.target as HTMLElement).closest?.("sup.cite a");
    if (!link) return;
    const target = document.getElementById(link.getAttribute("href")!.slice(1));
    const fold = target?.closest("details");
    if (fold && !fold.open) fold.open = true;
  }

  return (
    <div
      id="feature-body"
      data-slug={slug}
      className="feature-article-body"
      aria-busy={html === null ? true : undefined}
      onClick={openReference}
      dangerouslySetInnerHTML={{ __html: html ?? "" }}
    />
  );
}

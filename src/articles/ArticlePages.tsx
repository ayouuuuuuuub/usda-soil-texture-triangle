// The soil guides: an index that is itself a texture triangle (every class is a region you can open),
// and the page of one class.
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { articles, findArticleBySlug } from "../data/articles";
import { TRIANGLE_STYLES } from "../home/triangleStyles";
import { TEXTURE_CLASSES, buildAnalyticalBoundaryPath, buildClassFills, type TextureClass } from "../soilTexture";
import { Arrow, SiteFooter, SiteHeader, useLocale } from "../site/Chrome";
import { CLASS_FACTS, ClassCard, ClassGlyph, ClassRange, classOf } from "../site/classes";
import "../styles/articles.css";
import "./feature.css";
import FeatureBody from "./FeatureBody";

type Article = (typeof articles)[number] & {
  feature?: { label: string; subtitle: string; meta: string[]; body: boolean };
};

const FILLS = buildClassFills();
const BOUNDARY = buildAnalyticalBoundaryPath();
const SOIL_COLOURS = TRIANGLE_STYLES.find((style) => style.id === "munsell")!.colors;
const slugOf = (name: TextureClass) => name.replace(/ /g, "-");

// The index as a map: the triangle with its twelve regions, each one a link to its guide.
function ClassMap({ active, onActive }: { active: TextureClass | null; onActive: (name: TextureClass | null) => void }) {
  const navigate = useNavigate();
  return (
    <svg className="classmap" viewBox="30 14 700 606" role="group" aria-label="The USDA texture triangle. Each class opens its guide.">
      {FILLS.map((region, index) => (
        <a
          key={region.textureClass}
          href={`/articles/${slugOf(region.textureClass)}`}
          aria-label={`${region.textureClass} guide`}
          data-on={active === region.textureClass ? "" : undefined}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
            event.preventDefault();
            navigate(`/articles/${slugOf(region.textureClass)}`);
          }}
          onPointerEnter={() => onActive(region.textureClass)}
          onPointerLeave={() => onActive(null)}
          onFocus={() => onActive(region.textureClass)}
          onBlur={() => onActive(null)}
        >
          <path d={region.path} fill={SOIL_COLOURS[index]} />
        </a>
      ))}
      <path className="classmap__lines" d={BOUNDARY} />
      <path className="classmap__edge" d="M72 586L688 586L380 52Z" />
      {FILLS.map((region) => (
        <text
          key={region.textureClass}
          x={region.labelPoint.x}
          y={region.labelPoint.y + 4}
          textAnchor="middle"
          data-on={active === region.textureClass ? "" : undefined}
        >
          {region.textureClass}
        </text>
      ))}
      <text className="classmap__axis" x="380" y="36" textAnchor="middle">
        clay
      </text>
      <text className="classmap__axis" x="64" y="612" textAnchor="middle">
        sand
      </text>
      <text className="classmap__axis" x="696" y="612" textAnchor="middle">
        silt
      </text>
    </svg>
  );
}

export function ArticlesIndexPage() {
  const { locale } = useLocale();
  const [active, setActive] = useState<TextureClass | null>(null);
  useEffect(() => {
    document.title = "USDA Soil Texture Class Articles | Soil Texture Triangle Guides";
  }, []);
  const shown = active ?? "loam";

  return (
    <div className="page guides">
      <a className="skip-link" href="#guides">
        Skip to the guides
      </a>
      <SiteHeader />
      <main>
        <header className="guides-hero wrap">
          <div className="guides-hero__copy" data-enter="">
            <p className="eyebrow">USDA soil texture classes</p>
            <h1 className="display">
              Twelve classes, <em>one triangle.</em>
            </h1>
            <p className="lead">
              USDA soil texture class articles: where each class sits in the triangle, the sand, silt and clay
              it spans, and what that means for soil classification, pedology, agronomy, irrigation, drainage
              and water retention.
            </p>
            <div className="guides-hero__read" aria-hidden="true">
              <ClassGlyph name={shown} />
              <div>
                <p className="mono">{active ? "Open the guide" : "Pick a class on the triangle"}</p>
                <strong>{shown}</strong>
                <ClassRange name={shown} locale="en" />
                <p className="guides-hero__share mono">{CLASS_FACTS[shown].share.toFixed(1)}% of the triangle</p>
              </div>
            </div>
          </div>
          <div className="guides-hero__map" data-enter="">
            <ClassMap active={active} onActive={setActive} />
          </div>
        </header>

        <section className="wrap guides-list" id="guides" aria-label="Article list">
          <div className="class-grid">
            {articles.map((article, index) => (
              <ClassCard key={article.slug} article={article} index={index} locale={locale} heading="h2" meta />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Pager({ slug }: { slug: string }) {
  const at = articles.findIndex((article) => article.slug === slug);
  const pair: [string, Article][] = [
    ["Previous class", articles[(at - 1 + articles.length) % articles.length]],
    ["Next class", articles[(at + 1) % articles.length]],
  ];
  return (
    <nav className="pager wrap" aria-label="More classes">
      {pair.map(([label, item]) => (
        <Link key={label} to={`/articles/${item.slug}`}>
          <ClassGlyph name={classOf(item)} />
          <span>
            <small className="mono">{label}</small>
            <strong>{item.textureClass}</strong>
          </span>
          <Arrow />
        </Link>
      ))}
    </nav>
  );
}

function Crumbs({ current }: { current: string }) {
  return (
    <nav className="crumbs wrap mono" aria-label="Article navigation">
      <Link to="/">Back to calculator</Link>
      <span aria-hidden="true">/</span>
      <Link to="/articles">All articles</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

export function NotFoundPage({ article = false }: { article?: boolean }) {
  useEffect(() => {
    document.title = article ? "Article not found | USDA Soil Texture Triangle" : "Page not found | Soil Logic";
  }, [article]);
  return (
    <div className="page guides">
      <SiteHeader />
      <main>
        <Crumbs current="Not found" />
        <section className="wrap not-found">
          <p className="eyebrow">404</p>
          <h1 className="display">{article ? "Article not found" : "Page not found"}</h1>
          <p className="lead">
            {article
              ? "The requested USDA soil texture class article does not exist yet."
              : "There is nothing at this address. The calculator and the soil guides are one step away."}
          </p>
          <div className="not-found__actions">
            <Link className="btn" to={article ? "/articles" : "/"}>
              {article ? "Back to articles" : "Open the calculator"}
              <Arrow />
            </Link>
            {article ? null : (
              <Link className="btn btn--ghost" to="/articles">
                All articles
              </Link>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const article = (slug ? findArticleBySlug(slug) : undefined) as Article | undefined;

  useEffect(() => {
    if (article) document.title = `${article.title} | USDA Soil Texture Triangle`;
    window.scrollTo(0, 0);
  }, [article]);

  if (!article) return <NotFoundPage article />;

  const name = classOf(article);
  const known = (TEXTURE_CLASSES as readonly string[]).includes(name);
  const facts = known ? CLASS_FACTS[name] : null;

  return (
    <div className="page guides">
      <a className="skip-link" href="#article">
        Skip to the article
      </a>
      <SiteHeader />
      <main>
        <Crumbs current={article.textureClass} />
        {article.feature ? (
          <div className="wrap" id="article">
            <article className="feature-article">
              <header className="feature-hero">
                <p>{article.feature.label}</p>
                <h1>
                  The <em>{article.textureClass}</em> Textural Class
                </h1>
                <span>{article.feature.subtitle}</span>
              </header>
              <div className="feature-meta-bar">
                {article.feature.meta.map((item: string) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <FeatureBody key={article.slug} slug={article.slug} />
            </article>
          </div>
        ) : (
          <div className="wrap guide" id="article">
            <aside className="guide__aside">
              {known ? <ClassGlyph name={name} className="glyph guide__glyph" /> : null}
              {facts ? (
                <dl className="guide__facts">
                  {(["sand", "silt", "clay"] as const).map((key) => (
                    <div key={key} data-f={key}>
                      <dt className="mono">{key}</dt>
                      <dd>
                        {facts.range[key][0]}–{facts.range[key][1]}
                        <small>%</small>
                      </dd>
                    </div>
                  ))}
                  <div>
                    <dt className="mono">Share of the triangle</dt>
                    <dd>
                      {facts.share.toFixed(1)}
                      <small>%</small>
                    </dd>
                  </div>
                </dl>
              ) : null}
              <Link className="btn btn--ghost" to="/">
                Classify a sample
                <Arrow />
              </Link>
            </aside>
            <article className="article-page">
              <header>
                <p className="eyebrow">{article.textureClass} texture class</p>
                <h1 className="display">{article.title}</h1>
                <p className="lead">{article.excerpt}</p>
                <div className="article-meta mono">
                  <span>{article.date}</span>
                  <span>{article.readingTime}</span>
                </div>
              </header>
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets?.length ? (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </article>
          </div>
        )}
        <Pager slug={article.slug} />
      </main>
      <SiteFooter />
    </div>
  );
}

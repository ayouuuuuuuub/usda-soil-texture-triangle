// The twelve USDA classes as the site shows them: a glyph (the class's place in the triangle), the span
// of each fraction over the class, and the card that links to its guide.
import { Link } from "react-router-dom";
import { articles } from "../data/articles";
import { TEXTURE_LABELS } from "../home/triangleStyles";
import { TEXTURE_CLASSES, buildClassFills, classifySoilTexture, type SoilFractions, type TextureClass } from "../soilTexture";
import { Arrow } from "./Chrome";
import { UI_TEXT, type Locale } from "./i18n";
import "../styles/cards.css";

type Range = Record<keyof SoilFractions, [number, number]>;

// Read off the same rules that classify the samples: every whole-percent composition is classified,
// and each class keeps the lowest and highest value of each fraction, and its share of the triangle.
function buildClassFacts() {
  const facts = Object.fromEntries(
    TEXTURE_CLASSES.map((name) => [name, { range: { sand: [100, 0], silt: [100, 0], clay: [100, 0] } as Range, share: 0 }]),
  ) as Record<TextureClass, { range: Range; share: number }>;
  let total = 0;
  for (let sand = 0; sand <= 100; sand += 1) {
    for (let clay = 0; clay <= 100 - sand; clay += 1) {
      const sample = { sand, silt: 100 - sand - clay, clay };
      const fact = facts[classifySoilTexture(sample)];
      total += 1;
      fact.share += 1;
      for (const key of ["sand", "silt", "clay"] as const) {
        fact.range[key][0] = Math.min(fact.range[key][0], sample[key]);
        fact.range[key][1] = Math.max(fact.range[key][1], sample[key]);
      }
    }
  }
  for (const name of TEXTURE_CLASSES) facts[name].share = (facts[name].share / total) * 100;
  return facts;
}

export const CLASS_FACTS = buildClassFacts();
export const CLASS_PATHS = Object.fromEntries(buildClassFills().map((fill) => [fill.textureClass, fill.path])) as Record<
  TextureClass,
  string
>;

export function classOf(article: { textureClass: string }) {
  return article.textureClass.toLowerCase() as TextureClass;
}

const OUTLINE = "M72 586L688 586L380 52Z";

export function ClassGlyph({ name, className = "glyph" }: { name: TextureClass; className?: string }) {
  return (
    <svg className={className} viewBox="56 40 648 560" aria-hidden="true" focusable="false">
      <path className="glyph__tri" d={OUTLINE} />
      <path className="glyph__area" d={CLASS_PATHS[name]} />
      <path className="glyph__edge" d={OUTLINE} />
    </svg>
  );
}

export function ClassRange({ name, locale }: { name: TextureClass; locale: Locale }) {
  const t = UI_TEXT[locale];
  const { range } = CLASS_FACTS[name];
  return (
    <dl className="class-range mono">
      {(["sand", "silt", "clay"] as const).map((key) => (
        <div key={key} data-f={key}>
          <dt>{t[key]}</dt>
          <dd>
            {range[key][0]}–{range[key][1]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ClassCard({
  article,
  index,
  locale,
  heading: Heading = "h3",
  meta = false,
}: {
  article: (typeof articles)[number];
  index: number;
  locale: Locale;
  heading?: "h2" | "h3";
  meta?: boolean;
}) {
  const t = UI_TEXT[locale];
  const name = classOf(article);
  return (
    <article className="class-card">
      <Link to={`/articles/${article.slug}`} aria-label={`${t.readArticle} ${t.readArticleAbout} ${article.textureClass}`}>
        <div className="class-card__top">
          <span className="mono">{String(index + 1).padStart(2, "0")}</span>
          <ClassGlyph name={name} />
        </div>
        <Heading>{TEXTURE_LABELS[name][locale]}</Heading>
        <p>{article.excerpt}</p>
        <ClassRange name={name} locale={locale} />
        <span className="class-card__go">
          <span>
            {t.readArticle}
            {meta ? <small className="mono">{article.readingTime}</small> : null}
          </span>
          <Arrow />
        </span>
      </Link>
    </article>
  );
}

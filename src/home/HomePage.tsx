// The calculator page: a sample ledger and the texture triangle side by side, then the results table,
// how to use the tool, the twelve classes and the way to the consulting work.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { articles } from "../data/articles";
import {
  classifySoilTexture,
  isValidSoilFractions,
  totalFractions,
  type SoilFractions,
  type TextureClass,
} from "../soilTexture";
import { Arrow, SiteFooter, SiteHeader, useDocumentLang, useLocale } from "../site/Chrome";
import { ClassCard } from "../site/classes";
import { EXTRA, UI_TEXT, type Locale } from "../site/i18n";
import TextureTriangle from "./TextureTriangle";
import { SAMPLE_COLORS, TEXTURE_LABELS, TRIANGLE_STYLES } from "./triangleStyles";
import "../styles/home.css";

type Sample = SoilFractions & {
  id: string;
  label: string;
};

type FractionField = keyof SoilFractions;

const INITIAL_SAMPLES: Sample[] = [
  { id: "north-field", label: "North field", sand: 40, silt: 40, clay: 20 },
  { id: "orchard", label: "Orchard block", sand: 62, silt: 22, clay: 16 },
  { id: "low-terrace", label: "Low terrace", sand: 18, silt: 52, clay: 30 },
];

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

function textureLabel(textureClass: TextureClass, locale: Locale) {
  return TEXTURE_LABELS[textureClass][locale];
}

function validationMessageFor(fractions: SoilFractions, locale: Locale) {
  const text = UI_TEXT[locale];
  const values = [fractions.sand, fractions.silt, fractions.clay];
  if (!values.every((value) => Number.isFinite(value))) return text.validationNumeric;
  if (!values.every((value) => value >= 0 && value <= 100)) return text.validationRange;
  const total = totalFractions(fractions);
  if (Math.abs(total - 100) > 0.05) {
    return `${text.validationTotal} ${total.toFixed(1)}%.`;
  }
  return "";
}

function remainingFractionField(fields: FractionField[]) {
  return (["sand", "silt", "clay"] as const).find((field) => !fields.includes(field));
}

function normalizeNumber(value: number) {
  return Math.round(value * 10_000) / 10_000;
}

function splitDelimitedLine(line: string) {
  const delimiter = [",", "|", ";", "\t"].find((candidate) => line.includes(candidate)) ?? ",";
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values.map((value) => value.replace(/^"|"$/g, ""));
}

function parseSamplesCsv(text: string, locale: Locale) {
  const ui = UI_TEXT[locale];
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    throw new Error(ui.csvNoRows);
  }

  const headers = splitDelimitedLine(lines[0]).map((header) => header.trim().toLowerCase());
  const sampleIndex = headers.indexOf("sample");
  const sandIndex = headers.indexOf("sand");
  const clayIndex = headers.indexOf("clay");

  if (sampleIndex === -1 || sandIndex === -1 || clayIndex === -1) {
    throw new Error(ui.csvBadHeaders);
  }

  return lines.slice(1).map((line, index) => {
    const cells = splitDelimitedLine(line);
    const sand = Number(cells[sandIndex]);
    const clay = Number(cells[clayIndex]);
    if (!Number.isFinite(sand) || !Number.isFinite(clay)) {
      throw new Error(`${ui.row} ${index + 2} ${ui.csvBadNumber}`);
    }

    return {
      id: crypto.randomUUID(),
      label: cells[sampleIndex] || `${ui.importedSample} ${index + 1}`,
      sand,
      clay,
      silt: normalizeNumber(100 - sand - clay),
    };
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  useEffect(() => {
    document.title = "USDA Soil Texture Triangle Tool | Free Soil Texture Calculator";
  }, []);

  const { locale } = useLocale();
  useDocumentLang(locale);

  const [samples, setSamples] = useState<Sample[]>(INITIAL_SAMPLES);
  const [lastEditedFields, setLastEditedFields] = useState<Record<string, FractionField[]>>({});
  const [importMessage, setImportMessage] = useState("");
  const [showExternalLegend, setShowExternalLegend] = useState(false);
  const [triangleStyleId, setTriangleStyleId] = useState<(typeof TRIANGLE_STYLES)[number]["id"]>("field");
  const [pointSize, setPointSize] = useState(7);
  const [activeId, setActiveId] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const validSamples = samples.filter(isValidSoilFractions);
  const t = UI_TEXT[locale];
  const x = EXTRA[locale];

  const plotIndex = new Map(validSamples.map((sample, index) => [sample.id, index]));
  const distribution = new Map<TextureClass, number>();
  for (const sample of validSamples) {
    const name = classifySoilTexture(sample);
    distribution.set(name, (distribution.get(name) ?? 0) + 1);
  }

  function updateSample(id: string, field: keyof Omit<Sample, "id">, value: string) {
    if (field === "label") {
      setSamples((current) =>
        current.map((sample) => (sample.id === id ? { ...sample, label: value } : sample)),
      );
      return;
    }

    const numericValue = Number(value);
    const previousFields = lastEditedFields[id] ?? [];
    const nextFields = [field, ...previousFields.filter((item) => item !== field)].slice(0, 2);
    const computedField = nextFields.length === 2 ? remainingFractionField(nextFields) : undefined;

    setLastEditedFields((current) => ({ ...current, [id]: nextFields }));
    setSamples((current) =>
      current.map((sample) => {
        if (sample.id !== id) return sample;
        const nextSample = { ...sample, [field]: numericValue };
        if (computedField && Number.isFinite(numericValue) && Number.isFinite(nextSample[nextFields[1]])) {
          nextSample[computedField] = normalizeNumber(100 - nextSample[nextFields[0]] - nextSample[nextFields[1]]);
        }
        return nextSample;
      }),
    );
  }

  function addSample(fractions: SoilFractions = { sand: 0, silt: 0, clay: 0 }) {
    const id = crypto.randomUUID();
    setSamples((current) => [...current, { id, label: `${t.sample} ${current.length + 1}`, ...fractions }]);
    return id;
  }

  // a sample dropped on the triangle, or a plotted point dragged: sand and clay are set, silt follows
  function placeSample(fractions: SoilFractions) {
    const id = addSample(fractions);
    setLastEditedFields((current) => ({ ...current, [id]: ["clay", "sand"] }));
  }

  function moveSample(id: string, fractions: SoilFractions) {
    setSamples((current) => current.map((sample) => (sample.id === id ? { ...sample, ...fractions } : sample)));
    setLastEditedFields((current) => ({ ...current, [id]: ["clay", "sand"] }));
  }

  function deleteSample(id: string) {
    setSamples((current) => current.filter((sample) => sample.id !== id));
    setLastEditedFields((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function resetSamples() {
    setSamples(INITIAL_SAMPLES);
    setLastEditedFields({});
    setImportMessage("");
  }

  async function importCsvFile(file: File) {
    try {
      const importedSamples = parseSamplesCsv(await file.text(), locale);
      setSamples((current) => [...current, ...importedSamples]);
      setLastEditedFields((current) => {
        const next = { ...current };
        for (const sample of importedSamples) {
          next[sample.id] = ["clay", "sand"];
        }
        return next;
      });
      setImportMessage(`${t.imported} ${importedSamples.length} ${t.samplesFrom} ${file.name}.`);
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : t.csvUnable);
    } finally {
      if (csvInputRef.current) csvInputRef.current.value = "";
    }
  }

  function exportResultsTable() {
    const header =
      locale === "fr"
        ? ["echantillon", "sable", "limon", "argile", "total", "statut", "classe_texture_usda"]
        : ["sample", "sand", "silt", "clay", "total", "status", "usda_texture_class"];
    const rows = samples.map((sample) => {
      const valid = isValidSoilFractions(sample);
      return [
        sample.label || t.untitledSample,
        formatNumber(sample.sand),
        formatNumber(sample.silt),
        formatNumber(sample.clay),
        formatNumber(totalFractions(sample)),
        valid ? t.valid : t.invalid,
        valid ? textureLabel(classifySoilTexture(sample), locale) : validationMessageFor(sample, locale),
      ];
    });

    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "usda-soil-texture-results.csv");
  }

  return (
    <div className="page home">
      <a className="skip-link" href="#calculator">
        {x.skip}
      </a>
      <SiteHeader />
      <main>
        <section className="bench wrap" id="calculator">
          <div className="bench__intro" data-enter="">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="display">{t.title}</h1>
            <p className="lead">{t.subtitle}</p>
            <p className="bench__note mono">{x.heroNote}</p>
          </div>

          <div className="ledger" data-enter="">
            <div className="ledger__head">
              <div>
                <h2>{t.samples}</h2>
                <p className="ledger__count" aria-label={t.sampleSummary}>
                  <strong>{samples.length}</strong> {t.samplesEntered}
                  <span aria-hidden="true"> · </span>
                  <strong>{validSamples.length}</strong> {t.validForPlotting}
                </p>
              </div>
              <div className="ledger__actions">
                <input
                  ref={csvInputRef}
                  className="sr-only"
                  type="file"
                  tabIndex={-1}
                  aria-hidden="true"
                  accept=".csv,text/csv"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void importCsvFile(file);
                  }}
                />
                <button type="button" className="btn btn--small btn--ghost" onClick={() => csvInputRef.current?.click()}>
                  {t.importCsv}
                </button>
                <button type="button" className="btn btn--small btn--ghost" onClick={resetSamples}>
                  {t.reset}
                </button>
                <button type="button" className="btn btn--small" onClick={() => addSample()}>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
                    <path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  {t.addSample}
                </button>
              </div>
            </div>
            <p className="ledger__help">{t.sampleHelp}</p>
            <p className="ledger__message" role="status" aria-live="polite">
              {importMessage}
            </p>

            {samples.length ? null : <p className="ledger__empty">{x.emptyLedger}</p>}
            <ul className="rows">
              {samples.map((sample) => {
                const message = validationMessageFor(sample, locale);
                const validationId = `validation-${sample.id}`;
                const index = plotIndex.get(sample.id);
                const color = index === undefined ? undefined : SAMPLE_COLORS[index % SAMPLE_COLORS.length];
                const fractionInputProps = {
                  type: "number",
                  inputMode: "decimal",
                  min: "0",
                  max: "100",
                  step: "0.1",
                  "aria-invalid": message ? true : undefined,
                  "aria-describedby": message ? validationId : undefined,
                } as const;
                return (
                  <li
                    className="row"
                    key={sample.id}
                    data-invalid={message ? "" : undefined}
                    data-active={activeId === sample.id ? "" : undefined}
                    onPointerEnter={() => setActiveId(sample.id)}
                    onPointerLeave={() => setActiveId(null)}
                    onFocus={() => setActiveId(sample.id)}
                    onBlur={() => setActiveId(null)}
                  >
                    <span className="row__dot" style={{ background: color }} aria-hidden="true" />
                    <label className="row__label">
                      <span>{t.label}</span>
                      <input value={sample.label} onChange={(event) => updateSample(sample.id, "label", event.target.value)} />
                    </label>
                    {(["sand", "silt", "clay"] as const).map((field) => (
                      <label className="row__f" data-f={field} key={field}>
                        <span>{t[field]} %</span>
                        <input
                          {...fractionInputProps}
                          value={sample[field]}
                          onChange={(event) => updateSample(sample.id, field, event.target.value)}
                        />
                      </label>
                    ))}
                    <div className="row__total">
                      <span>{t.total}</span>
                      <strong>{formatNumber(totalFractions(sample))}%</strong>
                    </div>
                    <button
                      type="button"
                      className="row__delete"
                      aria-label={`${t.delete} ${sample.label || t.untitledSample}`}
                      onClick={() => deleteSample(sample.id)}
                    >
                      <DeleteIcon />
                    </button>
                    <div className="row__foot">
                      <span
                        className="jar"
                        aria-hidden="true"
                        style={
                          {
                            "--a": Math.max(0, sample.sand || 0),
                            "--b": Math.max(0, sample.silt || 0),
                            "--c": Math.max(0, sample.clay || 0),
                          } as CSSProperties
                        }
                      >
                        <i data-f="sand" />
                        <i data-f="silt" />
                        <i data-f="clay" />
                      </span>
                      {message ? (
                        <p className="row__error" id={validationId}>
                          {message}
                        </p>
                      ) : (
                        <p className="row__class">{textureLabel(classifySoilTexture(sample), locale)}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bench__plot" data-enter="">
            <h2 className="sr-only">{t.textureTriangle}</h2>
            <TextureTriangle
              status={validSamples.length ? t.validPlotted : t.noValidSamples}
              showExternalLegend={showExternalLegend}
              samples={validSamples}
              selectedStyleId={triangleStyleId}
              locale={locale}
              pointSize={pointSize}
              activeId={activeId}
              onActive={setActiveId}
              onPlace={placeSample}
              onMove={moveSample}
              onToggleExternalLegend={() => setShowExternalLegend((current) => !current)}
              onStyleChange={setTriangleStyleId}
              onPointSizeChange={setPointSize}
            />
          </div>
        </section>

        <section className="results wrap">
          <div className="section-head">
            <div>
              <h2 className="display">{t.results}</h2>
              <p className="lead">{t.resultsHelp}</p>
            </div>
            <button type="button" className="btn btn--ghost" onClick={exportResultsTable}>
              {t.exportTable}
            </button>
          </div>
          {distribution.size ? (
            <ul className="tally" aria-label={x.distribution}>
              {[...distribution].map(([name, count]) => (
                <li key={name}>
                  <b>{textureLabel(name, locale)}</b>
                  <span className="mono">×{count}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t.sample}</th>
                  <th>{t.sand}</th>
                  <th>{t.silt}</th>
                  <th>{t.clay}</th>
                  <th>{t.total}</th>
                  <th>{t.textureClass}</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample) => {
                  const valid = isValidSoilFractions(sample);
                  return (
                    <tr key={sample.id} className={valid ? "" : "invalid-result"}>
                      <td>{sample.label || t.untitledSample}</td>
                      <td>{formatNumber(sample.sand)}%</td>
                      <td>{formatNumber(sample.silt)}%</td>
                      <td>{formatNumber(sample.clay)}%</td>
                      <td>{formatNumber(totalFractions(sample))}%</td>
                      <td>
                        {valid ? textureLabel(classifySoilTexture(sample), locale) : validationMessageFor(sample, locale)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="method" aria-label={t.howToTitle}>
          <div className="wrap method__in">
            <div className="method__copy">
              <p className="eyebrow">{x.stepsKicker}</p>
              <p className="method__lead">{t.seoLead}</p>
              <p className="lead">{t.seoBody}</p>
            </div>
            <div className="method__steps">
              <h2 className="mono">{t.howToTitle}</h2>
              <ol>
                {t.howToSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="classes wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">{x.classesKicker}</p>
              <h2 className="display">{t.exploreTitle}</h2>
              <p className="lead">{t.exploreIntro}</p>
            </div>
            <Link className="link" to="/articles">
              {t.allArticles}
              <Arrow />
            </Link>
          </div>
          <div className="class-grid">
            {articles.map((article, index) => (
              <ClassCard key={article.slug} article={article} index={index} locale={locale} />
            ))}
          </div>
        </section>

        <section className="band wrap">
          <div className="band__in">
            <div className="band__copy">
              <p className="eyebrow">{x.bandKicker}</p>
              <h2 className="display">
                {x.bandTitleA} <em>{x.bandTitleB}</em>
              </h2>
              <p>{x.bandBody}</p>
              <div className="band__actions">
                <Link className="btn btn--paper" to="/portfolio">
                  {x.bandCta}
                  <Arrow />
                </Link>
                <a className="link" href="mailto:contact@soil-logic.com">
                  contact@soil-logic.com
                </a>
              </div>
            </div>
            <Link className="band__photo" to="/portfolio" tabIndex={-1} aria-hidden="true">
              <img
                src="/portfolio/photos/hero-soil-red-640.webp"
                srcSet="/portfolio/photos/hero-soil-red-640.webp 640w, /portfolio/photos/hero-soil-red-960.webp 960w"
                sizes="(max-width: 860px) 100vw, 40vw"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

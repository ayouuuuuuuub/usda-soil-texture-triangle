import { useMemo, useRef, useState } from "react";
import {
  TRIANGLE,
  buildAnalyticalBoundaryPath,
  buildClassFills,
  classifySoilTexture,
  isValidSoilFractions,
  polygonPoints,
  ternaryToPoint,
  totalFractions,
  type SoilFractions,
  type TextureClass,
} from "./soilTexture";

type Sample = SoilFractions & {
  id: string;
  label: string;
};

type FractionField = keyof SoilFractions;
type Locale = "en" | "fr";

const INITIAL_SAMPLES: Sample[] = [
  { id: "north-field", label: "North field", sand: 40, silt: 40, clay: 20 },
  { id: "orchard", label: "Orchard block", sand: 62, silt: 22, clay: 16 },
  { id: "low-terrace", label: "Low terrace", sand: 18, silt: 52, clay: 30 },
];

const CLASS_COLORS = [
  "#d8b365",
  "#e5c68b",
  "#c7d59f",
  "#9fc7a7",
  "#9cc9c8",
  "#b6d4e7",
  "#caa47f",
  "#b59b84",
  "#a9b79a",
  "#ad7f6f",
  "#879a82",
  "#8f8178",
];

const TRIANGLE_STYLES = [
  {
    id: "field",
    name: "Field journal",
    background: "#fbfaf6",
    border: "#273126",
    boundary: "#655d50",
    grid: "#394033",
    text: "#263126",
    tick: "#5e665c",
    colors: CLASS_COLORS,
  },
  {
    id: "minimal",
    name: "Minimal ink",
    background: "#ffffff",
    border: "#111827",
    boundary: "#374151",
    grid: "#6b7280",
    text: "#111827",
    tick: "#4b5563",
    colors: ["#f3f4f6", "#e5e7eb", "#d1d5db", "#c7d2fe", "#bfdbfe", "#dbeafe", "#ddd6fe", "#c4b5fd", "#a7f3d0", "#fecaca", "#bbf7d0", "#d6d3d1"],
  },
  {
    id: "agronomy",
    name: "Agronomy",
    background: "#f7fbf4",
    border: "#1f3d2b",
    boundary: "#496a4d",
    grid: "#55735b",
    text: "#1f3d2b",
    tick: "#58705a",
    colors: ["#e4c27d", "#ead69d", "#d4dfa4", "#b8d69f", "#a7cfb5", "#c1ddec", "#d3ae81", "#c9ad8e", "#b9c99d", "#bf8a72", "#93aa83", "#8d8476"],
  },
  {
    id: "scientific",
    name: "Scientific",
    background: "#f8fafc",
    border: "#172554",
    boundary: "#334155",
    grid: "#64748b",
    text: "#0f172a",
    tick: "#475569",
    colors: ["#fee8c8", "#fdd49e", "#fdbb84", "#9ecae1", "#6baed6", "#c6dbef", "#c7e9c0", "#a1d99b", "#74c476", "#fb6a4a", "#de2d26", "#9e9ac8"],
  },
  {
    id: "contrast",
    name: "High contrast",
    background: "#fffef8",
    border: "#000000",
    boundary: "#111111",
    grid: "#525252",
    text: "#000000",
    tick: "#262626",
    colors: ["#facc15", "#fde047", "#bef264", "#86efac", "#67e8f9", "#bae6fd", "#fb923c", "#f97316", "#34d399", "#ef4444", "#22c55e", "#a3a3a3"],
  },
  {
    id: "atlas",
    name: "Atlas",
    background: "#f6f3ea",
    border: "#2f2a1f",
    boundary: "#78684a",
    grid: "#8b7e65",
    text: "#2f2a1f",
    tick: "#655a46",
    colors: ["#d8a75f", "#e6c47a", "#d2c779", "#b7c884", "#a6c2a8", "#b7d1d7", "#c38d62", "#b99a74", "#aab27b", "#a97465", "#879974", "#8b7c6b"],
  },
  {
    id: "coastal",
    name: "Coastal",
    background: "#f7fcfb",
    border: "#164e63",
    boundary: "#0f766e",
    grid: "#5aa6a5",
    text: "#12343b",
    tick: "#41666a",
    colors: ["#f5d99b", "#f7e3b5", "#d9e7a8", "#b7dfbb", "#96d6c8", "#a8d8ea", "#d2a679", "#c49a82", "#a9c49b", "#bd7f74", "#7aa18d", "#8a8982"],
  },
  {
    id: "pastel",
    name: "Soft pastel",
    background: "#fffaf7",
    border: "#5b5149",
    boundary: "#81746b",
    grid: "#a89b90",
    text: "#4a4039",
    tick: "#746860",
    colors: ["#f6d7a7", "#fae4b5", "#dce8b8", "#c6e0bd", "#bce0d8", "#c9e6f2", "#e6bfa0", "#d6b8aa", "#c8d5b4", "#d9a59b", "#aebfa3", "#b7ada6"],
  },
  {
    id: "slate",
    name: "Slate lab",
    background: "#f8fafc",
    border: "#1e293b",
    boundary: "#475569",
    grid: "#94a3b8",
    text: "#1e293b",
    tick: "#475569",
    colors: ["#d6b777", "#e7cf94", "#c8d6a0", "#acc8a4", "#9bc5c0", "#b6d4e2", "#c8a083", "#b99b86", "#aab695", "#aa7b72", "#81927f", "#7d7c7a"],
  },
  {
    id: "publication",
    name: "Publication",
    background: "#ffffff",
    border: "#222222",
    boundary: "#333333",
    grid: "#b0b0b0",
    text: "#111111",
    tick: "#555555",
    colors: ["#ece2c6", "#e4d6ad", "#d7deb8", "#bfd5ba", "#b8d6d4", "#d8e7ef", "#d2b192", "#c4ad9b", "#bdc8a9", "#bd958c", "#a5b09a", "#b0aaa4"],
  },
] as const;

type TriangleStyle = (typeof TRIANGLE_STYLES)[number];

type StyleVisuals = {
  fillOpacity: number;
  gridOpacity: number;
  gridWidth: number;
  gridEvery: 1 | 2;
  boundaryOpacity: number;
  boundaryWidth: number;
  borderWidth: number;
  labelSize: number;
  labelWeight: number;
  labelTransform: "none" | "uppercase";
  labelStrokeWidth: number;
  tickSize: number;
  axisSize: number;
  pointStrokeWidth: number;
};

const STYLE_VISUALS: Record<TriangleStyle["id"], StyleVisuals> = {
  field: {
    fillOpacity: 0.72,
    gridOpacity: 0.15,
    gridWidth: 1,
    gridEvery: 1,
    boundaryOpacity: 0.72,
    boundaryWidth: 1.4,
    borderWidth: 2.2,
    labelSize: 13,
    labelWeight: 800,
    labelTransform: "none",
    labelStrokeWidth: 4,
    tickSize: 12,
    axisSize: 16,
    pointStrokeWidth: 2.5,
  },
  minimal: {
    fillOpacity: 0.42,
    gridOpacity: 0.08,
    gridWidth: 0.75,
    gridEvery: 2,
    boundaryOpacity: 0.52,
    boundaryWidth: 1,
    borderWidth: 1.6,
    labelSize: 12,
    labelWeight: 650,
    labelTransform: "none",
    labelStrokeWidth: 5,
    tickSize: 11,
    axisSize: 15,
    pointStrokeWidth: 2,
  },
  agronomy: {
    fillOpacity: 0.82,
    gridOpacity: 0.18,
    gridWidth: 1.1,
    gridEvery: 1,
    boundaryOpacity: 0.78,
    boundaryWidth: 1.7,
    borderWidth: 2.5,
    labelSize: 13,
    labelWeight: 850,
    labelTransform: "none",
    labelStrokeWidth: 4,
    tickSize: 12,
    axisSize: 16,
    pointStrokeWidth: 3,
  },
  scientific: {
    fillOpacity: 0.64,
    gridOpacity: 0.26,
    gridWidth: 0.9,
    gridEvery: 1,
    boundaryOpacity: 0.92,
    boundaryWidth: 1.2,
    borderWidth: 2,
    labelSize: 12,
    labelWeight: 750,
    labelTransform: "uppercase",
    labelStrokeWidth: 3,
    tickSize: 11,
    axisSize: 15,
    pointStrokeWidth: 2.5,
  },
  contrast: {
    fillOpacity: 0.9,
    gridOpacity: 0.32,
    gridWidth: 1.2,
    gridEvery: 1,
    boundaryOpacity: 1,
    boundaryWidth: 2.2,
    borderWidth: 3,
    labelSize: 13,
    labelWeight: 950,
    labelTransform: "uppercase",
    labelStrokeWidth: 5,
    tickSize: 12,
    axisSize: 17,
    pointStrokeWidth: 3.5,
  },
  atlas: {
    fillOpacity: 0.76,
    gridOpacity: 0.22,
    gridWidth: 1.1,
    gridEvery: 1,
    boundaryOpacity: 0.66,
    boundaryWidth: 1.1,
    borderWidth: 2,
    labelSize: 12,
    labelWeight: 700,
    labelTransform: "none",
    labelStrokeWidth: 3.5,
    tickSize: 11,
    axisSize: 15,
    pointStrokeWidth: 2.3,
  },
  coastal: {
    fillOpacity: 0.7,
    gridOpacity: 0.16,
    gridWidth: 1.4,
    gridEvery: 1,
    boundaryOpacity: 0.7,
    boundaryWidth: 1.6,
    borderWidth: 2.2,
    labelSize: 13,
    labelWeight: 800,
    labelTransform: "none",
    labelStrokeWidth: 4,
    tickSize: 12,
    axisSize: 16,
    pointStrokeWidth: 2.5,
  },
  pastel: {
    fillOpacity: 0.58,
    gridOpacity: 0.11,
    gridWidth: 0.8,
    gridEvery: 2,
    boundaryOpacity: 0.38,
    boundaryWidth: 1,
    borderWidth: 1.7,
    labelSize: 12,
    labelWeight: 750,
    labelTransform: "none",
    labelStrokeWidth: 5,
    tickSize: 11,
    axisSize: 15,
    pointStrokeWidth: 2,
  },
  slate: {
    fillOpacity: 0.68,
    gridOpacity: 0.28,
    gridWidth: 1,
    gridEvery: 1,
    boundaryOpacity: 0.86,
    boundaryWidth: 1.5,
    borderWidth: 2.4,
    labelSize: 12,
    labelWeight: 850,
    labelTransform: "uppercase",
    labelStrokeWidth: 4,
    tickSize: 11,
    axisSize: 15,
    pointStrokeWidth: 2.8,
  },
  publication: {
    fillOpacity: 0.36,
    gridOpacity: 0.2,
    gridWidth: 0.8,
    gridEvery: 1,
    boundaryOpacity: 1,
    boundaryWidth: 1.1,
    borderWidth: 1.8,
    labelSize: 11,
    labelWeight: 700,
    labelTransform: "uppercase",
    labelStrokeWidth: 6,
    tickSize: 10,
    axisSize: 14,
    pointStrokeWidth: 2,
  },
};

const STYLE_NAMES: Record<TriangleStyle["id"], Record<Locale, string>> = {
  field: { en: "Field journal", fr: "Carnet de terrain" },
  minimal: { en: "Minimal ink", fr: "Minimaliste" },
  agronomy: { en: "Agronomy", fr: "Agronomie" },
  scientific: { en: "Scientific", fr: "Scientifique" },
  contrast: { en: "High contrast", fr: "Contraste eleve" },
  atlas: { en: "Atlas", fr: "Atlas" },
  coastal: { en: "Coastal", fr: "Littoral" },
  pastel: { en: "Soft pastel", fr: "Pastel doux" },
  slate: { en: "Slate lab", fr: "Laboratoire" },
  publication: { en: "Publication", fr: "Publication" },
};

const TEXTURE_LABELS: Record<TextureClass, Record<Locale, string>> = {
  sand: { en: "sand", fr: "sable" },
  "loamy sand": { en: "loamy sand", fr: "sable limoneux" },
  "sandy loam": { en: "sandy loam", fr: "limon sableux" },
  loam: { en: "loam", fr: "limon" },
  "silt loam": { en: "silt loam", fr: "Limon fin" },
  silt: { en: "silt", fr: "Limon tres fin" },
  "sandy clay loam": { en: "sandy clay loam", fr: "limon argilo-sableux" },
  "clay loam": { en: "clay loam", fr: "limon argileux" },
  "silty clay loam": { en: "silty clay loam", fr: "limon argilo-limoneux" },
  "sandy clay": { en: "sandy clay", fr: "argile sableuse" },
  "silty clay": { en: "silty clay", fr: "argile limoneuse" },
  clay: { en: "clay", fr: "argile" },
};

const UI_TEXT = {
  en: {
    eyebrow: "USDA soil textural triangle",
    title: "Classify and compare soil texture samples",
    subtitle:
      "Enter sand, silt, and clay percentages for one or many samples. Valid rows are classified and plotted together on the USDA triangle.",
    language: "Language",
    samplesEntered: "samples entered",
    validForPlotting: "valid for plotting",
    sampleSummary: "Sample summary",
    samples: "Samples",
    sampleHelp: "Totals must equal 100% before a point appears on the triangle.",
    importCsv: "Import CSV",
    reset: "Reset",
    addSample: "Add sample",
    label: "Label",
    sand: "Sand",
    silt: "Silt",
    clay: "Clay",
    total: "Total",
    delete: "Delete",
    textureTriangle: "Texture triangle",
    validPlotted: "Valid samples are plotted and labeled.",
    noValidSamples: "No valid samples yet.",
    triangleStyle: "Triangle style",
    pointSize: "Point size",
    outsideLegend: "Outside legend",
    exportPng: "Export PNG",
    exportSvg: "Export SVG",
    axisSand: "% sand",
    axisSilt: "% silt",
    axisClay: "% clay",
    sampleLegend: "Sample legend",
    figcaption: "Triangle coordinates use clay at the apex, sand at lower left, and silt at lower right.",
    results: "Classification results",
    resultsHelp: "Texture classes are assigned from the same USDA boundary rules used by the plot.",
    exportTable: "Export table CSV",
    sample: "Sample",
    textureClass: "USDA texture class",
    untitledSample: "Untitled sample",
    valid: "valid",
    invalid: "invalid",
    importedSample: "Imported sample",
    csvNoRows: "CSV must include a header row and at least one sample row.",
    csvBadHeaders: 'CSV headers must include "sample", "sand", and "clay".',
    row: "Row",
    csvBadNumber: "has a non-numeric sand or clay value.",
    csvUnable: "Unable to import CSV.",
    imported: "Imported",
    samplesFrom: "samples from",
    validationNumeric: "Enter numeric percentages for sand, silt, and clay.",
    validationRange: "Each fraction must be between 0 and 100%.",
    validationTotal: "Sand + silt + clay must equal 100%. Current total:",
  },
  fr: {
    eyebrow: "Triangle textural USDA des sols",
    title: "Classer et comparer des echantillons de sol",
    subtitle:
      "Saisissez les pourcentages de sable, limon et argile pour un ou plusieurs echantillons. Les lignes valides sont classees et tracees ensemble sur le triangle USDA.",
    language: "Langue",
    samplesEntered: "echantillons saisis",
    validForPlotting: "valides pour le trace",
    sampleSummary: "Resume des echantillons",
    samples: "Echantillons",
    sampleHelp: "Le total doit etre egal a 100 % avant qu'un point apparaisse sur le triangle.",
    importCsv: "Importer CSV",
    reset: "Reinitialiser",
    addSample: "Ajouter",
    label: "Libelle",
    sand: "Sable",
    silt: "Limon",
    clay: "Argile",
    total: "Total",
    delete: "Supprimer",
    textureTriangle: "Triangle textural",
    validPlotted: "Les echantillons valides sont traces et etiquetes.",
    noValidSamples: "Aucun echantillon valide pour le moment.",
    triangleStyle: "Style du triangle",
    pointSize: "Taille des points",
    outsideLegend: "Legende externe",
    exportPng: "Exporter PNG",
    exportSvg: "Exporter SVG",
    axisSand: "% sable",
    axisSilt: "% limon",
    axisClay: "% argile",
    sampleLegend: "Legende des echantillons",
    figcaption: "Les coordonnees du triangle placent l'argile au sommet, le sable en bas a gauche et le limon en bas a droite.",
    results: "Resultats de classification",
    resultsHelp: "Les classes texturales sont attribuees avec les memes limites USDA que le graphique.",
    exportTable: "Exporter le tableau CSV",
    sample: "Echantillon",
    textureClass: "Classe texturale USDA",
    untitledSample: "Echantillon sans nom",
    valid: "valide",
    invalid: "invalide",
    importedSample: "Echantillon importe",
    csvNoRows: "Le CSV doit contenir une ligne d'en-tete et au moins une ligne d'echantillon.",
    csvBadHeaders: 'Les en-tetes CSV doivent inclure "sample", "sand" et "clay".',
    row: "Ligne",
    csvBadNumber: "contient une valeur sable ou argile non numerique.",
    csvUnable: "Impossible d'importer le CSV.",
    imported: "Importe",
    samplesFrom: "echantillons depuis",
    validationNumeric: "Saisissez des pourcentages numeriques pour le sable, le limon et l'argile.",
    validationRange: "Chaque fraction doit etre comprise entre 0 et 100 %.",
    validationTotal: "Sable + limon + argile doit etre egal a 100 %. Total actuel :",
  },
} as const;

const SAMPLE_COLORS = [
  "#173f35",
  "#b4532f",
  "#2f68a8",
  "#7b4aa0",
  "#c28a12",
  "#0f8b8d",
  "#8f2d56",
  "#4f772d",
  "#5f4b32",
  "#d1495b",
];

const EXPORT_SVG_STYLES = `
  .class-label {
    fill: #1f271f;
    font-family: Inter, Arial, sans-serif;
    font-size: 13px;
    font-weight: 800;
    paint-order: stroke;
    stroke: rgba(255, 255, 255, 0.72);
    stroke-width: 4px;
  }
  .tick-label {
    fill: #5e665c;
    font-family: Inter, Arial, sans-serif;
    font-size: 12px;
    font-weight: 700;
  }
  .axis-label {
    fill: #263126;
    font-family: Inter, Arial, sans-serif;
    font-size: 16px;
    font-weight: 850;
  }
  .sample-label {
    fill: #173f35;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 900;
    paint-order: stroke;
    stroke: #ffffff;
    stroke-width: 4px;
  }
  .legend-label {
    fill: #263126;
    font-family: Inter, Arial, sans-serif;
    font-size: 14px;
    font-weight: 800;
  }
`;

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

function textureLabel(textureClass: TextureClass, locale: Locale) {
  return TEXTURE_LABELS[textureClass][locale];
}

function styleText(value: string, visual: StyleVisuals) {
  return visual.labelTransform === "uppercase" ? value.toUpperCase() : value;
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

function serializeTriangleSvg(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const viewBox = svg.viewBox.baseVal;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(viewBox.width));
  clone.setAttribute("height", String(viewBox.height));

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = EXPORT_SVG_STYLES;
  clone.insertBefore(style, clone.firstChild);

  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
}

function svgExportSize(svg: SVGSVGElement) {
  const viewBox = svg.viewBox.baseVal;
  return {
    width: viewBox.width || TRIANGLE.width,
    height: viewBox.height || TRIANGLE.height,
  };
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const [samples, setSamples] = useState<Sample[]>(INITIAL_SAMPLES);
  const [lastEditedFields, setLastEditedFields] = useState<Record<string, FractionField[]>>({});
  const [importMessage, setImportMessage] = useState("");
  const [showExternalLegend, setShowExternalLegend] = useState(false);
  const [triangleStyleId, setTriangleStyleId] = useState<(typeof TRIANGLE_STYLES)[number]["id"]>("field");
  const [pointSize, setPointSize] = useState(7);
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const classFills = useMemo(() => buildClassFills(), []);
  const classBoundaryPath = useMemo(() => buildAnalyticalBoundaryPath(), []);
  const triangleStyle =
    TRIANGLE_STYLES.find((style) => style.id === triangleStyleId) ?? TRIANGLE_STYLES[0];
  const validSamples = samples.filter(isValidSoilFractions);
  const t = UI_TEXT[locale];

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

  function addSample() {
    setSamples((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        label: `${t.sample} ${current.length + 1}`,
        sand: 0,
        silt: 0,
        clay: 0,
      },
    ]);
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
    downloadBlob(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
      "usda-soil-texture-results.csv",
    );
  }

  return (
    <main className="app-shell">
      <section className="intro">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="summary-stack">
          <div className="language-switch" aria-label={t.language}>
            <span>ENG</span>
            <button
              type="button"
              className={locale === "fr" ? "language-toggle active" : "language-toggle"}
              aria-pressed={locale === "fr"}
              onClick={() => setLocale((current) => (current === "en" ? "fr" : "en"))}
            >
              {locale.toUpperCase()}
            </button>
            <span>FR</span>
          </div>
          <div className="summary-panel" aria-label={t.sampleSummary}>
            <span>{samples.length}</span>
            <p>{t.samplesEntered}</p>
            <strong>
              {validSamples.length} {t.validForPlotting}
            </strong>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="sample-editor">
          <div className="section-heading">
            <div>
              <h2>{t.samples}</h2>
              <p>{t.sampleHelp}</p>
            </div>
            <div className="actions">
              <input
                ref={csvInputRef}
                className="file-input"
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void importCsvFile(file);
                }}
              />
              <button type="button" className="secondary" onClick={() => csvInputRef.current?.click()}>
                {t.importCsv}
              </button>
              <button type="button" className="secondary" onClick={resetSamples}>
                {t.reset}
              </button>
              <button type="button" onClick={addSample}>
                {t.addSample}
              </button>
            </div>
          </div>
          {importMessage ? <p className="import-message">{importMessage}</p> : null}

          <div className="sample-grid" role="list">
            {samples.map((sample) => {
              const message = validationMessageFor(sample, locale);
              return (
                <article className={message ? "sample-row invalid" : "sample-row"} key={sample.id}>
                  <label>
                    <span>{t.label}</span>
                    <input
                      value={sample.label}
                      onChange={(event) => updateSample(sample.id, "label", event.target.value)}
                    />
                  </label>
                  <label>
                    <span>{t.sand} %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={sample.sand}
                      onChange={(event) => updateSample(sample.id, "sand", event.target.value)}
                    />
                  </label>
                  <label>
                    <span>{t.silt} %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={sample.silt}
                      onChange={(event) => updateSample(sample.id, "silt", event.target.value)}
                    />
                  </label>
                  <label>
                    <span>{t.clay} %</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={sample.clay}
                      onChange={(event) => updateSample(sample.id, "clay", event.target.value)}
                    />
                  </label>
                  <div className="row-total">
                    <span>{t.total}</span>
                    <strong>{formatNumber(totalFractions(sample))}%</strong>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`${t.delete} ${sample.label}`}
                    onClick={() => deleteSample(sample.id)}
                  >
                    X
                  </button>
                  {message ? <p className="validation">{message}</p> : null}
                </article>
              );
            })}
          </div>
        </div>

        <div className="triangle-panel">
          <div className="section-heading">
            <div>
              <h2>{t.textureTriangle}</h2>
              <p>{validSamples.length ? t.validPlotted : t.noValidSamples}</p>
            </div>
          </div>
          <TextureTriangle
            classBoundaryPath={classBoundaryPath}
            classFills={classFills}
            showExternalLegend={showExternalLegend}
            samples={validSamples}
            selectedStyleId={triangleStyleId}
            styleOptions={TRIANGLE_STYLES}
            triangleStyle={triangleStyle}
            locale={locale}
            pointSize={pointSize}
            onToggleExternalLegend={() => setShowExternalLegend((current) => !current)}
            onStyleChange={setTriangleStyleId}
            onPointSizeChange={setPointSize}
          />
        </div>
      </section>

      <section className="results">
        <div className="section-heading">
          <div>
            <h2>{t.results}</h2>
            <p>{t.resultsHelp}</p>
          </div>
          <button type="button" className="secondary" onClick={exportResultsTable}>
            {t.exportTable}
          </button>
        </div>
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
                      {valid
                        ? textureLabel(classifySoilTexture(sample), locale)
                        : validationMessageFor(sample, locale)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

type TriangleProps = {
  classBoundaryPath: string;
  classFills: ReturnType<typeof buildClassFills>;
  showExternalLegend: boolean;
  samples: Sample[];
  selectedStyleId: TriangleStyle["id"];
  styleOptions: typeof TRIANGLE_STYLES;
  triangleStyle: TriangleStyle;
  locale: Locale;
  pointSize: number;
  onToggleExternalLegend: () => void;
  onStyleChange: (styleId: TriangleStyle["id"]) => void;
  onPointSizeChange: (size: number) => void;
};

function axisTicks(axis: "sand" | "silt" | "clay") {
  const ticks = [];
  for (let value = 10; value <= 90; value += 10) {
    const fractions =
      axis === "sand"
        ? { sand: value, silt: 100 - value, clay: 0 }
        : axis === "silt"
          ? { sand: 0, silt: value, clay: 100 - value }
          : { sand: 100 - value, silt: 0, clay: value };
    ticks.push({ value, point: ternaryToPoint(fractions) });
  }
  return ticks;
}

function gridLines() {
  const lines = [];
  for (let value = 10; value <= 90; value += 10) {
    lines.push([
      ternaryToPoint({ sand: value, silt: 100 - value, clay: 0 }),
      ternaryToPoint({ sand: value, silt: 0, clay: 100 - value }),
    ]);
    lines.push([
      ternaryToPoint({ sand: 100 - value, silt: value, clay: 0 }),
      ternaryToPoint({ sand: 0, silt: value, clay: 100 - value }),
    ]);
    lines.push([
      ternaryToPoint({ sand: 100 - value, silt: 0, clay: value }),
      ternaryToPoint({ sand: 0, silt: 100 - value, clay: value }),
    ]);
  }
  return lines;
}

function TextureTriangle({
  classBoundaryPath,
  classFills,
  showExternalLegend,
  samples,
  selectedStyleId,
  styleOptions,
  triangleStyle,
  locale,
  pointSize,
  onToggleExternalLegend,
  onStyleChange,
  onPointSizeChange,
}: TriangleProps) {
  const t = UI_TEXT[locale];
  const visual = STYLE_VISUALS[selectedStyleId];
  const svgRef = useRef<SVGSVGElement | null>(null);
  const legendRows = Math.ceil(samples.length / 2);
  const legendStartY = 676;
  const legendHeight = showExternalLegend && samples.length ? 60 + legendRows * 30 : 0;
  const svgHeight = TRIANGLE.height + legendHeight;
  const trianglePoints = polygonPoints([
    TRIANGLE.vertices.sand,
    TRIANGLE.vertices.silt,
    TRIANGLE.vertices.clay,
  ]);

  function exportSvg() {
    if (!svgRef.current) return;
    const blob = new Blob([serializeTriangleSvg(svgRef.current)], {
      type: "image/svg+xml;charset=utf-8",
    });
    downloadBlob(blob, "usda-soil-texture-triangle.svg");
  }

  function exportPng() {
    if (!svgRef.current) return;
    const { width, height } = svgExportSize(svgRef.current);
    const svgText = serializeTriangleSvg(svgRef.current);
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const scale = Math.max(2, Math.min(4, 2400 / width));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        return;
      }

      context.fillStyle = triangleStyle.background;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (blob) downloadBlob(blob, "usda-soil-texture-triangle.png");
      }, "image/png");
    };

    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }

  return (
    <figure className="triangle-figure">
      <div className="triangle-toolbar" aria-label={t.textureTriangle}>
        <div className="toolbar-group controls-group">
          <label className="style-picker">
            <span>{t.triangleStyle}</span>
            <select
              value={selectedStyleId}
              onChange={(event) => onStyleChange(event.target.value as TriangleStyle["id"])}
            >
              {styleOptions.map((style) => (
                <option key={style.id} value={style.id}>
                  {STYLE_NAMES[style.id][locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="point-size-control">
            <span>
              {t.pointSize}
              <strong>{pointSize}px</strong>
            </span>
            <input
              type="range"
              min="4"
              max="14"
              step="1"
              value={pointSize}
              style={{ "--slider-progress": `${((pointSize - 4) / 10) * 100}%` } as React.CSSProperties}
              onChange={(event) => onPointSizeChange(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="toolbar-group action-group">
          <button
            type="button"
            className={showExternalLegend ? "toggle-button active" : "toggle-button"}
            aria-pressed={showExternalLegend}
            onClick={onToggleExternalLegend}
          >
            {t.outsideLegend}
          </button>
          <button type="button" className="secondary" onClick={exportPng}>
            {t.exportPng}
          </button>
          <button type="button" className="secondary" onClick={exportSvg}>
            {t.exportSvg}
          </button>
        </div>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${TRIANGLE.width} ${svgHeight}`}
        role="img"
        aria-label={t.textureTriangle}
      >
        <style>{EXPORT_SVG_STYLES}</style>
        <defs>
          <clipPath id="triangleClip">
            <polygon points={trianglePoints} />
          </clipPath>
        </defs>
        <rect width={TRIANGLE.width} height={svgHeight} fill={triangleStyle.background} />
        <g clipPath="url(#triangleClip)">
          {classFills.map((region, index) => (
            <path
              key={region.textureClass}
              d={region.path}
              fill={triangleStyle.colors[index]}
              opacity={visual.fillOpacity}
            />
          ))}
          {gridLines()
            .filter((_, index) => visual.gridEvery === 1 || Math.floor(index / 3) % 2 === 1)
            .map(([start, end], index) => (
              <line
                key={index}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={triangleStyle.grid}
                strokeOpacity={visual.gridOpacity}
                strokeWidth={visual.gridWidth}
              />
            ))}
          <path
            d={classBoundaryPath}
            fill="none"
            stroke={triangleStyle.boundary}
            strokeOpacity={visual.boundaryOpacity}
            strokeWidth={visual.boundaryWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <polygon points={trianglePoints} fill="none" stroke={triangleStyle.border} strokeWidth={visual.borderWidth} />

        {classFills.map((region) => (
          <text
            key={region.textureClass}
            x={region.labelPoint.x}
            y={region.labelPoint.y}
            className="class-label"
            style={{
              fill: triangleStyle.text,
              fontSize: visual.labelSize,
              fontWeight: visual.labelWeight,
              strokeWidth: visual.labelStrokeWidth,
            }}
            textAnchor="middle"
          >
            {styleText(textureLabel(region.textureClass, locale), visual)}
          </text>
        ))}

        {axisTicks("sand").map(({ value, point }) => (
          <text
            key={`sand-${value}`}
            x={point.x}
            y={point.y + 22}
            className="tick-label"
            style={{ fill: triangleStyle.tick, fontSize: visual.tickSize }}
            textAnchor="middle"
          >
            {value}
          </text>
        ))}
        {axisTicks("silt").map(({ value, point }) => (
          <text
            key={`silt-${value}`}
            x={point.x + 24}
            y={point.y + 4}
            className="tick-label"
            style={{ fill: triangleStyle.tick, fontSize: visual.tickSize }}
            textAnchor="middle"
          >
            {value}
          </text>
        ))}
        {axisTicks("clay").map(({ value, point }) => (
          <text
            key={`clay-${value}`}
            x={point.x - 24}
            y={point.y + 4}
            className="tick-label"
            style={{ fill: triangleStyle.tick, fontSize: visual.tickSize }}
            textAnchor="middle"
          >
            {value}
          </text>
        ))}

        <text
          x="108"
          y="630"
          className="axis-label"
          style={{ fill: triangleStyle.text, fontSize: visual.axisSize }}
        >
          {t.axisSand}
        </text>
        <text
          x="646"
          y="630"
          className="axis-label"
          style={{ fill: triangleStyle.text, fontSize: visual.axisSize }}
        >
          {t.axisSilt}
        </text>
        <text
          x="380"
          y="30"
          className="axis-label"
          style={{ fill: triangleStyle.text, fontSize: visual.axisSize }}
          textAnchor="middle"
        >
          {t.axisClay}
        </text>

        {samples.map((sample, index) => {
          const point = ternaryToPoint(sample);
          const color = SAMPLE_COLORS[index % SAMPLE_COLORS.length];
          return (
            <g key={sample.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r={pointSize}
                fill={color}
                stroke="#ffffff"
                strokeWidth={visual.pointStrokeWidth}
              />
              {!showExternalLegend ? (
                <text
                  x={point.x + 11}
                  y={point.y - 9 - (index % 2) * 12}
                  className="sample-label"
                >
                  {sample.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {showExternalLegend && samples.length ? (
          <g aria-label={t.sampleLegend}>
            <line
              x1="72"
              y1={legendStartY}
              x2="688"
              y2={legendStartY}
              stroke={triangleStyle.boundary}
              strokeOpacity="0.25"
              strokeWidth="1"
            />
            {samples.map((sample, index) => {
              const column = index % 2;
              const row = Math.floor(index / 2);
              const x = column === 0 ? 98 : 410;
              const y = legendStartY + 28 + row * 30;
              const color = SAMPLE_COLORS[index % SAMPLE_COLORS.length];
              return (
                <g key={`legend-${sample.id}`}>
                  <circle
                    cx={x}
                    cy={y - 5}
                    r={pointSize}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={visual.pointStrokeWidth}
                  />
                  <text x={x + 16} y={y} className="legend-label">
                    {sample.label}
                  </text>
                </g>
              );
            })}
          </g>
        ) : null}
      </svg>
      <figcaption>
        {t.figcaption}
      </figcaption>
    </figure>
  );
}

export default App;

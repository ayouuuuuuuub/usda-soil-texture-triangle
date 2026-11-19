// The USDA texture triangle: the drawing that is exported (PNG, SVG), and over it a second, separate
// drawing that makes it an instrument. The overlay reads the composition under the pointer the way a
// ternary diagram is read by hand (one line to each axis), names its class, drops a sample on click
// and lets a plotted point be dragged. Nothing of the overlay is ever part of an export.
import { useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import {
  TRIANGLE,
  buildAnalyticalBoundaryPath,
  buildClassFills,
  classifySoilTexture,
  polygonPoints,
  ternaryToPoint,
  type SoilFractions,
} from "../soilTexture";
import { EXTRA, UI_TEXT, type Locale } from "../site/i18n";
import {
  EXPORT_SVG_STYLES,
  SAMPLE_COLORS,
  STYLE_INKS,
  STYLE_NAMES,
  STYLE_VISUALS,
  TEXTURE_LABELS,
  TRIANGLE_STYLES,
  type StyleVisuals,
  type TriangleStyle,
} from "./triangleStyles";

export type PlotSample = SoilFractions & { id: string; label: string };

type TriangleProps = {
  status: string;
  showExternalLegend: boolean;
  samples: PlotSample[];
  selectedStyleId: TriangleStyle["id"];
  locale: Locale;
  pointSize: number;
  activeId: string | null;
  onActive: (id: string | null) => void;
  onPlace: (fractions: SoilFractions) => void;
  onMove: (id: string, fractions: SoilFractions) => void;
  onToggleExternalLegend: () => void;
  onStyleChange: (styleId: TriangleStyle["id"]) => void;
  onPointSizeChange: (size: number) => void;
};

type Reading = SoilFractions & { inside: boolean; sampleId?: string };

const V = TRIANGLE.vertices;

function styleText(value: string, visual: StyleVisuals) {
  return visual.labelTransform === "uppercase" ? value.toUpperCase() : value;
}

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

// The inverse of ternaryToPoint: a point of the drawing back to percentages (not rounded, not clamped).
function pointToFractions(x: number, y: number): SoilFractions {
  const clay = ((V.sand.y - y) / (V.sand.y - V.clay.y)) * 100;
  const sand = (V.silt.x * (100 - clay) + V.clay.x * clay - 100 * x) / (V.silt.x - V.sand.x);
  return { sand, silt: 100 - sand - clay, clay };
}

// Whole percentages that add up to 100, kept inside the triangle.
function snap({ sand, clay }: SoilFractions): SoilFractions {
  const c = Math.min(100, Math.max(0, Math.round(clay)));
  const s = Math.min(100 - c, Math.max(0, Math.round(sand)));
  return { sand: s, silt: 100 - s - c, clay: c };
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
  clone.removeAttribute("class");

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

// A style shown as what it is: three of its class colours on its own ground.
function StyleSwatch({ style }: { style: TriangleStyle }) {
  const outline = style.id === "outline";
  return (
    <svg viewBox="0 0 26 24" aria-hidden="true" focusable="false">
      <rect width="26" height="24" rx="5" fill={style.background} />
      <path d="M3.5 20.5h19l-3.2-5.6H6.7z" fill={outline ? "none" : style.colors[1]} />
      <path d="M7.5 13.5h11l-2.8-4.9h-5.4z" fill={outline ? "none" : style.colors[4]} />
      <path d="M11.1 7.2h3.8L13 3.9z" fill={outline ? "none" : style.colors[11]} />
      <path d="M13 3.5L22.8 20.6H3.2z" fill="none" stroke={style.border} strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

export default function TextureTriangle({
  status,
  showExternalLegend,
  samples,
  selectedStyleId,
  locale,
  pointSize,
  activeId,
  onActive,
  onPlace,
  onMove,
  onToggleExternalLegend,
  onStyleChange,
  onPointSizeChange,
}: TriangleProps) {
  const t = UI_TEXT[locale];
  const x = EXTRA[locale];
  const triangleStyle = TRIANGLE_STYLES.find((style) => style.id === selectedStyleId) ?? TRIANGLE_STYLES[0];
  const visual = STYLE_VISUALS[selectedStyleId];
  const ink = STYLE_INKS[triangleStyle.id];
  const classFills = useMemo(() => buildClassFills(), []);
  const classBoundaryPath = useMemo(() => buildAnalyticalBoundaryPath(), []);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const overlayRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<{ id: string | null; x: number; y: number; moved: boolean } | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [pinned, setPinned] = useState(false);
  const [dragging, setDragging] = useState(false);

  const legendRows = Math.ceil(samples.length / 2);
  const legendStartY = 676;
  const legendHeight = showExternalLegend && samples.length ? 60 + legendRows * 30 : 0;
  const svgHeight = TRIANGLE.height + legendHeight;
  const trianglePoints = polygonPoints([V.sand, V.silt, V.clay]);

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

  /* ----------------------------------------------------------------------------- the instrument */

  function locate(event: ReactPointerEvent) {
    const node = overlayRef.current;
    const matrix = node?.getScreenCTM();
    if (!node || !matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const raw = pointToFractions(point.x, point.y);
    const inside = raw.sand >= -1.5 && raw.silt >= -1.5 && raw.clay >= -1.5;
    const reach = Math.max(pointSize + 7, 14);
    let near: PlotSample | undefined;
    let best = reach * reach;
    for (const sample of samples) {
      const p = ternaryToPoint(sample);
      const d = (p.x - point.x) ** 2 + (p.y - point.y) ** 2;
      if (d <= best) {
        best = d;
        near = sample;
      }
    }
    return { raw, inside, near };
  }

  function onPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const hit = locate(event);
    if (!hit) return;
    const held = drag.current;
    if (held?.id) {
      if (Math.hypot(event.clientX - held.x, event.clientY - held.y) > 3) held.moved = true;
      if (held.moved) {
        const next = snap(hit.raw);
        onMove(held.id, next);
        setReading({ ...next, inside: true, sampleId: held.id });
      }
      return;
    }
    if (event.pointerType === "touch") return;
    if (hit.near) {
      setReading({ sand: hit.near.sand, silt: hit.near.silt, clay: hit.near.clay, inside: true, sampleId: hit.near.id });
      onActive(hit.near.id);
    } else {
      setReading({ ...snap(hit.raw), inside: hit.inside });
      if (activeId) onActive(null);
    }
    setPinned(false);
  }

  function onPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return;
    const hit = locate(event);
    if (!hit) return;
    drag.current = { id: hit.near?.id ?? null, x: event.clientX, y: event.clientY, moved: false };
    if (hit.near && event.pointerType !== "touch") {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
  }

  function onPointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    const held = drag.current;
    drag.current = null;
    setDragging(false);
    const hit = locate(event);
    if (!held || !hit) return;
    if (held.moved || Math.hypot(event.clientX - held.x, event.clientY - held.y) > 6) return;
    if (event.pointerType === "touch") {
      // a tap reads the composition and keeps it; the reading bar offers to add it
      if (hit.near) {
        setReading({ sand: hit.near.sand, silt: hit.near.silt, clay: hit.near.clay, inside: true, sampleId: hit.near.id });
        onActive(hit.near.id);
        setPinned(false);
      } else if (hit.inside) {
        setReading({ ...snap(hit.raw), inside: true });
        setPinned(true);
      }
      return;
    }
    if (!held.id && hit.inside) onPlace(snap(hit.raw));
  }

  function onPointerLeave() {
    if (drag.current?.id || pinned) return;
    setReading(null);
    if (activeId) onActive(null);
  }

  const readClass = reading?.inside ? classifySoilTexture(reading) : null;
  const readPoint = reading?.inside ? ternaryToPoint(reading) : null;
  const readRegion = readClass ? classFills.find((region) => region.textureClass === readClass) : null;
  const readSample = reading?.sampleId ? samples.find((sample) => sample.id === reading.sampleId) : null;
  const activeSample = activeId ? samples.find((sample) => sample.id === activeId) : null;
  const guides = reading?.inside && readPoint
    ? ([
        ["clay", ternaryToPoint({ sand: 100 - reading.clay, silt: 0, clay: reading.clay }), -30, 4, reading.clay],
        ["silt", ternaryToPoint({ sand: 0, silt: reading.silt, clay: 100 - reading.silt }), 30, 4, reading.silt],
        ["sand", ternaryToPoint({ sand: reading.sand, silt: 100 - reading.sand, clay: 0 }), 0, 26, reading.sand],
      ] as const)
    : [];

  return (
    <figure className="plot">
      <div className="plot__read" data-live={reading?.inside ? "" : undefined}>
        {reading?.inside && readClass ? (
          <>
            <dl className="plot__vals">
              {(["sand", "silt", "clay"] as const).map((key) => (
                <div key={key} data-f={key}>
                  <dt>{t[key]}</dt>
                  <dd>{reading[key]}</dd>
                </div>
              ))}
            </dl>
            <p className="plot__class">
              <span className="mono">{readSample ? readSample.label || t.untitledSample : x.classLabel}</span>
              <strong>{TEXTURE_LABELS[readClass][locale]}</strong>
            </p>
            {pinned ? (
              <button
                type="button"
                className="btn btn--small btn--clay"
                onClick={() => {
                  onPlace({ sand: reading.sand, silt: reading.silt, clay: reading.clay });
                  setPinned(false);
                  setReading(null);
                }}
              >
                {x.addHere}
              </button>
            ) : null}
          </>
        ) : (
          <p className="plot__hint">
            <span className="plot__hint-fine">{x.plotIdle}</span>
            <span className="plot__hint-touch">{x.plotIdleTouch}</span>
            <span className="plot__hint-act mono">{x.plotAct}</span>
          </p>
        )}
      </div>

      <div className="plot__stage" style={{ background: triangleStyle.background }}>
        <svg
          ref={svgRef}
          className="plot__svg"
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
                stroke: ink?.halo,
              }}
              textAnchor="middle"
            >
              {styleText(TEXTURE_LABELS[region.textureClass][locale], visual)}
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

          <text x="108" y="630" className="axis-label" style={{ fill: triangleStyle.text, fontSize: visual.axisSize }}>
            {t.axisSand}
          </text>
          <text x="646" y="630" className="axis-label" style={{ fill: triangleStyle.text, fontSize: visual.axisSize }}>
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
                    style={ink ? { fill: ink.sampleText, stroke: ink.halo } : undefined}
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
                const lx = column === 0 ? 98 : 410;
                const ly = legendStartY + 28 + row * 30;
                const color = SAMPLE_COLORS[index % SAMPLE_COLORS.length];
                return (
                  <g key={`legend-${sample.id}`}>
                    <circle
                      cx={lx}
                      cy={ly - 5}
                      r={pointSize}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={visual.pointStrokeWidth}
                    />
                    <text x={lx + 16} y={ly} className="legend-label" style={ink ? { fill: ink.legendText } : undefined}>
                      {sample.label}
                    </text>
                  </g>
                );
              })}
            </g>
          ) : null}
        </svg>

        <svg
          ref={overlayRef}
          className="plot__overlay"
          viewBox={`0 0 ${TRIANGLE.width} ${svgHeight}`}
          aria-hidden="true"
          data-drag={dragging ? "" : undefined}
          data-grab={readSample ? "" : undefined}
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            drag.current = null;
            setDragging(false);
          }}
          onPointerLeave={onPointerLeave}
        >
          {readRegion ? <path className="plot__region" d={readRegion.path} /> : null}
          {readPoint
            ? guides.map(([key, edge, dx, dy, value]) => (
                <g key={key} className="plot__guide" data-f={key}>
                  <line className="plot__guide-halo" x1={readPoint.x} y1={readPoint.y} x2={edge.x} y2={edge.y} />
                  <line x1={readPoint.x} y1={readPoint.y} x2={edge.x} y2={edge.y} />
                  <g transform={`translate(${edge.x + dx} ${edge.y + dy})`}>
                    <rect x="-17" y="-13" width="34" height="20" rx="10" />
                    <text textAnchor="middle" y="1.5">
                      {value}
                    </text>
                  </g>
                </g>
              ))
            : null}
          {activeSample ? (
            <circle
              className="plot__ring"
              cx={ternaryToPoint(activeSample).x}
              cy={ternaryToPoint(activeSample).y}
              r={pointSize + 7}
            />
          ) : null}
          {readPoint && !readSample ? <circle className="plot__reticle" cx={readPoint.x} cy={readPoint.y} r="5" /> : null}
        </svg>
      </div>

      <div className="plot__tools" role="group" aria-label={t.textureTriangle}>
        <fieldset className="plot__styles">
          <legend>
            <span className="mono">{t.triangleStyle}</span>
            <strong>{STYLE_NAMES[selectedStyleId][locale]}</strong>
          </legend>
          <div className="plot__swatches">
            {TRIANGLE_STYLES.map((style) => (
              <label key={style.id} title={STYLE_NAMES[style.id][locale]}>
                <input
                  type="radio"
                  name="triangle-style"
                  className="sr-only"
                  value={style.id}
                  checked={selectedStyleId === style.id}
                  onChange={() => onStyleChange(style.id)}
                />
                <StyleSwatch style={style} />
                <span className="sr-only">{STYLE_NAMES[style.id][locale]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="plot__row">
          <label className="plot__size">
            <span className="mono">
              {t.pointSize} <strong>{pointSize}px</strong>
            </span>
            <input
              type="range"
              min="4"
              max="14"
              step="1"
              value={pointSize}
              style={{ "--slider-progress": `${((pointSize - 4) / 10) * 100}%` } as CSSProperties}
              onChange={(event) => onPointSizeChange(Number(event.target.value))}
            />
          </label>
          <button type="button" className="switch" aria-pressed={showExternalLegend} onClick={onToggleExternalLegend}>
            <i aria-hidden="true" />
            {t.outsideLegend}
          </button>
          <div className="plot__exports">
            <button type="button" className="btn btn--small btn--ghost" onClick={exportPng}>
              {t.exportPng}
            </button>
            <button type="button" className="btn btn--small btn--ghost" onClick={exportSvg}>
              {t.exportSvg}
            </button>
          </div>
        </div>
      </div>
      <figcaption>
        <span>{status}</span> {t.figcaption}
      </figcaption>
    </figure>
  );
}

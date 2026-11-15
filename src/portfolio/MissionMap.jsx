// The mission map of the projects section: Morocco's twelve regions drawn as a survey sheet (graticule,
// north arrow, live scale bar), with a station on every region that holds a study. The map and the project
// list answer each other: a region lists its studies, a study lights its regions and the sheet reframes on
// them. Regions only, stations at the middle of each region: no site is located.
//
// Sizes that must not grow with the zoom (line weights, stations, labels) are drawn in pixels and scaled by
// --px, the number of sheet units in one pixel, which this component keeps up to date.
import React, { useEffect, useMemo, useRef } from 'react';
import { MOROCCO } from './moroccoMap.js';

const { width: W, height: H, proj, regions: REGIONS } = MOROCCO;
const FULL = [0, 0, W, H];
const KM200 = (200 / 111.32) * proj.ky; // 200 km in sheet units
const MERIDIANS = [-15, -10, -5];
const PARALLELS = [25, 30, 35];
const xOf = lon => (lon - proj.lon0) * proj.kx;
const yOf = lat => (proj.lat0 - lat) * proj.ky;
const REGION = Object.fromEntries(REGIONS.map(r => [r.id, r]));

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The part of the sheet to show for a set of regions: their common box with room around it, in the sheet's
// own proportions, never closer than twice the full view.
function frame(ids) {
  if (!ids || !ids.length) return FULL;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const id of ids) {
    const [x, y, w, h] = REGION[id].box;
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + w); y1 = Math.max(y1, y + h);
  }
  const pad = 0.28 * Math.max(x1 - x0, y1 - y0) + 24;
  let w = Math.max(x1 - x0 + 2 * pad, W * 0.5);
  let h = (w * H) / W;
  if (h < y1 - y0 + 2 * pad) { h = y1 - y0 + 2 * pad; w = (h * W) / H; }
  if (w >= W * 0.94) return FULL;
  const x = Math.min(Math.max((x0 + x1) / 2 - w / 2, 0), W - w);
  const y = Math.min(Math.max((y0 + y1) / 2 - h / 2, 0), H - h);
  return [x, y, w, h];
}

const plural = n => `${n} ${n === 1 ? 'study' : 'studies'}`;

export default function MissionMap({ projects, open, hover, region, onRegion, onProject, onReset }) {
  const plate = useRef(null);
  const svg = useRef(null);
  const tag = useRef(null);
  const view = useRef(FULL);
  const size = useRef([0, 0]);
  // sheet units in one pixel for a view (the drawing is fitted inside its box, so the tighter side rules)
  const unitsPerPx = v => (size.current[0] ? Math.max(v[2] / size.current[0], v[3] / size.current[1]) : 0);

  const studies = useMemo(() => Object.fromEntries(REGIONS.map(r => [r.id, projects.filter(p => p.regions.includes(r.id))])), [projects]);
  const stations = useMemo(() => REGIONS.filter(r => studies[r.id].length > 0), [studies]);
  const openProject = projects.find(p => p.id === open) || null;
  const lead = projects.find(p => p.id === hover) || openProject;
  const national = Boolean(lead && lead.national);
  const lit = lead ? (national ? stations.map(r => r.id) : lead.regions) : region ? [region] : [];
  const busy = lit.length > 0 && !national;
  const focus = openProject ? (openProject.national ? [] : openProject.regions) : region ? [region] : [];
  const focusKey = focus.join(',');

  // the survey line that joins the stations of a study spread over several regions, north to south
  const traverse = !national && lit.length > 1
    ? 'M' + lit.map(id => REGION[id].at).sort((a, b) => a[1] - b[1]).map(([x, y]) => `${x} ${y}`).join('L')
    : null;

  // keep --px (sheet units per pixel) right, at rest, on resize and through every frame of a reframing
  useEffect(() => {
    const node = svg.current;
    if (!node) return undefined;
    const measure = () => {
      const box = node.getBoundingClientRect();
      size.current = [box.width, box.height];
      if (box.width && plate.current) plate.current.style.setProperty('--px', unitsPerPx(view.current).toFixed(4));
    };
    measure();
    if (!('ResizeObserver' in window)) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  // reframe on the regions in focus; starts from wherever the sheet is, so it can be interrupted
  useEffect(() => {
    const node = svg.current;
    if (!node) return undefined;
    const to = frame(focusKey ? focusKey.split(',') : []);
    const from = view.current;
    const set = v => {
      view.current = v;
      node.setAttribute('viewBox', v.map(n => n.toFixed(1)).join(' '));
      if (size.current[0] && plate.current) plate.current.style.setProperty('--px', unitsPerPx(v).toFixed(4));
    };
    if (from.every((n, i) => Math.abs(n - to[i]) < 0.5)) return undefined;
    if (prefersReducedMotion()) { set(to); return undefined; }
    let raf = 0;
    let start = 0;
    const tick = now => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / 760);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      set(from.map((n, i) => n + (to[i] - n) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [focusKey]);

  // latitude and longitude under the pointer (mouse only), like the elevation tag of the contour bands
  const onMove = event => {
    const node = svg.current;
    const label = tag.current;
    if (event.pointerType !== 'mouse' || !node || !label) return;
    const matrix = node.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const lat = proj.lat0 - point.y / proj.ky;
    const lon = proj.lon0 + point.x / proj.kx;
    const holder = event.target.closest ? event.target.closest('[data-name]') : null;
    const name = holder ? holder.getAttribute('data-name') : '';
    label.textContent = `${name ? `${name} · ` : ''}${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}°${lon < 0 ? 'W' : 'E'}`;
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.min(event.clientX - box.left + 14, box.width - label.offsetWidth - 8);
    const y = Math.min(event.clientY - box.top + 18, box.height - label.offsetHeight - 8);
    label.style.transform = `translate3d(${Math.max(8, x).toFixed(0)}px, ${Math.max(8, y).toFixed(0)}px, 0)`;
    label.classList.add('is-on');
  };
  const onLeave = () => { if (tag.current) tag.current.classList.remove('is-on'); };

  const press = id => event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onRegion(id); }
  };

  const chosen = region ? REGION[region] : null;
  const nationals = projects.filter(p => p.national);
  const number = id => String(projects.findIndex(p => p.id === id) + 1).padStart(2, '0');

  return (
    <div className="pf-map" ref={plate} data-rv="map" data-busy={busy ? '' : undefined} data-national={national ? '' : undefined} style={{ '--px': 2, '--km': KM200.toFixed(1) }}>
      <div className="pf-map__sheet" onPointerMove={onMove} onPointerLeave={onLeave}>
        <svg
          ref={svg}
          className="pf-map__svg"
          viewBox={FULL.join(' ')}
          style={{ aspectRatio: `${W} / ${H}` }}
          role="group"
          aria-label="Map of Morocco. The regions that hold studies can be selected."
        >
          <defs>
            <pattern id="pf-hatch" className="pf-map__hatch" width="22" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-16)">
              <rect width="22" height="9" />
              <path d="M0 4.5Q5.5 1.2 11 4.5T22 4.5" />
            </pattern>
          </defs>

          <g className="pf-map__grat" aria-hidden="true">
            {MERIDIANS.map(lon => <line key={lon} x1={xOf(lon)} y1="0" x2={xOf(lon)} y2={H} />)}
            {PARALLELS.map(lat => <line key={lat} x1="0" y1={yOf(lat)} x2={W} y2={yOf(lat)} />)}
            {MERIDIANS.map(lon => <g key={lon} transform={`translate(${xOf(lon) + 5} ${H - 8})`}><text className="pf-map__fix">{-lon}°W</text></g>)}
            {PARALLELS.map(lat => <g key={lat} transform={`translate(${W - 6} ${yOf(lat) - 5})`}><text className="pf-map__fix" textAnchor="end">{lat}°N</text></g>)}
          </g>

          <path className="pf-map__shore" d={MOROCCO.outline} aria-hidden="true" />

          <g className="pf-map__land">
            {/* quiet regions first, so the outlines of the regions with studies stay on top */}
            {REGIONS.map((r, i) => [r, i]).sort((a, b) => Math.sign(studies[a[0].id].length) - Math.sign(studies[b[0].id].length)).map(([r, i]) => {
              const n = studies[r.id].length;
              const on = lit.includes(r.id);
              if (!n) return <path key={r.id} className="pf-map__region" d={r.d} data-name={r.name} style={{ '--i': i }} aria-hidden="true" />;
              return (
                <React.Fragment key={r.id}>
                  <path
                    className="pf-map__region"
                    d={r.d}
                    fill="url(#pf-hatch)"
                    data-on=""
                    data-name={r.name}
                    data-lit={on ? '' : undefined}
                    style={{ '--i': i }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${r.name}, ${plural(n)}`}
                    aria-pressed={region === r.id}
                    onClick={() => onRegion(r.id)}
                    onKeyDown={press(r.id)}
                  />
                  <path className="pf-map__glow" d={r.d} data-lit={on ? '' : undefined} data-sel={region === r.id ? '' : undefined} aria-hidden="true" />
                </React.Fragment>
              );
            })}
          </g>

          <path className="pf-map__coast" d={MOROCCO.outline} style={{ '--len': MOROCCO.outlineLen + 8 }} aria-hidden="true" />
          {traverse ? <path key={lit.join(',')} className="pf-map__traverse" d={traverse} pathLength="1" aria-hidden="true" /> : null}

          <g className="pf-map__stations" aria-hidden="true">
            {stations.map((r, i) => (
              <g
                key={r.id}
                className="pf-map__station"
                transform={`translate(${r.at[0]} ${r.at[1]})`}
                data-name={r.name}
                data-lit={lit.includes(r.id) ? '' : undefined}
                data-sel={region === r.id ? '' : undefined}
                style={{ '--i': i }}
                onClick={() => onRegion(r.id)}
              >
                <g className="pf-map__fix">
                  <circle className="pf-map__hit" r="22" />
                  <circle className="pf-map__ping" r="8" />
                  <path className="pf-map__peg" d="M0 -8L7 4.5H-7Z" />
                  <text className="pf-map__n" x="11" y="4">{studies[r.id].length}</text>
                </g>
              </g>
            ))}
          </g>
        </svg>

        <p className="pf-map__title pf-map__furn" aria-hidden="true">Study areas<span>Morocco · 12 regions</span></p>
        <span className="pf-map__north pf-map__furn" aria-hidden="true">
          <svg viewBox="0 0 16 30"><path d="M8 29V4M8 2L3 11M8 2L13 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>N
        </span>
        <span className="pf-map__scale pf-map__furn" aria-hidden="true"><i />200 km</span>
        <span className="pf-topo__tag pf-map__tag" ref={tag} aria-hidden="true" />
        {frame(focus) !== FULL ? <button type="button" className="pf-map__reset" onClick={onReset}>Whole map</button> : null}
      </div>

      <div className="pf-map__card" aria-live="polite">
        {chosen ? (
          <div className="pf-map__cardin" key={`r-${chosen.id}`}>
            <p className="pf-map__eyebrow">{plural(studies[chosen.id].length)} in</p>
            <h3 className="pf-map__place">{chosen.name}</h3>
            <ul className="pf-map__list">
              {studies[chosen.id].map(p => (
                <li key={p.id}>
                  <button type="button" aria-current={open === p.id ? 'true' : undefined} onClick={() => onProject(p.id)}>
                    <span>{number(p.id)}</span>{p.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : openProject ? (
          <div className="pf-map__cardin" key={`p-${openProject.id}`}>
            <p className="pf-map__eyebrow">{openProject.national ? 'National study' : `Study ${number(openProject.id)} · ${openProject.regions.length} ${openProject.regions.length === 1 ? 'region' : 'regions'}`}</p>
            <h3 className="pf-map__place">{openProject.title}</h3>
            <p className="pf-map__where">{openProject.national ? 'Across the whole country' : openProject.regions.map(id => REGION[id].name).join(' · ')}</p>
          </div>
        ) : (
          <div className="pf-map__cardin" key="rest">
            <p className="pf-map__eyebrow">{stations.length} regions · {plural(projects.length)}</p>
            <p className="pf-map__hint">Pick a region marked with a station to see its studies.</p>
            <ul className="pf-map__list">
              {nationals.map(p => (
                <li key={p.id}>
                  <button type="button" onClick={() => onProject(p.id)}><span>{number(p.id)}</span>Nationwide: {p.title}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

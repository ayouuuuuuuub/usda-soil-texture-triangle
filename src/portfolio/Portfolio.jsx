// Soil Logic portfolio page. The words live in ./data.js; this file is the page.
//
// One idea runs through it: the calculator on the homepage places a soil in a triangle by its share of
// sand, silt and clay, and this page places every study in the same kind of triangle by its share of
// soil science and agronomy, data science and GIS, and environment work. The hero is a drawing of a piece of land with the things an
// agronomist reads in it marked on it; the studies can be read two ways (by field, on the mixture
// diagram, or by region, on a map of Morocco); the flagship study is told as a soil log, phase by phase.
//
// The page is rendered to HTML at build time (scripts/prerender.mjs) so it must render without a
// browser: everything that touches window or document lives in an effect.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import MissionMap from './MissionMap.jsx';
import { MOROCCO } from './moroccoMap.js';
import { BRAKNA_PHASES, BRIEF, CERTS, DECK, EMAIL, FACTS, FIELDS, LANGUAGES, MAIL, METHOD, MIX_AXES, NOTES, PHOTO, PROJECTS, TOOL_GROUPS, TRAINING } from './data.js';
import { meta } from './meta.js';
import './portfolio.css';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = n => String(n).padStart(2, '0');

function usePortfolioMetadata() {
  useIsoLayoutEffect(() => {
    const previousTitle = document.title;
    const undo = [];
    document.title = meta.title;
    const set = (selector, tag, key, value) => {
      let node = document.head.querySelector(selector);
      const created = !node;
      if (!node) { node = document.createElement(tag); document.head.appendChild(node); }
      const old = node.getAttribute(key);
      node.setAttribute(key, value);
      undo.push(() => { if (created) node.remove(); else if (old === null) node.removeAttribute(key); else node.setAttribute(key, old); });
      return node;
    };
    for (const [name, value] of [['description', meta.description], ['twitter:card', 'summary_large_image'], ['twitter:title', meta.title], ['twitter:description', meta.description], ['twitter:image', meta.image], ['theme-color', meta.themeColor]]) {
      const node = set('meta[name="' + name + '"]', 'meta', 'content', value); node.setAttribute('name', name);
    }
    for (const [name, value] of [['og:type', 'website'], ['og:title', meta.title], ['og:description', meta.description], ['og:url', meta.canonical], ['og:image', meta.image]]) {
      const node = set('meta[property="' + name + '"]', 'meta', 'content', value); node.setAttribute('property', name);
    }
    const canonical = set('link[rel="canonical"]', 'link', 'href', meta.canonical); canonical.setAttribute('rel', 'canonical');
    return () => { document.title = previousTitle; undo.reverse().forEach(fn => fn()); };
  }, []);
}

// Scroll reveals. Marks the page as animated (so nothing is hidden without JavaScript or under reduced
// motion), then tags each [data-rv] block with data-in the first time it comes on screen; the CSS does
// the rest.
function useReveal(rootRef) {
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window) || prefersReducedMotion()) return undefined;
    root.setAttribute('data-motion', '');
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-in', '');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -12% 0px' });
    root.querySelectorAll('[data-rv]').forEach(node => io.observe(node));
    return () => { io.disconnect(); root.removeAttribute('data-motion'); };
  }, [rootRef]);
}

// The Soil Logic mark: three slanted soil strata (styles in src/styles/base.css).
function Mark() {
  return <span className="brand__mark" aria-hidden="true"><i /><i /><i /></span>;
}

function Arrow({ down = false }) {
  return (
    <svg className="arrow" data-down={down ? '' : undefined} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Img({ name, wide = 1200, alt, sizes = '(max-width: 760px) 100vw, 50vw', className, eager = false }) {
  return (
    <img
      className={className}
      src={`${PHOTO}${name}-640.webp`}
      srcSet={`${PHOTO}${name}-640.webp 640w, ${PHOTO}${name}-${wide}.webp ${wide}w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? undefined : 'lazy'}
      decoding="async"
    />
  );
}

// A heading whose words rise out of their own line, one after another. The full text stays on the
// heading as its accessible name; the split words are presentation only.
function Title({ as: Tag = 'h2', id, text, em, className }) {
  const words = text.split(' ');
  const emWords = em ? em.split(' ') : [];
  const word = (w, i) => (
    <React.Fragment key={i}><span className="pf-w"><span style={{ '--i': i }}>{w}</span></span>{' '}</React.Fragment>
  );
  return (
    <Tag id={id} className={className} aria-label={em ? `${text} ${em}` : text}>
      <span aria-hidden="true">
        {words.map(word)}
        {em ? <em>{emWords.map((w, i) => word(w, words.length + i))}</em> : null}
      </span>
    </Tag>
  );
}

// A figure that counts up to its value once ("7.5M+ MAD" counts the 7.5 and keeps the rest).
function Count({ value, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    const match = /^([\d.]+)(.*)$/.exec(value);
    if (!node || !match || prefersReducedMotion()) return undefined;
    const end = parseFloat(match[1]);
    const decimals = (match[1].split('.')[1] || '').length;
    const show = n => { node.textContent = n.toFixed(decimals) + match[2]; };
    let raf = 0;
    let start = 0;
    show(0);
    const tick = now => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / 1300);
      show(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(tick); }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); node.textContent = value; };
  }, [value, delay]);
  return <><span className="sr-only">{value}</span><span ref={ref} aria-hidden="true">{value}</span></>;
}

// A study's mix as one bar: soil science and agronomy, data science and GIS, environment.
function MixBar({ mix }) {
  return (
    <span className="pf-mix" aria-hidden="true" style={{ '--a': mix[0], '--b': mix[1], '--c': mix[2] }}>
      <i data-f="soil" /><i data-f="data" /><i data-f="land" />
    </span>
  );
}

/* --------------------------------------------------------------------------------------- sections */

function Header() {
  return (
    <header className="site-header pf-header">
      <div className="wrap site-header__in">
        <a className="brand" href="/"><Mark />Soil Logic</a>
        <nav className="site-nav" aria-label="Main">
          <a href="#work">Work</a>
          <a href="#brakna">Case study</a>
          <a href="#method">Method</a>
          <a href="#toolkit">Toolkit</a>
          <a href="#training">Training</a>
        </nav>
        <div className="site-actions">
          <a className="pf-header__tool" href="/">Texture calculator</a>
          <a className="btn btn--small" href={EMAIL}>Email Ayoub</a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pf-hero" id="top">
      <div className="wrap pf-hero__grid">
        <div className="pf-hero__copy">
          <p className="eyebrow pf-in" style={{ '--d': '0ms' }}>Ayoub · State Engineer in Agronomy</p>
          <Title as="h1" className="display" text="I read the land before the project" em="is drawn." />
          <p className="lead pf-in" style={{ '--d': '480ms' }}>
            Soil, water and environmental studies: land and irrigation suitability, GIS and remote sensing,
            climate vulnerability and environmental safeguards, for projects in Morocco and Mauritania.
          </p>
          <div className="pf-hero__actions pf-in" style={{ '--d': '580ms' }}>
            <a className="btn btn--clay" href={EMAIL}>Email Ayoub<Arrow /></a>
            <a className="btn btn--ghost" href={DECK} download="Ayoub-Professional-Pitch-Deck.pdf">Download the pitch deck<span className="sr-only"> (PDF)</span></a>
          </div>
        </div>

        <figure className="pf-plate" aria-hidden="true">
          <img
            src="/portfolio/assets/soil-water-640.webp"
            srcSet="/portfolio/assets/soil-water-640.webp 640w, /portfolio/assets/soil-water-1200.webp 1200w"
            sizes="(max-width: 900px) 100vw, 56vw"
            alt=""
            width="1200"
            height="1200"
            decoding="async"
            fetchPriority="high"
          />
          <ul className="pf-notes">
            {NOTES.map((note, i) => (
              <li key={note.label} data-side={note.x > 55 ? 'l' : 'r'} style={{ '--x': note.x, '--y': note.y, '--i': i }}>
                <i /><span>{note.label}</span>
              </li>
            ))}
          </ul>
        </figure>
      </div>

      <dl className="wrap pf-facts">
        {FACTS.map(([value, label], i) => (
          <div key={value} className="pf-in" style={{ '--d': `${760 + i * 90}ms` }}>
            <dt><Count value={value} delay={820 + i * 90} /></dt><dd>{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Fields() {
  return (
    <section className="pf-section pf-fields" aria-labelledby="fields-h">
      <div className="wrap">
        <div className="pf-head" data-rv="">
          <p className="eyebrow">Four fields</p>
          <h2 className="display" id="fields-h">Four fields, one question: <em>what can this land carry?</em></h2>
          <p className="lead">Each study moves from the pit to the map to a recommendation someone can build on.</p>
        </div>
        <div className="pf-fields__grid">
          {FIELDS.map(field => (
            <article key={field.key} className="pf-field" data-f={field.key} data-rv="">
              <div className="pf-field__top"><span className="mono">{field.no}</span><span className="pf-field__chip mono">{field.short}</span></div>
              <h3>{field.title}</h3>
              <ul>{field.lines.map(line => <li key={line}>{line}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* The mixture diagram: every study placed by its share of soil science and agronomy, data science and
   GIS, and environment work. It is read
   like the texture triangle on the homepage, one line to each side. */
const TRI = { soil: [70, 500], data: [570, 500], land: [320, 67] };
const at = ([s, d, l]) => [
  (s * TRI.soil[0] + d * TRI.data[0] + l * TRI.land[0]) / 100,
  (s * TRI.soil[1] + d * TRI.data[1] + l * TRI.land[1]) / 100,
];
const OUTLINE = `M${TRI.soil.join(' ')}L${TRI.data.join(' ')}L${TRI.land.join(' ')}Z`;
const GRID = [25, 50, 75].flatMap(v => [
  [at([v, 100 - v, 0]), at([v, 0, 100 - v])],
  [at([100 - v, v, 0]), at([0, v, 100 - v])],
  [at([100 - v, 0, v]), at([0, 100 - v, v])],
]);

function Mixture({ projects, open, hover, onHover, onProject }) {
  const lead = projects.find(p => p.id === hover) || projects.find(p => p.id === open) || null;
  const p = lead ? at(lead.mix) : null;
  const guides = lead ? [
    ['land', at([100 - lead.mix[2], 0, lead.mix[2]]), -26, 4, lead.mix[2]],
    ['data', at([0, lead.mix[1], 100 - lead.mix[1]]), 26, 4, lead.mix[1]],
    ['soil', at([lead.mix[0], 100 - lead.mix[0], 0]), 0, 24, lead.mix[0]],
  ] : [];
  return (
    <div className="pf-plot" data-busy={lead ? '' : undefined}>
      <svg className="pf-plot__svg" viewBox="0 0 640 580" role="group" aria-label="Mixture diagram. Each point is a study, placed by its share of soil science and agronomy, data science and GIS, and environment work.">
        <defs>
          {[['soil', 'var(--sand)'], ['data', 'var(--silt)'], ['land', 'var(--clay-bright)']].map(([key, colour]) => (
            <radialGradient key={key} id={`pf-g-${key}`} gradientUnits="userSpaceOnUse" cx={TRI[key][0]} cy={TRI[key][1]} r="470">
              <stop offset="0" stopColor={colour} stopOpacity="0.62" />
              <stop offset="1" stopColor={colour} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        <g aria-hidden="true">
          <path className="pf-plot__ground" d={OUTLINE} />
          {['soil', 'data', 'land'].map(key => <path key={key} d={OUTLINE} fill={`url(#pf-g-${key})`} />)}
          {GRID.map(([a, b], i) => <line key={i} className="pf-plot__grid" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)}
          <path className="pf-plot__edge" d={OUTLINE} />
          <text className="pf-plot__axis" data-f="land" x={TRI.land[0]} y={TRI.land[1] - 22} textAnchor="middle">{MIX_AXES[2].label}</text>
          <text className="pf-plot__axis" data-f="soil" x={TRI.soil[0] - 30} y={TRI.soil[1] + 40}>{MIX_AXES[0].label}</text>
          <text className="pf-plot__axis" data-f="data" x={TRI.data[0] + 30} y={TRI.data[1] + 40} textAnchor="end">{MIX_AXES[1].label}</text>
          {p ? guides.map(([key, edge, dx, dy, value]) => (
            <g key={key} className="pf-plot__guide" data-f={key}>
              <line x1={p[0]} y1={p[1]} x2={edge[0]} y2={edge[1]} />
              <g transform={`translate(${edge[0] + dx} ${edge[1] + dy})`}>
                <rect x="-17" y="-13" width="34" height="20" rx="10" />
                <text textAnchor="middle" y="1.5">{value}</text>
              </g>
            </g>
          )) : null}
        </g>
        {projects.map((project, i) => {
          const [x, y] = at(project.mix);
          const on = lead && lead.id === project.id;
          return (
            <g
              key={project.id}
              className="pf-plot__pt"
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
              style={{ '--i': i }}
              data-on={on ? '' : undefined}
              data-open={open === project.id ? '' : undefined}
              role="button"
              tabIndex={0}
              aria-label={`${project.title}. ${MIX_AXES.map((axis, a) => `${axis.label} ${project.mix[a]}%`).join(', ')}.`}
              aria-pressed={open === project.id}
              onClick={() => onProject(project.id)}
              onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onProject(project.id); } }}
              onPointerEnter={() => onHover(project.id)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(project.id)}
              onBlur={() => onHover(null)}
            >
              <circle className="pf-plot__hit" r="24" />
              <circle className="pf-plot__ring" r="17" />
              <circle className="pf-plot__dot" r="14" />
              <text textAnchor="middle" y="4">{pad(i + 1)}</text>
            </g>
          );
        })}
      </svg>
      <div className="pf-plot__card" aria-live="polite">
        {lead ? (
          <div className="pf-plot__cardin" key={lead.id}>
            <p className="pf-plot__eyebrow mono">Study {pad(projects.indexOf(lead) + 1)} · {lead.place}</p>
            <h3>{lead.title}</h3>
            <dl className="pf-plot__mix">
              {MIX_AXES.map((axis, i) => (
                <div key={axis.key} data-f={axis.key}><dt>{axis.short}</dt><dd>{lead.mix[i]}<small>%</small></dd></div>
              ))}
            </dl>
          </div>
        ) : (
          <div className="pf-plot__cardin" key="rest">
            <p className="pf-plot__eyebrow mono">{projects.length} studies · 3 axes</p>
            <p className="pf-plot__hint">Every study is a mixture. Each point is placed by how much of the work was soil science and agronomy, data science and GIS, and environment: pick one to open it.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// A study with no fitting photograph shows where it took place: Morocco's regions in the mission map's
// style, its own regions in sand, framed on them.
function RegionTile({ regions, label }) {
  const on = new Set(regions);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const r of MOROCCO.regions) if (on.has(r.id)) { const [x, y, w, h] = r.box; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + w); y1 = Math.max(y1, y + h); }
  const pad = 0.6 * Math.max(x1 - x0, y1 - y0) + 40;
  const view = [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad].map(n => n.toFixed(1)).join(' ');
  return (
    <svg className="pf-tile" viewBox={view} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <rect className="pf-tile__sea" x="-2000" y="-2000" width="5000" height="5000" />
      {MOROCCO.regions.map(r => <path key={r.id} className="pf-tile__region" data-on={on.has(r.id) ? '' : undefined} d={r.d} />)}
      <path className="pf-tile__coast" d={MOROCCO.outline} />
      {MOROCCO.regions.filter(r => on.has(r.id)).map(r => (
        <g key={r.id} transform={`translate(${r.at[0]} ${r.at[1]})`}><path className="pf-tile__peg" d="M0 -11L9.5 6H-9.5Z" /></g>
      ))}
    </svg>
  );
}

function Work() {
  const [lens, setLens] = useState('mix');
  const [open, setOpen] = useState(null);
  const [hover, setHover] = useState(null);
  const [region, setRegion] = useState(null);
  // a row's picture starts loading as soon as the row is touched, so it is there when the row opens
  const [warm, setWarm] = useState(() => new Set());
  const arm = id => setWarm(set => (set.has(id) ? set : new Set(set).add(id)));
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  // a study chosen on the diagram or the map: open its row and bring it into view once the others have closed
  const show = id => {
    setOpen(id);
    arm(id);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const row = document.getElementById(`project-${id}`);
      if (row) row.scrollIntoView({ block: window.matchMedia('(min-width: 1081px)').matches ? 'nearest' : 'start' });
    }, 420);
  };
  // a region chosen on the map: list its studies, or open the study straight away when there is only one
  const pickRegion = id => {
    if (region === id) { setRegion(null); return; }
    setRegion(id);
    const here = PROJECTS.filter(p => p.regions.includes(id));
    if (here.length === 1) show(here[0].id);
    else if (open && !here.some(p => p.id === open)) setOpen(null);
  };
  // a link to one study (/portfolio#project-nador) opens its row
  useEffect(() => {
    const open = () => {
      const match = /^#project-(.+)$/.exec(window.location.hash);
      if (match && PROJECTS.some(p => p.id === match[1])) show(match[1]);
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggle = p => {
    const closing = open === p.id;
    setOpen(closing ? null : p.id);
    if (!closing && region && !p.regions.includes(region)) setRegion(null);
  };
  const pickLens = next => { setLens(next); setRegion(null); };

  return (
    <section className="pf-section pf-work" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <div className="pf-head pf-head--row" data-rv="">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="display" id="work-h">Every study is <em>a mixture.</em></h2>
          </div>
          <p className="lead">Studies for public agencies, international cooperation and development programmes. Read them by field or by region, or open a row to see what was done.</p>
        </div>
        <div className="pf-atlas">
          <div className="pf-lensbox" data-rv="">
            <div className="pf-lens" role="group" aria-label="Read the studies">
              <button type="button" aria-pressed={lens === 'mix'} onClick={() => pickLens('mix')}>By field</button>
              <button type="button" aria-pressed={lens === 'map'} onClick={() => pickLens('map')}>By region</button>
            </div>
            {lens === 'mix'
              ? <Mixture projects={PROJECTS} open={open} hover={hover} onHover={setHover} onProject={show} />
              : <MissionMap projects={PROJECTS} open={open} hover={hover} region={region} onRegion={pickRegion} onProject={show} onReset={() => { setOpen(null); setRegion(null); }} />}
          </div>
          <ol className="pf-index" onMouseLeave={() => setHover(null)}>
            {PROJECTS.map((p, i) => {
              const isOpen = open === p.id;
              return (
                <li key={p.id} id={`project-${p.id}`} className="pf-row" data-open={isOpen ? '' : undefined} data-lit={hover === p.id ? '' : undefined} onMouseEnter={() => { setHover(p.id); arm(p.id); }} onTouchStart={() => arm(p.id)} onFocus={() => { setHover(p.id); arm(p.id); }} onBlur={() => setHover(null)}>
                  <h3>
                    <button type="button" className="pf-row__head" aria-expanded={isOpen} aria-controls={`row-${p.id}`} onClick={() => toggle(p)}>
                      <span className="pf-row__no mono">{pad(i + 1)}</span>
                      <span className="pf-row__title">{p.title}</span>
                      <span className="pf-row__place">{p.place}</span>
                      <MixBar mix={p.mix} />
                      <span className="pf-row__toggle" aria-hidden="true" />
                    </button>
                  </h3>
                  {/* always in the DOM so it can open and close smoothly; hidden from everyone while closed */}
                  <div className="pf-row__panel" id={`row-${p.id}`}>
                    <div className="pf-row__clip">
                      <div className="pf-row__body">
                        <div className="pf-row__photo" data-art={p.art ? '' : undefined} data-map={p.map ? '' : undefined}>
                          {p.map
                            ? <RegionTile regions={p.regions} label={p.alt} />
                            : p.art
                              ? <img src={p.art} srcSet={/-\d+\.webp$/.test(p.art) ? `${p.art.replace(/-\d+\.webp$/, '-640.webp')} 640w, ${p.art} ${/-(\d+)\.webp$/.exec(p.art)[1]}w` : undefined} sizes="(max-width: 760px) 100vw, 560px" alt={p.alt} loading={isOpen || warm.has(p.id) ? undefined : 'lazy'} decoding="async" />
                              : <Img name={p.photo} wide={p.wide || 1200} alt={p.alt} sizes="(max-width: 760px) 100vw, 560px" eager={isOpen || warm.has(p.id)} />}
                        </div>
                        <div className="pf-row__text">
                          <ul className="pf-row__tags">{p.tags.map(t => <li key={t}>{t}</li>)}</ul>
                          {p.blocks.map(([label, text]) => (
                            <div key={label} className="pf-row__block"><h4>{label}</h4><p>{text}</p></div>
                          ))}
                          <div className="pf-row__outputs">
                            <h4>Delivered</h4>
                            <ul>{p.outputs.map(o => <li key={o}>{o}</li>)}</ul>
                          </div>
                          {p.more ? <a className="link pf-row__more" href={p.more.href}>{p.more.label}<Arrow down /></a> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// The flagship study as a soil log: five phases down the page, with a profile beside them that marks
// the phase being read.
function Brakna() {
  const [phase, setPhase] = useState(0);
  const list = useRef(null);
  useEffect(() => {
    const root = list.current;
    if (!root || !('IntersectionObserver' in window)) return undefined;
    const groups = [...root.querySelectorAll('[data-phase]')];
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setPhase(Number(entry.target.getAttribute('data-phase')));
    }, { rootMargin: '-45% 0px -45% 0px' });
    groups.forEach(group => io.observe(group));
    return () => io.disconnect();
  }, []);
  let n = 0;
  const ranges = BRAKNA_PHASES.map(group => { const from = n + 1; n += group.steps.length; return [from, n]; });
  n = 0;
  return (
    <section className="pf-section pf-case" id="brakna" aria-labelledby="brakna-h">
      <div className="wrap pf-case__top">
        <div className="pf-case__intro" data-rv="">
          <p className="eyebrow">Case study · Brakna, Mauritania</p>
          <h2 className="display" id="brakna-h">3,000 hectares, read profile by profile <em>before a single canal was designed.</em></h2>
          <p className="lead">
            A hydro-agricultural development study for an irrigated perimeter in the communes of Dar El Barka
            and Ould Birom, for SONADER and Mauritania’s Ministry of Agriculture and Food Sovereignty.
          </p>
          <dl className="pf-case__meta">
            <div><dt className="mono">Role</dt><dd>Head of the soil study; methodology of the environmental and social impact assessment</dd></div>
            <div><dt className="mono">Worked with</dt><dd>Hydraulic engineers, surveyors, geotechnicians and agro-economists</dd></div>
            <div><dt className="mono">Field programme</dt><dd>85 auger holes, 30 soil pits and 170 samples at 0–30 and 30–60 cm</dd></div>
            <div><dt className="mono">Results</dt><dd>Ten WRB soil types, FAO suitability classes by crop and five fertility sectors</dd></div>
          </dl>
        </div>
        <div className="pf-case__photo" data-rv="clip">
          <Img name="irrigation-canal" alt="A lined irrigation canal between bare earth banks, with a small footbridge" />
        </div>
      </div>

      <div className="wrap pf-log">
        <div className="pf-log__side">
          <h3 className="display">My part, step by step</h3>
          <p>From the first satellite image to the client’s report, one engineer carried the soil study through.</p>
          <ol className="pf-profile" aria-label="Phases of the study">
            {BRAKNA_PHASES.map((group, i) => (
              <li key={group.name} style={{ '--n': group.steps.length, '--i': i }} data-on={phase === i ? '' : undefined}>
                <a href={`#phase-${i + 1}`}>
                  <span>{group.name}</span>
                  <span className="mono">{ranges[i][0] === ranges[i][1] ? pad(ranges[i][0]) : `${pad(ranges[i][0])}–${pad(ranges[i][1])}`}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div className="pf-log__list" ref={list}>
          {BRAKNA_PHASES.map((group, i) => (
            <section key={group.name} className="pf-phase" id={`phase-${i + 1}`} data-phase={i} aria-label={group.name}>
              <p className="pf-phase__name mono"><span>Phase {i + 1}</span>{group.name}</p>
              <ol>
                {group.steps.map(([title, text]) => {
                  n += 1;
                  return (
                    <li key={title} data-rv="">
                      <span className="pf-phase__no mono">{pad(n)}</span>
                      <h4>{title}</h4>
                      <p>{text}</p>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method() {
  const [active, setActive] = useState(0);
  return (
    <section className="pf-section pf-method" id="method" aria-labelledby="method-h">
      <div className="wrap">
        <div className="pf-head pf-head--row" data-rv="">
          <div>
            <p className="eyebrow">Method</p>
            <h2 className="display" id="method-h">One method, from field data <em>to sound decisions.</em></h2>
          </div>
          <p className="lead">The same four steps run through every study, whatever its scale.</p>
        </div>
        <ol className="pf-panels" data-rv="clip">
          {METHOD.map((m, i) => (
            <li key={m.step} data-on={active === i ? '' : undefined} onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(i); }} onClick={() => setActive(i)} onFocus={() => setActive(i)} tabIndex={0}>
              <Img name={m.photo} wide={m.wide} alt={m.alt} sizes="(max-width: 860px) 100vw, 50vw" />
              <div className="pf-panels__text">
                <span className="mono">{pad(i + 1)}</span>
                <h3>{m.step}</h3>
                <div className="pf-panels__more">
                  <p>{m.text}</p>
                  <p className="mono">{m.tools}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section className="pf-section pf-toolkit" id="toolkit" aria-labelledby="toolkit-h">
      <div className="wrap">
        <div className="pf-head pf-head--row" data-rv="">
          <div>
            <p className="eyebrow">Toolkit</p>
            <h2 className="display" id="toolkit-h">The toolkit</h2>
          </div>
          <p className="lead">The software behind the maps, the models and the field data, grouped by where it sits in a study.</p>
        </div>
        <div className="pf-tools">
          {TOOL_GROUPS.map(group => (
            <div className="pf-tgroup" key={group.name}>
              <h3 className="mono">{group.name}</h3>
              <ul>
                {group.tools.map(tool => (
                  <li className="pf-tool" key={tool.name}>
                    <span className="pf-tool__logo"><img src={`/portfolio/tools/${tool.logo}.svg`} alt="" width="32" height="32" loading="lazy" /></span>
                    <span className="pf-tool__name">{tool.name}</span>
                    <span className="pf-tool__use">{tool.use}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Training() {
  return (
    <section className="pf-section pf-training" id="training" aria-labelledby="training-h">
      <div className="wrap">
        <div className="pf-degree" data-rv="">
          <p className="eyebrow">Training · Institut Agronomique et Vétérinaire Hassan II, Rabat</p>
          <h2 className="display" id="training-h">State Engineer in Agronomy, natural resources and environment, <em>specialised in soil and water management.</em></h2>
        </div>
        <div className="pf-training__grid">
          <div>
            <h3 className="mono">Field training</h3>
            <ol className="pf-list">
              {TRAINING.map(([title, text], i) => <li key={title}><span className="mono">{pad(i + 1)}</span><strong>{title}</strong><p>{text}</p></li>)}
            </ol>
          </div>
          <div>
            <h3 className="mono">Certifications</h3>
            <ul className="pf-certs">{CERTS.map(c => <li key={c}>{c}</li>)}</ul>
            <h3 className="mono">Languages</h3>
            <dl className="pf-langs">
              {LANGUAGES.map(([lang, level]) => <div key={lang}><dt>{lang}</dt><dd className="mono">{level}</dd></div>)}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="pf-contact" id="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <div className="pf-contact__in" data-rv="">
          <p className="eyebrow">Start a study</p>
          <h2 className="display" id="contact-h">Send me the site, the question <em>and the deadline.</em></h2>
          <p className="lead">I reply with how I would approach the study, what it needs from the field and what it will deliver.</p>
          <div className="pf-contact__actions">
            <a className="btn btn--paper pf-btn--big" href={EMAIL}>Email Ayoub<Arrow /></a>
            <a className="link" href={EMAIL}>{MAIL}</a>
          </div>
          <ol className="pf-brief">
            {BRIEF.map(([title, text], i) => (
              <li key={title}><span className="mono">{pad(i + 1)}</span><strong>{title}</strong><p>{text}</p></li>
            ))}
          </ol>
        </div>
        <div className="pf-foot">
          <a className="brand" href="#top"><Mark />Soil Logic</a>
          <nav aria-label="Footer">
            <a href="/">Soil texture calculator</a>
            <a href="/articles">Soil guides</a>
            <a href={DECK} download="Ayoub-Professional-Pitch-Deck.pdf">Pitch deck (PDF)</a>
            <a href="/portfolio/credits.html">Photograph credits</a>
          </nav>
          <span className="mono">&copy; 2026 Soil Logic</span>
        </div>
      </div>
      <div className="site-footer__word" aria-hidden="true">Soil Logic</div>
    </footer>
  );
}

export default function Portfolio() {
  usePortfolioMetadata();
  const root = useRef(null);
  useReveal(root);
  return (
    <div className="pf" ref={root}>
      <a className="skip-link" href="#fields-h">Skip to content</a>
      <Header />
      <main>
        <Hero />
        <Fields />
        <Work />
        <Brakna />
        <Method />
        <Toolkit />
        <Training />
      </main>
      <Contact />
    </div>
  );
}

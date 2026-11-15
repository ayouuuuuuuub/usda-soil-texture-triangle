// Soil Logic portfolio page. This file is the source of truth: edit it directly.
//
// A bespoke page, scoped under .pf in ./portfolio.css. Palette: the Soil Logic mark (paper, ink, forest,
// sage, sand) plus one new colour, clay (#b4532f), taken from the red soil in the hero photograph.
// Motion follows one plan (see the motion block in portfolio.css): the hero plays once on load, each
// block answers the scroll once (rules drawn like survey lines, photographs uncovered like a core being
// lowered, headings rising word by word), a depth ruler follows the scroll, project rows open and close,
// and the Moroccan projects sit beside a map of the country's regions (MissionMap.jsx) that answers the
// list and is answered by it. The dark bands carry a living contour map (contours.js) that
// bends around the pointer, and photographs ripple like water under it (liquid.js). Everything rests
// under prefers-reduced-motion.
//
// Photographs are stand-ins from Wikimedia Commons (credits in /portfolio/credits.html) to be replaced by
// the client's own fieldwork photographs. Privacy: no employer name, no years of experience, no contract
// values, internships described by place type only.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { startContours } from './contours.js';
import { mountLiquid } from './liquid.js';
import MissionMap from './MissionMap.jsx';
import { meta } from './meta.js';
import './portfolio.css';

const PHOTO = '/portfolio/photos/';
const EMAIL = 'mailto:contact@soil-logic.com';
const DECK = '/portfolio/assets/ayoub-professional-pitch-deck.pdf';

function usePortfolioMetadata() {
  useLayoutEffect(() => {
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
    for (const [name, value] of [['description', meta.description], ['twitter:card', 'summary_large_image'], ['twitter:title', meta.title], ['twitter:description', meta.description], ['twitter:image', meta.image], ['theme-color', '#17302a']]) {
      const node = set('meta[name="' + name + '"]', 'meta', 'content', value); node.setAttribute('name', name);
    }
    for (const [name, value] of [['og:type', 'website'], ['og:title', meta.title], ['og:description', meta.description], ['og:url', meta.canonical], ['og:image', meta.image]]) {
      const node = set('meta[property="' + name + '"]', 'meta', 'content', value); node.setAttribute('property', name);
    }
    const canonical = set('link[rel="canonical"]', 'link', 'href', meta.canonical); canonical.setAttribute('rel', 'canonical');
    // the mono face for depth marks and data labels, only on this page
    if (!document.head.querySelector('link[href*="Red+Hat+Mono"]')) {
      const mono = document.createElement('link');
      mono.rel = 'stylesheet';
      mono.href = 'https://fonts.googleapis.com/css2?family=Red+Hat+Mono:wght@400;500&display=swap';
      document.head.appendChild(mono);
      undo.push(() => mono.remove());
    }
    return () => { document.title = previousTitle; undo.reverse().forEach(fn => fn()); };
  }, []);
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveals. Marks the page as animated (so nothing is hidden without JS or under reduced motion),
// then tags each [data-rv] block with data-in the first time it comes on screen; the CSS does the rest.
// Attributes, not classes: React rewrites className on the rows that open and close.
function useMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window) || prefersReducedMotion()) return undefined;
    root.setAttribute('data-motion', '');
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-in', '');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    root.querySelectorAll('[data-rv]').forEach(node => io.observe(node));
    const html = document.documentElement;
    const oldScroll = html.style.scrollBehavior;
    html.style.scrollBehavior = 'smooth';
    return () => { io.disconnect(); root.removeAttribute('data-motion'); html.style.scrollBehavior = oldScroll; };
  }, [rootRef]);
}

// The living contour map of a dark band: a canvas behind the band's content, and (on a mouse) a small
// elevation reading that follows the pointer. The band keeps its static contour drawing until the canvas
// has drawn, and for good under reduced motion.
function Topo({ preset, readout = false, alpha, indexAlpha }) {
  const canvas = useRef(null);
  const tag = useRef(null);
  useEffect(() => {
    if (!canvas.current || prefersReducedMotion()) return undefined;
    return startContours(canvas.current, tag.current, { preset, alpha, indexAlpha });
  }, [preset, alpha, indexAlpha]);
  return (
    <>
      <canvas className="pf-topo" ref={canvas} aria-hidden="true" />
      {readout ? <span className="pf-topo__tag" ref={tag} aria-hidden="true" /> : null}
    </>
  );
}

// A heading whose words rise out of their own line, one after another. The full text stays on the
// heading as its accessible name; the split words are presentation only.
function Title({ as: Tag = 'h2', id, text, em, className }) {
  const words = text.split(' ');
  const emWords = em ? em.split(' ') : [];
  const step = `${Math.round(Math.min(46, 460 / (words.length + emWords.length)))}ms`;
  const word = (w, i) => (
    <React.Fragment key={i}><span className="pf-w"><span style={{ '--i': i, '--step': step }}>{w}</span></span>{' '}</React.Fragment>
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

// A figure that counts up to its value once ("6.2M+ MAD" counts the 6.2 and keeps the rest).
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

// The page read as a soil profile: a depth ruler on the right edge whose marker goes down as you scroll
// (a thin progress line on small screens). Decorative, so hidden from assistive tech.
function Depth() {
  const track = useRef(null);
  const mark = useRef(null);
  const label = useRef(null);
  const bar = useRef(null);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (mark.current && track.current) mark.current.style.transform = `translate3d(0, ${p * track.current.clientHeight}px, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const cm = Math.round(p * 120);
      if (cm !== last && label.current) { last = cm; label.current.textContent = `${cm} cm`; }
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => { window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="pf-depth" aria-hidden="true">
      <div className="pf-depth__track" ref={track}>
        <span className="pf-depth__mark" ref={mark}><b ref={label}>0 cm</b></span>
      </div>
      <span className="pf-progress" ref={bar} />
    </div>
  );
}

// The main call to action leans toward the pointer (mouse only).
function Magnet({ children }) {
  const outer = useRef(null);
  const inner = useRef(null);
  useEffect(() => {
    const box = outer.current;
    const node = inner.current;
    if (!box || !node || prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const move = event => {
      const r = box.getBoundingClientRect();
      const x = (event.clientX - (r.left + r.width / 2)) * 0.22;
      const y = (event.clientY - (r.top + r.height / 2)) * 0.32;
      node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };
    const leave = () => { node.style.transform = ''; };
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerleave', leave);
    return () => { box.removeEventListener('pointermove', move); box.removeEventListener('pointerleave', leave); node.style.transform = ''; };
  }, []);
  return <span className="pf-magnet" ref={outer}><span ref={inner}>{children}</span></span>;
}

// True once the element is mostly on screen (one-shot, for the method line).
function useSeen() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return undefined;
    if (!('IntersectionObserver' in window)) { setSeen(true); return undefined; }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(node);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

function Logo() {
  return <span className="pf-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function Arrow() {
  return (
    <svg className="pf-arrow" viewBox="0 0 16 16" aria-hidden="true">
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

/* ------------------------------------------------------------------------------------------- data */

// 20+ projects (user-confirmed); the CV names: Brakna, Marrakech biodiversity, Marrakech green spaces, PADERMO, CESAR II, the regional
// housing plans, three forests, two regional coastal schemes and the Zat watershed (12); regions: Brakna, and in
// Morocco Marrakech-Safi, Oriental, Casablanca-Settat, Béni Mellal-Khénifra, Guelmim-Oued Noun, Rabat-Salé-Kénitra
// and Laâyoune-Sakia El Hamra (8); contracts won: housing plans over 5M MAD plus urban biodiversity 1.2M MAD.
const FACTS = [
  ['20+', 'projects contributed to, from soil surveys to regional plans'],
  ['8', 'regions covered across Morocco and Mauritania'],
  ['6.2M+ MAD', 'in contracts won with proposals I helped write'],
  ['2', 'new lines of work opened for the firm: housing plans and urban biodiversity'],
];

const FIELDS = [
  {
    no: '01',
    title: 'Soil and land suitability',
    lines: ['Soil surveys and profile descriptions', 'Crop and irrigation suitability', 'Fertility, salinity and drainage diagnosis', 'Fertilisation programmes by crop'],
  },
  {
    no: '02',
    title: 'GIS and environmental data',
    lines: ['Multicriteria stratification and sampling design', 'Remote sensing with Google Earth Engine', 'Clean, structured geodatabases', 'Thematic maps and atlases'],
  },
  {
    no: '03',
    title: 'Climate, environment and territory',
    lines: ['Climate vulnerability by district', 'Biodiversity and ecosystem services', 'Environmental safeguards (IFAD SECAP)', 'Regional and territorial planning studies'],
  },
];

const BRAKNA_STEPS = [
  ['Sampling plan', 'Soil survey plan and sampling protocol for the whole perimeter.'],
  ['Satellite data', 'Extraction and processing of satellite imagery and spectral indices, to read the land before going out.'],
  ['Stratification', 'Multicriteria GIS stratification of those indices: homogeneous survey units and the placement of every survey point.'],
  ['Fieldwork', 'Organisation and supervision of the field campaigns: auger surveys and soil pits, with a description sheet for every horizon.'],
  ['Classification', 'Classification and characterisation of each soil from the field descriptions.'],
  ['Laboratory', 'Coordination of the physico-chemical and hydrodynamic analyses; analysis and interpretation of the results for crop suitability, irrigation suitability and salinity, drainage and fertility constraints.'],
  ['Spatialisation', 'GIS mapping of every result: survey points and pits, textural depth, soil types, irrigation suitability, crop suitability and crop orientation.'],
  ['Recommendations', 'Suited crops, amendments, fertilisation, drainage, leaching and irrigation systems, with a soil fertility zoning and fertilisation programmes for rice, vegetables and fodder.'],
  ['Soil study and thematic atlas', 'Pedological study and thematic atlas of the perimeter, bringing every profile, analysis and map together: one reference document for the engineers designing the irrigation.'],
  ['Environmental assessment', 'Environmental and social impact assessment component and its methodology, alongside the soil study’s.'],
  ['Feasibility and delivery', 'Coordination with the hydraulic, survey, geotechnical and agro-economic experts on feasibility and development options; analytical annexes and final client deliverables.'],
];

const PROJECTS = [
  {
    id: 'mvd',
    photo: 'marrakech-palm-grove',
    alt: 'Date palms and shrubs in a palm grove on the edge of Marrakech',
    title: 'Biodiversity and climate vulnerability of Marrakech',
    place: 'Marrakech',
    regions: ['marrakech'],
    tags: ['Biodiversity', 'Ecosystem services', 'Climate'],
    blocks: [
      ['Method', 'Mission 1 methodology: flora and fauna sampling methods, and survey sites chosen by guided randomisation to cover every habitat of the city.'],
      ['Field mission', 'Field team supervision, with set daily routes to keep the surveys on time and on budget.'],
      ['Ecosystem services', 'Ecosystem-services modelling of the field data; thematic maps gathered in an atlas with its organised geodatabase.'],
      ['Climate', 'Mission 2: analysis of historical climate records, projections under future scenarios with Python (GeoPandas and Rasterio libraries), ArcGIS and QGIS, and a vulnerability score for each district and for the region as a whole.'],
    ],
    outputs: ['Survey methodology', 'Field mission plan', 'Ecosystem-services report', 'Thematic atlas', 'Climate projections', 'District vulnerability maps'],
  },
  {
    id: 'green',
    photo: 'marrakech-garden',
    alt: 'A dense urban garden of palms, shrubs and lawn in Marrakech',
    title: 'Urban green-space mapping and categorisation',
    place: 'Marrakech',
    regions: ['marrakech'],
    tags: ['GIS', 'Urban planning', 'Data'],
    blocks: [
      ['Field data', 'Synthesis and analysis of the field-mission records for the Mission 1 deliverables.'],
      ['Indicators', 'Key indicators to track how each green space changes over time.'],
      ['Atlas', 'Atlas of every green space and the street furniture it holds.'],
      ['Citywide plan', 'Mission 2: citywide categorisation and mapping of green spaces with local stakeholders, matched to the needs of urban planning; strategies to strengthen green infrastructure.'],
      ['Geodatabase', 'Management and cleaning of the spatial geodatabase, kept accurate and usable.'],
    ],
    outputs: ['Monitoring indicators', 'Green-space atlas', 'Citywide categorisation', 'Thematic maps', 'Clean geodatabase'],
  },
  {
    id: 'padermo',
    photo: 'rif-hills',
    alt: 'Terraced hillsides and scattered villages in mountains in northern Morocco',
    title: 'PADERMO, rural development in the eastern mountains',
    place: 'Oriental region',
    regions: ['oriental'],
    tags: ['Safeguards', 'Climate adaptation', 'Capacity building'],
    blocks: [
      ['Integration', 'Environmental and climate considerations built into every intervention of the programme: climate-resilience measures and natural-resource data from the baseline studies.'],
      ['Technical advice', 'Technical advice on sustainable agricultural production and climate adaptation; review of the climate studies, maps and documents produced by the programme.'],
      ['Training', 'Training of project staff and stakeholders in climate-resilient farming; awareness-raising for beneficiaries on climate resilience and environmental risk.'],
      ['Compliance', 'Coordination with regional and provincial agencies for compliance with national environmental and social policy and IFAD standards.'],
      ['Safeguard plans', 'IFAD SECAP procedures (certified): the Environmental, Social and Climate Management Plan, environmental and climate risk plans, required environmental documents and monitoring of environmental indicators.'],
    ],
    outputs: ['Technical reviews', 'Training sessions', 'Risk management plans', 'ESCMP', 'Indicator monitoring'],
  },
  {
    id: 'housing',
    photo: 'draa-oasis-town',
    alt: 'A town at the edge of a palm oasis below a bare hill',
    title: 'Regional housing plans for three regions',
    place: 'Casablanca-Settat · Béni Mellal-Khénifra · Guelmim-Oued Noun',
    regions: ['casablanca', 'beni-mellal', 'guelmim'],
    tags: ['Territory', 'GIS', 'Surveys'],
    blocks: [
      ['Phase I framework', 'Phase I methodology report: the reference framework for the three regional studies.'],
      ['Territorial analysis', 'Analysis of demographic, socio-economic, environmental, urban and land dynamics from the 2024 national census, planning documents, sector statistics and regional studies.'],
      ['Methods', 'Methods for the housing-stock diagnosis, the estimate of needs and deficit, the housing-demand survey and the census of available land.'],
      ['Stakeholders', 'Stakeholder mapping with a GIZ-inspired approach: identification, classification and ranking by influence, interest in the plan, capacity to share data and risk of blocking.'],
      ['Survey tools', 'Institutional interview guides; questionnaires for households, developers, banks and estate agencies; territorial and land census sheets.'],
      ['GIS and land', 'Geodatabase design, with layers and overlays of supply, demand, facilities, constraints and available land; land screening by legal status, planning fit, access, servicing, cost and environmental constraints, for a 2030 to 2035 horizon.'],
    ],
    outputs: ['Methodology report', 'Stakeholder map', 'Survey instruments', 'GIS data model', 'Land-screening method'],
  },
  {
    id: 'cesar',
    photo: 'draa-river',
    alt: 'A wide riverbed with a thin channel of water between palm groves',
    title: 'CESAR II, jobs in the water and sanitation sector',
    place: 'Morocco',
    regions: [],
    national: true,
    tags: ['Water', 'Sanitation', 'Research'],
    blocks: [
      ['Research', 'In-depth research and comparative sector studies on the business ecosystem and its key success factors.'],
      ['Workshops', 'Questionnaires for the stakeholder workshops, to collect the data the study needed.'],
      ['Analysis', 'Final analysis and data synthesis behind the recommendations on job opportunities, the value chain and the development of the sector’s ecosystem.'],
    ],
    outputs: ['Sector benchmarks', 'Workshop questionnaires', 'Value-chain analysis', 'Recommendations'],
  },
  {
    id: 'land',
    photo: 'atlas-terraces',
    alt: 'Green terraced fields on a valley slope in the High Atlas',
    title: 'Forests, coastline and watershed planning',
    place: 'Rabat · Laâyoune-Sakia El Hamra · Guelmim-Oued Noun · Zat',
    regions: ['rabat', 'marrakech', 'guelmim', 'laayoune'],
    tags: ['Forests', 'Coast', 'Watershed'],
    blocks: [
      ['Forests', 'Management support, statistical processing and spatial analysis for the plans of the Aïn Abelioun and Aït Hatem forests and Rabat’s green belt.'],
      ['Coastline', 'For the regional coastal schemes of Laâyoune-Sakia El Hamra and Guelmim-Oued Noun: project management, review and correction of deliverables, data analysis, mapping and spatial analysis.'],
      ['Watershed', 'Project management support and coordination of activities for the Zat watershed plan.'],
    ],
    outputs: ['Forest statistics', 'Coastal maps', 'Deliverable reviews', 'Coordination'],
  },
];

const METHOD = [
  { step: 'Design', text: 'A sampling plan from multicriteria GIS stratification: homogeneous survey units, then the points to dig.', tools: 'ArcGIS · QGIS · Earth Engine' },
  { step: 'Survey', text: 'Field campaigns organised and supervised; each horizon described, sampled and classified in the pit.', tools: 'Field protocols · KoboToolbox' },
  { step: 'Analyse', text: 'Laboratory results and spatial data read together, in one clean geodatabase.', tools: 'Python · R · SQL' },
  { step: 'Decide', text: 'Suitability maps, constraints and written recommendations that engineers and planners can act on.', tools: 'Atlases · Tableau · Reports' },
];

const TOOL_GROUPS = [
  {
    name: 'Mapping and remote sensing',
    tools: [
      { name: 'ArcGIS', logo: 'arcgis', use: 'Soil, suitability and thematic maps; atlases' },
      { name: 'QGIS', logo: 'qgis', use: 'Spatial analysis and map production' },
      { name: 'Google Earth Engine', logo: 'googleearthengine', use: 'Satellite imagery and spectral indices' },
    ],
  },
  {
    name: 'Analysis and code',
    tools: [
      { name: 'Python', logo: 'python', use: 'Climate projections and spatial data processing' },
      { name: 'R', logo: 'r', use: 'Statistics for soil and forest data' },
      { name: 'SQL', logo: 'sql', use: 'Querying structured datasets' },
      { name: 'Tableau', logo: 'tableau-icon', use: 'Dashboards and indicators' },
    ],
  },
  {
    name: 'Reporting and office',
    tools: [
      { name: 'Microsoft Word', logo: 'word', use: 'Study reports and technical deliverables' },
      { name: 'Excel', logo: 'excel', use: 'Lab results and data tables' },
      { name: 'Access', logo: 'access', use: 'Relational project databases' },
      { name: 'PowerPoint', logo: 'powerpoint', use: 'Workshops and client presentations' },
    ],
  },
  {
    name: 'In the field',
    field: true,
    tools: [
      { name: 'KoboToolbox', logo: 'kobotoolbox', use: 'Survey forms filled on a phone at every sampling point, synced to one dataset' },
      { name: 'QField', logo: 'qfield', use: 'GIS layers carried into the field: navigate to survey points and record observations on the map' },
    ],
  },
];

const TRAINING = [
  ['Saline treated wastewater', 'Designed and ran a field trial on how saline treated wastewater affects soil fertility, at a golf course in Agadir.'],
  ['Nakhla watershed soil map', 'Characterised soils with a field team and produced the watershed’s soil map in ArcGIS.'],
  ['Blueberry irrigation', 'Followed irrigation, fertilisation and crop-protection trials at a blueberry producer near Agadir.'],
  ['Farm records', 'Recorded crops, inputs, pests and field practices on a farm near Meknès.'],
];

const CERTS = ['Google Data Analytics', 'Google Advanced Data Analytics', 'GIS Specialization', 'Google Project Management', 'Precision Agriculture', 'IFAD SECAP procedures'];

/* --------------------------------------------------------------------------------------- sections */

function Hero() {
  return (
    <header className="pf-hero" id="top">
      <Topo preset="massif" readout />
      <nav className="pf-nav" aria-label="Main">
        <a className="pf-brand" href="#top"><Logo />Soil Logic</a>
        <div className="pf-nav__links">
          <a href="#brakna">Case study</a>
          <a href="#projects">Projects</a>
          <a href="#method">Method</a>
          <a href="#toolkit">Toolkit</a>
          <a href="#training">Training</a>
        </div>
        <a className="pf-btn pf-btn--light pf-nav__cta" href={EMAIL}>Email Ayoub</a>
      </nav>

      <div className="pf-hero__grid">
        <div className="pf-hero__copy">
          <p className="pf-hero__who pf-in" style={{ '--d': '0ms' }}>Ayoub · State Engineer in Agronomy · Soil, water and environment</p>
          <Title as="h1" text="I read the land before the project is drawn." />
          <p className="pf-hero__lead pf-in" style={{ '--d': '420ms' }}>
            Soil, water and environmental studies: land and irrigation suitability, GIS and remote sensing,
            climate vulnerability and environmental safeguards, for projects in Morocco and Mauritania.
          </p>
          <div className="pf-hero__actions pf-in" style={{ '--d': '520ms' }}>
            <a className="pf-btn pf-btn--sand" href={EMAIL}>Email Ayoub<Arrow /></a>
            <a className="pf-btn pf-btn--ghost" href={DECK} download="Ayoub-Professional-Pitch-Deck.pdf">Download the pitch deck<span className="sr-only"> (PDF)</span></a>
          </div>
        </div>

        <figure className="pf-core" aria-hidden="true">
          <div className="pf-core__photo" data-liquid="">
            <Img name="hero-soil-red" wide={960} eager alt="" sizes="(max-width: 760px) 80vw, 440px" />
            {[18, 41, 63, 84].map((top, i) => (
              <span className="pf-core__line" key={top} style={{ '--top': `${top}%`, '--d': `${[520, 660, 770, 850][i]}ms` }} />
            ))}
          </div>
          <div className="pf-core__ruler">
            {[0, 25, 50, 75, 100].map((cm, i) => (
              <span key={cm} style={{ '--top': `${cm}%`, '--d': `${480 + i * 70}ms` }}>{cm} cm</span>
            ))}
          </div>
        </figure>
      </div>

      <dl className="pf-facts">
        {FACTS.map(([value, label], i) => (
          <div key={value} className="pf-in" style={{ '--d': `${760 + i * 90}ms` }}>
            <dt><Count value={value} delay={820 + i * 90} /></dt><dd>{label}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

function Fields() {
  return (
    <section className="pf-section pf-fields" aria-labelledby="fields-h">
      <div className="pf-wrap">
        <div className="pf-head" data-rv="head">
          <Title id="fields-h" text="Three fields, one question:" em="what can this land carry?" />
          <p data-rise="" style={{ '--i': 4 }}>Each study moves from the pit to the map to a recommendation someone can build on.</p>
        </div>
        <div className="pf-fields__grid">
          {FIELDS.map((field, i) => (
            <article key={field.no} className="pf-field" data-rv="field" style={{ '--i': i }}>
              <span className="pf-field__no">{field.no}</span>
              <h3>{field.title}</h3>
              <ul>{field.lines.map((line, j) => <li key={line} style={{ '--j': j }}>{line}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Brakna() {
  return (
    <section className="pf-section pf-case" id="brakna" aria-labelledby="brakna-h">
      <div className="pf-wrap pf-case__grid">
        <div className="pf-case__intro" data-rv="head">
          <p className="pf-kicker" data-rise=""><span>Case study</span>Brakna, Mauritania</p>
          <Title id="brakna-h" text="3,000 hectares, read profile by profile before a single canal was designed." />
          <p data-rise="" style={{ '--i': 4 }}>
            A hydro-agricultural development study for an irrigated perimeter in the communes of Dar El Barka
            and Ould Birom, for SONADER and Mauritania’s Ministry of Agriculture and Food Sovereignty.
          </p>
          <dl className="pf-case__meta" data-rise="" style={{ '--i': 5 }}>
            <div><dt>Scope</dt><dd>Soil study; methodology of the environmental and social impact assessment</dd></div>
            <div><dt>Worked with</dt><dd>Hydraulic engineers, surveyors, geotechnicians and agro-economists</dd></div>
          </dl>
        </div>

        <div className="pf-case__log">
          <div className="pf-case__photo" data-rv="clip" data-liquid="">
            <Img name="irrigation-canal" alt="A lined irrigation canal between bare earth banks, with a small footbridge" />
          </div>
        </div>
      </div>
      <div className="pf-wrap pf-steps">
        <div className="pf-steps__head" data-rv="head">
          <Title as="h3" text="My part, step by step" />
          <p data-rise="" style={{ '--i': 3 }}>From the first satellite image to the client’s report, one engineer carried the soil study through.</p>
        </div>
        <ol className="pf-steps__list">
          {BRAKNA_STEPS.map(([title, text], i) => (
            <li key={title} data-rv="step" style={{ '--i': i % 2 }}>
              <span className="pf-steps__no">{String(i + 1).padStart(2, '0')}</span>
              <h4>{title}</h4>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Projects() {
  const [open, setOpen] = useState(null);
  const [hover, setHover] = useState(null);
  const [region, setRegion] = useState(null);
  // a row's photograph starts loading as soon as the row is touched, so it is there when the row opens
  const [warm, setWarm] = useState(() => new Set());
  const arm = id => setWarm(set => (set.has(id) ? set : new Set(set).add(id)));
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  // a study chosen on the map: open its row and bring it into view once the other rows have closed
  const show = id => {
    setOpen(id);
    arm(id);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const row = document.getElementById(`project-${id}`);
      if (row) row.scrollIntoView({ block: window.matchMedia('(min-width: 1081px)').matches ? 'nearest' : 'start' });
    }, 400);
  };
  // a region chosen on the map: list its studies, or open the study straight away when there is only one
  const pickRegion = id => {
    if (region === id) { setRegion(null); return; }
    setRegion(id);
    const here = PROJECTS.filter(p => p.regions.includes(id));
    if (here.length === 1) show(here[0].id);
    else if (open && !here.some(p => p.id === open)) setOpen(null);
  };
  const toggle = p => {
    const closing = open === p.id;
    setOpen(closing ? null : p.id);
    if (!closing && region && !p.regions.includes(region)) setRegion(null);
  };

  return (
    <section className="pf-section pf-projects" id="projects" aria-labelledby="projects-h">
      <div className="pf-wrap">
        <div className="pf-head pf-head--row" data-rv="head">
          <Title id="projects-h" text="Selected projects" />
          <p data-rise="" style={{ '--i': 2 }}>Studies for public agencies, international cooperation and development programmes across Morocco. Pick a region on the map or open a row to see what was done.</p>
        </div>
        <div className="pf-atlas">
          <MissionMap projects={PROJECTS} open={open} hover={hover} region={region} onRegion={pickRegion} onProject={show} onReset={() => { setOpen(null); setRegion(null); }} />
          <div className="pf-index-wrap" onMouseLeave={() => setHover(null)}>
            <ol className="pf-index">
              {PROJECTS.map((p, i) => {
                const isOpen = open === p.id;
                return (
                  <li key={p.id} id={`project-${p.id}`} className={isOpen ? 'pf-row is-open' : 'pf-row'} data-rv="row" onMouseEnter={() => { setHover(p.id); arm(p.id); }} onTouchStart={() => arm(p.id)} onFocus={() => { setHover(p.id); arm(p.id); }} onBlur={() => setHover(null)}>
                    <h3>
                      <button type="button" className="pf-row__head" aria-expanded={isOpen} aria-controls={`row-${p.id}`} onClick={() => toggle(p)}>
                        <span className="pf-row__no">{String(i + 1).padStart(2, '0')}</span>
                        <span className="pf-row__title">{p.title}</span>
                        <span className="pf-row__place">{p.place}</span>
                        <span className="pf-row__toggle" aria-hidden="true" />
                      </button>
                    </h3>
                    {/* always in the DOM so it can open and close smoothly; hidden from everyone while closed */}
                    <div className="pf-row__panel" id={`row-${p.id}`}>
                      <div className="pf-row__clip">
                        <div className="pf-row__body">
                          <div className="pf-row__photo" data-liquid=""><Img name={p.photo} alt={p.alt} sizes="(max-width: 760px) 100vw, 560px" eager={isOpen || warm.has(p.id)} /></div>
                          <div className="pf-row__text">
                            <ul className="pf-row__tags" style={{ '--i': 0 }}>{p.tags.map(t => <li key={t}>{t}</li>)}</ul>
                            {p.blocks.map(([label, text], b) => (
                              <div key={label} className="pf-row__block" style={{ '--i': b + 1 }}><h4>{label}</h4><p>{text}</p></div>
                            ))}
                            <div className="pf-row__outputs" style={{ '--i': p.blocks.length + 1 }}>
                              <h4>Delivered</h4>
                              <ul>{p.outputs.map((o, j) => <li key={o} style={{ '--j': j }}>{o}</li>)}</ul>
                            </div>
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
      </div>
    </section>
  );
}

function Method() {
  const [ref, seen] = useSeen();
  return (
    <section className="pf-section pf-method" id="method" aria-labelledby="method-h">
      <Topo preset="terraces" alpha={0.1} indexAlpha={0.22} />
      <div className="pf-wrap">
        <div className="pf-head" data-rv="head">
          <Title id="method-h" text="One method, from field data to sound decisions" />
          <p data-rise="" style={{ '--i': 4 }}>The same four steps run through every study, whatever its scale.</p>
        </div>
        <ol className={seen ? 'pf-flow is-seen' : 'pf-flow'} ref={ref}>
          {METHOD.map((m, i) => (
            <li key={m.step} style={{ '--i': i }}>
              <span className="pf-flow__dot" aria-hidden="true" />
              <span className="pf-flow__no">{String(i + 1).padStart(2, '0')}</span>
              <h3>{m.step}</h3>
              <p>{m.text}</p>
              <p className="pf-flow__tools">{m.tools}</p>
            </li>
          ))}
        </ol>
        <div className="pf-strip">
          {[
            ['soil-profile-tape', 960, 'A dark soil profile beside a measuring tape'],
            ['hero-soil-pit', 1080, 'A soil pit wall with a measuring staff marking each horizon'],
            ['irrigated-orchards', 1200, 'Irrigated orchards seen from above, divided into regular plots'],
            ['oasis-crops', 960, 'Date palms above small irrigated plots in a desert oasis'],
          ].map(([name, wide, alt], i) => (
            <div className="pf-strip__cell" key={name} data-rv="clip" data-liquid="" style={{ '--i': i }}>
              <Img name={name} wide={wide} alt={alt} sizes="(max-width: 760px) 50vw, 25vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section className="pf-section pf-toolkit" id="toolkit" aria-labelledby="toolkit-h">
      <div className="pf-wrap">
        <div className="pf-head pf-head--row" data-rv="head">
          <Title id="toolkit-h" text="The toolkit" />
          <p data-rise="" style={{ '--i': 2 }}>The software behind the maps, the models and the field data, grouped by where it sits in a study.</p>
        </div>
        <div className="pf-toolkit__groups">
          {TOOL_GROUPS.map(group => (
            <div className={group.field ? 'pf-tgroup pf-tgroup--field' : 'pf-tgroup'} key={group.name} data-rv="tools">
              <h3 className="pf-label">{group.name}</h3>
              <ul className="pf-tgrid" style={{ '--n': group.tools.length }}>
                {group.tools.map((tool, i) => (
                  <li className="pf-tool" key={tool.name} style={{ '--i': i }}>
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
      <div className="pf-wrap">
        <div className="pf-degree" data-rv="head">
          <p className="pf-kicker" data-rise=""><span>Training</span>Institut Agronomique et Vétérinaire Hassan II, Rabat</p>
          <Title id="training-h" text="State Engineer in Agronomy, natural resources and environment, specialised in soil and water management." />
        </div>
        <div className="pf-training__grid">
          <div>
            <h3 className="pf-label">Field training</h3>
            <ul className="pf-list">
              {TRAINING.map(([title, text]) => <li key={title} data-rv="rise"><strong>{title}</strong><span>{text}</span></li>)}
            </ul>
          </div>
          <div>
            <h3 className="pf-label">Certifications</h3>
            <ul className="pf-certs" data-rv="chips">{CERTS.map((c, j) => <li key={c} style={{ '--j': j }}>{c}</li>)}</ul>
            <h3 className="pf-label">Languages</h3>
            <dl className="pf-langs" data-rv="head">
              {[['Arabic', 'Native'], ['Amazigh', 'Native'], ['English', 'Fluent'], ['French', 'Fluent']].map(([lang, level], i) => (
                <div key={lang} data-rise="" style={{ '--i': i }}><dt>{lang}</dt><dd>{level}</dd></div>
              ))}
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
      <Topo preset="basin" readout />
      <div className="pf-wrap" data-rv="head">
        <Title id="contact-h" text="Send me the site, the question and the deadline." />
        <p data-rise="" style={{ '--i': 5 }}>I reply with how I would approach the study, what it needs from the field and what it will deliver.</p>
        <div className="pf-contact__actions" data-rise="" style={{ '--i': 6 }}>
          <Magnet><a className="pf-btn pf-btn--sand pf-btn--big" href={EMAIL}>Email Ayoub<Arrow /></a></Magnet>
          <a className="pf-contact__mail" href={EMAIL}>contact@soil-logic.com</a>
        </div>
        <div className="pf-foot">
          <a className="pf-brand" href="#top"><Logo />Soil Logic</a>
          <nav aria-label="Footer">
            <a href="/">Soil texture calculator</a>
            <a href="/articles">Soil guides</a>
            <a href={DECK} download="Ayoub-Professional-Pitch-Deck.pdf">Pitch deck (PDF)</a>
            <a href="/portfolio/credits.html">Photograph credits</a>
          </nav>
          <span>&copy; 2026 Soil Logic</span>
        </div>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  usePortfolioMetadata();
  const root = useRef(null);
  useMotion(root);
  useEffect(() => (root.current && !prefersReducedMotion() ? mountLiquid(root.current) : undefined), []);
  return (
    <div className="pf" ref={root}>
      <a className="pf-skip" href="#fields-h">Skip to content</a>
      <Depth />
      <Hero />
      <main>
        <Fields />
        <Brakna />
        <Projects />
        <Method />
        <Toolkit />
        <Training />
      </main>
      <Contact />
    </div>
  );
}

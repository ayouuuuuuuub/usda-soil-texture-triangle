// Everything the portfolio page says, in one place: edit the words here, not in Portfolio.jsx.
//
// Privacy, as agreed for this page: no employer name, no years of experience, internships described by
// place type only. Photographs are stand-ins from Wikimedia Commons (credits in /portfolio/credits.html)
// until the client's own fieldwork photographs replace them; the two illustrations are the client's.

export const EMAIL = 'mailto:contact@soil-logic.com';
export const MAIL = 'contact@soil-logic.com';
export const DECK = '/portfolio/assets/ayoub-professional-pitch-deck.pdf';
export const PHOTO = '/portfolio/photos/';

// 20+ projects (user-confirmed); the CV names: Brakna, Marrakech biodiversity, Marrakech green spaces, PADERMO,
// CESAR II, the regional housing plans, three forests, two regional coastal schemes and the Zat watershed (12);
// regions: Brakna, and in Morocco Marrakech-Safi, Oriental, Casablanca-Settat, Béni Mellal-Khénifra,
// Guelmim-Oued Noun, Rabat-Salé-Kénitra and Laâyoune-Sakia El Hamra (8).
//
// Value of the contribution, an estimate built from averages (user-supplied: 20+ projects, each worth
// between 250K and 3.5M MAD, a share of the work above 30% on some of them):
//   average project value  = (0.25M + 3.5M) / 2      = 1.875M MAD
//   total value of studies = 20 x 1.875M              = 37.5M MAD
//   average share of work  = 20% (assumed: above 30% on some projects, less on others)
//   value of the share     = 37.5M x 20%              = 7.5M MAD, "7.5M+" because 20 is a floor
// Change CONTRIBUTION_SHARE or the figures below if the real numbers differ.
const PROJECT_COUNT = 20;
const PROJECT_VALUE_MIN = 0.25; // million MAD
const PROJECT_VALUE_MAX = 3.5; // million MAD
const CONTRIBUTION_SHARE = 0.2;
const contribution = PROJECT_COUNT * ((PROJECT_VALUE_MIN + PROJECT_VALUE_MAX) / 2) * CONTRIBUTION_SHARE;

export const FACTS = [
  ['20+', 'projects contributed to, from soil surveys to regional plans'],
  ['8', 'regions covered across Morocco and Mauritania'],
  [`${Math.round(contribution * 10) / 10}M+ MAD`, 'estimated value of my share of the work, across projects worth 250K to 3.5M MAD each'],
  ['2', 'new lines of work opened for the firm: housing plans and urban biodiversity'],
];

// What the hero drawing is read for: each note points at one thing in the illustration
// (x, y: where it points, in percent of the drawing; side: where the label sits).
export const NOTES = [
  { label: 'Land cover', x: 27, y: 21, side: 'left' },
  { label: 'Territory', x: 84, y: 34, side: 'right' },
  { label: 'Irrigation water', x: 44, y: 61, side: 'left' },
  { label: 'Crops', x: 90, y: 50, side: 'right' },
  { label: 'Rooting depth', x: 19, y: 77, side: 'left' },
  { label: 'Soil horizons', x: 74, y: 78, side: 'right' },
  { label: 'Parent rock', x: 52, y: 94, side: 'right' },
];

// The four fields of the practice (the "fields" section). `key` sets the colour: soil science = ochre,
// agronomy = green, environment = iron oxide, data science and GIS = slate.
export const FIELDS = [
  {
    key: 'soil',
    no: '01',
    short: 'Soil science',
    title: 'Soil science',
    lines: ['Soil surveys and profile descriptions', 'Soil classification and characterisation', 'Fertility, salinity, sodicity and drainage diagnosis', 'Physico-chemical and hydrodynamic lab interpretation'],
  },
  {
    key: 'land',
    no: '02',
    short: 'Environment',
    title: 'Environment',
    lines: ['Climate vulnerability by district', 'Biodiversity and ecosystem services', 'Environmental safeguards (IFAD SECAP)', 'Environmental and social impact assessment'],
  },
  {
    key: 'agro',
    no: '03',
    short: 'Agronomy',
    title: 'Agronomy',
    lines: ['Crop and irrigation suitability', 'Fertilisation programmes by crop', 'Amendments, drainage and irrigation systems', 'Climate-resilient farming practices'],
  },
  {
    key: 'data',
    no: '04',
    short: 'Data & GIS',
    title: 'Data science and GIS',
    lines: ['Multicriteria stratification and sampling design', 'Remote sensing with Google Earth Engine', 'Climate projections and statistics in Python and R', 'Clean geodatabases, thematic maps and atlases'],
  },
];

// The three axes of the mixture diagram ("By field"), in the order of each study's `mix`:
// [soil science and agronomy, data science and GIS, environment].
export const MIX_AXES = [
  { key: 'soil', label: 'Soil science and agronomy', short: 'Soil & agronomy' },
  { key: 'data', label: 'Data science and GIS', short: 'Data & GIS' },
  { key: 'land', label: 'Environment', short: 'Environment' },
];

// The flagship study, step by step, grouped into the five phases of the method.
export const BRAKNA_PHASES = [
  {
    name: 'Design',
    steps: [
      ['Sampling plan', 'Soil survey plan and sampling protocol for the whole perimeter.'],
      ['Satellite data', 'Extraction and processing of satellite imagery and spectral indices, to read the land before going out.'],
      ['Stratification', 'Multicriteria GIS stratification of those indices: homogeneous survey units and the placement of every survey point.'],
    ],
  },
  {
    name: 'Field',
    steps: [
      ['Fieldwork', 'Organisation and supervision of the field campaigns: auger surveys and soil pits, with a description sheet for every horizon.'],
      ['Classification', 'Classification and characterisation of each soil from the field descriptions.'],
    ],
  },
  {
    name: 'Laboratory',
    steps: [
      ['Laboratory', 'Coordination of the physico-chemical and hydrodynamic analyses; analysis and interpretation of the results for crop suitability, irrigation suitability and salinity, drainage and fertility constraints.'],
    ],
  },
  {
    name: 'Mapping',
    steps: [
      ['Spatialisation', 'GIS mapping of every result: survey points and pits, textural depth, soil types, irrigation suitability, crop suitability and crop orientation.'],
    ],
  },
  {
    name: 'Decision',
    steps: [
      ['Recommendations', 'Suited crops, amendments, fertilisation, drainage, leaching and irrigation systems, with a soil fertility zoning and fertilisation programmes for rice, vegetables and fodder.'],
      ['Soil study and thematic atlas', 'Pedological study and thematic atlas of the perimeter, bringing every profile, analysis and map together: one reference document for the engineers designing the irrigation.'],
      ['Environmental assessment', 'Environmental and social impact assessment component and its methodology, alongside the soil study’s.'],
      ['Feasibility and delivery', 'Coordination with the hydraulic, survey, geotechnical and agro-economic experts on feasibility and development options; analytical annexes and final client deliverables.'],
    ],
  },
];

// The studies. `mix` is the share of each field in the work, [soil, data, territory], adding up to 100:
// an estimate made for the mixture diagram, to be adjusted by the person who did the work.
// `regions` are ids from moroccoMap.js (the mission map); `national` lights the whole country.
export const PROJECTS = [
  {
    id: 'brakna',
    photo: 'irrigation-canal',
    alt: 'A lined irrigation canal between bare earth banks, with a small footbridge',
    title: 'Soil study for a 3,000 ha irrigated perimeter',
    place: 'Brakna, Mauritania',
    regions: [],
    abroad: true,
    mix: [70, 20, 10],
    tags: ['Soil survey', 'Irrigation suitability', 'Atlas'],
    blocks: [
      ['The study', 'A hydro-agricultural development study for an irrigated perimeter in the communes of Dar El Barka and Ould Birom: the soil study from the first satellite image to the client’s report, and the methodology of the environmental and social impact assessment.'],
    ],
    outputs: ['Sampling plan', 'Soil classification', 'Suitability maps', 'Fertilisation programmes', 'Soil study and atlas'],
    more: { href: '#brakna', label: 'Read the case study' },
  },
  {
    id: 'mvd',
    photo: 'marrakech-palm-grove',
    alt: 'Date palms and shrubs in a palm grove on the edge of Marrakech',
    title: 'Biodiversity and climate vulnerability of Marrakech',
    place: 'Marrakech',
    regions: ['marrakech'],
    mix: [10, 50, 40],
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
    mix: [0, 75, 25],
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
    mix: [15, 5, 80],
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
    art: '/portfolio/assets/housing-land-use.webp',
    alt: 'A drawing of a housing district of terraces and gardens beside farmland',
    title: 'Regional housing plans for three regions',
    place: 'Casablanca-Settat · Béni Mellal-Khénifra · Guelmim-Oued Noun',
    regions: ['casablanca', 'beni-mellal', 'guelmim'],
    mix: [0, 30, 70],
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
    mix: [0, 45, 55],
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
    mix: [20, 35, 45],
    tags: ['Forests', 'Coast', 'Watershed'],
    blocks: [
      ['Forests', 'Management support, statistical processing and spatial analysis for the plans of the Aïn Abelioun and Aït Hatem forests and Rabat’s green belt.'],
      ['Coastline', 'For the regional coastal schemes of Laâyoune-Sakia El Hamra and Guelmim-Oued Noun: project management, review and correction of deliverables, data analysis, mapping and spatial analysis.'],
      ['Watershed', 'Project management support and coordination of activities for the Zat watershed plan.'],
    ],
    outputs: ['Forest statistics', 'Coastal maps', 'Deliverable reviews', 'Coordination'],
  },
];

export const METHOD = [
  { step: 'Design', text: 'A sampling plan from multicriteria GIS stratification: homogeneous survey units, then the points to dig.', tools: 'ArcGIS · QGIS · Earth Engine', photo: 'irrigated-orchards', wide: 1200, alt: 'Irrigated orchards seen from above, divided into regular plots' },
  { step: 'Survey', text: 'Field campaigns organised and supervised; each horizon described, sampled and classified in the pit.', tools: 'Field protocols · KoboToolbox', photo: 'hero-soil-pit', wide: 1080, alt: 'A soil pit wall with a measuring staff marking each horizon' },
  { step: 'Analyse', text: 'Laboratory results and spatial data read together, in one clean geodatabase.', tools: 'Python · R · SQL', photo: 'soil-profile-tape', wide: 960, alt: 'A dark soil profile beside a measuring tape' },
  { step: 'Decide', text: 'Suitability maps, constraints and written recommendations that engineers and planners can act on.', tools: 'Atlases · Tableau · Reports', photo: 'oasis-crops', wide: 960, alt: 'Date palms above small irrigated plots in a desert oasis' },
];

export const TOOL_GROUPS = [
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
    tools: [
      { name: 'KoboToolbox', logo: 'kobotoolbox', use: 'Survey forms filled on a phone at every sampling point, synced to one dataset' },
      { name: 'QField', logo: 'qfield', use: 'GIS layers carried into the field: navigate to survey points and record observations on the map' },
    ],
  },
];

export const TRAINING = [
  ['Saline treated wastewater', 'Designed and ran a field trial on how saline treated wastewater affects soil fertility, at a golf course in Agadir.'],
  ['Nakhla watershed soil map', 'Characterised soils with a field team and produced the watershed’s soil map in ArcGIS.'],
  ['Blueberry irrigation', 'Followed irrigation, fertilisation and crop-protection trials at a blueberry producer near Agadir.'],
  ['Farm records', 'Recorded crops, inputs, pests and field practices on a farm near Meknès.'],
];

export const CERTS = ['Google Data Analytics', 'Google Advanced Data Analytics', 'GIS Specialization', 'Google Project Management', 'Precision Agriculture', 'IFAD SECAP procedures'];

export const LANGUAGES = [['Arabic', 'Native'], ['Amazigh', 'Native'], ['English', 'Fluent'], ['French', 'Fluent']];

// What a first message needs, in the words of the closing headline.
export const BRIEF = [
  ['The site', 'Where it is and how large.'],
  ['The question', 'What has to be decided on this land.'],
  ['The deadline', 'When the study has to be on the table.'],
];

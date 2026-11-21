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
// the regional housing plans, three forests, three regional coastal schemes, the red palm weevil programme and the
// Zat watershed;
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

// The flagship study, step by step, grouped into the five phases of the method (from the CV, 2026).
export const BRAKNA_PHASES = [
  {
    name: 'Design',
    steps: [
      ['Leading the soil study', 'Planning, technical coordination and supervision of the soil and agronomic investigations: the intervention method, the field campaigns, the people and equipment involved, and quality control of the work, to characterise the soils and judge their potential for irrigated farming.'],
      ['A survey plan from satellite data', 'A stratified systematic sampling strategy built in GIS from the digital elevation model, Sentinel-2 imagery and spectral indices, notably the salinity index (SI) and the soil-adjusted vegetation index (SAVI). An unsupervised K-means classification of these layers separated four homogeneous soil-landscape units: low-lying basins, wet transition zones, intermediate land and higher, better-drained ground. The sampling network was sized at one auger hole per 50 ha.'],
    ],
  },
  {
    name: 'Field',
    steps: [
      ['Field investigations', 'Running and supervising 85 auger holes, 30 soil pits and 170 samples taken at two standard depths (0–30 cm and 30–60 cm). Supervision of the morphological description of every profile and horizon: texture, structure, colour, consistence, compaction, porosity, moisture and signs of waterlogging, salinity and sodicity. Control of geolocation, traceability and the quality of every observation and sample.'],
      ['Soil classification (WRB)', 'Identification and classification of the soils in the World Reference Base (WRB), distinguishing ten soil types and subtypes from the 30 reference profiles. Characterisation of the main soil groups, notably clayey Vertic Fluvisols and their waterlogged, proto-saline, sodic and arenic variants, and mapping of the soil units by guided extrapolation from soil analogy and the combined morphological, textural and chemical evidence.'],
    ],
  },
  {
    name: 'Laboratory',
    steps: [
      ['Laboratory programme and soil properties', 'Definition and follow-up of the physical and physico-chemical analyses: particle size, textural class, pH, electrical conductivity, cation exchange capacity (CEC), exchangeable bases (Ca, Mg, K, Na), organic matter, total nitrogen and available phosphorus (Olsen). Field capacity, wilting point, infiltration and permeability estimated from texture. Results read together with the field observations to set out the potential and the constraints of each soil.'],
    ],
  },
  {
    name: 'Mapping',
    steps: [
      ['Irrigation and crop suitability', 'A multicriteria decision matrix inspired by the FAO framework, built on the limiting factors: rooting depth, texture, structure, salinity, sodicity, pH, drainage, waterlogging, water-holding capacity and infiltration. The most-limiting-factor rule set the suitability classes (S1, S2, S3, N1, N2), separately for irrigation, irrigated rice, vegetables and fodder crops, and flagged the sectors needing improvement first.'],
      ['Soil and agronomic maps', 'Structuring, processing and mapping of every soil and laboratory result in GIS: texture by horizon (0–30 and 30–60 cm), pH, electrical conductivity and CEC, soil types, textural depth, irrigation suitability, crop suitability by crop and crop orientation. The maps show where the land can be developed, and what holds it back.'],
    ],
  },
  {
    name: 'Decision',
    steps: [
      ['Fertility sectors and fertilisation programmes', 'Five homogeneous fertility sectors drawn from chemistry, texture, soil type and irrigation suitability. Separate fertilisation programmes for irrigated rice, vegetables and fodder crops: N, P₂O₅ and K₂O rates, mineral fertilisers (DAP, urea, KCl/MOP, potassium sulphate) and organic and mineral amendments (compost, manure, agricultural gypsum) matched to each sector’s needs and constraints.'],
      ['Agronomic and economic feasibility', 'Checking the local availability of fertilisers and amendments, comparing prices, supply and transport constraints, and weighing the cost of each formulation. Priority development measures identified: drainage, controlled leaching, correction of saline-sodic constraints, better soil structure and reasoned fertilisation.'],
      ['Development options with the engineering team', 'Soil and agronomic results built into the analysis of the perimeter’s potential and the ranking of the sectors to develop, with the hydraulic, survey, geotechnical and agro-economic experts, so that soil suitability, crop choices, irrigation and drainage needs and the engineering solutions agree.'],
      ['Report and deliverables', 'The soil study report: survey method, field and laboratory results, soil classification, suitability, sector diagnoses and agronomic recommendations. Analytical annexes, profile description sheets, databases and thematic maps handed to the client to support the planning and design of the project.'],
    ],
  },
];

// The studies, from the CV (2026). Each opens on the role held, then one block per contribution.
// `mix` is the share of each field in the work, [soil science and agronomy, data science and GIS,
// environment], adding up to 100: an estimate made for the mixture diagram, to be adjusted by the person
// who did the work. `regions` are ids from moroccoMap.js (the mission map); `national` lights the whole
// country. A study shows `photo` (a photograph: public/portfolio/photos/<photo>-640 and -<wide> .webp), `art`
// (an illustration, shown whole) or `map`: its regions highlighted on Morocco. The images of the housing plans,
// the red palm weevil programme, the coastal schemes and the forests are Soil Logic's own (originals in
// project-images/); the other photographs are Wikimedia Commons stand-ins credited in /portfolio/credits.html.
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
    tags: ['Soil survey', 'Remote sensing', 'Land suitability', 'Fertilisation'],
    blocks: [
      ['Role', 'Head of the soil study, for SONADER and Mauritania’s Ministry of Agriculture and Food Sovereignty.'],
      ['The study', 'A hydro-agricultural development study for an irrigated perimeter in the communes of Dar El Barka and Ould Birom. I led the soil study from the first satellite image to the client’s report: survey design, field campaigns, laboratory programme, soil classification, land suitability, maps and fertilisation programmes.'],
      ['In figures', 'Four soil-landscape units mapped from Sentinel-2, SI, SAVI and K-means; 85 auger holes, 30 soil pits and 170 samples at 0–30 and 30–60 cm; ten WRB soil types and subtypes; five fertility sectors; suitability classes for irrigation, rice, vegetables and fodder.'],
      ['Results', 'Suitability maps by crop, fertilisation programmes with N, P₂O₅ and K₂O rates and costed fertiliser choices, and the priority measures for developing the land: drainage, controlled leaching and correction of saline-sodic soils. Every step is set out in the case study below.'],
    ],
    outputs: ['Survey plan', 'WRB soil classification', 'Suitability maps by crop', 'Fertility sectors', 'Fertilisation programmes', 'Soil study report and atlas'],
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
    tags: ['Biodiversity', 'Ecosystem services', 'InVEST', 'Climate'],
    blocks: [
      ['Role', 'Principal engineer, field mission lead and ecosystem-services specialist (MVD project, Missions 1 and 2), and co-author of the winning methodology note: a new line of work for the firm, between urban biodiversity, environmental modelling and climate adaptation.'],
      ['Biodiversity survey design', 'Flora and fauna sampling protocols: survey methods, sampling units and site selection by guided random draws. A stratified cluster design based on the city’s ecological and urban fabric, separating four strata of the urban grid and the main habitat types, with 158 survey units across urban and peri-urban land.'],
      ['Field campaigns', 'Leading the field teams, setting the routes between sites to cover the territory on time and on budget, and supervising the inventories of vascular plants and land fauna: birds, mammals, reptiles, amphibians and insects of ecological interest, including pollinators. Quality control of every observation.'],
      ['Landscape ecology', 'Species richness, distribution, rarity and heritage value from the inventory data. Habitat fragmentation measured with landscape metrics (PLAND, NP, PD, LPI, CLUMPY, DIVISION, SPLIT, MESH), and ecological connectivity modelled as landscape graphs to find the core habitats, the existing links and the places where corridors should be strengthened.'],
      ['Ecosystem services', 'Quantifying and mapping the services of urban nature: cooling, air quality, carbon storage, pollination, erosion control and stormwater retention. InVEST 3.4.2 models for carbon storage, pollinator abundance and sediment retention (SDR, based on RUSLE), with satellite and environmental data for heat and air quality, on harmonised 10 m layers.'],
      ['Geodatabase and atlas', 'The project geodatabase, holding inventories, habitats, analysis results and reference layers, and an atlas bringing together the inventories, the fragmentation and connectivity analyses and the mapped ecosystem services.'],
      ['Climate trends', 'Historical records from the Marrakech airport station (1960–2024), completed with WorldClim and satellite data. Comparison of 1960–1990 with 1991–2024 for mean, minimum and maximum temperature and rainfall, with the trends, anomalies and extremes: droughts and heatwaves.'],
      ['Climate projections', 'CMIP6 simulations under IPCC scenarios SSP2-4.5 and SSP5-8.5 for 2050 and 2100, processed as raster layers in Python (GeoPandas, Rasterio), ArcGIS and QGIS, and mapped as projected temperature and rainfall.'],
      ['Water needs of urban ecosystems', 'Water requirements of natural, semi-natural and artificial ecosystems estimated as ETP × Kc − P, from potential evapotranspiration, crop coefficients and rainfall, then projected to 2050 and 2100 under each scenario to gauge future pressure on water.'],
      ['Climate vulnerability', 'A multicriteria assessment of exposure, sensitivity and adaptive capacity: temperature and rainfall trends, drought sensitivity of green spaces, sealed soils, water needs, arid-adapted species, treated wastewater use and irrigation efficiency. Vulnerability = (exposure × sensitivity) − adaptive capacity, scored, mapped and ranked by district to show where to act first.'],
    ],
    outputs: ['Sampling protocols (158 units)', 'Field mission plan', 'Fragmentation and connectivity analysis', 'InVEST ecosystem-service maps', 'Atlas and geodatabase', 'Climate projections 2050 and 2100', 'District vulnerability maps'],
  },
  {
    id: 'green',
    photo: 'marrakech-garden',
    alt: 'A dense urban garden of palms, shrubs and lawn in Marrakech',
    title: 'Urban green-space mapping and categorisation',
    place: 'Marrakech',
    regions: ['marrakech'],
    mix: [5, 70, 25],
    tags: ['GIS', 'Remote sensing', 'Indicators', 'Urban planning'],
    blocks: [
      ['Role', 'GIS specialist, data analyst and spatial geodatabase manager (Missions 1 and 2): data collection, analysis of the green network’s dynamics, characterisation of green spaces and decision-support maps.'],
      ['Field data collection', 'Collection forms built into the Mergin Maps mobile app to outline every green space and record its features. Preparing and training the field teams, the pilot run and daily follow-up of the campaigns, with quality control of the incoming data from the back office.'],
      ['Spatial geodatabase', 'A geographic database of green spaces (polygons), equipment and street furniture (points) and paths and linear infrastructure, carrying legal status, access, condition, irrigation systems, water sources and vegetation layers. Cleaning, harmonising and consistency checks, delivered as Shapefile and Excel.'],
      ['Change over time from Sentinel-2', 'Sentinel-2A and 2B images from 2015, 2018, 2021 and 2024: radiometric corrections, NDVI, reclassification of vegetation cover and multi-date comparison, median and Gaussian filtering, and winter–summer NDVI differences. Maps of where the city greened, where it degraded and where green spaces could be connected.'],
      ['Tree mapping', 'Identifying and mapping individual trees inside green spaces by photo-interpretation of aerial and satellite images, checked with geolocated field surveys and existing inventories, to measure tree density and plant diversity.'],
      ['A typology of green spaces', 'Five categories by ecological, recreational, social, linear, specific and heritage function, defined from tree density, vegetation cover, condition, status and management, equipment, watering systems and water needs, and adjusted with local stakeholders to fit the city’s planning needs.'],
      ['Monitoring indicators', 'Indicators on management and performance, ecology and biodiversity, and climate resilience: green space per inhabitant, access and proximity, degradation, equipment density, vegetation cover, plant diversity (Shannon index), native and invasive species, pollinator abundance, water supply, drip irrigation and carbon sequestration, each calculated and mapped.'],
      ['Landscape Quality Index', 'A composite index across five dimensions (social integration, heritage, ecological quality, resource management, aesthetics), with normalised indicators, weighted dimensions validated with stakeholders, and scores mapped by district.'],
      ['Planning the green network', 'Atlases and maps of distribution, typology, vegetation cover, plant diversity, degraded spaces, indicators and index scores, used to show the gaps between districts, the areas short of accessible green space, the sites to restore first and the ecological corridors to create.'],
      ['Deliverables', 'Geographic databases, atlases, thematic maps and analyses for both missions, kept consistent from the field data to the indicators and the recommendations for managing Marrakech’s green spaces.'],
    ],
    outputs: ['Mergin Maps collection forms', 'Green-space geodatabase', 'NDVI change maps 2015–2024', 'Tree inventory', 'Five-category typology', 'Indicator system', 'Landscape Quality Index', 'Atlases'],
  },
  {
    id: 'padermo',
    photo: 'rif-hills',
    alt: 'Terraced hillsides and scattered villages in mountains in northern Morocco',
    title: 'PADERMO, rural development in the eastern mountains',
    place: 'Oriental region',
    regions: ['oriental'],
    mix: [15, 5, 80],
    tags: ['IFAD SECAP', 'Safeguards', 'Climate adaptation', 'ESCMP'],
    blocks: [
      ['Role', 'Environmental specialist for the Integrated Rural Development Project for the Mountain Areas of the Oriental Region (PADERMO), financed by IFAD.'],
      ['Environment and climate in every component', 'Technical input so that sustainability, natural-resource management and climate adaptation shape every component: resilience measures in the baseline studies, territorial diagnoses and rural development activities, for sustainable farming, water use, soil conservation and biodiversity.'],
      ['Risk screening and categorisation', 'Identifying, analysing and ranking the project’s potential risks and impacts under IFAD’s SECAP 2021 procedures, including the environmental and social screening of a project rated substantial risk, and setting the safeguard requirements and mitigation measures to plan for.'],
      ['Impacts by component', 'Risks of the main investments: small and medium irrigation works, seguias, diversion weirs and water points, rural roads, tree planting, water and soil conservation works and processing units. Pressure on water, soils and biodiversity, fertiliser and pesticide pollution, worksite safety, access to resources, inclusion and conflicts over use.'],
      ['Environmental, Social and Climate Management Plan', 'Preparing the ESCMP to IFAD and national requirements, with its operational matrix linking each activity and area to its risks, mitigation measures, responsible institutions, means of verification and monitoring frequency, proportionate to the level of risk.'],
      ['Mitigation and adaptation measures', 'Recommendations against erosion and runoff, for water and soil conservation, efficient irrigation, drought-adapted tree species, agroecological practices and reasoned use of inputs, covering droughts, floods, heatwaves and land degradation.'],
      ['Regulatory compliance', 'Review of the national legal and institutional framework and the SECAP standards on resource efficiency and pollution, worker and community health and safety, and climate risk, carried into technical documents, tender files, contract clauses and sub-project monitoring.'],
      ['Social risks, gender and grievances', 'Inclusion and participation of beneficiaries, risks of excluding women, young people and vulnerable households, conflicts over natural resources, and review of the consultation and grievance mechanisms.'],
      ['Review of deliverables', 'Critical review of the project’s studies, reports, maps and technical documents on environmental risk, climate adaptation and natural resources, checking their consistency, their recommendations and their compliance with IFAD procedures.'],
      ['Monitoring and evaluation', 'Indicators to track prevention, mitigation and adaptation measures, and the ESCMP monitoring system: responsibilities, means of verification, control frequency and reporting, so that risks, corrective actions and results are documented for supervision.'],
    ],
    outputs: ['Risk screening (SECAP 2021)', 'Impact analysis by component', 'ESCMP and its operational matrix', 'Mitigation and adaptation measures', 'Technical reviews', 'Monitoring indicators'],
  },
  {
    id: 'housing',
    art: '/portfolio/assets/housing-plans-1080.webp',
    alt: 'A drawing of a coastal city, new housing districts, farmland and a mountain range behind',
    title: 'Regional housing plans for three regions',
    place: 'Casablanca-Settat · Béni Mellal-Khénifra · Guelmim-Oued Noun',
    regions: ['casablanca', 'beni-mellal', 'guelmim'],
    mix: [0, 30, 70],
    tags: ['Territorial planning', 'Methodology', 'GIS', 'Stakeholders'],
    blocks: [
      ['Role', 'Author of the Phase I methodology reports of the three Regional Housing Plans (PRH), and a decisive contributor to the winning technical offers: the methodology scored best of all competing bids, and opened a new line of work for the firm in housing and territorial planning.'],
      ['Methodological framework', 'An integrated method running from documents and surveys to the housing market, housing needs and deficit, the census of available land, spatial analysis and the programming of interventions, adapted to each region’s territory and economy.'],
      ['Territorial analysis', 'Data from the 2024 national census, sector statistics, planning documents and regional studies: demographic, socio-economic, residential, urban and land dynamics, environmental factors, territorial disparities, urbanisation, migration and household change.'],
      ['Data quality', 'A method to qualify each source by producer, reference year, scale, precision, format, consistency and limits; data sorted by availability and reliability, with gaps to fill in the field and rules for traceability and harmonisation.'],
      ['Housing diagnosis and needs', 'Methods for the housing stock (type, age, vacancy, condition, insalubrious and dangerous buildings, access to services), the quantitative and qualitative deficit, future needs from population growth and smaller households, and expressed, potential and solvent demand, projected to 2030 and 2035.'],
      ['Stakeholder mapping', 'Institutional, territorial, technical, land, economic, financial and social actors classified with a weighted scoring grid inspired by GIZ practice: influence, interest in the plan, capacity to share data and risk of blocking. Priority matrices and relationship maps found the strategic actors and veto players; in Béni Mellal-Khénifra, 78 stakeholders were mapped and 44 made priorities.'],
      ['Consultation and survey tools', 'Interview guides; questionnaires for households, developers, banks, estate agencies, notaries and adouls; territorial and land census sheets; variables on production, prices, transactions, financing, solvency and preferences; and rules for interviews, focus groups, quality control and confidentiality.'],
      ['GIS architecture', 'The design of the plan’s geographic information system: a data dictionary of layers and attributes (geometry, fields, units, nomenclature, sources), rules for standards, interoperability, consistency checks and metadata, and spatial overlays of housing needs, available land, facilities, networks, planning documents and constraints.'],
      ['Land inventory and screening', 'A step-by-step method to pre-inventory, survey, qualify and rank public and private land reserves, brownfields, gaps and under-used plots; densification potential from allowed versus built capacity; and a multicriteria filter on legal status, planning fit, access, servicing, environmental and technical constraints, cost and capacity.'],
      ['Environmental constraints', 'Topography, natural hazards, pressure on water, geotechnical constraints and incompatible land uses built into the assessment of land and the siting of future housing programmes.'],
      ['Strategy, programming and monitoring', 'A multicriteria method to rank issues and projects (contribution to the deficit, feasibility, social and territorial benefits, urgency) towards a shared vision for 2035 consistent with SRAT, SDAU, PA and PDR plans; SMART objectives, logical frameworks, results matrices, action sheets and a multi-year territorial programme.'],
      ['Risks and deliverables', 'A register of risks to the studies (data access, delays, statistical and spatial inconsistencies, slow validation) with preventive measures, and the three Phase I reports, harmonised between regions and adapted to each.'],
    ],
    outputs: ['Three Phase I methodology reports', 'Stakeholder scoring grid', 'Survey instruments', 'GIS data dictionary', 'Land-screening method', 'Programming and monitoring framework'],
  },
  {
    id: 'nador',
    art: '/portfolio/assets/red-palm-weevil-1080.webp',
    alt: 'A drawing of a date palm in an oasis beside a red palm weevil',
    title: 'Red palm weevil control programme, technical assistance',
    place: 'Nador · Oriental region',
    regions: ['oriental'],
    mix: [30, 65, 5],
    tags: ['Plant health', 'KoboToolbox', 'QField', 'Spatial statistics'],
    blocks: [
      ['Role', 'Project coordinator and GIS and data analyst for the plant protection service of Nador, after contributing to the technical offer and the survey approach that won the contract.'],
      ['Coordination', 'Technical and organisational coordination between the client, the experts and the field survey teams; following progress and helping validate the technical deliverables.'],
      ['Data collection tools', 'A detailed KoboToolbox form for the geolocated inventory of palms and their health: species, location, condition and level of infestation, with field photographs and central follow-up of the data.'],
      ['Geospatial database', 'GIS layers in Shapefile, Geodatabase and GeoPackage, loaded into the QField mobile app to consult, update and follow observations in the field, and organised to work in ArcGIS and QGIS.'],
      ['Data processing', 'Cleaning, consistency checks and harmonisation of attribute and spatial data from the campaigns; a consolidated geographic database delivered as SHP, GDB, GPKG and Excel, and an interactive Leaflet map to explore the results.'],
      ['Spatial and geostatistical analysis', 'Python and QGIS processing to describe where the palms are and how infestation spreads: distribution by commune, species and health status; kernel density estimation (Gaussian kernel) of infested palms; a Bernoulli spatial scan statistic written in Python to detect clusters of infested against healthy palms, tested with 399 to 599 Monte Carlo simulations at p ≤ 0.05; and nearest-neighbour analysis of aggregation.'],
      ['Priority areas', 'Overlaying these results to locate the main outbreaks and rank the sectors that need surveillance and treatment first.'],
      ['Final report', 'A report setting out the collection method, the processing, the statistical, attribute and spatial results and the maps of palms and outbreaks, with operational conclusions to plan and prioritise the control campaign.'],
      ['GIS training', 'Hands-on ArcGIS and QGIS training for the client’s staff: handling, querying, analysing and mapping vector and raster data, so the team can keep the databases up to date on its own.'],
    ],
    outputs: ['KoboToolbox inventory form', 'QField project', 'Geodatabase (SHP, GDB, GPKG)', 'Leaflet web map', 'Outbreak cluster analysis', 'Final report', 'GIS training'],
  },
  {
    id: 'srl-marrakech',
    photo: 'coast-marrakech-safi',
    alt: 'A rocky Atlantic coastline with a sandy beach and white buildings on the shore',
    title: 'Regional coastal scheme of Marrakech-Safi',
    place: 'Marrakech-Safi · Safi and Essaouira coast',
    regions: ['marrakech'],
    mix: [10, 25, 65],
    tags: ['Coastal planning', 'Territorial diagnosis', 'DPSIR', 'GIS'],
    blocks: [
      ['Role', 'Analyst and co-author of the Mission I diagnosis of the Regional Coastal Scheme (SRL), after contributing to the technical and methodological offer that won the contract.'],
      ['Regional profile', 'The region’s administration, geography, economy and natural and cultural assets, and the links between the inland region and the coastal provinces of Safi and Essaouira: economy, resource flows, infrastructure and land use.'],
      ['Physical environment', 'Relief, geomorphology, geology, soils, water resources and climate; the main natural units and their interaction with the Atlantic coast; physical constraints, pressure on water, erosion, degradation and climate vulnerability.'],
      ['Socio-economic data', 'Data from the HCP, sector administrations, public bodies, plans and studies, checked and built into indicators of economic activity, production, infrastructure, investment and territorial dynamics, with statistical tables and comparisons.'],
      ['Primary sector', 'Sea fishing, aquaculture, agriculture, livestock, mining and quarrying: capacity, distribution and economic weight; the fishing activity of the ports of Safi and Essaouira, aquaculture projects and farming systems, and the pressure on fish stocks, water, soils and coastal habitats.'],
      ['Industry, energy and crafts', 'Chemical and phosphate industries, food processing, extraction and manufacturing, crafts and energy infrastructure; their location, projects and investments, and their effects on water and energy use, air emissions, effluents, waste, land and the coast.'],
      ['Tertiary sector and infrastructure', 'Tourism, trade, transport and logistics; ports, roads, railways and airports; traffic, visitor and investment data; and the risks of coastal artificialisation, pollution, resource use and exposure of infrastructure to natural and climate hazards.'],
      ['Environmental services and green economy', 'Solid waste, sanitation and green-economy initiatives in Safi and Essaouira: infrastructure, management and projects, the risks from effluents and waste, and the prospects for waste recovery, treated wastewater reuse, desalination, renewable energy and circular economy.'],
      ['Pressures on the coast', 'The pressure each activity puts on resources and coastal ecosystems, set out in sector matrices linking activities, sources of pressure, impacts and management issues, to feed an integrated DPSIR analysis (drivers, pressures, state, impacts, responses).'],
      ['Development projects', 'Public and private projects and investments in production, ports and transport, industry, energy, tourism, environmental facilities and natural resources, and the pressures they may bring.'],
      ['Maps', 'GIS layers on the physical environment, resources, land use, farmland, fishing infrastructure, extraction, energy, tourist sites and transport, used to show where activities concentrate and where economic uses meet sensitive environments.'],
      ['Strategic diagnosis', 'Writing the technical sections of the Mission I report with indicators, projects and pressures by sector; synthesis tables including a SWOT of coastal agriculture and the sector pressure matrices; and the priority issues for integrated coastal management.'],
    ],
    outputs: ['Mission I diagnosis report', 'Sector diagnoses', 'Statistical tables', 'Pressure matrices (DPSIR)', 'SWOT of coastal agriculture', 'Thematic maps'],
  },
  {
    id: 'srl-guelmim',
    photo: 'coast-guelmim',
    alt: 'Red cliffs above a long sandy beach and Atlantic surf',
    title: 'Regional coastal scheme of Guelmim-Oued Noun',
    place: 'Guelmim-Oued Noun',
    regions: ['guelmim'],
    mix: [0, 60, 40],
    tags: ['Coastal planning', 'Quality control', 'GIS', 'Data analysis'],
    blocks: [
      ['Role', 'Technical coordination, data analysis and quality control for the Regional Coastal Scheme (SRL) of Guelmim-Oued Noun.'],
      ['Project coordination', 'Following the study’s progress, with critical review, correction and quality control of the technical deliverables.'],
      ['Analysis and mapping', 'Territorial, socio-economic and environmental data analysis, GIS processing, spatial analysis and map production.'],
      ['Client comments and final reports', 'Processing and integrating the client’s comments, consolidating and finalising the technical reports, and preparing the final deliverables.'],
      ['Final geodatabase', 'Structuring, harmonising and organising the final geodatabase so that the data and maps handed to the client are consistent, reliable and usable.'],
    ],
    outputs: ['Reviewed and corrected deliverables', 'Spatial analyses', 'Thematic maps', 'Final reports', 'Final geodatabase'],
  },
  {
    id: 'srl-laayoune',
    photo: 'coast-laayoune',
    alt: 'A coastal lagoon with sand banks and green salt marsh between dunes and the ocean',
    title: 'Regional coastal scheme of Laâyoune-Sakia El Hamra',
    place: 'Laâyoune-Sakia El Hamra',
    regions: ['laayoune'],
    mix: [0, 50, 50],
    tags: ['Coastal planning', 'Quality control', 'GIS', 'Data analysis'],
    blocks: [
      ['Role', 'Technical coordination, data analysis and quality control for the Regional Coastal Scheme (SRL) of Laâyoune-Sakia El Hamra.'],
      ['Project coordination', 'Following the study’s progress, with critical review, correction and quality control of the technical deliverables.'],
      ['Analysis and mapping', 'Territorial, socio-economic and environmental data analysis, GIS processing, spatial analysis and map production.'],
      ['Client comments and final reports', 'Processing and integrating the client’s comments, consolidating and finalising the technical reports, and preparing the final deliverables.'],
      ['Final geodatabase', 'Structuring, harmonising and organising the final geodatabase so that the data and maps handed to the client are consistent, reliable and usable.'],
    ],
    outputs: ['Reviewed and corrected deliverables', 'Spatial analyses', 'Thematic maps', 'Final reports', 'Final geodatabase'],
  },
  {
    id: 'ait-hatem',
    photo: 'forest-ait-hatem',
    wide: 819,
    alt: 'The trunk of an old cork oak beside a forest track',
    title: 'Aït Hatem forest management plan',
    place: 'Aït Hatem forest · Béni Mellal-Khénifra',
    regions: ['beni-mellal'],
    mix: [25, 50, 25],
    tags: ['Forests', 'Geodatabase', 'MS Access'],
    blocks: [
      ['Role', 'Technical coordination and data management for the management plan of the Aït Hatem forest.'],
      ['Coordination and quality control', 'Following the study’s progress, checking compliance and controlling the quality of the final deliverables.'],
      ['Synthesis documents', 'Writing the synthesis documents of the study.'],
      ['Geodatabase and maps', 'Consolidating and structuring the final geodatabase, and producing and finalising the thematic maps.'],
      ['Relational database', 'Designing and building a Microsoft Access relational database to centralise, organise and manage the project’s technical and spatial data.'],
    ],
    outputs: ['Synthesis documents', 'Final geodatabase', 'Thematic maps', 'MS Access database'],
  },
  {
    id: 'ain-abelioun',
    photo: 'forest-ain-abelioun',
    wide: 819,
    alt: 'A dirt track running through an open oak and pine forest',
    title: 'Aïn Abelioun forest management plan',
    place: 'Aïn Abelioun forest · Béni Mellal-Khénifra',
    regions: ['beni-mellal'],
    mix: [15, 60, 25],
    tags: ['Forests', 'Geodatabase', 'MS Access'],
    blocks: [
      ['Role', 'Technical coordination and data management for the management plan of the Aïn Abelioun forest.'],
      ['Coordination and quality control', 'Following the study’s progress, checking compliance and controlling the quality of the final deliverables.'],
      ['Synthesis documents', 'Writing the synthesis documents of the study.'],
      ['Geodatabase and maps', 'Consolidating and structuring the final geodatabase, and producing and finalising the thematic maps.'],
      ['Relational database', 'Designing and building a Microsoft Access relational database to centralise, organise and manage the project’s technical and spatial data.'],
    ],
    outputs: ['Synthesis documents', 'Final geodatabase', 'Thematic maps', 'MS Access database'],
  },
  {
    id: 'green-belt',
    photo: 'forest-green-belt',
    wide: 819,
    alt: 'A young tree and undergrowth under tall pines along a forest track',
    title: 'Rabat’s green belt and forest development',
    place: 'Rabat green belt · Rabat-Salé-Kénitra',
    regions: ['rabat'],
    mix: [20, 40, 40],
    tags: ['Forests', 'Geodatabase', 'MS Access', '3D model'],
    blocks: [
      ['Role', 'Technical coordination and data management for the forest development project of Rabat’s green belt.'],
      ['Coordination and quality control', 'Following the study’s progress, checking compliance and controlling the quality of the final deliverables.'],
      ['Synthesis documents', 'Writing the synthesis documents of the study.'],
      ['Geodatabase and maps', 'Consolidating and structuring the final geodatabase, and producing and finalising the thematic maps.'],
      ['Relational database', 'Designing and building a Microsoft Access relational database to centralise, organise and manage the project’s technical and spatial data.'],
      ['3D model', 'A 3D model to visualise the proposed forest works and present the results of the study.'],
    ],
    outputs: ['Synthesis documents', 'Final geodatabase', 'Thematic maps', 'MS Access database', '3D model'],
  },
  {
    id: 'zat',
    photo: 'atlas-terraces',
    alt: 'Green terraced fields on a valley slope in the High Atlas',
    title: 'Zat watershed development plan',
    place: 'Zat valley · Marrakech-Safi',
    regions: ['marrakech'],
    mix: [20, 20, 60],
    tags: ['Watershed', 'Coordination', 'Planning'],
    blocks: [
      ['Role', 'Technical coordination of the Zat watershed development project.'],
      ['Following the studies', 'Tracking the progress of the studies and keeping the work consistent from one expert to the next.'],
      ['Planning and organisation', 'Planning and organising the project’s activities and coordinating the experts involved.'],
      ['Operational support', 'Supporting the day-to-day management of the project so that deadlines were met and each mission was carried out as planned.'],
    ],
    outputs: ['Activity planning', 'Expert coordination', 'Progress follow-up'],
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
      { name: 'Power BI', logo: 'powerbi', use: 'Interactive reports and indicator dashboards' },
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

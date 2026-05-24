// Internal article data for the USDA Soil Texture Triangle website.
//
// How to edit articles:
// - Edit `title` to change the article page H1 and card title.
// - Edit `excerpt` to change the short text shown on article lists and homepage cards.
// - Edit `sections` to update the article body. Each section supports:
//   - heading: section heading
//   - paragraphs: array of paragraph strings
//   - bullets: optional array of bullet strings
// - To add a new article, copy one object, give it a unique `slug`, and add it to this array.

const sharedKeywords =
  "USDA soil texture triangle, soil texture class, sand silt clay, soil classification, pedology, agronomy, irrigation, drainage, and water retention";

const articleDefinitions = [
  ["sand", "Sand", "Sand soils are coarse-textured soils with high drainage and low water retention."],
  ["loamy-sand", "Loamy Sand", "Loamy sand combines dominant sand with enough finer material to slightly improve water retention."],
  ["sandy-loam", "Sandy Loam", "Sandy loam is a common agricultural texture class with good drainage and moderate water holding capacity."],
  ["loam", "Loam", "Loam is a balanced USDA soil texture class valued in agronomy for workable structure and moisture storage."],
  ["silt-loam", "Silt Loam", "Silt loam contains a high share of silt and is important for irrigation, drainage, and soil fertility studies."],
  ["silt", "Silt", "Silt soils are very fine-textured mineral soils that can hold water but may be sensitive to compaction."],
  ["sandy-clay-loam", "Sandy Clay Loam", "Sandy clay loam mixes sand with enough clay to influence structure, infiltration, and water retention."],
  ["clay-loam", "Clay Loam", "Clay loam is a moderately fine USDA soil texture class often studied for drainage and cultivation behavior."],
  ["silty-clay-loam", "Silty Clay Loam", "Silty clay loam combines silt and clay, creating important implications for pedology and irrigation planning."],
  ["sandy-clay", "Sandy Clay", "Sandy clay has high clay content with substantial sand, affecting infiltration, shrink-swell behavior, and drainage."],
  ["silty-clay", "Silty Clay", "Silty clay is a fine-textured soil class with high water retention and slow drainage potential."],
  ["clay", "Clay", "Clay soils have high clay content, strong water retention, and distinctive management needs in soil analysis."],
];

export const articles = articleDefinitions.map(([slug, textureClass, excerpt]) => ({
  slug,
  title: `${textureClass} Soil Texture Class: USDA Triangle Guide`,
  textureClass,
  excerpt,
  date: "2026-05-11",
  readingTime: "3 min read",
  sections: [
    {
      heading: "Coming soon",
      paragraphs: [
        `${textureClass} is one of the 12 standard USDA soil texture classes used with the USDA soil texture triangle. This draft article will explain how the class is identified from sand, silt, and clay percentages and how it relates to soil classification.`,
        `Future updates will cover ${textureClass.toLowerCase()} behavior in pedology, agronomy, irrigation planning, drainage assessment, and water retention studies. Keywords for this page include ${sharedKeywords}.`,
      ],
    },
    {
      heading: "What this article will cover",
      paragraphs: [
        "This placeholder is ready to be expanded into a full practical guide for interpreting laboratory or field texture data.",
      ],
      bullets: [
        "Typical sand, silt, and clay percentage ranges.",
        "How the class appears on the USDA soil texture triangle.",
        "Common management implications for irrigation, drainage, and soil analysis.",
      ],
    },
  ],
}));

const sandArticle = articles.find((article) => article.slug === "sand");

if (sandArticle) {
  Object.assign(sandArticle, {
    title: "The Sand Textural Class: USDA Triangle Guide",
    excerpt:
      "A detailed guide to the sand textural class, including USDA classification limits, hydraulic behavior, mineralogy, geotechnical risks, irrigation, drainage, and agronomic management.",
    readingTime: "18 min read",
    feature: {
      label: "USDA Soil Texture Triangle ? Scientific Analysis",
      subtitle:
        "Mineralogy, hydraulics, geotechnics, and precision agronomic management of coarse-textured soils.",
      meta: [
        "Sand content > 85%",
        "Clay < 10%",
        "Particle size 0.05-2.0 mm",
        "CEC < 5 meq/100g",
      ],
      html: `
<!-- 1. INTRODUCTION -->
  <div class="section">
    <p class="section-label">Introduction</p>
    <h2>The Foundation of Soil Science</h2>
    <p>In pedology, agronomy, geotechnical engineering, and environmental hydrology, soil texture acts as the foundational master variable. It dictates the fundamental physical architecture, chemical reactivity, and biological carrying capacity of the soil. The United States Department of Agriculture (USDA) formalized this through its <strong>Soil Texture Triangle</strong> — a geometric tool that classifies the infinite spectrum of particle mixtures into twelve distinct functional classes.</p>
    <p>Occupying the lower-left vertex of the triangle, <strong>Sandy soils</strong> represent the extreme end of coarse-textured materials. Dominated by large, inert mineral particles, these soils possess a unique suite of physicochemical properties: exceptional drainage speed, critically low water-holding capacity, near-zero cation exchange, and loose mechanical structure. These traits are both their primary asset and their greatest agronomic challenge.</p>

    <div class="fact-grid">
      <div class="fact-card">
        <span class="fact-value">&gt;63</span>
        <span class="fact-label">cm/hr K<sub>sat</sub> (pure sand)</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">6 cm</span>
        <span class="fact-label">Plant-avail. water / meter depth</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">1.65</span>
        <span class="fact-label">g/cm³ typical bulk density</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">~0 kPa</span>
        <span class="fact-label">Effective cohesion (c')</span>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Classification</span></div>

  <!-- 2. CLASSIFICATION -->
  <div class="section">
    <p class="section-label">Taxonomic Boundaries</p>
    <h2>Mathematical Definition of the Sand Class</h2>
    <p>The USDA classification system is not merely descriptive — it is defined by strict mathematical inequalities that account for the disproportionate structural influence of clay relative to silt.</p>

    <div class="formula-box">
      <p class="formula-title">USDA "Sands" Group — Primary Classification Criteria</p>
      <div class="formula">
        Sand % &gt; 85<br>
        Silt % + (1.5 × Clay %) &lt; 15
      </div>
      <p class="formula-note">Clay is weighted by 1.5× because even trace amounts create inter-particle cohesion that fundamentally alters soil behavior.</p>
    </div>

    <p>The three primary coarse-textured groups — <strong>Sands</strong>, <strong>Loamy Sands</strong>, and <strong>Sandy Loams</strong> — form a continuum of increasing fine particle content, each with distinct hydraulic and structural identities.</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Group</th>
            <th>Sand %</th>
            <th>Defining Formula</th>
            <th>Hydraulic behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="highlight">Sands</td>
            <td>&gt; 85</td>
            <td>Silt + 1.5×Clay &lt; 15</td>
            <td>Negligible cohesion; maximum drainage</td>
          </tr>
          <tr>
            <td class="highlight">Loamy Sands</td>
            <td>70–90</td>
            <td>Silt + 1.5×Clay ≥ 15 and Silt + 2×Clay &lt; 30</td>
            <td>Slight cohesion; marginally better retention</td>
          </tr>
          <tr>
            <td class="highlight">Sandy Loams</td>
            <td>43–85</td>
            <td>Clay 7–20%, Sand &gt; 52%, Silt + 2×Clay ≥ 30</td>
            <td>Moderate drainage; improved structure</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>Particle Size Grades</h3>
    <p>The total sand fraction spans 0.05–2.0 mm — a 40-fold diameter range that encompasses radically different physical behaviors. The USDA subdivides this into five grades with practical agronomic and hydrological significance.</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Grade</th><th>USDA diameter (mm)</th><th>Behavioral note</th></tr>
        </thead>
        <tbody>
          <tr><td class="highlight">Very Coarse Sand</td><td>1.00–2.00</td><td>Maximum drainage; negligible capillarity</td></tr>
          <tr><td class="highlight">Coarse Sand</td><td>0.50–1.00</td><td>Very high K<sub>sat</sub>; easily eroded by wind</td></tr>
          <tr><td class="highlight">Medium Sand</td><td>0.25–0.50</td><td>Typical beach/dune material</td></tr>
          <tr><td class="highlight">Fine Sand</td><td>0.10–0.25</td><td>Transitional; moderate capillary rise</td></tr>
          <tr><td class="highlight">Very Fine Sand</td><td>0.05–0.10</td><td>Behaves close to coarse silt; crusting risk</td></tr>
        </tbody>
      </table>
    </div>

    <div class="pull-quote">
      <p>"Very fine sand is hydraulically closer to coarse silt than to coarse sand — it generates measurable capillary rise, promotes surface crusting, and drains orders of magnitude more slowly than the 1.5 mm grains that share the same textural class."</p>
    </div>
  </div>

  <div class="divider-ornament"><span>Mineralogy</span></div>

  <!-- 3. MINERALOGY -->
  <div class="section">
    <p class="section-label">Chemical Architecture</p>
    <h2>Why Sand is Chemically Inert</h2>
    <p>Sandy soils are overwhelmingly dominated by <strong>quartz (SiO₂)</strong> and, to a lesser extent, plagioclase and potassium feldspars. These primary tectosilicate minerals share a critical structural characteristic: a three-dimensional, covalently bonded crystalline lattice with virtually no isomorphic substitution.</p>
    <p><strong>Isomorphic substitution</strong> — the replacement of a higher-valence cation (Si⁴⁺) by a lower-valence one (Al³⁺) during mineral formation — is the primary mechanism generating permanent negative electrical charge in soil. Phyllosilicate clay minerals (smectite, illite) are built on sheet structures rich in this substitution. Quartz is not. This single mineralogical fact explains the low CEC and near-zero nutrient retention of sandy soils.</p>

    <div class="fact-grid">
      <div class="fact-card">
        <span class="fact-value">0.01–0.1</span>
        <span class="fact-label">m²/g — specific surface area of sand</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">800</span>
        <span class="fact-label">m²/g — max surface area of reactive clays</span>
      </div>
    </div>

    <p>With specific surface area up to 10,000× lower than reactive clays, sandy soils act primarily as a <em>physical skeleton</em> — providing structure and aeration but contributing almost nothing to chemical nutrient cycling. In practice, the trace presence of fine silts and residual clay minerals handles nearly all of the soil's naturally occurring cation exchange capacity.</p>

    <div class="alert alert-info">
      <span class="alert-icon">ℹ</span>
      <div>
        <p class="alert-title">pH Buffering in Sandy Profiles</p>
        <p>Weathering of plagioclase and feldspar can provide minor, localized pH-buffering by releasing alkaline earth metals. However, the low overall buffering capacity means pH can fluctuate rapidly and dangerously under acidic rainfall or heavy ammonium-based fertilizer applications — necessitating careful liming management.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Hydraulics</span></div>

  <!-- 4. HYDRAULICS -->
  <div class="section">
    <p class="section-label">Water Physics</p>
    <h2>Hydraulic Architecture and Water Retention</h2>

    <h3>The Bulk Density Paradox</h3>
    <p>Contrary to intuition, the loose appearance of sandy soils conceals a relatively <em>high</em> bulk density compared to structured clay soils. Sand grains pack rigidly against one another without forming secondary micro-aggregates; clay particles, by contrast, use electrostatic forces and organic matter to create bridge-like aggregate structures full of internal void space. The result:</p>
    <ul style="list-style: none; padding: 0; margin: 1rem 0 1.25rem;">
      <li style="padding: 0.4rem 0 0.4rem 1.5rem; position: relative; border-bottom: 1px solid var(--border);"><span style="position:absolute;left:0;color:var(--sand-dark);">→</span> <strong>Sandy soil</strong> bulk density: 1.40–1.65 g/cm³</li>
      <li style="padding: 0.4rem 0 0.4rem 1.5rem; position: relative;"><span style="position:absolute;left:0;color:var(--sand-dark);">→</span> <strong>Clay loam</strong> bulk density: 1.10–1.30 g/cm³</li>
    </ul>
    <p>While total porosity in sandy soils is only 35–45%, the pore size distribution is dominated by <strong>macropores</strong> (&gt;0.08 mm). These large, interconnected voids offer virtually no capillary resistance, enabling gravity-driven drainage to happen nearly instantaneously.</p>

    <h3>Available Water Capacity — The Critical Deficit</h3>
    <p>The agronomically critical parameter is <strong>Total Available Water (TAW)</strong> — water held between Field Capacity (~−33 kPa) and the Permanent Wilting Point (−1500 kPa). Because macropores cannot generate sufficient capillary tension to hold water against gravity, sandy soils drain to a very low field capacity.</p>

    <!-- Visual water bars -->
    <div class="water-bar-group">
      <p style="font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.75rem;">Volumetric water content by soil class</p>
      <div class="water-bar-row">
        <span class="wbr-label">Sand</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:46%"></div>
          <div class="wbr-fc"  style="width:4%"></div>
          <div class="wbr-pwp" style="width:5%"></div>
        </div>
        <span class="wbr-val">6 cm/m</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label">Loamy Sand</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:46%"></div>
          <div class="wbr-fc"  style="width:5%"></div>
          <div class="wbr-pwp" style="width:6%"></div>
        </div>
        <span class="wbr-val">~8 cm/m</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label">Sandy Loam</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:45%"></div>
          <div class="wbr-fc"  style="width:11%"></div>
          <div class="wbr-pwp" style="width:7%"></div>
        </div>
        <span class="wbr-val">~10 cm/m</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label">Silt Loam</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:48%"></div>
          <div class="wbr-fc"  style="width:20%"></div>
          <div class="wbr-pwp" style="width:9%"></div>
        </div>
        <span class="wbr-val">25 cm/m</span>
      </div>
      <div class="legend-row">
        <span class="legend-item"><span class="legend-dot" style="background:#7BA7C2"></span> Gravitational drainage loss</span>
        <span class="legend-item"><span class="legend-dot" style="background:#4A8C6A"></span> Plant-available (FC)</span>
        <span class="legend-item"><span class="legend-dot" style="background:#C07A3A"></span> Held at PWP</span>
      </div>
    </div>

    <p>A pure sand yields as little as <strong>6 cm of plant-available water per meter of soil depth</strong> — roughly 4× less than a silt loam. This extremely narrow availability window leaves vegetation growing in sandy soils acutely vulnerable to rapid-onset drought stress during peak evapotranspiration periods.</p>

    <div class="alert alert-danger">
      <span class="alert-icon">⚠</span>
      <div>
        <p class="alert-title">Drought Stress Risk</p>
        <p>Under high atmospheric evapotranspiration, a crop growing in pure sand can exhaust all plant-available water within 24–48 hours of the last irrigation event — orders of magnitude faster than in loam or clay-loam soils.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Geotechnics</span></div>

  <!-- 5. GEOTECHNICAL -->
  <div class="section">
    <p class="section-label">Engineering Mechanics</p>
    <h2>Geotechnical Behavior and Engineering Hazards</h2>
    <p>In soil mechanics, sands are classified as <strong>cohesionless, granular materials</strong>. Their shear strength relies almost entirely on the physical interlocking and frictional resistance between individual rigid mineral grains, quantified by the <strong>effective angle of internal friction (φ')</strong>.</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Soil description</th><th>φ' peak (°)</th><th>c' effective cohesion (kPa)</th></tr>
        </thead>
        <tbody>
          <tr><td class="highlight">Sand, uniform fine-grained</td><td>32</td><td>0.0</td></tr>
          <tr><td class="highlight">Sand, uniform coarse-grained</td><td>34</td><td>0.0</td></tr>
          <tr><td class="highlight">Sand, well-graded</td><td>33</td><td>0.0</td></tr>
          <tr><td>Gravel/Sand mix with fines</td><td>28</td><td>3.0</td></tr>
          <tr><td>Silt, low plasticity</td><td>28</td><td>2.0</td></tr>
          <tr><td>Clay, low plasticity</td><td>24</td><td>6.0</td></tr>
        </tbody>
      </table>
    </div>

    <h3>The Silty Sand Trap</h3>
    <p>When field conditions present sandy soils mixed with notable proportions of non-plastic silt, the fines act as a <em>micro-lubricant</em> between the coarse grains, dismantling the interlocking mechanism and drastically depressing φ'. Standard correlation charts used to estimate φ' from SPT/CPT blow counts were historically calibrated on <strong>clean sands with less than 5% fines</strong>.</p>
    <p>If a geotechnical engineer designs a deep concrete foundation assuming clean-sand φ' values in a silty sand matrix, the actual pile-soil interface friction will be substantially lower — leading to dangerous underestimation of required pile lengths and catastrophic load-test failures. At extremely high moisture contents, the φ' of a sandy loam can plummet to as low as <strong>17°</strong>, rendering the deposit highly unstable under shear stress.</p>

    <div class="alert alert-danger">
      <span class="alert-icon">⚠</span>
      <div>
        <p class="alert-title">Foundation Design Risk</p>
        <p>Confusing silty sand with clean sand in pile foundation design is a documented cause of structural failures in alluvial plains and coastal regions. Site-specific particle size analysis is mandatory — never assume clean-sand friction parameters in fine-contaminated profiles.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Agronomy</span></div>

  <!-- 6. AGRONOMY -->
  <div class="section">
    <p class="section-label">Agronomic Management</p>
    <h2>Precision Strategies for Coarse-Textured Profiles</h2>
    <p>Standard agronomic practices developed for loams and clays often fail catastrophically when applied to sandy soils. The combination of low TAW, depressed CEC, and extreme K<sub>sat</sub> demands a fundamentally different management philosophy — one built around <em>precision, frequency, and engineering</em>.</p>

    <div class="mgmt-grid">
      <div class="mgmt-card">
        <div class="mgmt-header irrigation">Irrigation</div>
        <div class="mgmt-body">
          <ul>
            <li>Drip/micro-irrigation is the gold standard — applies low-volume water continuously to root zone</li>
            <li>Short, frequent pulses prevent deep percolation losses below the root zone</li>
            <li>Tighter emitter spacing required: lateral capillary wicking is minimal in sand</li>
            <li>Allow 60% deficit in vegetative stage; tighten to 30–40% at flowering and pollination</li>
          </ul>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-header nutrients">Nutrient Management</div>
        <div class="mgmt-body">
          <ul>
            <li>Single basal N applications are catastrophic — one rainfall event flushes N below root zone</li>
            <li>Split into ≥3 equal doses aligned with crop uptake curve (fertigation)</li>
            <li>Use nitrification inhibitors (DCD, nitrapyrin) to delay ammonium→nitrate conversion</li>
            <li>Zero N carryover year-to-year; all nutrients must be utilized immediately</li>
          </ul>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-header amendments">Soil Amendments</div>
        <div class="mgmt-body">
          <ul>
            <li>Hardwood biochar reduces bulk density up to 9% and increases water retention by 23%</li>
            <li>Biochar's internal porous architecture creates artificial CEC sites within the quartz matrix</li>
            <li>Regular organic matter additions support soil microbiome and transient CEC</li>
            <li>Bridging effect: transforms sand toward loam-like colloidal functionality</li>
          </ul>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-header crops">Crop Selection</div>
        <div class="mgmt-body">
          <ul>
            <li>Root vegetables (carrots, potatoes, beets) thrive — no compaction forking</li>
            <li>Watermelons, arid-adapted legumes, and deep-rooted perennials perform well</li>
            <li>Blueberries suited to acidic sandy profiles</li>
            <li>Ground cover intercropping (strawberries) anchors erodible surfaces</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="pull-quote">
      <p>"Successful management of sandy soils requires a complete departure from traditional agronomy — replacing single large applications of water and fertilizer with precision, high-frequency micro-doses engineered to match the soil's extreme transmissivity."</p>
    </div>
  </div>

  <div class="divider-ornament"><span>Environment</span></div>

  <!-- 7. ENVIRONMENTAL -->
  <div class="section">
    <p class="section-label">Environmental Fate</p>
    <h2>Contaminant Leaching and Ecological Risks</h2>
    <p>The same extreme hydraulic conductivity that makes sandy soils agronomically challenging also designates them as <strong>high-velocity conduits for groundwater contamination</strong>. Both nitrogen fertilizers and synthetic pesticides face virtually no retarding mechanisms in sandy profiles.</p>

    <h3>Nitrate Leaching</h3>
    <p>Surplus agricultural nitrate (NO₃⁻) behaves as a conservative tracer in sandy soil: it remains highly soluble and has no anionic exchange capacity to retard its downward movement. Every irrigation or rainfall event that exceeds the crop's immediate uptake flushes nitrate below the root zone. This is a dominant contributor to municipal groundwater contamination and downstream hypoxic eutrophication in rivers and coastal zones.</p>

    <h3>Pesticide Persistence Paradox</h3>
    <p>In sandy soils, the usual microbial degradation pathway for pesticides is severely compromised. The low specific heat capacity of dry quartz causes the topsoil to rapidly desiccate and overheat under solar radiation — conditions under which microbial metabolism <em>stalls entirely</em>. The result: highly concentrated, undegraded pesticides accumulate in the dry surface horizon, perfectly positioned to be flushed at high concentrations into groundwater during the next significant rainfall event.</p>

    <div class="alert alert-danger">
      <span class="alert-icon">⚠</span>
      <div>
        <p class="alert-title">Regulatory Threshold Violation Risk</p>
        <p>The European legal standard limits pesticide concentrations in groundwater to a maximum of 0.1 µg/L. This threshold is routinely and easily exceeded under coarse-textured agricultural scenarios, particularly when heavy precipitation follows chemical application.</p>
      </div>
    </div>

    <h3>Thermal Properties and Surface Temperature Extremes</h3>
    <p>Quartz has an intrinsically high thermal conductivity (8.8 W·m⁻¹·°C⁻¹ vs. 3.0 for clay minerals), but dry macropores act as powerful insulators. As a result, the thermal behavior of sandy soil is dominated by its moisture state: thermal conductivity of a sandy loam can increase nearly 4-fold from dry (0.37 mcal/s·cm·°C) to saturated (1.42 mcal/s·cm·°C) conditions. Sandy surfaces experiencing rapid desiccation therefore swing between extreme midday heat and rapid nighttime cooling — a significant microclimate stress for shallow root systems.</p>

    <div class="alert alert-success">
      <span class="alert-icon">✓</span>
      <div>
        <p class="alert-title">Thermal Advantage: Early Season Warming</p>
        <p>The same low specific heat capacity that creates summer thermal stress enables sandy soils to warm significantly faster than clays in spring — an agronomic advantage for early crop germination and extended growing seasons in temperate regions.</p>
      </div>
    </div>
  </div>

  <hr class="divider">

  <!-- CONCLUSION -->
  <div class="section">
    <p class="section-label">Synthesis</p>
    <h2>Managing Sand as an Engineered System</h2>
    <p>The sand textural class represents a fundamental convergence of physical dominance and electrochemical inertness. Driven by a mineralogical assemblage of quartz and weathering-resistant feldspars, coarse-textured soils lack the surface area and isomorphic substitution required to retain either moisture or nutrients. Their macropore-dominated architecture produces paradoxically high bulk density, low total porosity, and extreme hydraulic conductivity.</p>
    <p>These characteristics create a cascade of implications: acute plant drought stress within hours of irrigation, dangerous geotechnical friction loss when contaminated with silt fines, and severe vulnerability to nitrate and pesticide leaching into underlying aquifers. Yet these same properties create a loose, non-restrictive environment ideal for root crop development, efficient mechanical tillage, and rapid early-season soil warming.</p>
    <p>Sustainable production on sandy profiles demands a complete departure from conventional agronomy toward a precision-engineering model: high-frequency drip irrigation, split fertigation synchronized to crop uptake kinetics, nitrification inhibitors to extend nitrogen residence time, and long-term structural rehabilitation through high-surface-area amendments like hardwood biochar. In essence, the agronomist's task is to artificially synthesize — through management — the colloidal functionality that geological weathering omitted.</p>
  </div>

<footer class="feature-footer"><strong>USDA Sand Soil Texture Class — Scientific Analysis</strong><br><br>
  Based on USDA Soil Survey Manual (2017), KSSL Methods Manual (SSIR No. 42),<br>
  and peer-reviewed literature in pedology, agronomy, and geotechnical engineering.</footer>
      `,
    },
  });
}

const loamySandArticle = articles.find((article) => article.slug === "loamy-sand");

if (loamySandArticle) {
  Object.assign(loamySandArticle, {
    title: "The Loamy Sand Textural Class: USDA Triangle Guide",
    excerpt:
      "A complete guide to the loamy sand textural class, including USDA boundary rules, hydraulic behavior, nutrient retention, irrigation strategy, and environmental management.",
    readingTime: "20 min read",
    feature: {
      label: "USDA Soil Texture Triangle ? Scientific Analysis",
      subtitle:
        "The transitional coarse-textured class between pure sand and sandy loam, with practical implications for water, nutrients, and management.",
      meta: [
        "Sand content 70-90%",
        "Clay usually < 15%",
        "Silt + 2 x clay < 30",
        "Low water retention",
      ],
      html: `
<!-- 1. INTRODUCTION -->
  <div class="section">
    <p class="section-label">Introduction</p>
    <h2>The Critical Transitional Niche</h2>
    <p>Among the twelve textural classes defined by the USDA Soil Texture Triangle, <strong>loamy sand</strong> occupies a uniquely paradoxical position. It sits at the threshold between the structureless inertness of pure sand and the marginally more cohesive character of sandy loams, inheriting the weaknesses of both while possessing the full strengths of neither. Defined by a dominant quartz sand matrix (70–90%) laced with just enough silt and clay to provide a ghost of cohesion, it is a soil class governed by a cascade of physical paradoxes.</p>
    <p>It drains too rapidly to sustain crops without engineering, yet is too coarse to support the chemical retention that would make fertilization efficient. It resists water erosion almost completely, yet is catastrophically vulnerable to wind. It warms fast in spring, enabling early harvests, yet cannot buffer heat during summer. Understanding these contradictions — and their precise physical causes — is the foundation of any successful management strategy on this globally widespread class.</p>

    <div class="fact-grid">
      <div class="fact-card">
        <span class="fact-value">1–5</span>
        <span class="fact-label">meq/100g — CEC range</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">17%</span>
        <span class="fact-label">Total available water by vol.</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">134</span>
        <span class="fact-label">t/ac/yr Wind Erodibility Index</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">WEG 2</span>
        <span class="fact-label">Wind Erodibility Group (USDA)</span>
      </div>
    </div>

    <!-- Spectrum bar -->
    <div class="spectrum">
      <div class="spectrum-header">Position within the coarse-textured soil continuum</div>
      <div class="spectrum-body">
        <div class="spectrum-track">
          <div class="spectrum-marker" style="left:12%">
            <div class="marker-dot" style="background:#E8D9A8;border-color:#8B7440"></div>
            <span class="marker-label">Pure Sand</span>
          </div>
          <div class="spectrum-marker" style="left:42%">
            <div class="marker-dot" style="background:#C9A86C;border-color:#5C4A2A"></div>
            <span class="marker-label" style="font-weight:600;color:var(--loam)">▶ Loamy Sand</span>
          </div>
          <div class="spectrum-marker" style="left:72%">
            <div class="marker-dot" style="background:#7A5A28;border-color:#3B2E1A"></div>
            <span class="marker-label">Sandy Loam</span>
          </div>
        </div>
        <div class="spectrum-axis">
          <span>Coarser / less cohesion / faster drainage</span>
          <span>Finer / more cohesion / better retention</span>
        </div>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Classification</span></div>

  <!-- 2. CLASSIFICATION -->
  <div class="section">
    <p class="section-label">Taxonomic Definition</p>
    <h2>Mathematical Boundaries of Loamy Sand</h2>
    <p>The USDA classification relies on two simultaneous inequalities that together identify the narrow transitional window of loamy sand. Unlike the pure "Sands" group — where the sum of silt and 1.5× clay must fall below 15 — loamy sands are defined by having <em>just enough</em> fine particles to exceed this threshold, yet not enough to cross into sandy loam territory.</p>

    <div class="formula-box">
      <p class="formula-title">USDA "Loamy Sands" Group — Classification Criteria</p>
      <div class="formula">
        Sand % between 70% and 90%<br>
        Silt % + (1.5 × Clay %) ≥ 15<br>
        Silt % + (2 × Clay %) &lt; 30
      </div>
      <p class="formula-note">The double inequality captures soils that behave hydraulically like sands but carry just enough fine-particle matrix to prevent free-flow collapse and provide trace cohesion. Clay rarely exceeds 10–15% of total mass.</p>
    </div>

    <h3>Subclassifications within Loamy Sands</h3>
    <p>Because the broad loamy sand category spans a wide range of internal sand grade distributions, the USDA Soil Survey Manual defines four specific subclasses based on which particle grades dominate. These subclasses carry significant practical implications for drainage rates and wind erodibility.</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Subclass</th><th>Primary distribution criteria</th><th>Practical implication</th></tr>
        </thead>
        <tbody>
          <tr><td class="highlight">Loamy Coarse Sand</td><td>≥ 25% very coarse + coarse sand; &lt; 50% any other single grade</td><td>Highest drainage; maximum wind resistance due to grain mass</td></tr>
          <tr><td class="highlight">Loamy Sand</td><td>≥ 25% very coarse, coarse, and medium sand; &lt; 25% very coarse + coarse; &lt; 50% fine; &lt; 50% very fine</td><td>Intermediate behavior; most common agricultural subtype</td></tr>
          <tr><td class="highlight">Loamy Fine Sand</td><td>≥ 50% fine sand; OR &lt; 50% very fine sand and &lt; 25% combined larger grades</td><td>Slower drainage; increased capillary rise; more wind mobile</td></tr>
          <tr><td class="highlight">Loamy Very Fine Sand</td><td>≥ 50% very fine sand</td><td>Functionally near coarse silt; surface crusting; WEG 2 highest risk</td></tr>
        </tbody>
      </table>
    </div>

    <div class="alert alert-warning">
      <span class="alert-icon">◈</span>
      <div>
        <p class="alert-title">Field Identification</p>
        <p>Loamy sand is highly gritty to the touch, yet forms a fragile, easily crumbled cast when squeezed in a moist state — distinguishing it from pure sand, which simply collapses. In the ribbon test, it produces a highly fragile rudimentary ribbon extending no more than 5 mm before breaking. The jar test shows rapid sand settling within minutes and very limited suspended silt/clay turbidity.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Physical Properties</span></div>

  <!-- 3. PHYSICAL PROPERTIES -->
  <div class="section">
    <p class="section-label">Structure and Density</p>
    <h2>Single-Grain Structure and the Bulk Density Paradox</h2>

    <h3>Absence of Peds — The Single-Grain Paradigm</h3>
    <p>Soil structure in loam and clay soils manifests through <em>peds</em> — secondary structural units formed by electrostatic bridging from clay particles, root exudation, fungal hyphae, and organic humus. These natural aggregates create a hierarchical architecture of micro-, meso-, and macropores with diverse functions.</p>
    <p>Loamy sands are characterized almost universally by a <strong>single-grain</strong> or structureless arrangement. Individual particles behave as non-coherent entities — much like beach sand — with no tendency to aggregate. The marginal silt and clay content prevents the matrix from flowing quite as freely as pure aeolian dune sand, but natural peds are essentially absent. A loamy sand clod formed by compression crushes instantly to individual grains under minimal applied force.</p>
    <p>This structural absence translates directly into extreme susceptibility to physical disturbance: raindrop kinetic impact, tillage implements, animal trampling, and aerodynamic wind shear all act on unprotected primary particles with no aggregate structure to resist them.</p>

    <h3>The Bulk Density Paradox</h3>
    <p>Despite their loose, friable appearance, loamy sands paradoxically carry a <em>higher</em> bulk density than fine-textured clay soils. Large spherical quartz grains pack closely, leaving large but relatively few interstitial voids. Clay particles, by contrast, use electrostatic forces and organic matter to construct complex bridged aggregate structures with massive internal microporosity — resulting in lower bulk density despite appearing heavier.</p>

    <div class="fact-grid">
      <div class="fact-card">
        <span class="fact-value">1.60–1.65</span>
        <span class="fact-label">g/cm³ typical bulk density (uncompacted)</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">&gt; 1.80</span>
        <span class="fact-label">g/cm³ root restriction threshold</span>
      </div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Soil texture</th><th>Ideal bulk density (g/cm³)</th><th>Root restriction threshold (g/cm³)</th></tr>
        </thead>
        <tbody>
          <tr class="focus-row-tr"><td class="focus-row">Sand / Loamy Sand</td><td>&lt; 1.60</td><td>&gt; 1.80</td></tr>
          <tr><td>Sandy Loam / Loam</td><td>&lt; 1.40</td><td>&gt; 1.80</td></tr>
          <tr><td>Silt / Silt Loam</td><td>&lt; 1.40</td><td>&gt; 1.75</td></tr>
          <tr><td>Sandy Clay / Silty Clay</td><td>&lt; 1.10</td><td>&gt; 1.58</td></tr>
          <tr><td>Clay (&lt;45% clay)</td><td>&lt; 1.10</td><td>&gt; 1.47</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Macroporosity and Aeration — The Ecological Advantage</h3>
    <p>While total porosity in loamy sand (35–45%) is lower than in clays, the pore size distribution is dominated by <strong>macropores</strong>. These large voids cannot generate capillary suction to retain water against gravity — they drain rapidly after wetting events. But they provide an exceptional ecological benefit: <strong>outstanding soil aeration</strong>.</p>
    <p>Root elongation rates drop to near zero when air-filled porosity falls below 5% of total soil volume, and accelerate significantly when it reaches 15%. Because loamy sand macropores empty quickly, the matrix rapidly re-establishes high air-filled porosity, ensuring robust aerobic respiration and preventing the anaerobic generation of phytotoxic ethylene accumulation that stunts crops in waterlogged fine-textured soils.</p>

    <div class="alert alert-success">
      <span class="alert-icon">✓</span>
      <div>
        <p class="alert-title">Aeration Advantage</p>
        <p>For root crops (carrots, potatoes, beets) and berry crops (strawberries, blueberries, raspberries), the macropore-dominated structure provides an almost ideal growth medium: zero waterlogging risk, zero mechanical resistance to root expansion, and no hard clod formation that causes root forking and deformation. The drainage that limits water retention simultaneously eliminates anaerobic root pathogen pressure.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Hydrology</span></div>

  <!-- 4. HYDROLOGY -->
  <div class="section">
    <p class="section-label">Water Dynamics</p>
    <h2>Hydraulic Conductivity and Available Water Capacity</h2>

    <h3>Hydrologic Soil Group A — Maximum Infiltration</h3>
    <p>The NRCS classifies soils into four Hydrologic Soil Groups (A through D) based on infiltration rates and runoff potential under prolonged wetting. Loamy sands — alongside pure sands and gravels — are overwhelmingly assigned to <strong>Hydrologic Soil Group A</strong>: high infiltration even when thoroughly wetted, and very low surface runoff potential.</p>
    <p>The diagnostic requirement for Group A is K<sub>sat</sub> exceeding 40 micrometers per second (≥ 5.67 inches per hour) in all layers within 50 cm depth. In practice, loamy sand infiltration capacity frequently exceeds even severe meteorological rainfall events, meaning water almost never ponds at the surface. This eliminates fluvial surface erosion but simultaneously guarantees that water escapes the root zone far faster than biological systems can utilize it.</p>

    <div class="fact-grid">
      <div class="fact-card">
        <span class="fact-value">~56</span>
        <span class="fact-label">cm/hr — typical K<sub>sat</sub> for loamy sand</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">2–5 in/hr</span>
        <span class="fact-label">Infiltration capacity range</span>
      </div>
    </div>

    <h3>Available Water Capacity — Narrow but Non-Zero</h3>
    <p>The Available Water Capacity (AWC) — the difference in volumetric water content between Field Capacity (−33 kPa) and the Permanent Wilting Point (−1500 kPa) — is the primary agronomic water metric. Because loamy sand features few micropores capable of generating high matric suction, its water retention curve drops precipitously near zero tension, stabilizing at a very low Field Capacity.</p>
    <p>Loamy sand holds approximately <strong>1.5 to 2.3 inches of available water per foot of soil depth</strong> (~17% volumetric). This is roughly double that of pure coarse sand, reflecting the marginal contribution of the fine fraction, but remains far below the 3.5–4.2 inches per foot achievable in silt loam profiles. Crucially, a crop transpires at the same climatic rate regardless of soil texture — plants in loamy sand simply exhaust their moisture reservoir much faster than the same crop in a loam.</p>

    <!-- Water retention bars -->
    <div class="water-bar-group">
      <p style="font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.75rem;">Available water capacity by soil class (vol. %)</p>
      <div class="water-bar-row">
        <span class="wbr-label">Coarse Sand</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:46%"></div>
          <div class="wbr-fc"  style="width:3%"></div>
          <div class="wbr-pwp" style="width:3%"></div>
        </div>
        <span class="wbr-val">5%</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label active">Loamy Sand ◀</span>
        <div class="wbr-track active">
          <div class="wbr-sat" style="width:46%"></div>
          <div class="wbr-fc"  style="width:6%"></div>
          <div class="wbr-pwp" style="width:6%"></div>
        </div>
        <span class="wbr-val" style="color:var(--loam);font-weight:700;">17%</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label">Sandy Loam</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:45%"></div>
          <div class="wbr-fc"  style="width:10%"></div>
          <div class="wbr-pwp" style="width:7%"></div>
        </div>
        <span class="wbr-val">20%</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label">Loam</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:46%"></div>
          <div class="wbr-fc"  style="width:16%"></div>
          <div class="wbr-pwp" style="width:12%"></div>
        </div>
        <span class="wbr-val">32%</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label">Silt Loam</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:48%"></div>
          <div class="wbr-fc"  style="width:20%"></div>
          <div class="wbr-pwp" style="width:10%"></div>
        </div>
        <span class="wbr-val">35%</span>
      </div>
      <div class="legend-row">
        <span class="legend-item"><span class="legend-dot" style="background:#7BA7C2"></span> Gravitational drainage loss</span>
        <span class="legend-item"><span class="legend-dot" style="background:#4A8C6A"></span> Plant-available (FC)</span>
        <span class="legend-item"><span class="legend-dot" style="background:#C07A3A"></span> Held at PWP</span>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Biogeochemistry</span></div>

  <!-- 5. BIOGEOCHEMISTRY -->
  <div class="section">
    <p class="section-label">Chemical Fertility</p>
    <h2>CEC, Organic Matter, and Chemical Vulnerability</h2>

    <h3>Cation Exchange Capacity — A Depleted Storehouse</h3>
    <p>A soil's chemical fertility is primarily indexed by its Cation Exchange Capacity (CEC), measured in meq/100g. CEC governs the soil's ability to attract, hold, and release essential plant nutrient cations (Ca²⁺, Mg²⁺, K⁺, NH₄⁺) against the leaching force of percolating water.</p>
    <p>The CEC of loamy sand is profoundly impoverished. The dominant quartz matrix contributes virtually zero charge. The trace clay present is frequently composed of low-activity 1:1 kaolinite minerals (CEC 3–15 meq/100g) rather than the high-activity 2:1 smectites (CEC 60–100 meq/100g) that make clay soils chemically reactive. The combined result is a total mineral CEC of just <strong>1 to 5 meq/100g</strong> — making it almost entirely dependent on organic matter for any chemical buffering.</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Soil / Component</th><th>Typical CEC (meq/100g)</th></tr>
        </thead>
        <tbody>
          <tr class="focus-row-tr"><td class="focus-row">Sand / Loamy Sand</td><td class="focus-row">1 to 5</td></tr>
          <tr><td>Fine Sandy Loam</td><td>5 to 10</td></tr>
          <tr><td>Loam / Silt Loam</td><td>10 to 25</td></tr>
          <tr><td>Clay Loam / Clay</td><td>20 to 50+</td></tr>
          <tr><td>Kaolinite (1:1 clay mineral)</td><td>3 to 15</td></tr>
          <tr><td>Montmorillonite (2:1 clay mineral)</td><td>80 to 100</td></tr>
          <tr><td>Soil Organic Matter (Humus)</td><td>100 to 400</td></tr>
        </tbody>
      </table>
    </div>

    <div class="pull-quote">
      <p>"Because the denominator of the Base Saturation equation (total CEC) is so small in loamy sands, minor additions of acidic fertilizer or acidic rainfall can cause dramatic shifts in soil pH — these soils entirely lack the chemical buffering capacity found in clay loams."</p>
    </div>

    <h3>Organic Matter Dynamics — The Keystone Under Threat</h3>
    <p>Because the mineral matrix provides almost no CEC, loamy sands are <em>entirely reliant</em> on their Soil Organic Matter (SOM) fraction for chemical reactivity. Humified organic matter possesses a vast CEC of 100–400 meq/100g. Even a thin band of humus in the topsoil can elevate effective CEC from near-zero to 4–5 meq/100g.</p>
    <p>Yet coarse-textured soils face a fundamental thermodynamic disadvantage in retaining organic carbon. In fine-textured soils, clay surfaces form robust organo-mineral complexes that physically encapsulate carbon substrates, shielding them from microbial degradation. Loamy sand provides virtually no such protection. The high macroporosity and exceptional aeration create a highly oxygenated environment that fuels explosive aerobic microbial activity when fresh residues are incorporated — rapidly oxidizing the unprotected carbon to CO₂.</p>
    <p>The result: virgin loamy sands rarely exceed 1–2% SOM. Under conventional cultivation with moldboard plowing, SOM can crash <em>below 1%</em> within decades, eliminating the soil's only source of chemical fertility and simultaneously degrading its already limited water retention.</p>

    <div class="alert alert-danger">
      <span class="alert-icon">⚠</span>
      <div>
        <p class="alert-title">Organic Matter Collapse Under Tillage</p>
        <p>Inversion tillage on loamy sands is environmentally catastrophic: it buries crop residues, exposes bare sand to aerodynamic shear, and accelerates microbial oxidation of the minimal carbon pool. Restoring SOM is a perpetual battle — the climate and mineralogy impose strict natural equilibrium limits, forcing continuous large-volume compost or green manure inputs simply to maintain baseline biological function.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Leaching</span></div>

  <!-- 6. LEACHING -->
  <div class="section">
    <p class="section-label">Groundwater Contamination</p>
    <h2>Agrochemical Leaching and Subsurface Pollution</h2>
    <p>The convergence of Hydrologic Group A K<sub>sat</sub>, macropore dominance, and near-zero CEC makes loamy sand one of the most hazardous soil matrices for groundwater contamination from agricultural inputs. Nitrate (NO₃⁻) — the primary mobile nitrogen form — faces zero electrostatic retardation in this matrix; colloidal exchange sites are negatively charged and <em>repel</em> nitrate directly into the free soil water. Every irrigation or rainfall event moves dissolved nitrate unimpeded through the macropore network and into underlying aquifers.</p>

    <div class="fact-grid">
      <div class="fact-card">
        <span class="fact-value">+165–177%</span>
        <span class="fact-label">More N leached vs. loamy clay in wet years</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">170%</span>
        <span class="fact-label">Higher annual N loss to percolation vs. clay</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">180 kg/ha</span>
        <span class="fact-label">Optimal N rate ceiling for sandy soils</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">14.7%</span>
        <span class="fact-label">Applied N lost to gaseous volatilization</span>
      </div>
    </div>

    <p>Comparative field trials under identical fertilizer application rates document that nitrogen leaching in loamy sand profiles exceeds that of loamy clay soils by up to 16.2 kg/ha per season — a 165–177% increase during high-rainfall years. Single-dose pre-plant nitrogen applications are essentially guaranteed to fail: a single heavy rainfall event will flush the applied nitrogen below the crop root zone before plant uptake can occur. This represents both an agronomic loss and a serious environmental liability.</p>

    <div class="alert alert-danger">
      <span class="alert-icon">⚠</span>
      <div>
        <p class="alert-title">Groundwater Pollution Risk</p>
        <p>In catchments dominated by loamy sands with intensive agriculture, flow-normalized nitrate transport into surface streams and deep groundwater bodies is consistently elevated, particularly during high-nitrogen spring cereal seasons. The European legal groundwater standard of 0.1 µg/L for pesticides is routinely exceeded in coarse-textured agricultural catchments following precipitation after chemical application.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Erodibility</span></div>

  <!-- 7. ERODIBILITY -->
  <div class="section">
    <p class="section-label">Erosion Dynamics</p>
    <h2>The Paradox of Water vs. Wind Erosion</h2>
    <p>Loamy sand presents one of the most counterintuitive erosion profiles in the soil textural spectrum: it is simultaneously <strong>among the most resistant soils to water erosion</strong> and <strong>among the most vulnerable soils to wind erosion</strong>. Both properties originate from the same physical source — its extreme macroporosity and single-grain structure.</p>

    <div class="dual-box">
      <div class="dual-card resistant">
        <p class="dual-title">Water erosion — highly resistant</p>
        <ul>
          <li>Infiltration exceeds even intense rainfall events</li>
          <li>Near-zero surface runoff (Hydro Group A)</li>
          <li>No hydraulic shear to transport heavy sand grains</li>
          <li>RUSLE K-factor: 0.05–0.20 (very low)</li>
          <li>Detached particles remain largely in place</li>
        </ul>
      </div>
      <div class="dual-card vulnerable">
        <p class="dual-title">Wind erosion — acutely vulnerable</p>
        <ul>
          <li>Single-grain structure offers no aerodynamic resistance</li>
          <li>Wind Erodibility Group 2 (134 t/ac/yr)</li>
          <li>Saltation mobilizes grains ballistically</li>
          <li>Selective removal of SOM, clay, fine silt</li>
          <li>Seedling sandblasting destroys emerging crops</li>
        </ul>
      </div>
    </div>

    <h3>The Mechanics of Aeolian Mobilization</h3>
    <p>Wind erosion begins when aerodynamic shear forces exceed the <strong>threshold friction velocity</strong> (u<sub>*t</sub>) of the loose single-grain surface. Disturbance of natural cryptogamic soil crusts — by livestock trampling, vehicle traffic, or tillage — drastically lowers this threshold, triggering exponential increases in horizontal sediment flux.</p>
    <p>Transport occurs primarily via <strong>saltation</strong>: mobilized grains travel in short ballistic trajectories, crashing back into the surface and dislodging further particles upon impact. This self-reinforcing cascade produces the agricultural hazard of <strong>sandblasting</strong>, which inflicts severe mechanical trauma on emergent seedlings — stripping away the protective waxy cuticle, destroying terminal shoots, inducing cellular dehydration, and opening vectors for systemic phytopathogens.</p>
    <p>The ecological damage of wind erosion extends beyond immediate crop losses. Wind selectively lifts the lightest particles — the nutrient-rich organic matter, clay, and fine silt fractions — while leaving the heavier inert coarse sand behind. Analysis of windblown sediments from sandy soils reveals that dust plumes contain <strong>twice as much nitrogen and phosphorus</strong>, and 20% more potassium, than the residual soil. Over decades, this progressive winnowing drives the soil toward sterile, shifting dune structures.</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Wind Erodibility Group</th><th>Predominant texture</th><th>Wind Erodibility Index (t/ac/yr)</th></tr>
        </thead>
        <tbody>
          <tr><td class="highlight">WEG 1</td><td>Very fine, fine, sand, coarse sand</td><td>160–310 (avg 220)</td></tr>
          <tr class="focus-row-tr"><td class="focus-row">WEG 2</td><td class="focus-row">Loamy very fine sand, loamy fine sand, loamy sand</td><td class="focus-row">134</td></tr>
          <tr><td>WEG 3</td><td>Very fine sandy loam, fine sandy loam, sandy loam</td><td>86</td></tr>
          <tr><td>WEG 4</td><td>Clay, silty clay, clay loam (&gt;35% clay)</td><td>86</td></tr>
          <tr><td>WEG 5</td><td>Loam, silt loam (&gt;20% clay), sandy clay</td><td>56</td></tr>
          <tr><td>WEG 8</td><td>Soils not susceptible (coarse rock, wetness)</td><td>0</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="divider-ornament"><span>Agronomy</span></div>

  <!-- 8. AGRONOMY -->
  <div class="section">
    <p class="section-label">Agronomic Management</p>
    <h2>Precision Strategies for Loamy Sand Profiles</h2>
    <p>Despite their severe physical and chemical constraints, loamy sands offer compelling agronomic advantages when managed with precision: fields drain immediately after precipitation, eliminating compaction risk from heavy machinery; the low specific heat of dry quartz enables rapid spring soil warming for early harvests at premium market prices; and the loose, non-compacting structure provides an ideal root environment for high-value tuber and berry crops.</p>

    <div class="pull-quote">
      <p>"Successful cultivation on loamy sand requires treating the soil almost as an inert hydroponic support medium — relying entirely on artificial, precision-engineered real-time inputs of water and dissolved nutrients, rather than on the soil's native chemical reserves."</p>
    </div>

    <div class="mgmt-grid">
      <div class="mgmt-card">
        <div class="mgmt-header irrigation">Precision Irrigation</div>
        <div class="mgmt-body">
          <ul>
            <li>High-frequency, low-volume drip irrigation is the only efficient option; center pivots and furrow flooding cause massive deep percolation losses</li>
            <li>Water application must match the soil's narrow AWC (1.5–2.3 in/ft) exactly — no buffering capacity exists for over-application</li>
            <li>Tighter emitter spacing than on loam: lateral capillary spread is minimal</li>
            <li>Monitor soil moisture continuously — drought stress onset is rapid</li>
          </ul>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-header nutrients">Fertigation & N Management</div>
        <div class="mgmt-body">
          <ul>
            <li>Single pre-plant N doses are environmentally catastrophic — flush to groundwater on first rainfall</li>
            <li>Split into ≥3 equal applications timed to crop uptake curve; target ≤180 kg N/ha total</li>
            <li>Couple fertigation directly with drip irrigation water for continuous micro-dosing</li>
            <li>Use nitrification inhibitors (DCD, nitrapyrin) to delay NH₄⁺→NO₃⁻ conversion and extend N residence time</li>
          </ul>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-header amendments">Soil Amendments</div>
        <div class="mgmt-body">
          <ul>
            <li>Fine-particle biochar (≤1 mm) maximizes AWC gain, aeration porosity, and CEC surface area — larger fractions primarily reduce bulk density (up to −26%)</li>
            <li>Super Absorbent Polymers (SAPs): 50–100g doses can increase operational water-holding capacity by up to 96%; critical for dryland seedling establishment</li>
            <li>Continuous high-volume organic matter inputs (compost, green manure) are mandatory to maintain baseline biological function</li>
          </ul>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-header conservation">Conservation Tillage</div>
        <div class="mgmt-body">
          <ul>
            <li>Moldboard plowing is catastrophic: buries residues, exposes bare sand to wind, accelerates SOM oxidation</li>
            <li>No-till or reduced-tillage regimes are mandatory — permanent armoring of the soil surface with standing residue or cover crops</li>
            <li>Cover crops disrupt the aerodynamic boundary layer, reducing wind velocity below u<sub>*t</sub> while conserving moisture</li>
            <li>Monitor nematode communities (Aphelenchus, Pratylenchus spp.) as bioindicators of soil health trajectory</li>
          </ul>
        </div>
      </div>
    </div>

    <h3>Suitable Crops and Cultivar Selection</h3>
    <p>Root vegetables — carrots, potatoes, radishes, beets — achieve exceptional uniformity in loamy sands. The absence of mechanical resistance and clay-pan obstructions allows taproots to expand symmetrically, producing visually pristine commercial-grade produce free from forking and deformation. Rapid drainage eliminates anaerobic bacterial rot and fungal blight that devastate tuber crops in heavier soils.</p>
    <p>Berry crops (strawberries, blueberries, raspberries) and viticultural crops (grapes) similarly benefit from the highly oxygenated, well-drained root zone. However, all of these high-value crops require treating the soil as an inert hydroponic substrate — native fertility is negligible and must be entirely replaced by precision fertigation.</p>
  </div>

  <div class="divider-ornament"><span>Case Study</span></div>

  <!-- 9. REGIONAL CASE STUDY -->
  <div class="section">
    <p class="section-label">Regional Example</p>
    <h2>Morocco's Rabat-Salé-Kénitra Region</h2>
    <p>The Rabat-Salé-Kénitra (RSK) region of northwestern Morocco provides a vivid, real-world illustration of loamy sand's dual nature: extraordinary agricultural productivity coexisting with severe ecological fragility and accelerating environmental crisis. The region is defined by deep Plio-Quaternary sandy formations and extensive fine sand dunes resting on impermeable Mio-Pliocene blue marl and clay bases — a geological architecture that concentrates leached agrochemicals into a shallow, vulnerable aquifer.</p>

    <div class="case-study">
      <div class="case-header">
        <span class="case-title">The Maamora Forest — Ecological Decline on Sandy Arenosols</span>
        <span class="case-tag">Forest Ecosystem</span>
      </div>
      <div class="case-body">
        <p style="font-size:15px;">The Maamora, historically the world's largest contiguous cork oak (<em>Quercus suber</em>) forest at over 131,000 ha, grows on a structureless loamy sand to pure sand surface layer (0.5–6 m depth) with sand fractions of 98–99% at 60–80 cm depth. The intrinsic limitations of this arenosol matrix — minimal AWC and near-zero nutrient retention — render the ecosystem highly vulnerable. As climate becomes drier eastward, the sandy topsoil desiccates so rapidly during the Mediterranean summer that nascent oak taproot seedlings perish from dehydration before penetrating the moisture-bearing red clay horizon below.</p>
        <div class="case-stat-row">
          <div class="case-stat"><span class="val">−16.3%</span><span class="lbl">Cork oak cover loss 1989–2022</span></div>
          <div class="case-stat"><span class="val">+21.2%</span><span class="lbl">Eucalyptus cover gain 1989–2022</span></div>
          <div class="case-stat"><span class="val">&gt;61%</span><span class="lbl">Area with acute SOM deficiency</span></div>
        </div>
      </div>
    </div>

    <div class="case-study">
      <div class="case-header">
        <span class="case-title">The R'mel Aquifer — Agricultural Success and Groundwater Crisis</span>
        <span class="case-tag">Agricultural Basin</span>
      </div>
      <div class="case-body">
        <p style="font-size:15px;">The R'mel region, south of Larache, has leveraged the thermal advantages of loamy sands to become Morocco's premier berry-producing zone. The rapid spring warming enables long growing seasons that produce exceptional yields now exported globally. However, the same Hydrologic Group A K<sub>sat</sub> that enables this productivity drives continuous, rapid downward flux of applied agrochemicals directly into the shallow 245 km² R'mel groundwater aquifer — threatening potable water for rural communities.</p>
        <div class="case-stat-row">
          <div class="case-stat"><span class="val">4,360 ha</span><span class="lbl">Soft fruit cultivation area (RSK)</span></div>
          <div class="case-stat"><span class="val">35–45 t/ha</span><span class="lbl">Strawberry yield</span></div>
          <div class="case-stat"><span class="val">&gt;3,000 t/yr</span><span class="lbl">Chemical fertilizers applied</span></div>
          <div class="case-stat"><span class="val">&gt;75%</span><span class="lbl">Production exported internationally</span></div>
        </div>
      </div>
    </div>

    <p>The RSK region exemplifies the global loamy sand management dilemma at scale: the same physical properties that attract intensive, high-value agriculture simultaneously create the conditions for accelerating environmental degradation. Researchers are now deploying SWAT-MODFLOW integrated hydrological models to track nitrate transport through the sand layers, and nuclear science techniques (fallout radionuclides, stable isotopes) to pinpoint erosion hotspots and guide conservation priorities. Transitioning to conservation agriculture with permanent vegetative cover has already demonstrated 20–30% yield increases while stabilizing the fragile soil matrix.</p>
  </div>

  <hr class="divider">

  <!-- CONCLUSION -->
  <div class="section">
    <p class="section-label">Synthesis</p>
    <h2>Managing Loamy Sand as an Engineered System</h2>
    <p>The loamy sand textural class embodies a profound physical and chemical paradox. Its structureless, single-grain morphology — governed by quartz's chemical inertness and the absence of clay aggregation — simultaneously confers remarkable resistance to water erosion and catastrophic vulnerability to wind erosion. Its macropore-dominated pore geometry enables exceptional aeration and near-total immunity to waterlogging, yet ensures that water, nutrients, and pesticides escape the root zone before biological systems can retain them.</p>
    <p>The critical insight is that loamy sand's limitations are not merely quantitative — they are structural. The soil lacks the mineral surface chemistry to hold cations, the clay bridging to form aggregates, and the micropore architecture to retain water against gravity. No amount of conventional fertilization or standard irrigation can compensate for these inherent deficits if applied in traditional broad-acre formats designed for loam and clay soils.</p>
    <p>Sustainable management demands a complete replacement of the colloidal functionality that geological weathering omitted: high-frequency drip fertigation that bypasses the absent CEC, split nitrogen applications synchronized to real-time plant uptake, continuous aggressive organic matter input to sustain the only source of chemical reactivity, fine-particle biochar or SAPs to engineer artificial water retention, and rigorous no-till vegetative buffering to arrest wind erosion. As the Moroccan Rabat-Salé-Kénitra case demonstrates, failure to engineer this colloidal substitution drives cascading disasters — from aquifer contamination to forest ecosystem collapse. Respect for the strict physicochemical boundaries of loamy sand is not merely best practice; it is the precondition for any durable relationship between agriculture and this fragile soil class.</p>
  </div>

<footer class="feature-footer"><strong>USDA Loamy Sand Soil Texture Class — Scientific Analysis</strong><br><br>
  Based on USDA Soil Survey Manual (2017), NRCS Hydrologic Soil Group classification,<br>
  RUSLE/WEPS erodibility frameworks, and peer-reviewed literature in pedology, agronomy,<br>
  and environmental hydrology — with regional case studies from Rabat-Salé-Kénitra, Morocco.</footer>
      `,
    },
  });
}

const clayArticle = articles.find((article) => article.slug === "clay");

if (clayArticle) {
  Object.assign(clayArticle, {
    title: "The Clay Textural Class: USDA Triangle Guide",
    excerpt:
      "A complete guide to the clay textural class, including USDA boundary rules, mineralogy, water retention, shrink-swell behavior, drainage, tillage, and agronomic management.",
    readingTime: "20 min read",
    feature: {
      label: "USDA Soil Texture Triangle ? Scientific Analysis",
      subtitle:
        "Mineralogy, colloidal chemistry, hydraulics, Atterberg limits, soil orders, and agronomic management of fine-textured clay soils.",
      meta: [
        "Clay content >= 40%",
        "High water retention",
        "High CEC potential",
        "Slow drainage",
      ],
      html: `
<!-- 1 · INTRODUCTION -->
  <div class="section">
    <p class="section-label">Introduction</p>
    <h2>The Dominant Apex of the Pedosphere</h2>
    <p>At the uppermost apex of the USDA Soil Texture Triangle sits the <strong>clay textural class</strong> — the most physically complex, electrochemically active, and structurally dominant category of mineral soil on Earth. Its influence is categorically disproportionate to its particle size: while a soil requires at least 85 percent sand to be classified as a pure "sand," it needs only <strong>40 percent clay</strong> to fully fall within the clay class. This mathematical asymmetry encapsulates a fundamental truth of soil physics — colloidal particles below 2 micrometers exert an overwhelming, dominating control over the bulk behavior of any matrix they inhabit.</p>
    <p>This dominance is not merely quantitative. It is rooted in the unique electrochemical and thermodynamic properties of phyllosilicate minerals — secondary layer silicates synthesized through geologic weathering — which possess specific surface areas up to 800 m²/g, permanent structural charge from isomorphic substitution, and the capacity to swell, shrink, adsorb, release, and buffer nutrients and water at scales that quartz grains can never approach. Understanding clay is understanding the chemical engine of the pedosphere.</p>

    <div class="fact-grid">
      <div class="fact-card">
        <span class="fact-value">40%</span>
        <span class="fact-label">Minimum clay fraction for classification</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">20–50+</span>
        <span class="fact-label">meq/100g — CEC range</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">&lt; 0.5</span>
        <span class="fact-label">cm/hr — K<sub>sat</sub> (structureless clay)</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">Group D</span>
        <span class="fact-label">USDA Hydrologic Soil Group</span>
      </div>
    </div>

    <div class="triangle-position">
      <div class="tp-header">Clay class position within the USDA textural triangle</div>
      <div class="tp-body">
        <div class="tp-cell">
          <p class="tp-cell-label">Sand</p>
          <p class="tp-cell-val">≤ 45%</p>
          <p class="tp-cell-sub">Maximum sand boundary</p>
        </div>
        <div class="tp-cell focus">
          <p class="tp-cell-label">Clay ◀ Defining fraction</p>
          <p class="tp-cell-val">≥ 40%</p>
          <p class="tp-cell-sub">Minimum required — apex of triangle</p>
        </div>
        <div class="tp-cell">
          <p class="tp-cell-label">Silt</p>
          <p class="tp-cell-val">&lt; 40%</p>
          <p class="tp-cell-sub">Maximum silt boundary</p>
        </div>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Classification</span></div>

  <!-- 2 · CLASSIFICATION -->
  <div class="section">
    <p class="section-label">Taxonomic Definition</p>
    <h2>Geometry, Vertices, and Organic Class Thresholds</h2>
    <p>The USDA "clay" polygon occupies the uppermost enclosed region of the ternary space, bounded by three simultaneous constraints. Its five geometric vertices, expressed as (Sand%, Silt%, Clay%), define the precise limits of the class against adjacent categories — silty clay, sandy clay, and the broader clay loam family.</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Polygon vertex</th><th>Sand %</th><th>Silt %</th><th>Clay %</th><th>Boundary separates from</th></tr>
        </thead>
        <tbody>
          <tr><td class="hl">Top Apex</td><td>0</td><td>0</td><td>100</td><td>Theoretical maximum clay</td></tr>
          <tr><td class="hl">Upper-Right</td><td>0</td><td>40</td><td>60</td><td>Silty clay (40% silt limit)</td></tr>
          <tr><td class="hl">Bottom-Right</td><td>20</td><td>40</td><td>40</td><td>Silty clay (basal 40% clay)</td></tr>
          <tr><td class="hl">Bottom-Left</td><td>45</td><td>15</td><td>40</td><td>Sandy clay (45% sand limit)</td></tr>
          <tr><td class="hl">Upper-Left</td><td>45</td><td>0</td><td>55</td><td>Sandy clay (0% silt axis)</td></tr>
        </tbody>
      </table>
    </div>

    <h3>The Organic Soil Threshold — A Clay-Driven Formula</h3>
    <p>The influence of clay extends even into the taxonomy of organic soils. Because clay physically and chemically binds with organic carbon — protecting it from microbial decomposition — the minimum organic carbon threshold required to classify a saturated horizon as an "organic soil" rises linearly with clay content:</p>

    <div class="formula-box">
      <p class="formula-title">USDA Organic Carbon Requirement for Organic Soil Classification</p>
      <div class="formula">
        OC<sub>required</sub> = 12 + (0.1 × % clay)<br><br>
        At 0% clay  → 12% organic carbon required<br>
        At 60%+ clay → 18% organic carbon required
      </div>
      <p class="formula-note">This reflects clay's protective function: it binds and shields organic molecules from enzymatic attack, meaning clay-rich matrices must accumulate far more organic carbon before the organic fraction truly dominates soil behavior.</p>
    </div>

    <h3>Field Identification — The Ribbon Test</h3>
    <p>The standardized texture-by-feel method identifies clay class soils through their extraordinary plasticity. After wetting a golf-ball-sized sample to a moist putty consistency, the operator extrudes a ribbon between thumb and forefinger. Clay is definitively identified when:</p>
    <ul style="list-style:none;padding:0;margin:1rem 0;">
      <li style="padding:.5rem 0 .5rem 1.5rem;position:relative;border-bottom:1px solid var(--border);"><span style="position:absolute;left:0;color:var(--clay);">→</span> The ribbon extends <strong>2 inches (5 cm) or longer</strong> before breaking — top-tier fine texture</li>
      <li style="padding:.5rem 0 .5rem 1.5rem;position:relative;border-bottom:1px solid var(--border);"><span style="position:absolute;left:0;color:var(--clay);">→</span> The wetted puddle feels <strong>neither distinctly gritty nor distinctly smooth</strong> — balanced tactile response distinguishes pure "clay" from "sandy clay" (gritty) and "silty clay" (smooth/floury)</li>
      <li style="padding:.5rem 0 .5rem 1.5rem;position:relative;"><span style="position:absolute;left:0;color:var(--clay);">→</span> Professional soil scientists achieve <strong>66% exact accuracy</strong> with this method (91% when adjacent classes included); seasonal technicians achieve only 27–41%</li>
    </ul>

    <div class="alert alert-warning">
      <span class="alert-icon">◈</span>
      <div>
        <p class="alert-title">Field Identification Cautions</p>
        <p>Iron oxides (humid climates), precipitated silica (desert), and calcium carbonate (arid) can cement clay into aggregates that feel like fine sand. Soft micaceous grains from granitic parent materials may also mimic clay plasticity. In these contexts, record the result as an "apparent field texture" and verify by laboratory sedimentation.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Mineralogy</span></div>

  <!-- 3 · MINERALOGY -->
  <div class="section">
    <p class="section-label">Colloidal Chemistry</p>
    <h2>Phyllosilicate Mineralogy and Surface Chemistry</h2>
    <p>Unlike primary minerals (quartz, feldspars) that are inert products of physical rock breakdown, clay particles are almost exclusively <strong>secondary minerals</strong> — synthesized de novo through the chemical weathering, dissolution, and recrystallization of primary minerals over geologic timescales. Their crystalline architecture is built from stacked planar sheets of silicon-oxygen tetrahedrons and aluminum-oxygen octahedrons, and the specific stacking arrangement determines virtually every chemical and physical property of the bulk soil.</p>

    <div class="mineral-grid">
      <div class="mineral-card">
        <div class="mc-header kao">Kaolinite — 1:1</div>
        <div class="mc-body">
          <p class="mc-stat">SSA: <span>5–40 m²/g</span></p>
          <p class="mc-stat">CEC: <span>3–15 meq/100g</span></p>
          <p class="mc-stat">Structure: <span>1 silica + 1 alumina</span></p>
          <p class="mc-note">Tightly H-bonded layers; no interlayer expansion; low shrink-swell; pH-dependent edge charge; stable for construction.</p>
        </div>
      </div>
      <div class="mineral-card">
        <div class="mc-header ill">Illite — 2:1</div>
        <div class="mc-body">
          <p class="mc-stat">SSA: <span>10–100 m²/g</span></p>
          <p class="mc-stat">CEC: <span>10–40 meq/100g</span></p>
          <p class="mc-stat">Structure: <span>2 silica + 1 alumina</span></p>
          <p class="mc-note">K⁺ ions lock interlayer space, largely preventing expansion. Intermediate properties; significant K reservoir in calcareous soils.</p>
        </div>
      </div>
      <div class="mineral-card">
        <div class="mc-header smc">Smectite — 2:1</div>
        <div class="mc-body">
          <p class="mc-stat">SSA: <span>40–800 m²/g</span></p>
          <p class="mc-stat">CEC: <span>80–120 meq/100g</span></p>
          <p class="mc-stat">Structure: <span>2 silica + 1 alumina</span></p>
          <p class="mc-note">Weak van der Waals interlayer bonding allows massive swelling upon hydration. The dominant mineral in Vertisols; maximum fertility but extreme management hazard.</p>
        </div>
      </div>
      <div class="mineral-card">
        <div class="mc-header vmc">Vermiculite — 2:1</div>
        <div class="mc-body">
          <p class="mc-stat">SSA: <span>40–800 m²/g</span></p>
          <p class="mc-stat">CEC: <span>100–150 meq/100g</span></p>
          <p class="mc-stat">Structure: <span>2:1 high layer charge</span></p>
          <p class="mc-note">Highest theoretical CEC of any common clay mineral. Significant potassium fixation capacity in highly weathered tropical soils.</p>
        </div>
      </div>
    </div>

    <h3>Two Charge-Generation Mechanisms</h3>
    <p>The permanent negative charge that defines clay's chemical power arises from two mechanisms operating simultaneously. <strong>Isomorphous substitution</strong> — the replacement of a higher-valence cation (Si⁴⁺ or Al³⁺) by a lower-valence one (Al³⁺ or Mg²⁺) during mineral formation — generates a fixed, permanent structural charge deficit that exists irrespective of pH. This is the dominant mechanism in 2:1 smectites and the source of their extraordinary fertility.</p>
    <p><strong>pH-dependent charge</strong> arises at the broken lateral edges of clay crystals, where exposed hydroxyl (–OH) groups deprotonate in alkaline conditions, generating localized negative charge. This is the primary mechanism for 1:1 kaolinite, explaining why kaolinitic tropical soils exhibit highly variable CEC values dependent on soil pH — and why acidification is particularly damaging to their fertility.</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Clay mineral</th><th>SSA (m²/g)</th><th>CEC (meq/100g)</th><th>Charge origin</th><th>Shrink-swell</th></tr>
        </thead>
        <tbody>
          <tr><td class="hl">Kaolinite</td><td>5–40</td><td>3–15</td><td>pH-dependent edge</td><td>Negligible</td></tr>
          <tr><td class="hl">Illite</td><td>10–100</td><td>10–40</td><td>Isomorphous substitution (K⁺-locked)</td><td>Low</td></tr>
          <tr class="focus-tr"><td class="hl">Smectite</td><td class="focus-val">40–800</td><td class="focus-val">80–120</td><td>Isomorphous substitution (expandable)</td><td class="focus-val">Extreme</td></tr>
          <tr><td class="hl">Vermiculite</td><td>40–800</td><td>100–150</td><td>Isomorphous substitution (highest)</td><td>Moderate</td></tr>
        </tbody>
      </table>
    </div>

    <div class="pull-quote">
      <p>"A bulk soil classified as USDA clay can exhibit a total CEC anywhere from 20 to over 50 meq/100g — dwarfing the 3–5 meq/100g of pure sands and the 10–15 meq/100g of loams. High-clay soils act as massive chemical buffers, strongly resisting acidification while tightly binding applied fertilizers against leaching."</p>
    </div>
  </div>

  <div class="divider-ornament"><span>Hydrology</span></div>

  <!-- 4 · HYDROLOGY -->
  <div class="section">
    <p class="section-label">Water Dynamics</p>
    <h2>The High-Porosity, Low-Permeability Paradox</h2>
    <p>Clay soils present one of soil hydrology's most striking paradoxes: they simultaneously possess the <strong>highest total porosity</strong> of all mineral soil classes — due to their staggering concentration of micropores between colloidal particles — and the <strong>lowest fluid permeability</strong>. The sub-microscopic pore network creates immense frictional resistance to flow, while the charged colloidal surfaces exert powerful matric suction that holds water far beyond what gravity can drain.</p>

    <h3>Saturated Hydraulic Conductivity — Hydrologic Group D</h3>
    <p>Clay soils are definitively assigned to <strong>USDA Hydrologic Soil Group D</strong> — the class with the absolute highest surface runoff potential and the lowest baseline infiltration rates. By definition, Group D soils possess greater than 40 percent clay, and K<sub>sat</sub> values in structureless, massive clay approach absolute zero. The contrast with Hydrologic Group A (loamy sands) is extreme:</p>

    <div class="fact-grid">
      <div class="fact-card">
        <span class="fact-value">&lt;0.5 cm/hr</span>
        <span class="fact-label">K<sub>sat</sub> — structureless massive clay</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">0.0005 cm/hr</span>
        <span class="fact-label">K<sub>sat</sub> minimum extreme reported</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">10–100 µm/s</span>
        <span class="fact-label">K<sub>sat</sub> via structural macropores (dry cracks)</span>
      </div>
      <div class="fact-card">
        <span class="fact-value">63+ cm/hr</span>
        <span class="fact-label">K<sub>sat</sub> — pure sand (Group A) comparison</span>
      </div>
    </div>

    <div class="alert alert-info">
      <span class="alert-icon">ℹ</span>
      <div>
        <p class="alert-title">Structure Overrides Texture — The Crack Bypass Effect</p>
        <p>If a clay layer develops strong, coarse blocky or prismatic structure, large inter-pedal macropores and deep desiccation cracks form. Infiltrating water can temporarily bypass the microporous clay matrix entirely, flowing down structural cracks at 10–100 µm/s. This accelerated flow continues only until clay ped surfaces fully hydrate, swell shut, and seal the macropores — a fundamental tenet of soil hydrology: texture defines the theoretical permeability baseline, but aggregate structure dictates the functional reality.</p>
      </div>
    </div>

    <h3>Water Retention, Plant Available Water, and the Thermodynamic Lock</h3>
    <p>Clay soils exert tremendous <strong>matric suction</strong> — the massive negative pressure generated by adhesive forces between dipolar water molecules and the highly charged colloidal surfaces. This translates to exceptional absolute water retention. At field capacity (−33 kPa), clay holds a substantially higher volumetric water content than sands or loams. Deep-rooted crops traversing heavy clay horizons can often access these reserves long after sandy topsoils have completely desiccated.</p>
    <p>Yet this retention comes at an agronomic cost. The exact same capillary forces that hold water against gravity also hold it against the osmotic pull of plant roots. The Permanent Wilting Point (−1500 kPa) is exceptionally high in clay soils, and the <strong>Total Plant Available Water</strong> — the difference between Field Capacity and PWP — is actually comparable to that of pure sand: approximately 0.10 cm³/cm³ for both extremes, versus 0.15–0.20 cm³/cm³ for the productive middle ground of silt loams. In clay, the water is physically present but <em>thermodynamically locked</em>.</p>

    <!-- Water bars -->
    <div class="water-bar-group">
      <p style="font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);margin-bottom:.75rem;">Volumetric water content by soil class</p>
      <div class="water-bar-row">
        <span class="wbr-label">Sand</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:46%"></div>
          <div class="wbr-fc"  style="width:4%"></div>
          <div class="wbr-pwp" style="width:4%"></div>
        </div>
        <span class="wbr-val">~4–6 cm/m</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label">Loam</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:46%"></div>
          <div class="wbr-fc"  style="width:14%"></div>
          <div class="wbr-pwp" style="width:11%"></div>
        </div>
        <span class="wbr-val">~14 cm/m</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label">Silt Loam</span>
        <div class="wbr-track">
          <div class="wbr-sat" style="width:48%"></div>
          <div class="wbr-fc"  style="width:20%"></div>
          <div class="wbr-pwp" style="width:9%"></div>
        </div>
        <span class="wbr-val">~25 cm/m</span>
      </div>
      <div class="water-bar-row">
        <span class="wbr-label focus">Clay ◀</span>
        <div class="wbr-track focus">
          <div class="wbr-sat" style="width:29%"></div>
          <div class="wbr-fc"  style="width:11%"></div>
          <div class="wbr-pwp" style="width:17%"></div>
        </div>
        <span class="wbr-val" style="color:var(--clay-dark);font-weight:700;">~10 cm/m</span>
      </div>
      <div class="legend-row">
        <span class="legend-item"><span class="legend-dot" style="background:#7BA7C2"></span> Gravitational drainage</span>
        <span class="legend-item"><span class="legend-dot" style="background:#4A8C6A"></span> Plant-available (FC−PWP)</span>
        <span class="legend-item"><span class="legend-dot" style="background:#C07A3A"></span> Held at PWP (unavailable)</span>
      </div>
    </div>

    <div class="alert alert-warning">
      <span class="alert-icon">◈</span>
      <div>
        <p class="alert-title">The Available Water Paradox</p>
        <p>Despite clay's enormous total water storage, its plant available water (PAW) capacity is no better than pure sand — approximately 0.10 cm³/cm³. The PWP is so high in clay that a large fraction of retained water is held too tightly for roots to extract. Only medium-textured soils (loams, silt loams) genuinely optimize for plant access, holding water abundantly while retaining enough micropores to release it under root suction.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Geotechnics</span></div>

  <!-- 5 · GEOTECHNICS -->
  <div class="section">
    <p class="section-label">Engineering Mechanics</p>
    <h2>Atterberg Limits, Plasticity, and the USCS Framework</h2>
    <p>Civil and geotechnical engineers do not use the USDA triangle to assess foundation soils. They rely on the <strong>Atterberg Limits</strong> — the precise moisture contents at which a clay soil transitions between physical states — to quantify compressibility, shrink-swell hazard, and bearing capacity. These transitions are as reliable and reproducible as chemical titration thresholds.</p>

    <div class="atterberg">
      <div class="att-header">Atterberg Limits — Physical state transitions with increasing water content</div>
      <div class="att-track-wrap">
        <div class="att-track">
          <div class="att-marker" style="left:18%">
            <div class="att-tick"></div>
            <div class="att-mlabel">Shrinkage Limit (SL) — solid → semi-solid</div>
          </div>
          <div class="att-marker" style="left:46%">
            <div class="att-tick"></div>
            <div class="att-mlabel">Plastic Limit (PL) — brittle → moldable</div>
          </div>
          <div class="att-marker" style="left:76%">
            <div class="att-tick"></div>
            <div class="att-mlabel">Liquid Limit (LL) — plastic → viscous liquid</div>
          </div>
        </div>
        <div class="att-legend">
          <span>← Dry / rigid / high bearing capacity</span>
          <span>Wet / fluid / zero shear strength →</span>
        </div>
      </div>
    </div>

    <p>The <strong>Plasticity Index (PI = LL − PL)</strong> is the operational range of moisture over which the soil behaves plastically. A higher PI means higher compressibility, greater shrink-swell volume change, and more severe engineering hazard. USDA clay class soils exhibit extreme values relative to coarser soils:</p>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>Soil type</th><th>Liquid Limit (LL%)</th><th>Plastic Limit (PL%)</th><th>Engineering character</th></tr>
        </thead>
        <tbody>
          <tr><td class="hl">Sands &amp; Gravels</td><td>Non-plastic</td><td>0</td><td>High bearing capacity; no shrink-swell</td></tr>
          <tr><td class="hl">Silts</td><td>Low</td><td>Low</td><td>Low plasticity; susceptible to frost heave</td></tr>
          <tr class="focus-tr"><td class="hl">USDA Clay class</td><td class="focus-val">High</td><td class="focus-val">Moderate</td><td class="focus-val">Highly plastic, compressible; requires stabilization</td></tr>
          <tr><td class="hl">Colloidal Smectitic Clay</td><td class="focus-val">Up to 390%</td><td>—</td><td>Extreme shrink-swell; destructive to foundations</td></tr>
        </tbody>
      </table>
    </div>

    <h3>The USCS A-Line: Lean vs. Fat Clays</h3>
    <p>Under the <strong>Unified Soil Classification System (USCS)</strong> — the engineering parallel to the USDA triangle — fine-grained soils are plotted on a Plasticity Chart (PI vs. LL). The empirical "A-line" separates clays from silts:</p>
    <ul style="list-style:none;padding:0;margin:1rem 0;">
      <li style="padding:.5rem 0 .5rem 1.5rem;position:relative;border-bottom:1px solid var(--border);"><span style="position:absolute;left:0;color:var(--clay);">→</span> <strong>Lean Clays (CL):</strong> Above A-line, LL &lt; 50%; kaolinitic/illitic; standard "clayey soils." Low to medium plasticity.</li>
      <li style="padding:.5rem 0 .5rem 1.5rem;position:relative;border-bottom:1px solid var(--border);"><span style="position:absolute;left:0;color:var(--clay-dark);">→</span> <strong>Fat Clays (CH):</strong> Above A-line, LL ≥ 50%; smectitic; highly plastic and compressible. Extreme geotechnical hazard for highways and residential foundations due to severe wet-dry foundational heaving.</li>
      <li style="padding:.5rem 0 .5rem 1.5rem;position:relative;"><span style="position:absolute;left:0;color:var(--success);">→</span> <strong>Engineering advantage:</strong> Fat clays (CH) with LL &gt; 60% and PL &gt; 20% are actively sought for impervious cores of earth dams, pond dikes, and toxic landfill liners — their extreme plasticity ensures absolute impermeability under compaction.</li>
    </ul>

    <div class="alert alert-danger">
      <span class="alert-icon">⚠</span>
      <div>
        <p class="alert-title">Foundation Failure Risk — Smectitic Fat Clays</p>
        <p>Expansive smectitic clays (CH) pose extreme geotechnical hazards for civil infrastructure. Seasonal wet-dry cycling induces volume changes of up to 30–40% in highly plastic soils, causing catastrophic foundational heaving, floor cracking, and loss of bearing capacity. Standard pile-design friction correlations calibrated for clean sands are entirely inapplicable; site-specific Atterberg limit testing and USCS classification are mandatory before any foundation design on clay substrates.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Soil Orders</span></div>

  <!-- 6 · SOIL ORDERS -->
  <div class="section">
    <p class="section-label">Pedogenesis &amp; Taxonomy</p>
    <h2>Global Soil Orders Defined by Clay Dynamics</h2>
    <p>Within the USDA Soil Taxonomy framework, the clay fraction drives the formation and classification of major soil orders through two pedogenic processes: <strong>eluviation</strong> (downward leaching of clay from upper horizons) and <strong>illuviation</strong> (accumulation in lower subsoil). An "abrupt textural change" — where clay content literally doubles within 7.5 cm vertically — is a formally defined diagnostic property that drastically alters subsoil hydrology and root penetration across the profile.</p>
    <p>Two globally significant soil orders are virtually entirely defined by their extreme clay dynamics:</p>

    <div class="order-grid">
      <div class="order-card">
        <div class="order-header vertisol">Vertisols</div>
        <div class="order-body">
          <p class="order-tag">~2% of global ice-free land surface</p>
          <p>Defined by &gt;30% <strong>expanding smectite</strong>. Undergo dramatic volumetric changes with moisture — forming deep, wide cracks (&gt;1 m) during dry periods. This cracking induces violent pedoturbation (subsoil churning), preventing distinct genetic horizons from forming.</p>
          <p style="margin-top:.75rem;"><strong>Paradox:</strong> Innate chemical fertility is exceptionally high (immense smectite CEC), but physical management is notoriously difficult — a narrow window exists between rock-hard dryness and intractable wet stickiness. Tillage timing is critical.</p>
        </div>
      </div>
      <div class="order-card">
        <div class="order-header ultisol">Ultisols &amp; Oxisols</div>
        <div class="order-body">
          <p class="order-tag">Humid tropics &amp; subtropics — highly weathered</p>
          <p>High clay percentages but mineralogy is dominated by <strong>low-activity kaolinite</strong> and crystalline sesquioxides (iron and aluminum oxides). Despite a "clay" textural classification, CEC is very low — native chemical fertility is exceedingly poor.</p>
          <p style="margin-top:.75rem;">Zero capacity to weather new nutrients from primary minerals. Entirely dependent on rapid biological cycling between topsoil, microbial community, and standing biomass. Clearing the forest severs this cycle catastrophically.</p>
        </div>
      </div>
    </div>

    <div class="alert alert-info">
      <span class="alert-icon">ℹ</span>
      <div>
        <p class="alert-title">Mineralogy Matters as Much as Texture</p>
        <p>Two soils with identical 45% clay content can behave entirely differently depending on whether that clay is kaolinite (CEC 3–15 meq/100g, stable, tropical Oxisol) or smectite (CEC 80–120 meq/100g, expansive, temperate Vertisol). The USDA textural class identifies <em>how much</em> clay is present — but the clay mineral species determines <em>what it actually does</em>. Mineralogical characterization (XRD, EGME surface area) is essential for any precise fertilization or engineering design.</p>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Agronomy</span></div>

  <!-- 7 · AGRONOMY -->
  <div class="section">
    <p class="section-label">Agronomic Management</p>
    <h2>Assets, Challenges, and Management Strategies</h2>
    <p>Clay's extraordinary chemical fertility — enormous CEC that retains nutrients against leaching, high water storage capacity, and strong structural buffering — creates immense potential agricultural productivity. The challenge is not fertility but <em>access</em>: physical management must continuously work to generate and maintain the macroporosity that allows roots, water, and air to penetrate a matrix whose mineralogy inherently drives it toward structural collapse.</p>

    <div class="paradox-grid">
      <div class="paradox-card asset">
        <p class="paradox-title">Clay's agronomic assets</p>
        <ul>
          <li>High CEC (20–50+ meq/100g) retains base cations against leaching</li>
          <li>Strong pH buffering resists acidification from fertilizers and acid rain</li>
          <li>High total water storage — drought-resilient for deep-rooted crops</li>
          <li>Organo-mineral complexes protect SOM from microbial oxidation</li>
          <li>Low nutrient leaching risk — fertilizer efficiency is high</li>
          <li>High shrink-swell creates self-mulching (Vertisols)</li>
        </ul>
      </div>
      <div class="paradox-card liability">
        <p class="paradox-title">Clay's agronomic liabilities</p>
        <ul>
          <li>Hydrologic Group D — chronic waterlogging and surface runoff risk</li>
          <li>Root hypoxia under excessive rainfall — anaerobic fermentation stress</li>
          <li>Slow spring soil warming delays planting window</li>
          <li>Extreme compaction sensitivity when wet — tillage pan formation</li>
          <li>Shrink-swell cycling disrupts root systems and soil structure</li>
          <li>Plant available water paradoxically low (PWP very high)</li>
        </ul>
      </div>
    </div>

    <h3>Root Hypoxia and Waterlogging</h3>
    <p>In years of excessive precipitation, the near-zero K<sub>sat</sub> of structureless clay leads to chronic waterlogging. As micropores remain saturated, oxygen diffusion into the rhizosphere plummets to near zero, inducing rapid root oxygen deprivation. The anaerobic subsoil environment triggers microbial reduction of manganese and iron, producing characteristic gray soil mottling (redoximorphic depletions). Crops are forced into toxic fermentation respiration cycles, devastating yields. Heavy machinery traffic when the soil moisture is at or above its Plastic Limit compresses structural aggregates, creating persistent tillage pans that mechanically impede root penetration.</p>

    <div class="mgmt-grid">
      <div class="mgmt-card">
        <div class="mgmt-header tillage">Strategic Deep Tillage</div>
        <div class="mgmt-body">
          <ul>
            <li>Deep subsoiling shatters restrictive tillage pans — must be done when <em>dry</em> so clay shatters rather than smears plastically</li>
            <li>Reduces penetration resistance beneath crop rows; allows roots to access deeper moisture reserves</li>
            <li>Benefits last only 2–3 years without strict traffic control — follow with controlled-traffic farming to avoid re-compaction</li>
            <li>Immediately post-tillage, monitor and protect against bare soil evaporation losses, particularly in water-limited environments</li>
          </ul>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-header structure">No-Till &amp; Cover Crops</div>
        <div class="mgmt-body">
          <ul>
            <li>Conventional tillage systematically destroys earthworm channels, decayed root voids, and fungal hyphae networks critical for infiltration in heavy clays</li>
            <li>Continuous no-till preserves natural biopore networks; deep-rooting cover crops bore new macropores through the dense matrix</li>
            <li>Permanent residue cover moderates soil temperature, significantly reduces surface runoff and erosive sediment loading to watersheds</li>
            <li>Over time, increases effective K<sub>sat</sub> by maintaining biological macropore architecture</li>
          </ul>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-header amendment">Organic Amendments</div>
        <div class="mgmt-body">
          <ul>
            <li>Large organic matter additions physically space apart highly attractive colloidal layers, promoting stable granular peds over massive blocks</li>
            <li>Biochar application on clay loam can alter water retention curves and decrease bulk density — results highly sensitive to application rate and regional mineralogy</li>
            <li>Clay's high SSA protects organic carbon via organo-mineral complexes, enabling higher equilibrium SOM than sandy soils</li>
            <li>Compost additions also introduce microbial biomass that generates stabilizing glomalin and fungal hyphae</li>
          </ul>
        </div>
      </div>
      <div class="mgmt-card">
        <div class="mgmt-header sodic">Sodic Clay Remediation</div>
        <div class="mgmt-body">
          <ul>
            <li>Excess exchangeable sodium (Na⁺) completely disperses clay structure and eliminates permeability — soils become hard, impermeable slabs when dry</li>
            <li>Agricultural gypsum (CaSO₄) is the global standard: Ca²⁺ ions displace Na⁺ on exchange sites, chemically re-floculating dispersed clay into stable aggregates</li>
            <li>Leaching after gypsum application flushes displaced Na⁺ below the root zone — requires adequate drainage infrastructure</li>
            <li>Monitor Exchangeable Sodium Percentage (ESP) and Sodium Adsorption Ratio (SAR) regularly in irrigated arid regions</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="divider-ornament"><span>Beyond Agronomy</span></div>

  <!-- 8 · BROADER APPLICATIONS -->
  <div class="section">
    <p class="section-label">Applications Beyond Agriculture</p>
    <h2>Ecotoxicology, Engineering, and AI Classification</h2>

    <h3>Animal Science — Clay as Feed Additive</h3>
    <p>The immense binding capacity of smectite clay minerals has prompted their widespread adoption in animal production. Hygroscopic smectites are routinely mixed into commercial feed rations to adsorb and sequester mycotoxins (fungal toxins) within the gastrointestinal tract, preventing their absorption through the intestinal mucosa. This application leverages precisely the same surface chemistry that governs nutrient retention in agricultural soils.</p>
    <p>However, this binding capacity is non-specific. Ingested clays can also form stable complexes with dietary nutrients, pharmaceuticals, and inorganic micronutrients, reducing their bioavailability. Depending on grain size, surface charge density, and hydrophilic nature, clay particles may also directly interact with GI epithelial cells, potentially altering the animal microbiome or eliciting inflammatory responses. Trace heavy metal impurities in mined clay sources require rigorous toxicological screening before use.</p>

    <h3>Emerging AI Classification Methods</h3>
    <p>While Stokes' Law sedimentation (pipette and hydrometer methods) remains the analytical gold standard, cutting-edge research is deploying machine learning to automate texture classification. Recent studies have developed cascaded multiclass Convolutional Neural Networks (CNNs) that perform hierarchical, stage-wise classification of soil mixtures from USDA textural triangle frameworks — using a multispectral sensor with seven distinct optical bands. This approach achieved an overall accuracy of 88.8 percent across soil types via K-fold validation, paving the way for instantaneous, non-destructive, in-field classification without laboratory sedimentation.</p>

    <div class="alert alert-success">
      <span class="alert-icon">✓</span>
      <div>
        <p class="alert-title">Engineering Applications Where Clay is the Desired Material</p>
        <p>The same plasticity that causes foundational heaving in residential construction is deliberately exploited in large-scale environmental containment engineering. Clay cores for earth dams, aquaculture pond dikes, and toxic landfill liners specifically require heavy smectitic clay with Liquid Limit &gt;60% and Plastic Limit &gt;20% to ensure absolute impermeability. Clay is not a problem substrate — it is a precision engineering material with applications determined entirely by context.</p>
      </div>
    </div>
  </div>

  <hr class="divider">

  <!-- CONCLUSION -->
  <div class="section">
    <p class="section-label">Synthesis</p>
    <h2>Clay as the Biochemical Engine of the Pedosphere</h2>
    <p>The USDA clay textural class represents a category defined not merely by particle size, but by the emergence of entirely new physical and chemical phenomena at the colloidal scale. A soil needs only 40 percent clay — compared to 85 percent sand to be classified as sand — because 40 percent clay is sufficient to completely override the behavior of the remaining mineral matrix. The specific surface areas achievable by smectite (up to 800 m²/g versus 0.01–0.1 m²/g for quartz sand) explain everything that follows: the massive CEC, the high matric suction, the pH buffering, the shrink-swell dynamics, and the Hydrologic Group D runoff behavior.</p>
    <p>Yet the clay class is internally heterogeneous in a way that the sand class is not. Two soils with identical 45 percent clay content — one kaolinitic (tropical Oxisol, low CEC, low shrink-swell, geotechnically stable), one smectitic (Vertisol, extreme CEC, violent volume change, foundation hazard) — behave so differently that identical management of both would be catastrophic for at least one of them. The USDA textural classification is necessary but not sufficient; mineralogical characterization is required for any precision application.</p>
    <p>Successful management of clay soils demands a clear-eyed respect for its dual nature: extraordinary chemical fertility paired with severe physical constraints on drainage, aeration, and root penetration. The management objective is not to fight the clay mineralogy — which cannot be changed — but to engineer and maintain the macropore architecture that allows water, oxygen, and roots to access its chemical wealth. Conservation tillage, deep-rooting cover crops, strategic subsoiling timed to soil dryness, organic matter additions, and gypsum remediation for sodic clays are all tools aimed at the same goal: building structural pathways through a matrix whose chemistry is already rich, but whose physics must be perpetually worked to remain open.</p>
  </div>

<footer class="feature-footer"><strong>USDA Clay Soil Texture Class — Scientific Analysis</strong><br><br>
  Based on USDA Soil Survey Manual (2017), Soil Taxonomy, USCS/ASTM D-2487,<br>
  and peer-reviewed literature in pedology, colloidal chemistry, geotechnical engineering,<br>
  and agronomic science. Classification history: Atterberg (1905), Whitney (1911), Davis &amp; Bennett (1927), USDA revision (1938).</footer>
      `,
    },
  });
}

export function findArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

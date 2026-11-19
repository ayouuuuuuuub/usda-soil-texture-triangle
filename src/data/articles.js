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
//
// Long-form ("feature") articles: the Object.assign blocks below give them a title, excerpt, reading time
// and the hero's label, subtitle and meta bar. Their body is a separate file, src/data/features/<slug>.js
// (HTML in the shared feature-article components). A research report exported to Markdown is turned into
// one with scripts/import-article.py and a config in scripts/articles/<slug>.json.

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
      label: "USDA Soil Texture Triangle · Scientific Analysis",
      subtitle:
        "Mineralogy, hydraulics, geotechnics, and precision agronomic management of coarse-textured soils.",
      meta: [
        "Sand content > 85%",
        "Clay < 10%",
        "Particle size 0.05-2.0 mm",
        "CEC < 5 meq/100g",
      ],
      body: true,
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
      label: "USDA Soil Texture Triangle · Scientific Analysis",
      subtitle:
        "The transitional coarse-textured class between pure sand and sandy loam, with practical implications for water, nutrients, and management.",
      meta: [
        "Sand content 70-90%",
        "Clay usually < 15%",
        "Silt + 2 x clay < 30",
        "Low water retention",
      ],
      body: true,
    },
  });
}

const sandyLoamArticle = articles.find((article) => article.slug === "sandy-loam");

if (sandyLoamArticle) {
  Object.assign(sandyLoamArticle, {
    title: "The Sandy Loam Textural Class: USDA Triangle Guide",
    excerpt:
      "A complete guide to the sandy loam textural class, including USDA boundary rules, pedogenesis, geomechanics, hydraulic and thermal behavior, nutrient leaching, wind erosion, and agronomic management.",
    readingTime: "28 min read",
    feature: {
      label: "USDA Soil Texture Triangle · Scientific Analysis",
      subtitle:
        "Classification, pedogenesis, geomechanics, hydraulics, and biogeochemistry of one of the most widespread agricultural surface soils.",
      meta: [
        "Clay 7-20%",
        "Sand > 52%",
        "Silt + 2 x clay >= 30",
        "Wind erodibility group 3",
      ],
      body: true,
    },
  });
}

const loamArticle = articles.find((article) => article.slug === "loam");

if (loamArticle) {
  Object.assign(loamArticle, {
    title: "The Loam Textural Class: USDA Triangle Guide",
    excerpt:
      "A complete guide to the loam textural class, including USDA boundary rules, pore architecture, hydraulic models and pedotransfer functions, soil physical quality, compaction, aeration, carbon saturation, and hydrology.",
    readingTime: "26 min read",
    feature: {
      label: "USDA Soil Texture Triangle · Scientific Analysis",
      subtitle:
        "Pore architecture, hydraulic modeling, geomechanics, and carbon dynamics of the balanced centre of the texture triangle.",
      meta: [
        "Clay 7-27%",
        "Silt 28-50%",
        "Sand <= 52%",
        "Hydrologic soil group B",
      ],
      body: true,
    },
  });
}

const siltLoamArticle = articles.find((article) => article.slug === "silt-loam");

if (siltLoamArticle) {
  Object.assign(siltLoamArticle, {
    title: "The Silt Loam Textural Class: USDA Triangle Guide",
    excerpt:
      "A complete guide to the silt loam textural class, including USDA and international particle-size limits, pore structure and water retention, plasticity and collapse, erodibility, surface crusting, and conservation agriculture.",
    readingTime: "30 min read",
    feature: {
      label: "USDA Soil Texture Triangle · Scientific Analysis",
      subtitle:
        "Granulometry, hydraulics, geotechnics, erodibility, and conservation management of silt-dominated soils.",
      meta: [
        "Silt >= 50%",
        "Clay < 27%",
        "USCS class ML",
        "Highest USLE K-values",
      ],
      body: true,
    },
  });
}

const siltArticle = articles.find((article) => article.slug === "silt");

if (siltArticle) {
  Object.assign(siltArticle, {
    title: "The Silt Textural Class: USDA Triangle Guide",
    excerpt:
      "A complete guide to the silt textural class, including USDA and international particle-size limits, water retention and capillary rise, hydraulic models, shear strength, frost susceptibility, erodibility, piping, and loess.",
    readingTime: "26 min read",
    feature: {
      label: "USDA Soil Texture Triangle · Scientific Analysis",
      subtitle:
        "Particle-size limits, capillary hydraulics, geomechanics, erodibility, and pedogenesis of the silt corner of the texture triangle.",
      meta: [
        "Silt >= 80%",
        "Clay < 12%",
        "USCS class ML or MH",
        "Most frost-susceptible texture",
      ],
      body: true,
    },
  });
}

const sandyClayArticle = articles.find((article) => article.slug === "sandy-clay");

if (sandyClayArticle) {
  Object.assign(sandyClayArticle, {
    title: "The Sandy Clay Textural Class: USDA Triangle Guide",
    excerpt:
      "A complete guide to the sandy clay textural class, including USDA boundary rules, mineralogy, sand-clay microstructure, infiltration and hydraulic conductivity, shear strength, CEC, phosphorus fixation, sodicity, and conservation management.",
    readingTime: "23 min read",
    feature: {
      label: "USDA Soil Texture Triangle · Scientific Analysis",
      subtitle:
        "Mineralogy, microstructure, hydraulics, geomechanics, and biogeochemistry of a bimodal soil: a clay matrix carrying a large sand fraction.",
      meta: [
        "Clay >= 35%",
        "Sand > 45%",
        "USCS class CL or CH",
        "Low permeability",
      ],
      body: true,
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
      label: "USDA Soil Texture Triangle · Scientific Analysis",
      subtitle:
        "Mineralogy, colloidal chemistry, hydraulics, Atterberg limits, soil orders, and agronomic management of fine-textured clay soils.",
      meta: [
        "Clay content >= 40%",
        "High water retention",
        "High CEC potential",
        "Slow drainage",
      ],
      body: true,
    },
  });
}

export function findArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

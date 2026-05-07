export const TEXTURE_CLASSES = [
  "sand",
  "loamy sand",
  "sandy loam",
  "loam",
  "silt loam",
  "silt",
  "sandy clay loam",
  "clay loam",
  "silty clay loam",
  "sandy clay",
  "silty clay",
  "clay",
] as const;

export type TextureClass = (typeof TEXTURE_CLASSES)[number];

export type SoilFractions = {
  sand: number;
  silt: number;
  clay: number;
};

export function totalFractions({ sand, silt, clay }: SoilFractions) {
  return sand + silt + clay;
}

export function isValidSoilFractions(fractions: SoilFractions) {
  const values = [fractions.sand, fractions.silt, fractions.clay];
  return (
    values.every((value) => Number.isFinite(value) && value >= 0 && value <= 100) &&
    Math.abs(totalFractions(fractions) - 100) <= 0.05
  );
}

export function validationMessage(fractions: SoilFractions) {
  const values = [fractions.sand, fractions.silt, fractions.clay];
  if (!values.every((value) => Number.isFinite(value))) {
    return "Enter numeric percentages for sand, silt, and clay.";
  }
  if (!values.every((value) => value >= 0 && value <= 100)) {
    return "Each fraction must be between 0 and 100%.";
  }
  const total = totalFractions(fractions);
  if (Math.abs(total - 100) > 0.05) {
    return `Sand + silt + clay must equal 100%. Current total: ${total.toFixed(1)}%.`;
  }
  return "";
}

// USDA texture classes are encoded as boundary inequalities from the textural triangle.
// The sand and loamy sand limits use the NRCS convention based on silt + clay modifiers.
export function classifySoilTexture({ sand, silt, clay }: SoilFractions): TextureClass {
  if (silt >= 80 && clay < 12) return "silt";
  if (silt >= 50 && clay < 27) return "silt loam";
  if (clay >= 40 && silt >= 40) return "silty clay";
  if (clay >= 35 && sand > 45) return "sandy clay";
  if (clay >= 40) return "clay";
  if (clay >= 27 && clay < 40 && sand <= 20) return "silty clay loam";
  if (clay >= 27 && clay < 40 && sand > 20 && sand <= 45) return "clay loam";
  if (clay >= 20 && clay < 35 && sand > 45 && silt < 28) return "sandy clay loam";
  if (clay >= 7 && clay < 27 && silt >= 28 && silt < 50 && sand <= 52) return "loam";
  if (
    (clay >= 7 && clay < 20 && sand > 52 && silt + 2 * clay >= 30) ||
    (clay < 7 && silt < 50 && silt + 2 * clay >= 30)
  ) {
    return "sandy loam";
  }
  if (silt + 1.5 * clay < 15) return "sand";
  if (silt + 1.5 * clay >= 15 && silt + 2 * clay < 30) return "loamy sand";

  // Boundary tie-breaker for exact values that sit on shared lines after rounding.
  return "sandy loam";
}

export type PlotPoint = { x: number; y: number };

export const TRIANGLE = {
  width: 760,
  height: 660,
  vertices: {
    sand: { x: 72, y: 586 },
    silt: { x: 688, y: 586 },
    clay: { x: 380, y: 52 },
  },
};

export function ternaryToPoint({ sand, silt, clay }: SoilFractions): PlotPoint {
  const total = sand + silt + clay || 1;
  return {
    x:
      (sand * TRIANGLE.vertices.sand.x +
        silt * TRIANGLE.vertices.silt.x +
        clay * TRIANGLE.vertices.clay.x) /
      total,
    y:
      (sand * TRIANGLE.vertices.sand.y +
        silt * TRIANGLE.vertices.silt.y +
        clay * TRIANGLE.vertices.clay.y) /
      total,
  };
}

function cross(origin: PlotPoint, a: PlotPoint, b: PlotPoint) {
  return (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
}

function convexHull(points: PlotPoint[]) {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  if (sorted.length <= 1) return sorted;
  const lower: PlotPoint[] = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }
  const upper: PlotPoint[] = [];
  for (let index = sorted.length - 1; index >= 0; index -= 1) {
    const point = sorted[index];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

export type ClassRegion = {
  textureClass: TextureClass;
  polygon: PlotPoint[];
  labelPoint: PlotPoint;
};

export type ClassFill = {
  textureClass: TextureClass;
  path: string;
  labelPoint: PlotPoint;
};

const CLASS_POLYGONS: Record<TextureClass, SoilFractions[]> = {
  sand: [
    { sand: 100, silt: 0, clay: 0 },
    { sand: 85, silt: 15, clay: 0 },
    { sand: 90, silt: 0, clay: 10 },
  ],
  "loamy sand": [
    { sand: 85, silt: 15, clay: 0 },
    { sand: 70, silt: 30, clay: 0 },
    { sand: 85, silt: 0, clay: 15 },
    { sand: 90, silt: 0, clay: 10 },
  ],
  "sandy loam": [
    { sand: 70, silt: 30, clay: 0 },
    { sand: 50, silt: 50, clay: 0 },
    { sand: 43, silt: 50, clay: 7 },
    { sand: 52, silt: 41, clay: 7 },
    { sand: 52, silt: 28, clay: 20 },
    { sand: 80, silt: 0, clay: 20 },
    { sand: 85, silt: 0, clay: 15 },
  ],
  loam: [
    { sand: 43, silt: 50, clay: 7 },
    { sand: 52, silt: 41, clay: 7 },
    { sand: 52, silt: 28, clay: 20 },
    { sand: 45, silt: 28, clay: 27 },
    { sand: 23, silt: 50, clay: 27 },
  ],
  "silt loam": [
    { sand: 50, silt: 50, clay: 0 },
    { sand: 20, silt: 80, clay: 0 },
    { sand: 8, silt: 80, clay: 12 },
    { sand: 0, silt: 88, clay: 12 },
    { sand: 0, silt: 73, clay: 27 },
    { sand: 23, silt: 50, clay: 27 },
    { sand: 43, silt: 50, clay: 7 },
  ],
  silt: [
    { sand: 20, silt: 80, clay: 0 },
    { sand: 0, silt: 100, clay: 0 },
    { sand: 0, silt: 88, clay: 12 },
    { sand: 8, silt: 80, clay: 12 },
  ],
  "sandy clay loam": [
    { sand: 80, silt: 0, clay: 20 },
    { sand: 52, silt: 28, clay: 20 },
    { sand: 45, silt: 28, clay: 27 },
    { sand: 45, silt: 20, clay: 35 },
    { sand: 65, silt: 0, clay: 35 },
  ],
  "clay loam": [
    { sand: 45, silt: 28, clay: 27 },
    { sand: 20, silt: 53, clay: 27 },
    { sand: 20, silt: 40, clay: 40 },
    { sand: 45, silt: 15, clay: 40 },
    { sand: 45, silt: 20, clay: 35 },
  ],
  "silty clay loam": [
    { sand: 20, silt: 53, clay: 27 },
    { sand: 0, silt: 73, clay: 27 },
    { sand: 0, silt: 60, clay: 40 },
    { sand: 20, silt: 40, clay: 40 },
  ],
  "sandy clay": [
    { sand: 65, silt: 0, clay: 35 },
    { sand: 45, silt: 20, clay: 35 },
    { sand: 45, silt: 15, clay: 40 },
    { sand: 45, silt: 0, clay: 55 },
  ],
  "silty clay": [
    { sand: 20, silt: 40, clay: 40 },
    { sand: 0, silt: 60, clay: 40 },
    { sand: 0, silt: 40, clay: 60 },
  ],
  clay: [
    { sand: 45, silt: 15, clay: 40 },
    { sand: 20, silt: 40, clay: 40 },
    { sand: 0, silt: 40, clay: 60 },
    { sand: 0, silt: 0, clay: 100 },
    { sand: 45, silt: 0, clay: 55 },
  ],
};

type LatticePoint = {
  sand: number;
  clay: number;
};

type ClassifiedTriangle = {
  textureClass: TextureClass;
  points: SoilFractions[];
};

function centroid(samples: SoilFractions[]): SoilFractions {
  return samples.reduce(
    (sum, item) => ({
      sand: sum.sand + item.sand / samples.length,
      silt: sum.silt + item.silt / samples.length,
      clay: sum.clay + item.clay / samples.length,
    }),
    { sand: 0, silt: 0, clay: 0 },
  );
}

function averageFractions(samples: SoilFractions[]): SoilFractions {
  return samples.reduce(
    (sum, item) => ({
      sand: sum.sand + item.sand / samples.length,
      silt: sum.silt + item.silt / samples.length,
      clay: sum.clay + item.clay / samples.length,
    }),
    { sand: 0, silt: 0, clay: 0 },
  );
}

function trianglePath(points: SoilFractions[]) {
  const [start, ...rest] = points.map(ternaryToPoint);
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} ${rest
    .map((point) => `L${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ")}Z`;
}

function latticeToFractions({ sand, clay }: LatticePoint): SoilFractions {
  return { sand, silt: 100 - sand - clay, clay };
}

function latticeKey(point: LatticePoint) {
  return `${point.sand},${point.clay}`;
}

function edgeKey(a: LatticePoint, b: LatticePoint) {
  const aKey = latticeKey(a);
  const bKey = latticeKey(b);
  return aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
}

function buildClassifiedTriangles(): ClassifiedTriangle[] {
  const triangles: ClassifiedTriangle[] = [];

  for (let sand = 0; sand <= 99; sand += 1) {
    for (let clay = 0; clay <= 99 - sand; clay += 1) {
      const lowerLeft = { sand, clay };
      const lowerRight = { sand: sand + 1, clay };
      const upperLeft = { sand, clay: clay + 1 };
      const firstTriangle = [lowerLeft, lowerRight, upperLeft].map(latticeToFractions);
      triangles.push({
        textureClass: classifySoilTexture(centroid(firstTriangle)),
        points: firstTriangle,
      });

      if (sand + clay <= 98) {
        const upperRight = { sand: sand + 1, clay: clay + 1 };
        const secondTriangle = [lowerRight, upperRight, upperLeft].map(latticeToFractions);
        triangles.push({
          textureClass: classifySoilTexture(centroid(secondTriangle)),
          points: secondTriangle,
        });
      }
    }
  }

  return triangles;
}

export function buildClassRegions(): ClassRegion[] {
  return TEXTURE_CLASSES.map((textureClass) => {
    const points: PlotPoint[] = [];
    const fractions: SoilFractions[] = [];
    for (let sand = 0; sand <= 100; sand += 1) {
      for (let clay = 0; clay <= 100 - sand; clay += 1) {
        const silt = 100 - sand - clay;
        const sample = { sand, silt, clay };
        if (classifySoilTexture(sample) === textureClass) {
          points.push(ternaryToPoint(sample));
          fractions.push(sample);
        }
      }
    }
    const average = averageFractions(fractions);

    return {
      textureClass,
      polygon: convexHull(points),
      labelPoint: ternaryToPoint(average),
    };
  });
}

export function buildClassFills(): ClassFill[] {
  return TEXTURE_CLASSES.map((textureClass) => {
    const samples = CLASS_POLYGONS[textureClass];
    return {
      textureClass,
      path: trianglePath(samples),
      labelPoint: ternaryToPoint(averageFractions(samples)),
    };
  });
}

export function buildClassBoundaryPath() {
  const edges = new Map<string, { textureClass: TextureClass; points: SoilFractions[] }>();
  const boundarySegments: string[] = [];

  for (const triangle of buildClassifiedTriangles()) {
    const latticePoints = triangle.points.map(({ sand, clay }) => ({ sand, clay }));
    const edgePairs = [
      [latticePoints[0], latticePoints[1]],
      [latticePoints[1], latticePoints[2]],
      [latticePoints[2], latticePoints[0]],
    ];

    for (const [start, end] of edgePairs) {
      const key = edgeKey(start, end);
      const previous = edges.get(key);
      if (!previous) {
        edges.set(key, {
          textureClass: triangle.textureClass,
          points: [latticeToFractions(start), latticeToFractions(end)],
        });
      } else if (previous.textureClass !== triangle.textureClass) {
        const [a, b] = previous.points.map(ternaryToPoint);
        boundarySegments.push(
          `M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}`,
        );
      }
    }
  }

  return boundarySegments.join(" ");
}

function lineSegmentPath(start: SoilFractions, end: SoilFractions) {
  const a = ternaryToPoint(start);
  const b = ternaryToPoint(end);
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)}L${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

export function buildAnalyticalBoundaryPath() {
  const segments = [
    // Sand / loamy sand: silt + 1.5 * clay = 15.
    lineSegmentPath({ sand: 85, silt: 15, clay: 0 }, { sand: 90, silt: 0, clay: 10 }),
    // Loamy sand / sandy loam: silt + 2 * clay = 30.
    lineSegmentPath({ sand: 70, silt: 30, clay: 0 }, { sand: 85, silt: 0, clay: 15 }),
    // Sandy loam / sandy clay loam.
    lineSegmentPath({ sand: 80, silt: 0, clay: 20 }, { sand: 52, silt: 28, clay: 20 }),
    // Sandy loam / loam.
    lineSegmentPath({ sand: 52, silt: 28, clay: 20 }, { sand: 52, silt: 41, clay: 7 }),
    lineSegmentPath({ sand: 52, silt: 41, clay: 7 }, { sand: 43, silt: 50, clay: 7 }),
    // Sandy loam / silt loam.
    lineSegmentPath({ sand: 50, silt: 50, clay: 0 }, { sand: 43, silt: 50, clay: 7 }),
    // Loam / silt loam and clay loam transitions.
    lineSegmentPath({ sand: 52, silt: 28, clay: 20 }, { sand: 45, silt: 28, clay: 27 }),
    lineSegmentPath({ sand: 23, silt: 50, clay: 27 }, { sand: 43, silt: 50, clay: 7 }),
    // Clay loam family boundaries.
    lineSegmentPath({ sand: 45, silt: 28, clay: 27 }, { sand: 45, silt: 20, clay: 35 }),
    lineSegmentPath({ sand: 20, silt: 40, clay: 40 }, { sand: 20, silt: 53, clay: 27 }),
    lineSegmentPath({ sand: 20, silt: 53, clay: 27 }, { sand: 23, silt: 50, clay: 27 }),
    lineSegmentPath({ sand: 45, silt: 20, clay: 35 }, { sand: 65, silt: 0, clay: 35 }),
    // High-clay boundaries.
    lineSegmentPath({ sand: 45, silt: 15, clay: 40 }, { sand: 20, silt: 40, clay: 40 }),
    lineSegmentPath({ sand: 20, silt: 40, clay: 40 }, { sand: 0, silt: 60, clay: 40 }),
    lineSegmentPath({ sand: 45, silt: 15, clay: 40 }, { sand: 45, silt: 20, clay: 35 }),
    lineSegmentPath({ sand: 45, silt: 15, clay: 40 }, { sand: 45, silt: 0, clay: 55 }),
    // Silt / silt loam.
    lineSegmentPath({ sand: 20, silt: 80, clay: 0 }, { sand: 8, silt: 80, clay: 12 }),
    lineSegmentPath({ sand: 8, silt: 80, clay: 12 }, { sand: 0, silt: 88, clay: 12 }),
  ];

  return segments.join(" ");
}

export function polygonPoints(points: PlotPoint[]) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

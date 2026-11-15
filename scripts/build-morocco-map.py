"""Build the mission map of the portfolio page: src/portfolio/moroccoMap.js.

Reads the outlines of Morocco's 12 regions (2015 division) and writes them as simplified SVG paths, so the
page draws the map without any mapping library.

Source data: OpenStreetMap administrative boundaries (admin_level 4, ISO3166-2 MA-01 to MA-12), fetched as
GeoJSON from Nominatim:
  https://nominatim.openstreetmap.org/lookup?osm_ids=R1592819,R1719443,R2424034,R2424036,R2424040,R2424085,
  R2424086,R2424260,R3406823,R4730737,R4730909,R4734547&format=geojson&polygon_geojson=1
(c) OpenStreetMap contributors, ODbL. The download is not kept in the repository.

Usage:  python scripts/build-morocco-map.py <regions.geojson> [preview.png]

The borders are simplified together (shared lines are simplified once), so neighbouring regions still meet
exactly. Projection: equirectangular with its standard parallel through the middle of the country, which is
linear, so the page can turn a pointer position back into latitude and longitude.
"""
import json
import math
import sys

import geopandas as gpd
from shapely.geometry import MultiPolygon, Polygon
from shapely.ops import linemerge, polygonize, unary_union

# OSM relation id -> (id used by the page, name shown on the page), listed north to south
REGIONS = {
    1592819: ('tanger', 'Tanger-Tétouan-Al Hoceïma'),
    1719443: ('oriental', 'Oriental'),
    4730909: ('fes', 'Fès-Meknès'),
    4730737: ('rabat', 'Rabat-Salé-Kénitra'),
    2424085: ('casablanca', 'Casablanca-Settat'),
    4734547: ('beni-mellal', 'Béni Mellal-Khénifra'),
    2424086: ('marrakech', 'Marrakech-Safi'),
    2424034: ('draa', 'Drâa-Tafilalet'),
    2424036: ('souss', 'Souss-Massa'),
    2424040: ('guelmim', 'Guelmim-Oued Noun'),
    2424260: ('laayoune', 'Laâyoune-Sakia El Hamra'),
    3406823: ('dakhla', 'Dakhla-Oued Ed-Dahab'),
}

TOLERANCE = 0.035     # degrees, about 3.5 km: the drawing is a sheet, not a cadastre
MIN_AREA = 0.02       # square degrees: islets and slivers below this are dropped
UNIT = 60.0           # SVG units per degree of latitude
PAD = 46.0            # room around the country for the graticule labels


def main():
    source = sys.argv[1]
    preview = sys.argv[2] if len(sys.argv) > 2 else None
    frame = gpd.read_file(source)
    frame['osm_id'] = frame['osm_id'].astype(int)
    frame = frame[frame['osm_id'].isin(REGIONS)]
    assert len(frame) == len(REGIONS), f'expected {len(REGIONS)} regions, found {len(frame)}'
    originals = {int(row.osm_id): row.geometry.buffer(0) for row in frame.itertuples()}

    # one linework for the whole country, cut at every junction, then simplified line by line
    lines = unary_union([geometry.boundary for geometry in originals.values()])
    merged = linemerge(lines)
    parts = list(merged.geoms) if hasattr(merged, 'geoms') else [merged]
    simple = unary_union([part.simplify(TOLERANCE, preserve_topology=False) for part in parts])
    faces = [face for face in polygonize(simple) if face.area >= MIN_AREA]

    shapes = {osm_id: [] for osm_id in REGIONS}
    for face in faces:
        point = face.representative_point()
        owner = next((osm_id for osm_id, geometry in originals.items() if geometry.contains(point)), None)
        if owner is not None:
            shapes[owner].append(face)
    for osm_id, pieces in shapes.items():
        assert pieces, f'region {REGIONS[osm_id][0]} lost in simplification'

    country = unary_union([piece for pieces in shapes.values() for piece in pieces])
    west, south, east, north = country.bounds
    mid = math.radians((south + north) / 2)
    kx, ky = UNIT * math.cos(mid), UNIT
    lon0, lat0 = west - PAD / kx, north + PAD / ky
    width = (east - west) * kx + 2 * PAD
    height = (north - south) * ky + 2 * PAD

    def project(lon, lat):
        return (lon - lon0) * kx, (lat0 - lat) * ky

    def number(value):
        text = f'{value:.1f}'
        return text[:-2] if text.endswith('.0') else text

    def ring_path(ring):
        points = [project(x, y) for x, y in ring.coords[:-1]]
        return 'M' + 'L'.join(f'{number(x)} {number(y)}' for x, y in points) + 'Z'

    def path(geometry):
        polygons = geometry.geoms if isinstance(geometry, MultiPolygon) else [geometry]
        return ''.join(ring_path(polygon.exterior) + ''.join(ring_path(hole) for hole in polygon.interiors) for polygon in polygons)

    def length(geometry):
        """Outline length in SVG units, for the draw-in animation."""
        polygons = geometry.geoms if isinstance(geometry, MultiPolygon) else [geometry]
        total = 0.0
        for polygon in polygons:
            for ring in [polygon.exterior, *polygon.interiors]:
                points = [project(x, y) for x, y in ring.coords]
                total += sum(math.dist(a, b) for a, b in zip(points, points[1:]))
        return round(total)

    regions = []
    for osm_id, (key, name) in REGIONS.items():
        geometry = unary_union(shapes[osm_id])
        largest = max(geometry.geoms, key=lambda g: g.area) if isinstance(geometry, MultiPolygon) else geometry
        # the station sits well inside the region: the deepest point of its largest piece
        station = largest.buffer(-0.5 * math.sqrt(largest.area / math.pi)).representative_point()
        if station.is_empty:
            station = largest.representative_point()
        sx, sy = project(station.x, station.y)
        x0, y1 = project(geometry.bounds[0], geometry.bounds[1])
        x1, y0 = project(geometry.bounds[2], geometry.bounds[3])
        regions.append({
            'id': key, 'name': name, 'd': path(geometry), 'len': length(geometry),
            'at': [round(sx, 1), round(sy, 1)],
            'box': [round(x0, 1), round(y0, 1), round(x1 - x0, 1), round(y1 - y0, 1)],
        })

    outline = country if isinstance(country, (Polygon, MultiPolygon)) else country.buffer(0)
    data = {
        'width': round(width, 1), 'height': round(height, 1),
        'proj': {'lon0': round(lon0, 5), 'lat0': round(lat0, 5), 'kx': round(kx, 4), 'ky': ky},
        'outline': path(outline), 'outlineLen': length(outline),
        'regions': regions,
    }
    header = (
        '// Generated by scripts/build-morocco-map.py: do not edit by hand.\n'
        "// Morocco's 12 regions as simplified SVG paths. Boundaries (c) OpenStreetMap contributors, ODbL.\n"
        '// x = (lon - lon0) * kx, y = (lat0 - lat) * ky\n'
    )
    with open('src/portfolio/moroccoMap.js', 'w', encoding='utf-8', newline='\n') as out:
        out.write(header + 'export const MOROCCO = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    size = sum(len(region['d']) for region in regions) + len(data['outline'])
    print(f'{len(regions)} regions, {len(faces)} faces, {size} path characters, sheet {data["width"]} x {data["height"]}')

    if preview:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        figure, axis = plt.subplots(figsize=(8, 9))
        for osm_id, (key, _) in REGIONS.items():
            geometry = unary_union(shapes[osm_id])
            gpd.GeoSeries([geometry]).plot(ax=axis, facecolor='#e9e2cc', edgecolor='#17302a', linewidth=0.8)
        for region in regions:
            lon = region['at'][0] / kx + lon0
            lat = lat0 - region['at'][1] / ky
            axis.plot(lon, lat, '^', color='#b4532f')
            axis.annotate(region['id'], (lon, lat), fontsize=7)
        axis.set_aspect(1 / math.cos(mid))
        figure.savefig(preview, dpi=110, bbox_inches='tight')


if __name__ == '__main__':
    main()

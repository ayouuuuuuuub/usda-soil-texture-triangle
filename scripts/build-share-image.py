"""Build the link-preview image of the portfolio page: public/portfolio/share.jpg (1200 x 630).

The card uses the page's own palette, logo, headline and mission map (src/portfolio/moroccoMap.js).
Fonts: Red Hat Display and Red Hat Mono (SIL Open Font License), variable TTF files from
https://github.com/google/fonts (ofl/redhatdisplay, ofl/redhatmono); they are not kept in the repository.

Usage:  python scripts/build-share-image.py <folder with RedHatDisplay.ttf and RedHatMono.ttf>
"""
import json
import math
import os
import re
import sys

from PIL import Image, ImageDraw, ImageFont

W, H, S = 1200, 630, 3          # final size, and the supersampling factor that smooths the lines
NIGHT, FOREST = (23, 48, 42), (33, 75, 63)
PAPER, SAGE, SAND, SAND2 = (244, 241, 232), (122, 136, 106), (201, 182, 122), (220, 203, 147)
STUDIED = ['oriental', 'rabat', 'casablanca', 'beni-mellal', 'marrakech', 'guelmim', 'laayoune']


def rings(d):
    """SVG path data made of M/L/Z only -> list of rings of (x, y)."""
    out = []
    for part in d.split('Z'):
        numbers = [float(n) for n in re.findall(r'-?\d+(?:\.\d+)?', part)]
        if numbers:
            out.append(list(zip(numbers[0::2], numbers[1::2])))
    return out


def main():
    fonts = sys.argv[1]
    data = json.loads(open('src/portfolio/moroccoMap.js', encoding='utf-8').read().split('export const MOROCCO = ', 1)[1].rstrip().rstrip(';'))

    def font(name, size, weight):
        face = ImageFont.truetype(os.path.join(fonts, name), size * S)
        face.set_variation_by_axes([weight])
        return face

    image = Image.new('RGB', (W * S, H * S), NIGHT)
    # a soft light behind the map, as on the page's map plate
    glow = Image.new('L', (W, H), 0)
    pixels = glow.load()
    for y in range(H):
        for x in range(W):
            distance = math.hypot((x - 880) / 620, (y - 250) / 430)
            pixels[x, y] = int(120 * max(0.0, 1 - distance) ** 1.4)
    image.paste(Image.new('RGB', image.size, FOREST), (0, 0), glow.resize(image.size, Image.BILINEAR))

    # the map: fitted on the right
    scale = (H - 2 * 26) / data['height']
    ox, oy = W - 54 - data['width'] * scale, 26
    place = lambda x, y: ((ox + x * scale) * S, (oy + y * scale) * S)

    def overlay(colour, alpha, draw_on):
        layer = Image.new('L', image.size, 0)
        draw_on(ImageDraw.Draw(layer))
        image.paste(Image.new('RGB', image.size, colour), (0, 0), layer.point(lambda v: int(v * alpha)))

    proj = data['proj']
    def graticule(pen):
        for lon in (-15, -10, -5):
            x = (lon - proj['lon0']) * proj['kx']
            for y in range(0, int(data['height']), 14):
                pen.line([place(x, y), place(x, y + 4)], fill=255, width=S)
        for lat in (25, 30, 35):
            y = (proj['lat0'] - lat) * proj['ky']
            for x in range(0, int(data['width']), 14):
                pen.line([place(x, y), place(x + 4, y)], fill=255, width=S)
    overlay(PAPER, 0.12, graticule)

    regions = {region['id']: region for region in data['regions']}
    for key in STUDIED:  # tint, then contour-like hatching kept inside the region
        shape = Image.new('L', image.size, 0)
        pen = ImageDraw.Draw(shape)
        for ring in rings(regions[key]['d']):
            pen.polygon([place(x, y) for x, y in ring], fill=255)
        image.paste(Image.new('RGB', image.size, SAND), (0, 0), shape.point(lambda v: int(v * 0.16)))
        waves = Image.new('L', image.size, 0)
        pen = ImageDraw.Draw(waves)
        x0, y0, w, h = regions[key]['box']
        left, top = place(x0, y0)
        right, bottom = place(x0 + w, y0 + h)
        y = top - 40 * S
        while y < bottom + 40 * S:
            line = []
            x = left - 10 * S
            while x < right + 10 * S:
                line.append((x, y + 1.6 * S * math.sin(x / (3.6 * S)) - 0.28 * (x - left)))
                x += S
            pen.line(line, fill=255, width=max(1, round(0.8 * S)))
            y += 5.2 * S
        mask = Image.composite(waves, Image.new('L', image.size, 0), shape)
        image.paste(Image.new('RGB', image.size, SAND), (0, 0), mask.point(lambda v: int(v * 0.6)))

    def outlines(keys, width):
        def draw_on(pen):
            for key in keys:
                for ring in rings(regions[key]['d']):
                    points = [place(x, y) for x, y in ring]
                    pen.line(points + points[:1], fill=255, width=width, joint='curve')
        return draw_on
    overlay(PAPER, 0.3, outlines([key for key in regions if key not in STUDIED], S))
    overlay(SAND2, 0.85, outlines(STUDIED, S))

    def coast(pen):
        for ring in rings(data['outline']):
            points = [place(x, y) for x, y in ring]
            pen.line(points + points[:1], fill=255, width=round(1.6 * S), joint='curve')
    overlay(PAPER, 0.9, coast)

    pen = ImageDraw.Draw(image)
    for key in STUDIED:  # stations
        x, y = place(*regions[key]['at'])
        peg = [(x, y - 9 * S), (x + 8 * S, y + 5 * S), (x - 8 * S, y + 5 * S)]
        pen.polygon(peg, fill=SAND2, outline=NIGHT, width=round(1.5 * S))

    # the words
    def write(text, x, y, face, colour, tracking=0.0):
        for char in text:
            pen.text((x * S, y * S), char, font=face, fill=colour)
            x += face.getlength(char) / S + tracking
        return x

    for i, colour in enumerate((PAPER, SAGE, SAND)):  # the Soil Logic mark: three bars, leaning
        top = 72 + i * 11
        pen.polygon([(72 * S, (top + 6) * S), (102 * S, top * S), (102 * S, (top + 6) * S), (72 * S, (top + 12) * S)], fill=colour)
    write('Soil Logic', 118, 68, font('RedHatDisplay.ttf', 30, 500), PAPER, -0.8)

    headline = font('RedHatDisplay.ttf', 66, 400)
    for i, line in enumerate(['I read the land', 'before the project', 'is drawn.']):
        write(line, 70, 196 + i * 72, headline, PAPER, -2.2)

    mono = font('RedHatMono.ttf', 19, 400)
    write('Soil, water and land studies', 72, 452, mono, SAND)
    write('Morocco and Mauritania', 72, 482, mono, SAND)
    write('soil-logic.com/portfolio', 72, 548, font('RedHatMono.ttf', 17, 400), (160, 170, 158))

    image.resize((W, H), Image.LANCZOS).save('public/portfolio/share.jpg', quality=88, optimize=True, progressive=True)
    print('public/portfolio/share.jpg', os.path.getsize('public/portfolio/share.jpg'), 'bytes')


if __name__ == '__main__':
    main()

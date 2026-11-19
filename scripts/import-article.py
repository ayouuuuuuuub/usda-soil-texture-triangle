"""Turn a research report exported as Markdown (Google Docs / Gemini Deep Research export) into a
Soil Logic feature article body.

    python scripts/import-article.py <report.md> <slug> scripts/articles/<slug>.json

Writes:
  src/data/features/<slug>.js         the article body (HTML), loaded on demand by the article page
  public/articles/eq/<slug>/*.png     the report's inline equations, which the export stores as images

What it does to the text:
  - each "##" heading opens a section (section-label + h2), with a divider-ornament between sections;
    "###" headings become h3, as in the other feature articles
  - pipe tables become table-wrapper tables; a last row "Table N: ..." becomes the table's caption
  - citation numbers glued to the end of a word ("triangle1.") become superscript links to the
    works-cited list at the end of the article
  - the export's escapes (\\-, \\~, \\$ ...) and its inline LaTeX fragments (^{-1}, \\_2) are cleaned up

labels.json: {"intro": {"label": ..., "h2": ...} or null (for text that comes before the first "##"),
"sections": for each "##" heading in order {"label": short label above it, "divider": word in the
divider before it, or null, "h2": optional title replacing a generic heading such as "Conclusion"}, "facts": [[value, label], ...] shown at the end of the first section,
"footer": {"title": ..., "note": ...}}.
"""
import base64
import html
import json
import os
import re
import sys

src, slug, labels_file = sys.argv[1], sys.argv[2], sys.argv[3]
text = open(src, encoding="utf-8").read().replace("\r\n", "\n")
config = json.load(open(labels_file, encoding="utf-8"))
labels = config["sections"]
# hand fixes for citation numbers the export glued to a real number ("exceed 304." = 30, citation 4)
for find, replace in config.get("fixes", []):
    assert find in text, f"fix not found: {find}"
    text = text.replace(find, replace)

# ------------------------------------------------------------------------------------------- images
images = dict(re.findall(r"^\[(image\d+)\]: <data:image/png;base64,([A-Za-z0-9+/=]+)>", text, re.M))
text = re.sub(r"^\[image\d+\]: <data:image/[^>]+>\s*$", "", text, flags=re.M)
eq_dir = os.path.join("public", "articles", "eq", slug)
os.makedirs(eq_dir, exist_ok=True)
for name, data in images.items():
    with open(os.path.join(eq_dir, f"{name}.png"), "wb") as handle:
        handle.write(base64.b64decode(data))


def png_size(name):
    raw = base64.b64decode(images[name])
    return int.from_bytes(raw[16:20], "big"), int.from_bytes(raw[20:24], "big")


# ------------------------------------------------------------------------------------ body / refs
body, _, refs_text = text.partition("#### **Works cited**")
refs = []
for line in refs_text.splitlines():
    match = re.match(r"^>\s*(\d+)\.\s*(.+?)\s*$", line)
    if match:
        refs.append(match.group(2))
ref_count = len(refs)

# The title line is replaced by the page's own hero.
body = re.sub(r"^# .*\n", "", body, count=1)


def inline(raw):
    """Markdown inline -> HTML, for one line of the body."""
    s = raw
    # tokens that must survive escaping: images and links
    tokens = []

    def keep(fragment):
        tokens.append(fragment)
        return f"\x00{len(tokens) - 1}\x00"

    def image(match):
        name = match.group(1)
        width, height = png_size(name)
        return keep(
            f'<img class="eq" src="/articles/eq/{slug}/{name}.png" width="{width}" '
            f'height="{height}" alt="" loading="lazy" decoding="async">'
        )

    s = re.sub(r"!\[\]\[(image\d+)\]", image, s)
    s = re.sub(
        r"\[([^\]]+)\]\((https?://[^)\s]+)\)",
        lambda m: keep(f'<a href="{html.escape(m.group(2), quote=True)}" rel="noopener" target="_blank">{html.escape(m.group(1).replace(chr(92), ""))}</a>'),
        s,
    )
    # the export's backslash escapes
    s = re.sub(r"\\([\\`*_{}\[\]()#+\-.!~<>$|&=:\"'])", r"\1", s)
    s = s.replace("θ\\thetaθ", "θ").replace("\\theta", "θ")
    # inline LaTeX fragments: $^3$, $^{-1}$, $_2$, $_3^-$
    def latex(match):
        inner = match.group(1)
        inner = re.sub(r"\^\{([^}]*)\}", r"<sup>\1</sup>", inner)
        inner = re.sub(r"\^([^\s<{]+)", r"<sup>\1</sup>", inner)
        inner = re.sub(r"_\{([^}]*)\}", r"<sub>\1</sub>", inner)
        inner = re.sub(r"_([^\s<{^]+)", r"<sub>\1</sub>", inner)
        return keep(inner.replace("-", "−"))

    s = re.sub(r"\$([^$\n]{1,60})\$", latex, s)
    s = html.escape(s, quote=False)
    # bold, italic
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", s)

    # citations: digits glued to the end of a word, a bracket or a quote, below the number of references.
    # "Model H1" ... "H5" and similar labels are left alone.
    def cite(match):
        lead, number = match.group(1), match.group(2)
        if re.search(r"(^|[^A-Za-z])H$", lead) or not 1 <= int(number) <= ref_count:
            return match.group(0)
        return f'{lead}<sup class="cite"><a href="#{slug}-ref-{number}">{number}</a></sup>'

    s = re.sub(r"([A-Za-z\)\]%\"'”’\x00]|</strong>|</em>)(\d{1,3})(?=[\s.,;:)\]|]|$)", cite, s)
    s = re.sub(r"\{cite:(\d+)\}", lambda m: f'<sup class="cite"><a href="#{slug}-ref-{m.group(1)}">{m.group(1)}</a></sup>', s)
    s = re.sub(r"\x00(\d+)\x00", lambda m: tokens[int(m.group(1))], s)
    return s.strip()


def unnumber(heading):
    """ "1\\. Introduction" or "5.1. Hysteresis" -> the title alone: the feature articles number nothing."""
    return re.sub(r"^\d+(?:\\?\.\d+)*\\?\.\s+", "", heading.strip())


def row_cells(line):
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    return cells


out = []
section_index = -1
in_section = False
para_list = None
lines = body.split("\n")
i = 0


def facts_html():
    cards = "".join(
        f'\n      <div class="fact-card">\n        <span class="fact-value">{v}</span>\n        <span class="fact-label">{l}</span>\n      </div>'
        for v, l in config.get("facts", [])
    )
    return f'    <div class="fact-grid">{cards}\n    </div>' if cards else ""


facts_done = False


def close_section():
    global facts_done
    if not facts_done:
        out.append(facts_html())
        facts_done = True
    out.append("  </div>")


def close_list():
    global para_list
    if para_list is not None:
        out.append("    <ul>\n" + "\n".join(f"      <li>{item}</li>" for item in para_list) + "\n    </ul>")
        para_list = None


while i < len(lines):
    line = lines[i].rstrip()
    stripped = line.strip()
    if not stripped:
        close_list()
        i += 1
        continue
    if stripped.startswith("## "):
        close_list()
        section_index += 1
        if in_section:
            close_section()
        meta = labels[section_index]
        if meta.get("divider"):
            out.append(f'\n  <div class="divider-ornament"><span>{html.escape(meta["divider"])}</span></div>\n')
        heading = html.escape(meta["h2"]) if meta.get("h2") else inline(unnumber(stripped[3:].replace("**", "")))
        out.append(f'  <div class="section">\n    <p class="section-label">{html.escape(meta["label"])}</p>\n    <h2>{heading}</h2>')
        in_section = True
        i += 1
        continue
    if stripped.startswith("### "):
        close_list()
        out.append(f"    <h3>{inline(unnumber(stripped[4:].replace('**', '')))}</h3>")
        i += 1
        continue
    if stripped.startswith("|"):
        close_list()
        rows = []
        while i < len(lines) and lines[i].strip().startswith("|"):
            rows.append(row_cells(lines[i]))
            i += 1
        header, rest = rows[0], [r for r in rows[1:] if not all(re.fullmatch(r":?-{2,}:?", c) for c in r if c)]
        caption = None
        if rest and re.match(r"Table \d+", rest[-1][0]) and not any(rest[-1][1:]):
            caption = inline(rest[-1][0])
            rest = rest[:-1]
        first_col_bold = all(c[0].startswith("**") for c in rest) if rest else False
        table = ['    <div class="table-wrapper">', "      <table>"]
        if caption:
            table.append(f"        <caption>{caption}</caption>")
        table.append("        <thead>\n          <tr>" + "".join(f"<th>{inline(c)}</th>" for c in header) + "</tr>\n        </thead>")
        table.append("        <tbody>")
        for r in rest:
            cells = []
            for n, c in enumerate(r):
                bold = c.startswith("**") and c.endswith("**")
                content = inline(c[2:-2] if bold else c)
                cls = ' class="highlight"' if (n == 0 and (first_col_bold or bold)) or (n > 0 and bold) else ""
                cells.append(f"<td{cls}>{content}</td>")
            table.append("          <tr>" + "".join(cells) + "</tr>")
        table.append("        </tbody>\n      </table>\n    </div>")
        out.append("\n".join(table))
        continue
    if re.match(r"^[*-]\s+", stripped):
        if para_list is None:
            para_list = []
        para_list.append(inline(re.sub(r"^[*-]\s+", "", stripped)))
        i += 1
        continue
    close_list()
    if not in_section:
        intro = config["intro"]
        out.append(f'  <div class="section">\n    <p class="section-label">{html.escape(intro["label"])}</p>\n    <h2>{html.escape(intro["h2"])}</h2>')
        in_section = True
    content = inline(stripped)
    if re.fullmatch(r'(<img class="eq"[^>]*>\s*)+', content):
        # an equation on its own line: set it in a formula box, as the other feature articles do
        out.append(f'    <div class="formula-box"><div class="formula">{content}</div></div>')
    else:
        out.append(f"    <p>{content}</p>")
    i += 1

close_list()
if in_section:
    close_section()

ref_items = []
for n, ref in enumerate(refs, 1):
    ref_items.append(f'      <li id="{slug}-ref-{n}">{inline(ref)}</li>')
footer = config["footer"]

doc = "\n".join(out)
doc += f"""

<footer class="feature-footer"><strong>{html.escape(footer['title'])}</strong><br><br>
  {footer['note']}
  <details class="feature-refs">
    <summary>Works cited ({ref_count})</summary>
    <ol>
{chr(10).join(ref_items)}
    </ol>
  </details>
</footer>
"""

os.makedirs(os.path.join("src", "data", "features"), exist_ok=True)
with open(os.path.join("src", "data", "features", f"{slug}.js"), "w", encoding="utf-8", newline="\n") as handle:
    handle.write(f"// The {slug} feature article body. Generated from the research report by scripts/import-article.py.\n")
    handle.write("export default " + json.dumps(doc, ensure_ascii=False) + ";\n")

words = len(re.sub(r"<[^>]+>", " ", doc).split())
print(f"{slug}: {section_index + 1} sections, {len(images)} equations, {ref_count} references, {words} words")

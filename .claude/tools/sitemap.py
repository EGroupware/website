#!/usr/bin/env python3
"""sitemap.xml aus den Seiten neu erzeugen.

Aufruf im Repo-Hauptordner:
    python3 .claude/tools/sitemap.py          # sitemap.xml neu schreiben
    python3 .claude/tools/sitemap.py --check  # nur pruefen, nichts schreiben

Aufgenommen wird jede Seite unter de/ und en/, ausser
  - Weiterleitungen (meta refresh),
  - Seiten mit "noindex",
  - Vorschau-Seiten (vorschau-design-*).
Die Sprachverweise (hreflang) kommen aus dem <head> der Seite selbst.
Prioritaet und Aenderungshaeufigkeit bestehender Eintraege bleiben erhalten;
neue Seiten bekommen 0.6 (oberste Ebene) bzw. 0.4 (Unterordner), monthly.
Nur Python-Standardbibliothek, laeuft unter Windows, macOS und Linux.
"""
import glob
import os
import re
import sys

BASE = "https://www.egroupware.org/"
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SITEMAP = os.path.join(ROOT, "sitemap.xml")


def url_of(path):
    rel = os.path.relpath(path, ROOT).replace(os.sep, "/")
    rel = rel[:-len(".html")]
    if rel.endswith("/index") or rel == "index":
        rel = rel[:-len("index")]
    return BASE + rel


def read_existing():
    """Bestehende Reihenfolge, Prioritaet und Haeufigkeit je URL."""
    if not os.path.exists(SITEMAP):
        return [], {}
    xml = open(SITEMAP, encoding="utf-8").read()
    order, meta = [], {}
    for block in re.findall(r"<url>.*?</url>", xml, re.S):
        loc = re.search(r"<loc>([^<]+)</loc>", block).group(1)
        cf = re.search(r"<changefreq>([^<]+)</changefreq>", block)
        pr = re.search(r"<priority>([^<]+)</priority>", block)
        order.append(loc)
        meta[loc] = (cf.group(1) if cf else None, pr.group(1) if pr else None)
    return order, meta


def collect():
    pages, skipped = {}, []
    files = glob.glob(os.path.join(ROOT, "de", "**", "*.html"), recursive=True) + \
        glob.glob(os.path.join(ROOT, "en", "**", "*.html"), recursive=True)
    for f in sorted(files):
        name = os.path.basename(f)
        s = open(f, encoding="utf-8").read()
        head = s.split("</head>", 1)[0]
        if name.startswith("vorschau-design-"):
            skipped.append((f, "Vorschau"))
            continue
        if 'http-equiv="refresh"' in head:
            skipped.append((f, "Weiterleitung"))
            continue
        if re.search(r'<meta name="robots" content="[^"]*noindex', head):
            skipped.append((f, "noindex"))
            continue
        alts = re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"', head)
        pages[url_of(f)] = (alts, os.path.relpath(f, ROOT).count(os.sep))
    return pages, skipped


def build(pages, order, meta):
    urls = [u for u in order if u in pages]
    urls += sorted(u for u in pages if u not in meta)
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
           'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for u in urls:
        alts, depth = pages[u]
        cf, pr = meta.get(u, (None, None))
        cf = cf or "monthly"
        pr = pr or ("0.6" if depth <= 1 else "0.4")
        out.append("  <url>")
        out.append(f"    <loc>{u}</loc>")
        for lang, href in alts:
            out.append(f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{href}"/>')
        out.append(f"    <changefreq>{cf}</changefreq>")
        out.append(f"    <priority>{pr}</priority>")
        out.append("  </url>")
    out.append("</urlset>")
    return "\n".join(out) + "\n", urls


def main():
    check = "--check" in sys.argv
    order, meta = read_existing()
    pages, skipped = collect()
    xml, urls = build(pages, order, meta)
    added = [u for u in urls if u not in meta]
    removed = [u for u in order if u not in pages]
    old = open(SITEMAP, encoding="utf-8").read() if os.path.exists(SITEMAP) else ""
    changed = xml != old
    print(f"{len(urls)} Seiten in der Sitemap, {len(skipped)} ausgelassen "
          f"(Weiterleitung, noindex, Vorschau)")
    for u in added:
        print("  neu:      ", u)
    for u in removed:
        print("  entfernt: ", u)
    if not changed:
        print("sitemap.xml ist aktuell.")
        return 0
    if check:
        print("sitemap.xml ist NICHT aktuell – ohne --check ausfuehren.")
        return 1
    with open(SITEMAP, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(xml)
    print("sitemap.xml neu geschrieben.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

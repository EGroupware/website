# EGroupware-Webseite – Regeln für Änderungen

Statische Webseite von www.egroupware.org (früher WordPress). Reines HTML und CSS,
kein Build-Schritt, keine Frameworks, keine Webfonts. Diese Datei gilt für alle,
die hier mit Claude Code arbeiten. Claude Code lädt sie automatisch aus `.claude/`. Damit sie
nicht über die Webseite abrufbar ist, muss der Webserver `/.claude/` (bzw. alle `*.md`) sperren.

**Vertrauliches gehört nicht ins Repo.** Das Repository EGroupware/website ist auf GitHub
öffentlich. Keine Zugangsdaten, Passwörter, Kundendaten oder internen Absprachen in Dateien,
Commit-Nachrichten oder Kommentaren ablegen – auch nicht in dieser Datei.

## Aufbau

- `index.html` – Sprachweiche (leitet nach `de/` oder `en/` weiter)
- `de/*.html`, `en/*.html` – die Seiten, je Sprache rund 65. Links ohne `.html`
  (`href="kalender"`), der Server ergänzt die Endung. **Interne Links nie mit `.html`**
  schreiben – auch nicht in Vorschau-Seiten, Skripten oder Downloads-Listen (Hinweis Ralf).
  Nach größeren Änderungen alle internen Links prüfen (siehe „Links prüfen“ unten).
- `assets/css/style.css` – das einzige Stylesheet, Design-Tokens oben in `:root`
- `assets/img/` – Logos (`EGroupware-Logo.svg`, `-invert.svg`, `EGroupware-Mark.svg`), Bilder
- `sitemap.xml`, `robots.txt`, `404.html`
- `.github/workflows/` – automatisches Veröffentlichen (siehe unten)

## Pfeil-Links

- Karte mit genau einem Ziel: ganze Karte klickbar (`class="card … card--link"`, der Link
  liegt auf der Überschrift), runder Pfeil oben rechts – wie die Modulkarten auf „Funktionen“.
  Keine zusätzliche „Mehr erfahren“-Zeile.
- Karten mit mehreren Links sowie einzelne Links unter Abschnitten, in Infokästen und
  FAQs bleiben Text-Links mit Pfeil (`link-arrow`).
- **Hover-Regel für Kacheln:** Ist die ganze Kachel ein Link (`card--link`, `module--link`,
  `post-card`, `alt-tile`), bekommt sie beim Darüberfahren einen **blauen Rand** (`--primary`),
  hebt sich leicht und bekommt Schatten – wie die Modulkacheln auf der Startseite. Kacheln
  ohne eigenes Ziel (`card--hover`, Partnerkarten) bekommen nur einen **grauen Rand**
  (`--border-hover`, im Hellmodus kräftig genug), nie Blau. Kacheln ganz ohne Hover-Effekt
  (Preis-, Vergleichs-, Faktencheck-Karten) bleiben so. Neue Kacheltypen nach dieser Regel bauen.

## Funktionsseiten (eine Seite pro Anwendung)

Vorlage ist `de/kalender.html` / `en/calendar.html` (Stand 09.11.2026). Aufbau:

1. **Kopf:** Label mit Link zurück zu „Funktionen“ (`<nav class="eyebrow">`), H1, Einleitung in zwei
   Sätzen, Knöpfe „30 Tage kostenlos testen“ + „Preise ansehen“, drei Kernpunkte
   (`trust-bar trust-bar--3`). Keine alte Pfadzeile „Alle Module im Überblick / …“.
2. **Ein Highlight pro Anwendung** (`app-highlight`): Badge **NEU** (`st-badge--update`,
   `app-highlight--neu`, mit Version „Seit EGroupware …“) für frische Funktionen oder
   **BESONDERS** (`st-badge--info`) für das, was EGroupware abhebt. Titel, zwei bis drei Sätze,
   großer Screenshot; ohne Bild `app-highlight--text`. Fair formulieren (siehe „Texte“).
   NEU-Kästen bei jedem größeren Release prüfen und ältere zu BESONDERS oder normaler Karte machen.
3. **Funktionskarten** im Raster ohne Lücken (2, 4 oder 6 Karten bzw. `card--wide` für eine fünfte),
   Symbol aus `nav-icons.svg`, je zwei bis drei Sätze.
4. **Neuerungen in Karten** stehen nie im Fließtext, sondern immer in eigener Zeile:
   `<p class="card-new"><span class="st-badge st-badge--update">NEU</span> …</p>`. Noch nicht
   ausgelieferte Funktionen vor dem Livegang prüfen (sonst „In Kürze“).
5. **Synchronisation/Schnittstellen** nach der Regel unten, daneben `fc-fact` „… auf einen Blick“.
6. **„Passt dazu“** als `related-grid` mit vier kleinen `module module--link`-Karten (App-Symbol).
7. **3–4 FAQs** mit JSON-LD, Abschlussband.

**Nur in der Enterprise Line:** Fast alle Anwendungen sind auch in der Community Edition
enthalten – das wird nicht auf jeder Seite wiederholt. Reine EPL-Anwendungen (bisher Kanban,
E-Rechnung) und EPL-Zusätze (z. B. Policy im Adressbuch) werden gekennzeichnet: Badge
„ENTERPRISE LINE“ im Kopf bzw. Hinweis im Highlight, mit Link zum Vergleich CE/EPL.

**KI** hat seit 09.11.2026 einen eigenen Hauptpunkt in der Navigation („KI“/„AI“ mit NEU-Badge,
`nav-ai`) und einen Eintrag im Funktionen-Menü. Die Leiste hat damit neun Punkte – bei neuen
Hauptpunkten die Breiten 970, 1200, 1280 und 1440 px prüfen.

## Deutsch und Englisch immer gleich behandeln

`de/` und `en/` sind inhaltlich und im Aufbau gleich. Jede Änderung an Inhalt, Abschnitten,
Menü, Footer oder strukturierten Daten (JSON-LD) wird **im selben Commit in beiden Sprachen**
gemacht – die englische Seite als Übersetzung, nicht als gekürzte Fassung. Fehlt auf einer
Seite etwas, das die andere Sprache hat, ist das ein Fehler und wird ergänzt.
Ausnahmen nur, wenn es ausdrücklich gesagt wird (z. B. rein deutschsprachige Inhalte wie
Pressemitteilungen, die es nur auf Deutsch gibt).

## Git und Veröffentlichung

| Zweig     | Push veröffentlicht auf                                  |
|-----------|----------------------------------------------------------|
| `staging` | Staging-Seite (passwortgeschützt) – normaler Arbeitszweig |
| `main`    | egroupware.org (derzeit www2.egroupware.org)             |

- Gearbeitet wird auf `staging`. Nach `main` nur, wenn es ausdrücklich gesagt wird.
- **Vor jedem Commit die Änderung lokal im Browser zeigen** und auf Freigabe warten.
- Commit-Nachrichten kurz und auf Englisch, wie in der bisherigen Historie.
- Im Repo arbeiten mehrere Personen. Vor dem Arbeiten und vor jedem Push den aktuellen
  Stand holen: `git pull --rebase origin staging`. Bei Konflikten nicht überschreiben,
  sondern die Änderungen der anderen erhalten und im Zweifel nachfragen. Nie `--force` pushen.
- Vorschau-Seiten (`de/vorschau-design-*.html`, `assets/css/vorschau-design-*.css`,
  `assets/css/vorschau-style-alt.css`) sind nur für
  Abstimmungen auf Staging gedacht und müssen vor einem Merge nach `main` entfernt werden.

**Ausnahme Statusseite (ab Produktivbetrieb):** Sobald www.egroupware.org auf diese
Seite umgestellt ist, gehen Änderungen an `de/status.html` und `en/status.html`
(Status umschalten, Störungsmeldungen, Updates) direkt auf `main`, damit Kunden sie
sofort sehen. Danach `main` in `staging` mergen, damit beide Zweige gleich bleiben.
Stand 04.11.2026: noch nicht umgestellt – bis dahin auch die Statusseite über `staging`.

## Seitenübergreifende Teile: Header, Navigation, Footer

Header, Menü und Footer stehen **in jeder Seite einzeln** (kein Include). Eine
Änderung daran heißt:

1. In **allen** `de/*.html` und `en/*.html` ändern, deutsch und englisch passend übersetzt.
2. Vorher prüfen, ob die zu ersetzende Stelle in allen Dateien gleich aussieht
   (Anzahl der Treffer = Anzahl der Seiten), danach erneut zählen.
3. `index.html`, `404.html` und `kontakt.html` im Hauptordner haben eigene, kürzere
   Rahmen – gesondert prüfen.

## Neue Seite anlegen

- Immer beide Sprachen anlegen, mit gegenseitigen `hreflang`-Links im `<head>`
  (`de`, `en`, `x-default` = englisch) und passendem `canonical`.
- Eine bestehende Seite als Vorlage nehmen, damit Header, Footer und Kopfdaten stimmen.
- In `sitemap.xml` eintragen und, wenn sinnvoll, im Menü und Footer verlinken.

## Seite löschen oder umbenennen

- Alte Adresse nie einfach ins Leere laufen lassen: in **`.claude/weiterleitungen.md`** eintragen
  (alte Adresse, neue Adresse, Grund, Datum, Status „offen“). Ralf richtet daraus die
  dauerhaften Weiterleitungen (301) auf dem Server ein.
- Bis dahin unter der alten Adresse eine kleine HTML-Weiterleitung lassen (`noindex`, `canonical`
  auf die neue Seite, `meta refresh`), Links im Menü und in Texten auf die neue Adresse umstellen
  und den Eintrag in `sitemap.xml` entfernen bzw. anpassen.

## Design und CSS

- Neue Bausteine ans Ende von `style.css` als eigenen Abschnitt mit Kommentar
  `/* -- Name ---- */`. Kommentare auf Deutsch, ohne Umlaute wie im Bestand.
- Farben über die Tokens (`--primary`, `--text`, `--border`, `--bg-elevated` …).
  Eigene Farben brauchen Werte für den Dunkelmodus: einmal unter
  `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) … }` und
  einmal unter `:root[data-theme="dark"] …`.
- Gestaltung im Stil der EGroupware-Benachrichtigungen: Karten mit hellblauer
  Kopfleiste, Badges in Großbuchstaben (`.st-badge`), gelbe Markierung für
  Störung/Geändert, grüne Box für Neues/Updates, blauer Button mit kleinem Radius.
  Das Konzept dazu: https://claude.ai/artifact/1vLETdr9W2yRCurMoPJZhV
- Seitenstil „Kapitel mit Akzenten“ (Standard seit 06.11.2026, Block am Ende von `style.css`):
  ein Hintergrund, Abschnitte durch eine Linie getrennt, Abschnittskopf links mitlaufend,
  Labels mit kurzem Akzentstrich. Überschriften und Abschnittsköpfe **immer linksbündig**
  (nur Abschluss-Bänder `.cta-band` bleiben zentriert).
- **Worttrennung** (gilt für allen Text, auch Überschriften): Ein Wort darf am Zeilenende nur
  getrennt werden, wenn die Trennung den Rechtschreibregeln der jeweiligen Sprache entspricht,
  **beide Teile mindestens 4 Buchstaben** haben und die Trennung bei zusammengesetzten Wörtern
  **an der Wortfuge** liegt („Datenschutz·erklärung“, nicht „Daten·schutzer·klärung“ oder „ei-nem“).
  Umsetzung: keine automatische Silbentrennung (`hyphens: manual`); die erlaubten Stellen stehen
  als `&shy;` im Text. Bindestrich-Wörter mit einem Teil unter 4 Buchstaben (E-Mail, E-Rechnung,
  IT-…, Drag-and-Drop) bekommen hinter dem Bindestrich den unsichtbaren Wortverbinder `&#8288;`
  und brechen dort nicht um (kein `<span>` – das zerlegt Check-Listen und FAQ-Fragen).
  **Nach jeder Textänderung** im Repo-Hauptordner `perl .claude/tools/trennstellen.pl` ausführen –
  das Skript setzt alle Trennstellen neu (`--dry de` zeigt nur die Vorschläge). Falsche
  Trennungen nicht von Hand entfernen, sondern das Wort in die Liste `%never` im Skript eintragen
  (bzw. Endungen in `%badright`) und das Skript erneut laufen lassen. Beim Erzeugen von JSON-LD
  aus sichtbarem Text `&shy;` und `&#8288;` entfernen.
- **Links im Text werden nicht über zwei Zeilen umbrochen.** Passt ein Link nicht mehr in die
  Zeile, beginnt er als Ganzes in der nächsten (CSS-Block „Links im Fliesstext …“ am Ende von
  `style.css`, gilt für Links in Absätzen, Listen, Tabellen und Wert-Listen). Linktexte daher
  kurz halten – ein Link, der länger als eine ganze Zeile ist, bricht trotzdem in sich um.
- **Kontrast im Hellmodus** (Stand 09.11.2026, wird im Team noch abgestimmt): Der Hellmodus muss
  mindestens so gut lesbar sein wie der Dunkelmodus.
  - Text mindestens 4,5:1, Fließtext und kleine Hinweise auf weißem und grauem Grund möglichst
    ab 5,5:1. Die hellen Grautöne `--n-300`/`--n-400` nie als Textfarbe verwenden, für blassen
    Text `--text-muted` nehmen.
  - Die Seite bleibt weiß, Kacheln stehen auf leichtem Grau (`--card-bg`) mit Rand (`--border`)
    und kleinem Schatten – nie nur weiße Kachel mit hellem Rand. Neue Kacheltypen in den
    CSS-Block „Kontrast im Hellmodus: Kacheln leicht grau“ am Ende von `style.css` aufnehmen.
  - Neue Farben vor dem Einbau im Hellmodus nachmessen (Kontrastverhältnis), nicht nur im
    Dunkelmodus ansehen.
- Jede Seite muss auf dem Handy funktionieren (kein seitliches Scrollen).
- **Versionsnummer bei CSS/JS-Änderungen hochzählen.** Der Server lässt Browser
  `style.css`, `main.js`, `social.svg` und `nav-icons.svg` zehn Jahre zwischenspeichern. Alle Seiten binden
  sie daher mit `?v=JJJJMMTT` ein (bei den SVG-Sprites vor dem `#`). Wer eine dieser Dateien
  ändert, setzt die Nummer in **allen** HTML-Dateien neu (pro Tag gleiches Datum, bei
  mehreren Änderungen am Tag `JJJJMMTTb` usw.) – sonst sehen wiederkehrende Besucher
  die alte Fassung.

## Hell-/Dunkelmodus

- Standard: Die Seite folgt dem Betriebssystem (`prefers-color-scheme`), auch live.
- Der Knopf mit Mond/Sonne setzt `data-theme` auf `<html>` und merkt sich die Wahl
  in `localStorage` (`egw-theme`) zusammen mit dem Systemschema zum Zeitpunkt des
  Klicks (`egw-theme-sys`). Die letzte Aktion gewinnt: Wird das Betriebssystem
  umgestellt, wird die Wahl verworfen. Klickt man zurück auf das Systemschema, ebenso.
- Logik in `assets/js/main.js` und in einem kleinen Skript im `<head>` **jeder** Seite
  (läuft vor dem ersten Zeichnen, damit nichts aufblitzt). Dieses Kopf-Skript ist in
  allen Seiten identisch – Änderungen daran immer in allen Dateien gleich machen und
  neue Seiten aus einer bestehenden Seite kopieren, damit es dabei ist.

## Texte und Suchmaschinen

- **Vergleiche mit anderen Anbietern sachlich und fair** – nichts Negatives über andere Anbieter
  herausstellen. Beschreiben, was EGroupware anders macht (Quellcode, Datenstandort, Abrechnung),
  Stärken der anderen anerkennen und Angaben zu anderen Produkten mit Quelle und Stand-Datum
  versehen. Bei **anderen Open-Source-Anbietern** (z. B. ownCloud, Nextcloud) nicht „Alternative“,
  sondern unterschiedliche Schwerpunkte und Kombinationsmöglichkeiten zeigen.
- **Synchronisation:** zuerst die offenen Standards nennen (CalDAV, CardDAV, WebDAV, IMAP), danach
  „das ActiveSync-Protokoll“ / "the ActiveSync protocol" – nie nur „ActiveSync“, denn ActiveSync ist
  ein Microsoft-Produkt; EGroupware stellt das Protokoll über die Open-Source-Software Z-Push bereit.
  Für Desktop-Programme Thunderbird oder eM Client empfehlen (sprechen die offenen Standards nativ).
- Inhalte in Tabellenzellen und Wert-Listen (z. B. „EGroupware auf einen Blick“, Vergleichs- und
  Preistabellen) beginnen **immer mit einem Großbuchstaben** – auch einzelne Wörter („Nein“,
  „Proprietär“) und Satzanfänge wie „Ab 25 Postfächern“ / „From €390“. Gilt für Deutsch und Englisch.
- Community Edition nie „kostenlos“/„free“ nennen, sondern „ohne Lizenzkosten“ /
  „without licence fees“ (bzw. „lizenzkostenfrei“ / „licence-free“). Betrieb und
  Updates liegen beim Kunden, Support ist optional buchbar. Wirklich kostenlose
  Angebote (30-Tage-Test, Forum) dürfen „kostenlos“ heißen.
- EPL: Kunden erhalten Lizenzschlüssel und Zugang zum Repository und dürfen den
  Quellcode prüfen und anpassen, aber nicht veröffentlichen. Die Lizenz gilt für die
  erworbene Version unbefristet. Keinen Langzeit-Support für ältere Versionen zusagen.
- Seiten mit FAQ (Startseite, Preise, Digitale Souveränität) haben strukturierte Daten
  (`<script type="application/ld+json">` im `<head>`). Wer dort Fragen oder Antworten
  ändert, muss das JSON-LD mit anpassen, und das „Stand“-Datum bzw. `dateModified`
  aktualisieren.

## Statusseite pflegen (`de/status.html`, `en/status.html`)

Immer beide Sprachen gleichzeitig ändern. Die genaue Vorlage steht als Kommentar
oben im `<main>` der Seiten.

- **Status umschalten:** pro Dienst (`data-service="cloud|mail|chat|office"`) nur das
  Badge ändern – der farbige Punkt folgt automatisch:
  `st-badge--ok` IN BETRIEB / OPERATIONAL · `st-badge--warn` EINGESCHRÄNKT / DEGRADED
  oder WARTUNG / MAINTENANCE · `st-badge--err` STÖRUNG / OUTAGE.
  Dazu das „Stand“-Datum anpassen.
- **Neue Meldung:** als erstes `<article class="incident incident--stoerung">`
  (oder `incident--wartung`) in das `<details>` des aktuellen Jahres, Zähler
  „n Meldungen“ / „n reports“ erhöhen. Neues Jahr: neues `<details class="status-year" open>`
  oben, beim Vorjahr `open` entfernen.
- **Update zu einem Vorfall:** eigenes `<article class="incident incident--update">`
  direkt über der ursprünglichen Meldung, Badge `st-badge--update`.
- Nur öffentliche Informationen: keine Hostnamen, IPs oder internen Details.
- Geplant: automatische Umschaltung der Badges aus checkmk über eine `status.json`
  (nicht per Git-Commit). Bis dahin wird von Hand umgestellt.

## Lokale Vorschau

Seiten direkt im Browser öffnen (`de/status.html`). Dabei funktionieren die Links
ohne `.html` nicht – das ist lokal normal und auf dem Server in Ordnung.

## Links prüfen

Nach Änderungen an Menü, Footer, neuen Seiten oder Umbenennungen alle internen Links
prüfen: Jeder relative `href`/`src` muss auf eine vorhandene Datei zeigen (`ziel`,
`ziel.html` oder `ziel/index.html`). Externe Links (`https:`, `mailto:`, `tel:`) und
Sprungmarken (`#…`) sind ausgenommen. Gefundene Fehler beheben, nicht nur melden.

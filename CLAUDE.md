# EGroupware-Webseite – Regeln für Änderungen

Statische Webseite von www.egroupware.org (früher WordPress). Reines HTML und CSS,
kein Build-Schritt, keine Frameworks, keine Webfonts. Diese Datei gilt für alle,
die hier mit Claude Code arbeiten.

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
- Vorschau-Seiten (`de/vorschau-design-*.html`, `assets/css/vorschau-design-*.css`) sind nur für
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
- Jede Seite muss auf dem Handy funktionieren (kein seitliches Scrollen).

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

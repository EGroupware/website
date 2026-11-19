# Weiterleitungen (301) für den Webserver

Sammelliste für Ralf: Adressen, die es nicht mehr gibt oder die umgezogen sind. Sie sollen auf
dem Server dauerhaft (HTTP 301) auf die neue Adresse zeigen. Solange das nicht eingerichtet ist,
liegt bei einigen eine kleine HTML-Datei mit Meta-Refresh unter der alten Adresse (Spalte
„Übergang“). Die kann entfernt werden, sobald die 301 auf dem Server aktiv ist.

**Pflege:** Wer eine Seite löscht oder umbenennt, trägt sie hier ein (siehe `.claude/CLAUDE.md`).
Status: *offen* → *eingerichtet am …* (dann kann die HTML-Weiterleitung weg).

Alle Adressen ohne `.html`, relativ zu `https://www.egroupware.org`.

## Prüfstand 18.11.2026 (www.egroupware.org, neue Seite)

Alle alten Adressen aus den Tabellen unten wurden am 18.11.2026 auf www.egroupware.org
aufgerufen (ohne Weiterleitungen zu folgen). Hinweis: www2 zeigt vorübergehend noch die alte
WordPress-Seite und ist für diese Prüfung nicht maßgeblich. Ergebnis:

- **Keine einzige Server-301 eingerichtet.** Alle Einträge stehen daher zu Recht auf *offen*.
- **Alle Adressen mit Meta-Refresh-Datei → 200** (Spalte „Übergang“). Nach dem Einrichten der
  301 kann die jeweilige HTML-Datei aus dem Repo gelöscht werden.
- **Kundenstimmen und `/en/privacy-policy` → 404:** Erwartet, es gibt keine Übergangsdatei.
  Diese brauchen die 301 am dringendsten.
- **Neu seit 18.11.2026:** Design-Vorschauseiten `/de/vorschau-design-*` gelöscht → 301 auf `/de/`
  (siehe erste Tabelle).

**Prüfen nach dem Einrichten:** Für jede Zeile `curl -s -o /dev/null -w "%{http_code} %{redirect_url}"`
auf die alte Adresse – erwartet wird `301` mit der neuen Adresse aus der Tabelle. Danach Status
auf *eingerichtet am …* setzen und die Meta-Refresh-Dateien entfernen.

## Prüfstand 19.11.2026 (301 eingerichtet)

Alle 301-Weiterleitungen aus den vier Tabellen unten (64 Adressen, inkl. der
`/de/vorschau-design-*`-Regel) sind jetzt serverseitig per nginx eingerichtet (gemeinsames
Snippet, von www.egroupware.org und staging.egroupware.org eingebunden) und stichprobenartig
verifiziert. Status entsprechend auf *eingerichtet am 19.11.2026* gesetzt; die 41 Meta-Refresh-
Dateien sind aus dem Repo gelöscht, Übergang auf „–“ gesetzt.

Zum Abschnitt „Beim Umstieg von WordPress prüfen“ unten – Ergebnis der Tests gegen
www.egroupware.org:

- Schrägstrich am Ende (`/de/preise/`) → **404**, nicht wie gehofft die Seite ohne Schrägstrich.
- `.html`-Adressen (`/de/preise.html`) → **200**, wird direkt ausgeliefert statt auf die Adresse
  ohne `.html` weiterzuleiten (doppelter Inhalt unter zwei Adressen).
- `/feed`, `/de/feed`, `/en/feed` → **404**; `/de/feed.xml` und `/en/feed.xml` funktionieren.
- `/wp-content/uploads/…` → **404** wie erwartet.

Das sind keine der oben gelisteten Einzeladressen, sondern Muster – noch offen, ob/wie sie
behoben werden sollen (z. B. generische try_files- oder rewrite-Regeln). Noch nicht umgesetzt,
Ralf entscheidet.

## Seiten zusammengelegt oder entfernt

| Alte Adresse | Neue Adresse | Grund | Seit | Übergang | Status |
| - | - | - | - | - | - |
| `/de/warum-cloud` | `/de/cloud-oder-eigener-server` | Zusammengelegt zur Vergleichsseite | 08.11.2026 | – | eingerichtet am 19.11.2026 |
| `/de/warum-eigeninstallation` | `/de/cloud-oder-eigener-server` | Zusammengelegt zur Vergleichsseite | 08.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/why-cloud` | `/en/cloud-or-own-server` | Zusammengelegt zur Vergleichsseite | 08.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/why-on-premise` | `/en/cloud-or-own-server` | Zusammengelegt zur Vergleichsseite | 08.11.2026 | – | eingerichtet am 19.11.2026 |
| `/de/kollaborationswerkzeuge` | `/de/funktionen` | Seite entfernt (Doppelung) | 08.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/collaboration-tools` | `/en/features` | Seite entfernt (Doppelung) | 08.11.2026 | – | eingerichtet am 19.11.2026 |
| `/de/integrationspartner` | `/de/technologiepartner` | Zusammengelegt zur Partnerseite | 08.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/integration-partners` | `/en/technology-partners` | Zusammengelegt zur Partnerseite | 08.11.2026 | – | eingerichtet am 19.11.2026 |
| `/de/egroupware-26` | `/de/was-ist-neu` | Release-Seite verallgemeinert | 09.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/egroupware-26` | `/en/whats-new` | Release-Seite verallgemeinert | 09.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/privacy-policy` | `/en/privacy` | Alte Adresse der Datenschutzerklärung (WordPress), wird z. B. bei meetergo verlinkt | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/de/vorschau-design-*` (original, a–e) | `/de/` | Design-Vorschauseiten entfernt (waren noindex, nur einen Tag auf main) | 18.11.2026 | – | eingerichtet am 19.11.2026 |

## Kundenstimmen umbenannt

| Alte Adresse | Neue Adresse | Grund | Seit | Übergang | Status |
| - | - | - | - | - | - |
| `/de/kundenstimmen/michael-engelhardt-geschaeftsfuehrer-der-igu-tragwerksplanung` | `/de/kundenstimmen/igu-tragwerksplanung` | Stimme ohne Namen | 05.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/testimonials/michael-engelhardt-managing-director-of-igu-tragwerksplanung` | `/en/testimonials/igu-tragwerksplanung` | Stimme ohne Namen | 05.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/testimonials/michael-engelhardt-director-general-de-igu-tragwerksplanung` | `/en/testimonials/igu-tragwerksplanung` | Spanische Dublette entfernt | 05.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/testimonials/gerd-weinzierl-gerd-weinzierl-director-de-la-autoescuela-weinzierl` | `/en/testimonials/gerd-weinzierl-gerd-weinzierl-managing-director-driving-school-weinzie` | Spanische Dublette entfernt | 05.11.2026 | – | eingerichtet am 19.11.2026 |

## Kundenstimmen entfernt → Übersicht

Kunden, deren Stimme nicht mehr verwendet wird. Weiterleitung auf die Übersicht der Kundenstimmen.

| Alte Adresse | Neue Adresse | Seit | Status |
| - | - | - | - |
| `/de/kundenstimmen/andreas-lehmann-zentrum-fuer-brennstoffzellen-technologie` | `/de/kundenstimmen` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/de/kundenstimmen/andreas-meier-stadt-detmold-schul-informationstechnik` | `/de/kundenstimmen` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/de/kundenstimmen/frank-michel-michel-ingenieure-gmbh` | `/de/kundenstimmen` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/de/kundenstimmen/frank-pruskil-qcons-gmbh` | `/de/kundenstimmen` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/de/kundenstimmen/lutz-seidel-lutz-seidel-esa-elektroschaltanlagen-gmbh` | `/de/kundenstimmen` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/de/kundenstimmen/michael-grau-institut-fuer-prozessoptimierung` | `/de/kundenstimmen` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/de/kundenstimmen/michael-schacht-fachlehrer-fuer-kunst-und-berater-fuer-schulentwicklun` | `/de/kundenstimmen` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/de/kundenstimmen/silvia-gross-max-planck-institut-fuer-plasmaphysik-institut-greifswald` | `/de/kundenstimmen` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/en/testimonials/andreas-lehmann-the-hydrogen-and-fuel-cell-center-zbt` | `/en/testimonials` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/en/testimonials/andreas-meier-stadt-detmold-school-information-technology` | `/en/testimonials` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/en/testimonials/christian-herzog-christian-herzog-jefe-de-informatica-departamento-de-` | `/en/testimonials` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/en/testimonials/frank-michel-michel-ingenieure-gmbh` | `/en/testimonials` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/en/testimonials/frank-pruskil-qcons-gmbh` | `/en/testimonials` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/en/testimonials/lutz-seidel-lutz-seidel-esa-elektroschaltanlagen-gmbh` | `/en/testimonials` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/en/testimonials/michael-grau-institut-fuer-prozessoptimierung-und-informationstechnolo` | `/en/testimonials` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/en/testimonials/michael-schacht-gymnasium-edenkoben` | `/en/testimonials` | 05.11.2026 | eingerichtet am 19.11.2026 |
| `/en/testimonials/silvia-gross-max-planck-institut-fuer-plasmaphysik-institut-greifswald` | `/en/testimonials` | 05.11.2026 | eingerichtet am 19.11.2026 |

## Beim Umstieg von WordPress prüfen

Keine konkreten Weiterleitungen, sondern Punkte, die Ralf beim Umschalten von www.egroupware.org
auf die statische Seite einmal testen sollte:

- Alte WordPress-Adressen mit Schrägstrich am Ende (`/de/preise/`) landen auf der Seite ohne
  Schrägstrich (`/de/preise`).
- Aufrufe mit `.html` (`/de/preise.html`) landen auf der Adresse ohne `.html`.
- Bisherige Feed-Adressen von WordPress (z. B. `/feed`, `/de/feed`) zeigen auf `/de/feed.xml`
  bzw. `/en/feed.xml`.
- Externe Links auf Bilder unter `/wp-content/uploads/…` – entscheiden, ob sie weiterleiten oder
  wegfallen dürfen (zwei ältere Presseartikel binden noch Bilder von dort ein).

## Beispiel für nginx

```nginx
# in den server-Block für www.egroupware.org
location = /de/warum-cloud               { return 301 /de/cloud-oder-eigener-server; }
location = /de/warum-eigeninstallation   { return 301 /de/cloud-oder-eigener-server; }
location = /en/why-cloud                 { return 301 /en/cloud-or-own-server; }
location = /en/why-on-premise            { return 301 /en/cloud-or-own-server; }
location = /de/kollaborationswerkzeuge   { return 301 /de/funktionen; }
location = /en/collaboration-tools       { return 301 /en/features; }
location = /de/integrationspartner     { return 301 /de/technologiepartner; }
location = /en/integration-partners    { return 301 /en/technology-partners; }
# … weitere Zeilen nach demselben Muster aus den Tabellen oben
```

## Fremdsprachige und leere Beiträge im englischen Bereich entfernt

Alte WPML-Übersetzungen (ES, IT, FR, teils DE) und leere Beiträge, die unter `en/` lagen. Ziel ist jeweils die englische Fassung.

| Alte Adresse | Neue Adresse | Grund | Seit | Übergang | Status |
| - | - | - | - | - | - |
| `/en/allgemein/egroupware-21-1-webinarankuendigung-zur-cti-telefonintegration` | `/en/news/egroupware-21-1-webinarannouncement-on-cti-telephone-integration` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/allgemein/telefonintegration-in-egroupware-cti-integration-am-beispiel-von-placetel` | `/en/webinars/telephone-integration-in-egroupware-cti-integration-using-placetel` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/allgemein/placetel-integration-in-egroupware` | `/en/news/egroupware-21-1-release-announcement-and-placetel-webinar-recording` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/allgemein/opensource-com-spannender-egroupware-artikel-erste-schritte-mit-egroupware` | `/en/blog` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/allgemein/smart-collaboration-egroupware-und-managed-davx%e2%81%b5-steigern-die-produktivitaet-der-stadtverwaltung-jena` | `/en/news/smart-collaboration-egroupware-and-managed-davx5-enhance-productivity-at-jena-city-council` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/egroupware-in-the-press/datacenter-insider-los-usuarios-deciden-el-desarrollo-de-egroupware-2` | `/en/egroupware-in-the-press/datacenter-insider-users-decide-egroupware-development` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/egroupware-in-the-press/egroupware-17-1-con-collabora-fusion-de-groupware-clasico-y-servidor-de-archivos-con-oficina-en-linea-2` | `/en/egroupware-in-the-press/egroupware-17-1-collabora-merger-classic-groupware-file-server-online-office` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/events/chemnitzer-linux-tage-2021-egroupware-im-home-office-und-in-bildungseinrichtungen-2` | `/en/events/chemnitzer-linux-tage-2021-egroupware-in-the-home-office-and-in-educational-institutions` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/general/egroupware-16-1-2` | `/en/general/egroupware-16-1` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/annuncio-del-rilascio-di-egroupware-21-1-e-registrazione-del-webinar-di-placetel-2` | `/en/news/egroupware-21-1-release-announcement-and-placetel-webinar-recording` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/collabora-3-1-disponible-con-egroupware-2` | `/en/news/collabora-3-1-available-with-egroupware` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/egroupware-14-1-pubblicato-2` | `/en/news/egroupware-14-1-released` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/egroupware-21-1-annuncio-del-webinar-sullintegrazione-telefonica-cti-2` | `/en/news/egroupware-21-1-webinarannouncement-on-cti-telephone-integration` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/egroupware-21-1-freigegeben-2` | `/en/news/egroupware-21-1-released` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/egroupware-soutient-le-proces-contre-microsoft-2` | `/en/news/egroupware-supports-lawsuit-against-microsoft` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/giornata-delleducazione-aperta-2021` | `/en/events/open-education-day-2021` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/integrazione-di-placetel-in-egroupware` | `/en/news/egroupware-21-1-release-announcement-and-placetel-webinar-recording` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/nouvelles-fonctionnalites-et-applications-dans-egroupware-21-1-2` | `/en/news/new-features-and-applications-in-egroupware-21-1` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/pre-annonce-de-la-version-egroupware-21-1-2` | `/en/news/release-pre-announcement-egroupware-21-1` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/pre-annuncio-di-rilascio-egroupware-21-1-2` | `/en/news/release-pre-announcement-egroupware-21-1` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/pressemitteilung-vorankuendigung-release-egroupware-21-1-2` | `/en/news/release-pre-announcement-egroupware-21-1` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/seminaires-web-sur-egroupware-21-1-2` | `/en/news/webinars-on-egroupware-21-1` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/sortie-degroupware-21-1-2` | `/en/news/egroupware-21-1-released` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/news/webinare-zu-egroupware-21-1-2` | `/en/news/webinars-on-egroupware-21-1` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/webinars/egroupware-16-1-informacion-actualizada-2` | `/en/webinars/egroupware-16-1-update-infos` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/webinars/integracion-telefonica-en-egroupware-integracion-cti-con-el-ejemplo-de-placetel-2` | `/en/webinars/telephone-integration-in-egroupware-cti-integration-using-placetel` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/webinars/integration-telephonique-dans-egroupware-integration-cti-a-laide-de-lexemple-de-placetel` | `/en/webinars/telephone-integration-in-egroupware-cti-integration-using-placetel` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/webinars/smart-working-educazione-e-scuole-2` | `/en/webinars/smart-working-educations-and-schools` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/webinars/taller-de-configuracion-de-placetel-consejos-y-trucos-2` | `/en/webinars/placetel-configuration-workshop` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/webinars/telefonintegration-in-egroupware-cti-integration-am-beispiel-von-placetel-2` | `/en/webinars/telephone-integration-in-egroupware-cti-integration-using-placetel` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |
| `/en/webinars/webinaire-smallpart-avec-examens-2` | `/en/webinars/smallpart-webinar-with-exams` | Fremdsprachig/leer im englischen Bereich | 10.11.2026 | – | eingerichtet am 19.11.2026 |

# Einführungskurs für Layerling – Design

Stand: 2026-11-07 · Autor: Simon Prell (mit Claude)

## 1. Worum es geht und warum

Eine Browser-Erweiterung (Chrome, Brave, Edge) legt einen geführten 3D-Konstruktionskurs
direkt in den Web-CAD-Editor [layerling.com](https://layerling.com/). Vorbild ist die eigene
Scratch-Erweiterung „Einführungskurs für Scratch“
([Seite](https://simonprell-dev.github.io/scratchExtention/),
[Code](https://github.com/simonprell-dev/scratchExtention)). Die **Erklärlogik wird
übernommen**: kleines Kursfenster im Editor, Schritte mit Checkliste, animierte Zeige-Hand,
automatische Prüfung mit Konfetti, Einstiegsstufen, Fortschritt lokal im Browser.

Layerling ist ein freier Open-Source-CAD-Editor für den 3D-Druck (AGPL-3.0, Code:
[henmedia/layerling](https://github.com/henmedia/layerling)), „so einfach wie Tinkercad, aber
ein Schritt Richtung Fusion 360“. Eine eigene Anleitung gibt es (`/guide/`), einen geführten
Kurs mit Projekten und Prüfungen gibt es nicht. Diese Lücke füllt die Erweiterung.

**Zielgruppe:** 8 bis 99 Jahre – Kinder, Jugendliche in Schule/AG, Erwachsene im Makerspace
oder zu Hause. Folge: kurze Sätze in Du-Form, klar, aber nicht kindlich.

## 2. Ziele, Nicht-Ziele, Anti-Ziele

**Ziele (erste Version)**
- Komplette Kurs-Engine: Kursfenster, Stufenwahl, Schritte, Checkliste, automatische
  Prüfungen, Zeige-Hand, Konfetti, Fortschritt, „Hinweise aus“, Ein/Aus übers Icon.
- **Kapitel 1 „Namensschild“** vollständig ausgearbeitet und geprüft.
- Kapitel 2–6 erscheinen in der Kursübersicht als „kommt bald“ (Titel, Icon, Stufe, eine
  Zeile Beschreibung) – ohne Schritte.
- Mehrsprachig von Anfang an: **Deutsch und Englisch** fertig, weitere Sprachen als
  reine Übersetzungsdatei ergänzbar.
- GitHub-Pages-Seite (DE/EN) und Store-Texte nach dem Muster der Scratch-Erweiterung.

**Nicht-Ziele (erste Version)**
- Kapitel 2–6 ausarbeiten (kommen einzeln danach).
- Firefox/Safari.
- Selbst gehostete Layerling-Kopien unterstützen (nur `https://layerling.com/*`).
- Änderungen am Layerling-Code selbst.

**Anti-Ziele (wäre ein Fehlschlag, auch wenn es technisch läuft)**
- Der Kurs verändert Entwürfe der Nutzer ohne deren Klick oder löscht etwas.
- Daten verlassen den Rechner (kein Server, kein Konto, keine Telemetrie).
- Der Kurs zwingt ein exaktes Vorgehen auf und lehnt gleichwertige Lösungen ab
  (z. B. Text graviert statt erhaben, Schild 62 statt 60 mm breit).
- Erwachsene fühlen sich veralbert (Tonfall), Kinder sind überfordert (Schrittgröße).
- Die Erweiterung bricht Layerling, wenn Layerling sich ändert – sie darf dann höchstens
  selbst ausfallen und muss das freundlich sagen.

## 3. Rahmenbedingungen

- Manifest V3, nur Host-Berechtigung `https://layerling.com/*`, Berechtigungen wie beim
  Vorbild (`storage`, `contextMenus`, `scripting`).
- Lizenz MIT wie beim Vorbild. Kein Code aus Layerling kopieren (AGPL) – nur zur Laufzeit
  auf die Seite zugreifen.
- Layerling ist ein Next.js/React-19-Editor mit three.js. Layerling wird häufig
  aktualisiert (aktuell v1.150.0) – Zugriffe auf Interna müssen robust und an einer Stelle
  gebündelt sein.
- Unabhängiges Projekt, nicht mit Layerling verbunden – so auf Seite und im Store sagen.

## 4. Aufbau (übernommen vom Vorbild)

Gleiche Ordnerstruktur und Arbeitsweise wie `scratchExtention`:

```
manifest.json
background.js           Icon-Klick öffnet layerling.com, Kontextmenü (Ein/Aus, Fortschritt zurücksetzen)
lib/layerling-access.js Einziger Ort für Zugriffe auf Layerling-Interna (siehe 5.)
course/course.js        Kurs-Engine (Fenster, Prüfschleife, Hinweise, Konfetti, Fortschritt)
course/course.css
course/course-data.js   Kapitel, Schritte, Prüfungen, Hinweise – sprachunabhängig
course/i18n/de.js       Alle Texte Deutsch
course/i18n/en.js       Alle Texte Englisch
tools/check-course.mjs  Prüfskript: Syntax, fehlende Übersetzungsschlüssel, unbekannte Ziele
docs/index.html         GitHub-Pages-Seite (DE/EN)
docs/store/…            Store-Texte DE/EN
.claude/skills/kurs-kapitel/  Skill zum Schreiben neuer Kapitel, angepasst an Layerling
README.md, CHANGELOG.md, CONTRIBUTING.md, LICENSE
```

Das Datenformat für Kapitel und Schritte folgt dem Vorbild (`course-data.js` dort):
Kapitel `{id, level, type, icon, autoHints, steps}`, Schritte mit
`kind: info | learn | creative | game | challenge`, `tasks` (mit `check(c)` oder
`manual: true`), `hints` (erster nicht erledigter wird gezeigt, jeder mit `done(c)`).
**Unterschied:** `title`, `text`, Aufgaben- und Hinweistexte stehen nicht im Klartext,
sondern als Schlüssel (`'namensschild.s3.task1'`) und kommen aus `course/i18n/<sprache>.js`.
Statt eines Ziel-Skripts in scratchblocks zeigt ein Schritt optional ein **Bild** (Screenshot
oder Skizze des Zwischenstands).

Zwischen Kapiteln fügt die Engine automatisch den Schritt „Entwurf sichern / neuen Entwurf
anlegen“ ein (Gegenstück zu „Projekt sichern“ beim Vorbild), damit Prüfungen nur den
aktuellen Entwurf sehen.

## 5. Zugriff auf Layerling

Recherche im Layerling-Code (Stand v1.150.0):

- **Formen:** Alle Formen eines Entwurfs liegen im React-Zustand der Komponente
  `LayerlingEditor` (`useState<WorkplaneShape[]>`), Typ `WorkplaneShape` in
  `apps/web/src/types/layerling.ts`: u. a. `id, name, kind, hole, x, z, elevation, width,
  depth, height, rotation, text`, Gruppen enthalten Kinder.
- **Sprache:** `localStorage['layerling.language']` (Datei `lib/i18n.ts`).
- **DOM:** Klassennamen sind lesbar und stabil wirkend (`shape-inspector-header`,
  `inspector-action-button`, `name-tag-start-button` …). `data-help`- und
  `aria-label`-Attribute enthalten **übersetzten** Text – als Ziel für die Hand nur
  zusammen mit der passenden Sprache nutzbar.
- Es gibt eine MCP-Brücke für KI-Steuerung, die läuft aber nur bei selbst gehosteten Kopien –
  für layerling.com nicht nutzbar.

**Vorgehen:** Wie `lib/scratch-access.js` beim Vorbild findet `lib/layerling-access.js` über
die React-Fiber-Struktur der Seite den `LayerlingEditor` und liest daraus die Formenliste
(nur lesen, nie schreiben). Er bietet nach außen eine kleine, stabile Schnittstelle:

- `getShapes()` → flache Liste aller Formen mit Gruppen-Zugehörigkeit
- `getSelection()` → ausgewählte Formen (falls auffindbar)
- `getLanguage()`
- `findTarget(id)` → DOM-Element für ein Hinweis-Ziel (siehe 6.)
- `isEditorOpen()` (Startseite vs. Editor)

Findet der Zugriff die Formen nicht (Layerling hat sich geändert), zeigt das Kursfenster:
„Diese Layerling-Version kenne ich noch nicht – Aufgaben bitte selbst abhaken“ und schaltet
alle Aufgaben auf Selbst-Abhaken. Der Kurs bleibt so benutzbar.

## 6. Prüfungen und Hinweise

**Prüf-Kontext `c`** (Gegenstück zum Vorbild, alle 200–300 ms neu):

| Hilfe | liefert |
|---|---|
| `c.shapes(kind?)` | alle Formen, optional nur einer Art (`box`, `cylinder`, `text`, `nameTag` …) |
| `c.solids()` / `c.holes()` | Formen mit `hole` false/true |
| `c.groups()` | Gruppen mit ihren Kindern |
| `c.size(s)` | `{w, d, h}` in mm |
| `c.near(a, b, mm)` | liegen zwei Formen übereinander/aneinander (Hüllquader berühren sich oder überlappen, Toleranz in mm) |
| `c.inGroupWith(a, b)` | sind zwei Formen in derselben Gruppe? |
| `c.base` | Zustand bei Schrittbeginn (Anzahl Formen, IDs) |
| `c.newShapes(kind?)` | Formen, die seit Schrittbeginn neu sind |
| `c.exported()` | wurde in diesem Schritt exportiert? (Klick auf Export-Dialog/Download erkannt) |
| `c.panelOpen(name)` | ist ein bestimmtes Fenster offen (Formenbibliothek, Export …) |

Grundsatz wie beim Vorbild: **großzügig prüfen**, Bereiche statt exakter Werte
(„Platte zwischen 40 und 100 mm breit“), eigene Wahl immer akzeptieren (Text, Schrift,
Farbe nie über den Inhalt prüfen, nur „Text ist nicht leer“).

**Hinweise (Zeige-Hand):** `{target, text, done(c)}`. Ein `target` ist eine Kurs-eigene ID
(`addShape`, `shapeLibrary`, `libItem:box`, `inspector:size`, `inspector:hole`,
`toolbar:group`, `export`, `workplane`, `shape:<auswahl>` …). Die Übersetzung ID → Element
steht nur in `layerling-access.js`: zuerst über Klassennamen/Struktur, nur wenn nötig über
den übersetzten Text der aktuellen Layerling-Sprache. `tools/check-course.mjs` meldet IDs,
die nicht in dieser Tabelle stehen. Statt Blöcke zu ziehen, zeigt die Hand **klicken**
(Knopf) und **ziehen** (Form aus Bibliothek auf Arbeitsfläche, Griff ziehen).

## 7. Mehrsprachigkeit

- Kurs-Sprache = Layerling-Sprache (`layerling.language`); ändert man sie, wechselt das
  Kursfenster mit. Fehlt eine Übersetzung oder ein einzelner Schlüssel → Englisch.
- Namen von Knöpfen schreibt der Kurstext so, wie sie in Layerling **in dieser Sprache**
  heißen (fett), z. B. DE **„Loch“**, EN **„Hole“** – die Übersetzer schauen dafür in
  Layerlings eigene Sprachdateien.
- Eine neue Sprache = eine neue Datei `course/i18n/<code>.js`; das Prüfskript listet
  fehlende Schlüssel.

## 8. Stufen

Drei Einstiege, alle Kapitel bleiben offen (wie beim Vorbild):

| id | DE | EN | Einstieg |
|---|---|---|---|
| `neu` | Neu dabei | New to this | Kapitel 1 |
| `etwas` | Schon mal 3D gemacht | Done some 3D | Kapitel 1 |
| `profi` | Ich kenne Tinkercad o. Ä. | I know Tinkercad or similar | Kapitel 2 (sobald fertig, bis dahin 1) |

Die Stufe ändert **nur**, ob die Zeige-Hand automatisch erscheint (`neu`) oder erst auf
Knopfdruck 👆 (`etwas`, `profi`) – ein einziger Schalter wie `autoHints` beim Vorbild.
Texte sind für alle Stufen gleich, es gibt keine zweite Textfassung. *(Entscheidung Claude.)*

## 9. Kapitel 1: Namensschild (ausgearbeitet)

**Lernziel:** Erste Form platzieren, Maße per Zahl eingeben, Text darauf, Loch für den
Schlüsselring, gruppieren, als STL exportieren. Ergebnis: ein druckbares Namensschild.

**Bewusst:** Das Schild wird aus Quader + Text + Zylinder **selbst gebaut**. Layerlings
fertiges Werkzeug „Namensschild“ kommt erst ganz am Ende als Bonus („So geht's in einem
Klick – und mit mehreren Farbschichten“).

| # | kind | Inhalt | Prüfung (großzügig) |
|---|---|---|---|
| 1 | info | Was bauen wir? Bild des fertigen Schilds. Kurze Tour: Arbeitsfläche, Formen-Knopf, Eigenschaften rechts. | – |
| 2 | learn | Neuen Entwurf anlegen („Neuen 3D-Entwurf erstellen“). | Editor offen, Entwurf leer oder neu |
| 3 | learn | Quader aus „Form hinzufügen“ holen und ablegen. | 1 neuer Quader |
| 4 | learn | Maße eintippen: ca. 70 × 25 × 3 mm. | ein Quader: Breite 40–120, Tiefe 15–50, Höhe 1,5–6 mm |
| 5 | learn | Text holen, eigenen Namen eintippen. | neue Textform, Text nicht leer |
| 6 | learn | Text auf die Platte setzen: Höhe ca. 2 mm, liegt auf der Oberseite. | Text überlappt Platte in x/z, Unterkante ≈ Plattenoberkante (±1 mm) |
| 7 | learn | Zylinder ⌀ ca. 5 mm an einer Ecke, auf **„Loch“** stellen, höher als die Platte. | neuer Zylinder, `hole`, ⌀ 3–8 mm, überlappt Platte |
| 8 | learn | Alles auswählen und **„Gruppieren“**. | Platte, Text und Loch in einer Gruppe |
| 9 | game | Von allen Seiten anschauen (Ansichtswürfel), prüfen, ob das Loch durchgeht. | manuell |
| 10 | learn | **„Export“** → STL herunterladen. | Export erkannt, sonst manuell |
| 11 | challenge | Ohne Hinweise: Ecken abrunden **oder** Text eingraviert statt erhaben **oder** zweiter Rahmen. | manuell (Selbst-Abhaken), optional erkannt |
| 12 | creative | Finale: Ideenliste (Türschild, Kofferanhänger, Geschenk), Bonus: fertiges Werkzeug „Namensschild“ ausprobieren. Konfetti. | manuell |

Die Maße oben sind Vorschläge im Text; die Prüfungen nehmen die Bereiche.
Hinweise in Stufe `neu`: zu jedem Schritt Zeige-Hand. Stufe `etwas`: Hand nur auf Knopfdruck 👆.

## 10. Kapitel 2–6 (Ausblick, nur als „kommt bald“ in der Übersicht)

| # | id | Titel | Stufe | Neu gelernt |
|---|---|---|---|---|
| 2 | `lesezeichen` | Lesezeichen mit eigener Form | etwas | Skizze zeichnen, Ecken runden, herausziehen, Text gravieren |
| 3 | `stiftebecher` | Stiftebecher | etwas | Aushöhlen mit Wandstärke, Lochmuster rundherum, Kanten runden |
| 4 | `handystaender` | Handyständer | profi | Profil-Skizze mit Winkel, Fasen, Überhang-Warnung |
| 5 | `schraubdose` | Dose mit Schraubdeckel | profi | Gewinde, zwei Teile mit Spiel, messen, ausrichten |
| 6 | `getriebe` | Kurbel-Getriebe | profi | Zahnräder, Achsen, mehrere Druckplatten |

## 11. Datenschutz, Fortschritt, Bedienung

- Fortschritt und Einstellungen in `chrome.storage.local` bzw. `localStorage` der Seite
  (wie Vorbild). Rechtsklick aufs Icon: „Erweiterung eingeschaltet“, „Lernfortschritt
  zurücksetzen“. Bei aus: Icon zeigt „AUS“.
- Einstieg: Knopf „Kurs starten“ im Editor (Position im Layerling-Menüband oder als
  schwebender Knopf – entscheidet der Bauende nach Platz) und auf der Layerling-Startseite.
- Keine Netzwerkzugriffe der Erweiterung.

## 12. Veröffentlichung (wie beim Scratch-Vorbild)

- **Name:** „Einführungskurs für Layerling – 3D-Konstruieren lernen“ (EN: „Intro Course for
  Layerling – learn 3D design“). Wie beim Vorbild deutlicher Hinweis auf Seite, im Store
  und im README: unabhängiges Projekt, nicht mit Layerling/henmedia verbunden. Icon ohne
  Layerling-Logo.
- **Repo:** `simonprell-dev/layerlingExtention` (Schreibweise wie `scratchExtention`),
  GitHub Pages aus `docs/`, `homepage_url` =
  `https://simonprell-dev.github.io/layerlingExtention/`.
- **Mitgeliefert:** GitHub-Pages-Seite DE/EN, Store-Texte DE/EN, Datenschutzangaben,
  Store-Screenshots (5 Stück) und Werbebilder in den Größen des Vorbilds, GitHub-Workflows
  `check.yml` und `release.yml` (ZIP für den Store) wie beim Vorbild, Issue-Vorlagen.
- **Macht Simon selbst:** Einreichen bei Chrome Web Store und Edge Add-ons. Repo anlegen und
  pushen nur nach ausdrücklicher Freigabe.
- *(Entscheidung Claude:)* Der Autor von Layerling wird nicht vorab gefragt; ein freundlicher
  Hinweis in den Layerling-Discussions nach dem Erscheinen wird im README vorgeschlagen.

## 13. Was der Bauende entscheidet

- Genaue Fiber-Suche und Selektoren in `layerling-access.js` (nach Untersuchung der
  laufenden Seite).
- Erkennung von „Export“ (Download-Ereignis, Dialog-DOM o. Ä.).
- Optik des Kursfensters (an Layerling-Hell/Dunkel angepasst), Bildmaterial für Schritte.
- Wortlaut der Texte innerhalb der Regeln aus 1. und 7.

## 14. Abnahme

- Kapitel 1 lässt sich auf layerling.com in DE und EN von Anfang bis Ende durchspielen,
  alle `learn`-Schritte haken automatisch ab.
- Sprache in Layerling umstellen → Kursfenster wechselt mit; Sprache ohne Übersetzung → Englisch.
- Erweiterung aus → keine Spur im Editor.
- Simulierter Fehlschlag des Formen-Zugriffs → freundliche Meldung, Selbst-Abhaken.
- `node tools/check-course.mjs` grün.

# Layerling-Interna (gemessen an v1.150.0, 2026-11-07)

Notizen aus der Live-Untersuchung von https://layerling.com/ (Chrome, DevTools/Playwright).
Alles, was die Erweiterung davon nutzt, steht in `lib/layerling-access.js`. Ändert Layerling
etwas, ist das die einzige Datei, die angepasst werden muss.

## Seiten

| Seite | Erkennung |
|---|---|
| Startseite | `.dashboard-action-tile.create` („Neuen 3D-Entwurf anlegen“) |
| Editor | URL `?editor=1&project=…`, Element `.editor-stage` |

Sprache: `localStorage['layerling.language']` ist nur gesetzt, wenn man sie von Hand wählt;
sonst steht die automatisch erkannte Sprache in `<html lang>`.

## Formen

- React 19, Fiber-Schlüssel `__reactFiber$<zufall>` an jedem Element; Wurzel über
  `document.body` → `.return` bis oben.
- **Weg 1 (genutzt):** Eine Ansichts-Komponente bekommt die Props
  `{projectName, projectId, shapes, selectedIds, …}`. Prop-Namen werden nicht minifiziert.
  Funktioniert auch bei leerem Entwurf (`shapes: []`).
- Weg 2 (Rückfall): Die Editor-Komponente (minifiziert, z. B. `TQ`, Props
  `initialShapes, onProjectShapesChange, …`) hält die Formen in Hook Nr. 2 (`useState`).
- Formobjekt: `{id, name, kind, color, x, z, elevation, size, width, depth, height, rotation,
  rotationX, rotationZ, hole?, text?, locked, hidden, …}`.
- **Koordinaten:** `x`/`z` = Mitte, `elevation` = Unterkante, y nach oben
  (`viewportShapeObjects.ts`: `position.set(x, elevation + height/2, z)`).
- **Gruppen:** `kind: 'mesh'`, `groupOperation: 'group'`, Teile in `groupedShapes` mit
  Koordinaten **relativ zur Gruppe**. Beispiel: Gruppe `x=-26,z=1`, Teile `(0,0)` und
  `(22,-21)` = absolut `(-26,1)` und `(-4,-20)`.
- Größenfelder im Eigenschaften-Fenster: 1. „Länge“ → `depth`, 2. „Breite“ → `width`,
  3. „Höhe“ → `height`. Die Prüfungen nutzen deshalb nur lange/kurze Seite.
- Text, den man auf eine Platte klickt, landet automatisch auf deren Oberseite
  (`elevation` = Plattenhöhe).

## Bedienelemente (sprachunabhängig)

| Ziel | Selektor |
|---|---|
| Form hinzufügen | `.shape-menu-trigger` |
| Bibliothekseintrag | `.shape-menu-item`, React-Key = Formart (`box`, `cylinder`, `text`, `nameTag`, …) |
| Bibliotheksbereich | `.shape-library-section` mit `.shape-library-toggle` |
| Werkzeuge | `[data-layerling-tool="group"]` usw. (Liste unten) |
| Eingeklappter Werkzeugbereich | `.toolbar-section[data-group=…]` mit `.toolbar-collapse-trigger` |
| Eigenschaften-Fenster | `.shape-inspector-header` (Elternelement = Fenster) |
| Körper / Aussparung | `.solid-choice` / `.hole-choice` |
| Maßfelder | `.range-property input[type=text]` |
| Export-Knopf | `button.action-icon-button` mit `title` „… (Ctrl+E)“ |
| Export-Fenster | `.export-action-panel`, Formatknöpfe mit Text `STL`, `3MF`, …; Download `.export-primary-button` |
| Ansichtswürfel | `.cube-face` (Eltern = Würfel) |
| Arbeitsfläche | `.editor-stage canvas` |

`data-layerling-tool`-Werte: copy paste duplicate delete undo redo history outliner
toggle-hidden group bundle ungroup intersect cutOut punch hull loftSketches clearance-check
print-check mirror pivot array holePattern faceTool split flexi supportRib stencilBridges
cookieCutter chamfer fillet hollow lid cableChannel offset deleteFace simplify makeExact
surfaceTexture paint align snap drop layFlat mateFaces center buildPlates command-search
interactive-help

Tastenkürzel: Strg+G gruppieren, Strg+E Export, S/H Körper/Aussparung.

## Nachträge aus den Kapiteln 2–6 (gemessen an v1.150.0)

### Skizze (Kapitel 2, 4)
- Reiter: `.toolbar-workspace-tabs [role=tab]` (Index 1 = „Skizze“, aktiv: `aria-selected="true"`).
- Skizzenleiste `.sketch-toolbar-ribbon`, Bereiche `.toolbar-section[data-group=create|draw|shapes|select|finish]`;
  Knöpfe **ohne** `data-layerling-tool`. Start: `.sketch-start-section .sketch-command-button.primary`,
  Abschluss: `.sketch-finish-section .sketch-command-button.primary`, „Skizze bearbeiten“: `.edit-sketch-button`.
- Während der Skizze ist die 3D-Ansicht abgebaut → `getShapes()` liefert den letzten Stand.
- Komponente `SketchWorkspace`, Props `{profile: {points: [{id, x, z, mode, handleIn?, handleOut?}],
  segments: [{id, startId, endId, kind: 'line'|'bezier'|'smooth'}]}, tool, selected, cornerDialog}`.
- Linien eintippen: Länge `<` Winkel, Enter (0° = rechts, 90° = oben = −z).
- Skizzenkörper: `kind: 'mesh'` (nicht `sketch`), id `sketch-extrusion-…`, `sketchProfile`,
  `sketchOperation: 'extrude'`, `height` = Extrusion (Vorgabe 10 mm).

### Kanten- und Wandwerkzeuge (Kapitel 3, 4, 5)
- Aushöhlen: Form wird `kind: 'mesh'` (id bleibt), `edgeTreatments: [{kind: 'shell', amount, openings}]`,
  `openings` = `'none'|'top'|'bottom'|'top-bottom'` oder Liste; Verlauf in `edgeTreatmentHistory[].before`.
  Fenster `.edge-modifier-panel.shell-panel`, Seiten `.shell-side-options button` (React-Key = Seite).
- Verrunden/Fasen: `edgeTreatments` bekommt `{kind: 'fillet'|'chamfer', amount, edgeCount, edgeIds}`.
  Schnellwahl `.edge-modifier-quick-actions button` (Alle, Obere, Untere, Senkrechte, Waagerechte),
  Fuß `.edge-modifier-footer .primary` (Anwenden) / `.secondary` (Fertig), Fehler `.edge-modifier-error`.
- Lochmuster: `.hole-pattern-panel`; Ergebnis Gruppe `grouped-manifold-cut-…` mit Löchern
  (`polygon` mit `sides: 6` oder `cylinder`, `hole: true`). **Offenes Fenster:** Vorschau-Formen
  `hole-pattern-preview-<n>` stehen schon in `shapes` (Kontext filtert sie heraus).
- Deckel: `.lid-panel`, Props `{settings: {type, gap, threadPitch, threadTurns, wall}}`, Arten
  `plug|cap|both|flat|screw|bayonet`; Schraubdeckel erzeugt Gewinde (`…-thread-…`) und Deckel (`…-lid-…`).
- Spiel prüfen: `.clearance-panel`, Props `{result: {tooFew, overlaps, touching, tight, fine, parts}, stale, running}`.
- Druck prüfen: `.print-check-panel`, Zeilen `.print-check-row[data-line=overhang|…]` mit `ok|warning|unchecked`,
  veraltet `.print-check-list.stale`. Startet nicht, solange ein anderes Werkzeugfenster offen ist.
- Ausrichten (L): `.align-overlay`, `.align-dot.axis-{x|z|y}.target-{min|center|max}`.

### Zahnräder und Druckplatten (Kapitel 6)
- `gear`: `teeth`, `gearProfile` (`involute|round|simple`), `gearType`, `centerHoleSize` (6), `toothSize`,
  `gearBacklash`; `width = depth` = Modul × (Zähne + 2). Neues Rad: 12 Zähne, Modul 2, Ø 28, Höhe 6.
- Zwei Räder gewählt: `p.selection-gear-pair` (Soll-/Ist-Achsabstand), `button.selection-gear-fit`.
- Druckplatten liegen entlang X im Abstand Arbeitsflächenbreite + 20 mm; im Formobjekt steht keine
  Platte. Leiste `.plate-bar`, Chips `.plate-bar-chip` mit `.plate-bar-chip-count`.
- Rechtsklick-Menü `.shape-context-menu button` (React-Keys `ontoPlate`, `plate-<n>`, `plate-new`).
- **Fehler in 1.150:** „Auf Platten verteilen“ wirft „e is not iterable“ – Kurs nutzt das Rechtsklick-Menü.

### Sonstiges
- Gruppen-Teile bekommen neue ids `<id>-group-child-<uuid>`; Gruppe mit Aussparung: `grouped-manifold-cut-…`.
- Eigenschaften-Karten: `properties-`, `position-` (X, Y = −z, Z = Unterkante), `rotation-` (Um X/Y/Z),
  `gear-teeth-`. Zylinderfelder: Seiten, Durchmesser, Höhe.
- Ist etwas ausgewählt, exportiert Layerling nur die Auswahl.
- Taste R dreht die Auswahl um 45°.

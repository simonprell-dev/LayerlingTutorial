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

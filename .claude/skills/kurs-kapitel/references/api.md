# Referenz: Datenformat, Prüf-Kontext, Hinweis-Ziele

Quelle der Wahrheit ist der Code: `course/context.js`, `course/flow.js`,
`lib/layerling-access.js` und der Kopfkommentar von `course/course-data.js`.

## Kapitel

```js
{
    id: 'stiftebecher',      // eindeutig, nie umbenennen (Fortschritt hängt daran)
    level: 'etwas',          // 'neu' | 'etwas' | 'profi'
    type: 'body',            // Abzeichen: basics | sketch | body | mechanics (Text: type.<x>)
    icon: '✏️',
    title: 'stiftebecher.title',
    desc: 'stiftebecher.desc',
    steps: [ /* … */ ]       // leer + comingSoon: true = „kommt bald“
}
```

## Schritt

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `kind` | ja | `info` · `learn` · `creative` · `game` · `challenge` |
| `title`, `text` | ja | Textschlüssel; `text` ist HTML |
| `tasks` | nein | `{text, check: c => bool}` oder `{text, manual: true}` |
| `hints` | nein | `{target, text, done: c => bool}` – der erste nicht erledigte wird gezeigt |
| `labels` | nein | Tour: `[{target, text}]`, alle gleichzeitig (für `info`) |
| `autoHints` | nein | überschreibt die Stufe (Standard: Hand automatisch nur bei `neu`) |

Erledigte Aufgaben bleiben im Schritt erledigt. Kann die Erweiterung die Formen nicht lesen,
werden alle Aufgaben zum Selbst-Abhaken.

## Prüf-Kontext `c`

| Hilfe | liefert |
|---|---|
| `c.shapes(kind?)` | alle Formen (inkl. Gruppen-Teile, absolute Koordinaten), optional einer Art |
| `c.solids(kind?)` / `c.holes(kind?)` | Körper / Aussparungen (`hole: true`) |
| `c.newShapes(kind?)` | Formen, die es bei Schrittbeginn noch nicht gab |
| `c.groups()` | `[{group, members}]` – `members` = alle Teile darin |
| `c.inGroupWith(a, b)` | in derselben Gruppe? |
| `c.size(s)` | `{long, short, h}` in mm |
| `c.near(a, b, mm)` | Hüllquader-Abstand ≤ mm |
| `c.onTop(oben, unten, mm)` | liegt auf der Oberseite (überlappt in x/z, Unterkante ≈ Oberkante) |
| `c.exported()` | in diesem Schritt exportiert (Klick auf „… exportieren“) |
| `c.panelOpen(name)` | `'shapes'` (Bibliothek), `'inspector'`, `'export'` |
| `c.placing(kind?)` | hängt gerade eine Form an der Maus (Ablege-Modus)? |
| `c.selectedCount()` | Anzahl ausgewählter Formen |
| `c.editorOpen` / `c.shapesKnown` | Editor offen / Formen lesbar |

Direkt nutzbar: `LK.geometry.bounds(s)` → `{minX, maxX, minY, maxY, minZ, maxZ}`,
`LK.geometry.overlapXZ(a, b)`.

Formobjekt (Layerling): `{id, kind, hole?, x, z, elevation, width, depth, height, rotation, text?}`
– `x/z` Mitte, `elevation` Unterkante, mm. Formarten u. a. `box`, `roundedBox`, `cylinder`,
`text`, `sphere`, `cone`, `tube`, `thread`, `gear`, `polygon`, `mesh` (Gruppe, ausgehöhlte Form oder Skizzenkörper mit `sketchProfile`).

## Hinweis-Ziele (`LK.access.TARGETS`)

| Ziel | zeigt auf |
|---|---|
| `newDesign` | Startseite: „Neuen 3D-Entwurf anlegen“ |
| `addShape` | „Form hinzufügen“ |
| `libItem:<art>` | Eintrag in der Formenbibliothek (ist sie zu: auf „Form hinzufügen“) |
| `inspector` | Eigenschaften-Fenster |
| `inspector:size` | Maßfelder (Karte eingeklappt: deren Kopf) |
| `inspector:text` | Textfeld einer Text-Form |
| `inspector:hole` / `inspector:solid` | „Aussparung“ / „Körper“ |
| `toolbar:group`, `toolbar:drop` | Werkzeug (Bereich eingeklappt: dessen Knopf) |
| `export`, `export:stl`, `export:download` | Export-Knopf, STL-Format, „STL exportieren“ |
| `viewCube` | Ansichtswürfel |
| `workplane` | Arbeitsfläche (Hand in der Mitte, ohne Ring) |

Neues Werkzeug-Ziel: in `TARGETS` `'toolbar:<name>': () => tool('<name>')` ergänzen, `<name>` =
`data-layerling-tool`-Wert (Liste in `docs/layerling-interna.md`).

## Kapitel-Dateien (ab Kapitel 2)

Jedes Kapitel liegt in eigenen Dateien: `course/chapters/<id>.js` (Struktur und Prüfungen),
`course/i18n/<sprache>/<id>.js` (Texte), `lib/targets/<id>.js` (zusätzliche Ziele über
`LK.access.dom`), `tests/chapter-<id>.test.mjs`. Die Skriptliste steht nur in `background.js`
(`CHAPTERS`); Tests und `npm run check` lesen sie von dort. `toolbar:<werkzeug>` (alle Werte in
`LK.access.TOOLS`) und `libItem:<art>` sind ohne Eintrag bekannte Ziele.

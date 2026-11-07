# Einführungskurs für Layerling – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Browser-Erweiterung (MV3), die auf layerling.com einen geführten, mehrsprachigen 3D-Kurs mit automatischen Prüfungen einblendet – Engine komplett, Kapitel 1 „Namensschild“ fertig, Kapitel 2–6 als „kommt bald“.

**Architecture:** Wie das Vorbild `scratchExtention`: Skripte ohne Bundler, per `chrome.scripting.registerContentScripts` in die Seite (`world: 'MAIN'`) gelegt, alle unter dem Namensraum `window.LK`. Reine Logik (Geometrie, Prüf-Kontext, Ablauf, Fortschritt, Sprache) liegt in eigenen Dateien und wird mit `node --test` geprüft; DOM-Teile (Overlay, Panel) und der Zugriff auf Layerling-Interna werden auf der echten Seite geprüft. Alle Zugriffe auf Layerling-Interna stehen ausschließlich in `lib/layerling-access.js`.

**Tech Stack:** Vanilla JS (ES2020, IIFE-Dateien), Chrome Manifest V3, Node ≥ 20 (`node --test`, keine Laufzeit-Abhängigkeiten), GitHub Actions, GitHub Pages.

**Spec:** [docs/superpowers/specs/2026-11-07-layerling-kurs-design.md](../specs/2026-11-07-layerling-kurs-design.md)

**Referenz-Code (nur lesen):** `scratchExtention` – https://github.com/simonprell-dev/scratchExtention (v. a. `background.js`, `reset-pending.js`, `course/course.js`, `course/course.css`, `.github/workflows/*`, `docs/index.html`). Layerling-Quelltext: https://github.com/henmedia/layerling (AGPL – nichts davon kopieren).

## Global Constraints

- Nur Host-Berechtigung `https://layerling.com/*`; Berechtigungen exakt `contextMenus`, `scripting`, `storage`.
- Name DE: „Einführungskurs für Layerling – 3D-Konstruieren lernen“; EN: „Intro Course for Layerling – learn 3D design“. Überall Hinweis: unabhängiges Projekt, nicht mit Layerling/henmedia verbunden. Icon ohne Layerling-Logo.
- Repo `simonprell-dev/layerlingExtention`, `homepage_url` `https://simonprell-dev.github.io/layerlingExtention/`. Lizenz MIT.
- Keine Netzwerkzugriffe, kein Server, keine Telemetrie. Formen von Layerling **nur lesen**, nie schreiben.
- Alle sichtbaren Kurstexte über Schlüssel aus `course/i18n/<code>.js`; DE und EN vollständig; Fallback Englisch.
- Texte: Du-Form, kurze Sätze, Zielgruppe 8–99, nicht kindlich; Knopfnamen fett so, wie sie in Layerling in der jeweiligen Sprache heißen; typografische Anführungszeichen „…“ (DE) bzw. “…” (EN).
- Prüfungen großzügig (Bereiche, eigene Wahl akzeptieren, Text nie über Inhalt prüfen).
- Stufen `neu` | `etwas` | `profi`: unterscheiden sich nur durch automatische Zeige-Hand (nur `neu`). `profi` startet bei Kapitel 1, solange Kapitel 2 „kommt bald“ ist.
- Code-Stil wie Vorbild: 4 Leerzeichen, einfache Anführungszeichen, `'use strict'`, deutsche Kommentare.
- Commit-Nachrichten enden mit `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Repo anlegen/pushen erst nach ausdrücklicher Freigabe durch Simon; Store-Einreichung macht Simon.

## Review Focus

1. **Layerling-Update bricht den Zugriff:** `LK.access.getShapes()` liefert `null` → Kursfenster zeigt die Meldung aus `access.unknownVersion` und alle Aufgaben werden selbst abhakbar; nichts wirft. Test in Task 6 (`flow: fallback`).
2. **Vorgriff/Gruppierung:** Wer schon gruppiert hat, bevor ein Schritt geprüft wird, hat Platte/Text/Loch nur noch in `groupedShapes` → Prüfungen sehen Gruppen-Kinder. Test in Task 2 (`flatten`) und Task 8 (`fertiges Schild als Gruppe`).
3. **Alter Entwurf mit Formen:** Ein vorhandener Quader darf Schritt 3 nicht erfüllen → `c.newShapes('box')` misst gegen IDs bei Schrittbeginn. Test in Task 4.
4. **Gedrehtes Schild:** Platte 25 × 70 statt 70 × 25 (oder 90° gedreht) muss Schritt 4 erfüllen → lange Seite 40–120, kurze 15–50. Test in Task 8.
5. **Sprache ohne Übersetzung / Regionalcode:** `layerling.language` = `pt-br`, `ja` oder fehlt → Englisch; `de` → Deutsch; einzelner fehlender DE-Schlüssel → EN-Text dieses Schlüssels. Test in Task 3.

---

## Dateistruktur

```
manifest.json
background.js              Icon-Klick, Kontextmenü, Skripte registrieren, Fortschritt zurücksetzen
reset-pending.js           holt ein Zurücksetzen nach (wie Vorbild)
icons/icon-{16,32,48,128}.png
lib/geometry.js            LK.geometry – Hüllquader, Gruppen flach machen, Überlappung
lib/layerling-access.js    LK.access – React-Fiber, Formen, Sprache, Ziele, Export-Zähler
course/i18n.js             LK.i18n – Sprache wählen, t(key)
course/i18n/de.js, en.js   LK.i18n.messages.de / .en
course/context.js          LK.makeContext – Prüf-Kontext c
course/progress.js         LK.progress – Zustand laden/speichern
course/flow.js             LK.flow – Ablauf-Logik (Aufgaben, Hinweis-Wahl, Übergänge, Fallback)
course/course-data.js      LK.course – Kapitel, Stufen
course/overlay.js          LK.overlay – Hand, Ring, Sprechblase, Konfetti
course/panel.js            LK.panel – Kursfenster, Stufenwahl, Start-Knopf
course/course.js           Hauptschleife: verbindet alles
course/course.css
tools/check-course.mjs     Übersetzungen, Ziele, IDs prüfen
tests/load.mjs             lädt IIFE-Dateien in eine vm mit Fake-window
tests/*.test.mjs
docs/index.html, docs/store/STORE-TEXTE.md, docs/store/*.png
.github/workflows/check.yml, release.yml, ISSUE_TEMPLATE/…, PULL_REQUEST_TEMPLATE.md
.claude/skills/kurs-kapitel/SKILL.md, references/api.md, references/vorlage.js
README.md, CHANGELOG.md, CONTRIBUTING.md, LICENSE, package.json, .gitignore
```

Jede `lib/`- und `course/`-Datei hat die Form
`(function (root) { 'use strict'; const LK = root.LK = root.LK || {}; … })(typeof window !== 'undefined' ? window : globalThis);`

---

### Task 1: Grundgerüst, Manifest, Test-Lader

**Files:**
- Create: `package.json`, `.gitignore`, `LICENSE`, `manifest.json`, `icons/icon-{16,32,48,128}.png`, `tools/make-icons.ps1`, `tests/load.mjs`, `tests/manifest.test.mjs`

**Interfaces:**
- Produces: `load(files: string[], extraGlobals?: object) => window` in `tests/load.mjs` – führt die Dateien nacheinander in einem `vm`-Kontext aus, dessen `window === globalThis`, und gibt das Fake-`window` zurück (mit `localStorage`-Ersatz aus einer `Map`).
- Produces: npm-Skripte `test` = `node --test tests/`, `check` = `node tools/check-course.mjs`.

- [ ] **Step 1: Test schreiben** `tests/manifest.test.mjs`

```js
test('manifest: nur layerling.com', () => {
    const m = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    assert.equal(m.manifest_version, 3);
    assert.deepEqual(m.host_permissions, ['https://layerling.com/*']);
    assert.deepEqual([...m.permissions].sort(), ['contextMenus', 'scripting', 'storage']);
    assert.equal(m.homepage_url, 'https://simonprell-dev.github.io/layerlingExtention/');
    assert.equal(m.background.service_worker, 'background.js');
    for (const s of ['16', '32', '48', '128']) assert.ok(fs.existsSync(m.icons[s]));
});
test('load: window ist global', () => {
    const w = load([]);
    assert.equal(typeof w.localStorage.getItem, 'function');
});
```

- [ ] **Step 2:** `npm test` → FAIL (Dateien fehlen).
- [ ] **Step 3:** Dateien anlegen. `manifest.json` nach Vorbild, Name als `__MSG_extName__` mit `_locales/de/messages.json` und `_locales/en/messages.json` (`default_locale: "en"`; Namen/Beschreibung aus Global Constraints). Icons per `tools/make-icons.ps1` (System.Drawing: abgerundetes Quadrat, Würfel in Schichten, Farben frei, kein Layerling-Logo). `package.json` mit `"type": "module"`, Version `0.1.0`, Repo-URLs aus Global Constraints. `LICENSE` MIT, Copyright Simon Prell.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `chore: Grundgerüst, Manifest und Test-Lader`.

---

### Task 2: Geometrie-Helfer

**Files:**
- Create: `lib/geometry.js`, `tests/geometry.test.mjs`

**Interfaces:**
- Consumes: Form-Objekte im Layerling-Format `{id, kind, hole?, x, z, elevation?, width, depth, height, rotation, text?, groupedShapes?, groupOperation?}`.
- Produces in `LK.geometry`:
  - `flatten(shapes) => Array<{shape, groupIds: string[]}>` – alle Formen inkl. aller Ebenen von `groupedShapes`; `groupIds` = IDs aller umgebenden Gruppen, außen zuerst. Gruppen selbst sind auch enthalten.
  - `bounds(shape) => {minX, maxX, minY, maxY, minZ, maxZ}` – `x`/`z` sind Mitte, `elevation` (Standard 0) ist Unterkante, `y` nach oben. Bei `rotation` (Grad um die Hochachse) Hüllquader des gedrehten Rechtecks.
  - `sizeOf(shape) => {long, short, h}` – `long = max(width, depth)`, `short = min(…)`, `h = height`.
  - `overlapXZ(a, b) => boolean`, `touchesTop(upper, lower, tol) => boolean` (|`upper.minY` − `lower.maxY`| ≤ tol **oder** upper beginnt innerhalb von lower und ragt darüber).

- [ ] **Step 1: Tests schreiben**

```js
test('bounds: Mitte und Unterkante', () => {
    assert.deepEqual(g.bounds({x: 0, z: 0, elevation: 3, width: 70, depth: 25, height: 2, rotation: 0}),
        {minX: -35, maxX: 35, minY: 3, maxY: 5, minZ: -12.5, maxZ: 12.5});
});
test('bounds: 90° gedreht tauscht x/z', () => { /* width 70, depth 25, rotation 90 → x ±12.5, z ±35 (auf 1e-6) */ });
test('flatten: Gruppe mit Kindern, zwei Ebenen', () => {
    const inner = {id: 'i', groupedShapes: [{id: 'c'}]};
    const out = g.flatten([{id: 'g', groupedShapes: [{id: 'a'}, inner]}]);
    assert.deepEqual(out.map(e => [e.shape.id, e.groupIds]),
        [['g', []], ['a', ['g']], ['i', ['g']], ['c', ['g', 'i']]]);
});
test('sizeOf: gedreht egal', () => assert.deepEqual(g.sizeOf({width: 25, depth: 70, height: 3}), {long: 70, short: 25, h: 3}));
test('touchesTop: Text auf Platte ±1 mm', () => { /* Platte h 3 → Text elevation 3.8: true; 4.5: false; 2.5 und höher als Platte: true */ });
test('overlapXZ: nebeneinander false, übereinander true', () => { /* … */ });
```

- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementieren.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: Geometrie-Helfer für Prüfungen`.

> Hinweis: Ob `groupedShapes` Weltkoordinaten oder relative Koordinaten enthalten, prüft Task 7 an der echten Seite. Weicht es ab, wird `flatten` dort angepasst (Kinder mit Gruppen-Versatz) und dieser Test ergänzt.

---

### Task 3: Sprache und Übersetzungen

**Files:**
- Create: `course/i18n.js`, `course/i18n/de.js`, `course/i18n/en.js` (vorerst nur Rahmen-Schlüssel: `panel.*`, `level.*`, `access.*`, `transition.*`, `common.*`), `tests/i18n.test.mjs`

**Interfaces:**
- Produces in `LK.i18n`:
  - `messages: {[code]: {[key]: string}}` – Sprachdateien tragen sich mit `LK.i18n.messages.de = {...}` ein.
  - `pick(layerlingLang: string|null) => string` – exakter Code, wenn `messages[code]` existiert, sonst `'en'`.
  - `setLanguage(code)`, `getLanguage() => string`
  - `t(key, vars?) => string` – aktuelle Sprache → `en` → der Schlüssel selbst; `{name}`-Platzhalter aus `vars`.

- [ ] **Step 1: Tests**

```js
test('pick', () => {
    assert.equal(i.pick('de'), 'de');
    assert.equal(i.pick('pt-br'), 'en');
    assert.equal(i.pick('ja'), 'en');
    assert.equal(i.pick(null), 'en');
});
test('t: fehlender DE-Schlüssel fällt auf EN', () => {
    i.messages.en['x.only'] = 'only en'; i.setLanguage('de');
    assert.equal(i.t('x.only'), 'only en');
    assert.equal(i.t('gibts.nicht'), 'gibts.nicht');
});
test('t: Platzhalter', () => { i.messages.de['x.hi'] = 'Hallo {name}'; assert.equal(i.t('x.hi', {name: 'Mia'}), 'Hallo Mia'); });
test('de und en haben dieselben Schlüssel', () => {
    assert.deepEqual(Object.keys(i.messages.de).sort(), Object.keys(i.messages.en).sort());
});
```

- [ ] **Step 2:** `npm test` → FAIL. **Step 3:** Implementieren; Rahmen-Schlüssel in DE/EN anlegen, darunter `access.unknownVersion` (DE: „Diese Layerling-Version kenne ich noch nicht – hake die Aufgaben bitte selbst ab.“), die drei Stufennamen aus Spec 8, `level.comingSoon` („kommt bald“ / “coming soon”). **Step 4:** PASS. **Step 5:** Commit `feat: Mehrsprachigkeit mit Englisch als Rückfall`.

---

### Task 4: Prüf-Kontext `c`

**Files:**
- Create: `course/context.js`, `tests/context.test.mjs`, `tests/fixtures/shapes.mjs` (Szenen: `empty`, `oldBox`, `plate`, `plateText`, `plateTextHole`, `finishedGroup`, `rotatedPlate`)

**Interfaces:**
- Consumes: `LK.geometry` (Task 2).
- Produces: `LK.makeContext({shapes, base, exportCount, panels}) => c` mit
  - `base`: `{ids: string[], exportCount: number}` – Zustand bei Schrittbeginn
  - `c.shapes(kind?)`, `c.solids(kind?)`, `c.holes(kind?)` → Formen (flach, inkl. Gruppen-Kinder; Gruppen selbst nur über `c.groups()`)
  - `c.groups() => Array<{group, members: shape[]}>` (`members` = alle Nachfahren)
  - `c.newShapes(kind?)` → Formen, deren `id` nicht in `base.ids` steht
  - `c.size(s)`, `c.near(a, b, mm)` (Hüllquader überlappen oder Abstand ≤ mm), `c.onTop(upper, lower, mm)`, `c.inGroupWith(a, b)`
  - `c.exported() => boolean` (`exportCount > base.exportCount`)
  - `c.panelOpen(name) => boolean` (aus `panels`-Set)
  - `c.editorOpen => boolean`, `c.shapesKnown => boolean` (`shapes !== null`)
  - Bei `shapes === null` liefern alle Abfragen leere Listen/`false`.

- [ ] **Step 1: Tests**

```js
test('newShapes ignoriert alten Quader', () => {
    const c = makeContext({shapes: S.oldBox, base: {ids: ['old'], exportCount: 0}});
    assert.equal(c.newShapes('box').length, 0);
});
test('Gruppen-Kinder zählen als Formen', () => {
    const c = makeContext({shapes: S.finishedGroup, base: {ids: [], exportCount: 0}});
    assert.equal(c.shapes('box').length, 1);
    assert.equal(c.holes('cylinder').length, 1);
    assert.ok(c.inGroupWith(c.shapes('box')[0], c.shapes('text')[0]));
});
test('shapes null → nichts, kein Fehler', () => {
    const c = makeContext({shapes: null, base: {ids: [], exportCount: 0}});
    assert.equal(c.shapesKnown, false); assert.deepEqual(c.shapes(), []);
});
test('exported zählt ab Schrittbeginn', () => { /* base 2, now 2 → false; now 3 → true */ });
```

- [ ] **Step 2:** FAIL. **Step 3:** Implementieren. **Step 4:** PASS. **Step 5:** Commit `feat: Prüf-Kontext für Aufgaben`.

---

### Task 5: Fortschritt speichern

**Files:**
- Create: `course/progress.js`, `tests/progress.test.mjs`

**Interfaces:**
- Produces in `LK.progress`:
  - `KEY = 'layerling-kurs:v1'` (in `localStorage` von layerling.com)
  - `load(storage) => State`, `save(storage, state)`, `reset(storage)`
  - `State = {level: 'neu'|'etwas'|'profi'|null, chapter: number, step: number, done: {[chapterId]: {[stepIndex]: number[] /* erledigte Aufgaben */}}, finished: string[], hintsOff: boolean, open: boolean, panelPos: {x, y}|null}`
  - Kaputtes JSON oder werfender Speicher → `defaultState()`, kein Fehler.

- [ ] **Step 1: Tests:** Rundreise speichern/laden; kaputtes JSON → Standard; `storage.getItem` wirft → Standard; `reset` entfernt `KEY`.
- [ ] **Step 2–4:** FAIL → implementieren → PASS.
- [ ] **Step 5:** Commit `feat: Lernfortschritt im Browser speichern`.

---

### Task 6: Ablauf-Logik

**Files:**
- Create: `course/flow.js`, `tests/flow.test.mjs`

**Interfaces:**
- Consumes: Kapitel-Format aus Spec 4 (`{id, level, type, icon, comingSoon?, steps}`; Schritt `{kind, title, text, image?, tasks?, hints?, autoHints?}`; Aufgabe `{text, check?(c), manual?}`; Hinweis `{target, action?: 'click'|'drag', to?, text, done(c)}`), Kontext aus Task 4.
- Produces in `LK.flow`:
  - `evaluate(step, c, doneBefore: number[]) => {done: number[], complete: boolean}` – Aufgaben bleiben erledigt (klebend); werfende `check` zählt als nicht erledigt; ist `c.shapesKnown === false`, gelten alle Aufgaben als `manual`.
  - `toggleManual(done, index) => number[]`
  - `pickHint(step, c) => hint|null` – erster Hinweis mit `!done(c)`; bei `kind === 'info'` immer `null`.
  - `showHintsAuto(level, chapter, step, hintsOff) => boolean` – `false` bei `hintsOff`; sonst `step.autoHints ?? (level === 'neu')`.
  - `sequence(chapters) => Array<{type: 'step', ci, si} | {type: 'transition', from, to}>` – ohne `comingSoon`-Kapitel; zwischen zwei Kapiteln ein Übergang „Entwurf sichern / neuen Entwurf anlegen“.
  - `startChapter(chapters, level) => number` – `neu`/`etwas` → Index des ersten Kapitels; `profi` → erstes Kapitel mit `level === 'profi'` und ohne `comingSoon`, sonst 0.

- [ ] **Step 1: Tests**

```js
test('Aufgaben bleiben erledigt', () => { /* check erst true, dann false → done bleibt [0] */ });
test('werfende Prüfung = nicht erledigt', () => { /* check wirft → done [] und kein Fehler */ });
test('fallback: Formen unbekannt → alles manuell', () => {
    const r = flow.evaluate({tasks: [{text: 'a', check: () => true}]}, {shapesKnown: false}, []);
    assert.deepEqual(r.done, []); // erst toggleManual hakt ab
});
test('pickHint: erster offener', () => { /* hints[0].done true, hints[1] false → hints[1] */ });
test('profi startet bei 1, solange Kapitel 2 comingSoon', () => { /* … → 0 */ });
test('sequence überspringt comingSoon, Übergang zwischen Kapiteln', () => { /* 2 fertige Kapitel → … step, transition, step … */ });
test('showHintsAuto: nur neu', () => { /* neu → true, etwas → false, profi → false, hintsOff → false */ });
```

- [ ] **Step 2–4:** FAIL → implementieren → PASS.
- [ ] **Step 5:** Commit `feat: Ablauf-Logik des Kurses`.

---

### Task 7: Zugriff auf Layerling (live untersuchen)

**Files:**
- Create: `lib/layerling-access.js`, `tests/access.test.mjs`, `docs/layerling-interna.md` (Notizen: was gefunden wurde, mit Layerling-Version)

**Interfaces:**
- Produces in `LK.access`:
  - `isShapeArray(v) => boolean` – Array, jedes Element Objekt mit `id` (string), `kind` (string), `width`/`depth`/`height` (number). Leeres Array zählt nur, wenn es an der zuletzt gefundenen Hook-Position liegt.
  - `findShapesInFiber(rootFiber) => WorkplaneShape[]|null` – läuft Fiber-Baum ab, durchsucht bei Funktions-Komponenten die `memoizedState`-Hook-Kette, merkt sich Komponente + Hook-Index für schnelle Folgeaufrufe.
  - `getShapes() => WorkplaneShape[]|null`, `getLanguage() => string|null` (`localStorage['layerling.language']`), `isEditorOpen() => boolean`, `exportCount() => number`, `openPanels() => Set<string>`
  - `TARGETS: {[id]: () => Element|null}` und `findTarget(id) => Element|null` mit mindestens: `newDesign`, `addShape`, `libItem:box`, `libItem:text`, `libItem:cylinder`, `libItem:nameTag`, `inspector`, `inspector:size`, `inspector:text`, `inspector:hole`, `inspector:solid`, `toolbar:group`, `export`, `export:stl`, `viewCube`, `workplane`. Erst Klassen/Struktur, Text nur über die aktuelle Layerling-Sprache.
  - `health() => {shapes: boolean, targets: string[] /* nicht gefundene */}`

- [ ] **Step 1: Tests (Fake-Fiber)**

```js
test('findet Formen-Hook in Fake-Fiber', () => {
    const shapes = [{id: 'a', kind: 'box', width: 1, depth: 1, height: 1}];
    const fiber = {tag: 0, memoizedState: {memoizedState: 5, next: {memoizedState: shapes, next: null}}, child: null, sibling: null};
    assert.equal(a.findShapesInFiber({child: fiber}), shapes);
});
test('ohne Treffer null', () => assert.equal(a.findShapesInFiber({child: null}), null));
test('TARGETS enthält alle Kurs-Ziele', () => { /* Liste oben ⊆ Object.keys(a.TARGETS) */ });
```

- [ ] **Step 2–4:** FAIL → Fiber-Teil implementieren → PASS.
- [ ] **Step 5: Live-Untersuchung** auf https://layerling.com/ in Chrome (DevTools): React-Root finden (`__reactContainer$…`), Formen-Hook bestätigen, Koordinaten-Konvention (`x`/`z` Mitte? `elevation` Unterkante? Gruppen-Kinder absolut?) mit einem 70 × 25 × 3-Quader prüfen, Selektoren für alle `TARGETS` ermitteln, Export-Erkennung festlegen (z. B. Klick auf STL-Knopf im Export-Dialog zählen). Ergebnis in `docs/layerling-interna.md`. Weicht die Konvention von Task 2 ab: `lib/geometry.js` + Test anpassen.
- [ ] **Step 6: Live-Prüfung:** Skript per DevTools-Snippet laden, `LK.access.getShapes()` nach Quader/Text/Gruppe ausgeben; `LK.access.health()` meldet keine fehlenden Ziele (in DE und EN).
- [ ] **Step 7:** Commit `feat: Zugriff auf Layerling-Formen und Bedienelemente`.

---

### Task 8: Kapitel 1 „Namensschild“ und Kapitel 2–6 als „kommt bald“

**Files:**
- Create: `course/course-data.js`, `tests/chapter1.test.mjs`
- Modify: `course/i18n/de.js`, `course/i18n/en.js` (alle Texte Kapitel 1, Titel/Beschreibung Kapitel 2–6)

**Interfaces:**
- Consumes: Kontext (Task 4), Ziel-IDs (Task 7).
- Produces: `LK.course = {chapters, levels}`; Kapitel 1 `id: 'namensschild'`, `level: 'neu'`, `icon: '🏷️'`, 12 Schritte genau nach Spec 9; Kapitel 2–6 mit IDs, Titeln, Stufen aus Spec 10 und `comingSoon: true, steps: []`. `levels` = die drei Stufen aus Spec 8.

Prüfungen (aus Spec 9, wörtlich als Bereiche):
- S3: `c.newShapes('box').length >= 1`
- S4: ein Quader mit `long` 40–120, `short` 15–50, `h` 1,5–6
- S5: neue `text`-Form mit nicht leerem `text`
- S6: Text überlappt Platte in x/z und `c.onTop(text, platte, 1)`
- S7: neuer `cylinder` mit `hole`, Durchmesser (`width`) 3–8, überlappt Platte
- S8: eine Gruppe enthält Platte, Text und Loch
- S9, S11, S12: `manual`; S10: `c.exported()`, alternativ `manual`
- S11 hat `autoHints: false`; S1 `kind: 'info'`.

- [ ] **Step 1: Tests**

```js
test('S4: gedrehte Platte 25×70 zählt', () => passes(1, 3, S.rotatedPlate));
test('S4: 200 mm breit zählt nicht', () => fails(1, 3, S.hugePlate));
test('S6: Text schwebt 5 mm drüber → nicht erledigt', () => fails(1, 5, S.floatingText));
test('S7: Loch 5 mm zählt, Vollkörper nicht', () => { /* … */ });
test('fertiges Schild als Gruppe erfüllt S3–S8', () => { for (const si of [2,3,4,5,6,7]) passes(1, si, S.finishedGroup); });
test('leere Szene erfüllt keine learn-Aufgabe', () => { /* alle learn-Schritte → done [] */ });
test('jeder Hinweis hat done, jedes target ist in TARGETS', () => { /* … */ });
test('alle Texte in de und en vorhanden', () => { /* jeder Schlüssel in course-data → in beiden messages */ });
```

(`passes/fails(chapterNo, stepIndex, scene)` = Test-Helfer: Kontext mit `base.ids = []` bauen, `flow.evaluate` → alle Aufgaben bzw. keine erledigt.)

- [ ] **Step 2–4:** FAIL → Kapitel und Texte schreiben → PASS. Knopfnamen in den Texten aus Layerlings Sprachdateien (`apps/web/src/lib/messages.de.ts`, `messages.en.ts` im Layerling-Repo) nachschlagen, nicht raten.
- [ ] **Step 5:** Commit `feat: Kapitel 1 Namensschild, Kapitel 2–6 angekündigt`.

---

### Task 9: Overlay, Kursfenster, Hauptschleife

**Files:**
- Create: `course/overlay.js`, `course/panel.js`, `course/course.js`, `course/course.css`

**Interfaces:**
- Consumes: alles aus Tasks 2–8.
- Produces:
  - `LK.overlay.point(el, text)`, `LK.overlay.drag(fromEl, toEl, text)`, `LK.overlay.clear()`, `LK.overlay.confetti()`
  - `LK.panel.render(viewModel)`, `LK.panel.onAction(cb)` – Aktionen: `next`, `back`, `toggleTask(i)`, `showHint`, `toggleHints`, `chooseLevel(id)`, `openChapter(ci)`, `close`
  - `course.js`: Takt 250 ms – `access` lesen → `makeContext` → `flow.evaluate`/`pickHint` → Panel/Overlay aktualisieren → bei Schritt geschafft Konfetti und „Weiter“ freigeben → `progress.save`. Hört auf `layerling-kurs-reset` (Fortschritt im Speicher neu). Sprache: bei jedem Takt `i18n.pick(access.getLanguage())`, bei Wechsel neu rendern.
  - Start-Knopf „Kurs starten“ schwebend unten links (Position frei), nur wenn `access.isEditorOpen()`; auf der Startseite ein Knopf, der auf „Neuen 3D-Entwurf erstellen“ zeigt.

Optik, Verhalten der Hand und Fenster-Verschieben wie im Vorbild (`course/course.js`, `course/course.css` dort), Farben passend zu Layerling hell/dunkel.

- [ ] **Step 1:** Implementieren.
- [ ] **Step 2: Live-Prüfung** (Erweiterung entpackt laden, layerling.com, F5): Stufenwahl erscheint; Kapitel 1 Schritt 1–12 in DE vollständig durchspielen – jede `learn`-Aufgabe hakt automatisch ab, Konfetti, Hand zeigt auf richtige Knöpfe; Stufe `etwas`: Hand nur über 👆; Sprache in Layerling auf EN → Kursfenster wechselt; Sprache auf Japanisch → Englisch; Neu laden mitten im Schritt → Fortschritt da; in DevTools `LK.access.getShapes = () => null` → Meldung `access.unknownVersion` und Selbst-Abhaken.
- [ ] **Step 3:** `npm test` → PASS (nichts kaputt).
- [ ] **Step 4:** Commit `feat: Kursfenster, Zeige-Hand und Hauptschleife`.

---

### Task 10: Hintergrund, Ein/Aus, Zurücksetzen

**Files:**
- Create: `background.js`, `reset-pending.js`, `_locales/*/messages.json` erweitern (Menütexte)

**Interfaces:**
- Wie Vorbild `background.js`, mit: `EDITOR_URL = 'https://layerling.com/'`, `TABS = 'https://layerling.com/*'`, Skriptliste in dieser Reihenfolge: `lib/geometry.js`, `lib/layerling-access.js`, `course/i18n.js`, `course/i18n/de.js`, `course/i18n/en.js`, `course/progress.js`, `course/context.js`, `course/flow.js`, `course/course-data.js`, `course/overlay.js`, `course/panel.js`, `course/course.js`; CSS `course/course.css`; `world: 'MAIN'`. Reset entfernt `layerling-kurs:v1` und sendet `layerling-kurs-reset`. Badge „AUS“ bzw. “OFF”. Menü- und Meldungstexte über `chrome.i18n.getMessage`.

- [ ] **Step 1:** Implementieren.
- [ ] **Step 2: Test** `tests/background.test.mjs`: liest `background.js` als Text, prüft, dass jede Datei der Skriptliste existiert und dass jede `lib/`/`course/`-`.js`-Datei (außer Tests) in der Liste steht.
- [ ] **Step 3:** `npm test` → PASS.
- [ ] **Step 4: Live-Prüfung:** Icon-Klick öffnet/holt layerling.com; Rechtsklick → aus → F5 → keine Spur im Editor, Badge „AUS“; Fortschritt zurücksetzen mit Rückfrage, auch ohne offenen Tab (beim nächsten Besuch).
- [ ] **Step 5:** Commit `feat: Symbol, Ein/Aus und Fortschritt zurücksetzen`.

---

### Task 11: Prüfskript und CI

**Files:**
- Create: `tools/check-course.mjs`, `.github/workflows/check.yml`, `.github/workflows/release.yml`

**Interfaces:**
- `node tools/check-course.mjs` lädt alle Kursdateien (über `tests/load.mjs`) und meldet mit Kapitel/Schritt: fehlende Schlüssel je Sprache (alle Dateien in `course/i18n/`), Hinweis-`target` nicht in `access.TARGETS`, doppelte Kapitel-IDs, `learn`-Aufgabe ohne `check` und ohne `manual`, Hinweis ohne `done`. Exit 1 bei Problemen, sonst „Alles ok.“ / “All good.”
- `check.yml`: `node --check` für alle JS-Dateien, `npm test`, `npm run check`, Manifest-JSON gültig. `release.yml` wie Vorbild mit Namen `einfuehrungskurs-layerling-vX.Y.Z(.zip|-store.zip)` und Ordnern `icons _locales course lib`.

- [ ] **Step 1: Test** `tests/check-course.test.mjs`: Kurs mit absichtlich fehlendem EN-Schlüssel und unbekanntem Ziel (Fake-Daten) → Skript-Funktion `findProblems(course, messages, targets)` liefert genau diese 2 Probleme; echter Kurs → 0.
- [ ] **Step 2–4:** FAIL → implementieren → PASS; `npm run check` → „Alles ok.“
- [ ] **Step 5:** Commit `ci: Kursprüfung und Release-Workflow`.

---

### Task 12: Seite, Store-Texte, Doku, Skill

**Files:**
- Create: `docs/index.html` (DE, mit Umschalter zu `docs/en/index.html`), `docs/en/index.html`, `docs/.nojekyll`, `docs/store/STORE-TEXTE.md` (DE + EN, inkl. Datenschutzangaben), `README.md`, `CHANGELOG.md` (`## [0.1.0]`), `CONTRIBUTING.md` (u. a. „Neue Sprache hinzufügen“), `.github/ISSUE_TEMPLATE/{config.yml,fehler.yml,kursidee.yml}`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/FUNDING.yml` (wie Vorbild), `.claude/skills/kurs-kapitel/{SKILL.md,references/api.md,references/vorlage.js}`

Inhalt und Aufbau nach Vorbild (`docs/index.html`, `README.md`, Skill `kurs-kapitel`), angepasst: Layerling statt Scratch, 8–99 Jahre, 1 fertiges Kapitel + 5 angekündigt, Mehrsprachigkeit, Unabhängigkeits-Hinweis, Vorschlag im README für einen Hinweis in den Layerling-Discussions. Skill `api.md` beschreibt Kontext `c` (Task 4), Hinweis-Ziele (Task 7) und das i18n-Schlüsselformat `<kapitel>.s<n>.<feld>`.

- [ ] **Step 1:** Schreiben.
- [ ] **Step 2:** `npm test` und `npm run check` → PASS; Seite lokal im Browser öffnen, bei 375 px Breite kein waagerechtes Scrollen.
- [ ] **Step 3:** Commit `docs: Projektseite, Store-Texte, Anleitung und Kapitel-Skill`.

---

### Task 13: Abnahme und Store-Bilder

- [ ] **Step 1:** Abnahme aus Spec 14 komplett auf layerling.com durchgehen (DE und EN, Ein/Aus, Fallback, `npm run check`). Ergebnisse in `docs/abnahme-0.1.0.md`.
- [ ] **Step 2:** 5 Screenshots 1280 × 800 (Stufenwahl, Hand zeigt auf „Form hinzufügen“, Aufgabe abgehakt mit Konfetti, fertiges Namensschild, Kursübersicht mit „kommt bald“) und Werbebilder 440 × 280 und 1400 × 560 nach `docs/store/`.
- [ ] **Step 3:** Commit `docs: Abnahme 0.1.0 und Store-Bilder`.
- [ ] **Step 4:** Simon fragen, ob Repo `simonprell-dev/layerlingExtention` angelegt, gepusht und Pages eingeschaltet werden soll – erst nach Ja ausführen.

import test from 'node:test';
import assert from 'node:assert/strict';
import {load, plain, courseFiles} from './load.mjs';

const w = load(courseFiles());
const {LK} = w;
const ch = LK.course.chapters.find(c => c.id === 'schraubdose');

const ctx = (shapes, extra = {}) => LK.makeContext({shapes, base: {ids: [], exportCount: 0}, exportCount: 0,
    panels: new Set(), editorOpen: true, selection: [], ...extra});
const done = (si, shapes, extra) => plain(LK.flow.evaluate(ch.steps[si], ctx(shapes, extra), []).done);
const passes = (si, shapes, extra) => assert.equal(done(si, shapes, extra).length, ch.steps[si].tasks.length, `Schritt ${si + 1}: ${done(si, shapes, extra)}`);
const fails = (si, shapes, extra) => assert.deepEqual(done(si, shapes, extra), [], `Schritt ${si + 1}`);
const hasNot = (si, shapes, ti, extra) => assert.ok(!done(si, shapes, extra).includes(ti), `Schritt ${si + 1}, Aufgabe ${ti + 1}`);

// Fenster-Leser (lib/targets/schraubdose.js) für einen Test ersetzen.
function withPanels (panels, fn) {
    const saved = {...LK.schraubdose};
    Object.assign(LK.schraubdose, panels);
    try {
        fn();
    } finally {
        Object.assign(LK.schraubdose, saved);
    }
}

// ---------- Szenen, gemessen live an Layerling v1.150.0 ----------
// Zylinder Ø 50 × 40 → „Aushöhlen“ (Wand 2, oben offen) → „Deckel“, „Aufgeschraubt“, Spalt 0,2, Steigung 3, 2 Umdrehungen.

const SRC = 'cylinder-0cd14a8a-db22-41b9-afd2-ed1d452a4c1c';
const cylinder = {id: SRC, name: 'Zylinder', kind: 'cylinder', x: -12, z: -12, elevation: 0, width: 50, depth: 50, height: 40, rotation: 0};
const shell = {kind: 'shell', amount: 2, edgeCount: 0, openings: 'top'};
const hollowed = {...cylinder, kind: 'mesh', edgeTreatments: [shell]};

// Deckelnetz wie Layerlings importedMesh: Punkte lokal um die Mitte, Platte unten (0–2 mm), Rand innen bei 25 + Spalt.
function lidMesh (gap, outer = 27.71) {
    const pos = [];
    const ring = (r, y) => {
        for (let a = 0; a < 360; a += 15) pos.push(r * Math.cos(a * Math.PI / 180), y, r * Math.sin(a * Math.PI / 180));
    };
    ring(0, 0); ring(outer, 0); ring(outer, 2); ring(10, 2);
    for (const y of [2.5, 4, 6, 8]) {
        ring(25 + gap + 0.3, y); // Gewindegrund
        ring(25 + gap, y);       // innerste Stelle: Dose + Spalt
        ring(outer, y);
    }
    return {positions: pos, baseWidth: 2 * outer, baseDepth: 2 * outer, baseHeight: 8, triangleCount: pos.length / 9, sourceFormat: 'mesh'};
}
const lidWith = (gap, over = {}) => ({id: `${SRC}-lid-960200f6-f77d-4a7e-8858-b0961aac3a23`, name: 'Zylinder Deckel', kind: 'mesh',
    x: 50.72, z: -12, elevation: 0, width: 55.42, depth: 55.42, height: 8, rotation: 0, importedMesh: lidMesh(gap), ...over});
const canGroup = (over = {}) => ({id: 'grouped-manifold-union-8ee6c8ea-038c-42d6-ba9d-ecbd861034df', name: 'Zylinder', kind: 'mesh', groupOperation: 'group',
    x: -12, z: -12, elevation: 0, width: 51.82, depth: 51.82, height: 40, rotation: 0, ...over,
    groupedShapes: [
        {...hollowed, id: `${SRC}-group-child-af0c1d2e`, x: 0, z: 0},
        {id: `${SRC}-thread-9a6825d1-group-child-ccd45f86`, name: 'Zylinder Gewinde', kind: 'mesh', x: 0, z: 0, elevation: 34,
            width: 51.82, depth: 51.82, height: 5.8, rotation: 0}
    ]});

// So liegt es direkt nach „Deckel machen“: 9,1 mm Abstand (zwischen Gewinde und Deckelrand), gleiche Tiefe.
const made = [canGroup(), lidWith(0.2)];
// Deckel mit dem Maßband auf 5 mm gerückt: −12 + 25,91 + 5 + 27,71.
const finished = [canGroup(), lidWith(0.2, {x: 46.62})];
const noPlay = [canGroup(), lidWith(0, {x: 46.62})];
const overlapping = [canGroup(), lidWith(0.2, {x: -12})];

const allClear = {clearancePanel: () => ({stale: false, running: false, result: {tooFew: false, overlaps: 0, touching: 0, tight: 0, parts: 2}})};
const screwPanel = gap => ({lidPanel: () => ({settings: {type: 'screw', gap, threadPitch: 3, threadTurns: 2, wall: 1.6}, busy: false, error: null})});

// ---------- Aufbau ----------

test('Schraubdose: Profi-Kapitel mit 11 Schritten', () => {
    assert.ok(ch, 'Kapitel gefunden');
    assert.equal(ch.level, 'profi');
    assert.equal(ch.type, 'mechanics');
    assert.ok(!ch.comingSoon);
    assert.deepEqual(plain(ch.steps.map(s => s.kind)),
        ['info', 'learn', 'learn', 'learn', 'learn', 'learn', 'learn', 'game', 'learn', 'challenge', 'creative']);
    assert.equal(ch.steps[9].autoHints, false);
    ch.steps.forEach((s, si) => (s.hints || []).forEach(h => {
        assert.equal(typeof h.done, 'function', `Schritt ${si + 1}`);
        assert.ok(LK.access.TARGETS[h.target], `Schritt ${si + 1}: ${h.target}`);
    }));
    (ch.steps[0].labels || []).forEach(l => assert.ok(LK.access.TARGETS[l.target], l.target));
});

test('Fenster-Leser ohne Seite: null, Ziele ohne Seite: null', () => {
    assert.equal(LK.schraubdose.lidPanel(), null);
    assert.equal(LK.schraubdose.shellPanel(), null);
    assert.equal(LK.schraubdose.clearancePanel(), null);
    assert.equal(LK.access.findTarget('schraubdose:lidScrew'), null);
});

// ---------- Schritt für Schritt ----------

test('S2: Zylinder Ø 40–70, 30–80 hoch', () => {
    passes(1, [cylinder]);
    passes(1, [{...cylinder, width: 70, depth: 70, height: 30}]);
    hasNot(1, [{...cylinder, width: 20, depth: 20, height: 20}], 1);
    hasNot(1, [{...cylinder, width: 50, depth: 30}], 1);
    fails(1, []);
    assert.deepEqual(plain(LK.flow.evaluate(ch.steps[1], LK.makeContext({shapes: [cylinder], base: {ids: [SRC]}, editorOpen: true}), []).done), [1],
        'alter Zylinder zählt nicht als neu');
});

test('S3: ausgehöhlt, nur oben offen, Wand ~2 mm (live: edgeTreatments shell)', () => {
    passes(2, [hollowed]);
    fails(2, [cylinder]);
    fails(2, [{...hollowed, edgeTreatments: [{...shell, openings: 'top-bottom'}]}]);
    fails(2, [{...hollowed, edgeTreatments: [{...shell, openings: ['top', 'front']}]}]);
    passes(2, [{...hollowed, edgeTreatments: [{...shell, openings: ['top']}]}]);
    hasNot(2, [{...hollowed, edgeTreatments: [{...shell, amount: 0.6}]}], 1);
    // klassisch: Zylinder-Aussparung von oben, Boden bleibt
    const hole = {id: 'h', kind: 'cylinder', hole: true, x: -12, z: -12, elevation: 2, width: 46, depth: 46, height: 40, rotation: 0};
    passes(2, [cylinder, hole]);
    fails(2, [cylinder, {...hole, elevation: -1, height: 45}]);
});

test('S3: Hinweise folgen dem Fenster „Aushöhlen“', () => {
    const pick = (shapes, extra) => LK.flow.pickHint(ch.steps[2], ctx(shapes, extra)).target;
    assert.equal(pick([cylinder]), 'workplane');
    assert.equal(pick([cylinder], {selection: [SRC]}), 'toolbar:hollow');
    withPanels({shellPanel: () => ({thickness: 2, openings: 'top-bottom'})}, () => assert.equal(pick([cylinder]), 'schraubdose:shellTop'));
    withPanels({shellPanel: () => ({thickness: 0.4, openings: 'top'})}, () => assert.equal(pick([cylinder]), 'schraubdose:shellWall'));
    withPanels({shellPanel: () => ({thickness: 2, openings: 'top'})}, () => assert.equal(pick([cylinder]), 'schraubdose:shellApply'));
    assert.equal(LK.flow.pickHint(ch.steps[2], ctx([hollowed])), null);
});

test('S4: Deckel-Werkzeug offen, Art „Aufgeschraubt“', () => {
    fails(3, [hollowed]);
    withPanels({lidPanel: () => ({settings: {type: 'plug', gap: 0.2}})}, () => assert.deepEqual(done(3, [hollowed]), [0]));
    withPanels(screwPanel(0.2), () => passes(3, [hollowed]));
    passes(3, made);
    withPanels({lidPanel: () => ({settings: {type: 'plug', gap: 0.2}})}, () =>
        assert.equal(LK.flow.pickHint(ch.steps[3], ctx([hollowed])).target, 'schraubdose:lidScrew'));
});

test('S5: Spiel 0,2–0,4 mm, gemessen am Deckelnetz (live: 0,21 bei 0,2 und 0,01 bei 0)', () => {
    const h = ch.helpers;
    const gapOf = shapes => h.gapOf(h.sets(ctx(shapes))[0]);
    assert.ok(Math.abs(gapOf(made) - 0.2) < 0.02);
    assert.ok(Math.abs(gapOf(noPlay)) < 0.02);
    passes(4, made);
    passes(4, [canGroup(), lidWith(0.3)]);
    assert.deepEqual(done(4, noPlay), [1], 'ohne Spiel: nur „gemacht“');
    assert.deepEqual(done(4, [canGroup(), lidWith(0.8)]), [1], 'zu locker');
    fails(4, [hollowed]);
    withPanels(screwPanel(0.2), () => assert.deepEqual(done(4, [hollowed]), [0]));
    withPanels(screwPanel(0), () => fails(4, [hollowed]));
    withPanels(screwPanel(0), () => assert.equal(LK.flow.pickHint(ch.steps[4], ctx([hollowed])).target, 'schraubdose:lidFit'));
    withPanels(screwPanel(0.2), () => assert.equal(LK.flow.pickHint(ch.steps[4], ctx([hollowed])).target, 'schraubdose:lidApply'));
    // skaliert: Netz bleibt, Breite wächst → Radius wächst mit
    assert.ok(Math.abs(h.innerRadius(lidWith(0.2, {width: 110.84, depth: 110.84})) - 50.4) < 0.01);
    // Deckel ohne Gewinde (andere Art) zählt nicht als Schraubdeckel
    fails(4, [hollowed, {...lidWith(0.2), id: 'cylinder-x-lid-1'}]);
});

test('S6: 5 mm Abstand, auf einer Linie, auf der Platte', () => {
    assert.ok(Math.abs(ch.helpers.distance(ch.helpers.sets(ctx(made))[0]) - 9.1) < 0.05, 'Abstand nur auf der Platte (live 9,1)');
    assert.deepEqual(done(5, made), [1, 2], 'direkt nach „Deckel machen“: 9,1 mm');
    passes(5, finished);
    hasNot(5, overlapping, 0);
    hasNot(5, [canGroup(), lidWith(0.2, {x: 46.62, z: 0})], 1);
    hasNot(5, [canGroup(), lidWith(0.2, {x: 46.62, elevation: 3})], 2);
    // Reihe nach vorn (z) statt zur Seite: auch gut
    passes(5, [canGroup(), lidWith(0.2, {x: -12, z: -12 + 25.91 + 5 + 27.71})]);
    // Drehung egal
    passes(5, [canGroup({rotation: 90}), lidWith(0.2, {x: 46.62, rotation: 33})]);
});

test('S6: Hinweis „mittig“ quer zur Reihe', () => {
    const along = [canGroup(), lidWith(0.2, {x: 46.62, z: 3})];
    const front = [canGroup(), lidWith(0.2, {x: -2, z: 46.62})];
    const sel = {selection: ['a', 'b']};
    assert.equal(LK.flow.pickHint(ch.steps[5], ctx(along, sel)).target, 'toolbar:align');
    const skipAlign = s => ch.steps[5].hints.find(h => /alignCenter/.test(h.target) && !h.done(ctx(s, sel))).target;
    assert.equal(skipAlign(along), 'schraubdose:alignCenterZ');
    assert.equal(skipAlign(front), 'schraubdose:alignCenterX');
});

test('S7: „Spiel prüfen“ ohne Probleme, zwei getrennte Teile', () => {
    withPanels(allClear, () => passes(6, finished));
    assert.deepEqual(done(6, finished), [1], 'ohne Prüfung nur die Geometrie');
    withPanels(allClear, () => hasNot(6, overlapping, 1));
    withPanels({clearancePanel: () => ({stale: false, running: false, result: {tooFew: false, overlaps: 1, touching: 0, tight: 0, parts: 2}})},
        () => fails(6, overlapping));
    withPanels({clearancePanel: () => ({stale: false, running: false, result: {tooFew: true, overlaps: 0, touching: 0, tight: 0, parts: 1}})},
        () => hasNot(6, finished, 0));
    withPanels({clearancePanel: () => ({stale: true, running: false, result: {tooFew: false, overlaps: 0, touching: 0, tight: 0, parts: 2}})},
        () => hasNot(6, finished, 0));
    // live gesehen: nur der Deckel ausgewählt → „Weniger als zwei Teile“ → erst Auswahl aufheben
    assert.equal(LK.flow.pickHint(ch.steps[6], ctx(finished, {selection: ['lid']})).target, 'workplane');
    assert.equal(LK.flow.pickHint(ch.steps[6], ctx(finished)).target, 'toolbar:clearance-check');
});

test('S9: Export erkannt', () => {
    fails(8, finished);
    passes(8, finished, {exportCount: 1});
});

// ---------- Ganze Szenen ----------

test('fertige Dose erfüllt alle learn-Schritte außer Export – auch gruppiert und verschoben (Vorgriff)', () => {
    const learn = ch.steps.map((s, i) => [s, i]).filter(([s, i]) => s.kind === 'learn' && i !== 8).map(([, i]) => i);
    withPanels(allClear, () => {
        for (const si of learn) passes(si, finished);
        const all = {id: 'outer', kind: 'mesh', groupOperation: 'group', x: 10, z: 20, elevation: 0, width: 140, depth: 60, height: 40, rotation: 0,
            groupedShapes: finished.map(s => ({...s, x: s.x - 10, z: s.z - 20}))};
        for (const si of learn) passes(si, [all]);
    });
});

test('leere Szene erfüllt keine Aufgabe', () => {
    ch.steps.forEach((s, i) => {
        if (s.tasks && s.tasks.some(t => !t.manual)) fails(i, []);
    });
});

test('typische Fehler werden nicht abgehakt: Teile überlappen, kein Spiel', () => {
    withPanels(allClear, () => {
        hasNot(5, overlapping, 0);
        hasNot(6, overlapping, 1);
        hasNot(4, noPlay, 0);
    });
});

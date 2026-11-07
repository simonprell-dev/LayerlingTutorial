import test from 'node:test';
import assert from 'node:assert/strict';
import {load, plain, courseFiles} from './load.mjs';

const w = load(courseFiles());
const {LK} = w;
const ch = LK.course.chapters.find(c => c.id === 'stiftebecher');

const ctx = (shapes, extra = {}) => LK.makeContext({shapes, base: {ids: [], exportCount: 0}, exportCount: 0,
    panels: new Set(), editorOpen: true, selection: [], ...extra});
const done = (si, shapes, extra) => plain(LK.flow.evaluate(ch.steps[si], ctx(shapes, extra), []).done);
const passes = (si, shapes, extra) => assert.equal(done(si, shapes, extra).length, ch.steps[si].tasks.length, `Schritt ${si + 1}`);
const fails = (si, shapes, extra) => assert.deepEqual(done(si, shapes, extra), [], `Schritt ${si + 1}`);
const hint = (si, shapes, extra) => {
    const h = LK.flow.pickHint(ch.steps[si], ctx(shapes, extra));
    return h && h.target;
};

// ---------- Szenen, live gemessen in Layerling 1.150 (Ø 70, 100 hoch, Wand 2, Rand 0,8, Lochmuster Sechseck) ----------

const shell = {kind: 'shell', amount: 2, edgeCount: 0, openings: 'top'};
const rim = {kind: 'fillet', amount: 0.8, edgeCount: 2, edgeIds: [0, 3]};
const cylinder = {id: 'cylinder-0d42', name: 'Zylinder', kind: 'cylinder', x: -12, z: -12, elevation: 0, size: 70,
    width: 70, depth: 70, height: 100, rotation: 0, rotationX: 0, rotationZ: 0, bevel: 0, segments: 1};
// Nach „Aushöhlen“: kind 'mesh', id bleibt, edgeTreatments bekommt das 'shell'.
const hollow = {...cylinder, kind: 'mesh', edgeResizeMode: 'preserve', edgeTreatments: [shell],
    edgeTreatmentHistory: [{id: 'h1', feature: shell, before: cylinder}]};
// Nach „Verrundung“ → „Obere Kanten“, 0,8 mm.
const rimmed = {...hollow, edgeTreatments: [shell, rim],
    edgeTreatmentHistory: [...hollow.edgeTreatmentHistory, {id: 'h2', feature: rim, before: hollow}]};

// Lochmuster auf der runden Wand: 24 Löcher je Reihe, versetzte Reihen, Mitte 33,94 mm von der Achse,
// relativ zur Gruppe. Gemessen: Loch 1 x 9,17 z 32,68, elevation 9,56, rotationX 270.
function wallPattern ({rows = 11, perRow = 24, from = 0, to = 360, r = 33.94, kind = 'polygon', id = 'polygon'} = {}) {
    const out = [];
    for (let row = 0; row < rows; row++) {
        for (let i = 0; i < perRow; i++) {
            const a = (from + (to - from) * i / perRow + (row % 2 ? 7.5 : 0)) * Math.PI / 180;
            out.push({id: `${id}-${row}-${i}-group-child-x`, name: `Loch ${row * perRow + i + 1}`, kind, hole: true,
                x: r * Math.cos(a), z: r * Math.sin(a), elevation: 9.56 + row * 7.79, size: 6,
                width: kind === 'polygon' ? 5.196152422706632 : 6, depth: 6, height: 2.508, rotation: 0,
                rotationX: 270, rotationZ: 180 + i * 15, ...(kind === 'polygon' ? {sides: 6} : {})});
        }
    }
    return out;
}
const child = s => ({...s, id: `${s.id}-group-child-b46b`, x: -0.0012, z: -0.0013});
const patternGroup = (cup, holes, extra = {}) => ({id: 'grouped-manifold-cut-9035', name: 'Group', kind: 'mesh', x: -12, z: -12,
    elevation: 0, size: 70, width: 70, depth: 70, height: 100, rotation: 0, rotationX: 0, rotationZ: 0, groupOperation: 'group',
    groupedBaseWidth: 70, groupedBaseDepth: 70, groupedBaseHeight: 100, groupedShapes: [child(cup), ...holes], ...extra});

const S = {
    cylinder: [cylinder],
    hollow: [hollow],
    rimmed: [rimmed],
    // Fertig: Aushöhlen → Rand → Lochmuster (Reihenfolge des Kapitels)
    finished: [patternGroup(rimmed, wallPattern())],
    finishedRound: [patternGroup(rimmed, wallPattern({kind: 'cylinder', id: 'cylinder-74b6'}))],
    // Andere Reihenfolge, live gemessen: Verrunden NACH dem Lochmuster backt alles zu einem Körper;
    // Becher, 'shell' und Löcher stehen nur noch in edgeTreatmentHistory[].before.
    baked: (() => {
        const before = patternGroup(hollow, wallPattern({rows: 5, perRow: 13}));
        return [{id: 'grouped-manifold-cut-6b83', name: 'Group', kind: 'mesh', x: -12, z: -12, elevation: 0, size: 70, width: 70,
            depth: 70, height: 100, rotation: 0, rotationX: 0, rotationZ: 0, groupOperation: 'group', edgeResizeMode: 'scale',
            edgeTreatments: [{kind: 'fillet', amount: 0.8, edgeCount: 2, edgeIds: [14, 441]}],
            edgeTreatmentHistory: [{id: 'h3', feature: {kind: 'fillet', amount: 0.8, edgeCount: 2}, before}]}];
    })()
};

test('Stiftebecher: 9 Schritte, Stufe etwas, Typ body, nicht mehr „kommt bald“', () => {
    assert.equal(ch.level, 'etwas');
    assert.equal(ch.type, 'body');
    assert.equal(ch.icon, '✏️');
    assert.ok(!ch.comingSoon);
    assert.deepEqual(plain(ch.steps.map(s => s.kind)),
        ['info', 'learn', 'learn', 'learn', 'learn', 'game', 'learn', 'challenge', 'creative']);
    assert.equal(ch.steps[7].autoHints, false);
    assert.equal(ch.steps[6].hints[1].target, 'export:download');
});

test('fertiger Becher erfüllt alle learn-Schritte außer Export – auch mit runden Löchern und andersherum verrundet', () => {
    for (const scene of [S.finished, S.finishedRound, S.baked]) {
        for (const si of [1, 2, 3, 4]) passes(si, scene);
        fails(6, scene);
    }
});

test('leere Szene: nur „neuer Entwurf“ abgehakt, sonst nichts', () => {
    assert.deepEqual(done(1, []), [0]);
    ch.steps.slice(2).forEach((s, i) => assert.deepEqual(plain(LK.flow.evaluate(s, ctx([]), []).done), [], `Schritt ${i + 3}`));
});

test('S2: Zylinder als Bereich (Ø 50–100, 70–130 hoch), Drehung egal; falsche Maße und Aussparung nicht', () => {
    passes(1, S.cylinder);
    passes(1, [{...cylinder, width: 85, depth: 85, height: 80, rotation: 33}]);
    assert.ok(!done(1, [{...cylinder, width: 20, depth: 20, height: 20}]).includes(1), 'Vorgabe 20 mm');
    assert.ok(!done(1, [{...cylinder, height: 20}]).includes(1), 'zu flach');
    assert.ok(!done(1, [{...cylinder, hole: true}]).includes(1), 'Aussparung');
    assert.ok(!done(1, [{...cylinder, id: 'box-1', kind: 'box'}]).includes(1), 'Quader');
    // alter Entwurf mit fremden Formen: „neuer Entwurf“ nicht erledigt
    const old = LK.makeContext({shapes: [{...cylinder, id: 'box-old', kind: 'box'}], base: {ids: ['box-old'], exportCount: 0}, editorOpen: true});
    assert.deepEqual(plain(LK.flow.evaluate(ch.steps[1], old, []).done), []);
});

test('S3: ausgehöhlt mit Wand ~2 mm, oben offen und Boden zu', () => {
    passes(2, S.hollow);
    fails(2, S.cylinder);
    const withShell = sh => [{...hollow, edgeTreatments: [{...shell, ...sh}]}];
    assert.deepEqual(done(2, withShell({amount: 5})), [0, 2], 'Wand 5 mm');
    assert.deepEqual(done(2, withShell({amount: 0.6})), [0, 2], 'Wand 0,6 mm');
    assert.deepEqual(done(2, withShell({openings: 'top-bottom'})), [0, 1], 'Boden offen');
    assert.deepEqual(done(2, withShell({openings: 'none'})), [0, 1], 'geschlossen');
    assert.deepEqual(done(2, withShell({openings: ['bottom']})), [0, 1], 'nur unten offen');
    passes(2, withShell({openings: ['top']}));
    passes(2, withShell({amount: 1.5}));
    fails(2, [{...hollow, width: 20, depth: 20, height: 20}]);
});

test('S3: Hinweise – Becher anklicken, „Aushöhlen“, falsch ausgehöhlt → Rückgängig', () => {
    assert.equal(hint(2, S.cylinder), 'workplane');
    assert.equal(hint(2, S.cylinder, {selection: [cylinder.id]}), 'toolbar:hollow');
    assert.equal(hint(2, [{...hollow, edgeTreatments: [{...shell, amount: 5}]}], {selection: [cylinder.id]}), 'toolbar:undo');
    assert.equal(hint(2, S.hollow, {selection: [cylinder.id]}), null);
});

test('S4: Rand abgerundet – Verrundung ab 0,3 mm am Becher; Fase oder Mini-Radius nicht', () => {
    passes(3, S.rimmed);
    fails(3, S.hollow);
    fails(3, [{...hollow, edgeTreatments: [shell, {...rim, kind: 'chamfer'}]}]);
    fails(3, [{...hollow, edgeTreatments: [shell, {...rim, amount: 0.1}]}]);
    passes(3, [{...hollow, edgeTreatments: [shell, {...rim, kind: 'chamfillet', amount: 1}]}]);
    assert.equal(hint(3, S.hollow, {selection: [cylinder.id]}), 'toolbar:fillet');
});

test('S5: Lochmuster in der Wand und rundherum', () => {
    passes(4, S.finished);
    fails(4, S.rimmed);
    // nur auf einer Seite (60°): in der Wand, aber nicht rundherum
    assert.deepEqual(done(4, [patternGroup(rimmed, wallPattern({rows: 2, perRow: 6, from: 0, to: 60}))]), [0]);
    // zu wenige Löcher
    fails(4, [patternGroup(rimmed, wallPattern({rows: 1, perRow: 4}))]);
    // Löcher im Boden (liegen flach, rotationX 0)
    const floor = wallPattern({r: 20}).map(h => ({...h, rotationX: 0, rotationZ: 0, elevation: 0}));
    fails(4, [patternGroup(rimmed, floor)]);
    // Löcher weit weg vom Becher
    fails(4, [patternGroup(rimmed, wallPattern({r: 80}))]);
    // Becher nicht ausgehöhlt: dann ist es kein Stiftebecher
    fails(4, [patternGroup(cylinder, wallPattern())]);
    // Körper statt Aussparungen
    fails(4, [patternGroup(rimmed, wallPattern().map(h => ({...h, hole: false})))]);
});

test('S5: Vorschau des Lochmuster-Fensters zählt nicht (live gesehen: Löcher „hole-pattern-preview-<n>“ im Formen-Array)', () => {
    const preview = wallPattern().map((h, i) => ({...h, id: `hole-pattern-preview-${i}`, x: h.x - 12, z: h.z - 12}));
    fails(4, [rimmed, ...preview]);
    assert.equal(hint(4, [rimmed, ...preview], {selection: [rimmed.id]}), 'toolbar:holePattern');
});

test('S7: Export erkannt', () => {
    passes(6, S.finished, {exportCount: 1});
});

test('S8 Challenge: zweiter, kleiner ausgehöhlter Becher', () => {
    const mini = {...hollow, id: 'cylinder-mini', x: 60, width: 40, depth: 40, height: 50};
    passes(7, [...S.finished, mini]);
    fails(7, S.finished);
    fails(7, [...S.finished, {...cylinder, id: 'cylinder-mini', x: 60, width: 40, depth: 40, height: 50}]);
    fails(7, [...S.finished, {...mini, edgeTreatments: [{...shell, openings: 'none'}]}]);
    // Der Mini-Becher muss neu sein
    const c = LK.makeContext({shapes: [...S.finished, mini], base: {ids: ['cylinder-mini'], exportCount: 0}, editorOpen: true});
    assert.deepEqual(plain(LK.flow.evaluate(ch.steps[7], c, []).done), []);
});

test('Hinweise im Ablege-Modus zeigen auf die Arbeitsfläche', () => {
    assert.equal(hint(1, [], {placingKind: 'cylinder'}), 'workplane');
    assert.equal(hint(1, [], {panels: new Set(['shapes'])}), 'libItem:cylinder');
    assert.equal(hint(1, [{...cylinder, width: 20, depth: 20, height: 20}]), 'inspector:size');
});

test('Hinweis-Ziele und Texte: alles bekannt, jeder Hinweis mit done', () => {
    const known = id => Boolean(LK.access.TARGETS[id]) || /^libItem:/.test(id) ||
        (id.startsWith('toolbar:') && LK.access.TOOLS.includes(id.slice(8)));
    const keys = [ch.title, ch.desc];
    ch.steps.forEach((s, si) => {
        keys.push(s.title, s.text);
        (s.tasks || []).forEach(t => { keys.push(t.text); assert.ok(t.manual || typeof t.check === 'function'); });
        (s.hints || []).forEach(h => {
            keys.push(h.text);
            assert.equal(typeof h.done, 'function', `Schritt ${si + 1}`);
            assert.ok(known(h.target), `Schritt ${si + 1}: ${h.target}`);
        });
        (s.labels || []).forEach(l => { keys.push(l.text); assert.ok(known(l.target), l.target); });
        if (s.kind === 'info') assert.equal((s.tasks || []).length, 0);
    });
    for (const lang of ['de', 'en']) {
        const m = LK.i18n.messages[lang];
        keys.forEach(k => assert.ok(typeof m[k] === 'string' && m[k].length, `${lang}: ${k}`));
    }
    // Ziele ohne Seite: null statt Fehler
    for (const id of ['hollow:wall', 'hollow:top', 'hollow:apply', 'holePattern:apply', 'fillet:top', 'fillet:radius', 'fillet:apply']) {
        assert.equal(LK.access.findTarget(id), null, id);
    }
});

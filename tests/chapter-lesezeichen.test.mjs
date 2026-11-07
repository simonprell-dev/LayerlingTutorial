// Kapitel „Lesezeichen“: Prüfungen und Hinweise gegen Szenen, die live in Layerling 1.150 gemessen wurden.
import test from 'node:test';
import assert from 'node:assert/strict';
import {load, plain, courseFiles} from './load.mjs';

const w = load(courseFiles());
const {LK} = w;
const ch = LK.course.chapters.find(c => c.id === 'lesezeichen');

// ---------- Skizzen-Profile (Punkte x/z in mm, wie SketchWorkspace sie in props.profile trägt) ----------

const corner = (id, x, z) => ({id, x, z, mode: 'corner'});
const line = (id, a, b) => ({id, startId: a, endId: b, kind: 'line'});
const rectProfile = (x0, z0, x1, z1) => ({
    points: [corner('a', x0, z0), corner('b', x1, z0), corner('c', x1, z1), corner('d', x0, z1)],
    segments: [line('ab', 'a', 'b'), line('bc', 'b', 'c'), line('cd', 'c', 'd'), line('da', 'd', 'a')],
    images: [], notes: []
});
// Frisch eingefügtes Rechteck (live: 20 × 20 mm um den Ursprung)
const rect20 = rectProfile(-10, -10, 10, 10);
// Nach dem Eintippen 50 und 150 (live: der Rahmen wächst von oben links aus)
const rect50 = rectProfile(-10, -10, 40, 140);
// „Punkte setzen“: neuer Punkt mitten auf der unteren Kante – noch gerade, also noch keine eigene Form
const withPoint = (z) => ({
    points: [...rect50.points, corner('e', 15, z)],
    segments: [line('ab', 'a', 'b'), line('bc', 'b', 'c'), line('ce', 'c', 'e'), line('ed', 'e', 'd'), line('da', 'd', 'a')],
    images: [], notes: []
});
const pointOnEdge = withPoint(140);
const notch = withPoint(120); // live: Punkt 20 mm nach innen gezogen
// Nach „Ecke verrunden“ (alle Ecken, Radius 5): live gemessen
const rounded = {
    points: [
        {id: 'p0', x: -5, z: -10, mode: 'split', handleOut: {x: -7.761, z: -10}},
        {id: 'p1', x: -10, z: -5, mode: 'split', handleIn: {x: -10, z: -7.761}},
        {id: 'p2', x: 35, z: -10, mode: 'split', handleOut: {x: 37.761, z: -10}},
        {id: 'p3', x: 40, z: -5, mode: 'split', handleIn: {x: 40, z: -7.761}},
        {id: 'p4', x: 40, z: 129.597, mode: 'split', handleOut: {x: 40, z: 133.789}},
        {id: 'p5', x: 31.877, z: 133.501, mode: 'split', handleIn: {x: 35.15, z: 136.12}},
        {id: 'p6', x: 18.123, z: 122.499, mode: 'split', handleOut: {x: 16.297, z: 121.038}},
        {id: 'p7', x: 11.877, z: 122.499, mode: 'split', handleIn: {x: 13.703, z: 121.038}},
        {id: 'p8', x: -1.877, z: 133.501, mode: 'split', handleOut: {x: -5.15, z: 136.12}},
        {id: 'p9', x: -10, z: 129.597, mode: 'split', handleIn: {x: -10, z: 133.789}}
    ],
    segments: [
        line('s0', 'p0', 'p2'), line('s1', 'p3', 'p4'), line('s2', 'p5', 'p6'), line('s3', 'p7', 'p8'), line('s4', 'p9', 'p1'),
        {id: 's5', startId: 'p0', endId: 'p1', kind: 'bezier'}, {id: 's6', startId: 'p2', endId: 'p3', kind: 'bezier'},
        {id: 's7', startId: 'p4', endId: 'p5', kind: 'bezier'}, {id: 's8', startId: 'p6', endId: 'p7', kind: 'bezier'},
        {id: 's9', startId: 'p8', endId: 'p9', kind: 'bezier'}
    ],
    images: []
};
// Nur eine Ecke verrundet
const oneRounded = {
    points: [...rect50.points.filter(p => p.id !== 'a'), {id: 'a1', x: -5, z: -10, mode: 'split'}, {id: 'a2', x: -10, z: -5, mode: 'split'}],
    segments: [line('ab', 'a1', 'b'), line('bc', 'b', 'c'), line('cd', 'c', 'd'), line('da', 'd', 'a2'), {id: 'r', startId: 'a1', endId: 'a2', kind: 'bezier'}],
    images: []
};
// Offene Linie (noch kein geschlossener Umriss)
const openLine = {points: [corner('a', 0, 0), corner('b', 50, 0), corner('c', 50, 150)], segments: [line('ab', 'a', 'b'), line('bc', 'b', 'c')], images: []};

// ---------- 3D-Formen (live gemessen) ----------

// Nach „Skizze abschließen“: kind 'mesh', Höhe zuerst 10 mm
const body = {id: 'sketch-extrusion-1', name: 'Sketch extrusion', kind: 'mesh', color: '#d41721', x: 15, z: 62.303, size: 144.606,
    width: 50, depth: 144.606, height: 10, rotation: 0, sketchProfile: rounded, sketchOperation: 'extrude', rotationX: 0, rotationZ: 0, elevation: 0};
const thinBody = {...body, height: 2};
// Text, auf das Lesezeichen geklickt: liegt oben auf (elevation = 2), quer und 86 mm breit, Platzhalter „TEXT“
const text = {id: 'text-1', name: 'Text', kind: 'text', color: '#cf101b', x: 15, z: 59.733, elevation: 2, size: 86, width: 86, depth: 28,
    height: 10, rotation: 0, rotationX: 0, rotationZ: 0, text: 'TEXT', font: 'Sans'};
const named = {...text, text: 'LENA', width: 91.84, depth: 27.68, size: 91.84};
const turned = {...named, rotation: 90};
const holeName = {...turned, hole: true};
const engravedName = {...holeName, elevation: 1}; // „Z (Höhe)“ = 1
// Gruppe wie live: id grouped-manifold-cut-…, Teile relativ zur Gruppe
const group = (parts) => ({id: 'grouped-manifold-cut-1', name: 'Group', kind: 'mesh', color: '#d41721', x: 15, z: 62.303, elevation: 0,
    size: 144.606, width: 50, depth: 144.606, height: 2, rotation: 0, groupOperation: 'group',
    groupedShapes: parts.map(p => ({...p, id: `${p.id}-group-child`, x: p.x - 15, z: p.z - 62.303}))});
const finished = [group([thinBody, engravedName])];

// ---------- Prüf-Kontext ----------

const ctx = (shapes, extra = {}) => {
    const {sketchView, ...rest} = extra;
    const c = LK.makeContext({shapes, base: {ids: [], exportCount: 0}, exportCount: 0, panels: new Set(), editorOpen: true, selection: [], ...rest});
    c.sketchView = () => sketchView || {tab: 'geometry', sketch: null};
    return c;
};
// Im Skizzenmodus sind die 3D-Formen nicht lesbar; die Erweiterung sieht dann [] (bzw. nach dem Vorschlag die letzten Formen).
const sk = (profile, more = {}) => ({sketchView: {tab: 'sketch', sketch: {profile, tool: 'select', selected: null, cornerDialog: null, ...more}}});
const done = (si, shapes, extra) => plain(LK.flow.evaluate(ch.steps[si], ctx(shapes, extra), []).done);
const passes = (si, shapes, extra) => assert.equal(done(si, shapes, extra).length, ch.steps[si].tasks.length, `Schritt ${si + 1}`);
const fails = (si, shapes, extra) => assert.deepEqual(done(si, shapes, extra), [], `Schritt ${si + 1}`);
const hint = (si, shapes, extra) => {
    const h = LK.flow.pickHint(ch.steps[si], ctx(shapes, extra));
    return h && h.target;
};

// ---------- Tests ----------

test('Lesezeichen: Aufbau mit 11 Schritten, nicht mehr „kommt bald“', () => {
    assert.ok(ch);
    assert.equal(ch.level, 'etwas');
    assert.equal(ch.type, 'sketch');
    assert.equal(ch.icon, '🔖');
    assert.ok(!ch.comingSoon);
    assert.deepEqual(plain(ch.steps.map(s => s.kind)),
        ['info', 'learn', 'learn', 'learn', 'learn', 'learn', 'learn', 'game', 'learn', 'challenge', 'creative']);
    assert.equal(ch.steps[9].autoHints, false);
    assert.equal(ch.steps[8].hints[0].target, 'export');
    assert.equal(ch.steps[8].hints[1].target, 'export:download');
});

test('S2: Skizze geöffnet, Rechteck gezeichnet', () => {
    assert.deepEqual(done(1, [], sk({points: [], segments: []})), [0]);
    passes(1, [], sk(rect20));
    assert.deepEqual(done(1, [], sk(openLine)), [0], 'offene Linie ist kein Umriss');
    fails(1, []);
    passes(1, [thinBody], {}); // später: Skizzenkörper zählt (Vorgriff)
});

test('S2: Hinweise führen Reiter → extrudieren → Skizzenformen → Rechteck', () => {
    assert.equal(hint(1, []), 'sketch:tab');
    assert.equal(hint(1, [], {sketchView: {tab: 'sketch', sketch: null}}), 'sketch:extrude');
    assert.equal(hint(1, [], sk({points: [], segments: []})), 'sketch:addShape');
    assert.equal(hint(1, [], {...sk({points: [], segments: []}), panels: new Set(['shapes'])}), 'libItem:rectangle');
    assert.equal(hint(1, [], sk(rect20)), null);
});

test('S3: Umriss etwa 50 × 150 mm – Bereich, Richtung egal', () => {
    passes(2, [], sk(rect50));
    passes(2, [], sk(rectProfile(0, 0, 150, 50)));
    passes(2, [], sk(rectProfile(0, 0, 40, 120)));
    fails(2, [], sk(rect20));
    fails(2, [], sk(rectProfile(0, 0, 150, 150)));
    fails(2, [], sk(rectProfile(0, 0, 10, 150)));
    passes(2, [thinBody]);
    fails(2, []);
});

test('S3: Hinweise: hineinklicken → Breite → Länge', () => {
    assert.equal(hint(2, [], sk(rect20)), 'sketch:outline');
    assert.equal(hint(2, [], sk(rect20, {selected: {kind: 'multiple', pointIds: ['a', 'b', 'c', 'd'], segmentIds: []}})), 'sketch:width');
    assert.equal(hint(2, [], sk(rectProfile(-10, -10, 40, 10), {selected: {kind: 'multiple'}})), 'sketch:depth');
});

test('S4: eigene Form – Rechteck und Punkt mitten auf der Kante zählen nicht', () => {
    fails(3, [], sk(rect50));
    fails(3, [], sk(pointOnEdge));
    passes(3, [], sk(notch));
    passes(3, [], sk(rounded));
    passes(3, [], sk({points: [corner('a', 0, 0), corner('b', 50, 0), corner('c', 25, 150)],
        segments: [line('ab', 'a', 'b'), line('bc', 'b', 'c'), line('ca', 'c', 'a')]}));
    passes(3, [thinBody]);
});

test('S4: Hinweise: Punkte setzen → Kante → Auswählen → ziehen', () => {
    assert.equal(hint(3, [], sk(rect50)), 'sketch:refine');
    assert.equal(hint(3, [], sk(rect50, {tool: 'refine'})), 'sketch:bottomEdge');
    assert.equal(hint(3, [], sk(pointOnEdge, {tool: 'line'})), 'sketch:select');
    assert.equal(hint(3, [], sk(pointOnEdge)), 'sketch:bottomEdge');
    assert.equal(hint(3, [], sk(notch)), null);
});

test('S5: mindestens zwei Ecken gerundet', () => {
    fails(4, [], sk(notch));
    fails(4, [], sk(oneRounded));
    passes(4, [], sk(rounded));
    passes(4, [thinBody]);
    fails(4, [{...thinBody, sketchProfile: notch}]);
});

test('S5: Hinweise: Auswählen → hineinklicken → Ecke verrunden → Radius', () => {
    assert.equal(hint(4, [], sk(notch, {tool: 'line'})), 'sketch:select');
    assert.equal(hint(4, [], sk(notch)), 'sketch:outline');
    assert.equal(hint(4, [], sk(notch, {selected: {kind: 'multiple'}})), 'sketch:fillet');
    assert.equal(hint(4, [], sk(notch, {selected: {kind: 'multiple'}, cornerDialog: 'fillet'})), 'sketch:cornerInput');
    assert.equal(hint(4, [], sk(notch, {selected: {kind: 'multiple'}, cornerDialog: 'open'})), 'sketch:cornerInput', 'Feld nur im DOM gesehen');
});

test('S6: Skizze abgeschlossen (kind mesh mit sketchProfile) und dünn', () => {
    assert.deepEqual(done(5, [body]), [0], '10 mm hoch: noch nicht dünn');
    passes(5, [thinBody]);
    passes(5, [{...thinBody, height: 1.5}]);
    assert.deepEqual(done(5, [{...thinBody, height: 5}]), [0]);
    fails(5, [], sk(rounded));
    fails(5, [{...thinBody, sketchProfile: undefined}], {}); // anderes Netz ist kein Skizzenkörper
    fails(5, [{...thinBody, sketchOperation: 'revolve'}]);
    fails(5, [{id: 'b', kind: 'box', x: 0, z: 0, elevation: 0, width: 50, depth: 150, height: 2, rotation: 0}], {});
    assert.equal(hint(5, [], sk(rounded)), 'sketch:finish');
    assert.equal(hint(5, [body]), 'workplane');
    assert.equal(hint(5, [body], {panels: new Set(['inspector'])}), 'inspector:size');
    assert.equal(hint(5, [body], {panels: new Set(['inspector', 'proportionsLocked'])}), 'inspector:keepProportions');
});

test('S7: Name eingraviert – live nachgespielt', () => {
    fails(6, [thinBody]);
    fails(6, [thinBody, text]); // Platzhalter
    assert.deepEqual(done(6, [thinBody, named]), [], 'quer und 92 mm breit: passt nicht aufs 50-mm-Lesezeichen');
    assert.deepEqual(done(6, [thinBody, turned]), [0]);
    assert.deepEqual(done(6, [thinBody, holeName]), [0, 1], 'Aussparung oben drauf schneidet nichts');
    assert.deepEqual(done(6, [thinBody, engravedName]), [0, 1, 2]);
    passes(6, finished);
});

test('S7: typische Fehler: ganz durch, zu tief, daneben, nicht gruppiert, Körper statt Aussparung', () => {
    const through = {...holeName, elevation: -1};
    assert.ok(!done(6, [thinBody, through]).includes(2), 'geht ganz durch');
    const floorless = {...holeName, elevation: 0.1};
    assert.ok(!done(6, [thinBody, floorless]).includes(2), 'kein Boden mehr');
    const beside = {...engravedName, x: 200};
    assert.deepEqual(done(6, [thinBody, beside]), []);
    const solid = {...engravedName, hole: false};
    assert.deepEqual(done(6, [group([thinBody, solid])]), [0]);
    assert.ok(!done(6, [group([thinBody, through])]).includes(3), 'Gruppe mit durchgehender Schrift');
    assert.ok(!done(6, [group([thinBody]), engravedName]).includes(3), 'Text außerhalb der Gruppe');
});

test('S7: Hinweise in der Reihenfolge des Bauens', () => {
    assert.equal(hint(6, [thinBody]), 'addShape');
    assert.equal(hint(6, [thinBody], {panels: new Set(['shapes'])}), 'libItem:text');
    assert.equal(hint(6, [thinBody], {placingKind: 'text'}), 'workplane');
    assert.equal(hint(6, [thinBody, text]), 'inspector:text');
    assert.equal(hint(6, [thinBody, {...named, x: 200}]), 'workplane');
    assert.equal(hint(6, [thinBody, named]), 'inspector:rotation');
    assert.equal(hint(6, [thinBody, {...turned, width: 200}]), 'inspector:size');
    assert.equal(hint(6, [thinBody, turned]), 'inspector:hole');
    assert.equal(hint(6, [thinBody, holeName]), 'inspector:positionZ');
    assert.equal(hint(6, [thinBody, engravedName]), 'workplane');
    assert.equal(hint(6, [thinBody, engravedName], {selection: ['a', 'b']}), 'toolbar:group');
    assert.equal(hint(6, finished), null);
});

test('fertiges Lesezeichen (Gruppe) erfüllt alle learn-Schritte außer Export (Vorgriff)', () => {
    ch.steps.forEach((s, si) => {
        if (s.kind !== 'learn' || si === 8) return;
        passes(si, finished);
    });
});

test('leere Szene erfüllt keine Aufgabe ab S2', () => {
    ch.steps.slice(1).forEach((s, i) => {
        if (!(s.tasks || []).some(t => !t.manual)) return;
        assert.deepEqual(plain(LK.flow.evaluate(s, ctx([]), []).done), [], `Schritt ${i + 2}`);
    });
});

test('S9: Export erkannt', () => {
    fails(8, finished);
    passes(8, finished, {exportCount: 1});
});

test('Formen nicht lesbar (Skizzenmodus ohne Lese-Weg): Aufgaben zum Selbst-Abhaken', () => {
    const c = LK.makeContext({shapes: null, base: {ids: [], exportCount: 0}, editorOpen: true});
    assert.equal(LK.flow.isManual(ch.steps[1].tasks[0], c), true);
});

test('jeder Hinweis hat done, jedes Ziel ist bekannt, Texte in de und en', () => {
    const known = id => Boolean(LK.access.TARGETS[id]) || /^libItem:/.test(id) || (id.startsWith('toolbar:') && LK.access.TOOLS.includes(id.slice(8)));
    const keys = [ch.title, ch.desc];
    ch.steps.forEach((s, si) => {
        keys.push(s.title, s.text);
        (s.hints || []).forEach(h => {
            assert.equal(typeof h.done, 'function', `Schritt ${si + 1}`);
            assert.ok(known(h.target), `Schritt ${si + 1}: ${h.target}`);
            keys.push(h.text);
        });
        (s.labels || []).forEach(l => {
            assert.ok(known(l.target), l.target);
            keys.push(l.text);
        });
        (s.tasks || []).forEach(t => {
            assert.ok(t.manual || typeof t.check === 'function');
            keys.push(t.text);
        });
    });
    for (const lang of ['de', 'en']) {
        keys.forEach(k => assert.ok(typeof LK.i18n.messages[lang][k] === 'string' && LK.i18n.messages[lang][k].length, `${lang}: ${k}`));
    }
});

test('Hinweis-Ziele ohne Seite: liefern null statt zu werfen', () => {
    ['sketch:tab', 'sketch:extrude', 'sketch:addShape', 'sketch:select', 'sketch:refine', 'sketch:fillet', 'sketch:cornerInput',
        'sketch:outline', 'sketch:width', 'sketch:depth', 'sketch:bottomEdge', 'sketch:zoomOut', 'sketch:finish', 'inspector:positionZ']
        .forEach(id => assert.equal(LK.access.findTarget(id), null, id));
});

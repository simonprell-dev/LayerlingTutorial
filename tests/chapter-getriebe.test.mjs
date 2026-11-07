import test from 'node:test';
import assert from 'node:assert/strict';
import {load, plain, courseFiles} from './load.mjs';

// Plattenleiste als Attrappe: die Prüfung liest .plate-bar-chip mit .plate-bar-chip-count.
let chipCounts = null; // null = Leiste zu, sonst Körper je Platte
const chip = n => ({querySelector: () => ({textContent: String(n)}), classList: {contains: () => false}});
const document = {
    querySelector: () => null,
    querySelectorAll: sel => (sel === '.plate-bar-chip' && chipCounts ? chipCounts.map(chip) : []),
    addEventListener: () => {}
};

const w = load(courseFiles(), {document});
const {LK} = w;
const ch = LK.course.chapters.find(c => c.id === 'getriebe');

const ctx = (shapes, extra = {}) => LK.makeContext({shapes, base: {ids: [], exportCount: 0}, exportCount: 0,
    panels: new Set(), editorOpen: true, selection: [], ...extra});
const done = (si, shapes, extra) => plain(LK.flow.evaluate(ch.steps[si], ctx(shapes, extra), []).done);
const auto = si => plain(ch.steps[si].tasks.map((t, i) => (t.manual ? null : i)).filter(i => i !== null));
const passes = (si, shapes, extra) => assert.deepEqual(done(si, shapes, extra), auto(si), `Schritt ${si + 1}`);
const fails = (si, shapes, extra) => assert.deepEqual(done(si, shapes, extra), [], `Schritt ${si + 1}`);
const hint = (si, shapes, extra) => (LK.flow.pickHint(ch.steps[si], ctx(shapes, extra)) || {}).target;
const withPlates = (counts, fn) => {
    chipCounts = counts;
    try {
        return fn();
    } finally {
        chipCounts = null;
    }
};

// ---------- Szenen, live gemessen (Layerling 1.150) ----------

const gear = (id, teeth, x, z, extra = {}) => ({id, kind: 'gear', x, z, elevation: 0, width: 2 * (teeth + 2), depth: 2 * (teeth + 2),
    height: 6, rotation: 0, teeth, centerHoleSize: 6, gearType: 'spur', gearProfile: 'involute', ...extra});
const small = gear('gear-a', 12, -21, -39);           // neu: 12 Zähne, Modul 2 → Ø 28
const big = gear('gear-b', 24, 15, -39);              // 24 Zähne → Ø 52, 36 mm daneben
const plate = {id: 'box-1', kind: 'box', x: -3, z: -39, elevation: 0, width: 90, depth: 40, height: 4, rotation: 0};
const axle = (id, x, d = 5.5, h = 10) => ({id, kind: 'cylinder', x, z: -39, elevation: 4, width: d, depth: d, height: h, rotation: 0});
const crank = {id: 'cyl-crank', kind: 'cylinder', x: 33, z: -39, elevation: 6, width: 6, depth: 6, height: 15, rotation: 0};

const loose = [small, big, plate, axle('ax-1', -21), axle('ax-2', 15), crank];

// Fertig gruppiert, so wie Layerling es speichert (Teile relativ zur Gruppe).
const groupedAt = bigX => [
    small,
    {id: 'group-gear', kind: 'mesh', groupOperation: 'group', x: bigX, z: -39, elevation: 0, width: 51.711, depth: 51.711, height: 21, rotation: 0,
        groupedShapes: [{...big, id: 'gear-b-child', x: 0, z: 0}, {...crank, id: 'crank-child', x: 18, z: 0}]},
    {id: 'group-base', kind: 'mesh', groupOperation: 'group', x: -3, z: -39, elevation: 0, width: 90, depth: 40, height: 14, rotation: 0,
        groupedShapes: [{...plate, id: 'box-child', x: 0, z: 0}, {...axle('ax-1c', 0), x: -18, z: 0}, {...axle('ax-2c', 0), x: 18, z: 0}]}
];
const assembled = groupedAt(15);
const spreadOut = groupedAt(235); // „Auf eine neue Platte“: +220 mm (Arbeitsfläche 200 + 20 Abstand)

// ---------- Aufbau ----------

test('Getriebe: 11 Schritte, profi, mechanics', () => {
    assert.equal(ch.level, 'profi');
    assert.equal(ch.type, 'mechanics');
    assert.ok(!ch.comingSoon);
    assert.deepEqual(plain(ch.steps.map(s => s.kind)),
        ['info', 'learn', 'learn', 'learn', 'learn', 'learn', 'learn', 'game', 'learn', 'challenge', 'creative']);
    assert.equal(ch.steps[9].autoHints, false);
});

test('Hilfen: Modul und Achsabstand wie in Layerling', () => {
    const h = ch.helpers;
    assert.equal(h.moduleOf(small), 2);
    assert.equal(h.moduleOf(big), 2);
    assert.equal(h.centreDistance(small, big), 36);
    assert.equal(h.moduleOf({...small, gearProfile: 'simple'}), null);
    assert.ok(Math.abs(h.moduleOf({...small, gearProfile: 'round', width: 13.2 * 1.5, depth: 13.2 * 1.5}) - 1.5) < 1e-9);
});

// ---------- Schritte ----------

test('S2: neues Evolventen-Rad', () => {
    passes(1, [small]);
    fails(1, []);
    assert.deepEqual(done(1, [{...small, gearProfile: 'simple'}]), [0], 'einfache Zähne: kein Modul');
    assert.equal(hint(1, [], {panels: new Set(['shapes'])}), 'libItem:gear');
    assert.equal(hint(1, [], {placingKind: 'gear'}), 'workplane');
});

test('S3: doppelte Zähnezahl, gleiches Modul', () => {
    passes(2, [small, big]);
    fails(2, [small]);
    fails(2, [small, gear('gear-c', 12, 50, 0)]);
    // typischer Fehler: großes Rad über die Größe statt die Zähne – anderes Modul
    const scaled = {...big, width: 39, depth: 39};
    assert.deepEqual(done(2, [small, scaled]), [0]);
    assert.equal(hint(2, [small, scaled]), 'inspector:module');
    // 13 und 26 Zähne geht auch
    passes(2, [gear('a', 13, 0, 0), gear('b', 26, 50, 0)]);
});

test('S4: Achsabstand = Modul × (z1 + z2) / 2, Richtung egal', () => {
    passes(3, [small, big]);
    passes(3, [gear('a', 12, 0, 0), gear('b', 24, 36 * Math.cos(1), 36 * Math.sin(1))]);
    // live gemessen nach „Zahnrad behalten, das andere anpassen“
    passes(3, [{...small, x: 2.0816, z: -5.3996}, {...big, x: 15, z: -39}]);
    fails(3, [small, {...big, x: 25}], undefined); // 46 mm
    fails(3, [small, {...big, x: 13}]);           // 34 mm: Zähne klemmen
    fails(3, [small, {...big, width: 39, depth: 39, x: 15}]); // verschiedene Module
    assert.equal(hint(3, [small, {...big, x: 25}]), 'workplane');
    assert.equal(hint(3, [small, {...big, x: 25}], {selection: ['a', 'b']}), 'gearPair:keep');
});

test('S5: Grundplatte, Achsen im Achsabstand, mit Spiel, hoch genug', () => {
    passes(4, loose);
    fails(4, [small, big]);
    // typischer Fehler: Achse so dick wie die Bohrung (6 mm) – live gemessen
    assert.deepEqual(done(4, [small, big, plate, axle('ax-1', -21, 6), axle('ax-2', 15, 6)]), [0, 1, 3]);
    // zu dünn (mehr als 1 mm Spiel)
    assert.ok(!done(4, [small, big, plate, axle('ax-1', -21, 4.5), axle('ax-2', 15, 4.5)]).includes(2));
    // falscher Achsabstand
    assert.deepEqual(done(4, [small, big, plate, axle('ax-1', -21), axle('ax-2', 18)]), [0]);
    // Achsen zu kurz für das 6 mm dicke Rad
    assert.ok(!done(4, [small, big, plate, axle('ax-1', -21, 5.5, 6), axle('ax-2', 15, 5.5, 6)]).includes(3));
    // Achse neben der Platte zählt nicht
    assert.ok(!done(4, [small, big, plate, axle('ax-1', -21), {...axle('ax-2', 15), x: 80}]).includes(1));
    // Hinweise: erst Quader, dann Zylinder, dann Durchmesser
    assert.equal(hint(4, [small, big]), 'addShape');
    assert.equal(hint(4, [small, big, plate]), 'libItem:cylinder');
    // live gesehen: Zylinder neben der Platte abgelegt (20 mm, Höhe 0) → „Auf die Platte setzen“
    assert.equal(hint(4, [small, big, plate, {...axle('ax-1', 120, 20, 20), elevation: 0}]), 'workplane');
    assert.equal(hint(4, [small, big, plate, axle('ax-1', -21, 20)]), 'inspector:size');
    assert.equal(hint(4, [small, big, plate, axle('ax-1', -21)]), 'inspector:position');
});

test('S6: Kurbel außermittig auf dem großen Rad, zwei Gruppen', () => {
    passes(5, assembled);
    assert.deepEqual(done(5, loose), [0]);
    // mittig auf der Achse ist keine Kurbel
    assert.deepEqual(done(5, [...loose.slice(0, 5), {...crank, x: 15}]), []);
    // auf dem kleinen Rad auch nicht
    assert.deepEqual(done(5, [...loose.slice(0, 5), {...crank, x: -12}]), []);
    assert.equal(hint(5, loose), 'workplane');
    assert.equal(hint(5, loose, {selection: ['gear-b', 'cyl-crank']}), 'toolbar:group');
});

test('S7: Plattenleiste und Teile auf zwei Platten (Leiste live: Chips mit Körperzahl)', () => {
    fails(6, spreadOut);
    assert.equal(hint(6, spreadOut), 'toolbar:buildPlates');
    withPlates([3], () => {
        assert.deepEqual(done(6, assembled), [0]);
        assert.equal(hint(6, assembled), 'plates:moveTo');
    });
    withPlates([2, 1], () => passes(6, spreadOut));
    withPlates([3, 0], () => assert.deepEqual(done(6, assembled), [0]));
});

test('fertiges Getriebe (zusammengebaut und gruppiert) erfüllt S2–S6', () => {
    for (const si of [1, 2, 3, 4, 5]) passes(si, assembled);
});

test('fertiges Getriebe auf zwei Platten erfüllt alle learn-Schritte außer Export', () => {
    withPlates([2, 1], () => {
        ch.steps.forEach((s, si) => {
            if (s.kind === 'learn' && si !== 8) passes(si, spreadOut);
        });
    });
});

test('S9: Export erkannt', () => {
    fails(8, spreadOut);
    passes(8, spreadOut, {exportCount: 1});
});

test('leere Szene erfüllt keine Aufgabe', () => {
    ch.steps.forEach((s, si) => {
        if (s.kind === 'learn') assert.deepEqual(plain(LK.flow.evaluate(s, ctx([]), []).done), [], `Schritt ${si + 1}`);
    });
});

test('jeder Hinweis hat done, alle Ziele bekannt, alle Texte in de und en', () => {
    const keys = [ch.title, ch.desc];
    ch.steps.forEach((s, si) => {
        keys.push(s.title, s.text);
        (s.tasks || []).forEach(t => {
            keys.push(t.text);
            assert.ok(t.manual || typeof t.check === 'function', `Schritt ${si + 1}`);
        });
        (s.hints || []).forEach(h => {
            keys.push(h.text);
            assert.equal(typeof h.done, 'function', `Schritt ${si + 1}`);
            assert.ok(LK.access.TARGETS[h.target], `Schritt ${si + 1}: ${h.target}`);
        });
        (s.labels || []).forEach(l => {
            keys.push(l.text);
            assert.ok(LK.access.TARGETS[l.target], l.target);
        });
    });
    for (const lang of ['de', 'en']) keys.forEach(k => assert.ok(LK.i18n.messages[lang][k], `${lang}: ${k}`));
});

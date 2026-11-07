import test from 'node:test';
import assert from 'node:assert/strict';
import {load, plain} from './load.mjs';
import {S, plate, text, hole} from './fixtures/shapes.mjs';

const w = load(['lib/geometry.js', 'lib/layerling-access.js', 'course/i18n.js', 'course/i18n/de.js', 'course/i18n/en.js',
    'course/context.js', 'course/flow.js', 'course/course-data.js']);
const {LK} = w;
const ch = LK.course.chapters[0];

const ctx = (shapes, extra = {}) => LK.makeContext({shapes, base: {ids: [], exportCount: 0}, exportCount: 0,
    panels: new Set(), editorOpen: true, selection: [], ...extra});
const done = (si, shapes, extra) => plain(LK.flow.evaluate(ch.steps[si], ctx(shapes, extra), []).done);
const passes = (si, shapes, extra) => assert.equal(done(si, shapes, extra).length, ch.steps[si].tasks.length, `Schritt ${si + 1}`);
const fails = (si, shapes, extra) => assert.deepEqual(done(si, shapes, extra), [], `Schritt ${si + 1}`);

test('Kapitel 1: Namensschild mit 12 Schritten', () => {
    assert.equal(ch.id, 'namensschild');
    assert.equal(ch.level, 'neu');
    assert.equal(ch.steps.length, 12);
    assert.deepEqual(plain(ch.steps.map(s => s.kind)),
        ['info', 'learn', 'learn', 'learn', 'learn', 'learn', 'learn', 'learn', 'game', 'learn', 'challenge', 'creative']);
    assert.equal(ch.steps[10].autoHints, false);
});

test('Kapitel 2–6 kommen bald', () => {
    const rest = LK.course.chapters.slice(1);
    assert.deepEqual(plain(rest.map(c => [c.id, c.level, c.comingSoon])), [
        ['lesezeichen', 'etwas', true], ['stiftebecher', 'etwas', true], ['handystaender', 'profi', true],
        ['schraubdose', 'profi', true], ['getriebe', 'profi', true]
    ]);
    rest.forEach(c => assert.equal(c.steps.length, 0));
});

test('S2: neuer, leerer Entwurf', () => {
    passes(1, []);
    fails(1, [], {editorOpen: false});
    fails(1, S.oldBox);
});

test('S3: neuer Quader – alter zählt nicht', () => {
    passes(2, S.plate);
    assert.deepEqual(plain(LK.flow.evaluate(ch.steps[2], LK.makeContext({shapes: S.oldBox, base: {ids: ['old'], exportCount: 0}, editorOpen: true}), []).done), []);
});

test('S4: Plattenmaße als Bereich, Drehung egal', () => {
    passes(3, S.plate);
    passes(3, S.rotatedPlate);
    passes(3, S.turnedPlate);
    fails(3, S.hugePlate);
    fails(3, S.oldBox);
});

test('S5: Text mit eigenem Inhalt', () => {
    passes(4, S.plateText);
    fails(4, S.emptyText);
    fails(4, [plate, {...text, text: 'TEXT'}]);
    fails(4, S.plate);
});

test('S6: Text liegt flach auf der Platte', () => {
    passes(5, S.plateText);
    assert.ok(!done(5, S.floatingText).includes(0), 'schwebender Text liegt nicht auf');
    assert.equal(done(5, [plate, {...text, height: 10}]).length, 1, 'aufliegend, aber zu hoch: nur eine Aufgabe');
});

test('S7: Loch 3–8 mm an der Platte, Vollkörper nicht', () => {
    passes(6, S.plateTextHole);
    fails(6, S.solidCylinder);
    assert.ok(done(6, S.bigHole).length < ch.steps[6].tasks.length);
    assert.ok(done(6, [plate, text, {...hole, x: 200}]).length < ch.steps[6].tasks.length);
});

test('S8: Platte, Text und Loch in einer Gruppe', () => {
    passes(7, S.finishedGroup);
    fails(7, S.plateTextHole);
    fails(7, S.groupWithoutText);
});

test('fertiges Schild als Gruppe erfüllt S3–S8 (Vorgriff)', () => {
    for (const si of [2, 3, 4, 5, 6, 7]) passes(si, S.finishedGroup);
});

test('S10: Export erkannt', () => {
    fails(9, S.finishedGroup);
    passes(9, S.finishedGroup, {exportCount: 1});
});

test('leere Szene erfüllt keine Aufgabe ab S3', () => {
    ch.steps.slice(2).forEach((s, i) => assert.deepEqual(plain(LK.flow.evaluate(s, ctx([]), []).done), [], `Schritt ${i + 3}`));
});

test('jeder Hinweis hat done, jedes Ziel ist bekannt, info hat keine Aufgaben', () => {
    const known = id => Boolean(LK.access.TARGETS[id]);
    LK.course.chapters.forEach(c => c.steps.forEach((s, si) => {
        (s.hints || []).forEach(h => {
            assert.equal(typeof h.done, 'function', `${c.id} ${si + 1}`);
            assert.ok(known(h.target), `${c.id} ${si + 1}: ${h.target}`);
        });
        (s.labels || []).forEach(l => assert.ok(known(l.target), l.target));
        (s.tasks || []).forEach(t => assert.ok(t.manual || typeof t.check === 'function'));
        if (s.kind === 'info') assert.equal((s.tasks || []).length, 0);
    }));
});

test('alle Texte in de und en vorhanden', () => {
    const keys = [];
    LK.course.chapters.forEach(c => {
        keys.push(c.title, c.desc);
        c.steps.forEach(s => {
            keys.push(s.title, s.text);
            (s.tasks || []).forEach(t => keys.push(t.text));
            (s.hints || []).forEach(h => keys.push(h.text));
            (s.labels || []).forEach(l => keys.push(l.text));
        });
    });
    for (const lang of ['de', 'en']) {
        const m = LK.i18n.messages[lang];
        keys.forEach(k => assert.ok(typeof m[k] === 'string' && m[k].length, `${lang}: ${k}`));
    }
});

test('Hinweise im Ablege-Modus zeigen auf die Arbeitsfläche', () => {
    for (const [si, kind] of [[2, 'box'], [4, 'text'], [6, 'cylinder']]) {
        const shapes = si === 2 ? [] : (si === 4 ? S.plate : S.plateText);
        const hint = LK.flow.pickHint(ch.steps[si], ctx(shapes, {placingKind: kind}));
        assert.equal(hint && hint.target, 'workplane', `Schritt ${si + 1}`);
    }
});

test('S7: Loch muss ganz durch die Platte gehen (live gesehen: −9,5 bis 0,5 mm)', () => {
    const shallow = [plate, text, {...hole, elevation: -9.5, height: 10}];
    assert.ok(!done(6, shallow).includes(2), 'zu tief: nicht erledigt');
    const onTop = [plate, text, {...hole, elevation: 3, height: 6}];
    assert.ok(!done(6, onTop).includes(2), 'oben drauf: nicht erledigt');
    passes(6, [plate, text, {...hole, elevation: 0, height: 3}]);
    const hint = LK.flow.pickHint(ch.steps[6], ctx(shallow));
    assert.equal(hint.target, 'toolbar:drop');
});

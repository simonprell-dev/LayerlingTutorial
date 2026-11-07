import test from 'node:test';
import assert from 'node:assert/strict';
import {load, plain} from './load.mjs';

const flow = load(['course/flow.js']).LK.flow;
const known = {shapesKnown: true};

test('Aufgaben bleiben erledigt (klebend)', () => {
    let ok = true;
    const step = {tasks: [{text: 'a', check: () => ok}, {text: 'b', check: () => false}]};
    let r = flow.evaluate(step, known, []);
    assert.deepEqual(plain(r), {done: [0], complete: false});
    ok = false;
    r = flow.evaluate(step, known, r.done);
    assert.deepEqual(plain(r.done), [0]);
});

test('alle erledigt → complete', () => {
    const r = flow.evaluate({tasks: [{text: 'a', check: () => true}]}, known, []);
    assert.equal(r.complete, true);
});

test('Schritt ohne Aufgaben ist sofort complete', () => {
    assert.equal(flow.evaluate({kind: 'info'}, known, []).complete, true);
});

test('werfende Prüfung = nicht erledigt, kein Fehler', () => {
    const r = flow.evaluate({tasks: [{text: 'a', check: () => { throw new Error('x'); }}]}, known, []);
    assert.deepEqual(plain(r.done), []);
});

test('manual wird nicht automatisch erledigt', () => {
    const r = flow.evaluate({tasks: [{text: 'a', manual: true}]}, known, []);
    assert.deepEqual(plain(r.done), []);
    assert.deepEqual(plain(flow.evaluate({tasks: [{text: 'a', manual: true}]}, known, [0]).done), [0]);
});

test('fallback: Formen unbekannt → alles nur von Hand', () => {
    const step = {tasks: [{text: 'a', check: () => true}]};
    const r = flow.evaluate(step, {shapesKnown: false}, []);
    assert.deepEqual(plain(r.done), []);
    assert.equal(flow.isManual(step.tasks[0], {shapesKnown: false}), true);
    assert.equal(flow.isManual(step.tasks[0], known), false);
    assert.equal(flow.evaluate(step, {shapesKnown: false}, flow.toggleManual([], 0)).complete, true);
});

test('toggleManual hakt an und ab', () => {
    assert.deepEqual(plain(flow.toggleManual([], 2)), [2]);
    assert.deepEqual(plain(flow.toggleManual([0, 2], 2)), [0]);
});

test('pickHint: erster offener, info nie', () => {
    const h1 = {target: 'a', done: () => true};
    const h2 = {target: 'b', done: () => false};
    assert.equal(flow.pickHint({kind: 'learn', hints: [h1, h2]}, known), h2);
    assert.equal(flow.pickHint({kind: 'learn', hints: [h1]}, known), null);
    assert.equal(flow.pickHint({kind: 'info', hints: [h2]}, known), null);
    assert.equal(flow.pickHint({kind: 'learn'}, known), null);
});

test('pickHint: werfendes done gilt als nicht erledigt', () => {
    const h = {target: 'a', done: () => { throw new Error('x'); }};
    assert.equal(flow.pickHint({kind: 'learn', hints: [h]}, known), h);
});

test('showHintsAuto: nur neu, Schritt kann überschreiben, hintsOff gewinnt', () => {
    const ch = {};
    assert.equal(flow.showHintsAuto('neu', ch, {}, false), true);
    assert.equal(flow.showHintsAuto('etwas', ch, {}, false), false);
    assert.equal(flow.showHintsAuto('profi', ch, {}, false), false);
    assert.equal(flow.showHintsAuto('neu', ch, {autoHints: false}, false), false);
    assert.equal(flow.showHintsAuto('neu', ch, {}, true), false);
    assert.equal(flow.showHintsAuto('neu', ch, {kind: 'info'}, false), false);
});

const chapters = [
    {id: 'a', level: 'neu', steps: [{}, {}]},
    {id: 'b', level: 'etwas', comingSoon: true, steps: []},
    {id: 'c', level: 'profi', steps: [{}]},
    {id: 'd', level: 'profi', comingSoon: true, steps: []}
];

test('sequence überspringt comingSoon, Übergang zwischen Kapiteln', () => {
    assert.deepEqual(plain(flow.sequence(chapters)), [
        {type: 'step', ci: 0, si: 0}, {type: 'step', ci: 0, si: 1},
        {type: 'transition', from: 0, to: 2},
        {type: 'step', ci: 2, si: 0}
    ]);
});

test('startChapter: profi → erstes fertiges Kapitel nach dem ersten (Spec 8)', () => {
    assert.equal(flow.startChapter(chapters, 'neu'), 0);
    assert.equal(flow.startChapter(chapters, 'etwas'), 0);
    assert.equal(flow.startChapter(chapters, 'profi'), 2);
});

test('startChapter: profi startet bei 0, solange kein weiteres Kapitel fertig ist', () => {
    assert.equal(flow.startChapter(chapters.slice(0, 2).concat(chapters[3]), 'profi'), 0);
});

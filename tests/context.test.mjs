import test from 'node:test';
import assert from 'node:assert/strict';
import {load, plain} from './load.mjs';
import {S} from './fixtures/shapes.mjs';

const LK = load(['lib/geometry.js', 'course/context.js']).LK;
const ctx = (shapes, base = {ids: [], exportCount: 0}, extra = {}) =>
    LK.makeContext({shapes, base, exportCount: 0, panels: new Set(), editorOpen: true, ...extra});

test('newShapes ignoriert alten Quader', () => {
    const c = ctx(S.oldBox, {ids: ['old'], exportCount: 0});
    assert.equal(c.newShapes('box').length, 0);
    assert.equal(c.shapes('box').length, 1);
});

test('newShapes findet neue Form', () => {
    const c = ctx([...S.oldBox, ...S.plate], {ids: ['old'], exportCount: 0});
    assert.deepEqual(plain(c.newShapes('box').map(s => s.id)), ['p']);
});

test('Gruppen-Kinder zählen als Formen, Gruppe selbst nicht', () => {
    const c = ctx(S.finishedGroup);
    assert.equal(c.shapes('box').length, 1);
    assert.equal(c.shapes().length, 3);
    assert.equal(c.holes('cylinder').length, 1);
    assert.equal(c.solids().length, 2);
    assert.ok(c.inGroupWith(c.shapes('box')[0], c.shapes('text')[0]));
});

test('groups liefert Gruppe mit allen Nachfahren', () => {
    const c = ctx(S.finishedGroup);
    const gs = c.groups();
    assert.equal(gs.length, 1);
    assert.deepEqual(plain(gs[0].members.map(s => s.id).sort()), ['h', 'p', 't']);
});

test('inGroupWith: lose Formen sind nicht gruppiert', () => {
    const c = ctx(S.plateTextHole);
    assert.equal(c.inGroupWith(c.shapes('box')[0], c.shapes('text')[0]), false);
});

test('shapes null → nichts, kein Fehler', () => {
    const c = ctx(null);
    assert.equal(c.shapesKnown, false);
    assert.equal(c.shapes().length, 0);
    assert.equal(c.groups().length, 0);
    assert.equal(c.newShapes().length, 0);
});

test('exported zählt ab Schrittbeginn', () => {
    assert.equal(ctx([], {ids: [], exportCount: 2}, {exportCount: 2}).exported(), false);
    assert.equal(ctx([], {ids: [], exportCount: 2}, {exportCount: 3}).exported(), true);
});

test('size, near, onTop, panelOpen, editorOpen', () => {
    const c = ctx(S.plateTextHole, undefined, {panels: new Set(['export']), editorOpen: false});
    const [plate, text, hole] = c.shapes();
    assert.equal(c.size(plate).long, 70);
    assert.ok(c.near(plate, hole, 0));
    assert.ok(c.onTop(text, plate, 1));
    assert.equal(c.panelOpen('export'), true);
    assert.equal(c.panelOpen('shapes'), false);
    assert.equal(c.editorOpen, false);
});

test('selectedCount aus der Auswahl', () => {
    assert.equal(ctx(S.plateTextHole, undefined, {selection: ['p', 't', 'h']}).selectedCount(), 3);
    assert.equal(ctx(S.plateTextHole).selectedCount(), 0);
});

test('placing: Ablege-Modus mit und ohne Formart', () => {
    const c = ctx([], undefined, {placingKind: 'box'});
    assert.equal(c.placing(), true);
    assert.equal(c.placing('box'), true);
    assert.equal(c.placing('text'), false);
    assert.equal(ctx([]).placing(), false);
});

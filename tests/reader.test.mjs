import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './load.mjs';

const fresh = () => load(['course/reader.js']).LK.makeReader();
const box = {id: 'b', kind: 'box', width: 1, depth: 1, height: 1};

test('Editor zu: Formen leer, kein Rebase, nicht pending', () => {
    const r = fresh().read({editorOpen: false, shapes: null, projectId: null});
    assert.equal(r.pending, false);
    assert.equal(r.unknown, false);
    assert.equal(r.shapes.length, 0);
});

test('Review #2: nicht gelesene Formen sind „pending“, nicht leer', () => {
    const r = fresh().read({editorOpen: true, shapes: null, projectId: null});
    assert.equal(r.pending, true);
    assert.equal(r.shapes, null);
    assert.equal(r.unknown, false);
});

test('nach 12 Fehltakten: unknown', () => {
    const reader = fresh();
    let r;
    for (let i = 0; i < 12; i++) r = reader.read({editorOpen: true, shapes: null, projectId: null});
    assert.equal(r.unknown, true);
    assert.equal(r.pending, false);
});

test('Review #1: erster gelesener Stand nach Editor-zu löst Rebase aus', () => {
    const reader = fresh();
    assert.equal(reader.read({editorOpen: false, shapes: null, projectId: null}).rebase, false);
    assert.equal(reader.read({editorOpen: true, shapes: null, projectId: null}).rebase, false);
    assert.equal(reader.read({editorOpen: true, shapes: [box], projectId: 'p1'}).rebase, true);
    assert.equal(reader.read({editorOpen: true, shapes: [box], projectId: 'p1'}).rebase, false);
});

test('Review #1: anderes Projekt löst Rebase aus', () => {
    const reader = fresh();
    reader.read({editorOpen: true, shapes: [], projectId: 'p1'});
    assert.equal(reader.read({editorOpen: true, shapes: [box], projectId: 'p2'}).rebase, true);
});

test('Review #3: im Zustand unknown nur jeden 12. Takt neu lesen', () => {
    const reader = fresh();
    for (let i = 0; i < 12; i++) reader.read({editorOpen: true, shapes: null, projectId: null});
    const reads = Array.from({length: 24}, () => reader.needsRead()).filter(Boolean).length;
    assert.equal(reads, 2);
    const ok = fresh();
    assert.equal(Array.from({length: 5}, () => ok.needsRead()).filter(Boolean).length, 5);
});

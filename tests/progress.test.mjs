import test from 'node:test';
import assert from 'node:assert/strict';
import {load, memoryStorage, plain} from './load.mjs';

const P = load(['course/progress.js']).LK.progress;

test('KEY', () => assert.equal(P.KEY, 'layerling-kurs:v1'));

test('leerer Speicher → Standard', () => {
    assert.deepEqual(plain(P.load(memoryStorage())), plain(P.defaultState()));
    assert.deepEqual(plain(P.defaultState()), {
        level: null, chapter: 0, step: 0, done: {}, finished: [], hintsOff: false, open: false, panelPos: null
    });
});

test('Rundreise speichern/laden', () => {
    const st = memoryStorage();
    const s = P.defaultState();
    s.level = 'neu'; s.chapter = 0; s.step = 4; s.done = {namensschild: {3: [0]}}; s.open = true;
    P.save(st, s);
    assert.deepEqual(plain(P.load(st)), plain(s));
});

test('kaputtes JSON → Standard', () => {
    const st = memoryStorage();
    st.setItem(P.KEY, '{kaputt');
    assert.deepEqual(plain(P.load(st)), plain(P.defaultState()));
});

test('fehlende Felder werden ergänzt', () => {
    const st = memoryStorage();
    st.setItem(P.KEY, JSON.stringify({level: 'etwas'}));
    const s = P.load(st);
    assert.equal(s.level, 'etwas');
    assert.equal(s.step, 0);
    assert.deepEqual(plain(s.done), {});
});

test('werfender Speicher → Standard, kein Fehler', () => {
    const broken = {getItem: () => { throw new Error('nope'); }, setItem: () => { throw new Error('nope'); }, removeItem: () => { throw new Error('nope'); }};
    assert.deepEqual(plain(P.load(broken)), plain(P.defaultState()));
    P.save(broken, P.defaultState());
    P.reset(broken);
});

test('reset entfernt KEY', () => {
    const st = memoryStorage();
    P.save(st, P.defaultState());
    P.reset(st);
    assert.equal(st.getItem(P.KEY), null);
});

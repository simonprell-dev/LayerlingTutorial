import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './load.mjs';

const fresh = () => load(['lib/layerling-access.js']).LK.access;
const box = {id: 'a', kind: 'box', width: 1, depth: 1, height: 1};

const hooks = (...values) => {
    let next = null;
    for (let i = values.length - 1; i >= 0; i--) next = {memoizedState: values[i], next};
    return next;
};

test('isShapeArray', () => {
    const a = fresh();
    assert.equal(a.isShapeArray([box]), true);
    assert.equal(a.isShapeArray([{id: 'a'}]), false);
    assert.equal(a.isShapeArray('x'), false);
    assert.equal(a.isShapeArray([box, null]), false);
});

test('findet Formen über Props shapes + selectedIds (Weg 1)', () => {
    const a = fresh();
    const shapes = [];
    const viewport = {tag: 0, memoizedProps: {shapes, selectedIds: [], projectId: 'p'}, memoizedState: null, child: null, sibling: null};
    const res = a.findShapesInFiber({child: {tag: 5, memoizedProps: {}, child: viewport, sibling: null}});
    assert.equal(res, shapes);
});

test('getSelection liest selectedIds', () => {
    const a = fresh();
    const viewport = {tag: 0, memoizedProps: {shapes: [box], selectedIds: ['a'], projectId: 'p'}, child: null, sibling: null};
    a.findShapesInFiber({child: viewport});
    assert.deepEqual([...a.lastSelection()], ['a']);
});

test('findet Formen-Hook in Fake-Fiber (Weg 2)', () => {
    const a = fresh();
    const shapes = [box];
    const fiber = {tag: 0, memoizedState: hooks(5, 'x', shapes), child: null, sibling: null};
    assert.equal(a.findShapesInFiber({child: fiber}), shapes);
});

test('sucht auch in Kindern und Geschwistern', () => {
    const a = fresh();
    const shapes = [box];
    const target = {tag: 0, memoizedState: hooks(shapes), child: null, sibling: null};
    const sib = {tag: 5, memoizedState: null, child: target, sibling: null};
    const first = {tag: 0, memoizedState: hooks(1), child: null, sibling: sib};
    assert.equal(a.findShapesInFiber({child: first}), shapes);
});

test('merkt sich die Stelle: leere Liste danach wird erkannt', () => {
    const a = fresh();
    const fiber = {tag: 0, memoizedState: hooks(5, [box]), child: null, sibling: null};
    const rootFiber = {child: fiber};
    a.findShapesInFiber(rootFiber);
    fiber.memoizedState = hooks(5, []);
    const found = a.findShapesInFiber(rootFiber);
    assert.ok(Array.isArray(found));
    assert.equal(found.length, 0);
});

test('ohne Treffer null', () => {
    assert.equal(fresh().findShapesInFiber({child: null}), null);
    assert.equal(fresh().findShapesInFiber(null), null);
});

test('TARGETS enthält alle Kurs-Ziele', () => {
    const a = fresh();
    const need = ['newDesign', 'addShape', 'libItem:box', 'libItem:text', 'libItem:cylinder', 'libItem:nameTag',
        'inspector', 'inspector:size', 'inspector:text', 'inspector:hole', 'inspector:solid', 'toolbar:group',
        'export', 'export:stl', 'viewCube', 'workplane'];
    for (const id of need) assert.equal(typeof a.TARGETS[id], 'function', id);
});

test('getLanguage liest layerling.language', () => {
    const w = load(['lib/layerling-access.js']);
    w.localStorage.setItem('layerling.language', 'de');
    assert.equal(w.LK.access.getLanguage(), 'de');
});

test('placingKind: Form an der Maus (cruiseAsset)', () => {
    const a = fresh();
    const viewport = {tag: 0, memoizedProps: {shapes: [], selectedIds: [], cruiseAsset: {id: 'x', kind: 'cylinder'}}, child: null, sibling: null};
    a.findShapesInFiber({child: viewport});
    assert.equal(a.lastPlacingKind(), 'cylinder');
    viewport.memoizedProps = {shapes: [], selectedIds: [], cruiseAsset: null};
    a.findShapesInFiber({child: viewport});
    assert.equal(a.lastPlacingKind(), null);
});

test('lastProjectId aus den Props', () => {
    const a = fresh();
    a.findShapesInFiber({child: {tag: 0, memoizedProps: {shapes: [], selectedIds: [], projectId: 'p7'}, child: null, sibling: null}});
    assert.equal(a.lastProjectId(), 'p7');
});

test('Review #6: openPanels wirft nie', () => {
    const doc = {querySelector: () => { throw new Error('kaputt'); }, querySelectorAll: () => { throw new Error('kaputt'); }, addEventListener: () => {}};
    const w = load(['lib/layerling-access.js'], {document: doc});
    const set = w.LK.access.openPanels();
    assert.equal(set.size, 0);
});

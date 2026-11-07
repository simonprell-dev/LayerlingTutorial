import test from 'node:test';
import assert from 'node:assert/strict';
import {load, plain} from './load.mjs';

const g = load(['lib/geometry.js']).LK.geometry;
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} ≈ ${b}`);

test('bounds: x/z Mitte, elevation Unterkante', () => {
    assert.deepEqual(plain(g.bounds({x: 0, z: 0, elevation: 3, width: 70, depth: 25, height: 2, rotation: 0})),
        {minX: -35, maxX: 35, minY: 3, maxY: 5, minZ: -12.5, maxZ: 12.5});
});

test('bounds: ohne elevation steht die Form auf 0', () => {
    assert.equal(g.bounds({x: 10, z: 0, width: 4, depth: 4, height: 4}).minY, 0);
});

test('bounds: 90° gedreht tauscht x/z', () => {
    const b = g.bounds({x: 0, z: 0, width: 70, depth: 25, height: 3, rotation: 90});
    close(b.minX, -12.5); close(b.maxX, 12.5); close(b.minZ, -35); close(b.maxZ, 35);
});

test('flatten: Gruppe mit Kindern, zwei Ebenen', () => {
    const inner = {id: 'i', groupedShapes: [{id: 'c'}]};
    const out = g.flatten([{id: 'g', groupedShapes: [{id: 'a'}, inner]}]);
    assert.deepEqual(plain(out.map(e => [e.shape.id, e.groupIds])),
        [['g', []], ['a', ['g']], ['i', ['g']], ['c', ['g', 'i']]]);
});

test('flatten: null und leere Liste', () => {
    assert.deepEqual(plain(g.flatten(null)), []);
    assert.deepEqual(plain(g.flatten([])), []);
});

test('sizeOf: Drehung egal', () => {
    assert.deepEqual(plain(g.sizeOf({width: 25, depth: 70, height: 3})), {long: 70, short: 25, h: 3});
});

const plate = {x: 0, z: 0, elevation: 0, width: 70, depth: 25, height: 3};
test('touchesTop: Text liegt auf der Platte (±1 mm)', () => {
    assert.equal(g.touchesTop({x: 0, z: 0, elevation: 3.8, width: 40, depth: 10, height: 2}, plate, 1), true);
    assert.equal(g.touchesTop({x: 0, z: 0, elevation: 4.5, width: 40, depth: 10, height: 2}, plate, 1), false);
});
test('touchesTop: Text steckt in der Platte und ragt heraus', () => {
    assert.equal(g.touchesTop({x: 0, z: 0, elevation: 1, width: 40, depth: 10, height: 4}, plate, 1), true);
});
test('touchesTop: Text ganz in der Platte versenkt zählt nicht', () => {
    assert.equal(g.touchesTop({x: 0, z: 0, elevation: 0.5, width: 40, depth: 10, height: 1}, plate, 1), false);
});

test('overlapXZ: nebeneinander false, übereinander true', () => {
    assert.equal(g.overlapXZ(plate, {x: 100, z: 0, width: 10, depth: 10, height: 1}), false);
    assert.equal(g.overlapXZ(plate, {x: 30, z: 10, width: 6, depth: 6, height: 10}), true);
});

test('distance: Abstand der Hüllquader', () => {
    close(g.distance(plate, {x: 40, z: 0, width: 4, depth: 4, height: 3}), 3);
    assert.equal(g.distance(plate, {x: 0, z: 0, width: 4, depth: 4, height: 3}), 0);
});

test('flatten: Gruppen-Teile werden in absolute Koordinaten umgerechnet (live in Layerling 1.150 gemessen)', () => {
    const out = g.flatten([{id: 'g', kind: 'mesh', x: -26, z: 1, elevation: 2, rotation: 0, groupedShapes: [
        {id: 'b', kind: 'box', x: 0, z: 0, elevation: 0, width: 20, depth: 20, height: 20},
        {id: 'c', kind: 'cylinder', x: 22, z: -21, elevation: 1, width: 20, depth: 20, height: 20}
    ]}]);
    const c = out.find(e => e.shape.id === 'c').shape;
    assert.deepEqual([c.x, c.z, c.elevation], [-4, -20, 3]);
    assert.equal(c.kind, 'cylinder');
});

test('flatten: gedrehte Gruppe dreht die Versätze mit', () => {
    const out = g.flatten([{id: 'g', x: 0, z: 0, elevation: 0, rotation: 90, groupedShapes: [
        {id: 'c', x: 10, z: 0, elevation: 0, rotation: 0, width: 1, depth: 1, height: 1}
    ]}]);
    const c = out.find(e => e.shape.id === 'c').shape;
    close(Math.abs(c.x), 0); close(Math.abs(c.z), 10); assert.equal(c.rotation, 90);
});

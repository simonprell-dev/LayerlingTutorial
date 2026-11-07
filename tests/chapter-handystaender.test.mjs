import test from 'node:test';
import assert from 'node:assert/strict';
import {load, plain, courseFiles} from './load.mjs';

const w = load(courseFiles());
const {LK} = w;
const ch = LK.course.chapters.find(c => c.id === 'handystaender');
const H = ch.helpers;

// ---------- Formen, wie sie Layerling v1.150.0 live geliefert hat ----------

// Profil aus dem Rezept in Schritt 2, live gezeichnet (Startpunkt bei x −27, z 40; Winkel 90° = −z).
const RECIPE = ['80<0', '6<90', '45<180', '90<65', '7<180', '90<245', '22<180', '10<90', '6<180', '16<270'];
const MEASURED_POINTS = [[-27, 40], [53, 40], [53, 34], [8, 34], [46.035644, -47.567701], [39.035644, -47.567701], [1, 34], [-21, 34], [-21, 24], [-27, 24]];

function profileOf (points) {
    const pts = points.map(([x, z], i) => ({id: `p${i}`, x, z, mode: 'corner'}));
    return {points: pts, segments: pts.map((p, i) => ({id: `g${i}`, startId: p.id, endId: pts[(i + 1) % pts.length].id, kind: 'line'})), images: []};
}

// Linienfolge „Länge<Winkel“ wie in Layerling getippt → Punkte (die letzte Linie führt zum Start zurück).
function typed (lines, start = [0, 0]) {
    const pts = [start];
    lines.slice(0, -1).forEach(l => {
        const [len, ang] = l.split('<').map(Number);
        const [x, z] = pts[pts.length - 1];
        const r = ang * Math.PI / 180;
        pts.push([x + len * Math.cos(r), z - len * Math.sin(r)]);
    });
    return pts;
}

// Skizzenkörper direkt nach „Skizze abschließen“ (gemessen).
const body = {
    id: 'sketch-extrusion-1', name: 'Sketch extrusion', kind: 'mesh', color: '#d41721',
    x: 13, z: -3.78385, size: 87.568, width: 80, depth: 87.568, height: 10, rotation: 0, rotationX: 0, rotationZ: 0, elevation: 0,
    sketchProfile: profileOf(MEASURED_POINTS), sketchOperation: 'extrude'
};
const wide = {...body, height: 70};
// Nach „Fase“ → „Obere Kanten“, Abstand 2 mm, „Anwenden“ (gemessen).
const CHAMFER = {kind: 'chamfer', amount: 2, edgeCount: 10, edgeIds: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28], chamferAngle: 45};
const done = {...wide, edgeTreatments: [CHAMFER]};
// „Um X“ 90 (gemessen: elevation 8.784, Maße bleiben lokal), danach „Auf Fläche legen“ auf die Rückseite (gemessen: rotationX 270).
const upright = {...done, rotationX: 90, elevation: 8.784000283814457};
const onBack = {...done, rotationX: 270, elevation: 8.784};
const turned = {...done, rotationX: 90, rotation: 295, elevation: 19.756};

const S = {
    empty: [],
    body: [body],
    wide: [wide],
    done: [done],
    grouped: [{id: 'g1', kind: 'mesh', groupOperation: 'group', x: 20, z: 5, elevation: 0, width: 80, depth: 88, height: 70, rotation: 0,
        groupedShapes: [{...done, id: 'part', x: -7, z: -8.8}, {id: 'h', kind: 'cylinder', hole: true, x: 0, z: 0, elevation: 0, width: 12, depth: 12, height: 80, rotation: 0}]}],
    noLip: [{...done, sketchProfile: profileOf(typed(['80<0', '6<90', '45<180', '90<65', '7<180', '90<245', '28<180', '6<270']))}],
    flat45: [{...done, sketchProfile: profileOf(typed(['80<0', '6<90', '45<180', '90<45', '7<180', '90<225', '22<180', '10<90', '6<180', '16<270']))}],
    steep88: [{...done, sketchProfile: profileOf(typed(['80<0', '6<90', '45<180', '90<88', '7<180', '90<268', '22<180', '10<90', '6<180', '16<270']))}],
    box: [{id: 'b', kind: 'box', x: 0, z: 0, elevation: 0, width: 80, depth: 70, height: 90, rotation: 0}],
    revolve: [{...done, sketchOperation: 'revolve'}],
    hole: [{...done, hole: true}],
    bigChamfer: [{...wide, edgeTreatments: [{...CHAMFER, amount: 8}]}],
    fillet: [{...wide, edgeTreatments: [{kind: 'fillet', amount: 2, edgeCount: 10}]}],
    thin: [{...done, height: 20}],
    huge: [{...done, height: 150}]
};

// ---------- Prüf-Hilfen ----------

const ui = LK.access.handystaender;
const realUi = {...ui};
function withUi (fake, fn) {
    Object.assign(ui, fake);
    try {
        return fn();
    } finally {
        Object.assign(ui, realUi);
    }
}
const PC_OK = {printCheck: () => ({open: true, result: true, overhangOk: true})};
const PC_WARN = {printCheck: () => ({open: true, result: true, overhangOk: false})};

const ctx = (shapes, extra = {}) => LK.makeContext({shapes, base: {ids: [], exportCount: 0}, exportCount: 0,
    panels: new Set(), editorOpen: true, selection: [], ...extra});
const doneOf = (si, shapes, extra) => plain(LK.flow.evaluate(ch.steps[si], ctx(shapes, extra), []).done);
const passes = (si, shapes, extra) => assert.equal(doneOf(si, shapes, extra).length, ch.steps[si].tasks.length, `Schritt ${si + 1}`);
const fails = (si, shapes, extra) => assert.deepEqual(doneOf(si, shapes, extra), [], `Schritt ${si + 1}`);
const hint = (si, shapes, extra) => {
    const h = LK.flow.pickHint(ch.steps[si], ctx(shapes, extra));
    return h && h.target;
};

// ---------- Tests ----------

test('Kapitel handystaender: profi, Skizze, 9 Schritte im Kursaufbau', () => {
    assert.equal(ch.level, 'profi');
    assert.equal(ch.type, 'sketch');
    assert.ok(!ch.comingSoon);
    assert.deepEqual(plain(ch.steps.map(s => s.kind)),
        ['info', 'learn', 'learn', 'learn', 'game', 'learn', 'learn', 'challenge', 'creative']);
    assert.equal(ch.steps[7].autoHints, false);
    assert.equal(ch.steps[6].hints[1].target, 'export:download');
});

test('Rezept aus Schritt 2 ergibt das live gemessene Profil', () => {
    const pts = typed(RECIPE, [-27, 40]);
    pts.forEach((p, i) => {
        assert.ok(Math.abs(p[0] - MEASURED_POINTS[i][0]) < 0.01 && Math.abs(p[1] - MEASURED_POINTS[i][1]) < 0.01, `Punkt ${i}`);
    });
});

test('Profil-Auswertung: Standfläche, Lehne 65°, Lippe', () => {
    const b = H.base(body);
    assert.ok(Math.abs(b.line.len - 80) < 0.01, 'Boden ist die Standfläche, nicht die längere Lehne');
    assert.ok(H.hasBackrest(body));
    assert.ok(H.hasLip(body));
    assert.ok(!H.hasLip(S.noLip[0]), 'ohne Lippe');
    assert.ok(!H.hasBackrest(S.flat45[0]), '45° zu flach');
    assert.ok(!H.hasBackrest(S.steep88[0]), '88° zu steil');
});

test('Profil gespiegelt, gedreht oder verschoben gezeichnet zählt genauso', () => {
    const mirrored = {...body, sketchProfile: profileOf(MEASURED_POINTS.map(([x, z]) => [-x, z]))};
    const upsideDown = {...body, sketchProfile: profileOf(MEASURED_POINTS.map(([x, z]) => [x + 50, -z]))};
    const r = 30 * Math.PI / 180;
    const rotated = {...body, sketchProfile: profileOf(MEASURED_POINTS.map(([x, z]) => [x * Math.cos(r) - z * Math.sin(r), x * Math.sin(r) + z * Math.cos(r)]))};
    for (const s of [mirrored, upsideDown, rotated]) {
        assert.ok(H.hasBackrest(s) && H.hasLip(s));
    }
    passes(1, [mirrored]);
});

test('S2: Skizzenkörper, Lehne 55–80°, Lippe', () => {
    passes(1, S.body);
    passes(1, S.done);
    const d = doneOf(1, S.noLip);
    assert.ok(d.includes(1) && !d.includes(2), 'ohne Lippe: Lehne ja, Lippe nein');
    assert.ok(!doneOf(1, S.flat45).includes(1), 'Lehne 45°');
    assert.ok(!doneOf(1, S.steep88).includes(1), 'Lehne 88°');
    fails(1, S.box);
    fails(1, S.revolve);
    fails(1, S.hole);
    // Skizzenkörper zählt auch, wenn er schon zum Ausgangsstand gehört (Kurs setzt ihn nach dem Skizzenmodus neu)
    passes(1, S.body, {base: {ids: [body.id], exportCount: 0}});
});

test('S3: Breite 60–90 mm (Extrusion = height)', () => {
    fails(2, S.body);
    passes(2, S.wide);
    passes(2, [upright]);
    fails(2, S.thin);
    fails(2, S.huge);
    fails(2, S.box);
});

test('S4: Fase 0,5–3,5 mm', () => {
    fails(3, S.wide);
    passes(3, S.done);
    fails(3, S.bigChamfer);
    fails(3, S.fillet);
});

test('S6: liegt auf dem Profil und Druck-Prüfung ohne Überhang', () => {
    withUi(PC_OK, () => {
        passes(5, S.done);
        passes(5, [{...done, rotationX: 180}]);
        assert.ok(!doneOf(5, [upright]).includes(0), 'aufgestellt');
        assert.ok(!doneOf(5, [onBack]).includes(0), 'auf dem Rücken');
        assert.ok(!doneOf(5, [turned]).includes(0), 'gedreht, aber nicht aufs Profil');
        fails(5, S.box);
    });
    withUi(PC_WARN, () => assert.ok(!doneOf(5, S.done).includes(1), 'Überhang gemeldet'));
    assert.ok(!doneOf(5, S.done).includes(1), 'ohne Prüf-Fenster nichts abgehakt');
    assert.equal(LK.access.handystaender.printCheck().open, false, 'ohne Seite: Fenster zu');
});

test('fertiger Ständer erfüllt alle learn-Schritte außer Export – auch gruppiert (Vorgriff)', () => {
    withUi(PC_OK, () => {
        for (const shapes of [S.done, S.grouped]) {
            ch.steps.forEach((s, si) => {
                if (s.kind === 'learn' && si !== 6) passes(si, shapes);
            });
        }
    });
});

test('leere Szene erfüllt keine Aufgabe', () => {
    withUi(PC_OK, () => ch.steps.forEach((s, si) => {
        if ((s.tasks || []).some(t => !t.manual)) fails(si, S.empty);
    }));
});

test('S7: Export erkannt', () => {
    fails(6, S.done);
    passes(6, S.done, {exportCount: 1});
});

test('S2-Hinweise folgen dem Skizzieren: Reiter → Extrudieren → Zeichnen → Abschließen → Bearbeiten', () => {
    assert.equal(hint(1, []), 'sketch:tab');
    withUi({sketchMode: () => true}, () => assert.equal(hint(1, []), 'sketch:extrude'));
    withUi({sketchMode: () => true, sketchDrawing: () => true}, () => assert.equal(hint(1, []), 'sketch:plate'));
    withUi({sketchMode: () => true, sketchDrawing: () => true, draftClosed: () => true}, () => assert.equal(hint(1, []), 'sketch:finish'));
    assert.equal(hint(1, S.noLip), 'inspector:editSketch');
    assert.equal(hint(1, S.body), null);
});

test('S4/S6-Hinweise: Fase-Fenster und Druck-Prüfung', () => {
    assert.equal(hint(3, S.wide), 'workplane');
    assert.equal(hint(3, S.wide, {selection: ['x']}), 'toolbar:chamfer');
    withUi({edgePanel: () => true}, () => assert.equal(hint(3, S.wide, {selection: ['x']}), 'edge:top'));
    withUi({edgePanel: () => true, edgeReady: () => true}, () => assert.equal(hint(3, S.wide), 'edge:apply'));
    withUi({edgePanel: () => true}, () => assert.equal(hint(3, S.done), 'edge:done'));
    assert.equal(hint(3, S.done), null);
    assert.equal(hint(5, [upright]), 'inspector:rotationX');
    assert.equal(hint(5, S.done), 'toolbar:print-check');
    withUi({printCheck: () => ({open: true, result: false, overhangOk: false})}, () => assert.equal(hint(5, S.done), 'printCheck:run'));
    withUi(PC_WARN, () => assert.equal(hint(5, S.done), 'printCheck:overhang'));
    withUi(PC_OK, () => assert.equal(hint(5, S.done), null));
});

test('S5 (Spiel): erst aufstellen, dann „Auf Fläche legen“', () => {
    assert.equal(hint(4, S.done), 'inspector:rotationX');
    assert.equal(hint(4, [upright]), 'toolbar:layFlat');
});

test('alle Ziele des Kapitels sind bekannt (TARGETS oder toolbar:<Werkzeug>)', () => {
    const known = id => Boolean(LK.access.TARGETS[id]) || (id.startsWith('toolbar:') && LK.access.TOOLS.includes(id.slice(8)));
    ch.steps.forEach(s => [...(s.hints || []), ...(s.labels || [])].forEach(h => assert.ok(known(h.target), h.target)));
});

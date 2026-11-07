/*
 * Kapitel „stiftebecher“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/stiftebecher.js,
 * zusätzliche Hinweis-Ziele: lib/targets/stiftebecher.js. Wird in course/course-data.js eingereiht.
 *
 * Live gemessen (Layerling 1.150):
 * - Aushöhlen macht aus dem Zylinder kind 'mesh' (id bleibt „cylinder-…“) mit
 *   edgeTreatments [{kind: 'shell', amount: 2, openings: 'top'}].
 * - Rand verrunden („Obere Kanten“, 0,8 mm) hängt {kind: 'fillet', amount: 0.8, edgeCount: 2} an
 *   edgeTreatments an (nach dem 'shell'); das geht in einer halben Sekunde.
 * - Lochmuster auf der runden Wand gruppiert den Becher mit den Löchern (Gruppe kind 'mesh',
 *   groupOperation 'group'); Löcher sind Aussparungen (Sechseck: kind 'polygon', sides 6) mit
 *   rotationX 270, Mitte etwa auf der Wand. Klappt auch nach dem Verrunden des Rands.
 * - Deshalb die Reihenfolge Aushöhlen → Rand → Lochmuster: Verrunden NACH einem dichten
 *   Lochmuster (288 Löcher) kam in 2 Minuten nicht über „Kanten werden vorbereitet“ hinaus; mit
 *   65 Löchern ging es, backt aber alles zu EINEM Körper (groupedShapes und 'shell' weg, der Stand
 *   davor steckt in edgeTreatmentHistory[].before). Die Prüfungen lesen darum auch diese früheren
 *   Stände („Schnappschüsse“) – so bleiben sie wahr, egal in welcher Reihenfolge gearbeitet wird.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    const G = () => LK.geometry;
    const between = (v, min, max) => v >= min && v <= max;
    const kb = (si, field) => `stiftebecher.s${si}.${field}`;

    // ---------- Formen und frühere Stände ----------

    const isGroup = s => Array.isArray(s.groupedShapes);
    const partsOf = list => G().flatten(list).map(e => e.shape).filter(s => !isGroup(s));

    // Schnappschüsse: der jetzige Stand plus jeder Stand vor einer Kantenbearbeitung (rekursiv).
    // Jeder Schnappschuss ist in sich stimmig (gleiches Koordinatensystem).
    function snapshotsOf (list, out = [], depth = 0) {
        out.push(list);
        if (depth > 6) return out;
        list.forEach(s => (s.edgeTreatmentHistory || []).forEach(e => {
            if (e && e.before && typeof e.before === 'object') snapshotsOf(partsOf([e.before]), out, depth + 1);
        }));
        return out;
    }
    const snapshots = c => snapshotsOf(c.shapes());
    const versions = list => [].concat(...snapshotsOf(list));

    const treatments = (s, kind) => (Array.isArray(s.edgeTreatments) ? s.edgeTreatments : []).filter(t => t && t.kind === kind);

    // Becher-Körper: runde Grundfläche, Ø 50–100 mm, 70–130 mm hoch (Vorschlag: 70 × 100 mm).
    const round = s => Math.abs((s.width || 0) - (s.depth || 0)) <= 2;
    const isCup = s => !s.hole && round(s) && (() => {
        const z = G().sizeOf(s);
        return between(z.long, 50, 100) && between(z.h, 70, 130);
    })();
    const fromCylinder = s => s.kind === 'cylinder' || /^cylinder-/.test(String(s.id));
    const cupMade = c => versions(c.shapes()).some(s => isCup(s) && fromCylinder(s));

    // Aushöhlen
    const shellOf = s => treatments(s, 'shell')[0] || null;
    const hollowCups = list => list.filter(s => isCup(s) && shellOf(s));
    const hollowed = c => hollowCups(versions(c.shapes())).length > 0;
    const wallOk = c => hollowCups(versions(c.shapes())).some(s => between(Number(shellOf(s).amount), 1.2, 3));
    // Oben offen, Boden zu. openings: 'top' | 'bottom' | 'top-bottom' | 'none' | ['top', …]
    const openSides = o => (Array.isArray(o) ? o : o === 'top-bottom' ? ['top', 'bottom'] : o === 'none' || !o ? [] : [o]);
    const topOpen = s => {
        const sides = openSides(shellOf(s).openings);
        return sides.includes('top') && !sides.includes('bottom');
    };
    const openTop = c => hollowCups(versions(c.shapes())).some(topOpen);

    // Lochmuster rundherum: mindestens 6 Aussparungen sitzen quer in der Becherwand und verteilen
    // sich rundum (größte Lücke zwischen zwei Löchern höchstens 120°).
    const sideways = r => {
        const a = ((Number(r) || 0) % 180 + 180) % 180;
        return Math.abs(a - 90) <= 30;
    };
    // Vorschau des offenen Lochmuster-Fensters: Löcher mit id „hole-pattern-preview-<n>“ stehen schon
    // im Formen-Array (live gesehen) – die zählen erst nach „Erzeugen“.
    const preview = s => Boolean(s.previewOnly) || /^hole-pattern-preview-/.test(String(s.id));
    function wallHoles (cup, list) {
        const R = G().sizeOf(cup).long / 2;
        const C = G().bounds(cup);
        return list.filter(h => h.hole && !preview(h) && (sideways(h.rotationX) || sideways(h.rotationZ)) &&
            Math.abs(Math.hypot((h.x || 0) - (cup.x || 0), (h.z || 0) - (cup.z || 0)) - R) <= 6 &&
            between(h.elevation || 0, C.minY - 5, C.maxY + 5));
    }
    function largestGap (cup, holes) {
        const angles = holes.map(h => Math.atan2((h.z || 0) - (cup.z || 0), (h.x || 0) - (cup.x || 0)) * 180 / Math.PI)
            .map(a => (a + 360) % 360).sort((a, b) => a - b);
        if (angles.length < 2) return 360;
        return Math.max(...angles.map((a, i) => (i ? a - angles[i - 1] : a + 360 - angles[angles.length - 1])));
    }
    const holeSets = c => [].concat(...snapshots(c).map(list => hollowCups(list).map(cup => ({cup, holes: wallHoles(cup, list)}))));
    const holesInWall = c => holeSets(c).some(x => x.holes.length >= 6);
    const holesAround = c => holeSets(c).some(x => x.holes.length >= 6 && largestGap(x.cup, x.holes) <= 120);

    // Abrunden: Verrundung (oder Fase + Rundung) am Becher, mindestens 0,3 mm.
    const filleted = c => versions(c.shapes()).some(s => isCup(s) &&
        [...treatments(s, 'fillet'), ...treatments(s, 'chamfillet')].some(t => Number(t.amount) >= 0.3));

    // Challenge: ein zweiter, kleiner ausgehöhlter Becher (Ø 25–55 mm, 25–80 mm hoch, oben offen).
    const isMini = s => !s.hole && round(s) && shellOf(s) && topOpen(s) && (() => {
        const z = G().sizeOf(s);
        return between(z.long, 25, 55) && between(z.h, 25, 80);
    })();
    const miniCup = c => versions(c.newShapes()).some(isMini);

    // ---------- Zustand der Werkzeug-Fenster (für Hinweise; ohne Seite immer false) ----------

    const el = id => LK.access.findTarget(id);
    const pressed = b => Boolean(b) && b.getAttribute('aria-pressed') === 'true';
    const fieldValue = input => (input ? parseFloat(String(input.value).replace(',', '.')) : NaN);
    const shellPanel = () => Boolean(el('hollow:apply'));
    const shellWallOk = () => {
        const f = el('hollow:wall');
        return between(fieldValue(f && f.querySelector('input[type=text]')), 1.2, 3);
    };
    const shellTopOnly = () => {
        const top = el('hollow:top');
        return pressed(top) && !pressed(top.nextElementSibling);
    };
    const patternPanel = () => Boolean(el('holePattern:apply'));
    // Runde Wand gewählt: Das Fenster zeigt dann eine zweite Zeile („Runde Wand, Ø …“).
    const wallPicked = () => LK.access.dom.qa('.hole-pattern-panel .edge-modifier-target span').length >= 2;
    const filletPanel = () => Boolean(el('fillet:apply'));
    const filletReady = () => {
        const b = el('fillet:apply');
        return Boolean(b) && !b.disabled;
    };
    const filletRadiusOk = () => {
        const f = el('fillet:radius');
        return between(fieldValue(f && f.querySelector('input[type=text]')), 0.3, 1);
    };

    const newCylinder = c => c.newShapes('cylinder').length > 0;
    const newSmall = c => c.newShapes().some(s => !s.hole && round(s) && G().sizeOf(s).long <= 55);

    LK.chapters['stiftebecher'] = {
        id: 'stiftebecher',
        level: 'etwas',
        type: 'body',
        icon: '✏️',
        title: 'stiftebecher.title',
        desc: 'stiftebecher.desc',
        steps: [
            {
                kind: 'info',
                title: kb(1, 'title'),
                text: kb(1, 'text'),
                labels: [
                    {target: 'toolbar:hollow', text: kb(1, 'l1')},
                    {target: 'toolbar:fillet', text: kb(1, 'l2')},
                    {target: 'toolbar:holePattern', text: kb(1, 'l3')}
                ]
            },
            {
                kind: 'learn',
                title: kb(2, 'title'),
                text: kb(2, 'text'),
                tasks: [
                    {text: kb(2, 't1'), check: c => c.editorOpen && c.newShapes().length === c.shapes().length},
                    {text: kb(2, 't2'), check: cupMade}
                ],
                hints: [
                    // Review: auch zeigen, wenn noch der alte Entwurf offen ist (sonst hängt t1 ohne Hinweis).
                    {target: 'newDesign', text: kb(2, 'h1'), done: c => c.editorOpen && c.newShapes().length === c.shapes().length},
                    {target: 'addShape', text: kb(2, 'h2'), done: c => c.panelOpen('shapes') || c.placing() || newCylinder(c) || cupMade(c)},
                    {target: 'libItem:cylinder', text: kb(2, 'h3'), done: c => c.placing('cylinder') || newCylinder(c) || cupMade(c)},
                    {target: 'workplane', text: kb(2, 'h4'), done: c => newCylinder(c) || cupMade(c)},
                    {target: 'inspector:size', text: kb(2, 'h5'), done: cupMade}
                ]
            },
            {
                kind: 'learn',
                title: kb(3, 'title'),
                text: kb(3, 'text'),
                tasks: [
                    {text: kb(3, 't1'), check: hollowed},
                    {text: kb(3, 't2'), check: wallOk},
                    {text: kb(3, 't3'), check: openTop}
                ],
                hints: [
                    {target: 'workplane', text: kb(3, 'h1'), done: c => c.selectedCount() > 0 || shellPanel() || hollowed(c)},
                    {target: 'toolbar:hollow', text: kb(3, 'h2'), done: c => shellPanel() || hollowed(c)},
                    {target: 'hollow:wall', text: kb(3, 'h3'), done: c => hollowed(c) || shellWallOk()},
                    {target: 'hollow:top', text: kb(3, 'h4'), done: c => hollowed(c) || shellTopOnly()},
                    {target: 'hollow:apply', text: kb(3, 'h5'), done: hollowed},
                    {target: 'toolbar:undo', text: kb(3, 'h6'), done: c => wallOk(c) && openTop(c)}
                ]
            },
            {
                kind: 'learn',
                title: kb(4, 'title'),
                text: kb(4, 'text'),
                tasks: [{text: kb(4, 't1'), check: filleted}],
                hints: [
                    {target: 'workplane', text: kb(4, 'h1'), done: c => c.selectedCount() > 0 || filletPanel() || filleted(c)},
                    {target: 'toolbar:fillet', text: kb(4, 'h2'), done: c => filletPanel() || filleted(c)},
                    {target: 'fillet:top', text: kb(4, 'h3'), done: c => filletReady() || pressed(el('fillet:top')) || filleted(c)},
                    {target: 'fillet:radius', text: kb(4, 'h4'), done: c => filletRadiusOk() || filleted(c)},
                    {target: 'fillet:apply', text: kb(4, 'h5'), done: filleted}
                ]
            },
            {
                kind: 'learn',
                title: kb(5, 'title'),
                text: kb(5, 'text'),
                tasks: [
                    {text: kb(5, 't1'), check: holesInWall},
                    {text: kb(5, 't2'), check: holesAround}
                ],
                hints: [
                    {target: 'workplane', text: kb(5, 'h1'), done: c => c.selectedCount() > 0 || patternPanel() || holesAround(c)},
                    {target: 'toolbar:holePattern', text: kb(5, 'h2'), done: c => patternPanel() || holesAround(c)},
                    {target: 'workplane', text: kb(5, 'h3'), done: c => wallPicked() || holesAround(c)},
                    {target: 'holePattern:apply', text: kb(5, 'h4'), done: holesAround}
                ]
            },
            {
                kind: 'game',
                title: kb(6, 'title'),
                text: kb(6, 'text'),
                tasks: [
                    {text: kb(6, 't1'), manual: true},
                    {text: kb(6, 't2'), manual: true}
                ],
                hints: [{target: 'viewCube', text: kb(6, 'h1'), done: () => false}]
            },
            {
                kind: 'learn',
                title: kb(7, 'title'),
                text: kb(7, 'text'),
                tasks: [{text: kb(7, 't1'), check: c => c.exported()}],
                hints: [
                    {target: 'export', text: kb(7, 'h1'), done: c => c.panelOpen('export') || c.exported()},
                    {target: 'export:download', text: kb(7, 'h2'), done: c => c.exported()}
                ]
            },
            {
                kind: 'challenge',
                title: kb(8, 'title'),
                text: kb(8, 'text'),
                autoHints: false,
                tasks: [{text: kb(8, 't1'), check: miniCup}],
                hints: [
                    {target: 'libItem:cylinder', text: kb(8, 'h1'), done: c => c.placing('cylinder') || newSmall(c)},
                    {target: 'workplane', text: kb(8, 'h3'), done: newSmall},
                    {target: 'toolbar:hollow', text: kb(8, 'h2'), done: miniCup}
                ]
            },
            {
                kind: 'creative',
                title: kb(9, 'title'),
                text: kb(9, 'text'),
                tasks: [
                    {text: kb(9, 't1'), manual: true},
                    {text: kb(9, 't2'), manual: true}
                ],
                hints: [
                    {target: 'addShape', text: kb(9, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || c.newShapes().length > 0},
                    {target: 'libItem:text', text: kb(9, 'h2'), done: c => c.placing() || c.newShapes().length > 0},
                    {target: 'workplane', text: kb(9, 'h3'), done: c => c.newShapes().length > 0}
                ]
            }
        ]
    };
})(typeof window !== 'undefined' ? window : globalThis);

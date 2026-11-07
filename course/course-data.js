/*
 * Kursinhalte. Alle sichtbaren Texte sind Schlüssel aus course/i18n/<sprache>.js.
 *
 * Kapitel  {id, level: 'neu'|'etwas'|'profi', type, icon, title, desc, comingSoon?, steps}
 *          id nie umbenennen – der Fortschritt hängt daran.
 * Schritt  {kind: 'info'|'learn'|'creative'|'game'|'challenge', title, text, image?,
 *           tasks?, hints?, labels?, autoHints?}
 * Aufgabe  {text, check: c => bool} oder {text, manual: true}
 * Hinweis  {target, text, done: c => bool} – gezeigt wird der erste nicht erledigte.
 * Label    {target, text} – Tour: mehrere Bereiche gleichzeitig beschriften (nur info).
 *
 * c = Prüf-Kontext aus course/context.js, Ziele aus lib/layerling-access.js (TARGETS).
 * Prüfungen großzügig: Bereiche statt fester Werte, eigene Wahl akzeptieren.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};

    // ---------- Hilfen für Kapitel 1 ----------

    const between = (v, min, max) => v >= min && v <= max;

    // Grundplatte: Quader, lange Seite 40–120 mm, kurze 15–50 mm, 1,5–6 mm dick.
    const isPlate = (c, s) => s.kind === 'box' && !s.hole && (() => {
        const z = c.size(s);
        return between(z.long, 40, 120) && between(z.short, 15, 50) && between(z.h, 1.5, 6);
    })();
    const plates = c => c.solids('box').filter(s => isPlate(c, s));

    // Eigener Text: nicht leer und nicht mehr der Platzhalter „TEXT“, den Layerling einsetzt.
    const isOwnText = s => s.kind === 'text' && typeof s.text === 'string' && s.text.trim() !== '' && s.text.trim() !== 'TEXT';
    const ownTexts = c => c.shapes('text').filter(isOwnText);

    const textOnPlate = c => ownTexts(c).some(t => c.shapes('box').some(p => !p.hole && c.onTop(t, p, 1)));
    const flatText = c => ownTexts(c).some(t => between(c.size(t).h, 0.5, 6));
    // Der Name läuft längs über die Platte und passt drauf (2 mm Spielraum).
    // Live gesehen: Platte hochkant (Breite 25, Tiefe 70), Name quer darüber und viel zu breit.
    const textAlong = c => ownTexts(c).some(t => c.shapes('box').some(p => !p.hole && c.onTop(t, p, 1) &&
        G().sameDirection(t, p) && G().insideXZ(t, p, 2)));

    const holeCylinders = c => c.holes('cylinder');
    const goodHole = (c, s) => between(c.size(s).long, 3, 8) && between(c.size(s).short, 3, 8);
    const G = () => LK.geometry;
    const holeAtPlate = c => holeCylinders(c).some(h => plates(c).some(p => G().overlapXZ(h, p)));
    // Das Loch muss die Platte ganz durchdringen (live gesehen: ein Zylinder landete bei −9,5 bis 0,5 mm).
    const holeThrough = c => holeCylinders(c).some(h => goodHole(c, h) && plates(c).some(p => {
        const H = G().bounds(h);
        const P = G().bounds(p);
        return G().overlapXZ(h, p) && H.minY <= P.minY + 0.3 && H.maxY >= P.maxY - 0.3;
    }));

    const grouped = c => c.groups().some(g =>
        g.members.some(s => isPlate(c, s)) && g.members.some(isOwnText) && g.members.some(s => s.hole && s.kind === 'cylinder'));

    const newOf = (c, kind) => c.newShapes(kind).length > 0;

    const k = (si, field) => `namensschild.s${si}.${field}`;

    // ---------- Kapitel 1: Namensschild ----------

    const namensschild = {
        id: 'namensschild',
        level: 'neu',
        type: 'basics',
        icon: '🏷️',
        title: 'namensschild.title',
        desc: 'namensschild.desc',
        steps: [
            {
                kind: 'info',
                title: k(1, 'title'),
                text: k(1, 'text'),
                labels: [
                    {target: 'addShape', text: k(1, 'l1')},
                    {target: 'workplane', text: k(1, 'l2')},
                    {target: 'viewCube', text: k(1, 'l3')}
                ]
            },
            {
                kind: 'learn',
                title: k(2, 'title'),
                text: k(2, 'text'),
                tasks: [{text: k(2, 't1'), check: c => c.editorOpen && c.shapes().length === 0}],
                hints: [{target: 'newDesign', text: k(2, 'h1'), done: c => c.editorOpen}]
            },
            {
                kind: 'learn',
                title: k(3, 'title'),
                text: k(3, 'text'),
                tasks: [{text: k(3, 't1'), check: c => newOf(c, 'box')}],
                hints: [
                    {target: 'addShape', text: k(3, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || newOf(c, 'box')},
                    {target: 'libItem:box', text: k(3, 'h2'), done: c => c.placing('box') || newOf(c, 'box')},
                    {target: 'workplane', text: k(3, 'h3'), done: c => newOf(c, 'box')}
                ]
            },
            {
                kind: 'learn',
                title: k(4, 'title'),
                text: k(4, 'text'),
                tasks: [{text: k(4, 't1'), check: c => plates(c).length > 0}],
                hints: [
                    {target: 'workplane', text: k(4, 'h1'), done: c => c.panelOpen('inspector') || plates(c).length > 0},
                    {target: 'inspector:keepProportions', text: k(4, 'h3'), done: c => !c.panelOpen('proportionsLocked') || plates(c).length > 0},
                    {target: 'inspector:size', text: k(4, 'h2'), done: c => plates(c).length > 0}
                ]
            },
            {
                kind: 'learn',
                title: k(5, 'title'),
                text: k(5, 'text'),
                tasks: [{text: k(5, 't1'), check: c => ownTexts(c).length > 0}],
                hints: [
                    {target: 'addShape', text: k(5, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || newOf(c, 'text')},
                    {target: 'libItem:text', text: k(5, 'h2'), done: c => c.placing('text') || newOf(c, 'text')},
                    {target: 'workplane', text: k(5, 'h4'), done: c => newOf(c, 'text')},
                    {target: 'inspector:text', text: k(5, 'h3'), done: c => ownTexts(c).length > 0}
                ]
            },
            {
                kind: 'learn',
                title: k(6, 'title'),
                text: k(6, 'text'),
                tasks: [
                    {text: k(6, 't1'), check: textOnPlate},
                    {text: k(6, 't2'), check: flatText},
                    {text: k(6, 't3'), check: textAlong}
                ],
                hints: [
                    {target: 'workplane', text: k(6, 'h1'), done: textOnPlate},
                    {target: 'inspector:rotation', text: k(6, 'h3'), done: c => textAlong(c) || ownTexts(c).some(t =>
                        c.shapes('box').some(p => !p.hole && c.onTop(t, p, 1) && G().sameDirection(t, p)))},
                    {target: 'inspector:size', text: k(6, 'h4'), done: textAlong},
                    {target: 'inspector:size', text: k(6, 'h2'), done: flatText}
                ]
            },
            {
                kind: 'learn',
                title: k(7, 'title'),
                text: k(7, 'text'),
                tasks: [
                    {text: k(7, 't1'), check: c => holeCylinders(c).length > 0},
                    {text: k(7, 't2'), check: c => holeCylinders(c).some(h => goodHole(c, h))},
                    {text: k(7, 't3'), check: holeThrough}
                ],
                hints: [
                    {target: 'addShape', text: k(7, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || c.shapes('cylinder').length > 0},
                    {target: 'libItem:cylinder', text: k(7, 'h2'), done: c => c.placing('cylinder') || c.shapes('cylinder').length > 0},
                    {target: 'workplane', text: k(7, 'h6'), done: c => c.shapes('cylinder').length > 0},
                    {target: 'inspector:hole', text: k(7, 'h3'), done: c => holeCylinders(c).length > 0},
                    {target: 'inspector:size', text: k(7, 'h4'), done: c => holeCylinders(c).some(h => goodHole(c, h))},
                    {target: 'workplane', text: k(7, 'h5'), done: holeAtPlate},
                    {target: 'toolbar:drop', text: k(7, 'h7'), done: holeThrough}
                ]
            },
            {
                kind: 'learn',
                title: k(8, 'title'),
                text: k(8, 'text'),
                tasks: [{text: k(8, 't1'), check: grouped}],
                hints: [
                    {target: 'workplane', text: k(8, 'h1'), done: c => c.selectedCount() >= 3 || grouped(c)},
                    {target: 'toolbar:group', text: k(8, 'h2'), done: grouped}
                ]
            },
            {
                kind: 'game',
                title: k(9, 'title'),
                text: k(9, 'text'),
                tasks: [
                    {text: k(9, 't1'), manual: true},
                    {text: k(9, 't2'), manual: true}
                ],
                hints: [{target: 'viewCube', text: k(9, 'h1'), done: () => false}]
            },
            {
                kind: 'learn',
                title: k(10, 'title'),
                text: k(10, 'text'),
                tasks: [{text: k(10, 't1'), check: c => c.exported()}],
                hints: [
                    {target: 'export', text: k(10, 'h1'), done: c => c.panelOpen('export') || c.exported()},
                    {target: 'export:download', text: k(10, 'h2'), done: c => c.exported()}
                ]
            },
            {
                kind: 'challenge',
                title: k(11, 'title'),
                text: k(11, 'text'),
                autoHints: false,
                tasks: [{text: k(11, 't1'), manual: true}]
            },
            {
                kind: 'creative',
                title: k(12, 'title'),
                text: k(12, 'text'),
                tasks: [
                    {text: k(12, 't1'), manual: true},
                    {text: k(12, 't2'), manual: true}
                ],
                hints: [
                    {target: 'addShape', text: k(12, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || c.newShapes().length > 0},
                    {target: 'libItem:nameTag', text: k(12, 'h2'), done: c => c.placing() || c.newShapes().length > 0},
                    {target: 'workplane', text: k(12, 'h3'), done: c => c.newShapes().length > 0}
                ]
            }
        ]
    };

    // ---------- Kapitel 2–6: je eine Datei unter course/chapters/ ----------

    const fromFile = id => {
        const ch = LK.chapters && LK.chapters[id];
        if (ch && ch.steps && ch.steps.length) return Object.assign({}, ch, {comingSoon: false});
        return ch || {id, title: `${id}.title`, desc: `${id}.desc`, comingSoon: true, steps: []};
    };

    LK.course = {
        // Reihenfolge = Ladereihenfolge der Kapiteldateien (CHAPTERS in background.js).
        chapters: [namensschild, ...Object.keys(LK.chapters || {}).map(fromFile)],
        levels: ['neu', 'etwas', 'profi']
    };
})(typeof window !== 'undefined' ? window : globalThis);

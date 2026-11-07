/*
 * Kapitel „getriebe“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/getriebe.js,
 * zusätzliche Hinweis-Ziele: lib/targets/getriebe.js. Wird in course/course-data.js eingereiht.
 *
 * Ergebnis: Kurbel-Getriebe aus Grundplatte mit zwei Achszapfen, Zahnrad 12 und 24 Zähne (gleiches
 * Modul), Kurbelzapfen am großen Rad; Teile auf zwei Druckplatten.
 *
 * Gemessen an Layerling 1.150 (Formobjekt `gear`): teeth, gearProfile ('involute' | 'round' |
 * 'simple'), gearType ('spur' …), centerHoleSize (Bohrung, Standard 6), width = depth =
 * Außendurchmesser = Modul × (Zähne + 2) (rund: + 1,2), height 6. Ein neues Rad: 12 Zähne, Modul 2
 * (Ø 28). Druckplatten liegen nebeneinander entlang X; im Formobjekt steht keine Platte – die
 * Plattenleiste (.plate-bar-chip mit Zähler) zeigt, wie viele Körper auf jeder stehen.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    const G = () => LK.geometry;
    const between = (v, min, max) => v >= min && v <= max;
    const num = v => (typeof v === 'number' && isFinite(v) ? v : null);

    // ---------- Zahnräder ----------

    // Stirn-, Schräg- und Pfeilräder kämmen auf parallelen Achsen; Kegel-, Hohlrad, Zahnstange nicht.
    const PARALLEL = ['spur', 'helical', 'herringbone'];
    const isGear = s => s.kind === 'gear' && !s.hole && PARALLEL.includes(s.gearType || 'spur');
    const gearsOf = c => c.shapes('gear').filter(isGear);

    // Modul aus Außendurchmesser und Zähnen (Layerling: involuteGearModule). Einfache Zähne haben keins.
    function moduleOf (g) {
        const teeth = num(g.teeth);
        if (!teeth || (g.gearProfile !== 'involute' && g.gearProfile !== 'round')) return null;
        const d = Math.min(num(g.width) || 0, num(g.depth) || 0);
        return d > 0 ? d / (teeth + (g.gearProfile === 'round' ? 1.2 : 2)) : null;
    }
    const sameModule = (a, b) => {
        const ma = moduleOf(a);
        const mb = moduleOf(b);
        return Boolean(ma && mb) && a.gearProfile === b.gearProfile && Math.abs(ma - mb) <= 0.02 * Math.max(ma, mb);
    };
    // Achsabstand = Modul × (z1 + z2) / 2
    const centreDistance = (a, b) => (moduleOf(a) + moduleOf(b)) / 2 * (a.teeth + b.teeth) / 2;
    const apart = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
    const TOL = 0.3; // mm beim Achsabstand

    // Paare [klein, groß] mit etwa doppelt so vielen Zähnen (1:2, großzügig 1,8–2,2).
    function ratioPairs (c) {
        const gs = gearsOf(c);
        const out = [];
        gs.forEach(a => gs.forEach(b => {
            if (a !== b && num(a.teeth) && num(b.teeth) && between(b.teeth / a.teeth, 1.8, 2.2)) out.push([a, b]);
        }));
        return out;
    }
    const modulePairs = c => ratioPairs(c).filter(([a, b]) => sameModule(a, b));
    const meshes = ([a, b]) => Math.abs(apart(a, b) - centreDistance(a, b)) <= TOL;
    // Das Paar, an dem die weiteren Schritte hängen: am liebsten eines, das schon kämmt.
    const pairOf = c => {
        const list = modulePairs(c);
        return list.find(meshes) || list[0] || null;
    };

    // ---------- Grundplatte und Achsen ----------

    const isBase = (c, s) => s.kind === 'box' && !s.hole && (() => {
        const z = c.size(s);
        return between(z.long, 50, 200) && between(z.short, 20, 150) && between(z.h, 2, 10);
    })();
    const bases = c => c.solids('box').filter(s => isBase(c, s));
    const diameter = s => Math.min(num(s.width) || 0, num(s.depth) || 0);
    // Achse: Vollzylinder, der auf einer Grundplatte steht.
    const axlesOn = (c, base) => c.solids('cylinder').filter(s => c.onTop(s, base, 0.5) && G().insideXZ(s, base, 0.5));

    // Zwei Achsen auf derselben Platte im Achsabstand des Zahnradpaars (Drehung, Lage egal).
    function axleSet (c) {
        const pair = pairOf(c);
        if (!pair) return null;
        const want = centreDistance(pair[0], pair[1]);
        for (const base of bases(c)) {
            const ax = axlesOn(c, base);
            for (let i = 0; i < ax.length; i++) {
                for (let j = i + 1; j < ax.length; j++) {
                    if (Math.abs(apart(ax[i], ax[j]) - want) <= TOL) return {base, axles: [ax[i], ax[j]], pair};
                }
            }
        }
        return null;
    }
    // Spiel: Achse 0,2–1 mm dünner als die Bohrung eines der beiden Räder.
    const SPIEL_MIN = 0.2;
    const SPIEL_MAX = 1.0;
    const fitsBore = (axle, gears) => gears.some(g => num(g.centerHoleSize) && between(g.centerHoleSize - diameter(axle), SPIEL_MIN - 1e-6, SPIEL_MAX + 1e-6));
    const axlesFit = c => {
        const set = axleSet(c);
        return Boolean(set) && set.axles.every(a => fitsBore(a, set.pair));
    };
    const axlesTall = c => {
        const set = axleSet(c);
        const gearH = set ? Math.max(set.pair[0].height || 0, set.pair[1].height || 0) : 0;
        return Boolean(set) && set.axles.every(a => (a.height || 0) >= gearH + 1);
    };

    // ---------- Kurbel ----------

    // Kurbelzapfen: Vollzylinder auf dem großen Rad, außermittig, aber innerhalb des Rads.
    function cranks (c) {
        const pair = pairOf(c);
        if (!pair) return [];
        const big = pair[1];
        const r = diameter(big) / 2;
        return c.solids('cylinder').filter(s => c.onTop(s, big, 1) && between(diameter(s), 3, 15) && (s.height || 0) >= 5 &&
            between(apart(s, big), 5, r)).map(crank => ({crank, big}));
    }
    const crankGrouped = c => cranks(c).some(({crank, big}) => c.inGroupWith(crank, big));
    const baseGrouped = c => {
        const set = axleSet(c);
        return Boolean(set) && c.inGroupWith(set.base, set.axles[0]) && c.inGroupWith(set.base, set.axles[1]);
    };

    // ---------- Druckplatten ----------

    // Plattenleiste: je Platte ein Chip mit der Zahl der Körper darauf (null = Leiste zu).
    // Liefert der Prüf-Kontext einmal c.plates(), gilt das.
    function plates (c) {
        if (typeof c.plates === 'function') return c.plates();
        const dom = LK.access && LK.access.dom;
        const chips = dom ? dom.qa('.plate-bar-chip') : [];
        if (!chips.length) return null;
        return chips.map(ch => {
            const count = ch.querySelector('.plate-bar-chip-count');
            return {bodies: parseInt(count ? count.textContent : '0', 10) || 0};
        });
    }
    const barOpen = c => plates(c) !== null;
    const spread = c => (plates(c) || []).filter(p => p.bodies > 0).length >= 2;

    const newGear = c => c.newShapes('gear').some(isGear);
    const gearCount = c => gearsOf(c).length;

    const k = (si, field) => `getriebe.s${si}.${field}`;

    LK.chapters['getriebe'] = {
        id: 'getriebe',
        level: 'profi',
        type: 'mechanics',
        icon: '⚙️',
        title: 'getriebe.title',
        desc: 'getriebe.desc',
        steps: [
            {
                kind: 'info',
                title: k(1, 'title'),
                text: k(1, 'text'),
                labels: [
                    {target: 'addShape', text: k(1, 'l1')},
                    {target: 'toolbar:buildPlates', text: k(1, 'l2')},
                    {target: 'viewCube', text: k(1, 'l3')}
                ]
            },
            {
                // Kleines Rad: Zahnrad aus der Bibliothek, Modul ablesen
                kind: 'learn',
                title: k(2, 'title'),
                text: k(2, 'text'),
                tasks: [
                    {text: k(2, 't1'), check: newGear},
                    {text: k(2, 't2'), check: c => gearsOf(c).some(g => moduleOf(g) !== null && between(g.teeth, 8, 20))}
                ],
                hints: [
                    {target: 'addShape', text: k(2, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || newGear(c)},
                    {target: 'libItem:gear', text: k(2, 'h2'), done: c => c.placing('gear') || newGear(c)},
                    {target: 'workplane', text: k(2, 'h3'), done: newGear},
                    {target: 'inspector:gearProfile', text: k(2, 'h4'), done: c => gearsOf(c).some(g => moduleOf(g) !== null)},
                    {target: 'inspector:teeth', text: k(2, 'h5'), done: c => gearsOf(c).some(g => moduleOf(g) !== null && between(g.teeth, 8, 20))}
                ]
            },
            {
                // Großes Rad: doppelte Zähnezahl, gleiches Modul
                kind: 'learn',
                title: k(3, 'title'),
                text: k(3, 'text'),
                tasks: [
                    {text: k(3, 't1'), check: c => ratioPairs(c).length > 0},
                    {text: k(3, 't2'), check: c => modulePairs(c).length > 0}
                ],
                hints: [
                    {target: 'addShape', text: k(3, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || gearCount(c) >= 2},
                    {target: 'libItem:gear', text: k(3, 'h2'), done: c => c.placing('gear') || gearCount(c) >= 2},
                    {target: 'workplane', text: k(3, 'h3'), done: c => gearCount(c) >= 2},
                    {target: 'inspector:teeth', text: k(3, 'h4'), done: c => ratioPairs(c).length > 0},
                    {target: 'inspector:module', text: k(3, 'h5'), done: c => modulePairs(c).length > 0}
                ]
            },
            {
                // Achsabstand = Modul × (z1 + z2) / 2 – oder schon die Achsen im richtigen Abstand (Vorgriff)
                kind: 'learn',
                title: k(4, 'title'),
                text: k(4, 'text'),
                tasks: [{text: k(4, 't1'), check: c => modulePairs(c).some(meshes) || axleSet(c) !== null}],
                hints: [
                    {target: 'workplane', text: k(4, 'h1'), done: c => c.selectedCount() >= 2 || modulePairs(c).some(meshes)},
                    {target: 'gearPair:keep', text: k(4, 'h2'), done: c => modulePairs(c).some(meshes)}
                ]
            },
            {
                // Grundplatte mit zwei Achszapfen im Achsabstand, mit Spiel zur Bohrung
                kind: 'learn',
                title: k(5, 'title'),
                text: k(5, 'text'),
                tasks: [
                    {text: k(5, 't1'), check: c => bases(c).length > 0},
                    {text: k(5, 't2'), check: c => axleSet(c) !== null},
                    {text: k(5, 't3'), check: axlesFit},
                    {text: k(5, 't4'), check: axlesTall}
                ],
                hints: [
                    {target: 'addShape', text: k(5, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || bases(c).length > 0},
                    {target: 'libItem:box', text: k(5, 'h8'), done: c => c.placing('box') || c.newShapes('box').length > 0 || bases(c).length > 0},
                    {target: 'inspector:size', text: k(5, 'h2'), done: c => bases(c).length > 0},
                    {target: 'libItem:cylinder', text: k(5, 'h3'), done: c => c.placing('cylinder') || c.newShapes('cylinder').length > 0},
                    {target: 'workplane', text: k(5, 'h4'), done: c => bases(c).some(b => axlesOn(c, b).length > 0)},
                    {target: 'inspector:size', text: k(5, 'h5'), done: c => bases(c).some(b => axlesOn(c, b).some(a => fitsBore(a, gearsOf(c))))},
                    {target: 'inspector:position', text: k(5, 'h6'), done: c => axleSet(c) !== null},
                    {target: 'inspector:size', text: k(5, 'h7'), done: c => axlesFit(c) && axlesTall(c)}
                ]
            },
            {
                // Kurbel aufs große Rad, Teile gruppieren
                kind: 'learn',
                title: k(6, 'title'),
                text: k(6, 'text'),
                tasks: [
                    {text: k(6, 't1'), check: c => cranks(c).length > 0},
                    {text: k(6, 't2'), check: crankGrouped},
                    {text: k(6, 't3'), check: baseGrouped}
                ],
                hints: [
                    {target: 'libItem:cylinder', text: k(6, 'h1'), done: c => c.placing('cylinder') || c.newShapes('cylinder').length > 0 || cranks(c).length > 0},
                    {target: 'workplane', text: k(6, 'h2'), done: c => cranks(c).length > 0},
                    {target: 'workplane', text: k(6, 'h3'), done: c => c.selectedCount() >= 2 || crankGrouped(c)},
                    {target: 'toolbar:group', text: k(6, 'h4'), done: crankGrouped},
                    {target: 'workplane', text: k(6, 'h5'), done: c => c.selectedCount() >= 3 || baseGrouped(c)},
                    {target: 'toolbar:group', text: k(6, 'h6'), done: baseGrouped}
                ]
            },
            {
                // Druckplatten: Teile auf mehrere Platten
                kind: 'learn',
                title: k(7, 'title'),
                text: k(7, 'text'),
                tasks: [
                    {text: k(7, 't1'), check: barOpen},
                    {text: k(7, 't2'), check: spread},
                    {text: k(7, 't3'), manual: true}
                ],
                hints: [
                    {target: 'toolbar:buildPlates', text: k(7, 'h1'), done: c => barOpen(c) || spread(c)},
                    {target: 'plates:moveTo', text: k(7, 'h2'), done: spread},
                    {target: 'plates:bar', text: k(7, 'h3'), done: () => false}
                ]
            },
            {
                kind: 'game',
                title: k(8, 'title'),
                text: k(8, 'text'),
                tasks: [
                    {text: k(8, 't1'), manual: true},
                    {text: k(8, 't2'), manual: true}
                ],
                hints: [
                    {target: 'plates:showAll', text: k(8, 'h1'), done: () => false}
                ]
            },
            {
                kind: 'learn',
                title: k(9, 'title'),
                text: k(9, 'text'),
                tasks: [{text: k(9, 't1'), check: c => c.exported()}],
                hints: [
                    {target: 'export', text: k(9, 'h1'), done: c => c.panelOpen('export') || c.exported()},
                    {target: 'export:download', text: k(9, 'h2'), done: c => c.exported()}
                ]
            },
            {
                kind: 'challenge',
                title: k(10, 'title'),
                text: k(10, 'text'),
                autoHints: false,
                tasks: [{text: k(10, 't1'), manual: true}]
            },
            {
                kind: 'creative',
                title: k(11, 'title'),
                text: k(11, 'text'),
                tasks: [
                    {text: k(11, 't1'), manual: true},
                    {text: k(11, 't2'), manual: true}
                ]
            }
        ]
    };

    // Für Tests und Live-Prüfung
    LK.chapters['getriebe'].helpers = {moduleOf, centreDistance, pairOf, axleSet, cranks, plates};
})(typeof window !== 'undefined' ? window : globalThis);

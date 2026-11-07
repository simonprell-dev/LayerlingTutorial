/*
 * Kapitel „schraubdose“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/schraubdose.js,
 * zusätzliche Hinweis-Ziele und Fenster-Leser: lib/targets/schraubdose.js. Wird in course/course-data.js eingereiht.
 *
 * Weg (live geprüft an Layerling v1.150.0): Zylinder → „Aushöhlen“ (nur oben offen) → Werkzeug „Deckel“, Art
 * „Aufgeschraubt“, Passung/Spalt → „Deckel machen“. Danach steht im Entwurf:
 *   - eine Gruppe (kind 'mesh', groupOperation 'group') mit dem Dosenkörper (kind 'mesh', edgeTreatments
 *     [{kind: 'shell', openings: 'top', amount}]) und dem Außengewinde (kind 'mesh', id '<quelle>-thread-…');
 *   - der Deckel (kind 'mesh', id '<quelle>-lid-…'), umgedreht neben der Dose, Platte unten. Sein Dreiecksnetz
 *     (importedMesh.positions, lokal um die Mitte) reicht innen bis Radius Dose + Spalt – daraus wird das Spiel gemessen.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    const k = (si, field) => `schraubdose.s${si}.${field}`;
    const G = () => LK.geometry;
    const read = name => {
        const r = LK.schraubdose && LK.schraubdose[name];
        return typeof r === 'function' ? r() : null;
    };
    const between = (v, min, max) => typeof v === 'number' && v >= min && v <= max;

    // ---------- Formen erkennen ----------

    const round = s => Math.abs((s.width || 0) - (s.depth || 0)) <= 0.5;
    const isLid = s => s.kind === 'mesh' && /-lid-/.test(s.id || '');
    const isThread = s => s.kind === 'mesh' && /-thread-/.test(s.id || '');
    const shellOf = s => (Array.isArray(s.edgeTreatments) ? s.edgeTreatments : []).find(t => t && t.kind === 'shell') || null;
    // Nur oben offen – unten offen hätte die Dose keinen Boden.
    const topOnly = o => o === 'top' || (Array.isArray(o) && o.length === 1 && o[0] === 'top');

    // Dosenkörper: rund, Ø 40–70 mm, 30–80 mm hoch; Zylinder oder (ausgehöhlt) Netz mit Schale.
    const canSized = (c, s) => round(s) && between(c.size(s).long, 39.5, 70.5) && between(c.size(s).h, 29.5, 80.5);
    const isCan = (c, s) => !s.hole && !isLid(s) && !isThread(s) && canSized(c, s) &&
        (s.kind === 'cylinder' || (s.kind === 'mesh' && Boolean(shellOf(s))));
    const cans = c => c.shapes().filter(s => isCan(c, s));

    // Aushöhlen per Werkzeug – oder klassisch mit einer Zylinder-Aussparung von oben (Boden bleibt).
    const holeIn = (c, can) => c.holes('cylinder').find(h => {
        const H = G().bounds(h);
        const C = G().bounds(can);
        return round(h) && Math.abs(h.x - can.x) <= 1 && Math.abs(h.z - can.z) <= 1 && h.width < can.width &&
            H.maxY >= C.maxY - 0.05 && H.minY >= C.minY + 0.8 && H.minY < C.maxY - 5;
    }) || null;
    const wallOf = (c, can) => {
        const sh = shellOf(can);
        if (sh && topOnly(sh.openings)) return sh.amount;
        const h = holeIn(c, can);
        return h ? (can.width - h.width) / 2 : null;
    };
    const hollowCans = c => cans(c).filter(s => wallOf(c, s) !== null);
    const goodWall = c => hollowCans(c).some(s => between(wallOf(c, s), 1.2, 4));

    // Schraubdeckel: Deckel + Außengewinde aus demselben Werkzeuglauf (gleiche Quell-id vor -lid-/-thread-).
    const sourceOf = s => String(s.id).split(/-lid-|-thread-/)[0];
    const threads = c => c.shapes().filter(isThread);
    const screwLids = c => {
        const th = threads(c);
        return c.shapes().filter(isLid).filter(l => th.some(t => sourceOf(t) === sourceOf(l)));
    };
    // Die Dose zum Deckel: Körper in der Gruppe mit dem passenden Gewinde, dazu das Gewinde selbst.
    function setOf (c, lid) {
        const thread = threads(c).find(t => sourceOf(t) === sourceOf(lid));
        if (!thread) return null;
        const body = c.shapes().find(s => s !== thread && !s.hole && !isLid(s) && !isThread(s) && round(s) &&
            (sourceOf(s) === sourceOf(thread) || String(s.id).startsWith(sourceOf(thread)) || c.inGroupWith(s, thread)) &&
            Math.abs(s.x - thread.x) <= 1 && Math.abs(s.z - thread.z) <= 1);
        return body ? {lid, thread, body, parts: [body, thread]} : null;
    }
    const sets = c => screwLids(c).map(l => setOf(c, l)).filter(Boolean);

    // ---------- Spiel messen ----------

    // Innerster Radius des Deckelrands (lokale Netzpunkte über der Platte), einmal je Netz gerechnet.
    const innerCache = typeof WeakMap === 'function' ? new WeakMap() : null;
    function innerRadius (lid) {
        const mesh = lid.importedMesh;
        const pos = mesh && mesh.positions;
        if (!pos || pos.length < 9) return null;
        if (innerCache && innerCache.has(mesh)) return scaled(lid, innerCache.get(mesh));
        let minY = Infinity;
        for (let i = 1; i < pos.length; i += 3) minY = Math.min(minY, pos[i]);
        // Die Platte (unten, Deckel liegt umgedreht) reicht bis zur Mitte – nur der Rand darüber zählt.
        const plate = Math.min(2.5, (lid.height || 8) * 0.3);
        let min = Infinity;
        for (let i = 0; i < pos.length; i += 3) {
            if (pos[i + 1] < minY + plate) continue;
            min = Math.min(min, Math.hypot(pos[i], pos[i + 2]));
        }
        const r = isFinite(min) ? min : null;
        if (innerCache) innerCache.set(mesh, r);
        return scaled(lid, r);
    }
    function scaled (lid, r) {
        if (r === null) return null;
        const base = lid.importedMesh && lid.importedMesh.baseWidth;
        return base > 0 && lid.width > 0 ? r * lid.width / base : r;
    }
    // Spiel je Seite = innerster Deckelradius − Radius der Dose; null, wenn nicht messbar.
    const gapOf = set => {
        const r = innerRadius(set.lid);
        return r === null ? null : r - set.body.width / 2;
    };
    const GAP = [0.12, 0.55];
    const gapPanelOk = () => {
        const p = read('lidPanel');
        return Boolean(p && p.settings && p.settings.type === 'screw' && between(p.settings.gap, 0.15, 0.5));
    };
    const madeGapOk = c => sets(c).some(s => {
        const g = gapOf(s);
        return g === null || between(g, GAP[0], GAP[1]);
    });
    const gapOk = c => gapPanelOk() || madeGapOk(c);
    const madeLid = c => sets(c).length > 0;

    // ---------- Anordnen ----------

    // Abstand auf der Druckplatte (nur x/z): Das Gewinde sitzt oben an der Dose, der Deckel liegt unten –
    // in 3D wären sie weiter auseinander, als man von oben sieht (live gesehen: 10,0 statt 9,1 mm).
    // Runde Teile: Drehung ändert nichts – der gedrehte Hüllquader wäre aber zu groß.
    const unturned = s => (round(s) ? Object.assign({}, s, {rotation: 0}) : s);
    const xzDistance = (a, b) => {
        const A = G().bounds(unturned(a));
        const B = G().bounds(unturned(b));
        const gap = (minA, maxA, minB, maxB) => Math.max(0, minB - maxA, minA - maxB);
        return Math.hypot(gap(A.minX, A.maxX, B.minX, B.maxX), gap(A.minZ, A.maxZ, B.minZ, B.maxZ));
    };
    const distance = set => Math.min(...set.parts.map(p => xzDistance(set.lid, p)));
    const apart = set => set.parts.every(p => !G().overlapXZ(unturned(set.lid), unturned(p)));
    const spaced = c => sets(c).some(s => apart(s) && between(distance(s), 4, 6));
    const inLine = c => sets(c).some(s => Math.abs(s.lid.x - s.body.x) <= 0.5 || Math.abs(s.lid.z - s.body.z) <= 0.5);
    const onPlate = c => sets(c).some(s => Math.abs(G().bounds(s.lid).minY) <= 0.3 && Math.abs(G().bounds(s.body).minY) <= 0.3);
    // Reihe läuft entlang x → „mittig“ in z ausrichten (und umgekehrt).
    const rowAlongX = c => sets(c).some(s => Math.abs(s.lid.x - s.body.x) >= Math.abs(s.lid.z - s.body.z));
    const separate = c => sets(c).some(s => apart(s) && distance(s) >= 1);

    const clearanceOk = () => {
        const p = read('clearancePanel');
        const r = p && p.result;
        return Boolean(r && !p.running && !p.stale && !r.tooFew && r.parts >= 2 && r.overlaps === 0 && r.touching === 0);
    };

    // ---------- Fenster offen? ----------

    const shellPanel = () => read('shellPanel');
    const lidPanel = () => read('lidPanel');
    const lidScrewChosen = () => {
        const p = lidPanel();
        return Boolean(p && p.settings && p.settings.type === 'screw');
    };

    LK.chapters['schraubdose'] = {
        id: 'schraubdose',
        level: 'profi',
        type: 'mechanics',
        icon: '🫙',
        title: 'schraubdose.title',
        desc: 'schraubdose.desc',
        steps: [
            {
                kind: 'info',
                title: k(1, 'title'),
                text: k(1, 'text'),
                labels: [
                    {target: 'toolbar:hollow', text: k(1, 'l1')},
                    {target: 'toolbar:lid', text: k(1, 'l2')},
                    {target: 'toolbar:clearance-check', text: k(1, 'l3')}
                ]
            },
            {
                kind: 'learn',
                title: k(2, 'title'),
                text: k(2, 'text'),
                tasks: [
                    {text: k(2, 't1'), check: c => c.newShapes().some(s => !s.hole && (s.kind === 'cylinder' || isCan(c, s)))},
                    {text: k(2, 't2'), check: c => cans(c).length > 0}
                ],
                hints: [
                    {target: 'addShape', text: k(2, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || c.shapes('cylinder').length > 0 || cans(c).length > 0},
                    {target: 'libItem:cylinder', text: k(2, 'h2'), done: c => c.placing('cylinder') || c.shapes('cylinder').length > 0 || cans(c).length > 0},
                    {target: 'workplane', text: k(2, 'h3'), done: c => c.shapes('cylinder').length > 0 || cans(c).length > 0},
                    {target: 'inspector:size', text: k(2, 'h4'), done: c => cans(c).length > 0}
                ]
            },
            {
                kind: 'learn',
                title: k(3, 'title'),
                text: k(3, 'text'),
                tasks: [
                    {text: k(3, 't1'), check: c => hollowCans(c).length > 0},
                    {text: k(3, 't2'), check: goodWall}
                ],
                hints: [
                    {target: 'workplane', text: k(3, 'h1'), done: c => c.selectedCount() > 0 || Boolean(shellPanel()) || hollowCans(c).length > 0},
                    {target: 'toolbar:hollow', text: k(3, 'h2'), done: c => Boolean(shellPanel()) || hollowCans(c).length > 0},
                    {target: 'schraubdose:shellTop', text: k(3, 'h3'), done: c => {
                        const p = shellPanel();
                        return Boolean(p && topOnly(p.openings)) || hollowCans(c).length > 0;
                    }},
                    {target: 'schraubdose:shellWall', text: k(3, 'h4'), done: c => {
                        const p = shellPanel();
                        return Boolean(p && between(p.thickness, 1.2, 4)) || goodWall(c);
                    }},
                    {target: 'schraubdose:shellApply', text: k(3, 'h5'), done: goodWall}
                ]
            },
            {
                kind: 'learn',
                title: k(4, 'title'),
                text: k(4, 'text'),
                tasks: [
                    {text: k(4, 't1'), check: c => Boolean(lidPanel()) || madeLid(c)},
                    {text: k(4, 't2'), check: c => lidScrewChosen() || madeLid(c)}
                ],
                hints: [
                    {target: 'workplane', text: k(4, 'h1'), done: c => c.selectedCount() > 0 || Boolean(lidPanel()) || madeLid(c)},
                    {target: 'toolbar:lid', text: k(4, 'h2'), done: c => Boolean(lidPanel()) || madeLid(c)},
                    {target: 'schraubdose:lidScrew', text: k(4, 'h3'), done: c => lidScrewChosen() || madeLid(c)}
                ]
            },
            {
                kind: 'learn',
                title: k(5, 'title'),
                text: k(5, 'text'),
                tasks: [
                    {text: k(5, 't1'), check: gapOk},
                    {text: k(5, 't2'), check: madeLid}
                ],
                hints: [
                    {target: 'toolbar:lid', text: k(5, 'h1'), done: c => Boolean(lidPanel()) || madeLid(c)},
                    {target: 'schraubdose:lidScrew', text: k(5, 'h2'), done: c => lidScrewChosen() || madeLid(c)},
                    {target: 'schraubdose:lidFit', text: k(5, 'h3'), done: gapOk},
                    {target: 'schraubdose:lidApply', text: k(5, 'h4'), done: madeLid}
                ]
            },
            {
                kind: 'learn',
                title: k(6, 'title'),
                text: k(6, 'text'),
                // Nach „Deckel machen“ liegt der Deckel schon mittig auf der Platte (Review): eine Aufgabe,
                // die Ausrichten-Hinweise erscheinen nur, wenn er beim Verschieben verrutscht.
                tasks: [{text: k(6, 't1'), check: c => spaced(c) && inLine(c) && onPlate(c)}],
                hints: [
                    {target: 'schraubdose:tape', text: k(6, 'h1'), done: spaced},
                    {target: 'workplane', text: k(6, 'h2'), done: c => c.selectedCount() >= 2 || inLine(c)},
                    {target: 'toolbar:align', text: k(6, 'h3'), done: inLine},
                    {target: 'schraubdose:alignCenterZ', text: k(6, 'h4'), done: c => inLine(c) || !rowAlongX(c)},
                    {target: 'schraubdose:alignCenterX', text: k(6, 'h4'), done: c => inLine(c) || rowAlongX(c)},
                    {target: 'toolbar:drop', text: k(6, 'h5'), done: onPlate}
                ]
            },
            {
                kind: 'learn',
                title: k(7, 'title'),
                text: k(7, 'text'),
                tasks: [
                    {text: k(7, 't1'), check: clearanceOk},
                    {text: k(7, 't2'), check: separate}
                ],
                hints: [
                    // Live gesehen: Mit nur dem Deckel ausgewählt prüft das Werkzeug ein Teil – „Weniger als zwei Teile“.
                    {target: 'workplane', text: k(7, 'h4'), done: c => c.selectedCount() !== 1 || clearanceOk(c)},
                    {target: 'toolbar:clearance-check', text: k(7, 'h1'), done: c => Boolean(read('clearancePanel')) || clearanceOk(c)},
                    {target: 'schraubdose:clearanceRun', text: k(7, 'h2'), done: clearanceOk},
                    {target: 'schraubdose:tape', text: k(7, 'h3'), done: separate}
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
                hints: [{target: 'schraubdose:section', text: k(8, 'h1'), done: () => false}]
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

    // Für Tests und Live-Prüfung.
    LK.chapters['schraubdose'].helpers = {cans, hollowCans, screwLids, sets, gapOf, innerRadius, distance};
})(typeof window !== 'undefined' ? window : globalThis);

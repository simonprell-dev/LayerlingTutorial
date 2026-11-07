/*
 * Kapitel „handystaender“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/handystaender.js,
 * zusätzliche Hinweis-Ziele und Fenster-Zustände: lib/targets/handystaender.js. Wird in course/course-data.js eingereiht.
 *
 * Gemessen an Layerling v1.150.0: Ein abgeschlossenes Skizzenprofil wird ein Körper mit kind 'mesh',
 * sketchOperation 'extrude' und sketchProfile {points: [{id, x, z}], segments: [{startId, endId, kind}]}
 * (x/z auf der Arbeitsebene, Winkel 90° = Bildschirm oben = −z). Er liegt flach: Das Profil ist unten,
 * height ist die Extrusion (= Breite des Ständers, Vorgabe 10 mm). Fasen stehen in
 * edgeTreatments [{kind: 'chamfer', amount, edgeCount, chamferAngle}]. Drehungen in rotationX/rotation/rotationZ
 * (Grad, Euler XYZ wie three.js), auch nach „Auf Fläche legen“.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    const k = (si, field) => `handystaender.s${si}.${field}`;
    const between = (v, min, max) => typeof v === 'number' && v >= min && v <= max;

    // ---------- Skizzenkörper und Profil ----------

    const isSketchBody = s => Boolean(s && !s.hole && s.sketchProfile && Array.isArray(s.sketchProfile.points) &&
        (!s.sketchOperation || s.sketchOperation === 'extrude'));
    // Bewusst nicht über newShapes: Nach dem Skizzenmodus kann der Kurs den Ausgangsstand neu setzen
    // (dann zählte der gerade gezeichnete Körper als „schon da“). Jeder Skizzenkörper zählt.
    const sketchBodies = c => c.shapes().filter(isSketchBody);

    // Gerade Stücke des Profils (Hilfslinien zählen nicht; Kurven über ihre Endpunkte).
    function lines (s) {
        const prof = s.sketchProfile;
        const pts = new Map(prof.points.map(p => [p.id, p]));
        return (prof.segments || []).filter(g => !g.construction).map(g => [pts.get(g.startId), pts.get(g.endId)])
            .filter(([a, b]) => a && b && isFinite(a.x) && isFinite(a.z) && isFinite(b.x) && isFinite(b.z))
            .map(([a, b]) => ({a, b, len: Math.hypot(b.x - a.x, b.z - a.z), dir: Math.atan2(-(b.z - a.z), b.x - a.x) * 180 / Math.PI}))
            .filter(l => l.len > 0.01);
    }

    // Spitzer Winkel zwischen zwei Richtungen (0–90°).
    const acute = (d1, d2) => {
        const d = Math.abs(d1 - d2) % 180;
        return Math.min(d, 180 - d);
    };

    // Lokales Achsenkreuz einer Linie: u entlang, n quer – n zeigt auf die Seite, auf der das Profil liegt.
    function frame (line, pts) {
        const ux = (line.b.x - line.a.x) / line.len;
        const uz = (line.b.z - line.a.z) / line.len;
        let nx = -uz;
        let nz = ux;
        const side = pts.map(p => (p.x - line.a.x) * nx + (p.z - line.a.z) * nz);
        const min = Math.min(...side);
        const max = Math.max(...side);
        if (Math.abs(min) > Math.abs(max)) {
            nx = -nx;
            nz = -nz;
        }
        return {
            t: p => (p.x - line.a.x) * ux + (p.z - line.a.z) * uz,
            h: p => (p.x - line.a.x) * nx + (p.z - line.a.z) * nz,
            supporting: min >= -0.5 || max <= 0.5
        };
    }

    // Standfläche: die längste Linie, auf deren einer Seite das ganze Profil liegt.
    function base (s) {
        const ls = lines(s);
        const pts = s.sketchProfile.points;
        let best = null;
        ls.forEach(l => {
            const f = frame(l, pts);
            if (f.supporting && (!best || l.len > best.line.len)) best = {line: l, frame: f};
        });
        return best ? Object.assign(best, {lines: ls}) : null;
    }

    // Lehne: mindestens 40 mm lang und 55–80° gegen die Standfläche geneigt (Ziel 60–75°).
    function hasBackrest (s) {
        const b = base(s);
        return Boolean(b) && b.lines.some(l => l !== b.line && l.len >= 40 && between(acute(l.dir, b.line.dir), 55, 80));
    }

    // Lippe vorne: Von der Standfläche aus gesehen hat die Oberkante des Profils eine Mulde – vorn geht es hoch
    // (Lippe), dann runter (Rinne für das Handy), dann wieder hoch (Lehne). Je mindestens 3 mm.
    function hasLip (s) {
        const b = base(s);
        if (!b) return false;
        const f = b.frame;
        const segs = b.lines.map(l => ({t1: f.t(l.a), h1: f.h(l.a), t2: f.t(l.b), h2: f.h(l.b)}));
        const ts = s.sketchProfile.points.map(f.t);
        const lo = Math.min(...ts) + 0.5;
        const hi = Math.max(...ts) - 0.5;
        if (!(hi > lo)) return false;
        const N = 120;
        const env = [];
        for (let i = 0; i <= N; i++) {
            const t = lo + (hi - lo) * i / N;
            let top = -Infinity;
            segs.forEach(g => {
                if (Math.abs(g.t2 - g.t1) < 1e-6) return;
                const r = (t - g.t1) / (g.t2 - g.t1);
                if (r >= 0 && r <= 1) top = Math.max(top, g.h1 + r * (g.h2 - g.h1));
            });
            env.push(top);
        }
        let leftMax = -Infinity;
        const rightMax = env.map((_, i) => Math.max(-Infinity, ...env.slice(i + 1)));
        return env.some((h, i) => {
            const ok = leftMax - h >= 3 && rightMax[i] - h >= 3;
            leftMax = Math.max(leftMax, h);
            return ok;
        });
    }

    const backrestOk = c => sketchBodies(c).some(hasBackrest);
    const lipOk = c => sketchBodies(c).some(hasLip);
    const profileOk = c => sketchBodies(c).some(s => hasBackrest(s) && hasLip(s));

    // Breite des Ständers = Extrusion (height, bleibt beim Drehen gleich): 60–90 mm, großzügig 55–95.
    const wideOk = c => sketchBodies(c).some(s => between(s.height, 55, 95));

    // Fase 0,5–3,5 mm (auch „Fase + Rundung“).
    const isChamfered = s => (s.edgeTreatments || []).some(e => e && (e.kind === 'chamfer' || e.kind === 'chamfillet') && between(e.amount, 0.5, 3.5));
    const chamferOk = c => sketchBodies(c).some(isChamfered);

    // Liegt das Profil flach auf der Platte? Die Extrusion (lokal y) zeigt dann senkrecht nach oben oder unten.
    function upFactor (s) {
        const r = d => (typeof d === 'number' ? d : 0) * Math.PI / 180;
        const x = r(s.rotationX);
        const y = r(s.rotation);
        const z = r(s.rotationZ);
        return Math.cos(z) * Math.cos(x) - Math.sin(z) * Math.sin(y) * Math.sin(x);
    }
    const lyingFlat = s => Math.abs(upFactor(s)) >= 0.97;
    const flatOk = c => sketchBodies(c).some(lyingFlat);
    const standing = c => sketchBodies(c).some(s => !lyingFlat(s));

    // ---------- Fenster-Zustände (lib/targets/handystaender.js) ----------

    const ui = () => (LK.access && LK.access.handystaender) || {};
    const call = (name, fallback) => (typeof ui()[name] === 'function' ? ui()[name]() : fallback);
    const sketchMode = () => call('sketchMode', false);
    const sketchDrawing = () => call('sketchDrawing', false);
    const draftClosed = () => call('draftClosed', false);
    const edgePanel = () => call('edgePanel', false);
    const edgeReady = () => call('edgeReady', false);
    const printCheck = () => call('printCheck', {open: false, result: false, overhangOk: false}) || {};
    const printOk = c => sketchBodies(c).length > 0 && Boolean(printCheck().overhangOk);

    const hasBody = c => sketchBodies(c).length > 0;

    LK.chapters['handystaender'] = {
        id: 'handystaender',
        level: 'profi',
        type: 'sketch',
        icon: '📱',
        title: 'handystaender.title',
        desc: 'handystaender.desc',
        steps: [
            {
                kind: 'info',
                title: k(1, 'title'),
                text: k(1, 'text'),
                labels: [
                    {target: 'sketch:tab', text: k(1, 'l1')},
                    {target: 'toolbar:chamfer', text: k(1, 'l2')},
                    {target: 'toolbar:print-check', text: k(1, 'l3')}
                ]
            },
            {
                kind: 'learn',
                title: k(2, 'title'),
                text: k(2, 'text'),
                tasks: [
                    {text: k(2, 't1'), check: hasBody},
                    {text: k(2, 't2'), check: backrestOk},
                    {text: k(2, 't3'), check: lipOk}
                ],
                hints: [
                    {target: 'sketch:tab', text: k(2, 'h1'), done: c => sketchMode() || hasBody(c)},
                    {target: 'sketch:extrude', text: k(2, 'h2'), done: c => sketchDrawing() || hasBody(c)},
                    {target: 'sketch:plate', text: k(2, 'h3'), done: c => draftClosed() || hasBody(c)},
                    {target: 'sketch:finish', text: k(2, 'h4'), done: hasBody},
                    {target: 'inspector:editSketch', text: k(2, 'h5'), done: profileOk}
                ]
            },
            {
                kind: 'learn',
                title: k(3, 'title'),
                text: k(3, 'text'),
                tasks: [{text: k(3, 't1'), check: wideOk}],
                hints: [
                    {target: 'workplane', text: k(3, 'h1'), done: c => c.panelOpen('inspector') || wideOk(c)},
                    {target: 'inspector:size', text: k(3, 'h2'), done: wideOk}
                ]
            },
            {
                kind: 'learn',
                title: k(4, 'title'),
                text: k(4, 'text'),
                tasks: [{text: k(4, 't1'), check: chamferOk}],
                hints: [
                    {target: 'workplane', text: k(4, 'h1'), done: c => c.selectedCount() > 0 || edgePanel() || chamferOk(c)},
                    {target: 'toolbar:chamfer', text: k(4, 'h2'), done: c => edgePanel() || chamferOk(c)},
                    {target: 'edge:top', text: k(4, 'h3'), done: c => edgeReady() || chamferOk(c)},
                    {target: 'edge:apply', text: k(4, 'h4'), done: chamferOk},
                    {target: 'edge:done', text: k(4, 'h5'), done: c => chamferOk(c) && !edgePanel()}
                ]
            },
            {
                kind: 'game',
                title: k(5, 'title'),
                text: k(5, 'text'),
                tasks: [
                    {text: k(5, 't1'), manual: true},
                    {text: k(5, 't2'), manual: true}
                ],
                hints: [
                    {target: 'inspector:rotationX', text: k(5, 'h1'), done: standing},
                    {target: 'toolbar:layFlat', text: k(5, 'h2'), done: c => !standing(c)}
                ]
            },
            {
                kind: 'learn',
                title: k(6, 'title'),
                text: k(6, 'text'),
                tasks: [
                    {text: k(6, 't1'), check: flatOk},
                    {text: k(6, 't2'), check: printOk}
                ],
                hints: [
                    {target: 'inspector:rotationX', text: k(6, 'h1'), done: flatOk},
                    {target: 'toolbar:print-check', text: k(6, 'h2'), done: c => printCheck().open || printOk(c)},
                    {target: 'printCheck:run', text: k(6, 'h3'), done: c => printCheck().result || printOk(c)},
                    {target: 'printCheck:overhang', text: k(6, 'h4'), done: printOk}
                ]
            },
            {
                kind: 'learn',
                title: k(7, 'title'),
                text: k(7, 'text'),
                tasks: [{text: k(7, 't1'), check: c => c.exported()}],
                hints: [
                    {target: 'export', text: k(7, 'h1'), done: c => c.panelOpen('export') || c.exported()},
                    {target: 'export:download', text: k(7, 'h2'), done: c => c.exported()}
                ]
            },
            {
                kind: 'challenge',
                title: k(8, 'title'),
                text: k(8, 'text'),
                autoHints: false,
                tasks: [{text: k(8, 't1'), manual: true}]
            },
            {
                kind: 'creative',
                title: k(9, 'title'),
                text: k(9, 'text'),
                tasks: [
                    {text: k(9, 't1'), manual: true},
                    {text: k(9, 't2'), manual: true}
                ]
            }
        ]
    };

    // Für Tests: Profil-Auswertung einzeln prüfbar.
    LK.chapters['handystaender'].helpers = {isSketchBody, lines, base, hasBackrest, hasLip, upFactor, lyingFlat, isChamfered};
})(typeof window !== 'undefined' ? window : globalThis);

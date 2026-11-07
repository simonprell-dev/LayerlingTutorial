/*
 * Kapitel „lesezeichen“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/lesezeichen.js,
 * zusätzliche Hinweis-Ziele: lib/targets/lesezeichen.js. Wird in course/course-data.js eingereiht.
 *
 * Gemessen an Layerling 1.150 (Notizen im Abschlussbericht / docs/layerling-interna.md):
 *   Skizzenmodus  Reiter „Skizze“ → „Skizze extrudieren“. Die Komponente SketchWorkspace bekommt die Props
 *                 {profile: {points, segments}, tool, selected, cornerDialog, …}. Die 3D-Formen sind dann
 *                 NICHT lesbar (getShapes() === null).
 *   Skizzenkörper Nach „Skizze abschließen“: kind 'mesh' (nicht 'sketch'!), id 'sketch-extrusion-…',
 *                 sketchOperation 'extrude', sketchProfile = Kopie des Profils, Höhe zuerst 10 mm,
 *                 width/depth = Hüllrechteck des Umrisses.
 *   Rundung       „Ecke verrunden“ ersetzt die Ecke durch zwei Punkte (mode 'split', handleIn/handleOut)
 *                 mit einem Abschnitt kind 'bezier' dazwischen.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    const G = () => LK.geometry;
    const between = (v, min, max) => v >= min && v <= max;
    const kb = (si, field) => `lesezeichen.s${si}.${field}`;

    // ---------- Skizzenmodus lesen ----------
    // c.sketchView() (falls der Kontext es einmal anbietet oder ein Test es setzt), sonst direkt aus
    // dem React-Baum. Liefert {tab: 'sketch'|'geometry'|null, sketch: {profile, tool, selected, cornerDialog}|null};
    // cornerDialog: 'fillet' | 'chamfer' | 'open' (Feld sichtbar, Art unbekannt) | null.

    const NO_VIEW = {tab: null, sketch: null};
    let cache = {at: -1, view: NO_VIEW};

    function fiberRoot (doc) {
        const key = doc && doc.body && Object.keys(doc.body).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactContainer$'));
        let f = key ? doc.body[key] : null;
        while (f && f.return) f = f.return;
        return f;
    }

    function readSketchView () {
        const doc = root.document;
        if (!doc || !doc.querySelector) return NO_VIEW;
        const now = Date.now();
        if (now - cache.at < 200) return cache.view;
        const tabs = [...doc.querySelectorAll('.toolbar-workspace-tabs [role=tab]')];
        const active = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
        const view = {tab: active === 1 ? 'sketch' : (active === 0 ? 'geometry' : null), sketch: null};
        const stage = doc.querySelector('.sketch-workspace-stage');
        let full = false;
        if (stage) {
            const isSketch = p => p && typeof p === 'object' && p.profile && Array.isArray(p.profile.points) && 'tool' in p && 'selected' in p;
            // Schnell: von der Skizzen-Bühne aus nach oben – die Skizzen-Komponente ist ein Vorfahre.
            let props = null;
            const key = Object.keys(stage).find(k => k.startsWith('__reactFiber$'));
            for (let f = key ? stage[key] : null, n = 0; f && n < 200 && !props; f = f.return, n++) {
                if (isSketch(f.memoizedProps)) props = f.memoizedProps;
            }
            // Rückfall: ganzer Baum (teuer, daher länger zwischengespeichert).
            if (!props) {
                full = true;
                const stack = [fiberRoot(doc)].filter(Boolean);
                let visited = 0;
                while (stack.length && visited < 50000 && !props) {
                    const f = stack.pop();
                    visited++;
                    if (isSketch(f.memoizedProps)) props = f.memoizedProps;
                    if (f.sibling) stack.push(f.sibling);
                    if (f.child) stack.push(f.child);
                }
            }
            if (props) {
                // Das Radius-Feld steht auch im DOM (live einmal ohne cornerDialog-Prop gesehen).
                const dialog = props.cornerDialog || (doc.querySelector('.sketch-corner-dialog') ? 'open' : null);
                view.sketch = {profile: props.profile, tool: props.tool, selected: props.selected, cornerDialog: dialog};
            }
        }
        cache = {at: full ? now + 800 : now, view};
        return view;
    }

    const view = c => {
        try {
            return (typeof c.sketchView === 'function' ? c.sketchView() : readSketchView()) || NO_VIEW;
        } catch (e) {
            return NO_VIEW;
        }
    };
    const sketch = c => view(c).sketch;
    const inSketchTab = c => view(c).tab === 'sketch' || Boolean(sketch(c));

    // ---------- Umrisse auswerten (Profil in mm, x/z wie auf der Arbeitsebene) ----------

    // Nur echte Linien, keine Hilfslinien.
    const realSegments = profile => ((profile && profile.segments) || []).filter(s => !s.construction);

    // Punkte, die zu einem geschlossenen Umriss gehören (jeder Punkt hat genau zwei echte Abschnitte).
    function closedPoints (profile) {
        if (!profile || !Array.isArray(profile.points)) return [];
        const segs = realSegments(profile);
        const count = new Map();
        segs.forEach(s => {
            count.set(s.startId, (count.get(s.startId) || 0) + 1);
            count.set(s.endId, (count.get(s.endId) || 0) + 1);
        });
        return profile.points.filter(p => count.get(p.id) === 2);
    }
    const hasOutline = profile => closedPoints(profile).length >= 3;

    function outlineSize (profile) {
        const pts = closedPoints(profile);
        if (pts.length < 3) return null;
        const xs = pts.map(p => p.x);
        const zs = pts.map(p => p.z);
        const w = Math.max(...xs) - Math.min(...xs);
        const d = Math.max(...zs) - Math.min(...zs);
        return {w, d, long: Math.max(w, d), short: Math.min(w, d)};
    }

    // Lesezeichen-Format: lange Seite 90–220 mm, kurze 25–80 mm (Vorschlag 50 × 150).
    const bookmarkSize = z => Boolean(z) && between(z.long, 90, 220) && between(z.short, 25, 80);

    const isCurved = s => (s.kind || 'line') !== 'line';
    const curvedCount = profile => realSegments(profile).filter(isCurved).length;

    // Echte Ecken: Punkte, an denen der Umriss abknickt (ein Punkt mitten auf einer geraden Linie zählt nicht).
    function cornerCount (profile) {
        const pts = new Map(closedPoints(profile).map(p => [p.id, p]));
        const segs = realSegments(profile);
        let n = 0;
        pts.forEach(p => {
            const nb = segs.filter(s => s.startId === p.id || s.endId === p.id)
                .map(s => pts.get(s.startId === p.id ? s.endId : s.startId)).filter(Boolean);
            if (nb.length !== 2) return;
            const ax = nb[0].x - p.x;
            const az = nb[0].z - p.z;
            const bx = nb[1].x - p.x;
            const bz = nb[1].z - p.z;
            const la = Math.hypot(ax, az);
            const lb = Math.hypot(bx, bz);
            if (!la || !lb) return;
            if (Math.abs(ax * bz - az * bx) / (la * lb) > 0.05) n++;
        });
        return n;
    }

    // Eigene Form: mehr als die vier Ecken eines Rechtecks oder eine Kurve (Spitze, Kerbe, Bogen …).
    const ownOutline = profile => hasOutline(profile) && (cornerCount(profile) >= 5 || curvedCount(profile) > 0 || cornerCount(profile) === 3);
    // Gerundete Ecken: „Ecke verrunden“ macht aus jeder Ecke einen Bogen (Abschnitt kind 'bezier').
    const roundedCount = profile => (hasOutline(profile) ? curvedCount(profile) : 0);

    // ---------- Skizzenkörper ----------

    // Aus einer Skizze extrudierter Körper (kind 'mesh' mit sketchProfile; Drehkörper zählen nicht).
    const isSketchBody = s => Boolean(s && !s.hole && s.sketchProfile && Array.isArray(s.sketchProfile.points) &&
        !Array.isArray(s.groupedShapes) && (s.sketchOperation || 'extrude') === 'extrude');
    const bodies = c => c.shapes().filter(isSketchBody);

    // Das Profil, an dem gerade gearbeitet wird: offene Skizze, sonst der zuletzt gebaute Skizzenkörper.
    function profiles (c) {
        const s = sketch(c);
        const list = bodies(c).map(b => b.sketchProfile);
        return s ? [s.profile, ...list] : list;
    }
    const anyProfile = (c, test) => profiles(c).some(p => {
        try {
            return Boolean(test(p));
        } catch (e) {
            return false;
        }
    });

    const outlineDrawn = c => anyProfile(c, hasOutline);
    const outlineSized = c => anyProfile(c, p => bookmarkSize(outlineSize(p))) || bodies(c).some(b => bookmarkSize(c.size(b)));
    const outlineOwn = c => anyProfile(c, ownOutline);
    const outlineRounded = c => anyProfile(c, p => roundedCount(p) >= 2);

    // Dünn genug für ein Lesezeichen (1,5–3 mm).
    const thin = (c, b) => between(c.size(b).h, 1.5, 3.2);
    const bodyMade = c => bodies(c).length > 0;
    const bodyThin = c => bodies(c).some(b => thin(c, b));

    // ---------- Gravur ----------

    // Eigener Text: nicht leer und nicht der Platzhalter „TEXT“.
    const isOwnText = s => s.kind === 'text' && typeof s.text === 'string' && s.text.trim() !== '' && s.text.trim() !== 'TEXT';
    const ownTexts = c => c.shapes('text').filter(isOwnText);
    const textOver = (t, b) => G().overlapXZ(t, b);
    // Der Name liegt ganz auf dem Lesezeichen (1 mm Spielraum). Live gesehen: Der Text kommt quer und
    // 86 mm breit auf ein 50 mm breites Lesezeichen – erst gedreht passt er.
    const textFits = (t, b) => textOver(t, b) && G().insideXZ(t, b, 1);
    const textOnBookmark = c => ownTexts(c).some(t => bodies(c).some(b => textFits(t, b)));
    const textNearBookmark = c => ownTexts(c).some(t => bodies(c).some(b => textOver(t, b)));
    const textTurned = c => ownTexts(c).some(t => bodies(c).some(b => textOver(t, b) && G().sameDirection(t, b)));
    const holeText = c => ownTexts(c).some(t => t.hole && bodies(c).some(b => textOver(t, b)));
    // Eingraviert: Die Unterkante der Text-Aussparung liegt im Lesezeichen (mind. 0,3 mm tief, mind. 0,3 mm
    // Boden bleibt), oben reicht sie mindestens bis an die Oberseite. Live gesehen: Text auf dem Lesezeichen
    // abgelegt hat Unterkante = Oberseite (schneidet nichts); „Z (Höhe)“ 1 bei 2 mm Dicke = 1 mm tief.
    const engravedIn = (t, b) => {
        const T = G().bounds(t);
        const B = G().bounds(b);
        return textOver(t, b) && T.minY >= B.minY + 0.3 && T.minY <= B.maxY - 0.3 && T.maxY >= B.maxY - 0.05;
    };
    const engraved = c => ownTexts(c).some(t => t.hole && bodies(c).some(b => engravedIn(t, b)));
    const engravedGroup = c => c.groups().some(g =>
        g.members.some(t => isOwnText(t) && t.hole && g.members.some(b => isSketchBody(b) && engravedIn(t, b))));

    const textPlaced = c => c.shapes('text').length > 0;

    // ---------- Zustand im Skizzenmodus (für Hinweise) ----------

    // Punkt eingefügt (noch nicht gezogen): fünf Punkte im Umriss.
    const pointAdded = c => anyProfile(c, p => closedPoints(p).length >= 5);
    const usingTool = (c, name) => {
        const s = sketch(c);
        return Boolean(s && s.tool === name);
    };
    const selectedAll = c => {
        const s = sketch(c);
        return Boolean(s && s.selected && s.selected.kind === 'multiple');
    };
    const selectedCorner = c => {
        const s = sketch(c);
        return Boolean(s && s.selected && (s.selected.kind === 'point' || s.selected.kind === 'multiple'));
    };
    const filletOpen = c => {
        const s = sketch(c);
        return Boolean(s && (s.cornerDialog === 'fillet' || s.cornerDialog === 'open'));
    };
    const widthTyped = c => {
        const s = sketch(c);
        const z = s && outlineSize(s.profile);
        return Boolean(z && between(z.w, 25, 80));
    };

    // Liegt ein Ziel unterhalb des Fensters? Live gesehen: Nach 150 mm Länge ragt die untere Kante des
    // Rechtecks aus dem Bild. Ohne Seite (Tests) gilt es als sichtbar.
    const belowScreen = id => {
        try {
            const el = LK.access.findTarget(id);
            return Boolean(el && root.innerHeight && el.getBoundingClientRect().top > root.innerHeight - 40);
        } catch (e) {
            return false;
        }
    };

    // ---------- Kapitel ----------

    LK.chapters['lesezeichen'] = {
        id: 'lesezeichen',
        level: 'etwas',
        type: 'sketch',
        icon: '🔖',
        title: 'lesezeichen.title',
        desc: 'lesezeichen.desc',
        steps: [
            {
                kind: 'info',
                title: kb(1, 'title'),
                text: kb(1, 'text'),
                labels: [
                    {target: 'sketch:tab', text: kb(1, 'l1')},
                    {target: 'workplane', text: kb(1, 'l2')}
                ]
            },
            {
                // Skizze starten und ein Rechteck holen
                kind: 'learn',
                title: kb(2, 'title'),
                text: kb(2, 'text'),
                tasks: [
                    {text: kb(2, 't1'), check: c => Boolean(sketch(c)) || bodyMade(c)},
                    {text: kb(2, 't2'), check: outlineDrawn}
                ],
                hints: [
                    {target: 'sketch:tab', text: kb(2, 'h1'), done: c => inSketchTab(c) || bodyMade(c)},
                    {target: 'sketch:extrude', text: kb(2, 'h2'), done: c => Boolean(sketch(c)) || bodyMade(c)},
                    {target: 'sketch:addShape', text: kb(2, 'h3'), done: c => c.panelOpen('shapes') || outlineDrawn(c)},
                    {target: 'libItem:rectangle', text: kb(2, 'h4'), done: outlineDrawn}
                ]
            },
            {
                // Maße am Auswahlrahmen eintippen
                kind: 'learn',
                title: kb(3, 'title'),
                text: kb(3, 'text'),
                tasks: [{text: kb(3, 't1'), check: outlineSized}],
                hints: [
                    {target: 'sketch:outline', text: kb(3, 'h1'), done: c => outlineSized(c) || selectedAll(c)},
                    {target: 'sketch:width', text: kb(3, 'h2'), done: c => outlineSized(c) || widthTyped(c)},
                    {target: 'sketch:depth', text: kb(3, 'h3'), done: outlineSized}
                ]
            },
            {
                // Eigene Form: Punkt auf die Kante setzen und nach innen ziehen
                kind: 'learn',
                title: kb(4, 'title'),
                text: kb(4, 'text'),
                tasks: [{text: kb(4, 't1'), check: outlineOwn}],
                hints: [
                    {target: 'sketch:zoomOut', text: kb(4, 'h1'), done: c => outlineOwn(c) || pointAdded(c) || !belowScreen('sketch:bottomEdge')},
                    {target: 'sketch:refine', text: kb(4, 'h2'), done: c => outlineOwn(c) || pointAdded(c) || usingTool(c, 'refine')},
                    {target: 'sketch:bottomEdge', text: kb(4, 'h3'), done: c => outlineOwn(c) || pointAdded(c)},
                    {target: 'sketch:select', text: kb(4, 'h4'), done: c => outlineOwn(c) || usingTool(c, 'select')},
                    {target: 'sketch:bottomEdge', text: kb(4, 'h5'), done: outlineOwn}
                ]
            },
            {
                // Ecken verrunden
                kind: 'learn',
                title: kb(5, 'title'),
                text: kb(5, 'text'),
                tasks: [{text: kb(5, 't1'), check: outlineRounded}],
                hints: [
                    {target: 'sketch:select', text: kb(5, 'h1'), done: c => outlineRounded(c) || usingTool(c, 'select')},
                    {target: 'sketch:outline', text: kb(5, 'h2'), done: c => outlineRounded(c) || selectedCorner(c) || filletOpen(c)},
                    {target: 'sketch:fillet', text: kb(5, 'h3'), done: c => outlineRounded(c) || filletOpen(c)},
                    {target: 'sketch:cornerInput', text: kb(5, 'h4'), done: outlineRounded}
                ]
            },
            {
                // Skizze abschließen (= herausziehen) und dünn machen
                kind: 'learn',
                title: kb(6, 'title'),
                text: kb(6, 'text'),
                tasks: [
                    {text: kb(6, 't1'), check: bodyMade},
                    {text: kb(6, 't2'), check: bodyThin}
                ],
                hints: [
                    {target: 'sketch:finish', text: kb(6, 'h1'), done: bodyMade},
                    {target: 'workplane', text: kb(6, 'h2'), done: c => c.panelOpen('inspector') || bodyThin(c)},
                    {target: 'inspector:keepProportions', text: kb(6, 'h3'), done: c => !c.panelOpen('proportionsLocked') || bodyThin(c)},
                    {target: 'inspector:size', text: kb(6, 'h4'), done: bodyThin}
                ]
            },
            {
                // Name als Aussparung ein Stück in die Oberseite senken, dann gruppieren
                kind: 'learn',
                title: kb(7, 'title'),
                text: kb(7, 'text'),
                tasks: [
                    {text: kb(7, 't1'), check: textOnBookmark},
                    {text: kb(7, 't2'), check: holeText},
                    {text: kb(7, 't3'), check: engraved},
                    {text: kb(7, 't4'), check: engravedGroup}
                ],
                hints: [
                    {target: 'addShape', text: kb(7, 'h1'), done: c => c.panelOpen('shapes') || c.placing() || textPlaced(c)},
                    {target: 'libItem:text', text: kb(7, 'h2'), done: c => c.placing('text') || textPlaced(c)},
                    {target: 'workplane', text: kb(7, 'h3'), done: textPlaced},
                    {target: 'inspector:text', text: kb(7, 'h4'), done: c => ownTexts(c).length > 0},
                    {target: 'workplane', text: kb(7, 'h5'), done: c => textOnBookmark(c) || textNearBookmark(c)},
                    {target: 'inspector:rotation', text: kb(7, 'h6'), done: c => textOnBookmark(c) || textTurned(c)},
                    {target: 'inspector:size', text: kb(7, 'h7'), done: textOnBookmark},
                    {target: 'inspector:hole', text: kb(7, 'h8'), done: holeText},
                    {target: 'inspector:positionZ', text: kb(7, 'h9'), done: c => engraved(c) || engravedGroup(c)},
                    {target: 'workplane', text: kb(7, 'h10'), done: c => c.selectedCount() >= 2 || engravedGroup(c)},
                    {target: 'toolbar:group', text: kb(7, 'h11'), done: engravedGroup}
                ]
            },
            {
                kind: 'game',
                title: kb(8, 'title'),
                text: kb(8, 'text'),
                tasks: [
                    {text: kb(8, 't1'), manual: true},
                    {text: kb(8, 't2'), manual: true}
                ],
                hints: [{target: 'viewCube', text: kb(8, 'h1'), done: () => false}]
            },
            {
                kind: 'learn',
                title: kb(9, 'title'),
                text: kb(9, 'text'),
                tasks: [{text: kb(9, 't1'), check: c => c.exported()}],
                hints: [
                    {target: 'export', text: kb(9, 'h1'), done: c => c.panelOpen('export') || c.exported()},
                    {target: 'export:download', text: kb(9, 'h2'), done: c => c.exported()}
                ]
            },
            {
                kind: 'challenge',
                title: kb(10, 'title'),
                text: kb(10, 'text'),
                autoHints: false,
                tasks: [{text: kb(10, 't1'), manual: true}]
            },
            {
                kind: 'creative',
                title: kb(11, 'title'),
                text: kb(11, 'text'),
                tasks: [
                    {text: kb(11, 't1'), manual: true},
                    {text: kb(11, 't2'), manual: true}
                ]
            }
        ]
    };
})(typeof window !== 'undefined' ? window : globalThis);

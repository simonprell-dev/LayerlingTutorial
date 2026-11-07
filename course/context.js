/*
 * Prüf-Kontext c: Das bekommen die check- und done-Funktionen in course-data.js.
 * Wird bei jedem Takt neu aus dem aktuellen Stand gebaut. Kennt die Erweiterung die Formen
 * nicht (shapes === null), liefern alle Abfragen leere Listen bzw. false.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};

    const isGroup = s => Array.isArray(s.groupedShapes);

    function makeContext ({shapes, base, exportCount, panels, editorOpen, selection, placingKind}) {
        const G = LK.geometry;
        const known = Array.isArray(shapes);
        const flat = known ? G.flatten(shapes) : [];
        const parts = flat.filter(e => !isGroup(e.shape));
        const groupIdsOf = new Map(flat.map(e => [e.shape, e.groupIds]));
        const baseIds = new Set((base && base.ids) || []);
        const ofKind = (list, kind) => (kind ? list.filter(s => s.kind === kind) : list);
        const all = parts.map(e => e.shape);

        return {
            shapesKnown: known,
            editorOpen: Boolean(editorOpen),
            base: base || {ids: [], exportCount: 0},
            shapes: kind => ofKind(all, kind),
            solids: kind => ofKind(all.filter(s => !s.hole), kind),
            holes: kind => ofKind(all.filter(s => s.hole), kind),
            newShapes: kind => ofKind(all.filter(s => !baseIds.has(s.id)), kind),
            groups: () => flat.filter(e => isGroup(e.shape)).map(e => ({
                group: e.shape,
                members: flat.filter(x => x.groupIds.includes(e.shape.id) && !isGroup(x.shape)).map(x => x.shape)
            })),
            inGroupWith: (a, b) => {
                const ga = groupIdsOf.get(a) || [];
                const gb = groupIdsOf.get(b) || [];
                return ga.some(id => gb.includes(id));
            },
            size: s => G.sizeOf(s),
            near: (a, b, mm) => G.distance(a, b) <= (mm || 0),
            onTop: (upper, lower, mm) => G.overlapXZ(upper, lower) && G.touchesTop(upper, lower, mm || 0),
            exported: () => (exportCount || 0) > ((base && base.exportCount) || 0),
            panelOpen: name => Boolean(panels && panels.has(name)),
            selectedCount: () => (Array.isArray(selection) ? selection.length : 0),
            placing: kind => Boolean(placingKind) && (!kind || placingKind === kind)
        };
    }

    LK.makeContext = makeContext;
})(typeof window !== 'undefined' ? window : globalThis);

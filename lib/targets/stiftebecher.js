/*
 * Zusätzliche Hinweis-Ziele für Kapitel „stiftebecher“ (sprachunabhängige Selektoren!).
 * Helfer: LK.access.dom = {q, qa, tool, libItem, inspector, inspectorCard, visible}.
 * toolbar:<werkzeug> und libItem:<art> gibt es schon für alle Werkzeuge/Formen (LK.access.TOOLS/KINDS).
 *
 * Live gemessen (Layerling 1.150):
 * - „Körper aushöhlen“: .edge-modifier-panel.shell-panel; Wandstärke = erstes .edge-modifier-slider,
 *   „Offene Seiten“ = .shell-side-options button in der Reihenfolge Oben, Unten, Vorne, Hinten, Links,
 *   Rechts (aria-pressed); „Aushöhlen“ = .edge-modifier-footer .primary.
 * - „Lochmuster“: .edge-modifier-panel.hole-pattern-panel, „Erzeugen“ = .edge-modifier-footer .primary.
 * - „Kanten verrunden“: .edge-modifier-panel ohne Zusatzklasse; Schnellwahl .edge-modifier-quick-actions
 *   (Alle scharfen Kanten, Obere Kanten, Untere Kanten, …); „Radius“ = erstes .edge-modifier-slider;
 *   „Anwenden“ = .edge-modifier-footer .primary. Das Fenster bleibt nach „Anwenden“ offen („Fertig“).
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const {q, tool} = LK.access.dom;

    // Das Fenster „Kanten verrunden“ (nicht Aushöhlen/Lochmuster, nicht Fase).
    const filletPanel = () => {
        const btn = q('[data-layerling-tool="fillet"]');
        if (!btn || !btn.classList.contains('active')) return null;
        return q('.edge-modifier-panel:not(.shell-panel):not(.hole-pattern-panel)');
    };
    const inFillet = sel => {
        const p = filletPanel();
        return p ? p.querySelector(sel) : null;
    };

    Object.assign(LK.access.TARGETS, {
        'toolbar:hollow': () => tool('hollow'),
        'toolbar:holePattern': () => tool('holePattern'),
        'toolbar:fillet': () => tool('fillet'),
        'toolbar:undo': () => tool('undo'),
        'hollow:wall': () => q('.shell-panel .edge-modifier-slider'),
        'hollow:top': () => q('.shell-panel .shell-side-options button'),
        'hollow:apply': () => q('.shell-panel .edge-modifier-footer .primary'),
        'holePattern:apply': () => q('.hole-pattern-panel .edge-modifier-footer .primary'),
        'fillet:top': () => {
            const btns = filletPanel() ? filletPanel().querySelectorAll('.edge-modifier-quick-actions button') : [];
            return btns.length >= 2 ? btns[1] : null;
        },
        'fillet:radius': () => inFillet('.edge-modifier-slider'),
        'fillet:apply': () => inFillet('.edge-modifier-footer .primary')
    });
})(typeof window !== 'undefined' ? window : globalThis);

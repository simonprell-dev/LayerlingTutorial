/*
 * Zusätzliche Hinweis-Ziele für Kapitel „handystaender“ (sprachunabhängige Selektoren!).
 * Helfer: LK.access.dom = {q, qa, tool, libItem, inspector, inspectorCard, visible}.
 * toolbar:<werkzeug> und libItem:<art> gibt es schon für alle Werkzeuge/Formen (LK.access.TOOLS/KINDS).
 *
 * Gemessen an Layerling v1.150.0 (Notizen: docs/layerling-interna.md):
 *   Reiter          .toolbar-workspace-tabs [role=tab] – 1. „3D-Editor“, 2. „Skizze“
 *   Skizze starten  .sketch-start-section .sketch-command-button.primary (1. = „Skizze extrudieren“)
 *   Skizzieren      svg.sketch-plate, Punkte circle[data-sketch-entity=point], Abschluss .sketch-finish-section
 *   Fase            .edge-modifier-quick-actions (Schnellwahl), Fuß .edge-modifier-footer .primary/.secondary
 *   Druck prüfen    .print-check-panel, Zeilen .print-check-row[data-line=overhang] (Klasse ok|warning)
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const {q, qa, tool, inspectorCard} = LK.access.dom;

    const sketchTab = () => qa('.toolbar-workspace-tabs [role=tab]')[1] || null;
    // Ein Knopf, den es nur gibt, solange ein Werkzeug-Fenster offen ist; sonst das Werkzeug selbst.
    const inPanel = (sel, fallbackTool) => q(sel) || tool(fallbackTool);
    // Fase-Fenster (das Fenster „Druck prüfen“ trägt dieselbe Grundklasse edge-modifier-panel)
    const EDGE = '.edge-modifier-panel:not(.print-check-panel)';

    Object.assign(LK.access.TARGETS, {
        // Ausdrücklich eingetragen, weil tests/chapter1.test.mjs nur TARGETS als bekannt zählt.
        'toolbar:chamfer': () => tool('chamfer'),
        'toolbar:print-check': () => tool('print-check'),
        'toolbar:layFlat': () => tool('layFlat'),
        // Reiter „Skizze“ oben neben „3D-Editor“
        'sketchTab': sketchTab,
        // „Skizze extrudieren“ (nur im Reiter Skizze, sonst der Reiter)
        'sketch:extrude': () => q('.sketch-start-section .sketch-command-button.primary') || sketchTab(),
        // Zeichenfläche der Skizze
        'sketch:plate': () => q('svg.sketch-plate'),
        // „Skizze abschließen“
        'sketch:finish': () => q('.sketch-finish-section .sketch-command-button.primary'),
        // „Skizze bearbeiten“ im Eigenschaften-Fenster eines Skizzenkörpers
        'inspector:editSketch': () => q('.edit-sketch-button'),
        // Karte „Drehung“; offen: erstes Feld („Um X“)
        'inspector:rotationX': () => inspectorCard('rotation', box => box.querySelector('.range-property')),
        // Fase-Fenster: Schnellwahl „Obere Kanten“ (2. Knopf; 1. ist „Alle scharfen Kanten“)
        'edge:top': () => {
            const btns = qa('.edge-modifier-quick-actions button');
            return btns.length >= 3 ? btns[1] : tool('chamfer');
        },
        // Fase-Fenster: Feld „Abstand“
        'edge:distance': () => inPanel(`${EDGE} .range-property`, 'chamfer'),
        // Fase-Fenster: „Anwenden“ / „Fertig“
        'edge:apply': () => inPanel(`${EDGE} .edge-modifier-footer .primary`, 'chamfer'),
        'edge:done': () => inPanel(`${EDGE} .edge-modifier-footer .secondary`, 'chamfer'),
        // Druck prüfen: „Prüfen“ / „Neu prüfen“ und die Zeile „Überhänge“
        'printCheck:run': () => inPanel('.print-check-panel .edge-modifier-footer .primary', 'print-check'),
        'printCheck:overhang': () => inPanel('.print-check-row[data-line="overhang"]', 'print-check')
    });

    // Zustände für die Prüfungen dieses Kapitels (nur lesen, sprachunabhängig).
    const draftPoints = () => qa('svg.sketch-plate circle[data-sketch-entity="point"]');
    const draftSegments = () => qa('svg.sketch-plate path[data-sketch-entity="segment"]:not(.construction)');
    LK.access.handystaender = {
        sketchMode: () => Boolean(q('.sketch-toolbar-ribbon')),
        sketchDrawing: () => Boolean(q('.sketch-finish-section')),
        // Geschlossener Umriss im Entwurf: so viele Linien wie Punkte (mindestens 3).
        draftClosed: () => {
            const n = draftPoints().length;
            return n >= 3 && draftSegments().length >= n;
        },
        draftStarted: () => draftPoints().length > 0,
        edgePanel: () => Boolean(q('.edge-modifier-quick-actions')),
        edgeReady: () => {
            const b = q(`${EDGE} .edge-modifier-footer .primary`);
            return Boolean(b && !b.disabled);
        },
        printCheck: () => {
            const panel = q('.print-check-panel');
            if (!panel) return {open: false, result: false, overhangOk: false};
            const row = panel.querySelector('.print-check-row[data-line="overhang"]');
            const stale = Boolean(panel.querySelector('.print-check-list.stale, .clearance-stale'));
            return {open: true, result: Boolean(row) && !stale, overhangOk: Boolean(row) && !stale && row.classList.contains('ok')};
        }
    };
})(typeof window !== 'undefined' ? window : globalThis);

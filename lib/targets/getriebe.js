/*
 * Zusätzliche Hinweis-Ziele für Kapitel „getriebe“ (sprachunabhängige Selektoren!).
 * Helfer: LK.access.dom = {q, qa, tool, libItem, inspector, inspectorCard, visible}.
 * toolbar:<werkzeug> und libItem:<art> gibt es schon für alle Werkzeuge/Formen (LK.access.TOOLS/KINDS).
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const {q, qa, tool, inspectorCard} = LK.access.dom; // eslint-disable-line no-unused-vars
    Object.assign(LK.access.TARGETS, {
    });
})(typeof window !== 'undefined' ? window : globalThis);

/*
 * Liest den Stand von Layerling pro Takt und unterscheidet:
 *   Editor zu        → Formen [] (nichts zu prüfen)
 *   pending          → Editor offen, Formen (noch) nicht lesbar: nicht als leer werten!
 *   unknown          → 12 Takte (3 s) lang nicht lesbar: Layerling-Version unbekannt
 *   ok               → Formen gelesen
 * rebase meldet, wann der Stand „schon vorhanden“ für den Schritt neu festzuhalten ist: beim
 * ersten gelesenen Stand nach Editor-zu/pending/unknown und bei einem anderen Projekt.
 * needsRead() drosselt das teure Suchen im React-Baum, solange die Version unbekannt ist.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const MISSES_UNTIL_UNKNOWN = 12;
    const SLOW_EVERY = 12;

    function makeReader () {
        let misses = 0;
        let wasOk = false;
        let lastProject = null;
        let skip = 0;

        function read ({editorOpen, shapes, projectId}) {
            if (!editorOpen) {
                misses = 0;
                wasOk = false;
                return {editorOpen: false, shapes: [], pending: false, unknown: false, rebase: false};
            }
            if (!Array.isArray(shapes)) {
                misses++;
                wasOk = false;
                const unknown = misses >= MISSES_UNTIL_UNKNOWN;
                return {editorOpen: true, shapes: null, pending: !unknown, unknown, rebase: false};
            }
            misses = 0;
            const rebase = !wasOk || (projectId || null) !== lastProject;
            wasOk = true;
            lastProject = projectId || null;
            return {editorOpen: true, shapes, pending: false, unknown: false, rebase};
        }

        function needsRead () {
            if (misses < MISSES_UNTIL_UNKNOWN) return true;
            skip = (skip + 1) % SLOW_EVERY;
            return skip === 1;
        }

        return {read, needsRead};
    }

    LK.makeReader = makeReader;
})(typeof window !== 'undefined' ? window : globalThis);

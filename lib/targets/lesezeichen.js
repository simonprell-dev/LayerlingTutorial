/*
 * Zusätzliche Hinweis-Ziele für Kapitel „lesezeichen“ (sprachunabhängige Selektoren!).
 * Helfer: LK.access.dom = {q, qa, tool, libItem, inspector, inspectorCard, visible}.
 * toolbar:<werkzeug> und libItem:<art> gibt es schon für alle Werkzeuge/Formen (LK.access.TOOLS/KINDS).
 *
 * Skizzenmodus (gemessen an Layerling 1.150): Die Leiste wird durch .sketch-toolbar-ribbon ersetzt,
 * ihre Knöpfe haben kein data-layerling-tool – deshalb Bereich (data-group) + Reihenfolge.
 * Skizzenformen stehen wie die Bibliothek in .shape-menu-item mit React-Key = Form
 * (rectangle, circle, …); libItem('rectangle') findet sie.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const {q, qa, libItem, inspectorCard} = LK.access.dom;

    // n-ter Knopf eines Bereichs der Skizzenleiste (data-group: draw, shapes, select, finish, create).
    const sketchButton = (group, n) => qa(`.sketch-toolbar-ribbon .toolbar-section[data-group="${group}"] button`)[n] || null;

    // Untere Kante des Umrisses (Linie mit dem größten y auf dem Bildschirm).
    function sketchBottomEdge () {
        const segs = qa('.sketch-segments path:not(.construction)');
        if (!segs.length) return null;
        const bottom = el => el.getBoundingClientRect().bottom;
        const flat = segs.filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > r.height;
        });
        const list = flat.length ? flat : segs;
        return list.reduce((best, el) => (bottom(el) > bottom(best) ? el : best));
    }

    Object.assign(LK.access.TARGETS, {
        // Reiter „Skizze“ neben „3D-Editor“ (zweiter Reiter).
        'sketch:tab': () => qa('.toolbar-workspace-tabs [role=tab]')[1] || null,
        // „Skizze extrudieren“ (erster Knopf im Bereich „Erstellen“).
        'sketch:extrude': () => sketchButton('create', 0),
        // „Skizzenform hinzufügen“
        'sketch:addShape': () => q('.sketch-shapes-section .shape-menu-trigger'),
        // „Rechteck“ im Skizzenformen-Menü (React-Key = Form; ausdrücklich eingetragen, weil
        // tests/chapter1.test.mjs nur Einträge in TARGETS als bekannt zählt)
        'libItem:rectangle': () => libItem('rectangle'),
        // Bereich „Auswahl“: Auswählen · Bild · Punkte setzen oder entfernen · Ecke fasen · Ecke verrunden · Radieren
        'sketch:select': () => sketchButton('select', 0),
        'sketch:refine': () => sketchButton('select', 2),
        'sketch:fillet': () => sketchButton('select', 4),
        // Radius-Feld nach „Ecke verrunden“
        'sketch:cornerInput': () => q('.sketch-corner-dialog'),
        // Fläche des Umrisses (Klick hinein wählt die ganze Form)
        'sketch:outline': () => q('.sketch-profile-fills path') || q('.sketch-plate'),
        // Maße am Auswahlrahmen: erst Breite (oben), dann Länge (rechts)
        'sketch:width': () => qa('.sketch-geometry-dimension.clickable')[0] || null,
        'sketch:depth': () => qa('.sketch-geometry-dimension.clickable')[1] || null,
        'sketch:bottomEdge': sketchBottomEdge,
        // „Herauszoomen“ in der Ansichtssteuerung der Skizze (Tastenkürzel „-“)
        'sketch:zoomOut': () => q('.sketch-workspace-stage button[aria-keyshortcuts="-"]') || q('button[aria-keyshortcuts="-"]'),
        // „Skizze abschließen“
        'sketch:finish': () => q('.sketch-finish-section .sketch-command-button.primary'),
        // Karte „Position“, Feld „Z (Höhe)“ = Unterkante
        'inspector:positionZ': () => inspectorCard('position', box => {
            const rows = box.querySelectorAll('.range-property');
            return rows.length ? rows[rows.length - 1] : null;
        })
    });
})(typeof window !== 'undefined' ? window : globalThis);

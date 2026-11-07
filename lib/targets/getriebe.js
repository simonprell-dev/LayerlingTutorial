/*
 * Zusätzliche Hinweis-Ziele für Kapitel „getriebe“ (sprachunabhängige Selektoren!).
 * Helfer: LK.access.dom = {q, qa, tool, libItem, inspector, inspectorCard, visible}.
 * toolbar:<werkzeug> und libItem:<art> gibt es schon für alle Werkzeuge/Formen (LK.access.TOOLS/KINDS).
 *
 * Gemessen an Layerling 1.150:
 *   Karte „Verzahnung“ = .property-card-header[aria-controls^="gear-teeth-"], darin
 *     .select-property (Zahnform) und .range-property: Zähne, Modul (mm), Eingriffswinkel, Spiel.
 *   Karte „Position“ = aria-controls^="position-": X, Y, Z (Höhe).
 *   Zwei Zahnräder ausgewählt: p.selection-gear-pair (Achsabstand) und button.selection-gear-fit
 *     („Modul beider anpassen“, danach je Rad „… behalten, das andere anpassen“).
 *   Rechtsklick-Menü .shape-context-menu: Eintrag mit React-Key „ontoPlate“ („Auf Platte …“),
 *     danach Einträge „plate-<n>“ und „plate-new“ („Auf eine neue Platte“).
 *   Plattenleiste .plate-bar: .plate-bar-chip (je Platte), .plate-bar-icon-Knöpfe, .plate-bar-text
 *     („Auf Platten verteilen“ – in 1.150 wirft der Knopf „e is not iterable“, daher nicht genutzt).
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const {q, qa, tool, libItem, inspectorCard, visible} = LK.access.dom;

    const fiberKey = el => {
        const key = el && Object.keys(el).find(k => k.startsWith('__reactFiber$'));
        const f = key ? el[key] : null;
        return f ? (f.key || (f.return && f.return.key) || null) : null;
    };
    const rows = box => box.querySelectorAll('.range-property');
    const workplane = () => q('.editor-stage canvas') || q('.editor-stage');

    Object.assign(LK.access.TARGETS, {
        'toolbar:buildPlates': () => tool('buildPlates'),
        'libItem:gear': () => libItem('gear'),
        // Karte „Verzahnung“: Zahnform, Zähne, Modul
        'inspector:gearProfile': () => inspectorCard('gear-teeth', box => box.querySelector('.select-property')),
        'inspector:teeth': () => inspectorCard('gear-teeth', box => rows(box)[0] || null),
        'inspector:module': () => inspectorCard('gear-teeth', box => rows(box)[1] || null),
        // Karte „Position“: X/Y-Felder
        'inspector:position': () => inspectorCard('position', box => {
            const first = box.querySelector('.range-property');
            return first ? first.parentElement : null;
        }),
        // Zwei Räder ausgewählt: Knopf „… behalten, das andere anpassen“ (sonst die Achsabstand-Zeile)
        'gearPair:keep': () => {
            const buttons = qa('.selection-gear-fit');
            return buttons.length ? buttons[buttons.length - 1] : q('.selection-gear-pair');
        },
        // „Auf Platte …“ im Rechtsklick-Menü, dann „Auf eine neue Platte“; ohne Menü: die Arbeitsfläche
        'plates:moveTo': () => {
            const items = qa('.shape-context-menu button').filter(visible);
            if (!items.length) return workplane();
            return items.find(b => fiberKey(b) === 'plate-new') || items.find(b => fiberKey(b) === 'ontoPlate') || null;
        },
        'plates:bar': () => q('.plate-bar-chips') || tool('buildPlates'),
        // „Alle Platten zeigen“: der Knopf vor „Auf Platten verteilen“
        'plates:showAll': () => {
            const arrange = q('.plate-bar-text');
            const prev = arrange && arrange.previousElementSibling;
            return prev && prev.classList.contains('plate-bar-icon') ? prev : tool('buildPlates');
        }
    });
})(typeof window !== 'undefined' ? window : globalThis);

/*
 * Einziger Ort für Zugriffe auf Layerling-Interna (gemessen an Layerling v1.150.0, Notizen in
 * docs/layerling-interna.md). Nur lesen, nie schreiben.
 *
 * Formen:  React-Fiber der Seite. Weg 1: eine Komponente bekommt die Props
 *          {shapes, selectedIds, …} (Prop-Namen überleben das Minifizieren).
 *          Weg 2 (Rückfall): ein useState-Hook, der eine Formenliste hält; die Stelle wird
 *          gemerkt, damit auch eine leere Liste danach erkannt wird.
 * Ziele:   Bedienelemente für die Zeige-Hand. Sprachunabhängig über Klassen,
 *          data-layerling-tool, React-Keys der Bibliothek (= Formart) und Tastenkürzel im title.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const doc = root.document;

    // ---------- Formen ----------

    function isShapeArray (v) {
        return Array.isArray(v) && v.length > 0 && v.every(s => s && typeof s === 'object' &&
            typeof s.id === 'string' && typeof s.kind === 'string' &&
            typeof s.width === 'number' && typeof s.depth === 'number' && typeof s.height === 'number');
    }

    const isHookChain = ms => ms && typeof ms === 'object' && 'next' in ms && 'memoizedState' in ms;
    let rememberedHook = null; // {type, index}
    let selection = [];
    let placingKind = null;

    function findShapesInFiber (rootFiber) {
        if (!rootFiber) return null;
        let hookHit = null;
        const stack = rootFiber.child ? [rootFiber.child] : [];
        let visited = 0;
        while (stack.length && visited < 50000) {
            const f = stack.pop();
            visited++;
            const p = f.memoizedProps;
            if (p && typeof p === 'object' && Array.isArray(p.shapes) && 'selectedIds' in p) {
                selection = Array.isArray(p.selectedIds) ? p.selectedIds : [];
                // cruiseAsset: Form, die gerade an der Maus hängt und abgelegt werden will.
                placingKind = p.cruiseAsset && typeof p.cruiseAsset.kind === 'string' ? p.cruiseAsset.kind : null;
                return p.shapes;
            }
            if (!hookHit && isHookChain(f.memoizedState)) {
                const type = f.type || 'anon';
                let h = f.memoizedState;
                for (let i = 0; h && i < 400; i++, h = h.next) {
                    const v = h.memoizedState;
                    const atRemembered = rememberedHook && rememberedHook.type === type && rememberedHook.index === i;
                    if (isShapeArray(v) || (atRemembered && Array.isArray(v))) {
                        hookHit = v;
                        rememberedHook = {type, index: i};
                        break;
                    }
                }
            }
            if (f.sibling) stack.push(f.sibling);
            if (f.child) stack.push(f.child);
        }
        return hookHit;
    }

    function fiberOf (el) {
        if (!el) return null;
        const key = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactContainer$'));
        return key ? el[key] : null;
    }

    function rootFiber () {
        let f = doc && fiberOf(doc.body);
        if (!f) return null;
        while (f.return) f = f.return;
        return f;
    }

    function getShapes () {
        try {
            return findShapesInFiber(rootFiber());
        } catch (e) {
            return null;
        }
    }

    const lastSelection = () => selection;
    const lastPlacingKind = () => placingKind;

    // ---------- Seite ----------

    function getLanguage () {
        try {
            const stored = root.localStorage.getItem('layerling.language');
            if (stored) return stored;
        } catch (e) { /* egal */ }
        return (doc && doc.documentElement && doc.documentElement.lang) || null;
    }

    function isEditorOpen () {
        if (!doc) return false;
        return /[?&]editor=1\b/.test(root.location ? root.location.search : '') ||
            Boolean(doc.querySelector('.editor-stage'));
    }

    // Export zählen: Klick auf „… exportieren“ im Export-Fenster.
    let exports = 0;
    if (doc && doc.addEventListener) {
        doc.addEventListener('click', e => {
            const t = e.target && e.target.closest && e.target.closest('.export-primary-button');
            if (t) exports++;
        }, true);
    }
    const exportCount = () => exports;

    function openPanels () {
        const set = new Set();
        if (!doc) return set;
        if (doc.querySelector('.export-action-panel')) set.add('export');
        if (visible(doc.querySelector('.shape-menu-item'))) set.add('shapes');
        if (doc.querySelector('.shape-inspector-header')) set.add('inspector');
        const props = q('.property-card-header[aria-controls^="properties-"]');
        const lock = props && props.parentElement.querySelector('.check-property input[type=checkbox]');
        if (lock && lock.checked) set.add('proportionsLocked');
        return set;
    }

    // ---------- Ziele für die Zeige-Hand ----------

    function visible (el) {
        return Boolean(el && el.getClientRects && el.getClientRects().length > 0);
    }

    const q = sel => (doc ? doc.querySelector(sel) : null);
    const qa = sel => (doc ? [...doc.querySelectorAll(sel)] : []);

    // Werkzeug in der Leiste; ist sein Bereich eingeklappt, zeigt die Hand auf den Bereichs-Knopf.
    function tool (name) {
        const btn = q(`[data-layerling-tool="${name}"]`);
        if (!btn || visible(btn)) return btn;
        const section = btn.closest('.toolbar-section');
        return (section && section.querySelector('.toolbar-collapse-trigger')) || null;
    }

    // Eintrag in der Formenbibliothek über seinen React-Key (= Formart, z. B. „box“).
    function libItem (kind) {
        const items = qa('.shape-menu-item');
        if (!items.length || !visible(items[0])) return q('.shape-menu-trigger');
        const item = items.find(el => {
            const f = fiberOf(el);
            return f && (f.key === kind || (f.return && f.return.key === kind));
        });
        if (!item) return null;
        if (visible(item)) return item;
        const section = item.closest('.shape-library-section');
        return (section && section.querySelector('.shape-library-toggle')) || item;
    }

    function inspector () {
        const header = q('.shape-inspector-header');
        return header ? header.parentElement || header : null;
    }

    function inspectorPart (fn) {
        const box = inspector();
        return box ? fn(box) : null;
    }

    // Karte im Eigenschaften-Fenster über aria-controls="<name>-<formId>" (sprachunabhängig).
    // Ist sie eingeklappt, zeigt die Hand auf ihren Kopf.
    function inspectorCard (name, inner) {
        const header = q(`.property-card-header[aria-controls^="${name}-"]`);
        if (!header) return inspectorPart(inner);
        const card = header.parentElement;
        if (card.classList.contains('collapsed')) return header;
        return inner(card) || header;
    }

    function exportButton () {
        return qa('button.action-icon-button').find(b => /Ctrl\+E/i.test(b.getAttribute('title') || '')) || null;
    }

    const TARGETS = {
        'newDesign': () => q('.dashboard-action-tile.create'),
        'addShape': () => q('.shape-menu-trigger'),
        'libItem:box': () => libItem('box'),
        'libItem:text': () => libItem('text'),
        'libItem:cylinder': () => libItem('cylinder'),
        'libItem:nameTag': () => libItem('nameTag'),
        'inspector': () => inspector(),
        'inspector:size': () => inspectorCard('properties', box => {
            const first = box.querySelector('.range-property');
            return first ? first.parentElement : null;
        }),
        'inspector:text': () => inspectorCard('properties', box => [...box.querySelectorAll('input[type=text], textarea')]
            .find(i => !i.classList.contains('inspector-name-input') && !i.closest('.range-property')) || null),
        // „Proportionen beibehalten“: erstes Ankreuzfeld in der Eigenschaften-Karte.
        'inspector:keepProportions': () => inspectorCard('properties', box => box.querySelector('.check-property')),
        'inspector:hole': () => q('.hole-choice'),
        'inspector:solid': () => q('.solid-choice'),
        'toolbar:group': () => tool('group'),
        'toolbar:drop': () => tool('drop'),
        'export': () => exportButton(),
        'export:stl': () => {
            const panel = q('.export-action-panel');
            if (!panel) return exportButton();
            return [...panel.querySelectorAll('button')].find(b => b.textContent.trim() === 'STL') || null;
        },
        'export:download': () => q('.export-primary-button'),
        'viewCube': () => {
            const face = q('.cube-face');
            return face ? face.parentElement : null;
        },
        'workplane': () => q('.editor-stage canvas') || q('.editor-stage')
    };

    function findTarget (id) {
        try {
            if (TARGETS[id]) return TARGETS[id]();
            if (id.startsWith('libItem:')) return libItem(id.slice(8));
            if (id.startsWith('toolbar:')) return tool(id.slice(8));
        } catch (e) { /* Ziel nicht auffindbar */ }
        return null;
    }

    function health () {
        return {
            shapes: getShapes() !== null,
            targets: Object.keys(TARGETS).filter(id => !findTarget(id))
        };
    }

    LK.access = {
        isShapeArray, findShapesInFiber, getShapes, lastSelection, lastPlacingKind, getLanguage, isEditorOpen,
        exportCount, openPanels, TARGETS, findTarget, visible, health
    };
})(typeof window !== 'undefined' ? window : globalThis);

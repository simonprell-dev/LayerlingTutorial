/*
 * Zusätzliche Hinweis-Ziele für Kapitel „schraubdose“ (sprachunabhängige Selektoren!).
 * Helfer: LK.access.dom = {q, qa, tool, libItem, inspector, inspectorCard, visible}.
 * toolbar:<werkzeug> und libItem:<art> gibt es schon für alle Werkzeuge/Formen (LK.access.TOOLS/KINDS).
 *
 * Dazu LK.schraubdose: liest die Werkzeugfenster „Aushöhlen“, „Deckel“ und „Spiel prüfen“ (Props der
 * React-Komponenten, Prop-Namen überleben das Minifizieren). Gemessen an Layerling v1.150.0:
 *   ShellPanel     .shell-panel mit .shell-side-options     {thickness, openings, onApply, …}
 *   LidPanel       .lid-panel                               {settings: {type, gap, threadPitch, threadTurns, wall, …}, busy, error, onApply}
 *   ClearancePanel .clearance-panel                         {result: {tooFew, overlaps, touching, tight, fine, parts}, stale, running, onCheck}
 * Ohne Seite (Tests) liefern alle Leser null.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const {q, tool} = LK.access.dom;

    const fiberOf = el => {
        const key = el && Object.keys(el).find(k => k.startsWith('__reactFiber$'));
        return key ? el[key] : null;
    };

    // Props der ersten Komponente über el, die alle genannten Props hat.
    function propsAbove (el, names) {
        let f = fiberOf(el);
        for (let d = 0; f && d < 15; d++, f = f.return) {
            const p = f.memoizedProps;
            if (p && typeof p === 'object' && names.every(n => n in p)) return p;
        }
        return null;
    }

    const shellPanelEl = () => {
        const opts = q('.shell-side-options');
        return opts ? opts.closest('.shell-panel') : null;
    };
    const lidPanelEl = () => q('.lid-panel');
    const clearancePanelEl = () => q('.clearance-panel');

    const safe = fn => {
        try {
            return fn();
        } catch (e) {
            return null;
        }
    };

    // Knopf in einem Fenster über seinen React-Key (z. B. Deckelart „screw“, Passung „0.2“, Seite „top“).
    const keyed = (panel, sel, key) => {
        if (!panel) return null;
        return [...panel.querySelectorAll(sel)].find(b => {
            const f = fiberOf(b);
            return f && f.key === key;
        }) || null;
    };
    const primary = panel => (panel ? panel.querySelector('.edge-modifier-footer .primary') : null);
    const alignDot = axis => q(`.align-dot.axis-${axis}.target-center`) || tool('align');

    LK.schraubdose = {
        // {thickness, openings} oder null
        shellPanel: () => safe(() => {
            const p = propsAbove(shellPanelEl(), ['thickness', 'openings', 'onApply']);
            return p ? {thickness: p.thickness, openings: p.openings} : null;
        }),
        // {settings, busy, error} oder null
        lidPanel: () => safe(() => {
            const p = propsAbove(lidPanelEl(), ['settings', 'onApply']);
            return p && p.settings ? {settings: p.settings, busy: Boolean(p.busy), error: p.error || null} : null;
        }),
        // {result, stale, running} oder null; result ist null, solange nicht geprüft wurde
        clearancePanel: () => safe(() => {
            const p = propsAbove(clearancePanelEl(), ['result', 'onCheck']);
            if (!p) return null;
            const r = p.result;
            return {
                stale: Boolean(p.stale),
                running: Boolean(p.running),
                result: r ? {
                    tooFew: Boolean(r.tooFew),
                    overlaps: (r.overlaps || []).length,
                    touching: (r.touching || []).length,
                    tight: (r.tight || []).length,
                    parts: (r.parts || []).length
                } : null
            };
        })
    };

    Object.assign(LK.access.TARGETS, {
        // Werkzeuge ausdrücklich eintragen (findTarget fände sie auch so; die Kurstests prüfen aber TARGETS).
        'toolbar:hollow': () => tool('hollow'),
        'toolbar:lid': () => tool('lid'),
        'toolbar:align': () => tool('align'),
        'toolbar:clearance-check': () => tool('clearance-check'),
        // Aushöhlen: Seite „Oben“, Wandstärke, „Aushöhlen“
        'schraubdose:shellTop': () => keyed(shellPanelEl(), '.shell-side-options button', 'top') || tool('hollow'),
        'schraubdose:shellWall': () => {
            const panel = shellPanelEl();
            return panel ? panel.querySelector('.range-property') : tool('hollow');
        },
        'schraubdose:shellApply': () => primary(shellPanelEl()) || tool('hollow'),
        // Deckel: Art „Aufgeschraubt“, Passung „Normal 0,2“, „Deckel machen“
        'schraubdose:lidScrew': () => keyed(lidPanelEl(), 'button[role=radio]', 'screw') || tool('lid'),
        'schraubdose:lidFit': () => {
            const panel = lidPanelEl();
            if (!panel) return tool('lid');
            return keyed(panel, 'button[role=radio]', '0.2') || panel.querySelector('.range-property');
        },
        'schraubdose:lidApply': () => primary(lidPanelEl()) || tool('lid'),
        // Maßband und Schnittansicht in der Ansichtsleiste links
        'schraubdose:tape': () => q('.tape-trigger'),
        'schraubdose:section': () => q('.section-trigger'),
        // Ausrichten: Punkt „mittig“ quer zur Reihe (axis-z: gleiche Tiefe, axis-x: gleiche Breite);
        // ist das Ausrichten nicht an, zeigt die Hand auf das Werkzeug.
        'schraubdose:alignCenterZ': () => alignDot('z'),
        'schraubdose:alignCenterX': () => alignDot('x'),
        // Spiel prüfen: „Prüfen“ / „Neu prüfen“
        'schraubdose:clearanceRun': () => primary(clearancePanelEl()) || tool('clearance-check')
    });
})(typeof window !== 'undefined' ? window : globalThis);

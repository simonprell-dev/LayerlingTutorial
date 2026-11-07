/*
 * Hauptschleife des Kurses: liest alle 250 ms den Stand von Layerling, prüft die Aufgaben,
 * zeigt Hinweise und zeichnet das Kursfenster. Logik in flow.js/context.js, Zugriff auf
 * Layerling in lib/layerling-access.js, Anzeige in panel.js/overlay.js.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    if (LK.started) return;
    LK.started = true;

    const doc = root.document;
    const {access, flow, i18n, overlay, panel, progress} = LK;
    const t = (k, v) => i18n.t(k, v);
    const chapters = LK.course.chapters;
    const TICK_MS = 250;
    const MISSES_UNTIL_UNKNOWN = 12; // 3 s ohne Formen im Editor → Layerling-Version unbekannt

    let state = progress.load(root.localStorage);
    let view = 'step'; // step | overview | done
    let modalOpen = false;
    let manualHint = false;
    let base = {ids: [], exportCount: 0};
    let misses = 0;
    let lastLang = '';
    let wasComplete = false;
    let stepKey = '';

    const save = () => progress.save(root.localStorage, state);

    // ---------- Kapitel und Schritte ----------

    const isReady = ci => Boolean(chapters[ci] && !chapters[ci].comingSoon && chapters[ci].steps.length);
    const nextReady = ci => chapters.findIndex((c, i) => i > ci && isReady(i));
    const prevReady = ci => {
        for (let i = ci - 1; i >= 0; i--) if (isReady(i)) return i;
        return -1;
    };

    const transitionStep = {
        kind: 'save',
        title: 'transition.title',
        text: 'transition.text',
        tasks: [
            {text: 'transition.task.export', manual: true},
            {text: 'transition.task.newDesign', check: c => c.editorOpen && c.shapes().length === 0}
        ]
    };

    function chapter () {
        if (!isReady(state.chapter)) state.chapter = Math.max(0, chapters.findIndex((c, i) => isReady(i)));
        return chapters[state.chapter];
    }

    function currentStep () {
        const ch = chapter();
        if (state.step === -1) return transitionStep;
        if (state.step >= ch.steps.length) state.step = ch.steps.length - 1;
        return ch.steps[Math.max(0, state.step)];
    }

    function doneList () {
        const ch = chapter();
        const byStep = state.done[ch.id] || {};
        return byStep[state.step === -1 ? 't' : state.step] || [];
    }

    function setDone (list) {
        const ch = chapter();
        state.done[ch.id] = state.done[ch.id] || {};
        state.done[ch.id][state.step === -1 ? 't' : state.step] = list;
    }

    // ---------- Stand von Layerling ----------

    function readShapes () {
        const editorOpen = access.isEditorOpen();
        if (!editorOpen) {
            misses = 0;
            return {editorOpen, shapes: [], unknown: false};
        }
        const shapes = access.getShapes();
        misses = shapes === null ? misses + 1 : 0;
        const unknown = misses >= MISSES_UNTIL_UNKNOWN;
        return {editorOpen, shapes: unknown ? null : (shapes || []), unknown};
    }

    function enterStep () {
        const {shapes} = readShapes();
        base = {
            ids: LK.geometry.flatten(shapes || []).map(e => e.shape.id),
            exportCount: access.exportCount()
        };
        manualHint = false;
        wasComplete = flow.evaluate(currentStep(), {shapesKnown: false}, doneList()).complete;
        overlay.clear();
    }

    function context (read) {
        return LK.makeContext({
            shapes: read.shapes,
            base,
            exportCount: access.exportCount(),
            panels: access.openPanels(),
            editorOpen: read.editorOpen,
            selection: access.lastSelection(),
            placingKind: access.lastPlacingKind()
        });
    }

    // ---------- Aktionen ----------

    function go (ci, si) {
        state.chapter = ci;
        state.step = si;
        view = 'step';
        save();
        enterStep();
    }

    function next () {
        if (view !== 'step') {
            view = 'step';
            return;
        }
        const ch = chapter();
        if (state.step < ch.steps.length - 1) return go(state.chapter, state.step + 1);
        if (!state.finished.includes(ch.id)) state.finished.push(ch.id);
        const n = nextReady(state.chapter);
        if (n >= 0) return go(n, -1);
        view = 'done';
        save();
        overlay.clear();
        overlay.confetti(panel.element());
    }

    function back () {
        if (state.step > 0) return go(state.chapter, state.step - 1);
        const p = prevReady(state.chapter);
        if (state.step === 0 && p < 0) return undefined;
        if (state.step === 0 && nextReady(p) === state.chapter) return go(state.chapter, -1);
        if (p >= 0) return go(p, chapters[p].steps.length - 1);
        return undefined;
    }

    const actions = {
        launcher () {
            if (!state.level) modalOpen = true;
            else {
                state.open = true;
                save();
                enterStep();
            }
        },
        chooseLevel (id) {
            state.level = id;
            state.open = true;
            modalOpen = false;
            go(flow.startChapter(chapters, id), 0);
        },
        chooseLevelDialog () {
            modalOpen = true;
        },
        closeModal () {
            modalOpen = false;
        },
        close () {
            state.open = false;
            save();
            overlay.clear();
        },
        overview () {
            view = view === 'overview' ? 'step' : 'overview';
            overlay.clear();
        },
        toggleHints () {
            state.hintsOff = !state.hintsOff;
            manualHint = false;
            save();
            overlay.clear();
        },
        showHint () {
            manualHint = true;
        },
        toggleTask (i) {
            const step = currentStep();
            const task = step.tasks && step.tasks[i];
            if (!task || !flow.isManual(task, context(readShapes()))) return;
            setDone(flow.toggleManual(doneList(), i));
            save();
        },
        openChapter (ci) {
            if (isReady(ci)) go(ci, 0);
        },
        next,
        back,
        moved (pos) {
            state.panelPos = pos;
            save();
        }
    };

    panel.onAction((name, arg) => {
        if (actions[name]) actions[name](arg);
        tick();
    });

    // ---------- Anzeige ----------

    function isDark () {
        const target = doc.querySelector('.editor-stage') || doc.body;
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(doc.body).backgroundColor || '') ||
            /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(target).backgroundColor || '');
        if (!m) return false;
        return (0.299 * m[1] + 0.587 * m[2] + 0.114 * m[3]) < 110;
    }

    function stepVm (step, c, res, read) {
        const ch = chapter();
        const tasks = (step.tasks || []).map((task, i) => ({
            text: t(task.text),
            done: res.done.includes(i),
            manual: flow.isManual(task, c)
        }));
        const auto = flow.showHintsAuto(state.level, ch, step, state.hintsOff);
        return {
            kind: step.kind,
            kindLabel: t(`kind.${step.kind}`),
            title: t(step.title),
            html: t(step.text),
            tasksTitle: t('panel.tasks'),
            tasks,
            manualHint: t('panel.manualHint'),
            warning: read.unknown ? t('access.unknownVersion') : (!read.editorOpen && state.step > 1 ? t('panel.openEditor') : ''),
            showHintBtn: Boolean(step.hints && step.hints.length && !auto && step.kind !== 'info'),
            hintBtnText: t('panel.showHint'),
            complete: res.complete && tasks.length > 0,
            completeText: t('panel.stepDone')
        };
    }

    function overviewVm () {
        return {
            title: t('panel.overview'),
            chapters: chapters.map((c, i) => ({
                index: i,
                icon: c.icon,
                title: t(c.title),
                desc: t(c.desc),
                levelText: t(`level.${c.level}`),
                soon: !isReady(i),
                soonText: t('level.comingSoon'),
                current: i === state.chapter,
                done: state.finished.includes(c.id)
            })),
            levelBtnText: t('panel.chooseLevel'),
            note: t('panel.independent')
        };
    }

    function pipsVm (res) {
        const ch = chapter();
        return ch.steps.map((s, si) => {
            const stored = (state.done[ch.id] || {})[si] || [];
            const total = (s.tasks || []).length;
            return {done: si < state.step || (total > 0 && stored.length === total) || (si === state.step && res.complete && total > 0), active: si === state.step};
        });
    }

    function buildVm (read, step, c, res) {
        const ch = chapter();
        const vm = {
            dark: isDark(),
            launcher: {show: !state.open && !modalOpen, text: t('panel.launcher')},
            modal: modalOpen ? {
                brand: t('common.courseName'),
                title: t('level.title'),
                intro: t('level.intro'),
                levels: [['neu', '🌱'], ['etwas', '🔧'], ['profi', '🚀']].map(([id, icon]) => ({id, icon, title: t(`level.${id}`), desc: t(`level.${id}.desc`)})),
                note: t('panel.independent'),
                closeText: t('common.close')
            } : null,
            panel: null
        };
        if (!state.open || modalOpen) return vm;
        vm.panel = {
            pos: state.panelPos,
            icon: ch.icon,
            header: t(ch.title),
            sub: state.step === -1 ? t('transition.title') : t('panel.step', {n: state.step + 1, total: ch.steps.length}),
            hintsOff: state.hintsOff,
            hintsToggleText: state.hintsOff ? t('panel.hintsOn') : t('panel.hintsOff'),
            overviewText: t('panel.overview'),
            closeText: t('common.close'),
            independent: t('panel.independent'),
            pips: view === 'step' && state.step >= 0 ? pipsVm(res) : [],
            view
        };
        if (view === 'overview') vm.panel.overview = overviewVm();
        else if (view === 'done') {
            vm.panel.done = {title: t('panel.chapterDone'), html: `<p>${t('panel.chapterDoneText', {title: t(ch.title)})}</p><p>${t('panel.courseDone')}</p>`};
        } else {
            vm.panel.step = stepVm(step, c, res, read);
            const last = state.step === ch.steps.length - 1 && nextReady(state.chapter) < 0;
            vm.panel.footer = {
                back: state.step > 0 || prevReady(state.chapter) >= 0 || state.step === -1,
                backText: t('common.back'),
                next: true,
                nextText: last ? t('common.done') : (step.kind === 'info' ? t('common.start') : t('common.next')),
                nextHighlight: res.complete
            };
        }
        return vm;
    }

    function drawHints (step, c) {
        if (!state.open || modalOpen || view !== 'step') return overlay.clear();
        if (step.labels && step.labels.length) {
            return overlay.labels(step.labels.map(l => ({el: access.findTarget(l.target), text: t(l.text)})));
        }
        const auto = flow.showHintsAuto(state.level, chapter(), step, state.hintsOff);
        if (!auto && !manualHint) return overlay.clear();
        const hint = flow.pickHint(step, c);
        if (!hint) return overlay.clear();
        return overlay.point(access.findTarget(hint.target), t(hint.text));
    }

    // ---------- Takt ----------

    function tick () {
        try {
            const lang = i18n.pick(access.getLanguage());
            if (lang !== lastLang) {
                i18n.setLanguage(lang);
                lastLang = lang;
            }
            const read = readShapes();
            const step = currentStep();
            const key = `${state.chapter}|${state.step}`;
            if (key !== stepKey) {
                stepKey = key;
                enterStep();
            }
            const c = context(read);
            let res = {done: doneList(), complete: false};
            if (state.open && view === 'step') {
                res = flow.evaluate(step, c, doneList());
                if (res.done.join() !== doneList().join()) {
                    setDone(res.done);
                    save();
                }
                if (res.complete && !wasComplete && (step.tasks || []).length) overlay.confetti(panel.element());
                wasComplete = res.complete;
            }
            panel.render(buildVm(read, step, c, res));
            drawHints(step, c);
        } catch (e) {
            if (!LK.lastError || LK.lastError.message !== e.message) console.warn('[Layerling-Kurs]', e);
            LK.lastError = e;
        }
    }

    root.addEventListener('layerling-kurs-reset', () => {
        state = progress.defaultState();
        view = 'step';
        modalOpen = false;
        overlay.clear();
        tick();
    });

    LK.debug = {state: () => state, tick, actions};
    setInterval(tick, TICK_MS);
    tick();
})(typeof window !== 'undefined' ? window : globalThis);

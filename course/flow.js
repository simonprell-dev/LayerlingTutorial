/*
 * Ablauf-Logik des Kurses – ohne DOM, damit sie sich testen lässt.
 * Kapitel- und Schrittformat: siehe Kopf von course/course-data.js.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};

    const safe = fn => {
        try {
            return Boolean(fn());
        } catch (e) {
            return false;
        }
    };

    // Kann die Erweiterung die Formen nicht lesen, wird jede Aufgabe zum Selbst-Abhaken.
    function isManual (task, c) {
        return Boolean(task.manual || !task.check || !c.shapesKnown);
    }

    function evaluate (step, c, doneBefore) {
        const tasks = step.tasks || [];
        const done = new Set(doneBefore || []);
        tasks.forEach((task, i) => {
            if (done.has(i) || isManual(task, c)) return;
            if (safe(() => task.check(c))) done.add(i);
        });
        const list = [...done].filter(i => i < tasks.length).sort((a, b) => a - b);
        return {done: list, complete: list.length === tasks.length};
    }

    function toggleManual (done, index) {
        const set = new Set(done || []);
        if (set.has(index)) set.delete(index);
        else set.add(index);
        return [...set].sort((a, b) => a - b);
    }

    function pickHint (step, c) {
        if (!step || step.kind === 'info') return null;
        return (step.hints || []).find(h => !safe(() => h.done(c))) || null;
    }

    function showHintsAuto (level, chapter, step, hintsOff) {
        if (hintsOff || (step && step.kind === 'info')) return false;
        if (step && typeof step.autoHints === 'boolean') return step.autoHints;
        return level === 'neu';
    }

    function sequence (chapters) {
        const out = [];
        let last = null;
        chapters.forEach((ch, ci) => {
            if (ch.comingSoon || !(ch.steps || []).length) return;
            if (last !== null) out.push({type: 'transition', from: last, to: ci});
            ch.steps.forEach((s, si) => out.push({type: 'step', ci, si}));
            last = ci;
        });
        return out;
    }

    // profi überspringt das erste Kapitel, sobald es ein weiteres fertiges gibt.
    function startChapter (chapters, level) {
        if (level !== 'profi') return 0;
        const next = chapters.findIndex((ch, i) => i > 0 && !ch.comingSoon && (ch.steps || []).length);
        return next > 0 ? next : 0;
    }

    LK.flow = {isManual, evaluate, toggleManual, pickHint, showHintsAuto, sequence, startChapter};
})(typeof window !== 'undefined' ? window : globalThis);

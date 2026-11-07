/*
 * Lernfortschritt im localStorage von layerling.com. Ein kaputter oder gesperrter Speicher
 * darf den Kurs nie stoppen: Dann beginnt er einfach mit dem Standardzustand.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const KEY = 'layerling-kurs:v1';

    function defaultState () {
        return {level: null, chapter: 0, step: 0, done: {}, finished: [], hintsOff: false, open: false, panelPos: null};
    }

    function load (storage) {
        try {
            const raw = storage.getItem(KEY);
            if (!raw) return defaultState();
            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object') return defaultState();
            return Object.assign(defaultState(), data);
        } catch (e) {
            return defaultState();
        }
    }

    function save (storage, state) {
        try {
            storage.setItem(KEY, JSON.stringify(state));
        } catch (e) { /* voll oder gesperrt – egal */ }
    }

    function reset (storage) {
        try {
            storage.removeItem(KEY);
        } catch (e) { /* egal */ }
    }

    LK.progress = {KEY, defaultState, load, save, reset};
})(typeof window !== 'undefined' ? window : globalThis);

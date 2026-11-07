// Lädt Erweiterungs-Skripte (IIFE-Dateien) in eine eigene vm, deren window === globalThis ist.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function memoryStorage () {
    const map = new Map();
    return {
        getItem: k => (map.has(k) ? map.get(k) : null),
        setItem: (k, v) => { map.set(k, String(v)); },
        removeItem: k => { map.delete(k); },
        clear: () => map.clear()
    };
}

export function load (files, extraGlobals = {}) {
    const sandbox = {console, localStorage: memoryStorage(), ...extraGlobals};
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    for (const file of files) {
        vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, {filename: file});
    }
    return sandbox;
}

// Objekte aus der vm haben andere Prototypen – für deepEqual in normale Objekte umwandeln.
export const plain = v => JSON.parse(JSON.stringify(v));

// Skriptliste der Erweiterung (PAGE_SCRIPTS aus background.js) – eine Quelle für Tests und Prüfwerkzeug.
export function pageScripts () {
    const on = () => ({addListener: () => {}});
    const chrome = {runtime: {onInstalled: on(), onStartup: on()}, contextMenus: {onClicked: on()}, action: {onClicked: on()}, i18n: {getMessage: k => k}};
    const sandbox = {chrome, console, self: {}};
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'background.js'), 'utf8') + ';globalThis.__PAGE = PAGE_SCRIPTS;', sandbox);
    return [...sandbox.__PAGE.js];
}

// Alles, was Kursinhalte und Prüfungen braucht (ohne Anzeige und Hauptschleife).
export function courseFiles () {
    return pageScripts().filter(f => !['course/overlay.js', 'course/panel.js', 'course/course.js'].includes(f)).map(f => path.join(ROOT, f));
}

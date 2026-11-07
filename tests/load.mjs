// Lädt Erweiterungs-Skripte (IIFE-Dateien) in eine eigene vm, deren window === globalThis ist.
import fs from 'node:fs';
import vm from 'node:vm';

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

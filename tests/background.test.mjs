import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// background.js mit einem Fake-chrome laden und die registrierten Skripte auslesen.
function loadBackground () {
    const listeners = {};
    const on = name => ({addListener: fn => { listeners[name] = fn; }});
    const chrome = {
        runtime: {onInstalled: on('installed'), onStartup: on('startup')},
        contextMenus: {onClicked: on('menu'), removeAll: () => {}, create: () => {}},
        action: {onClicked: on('action'), setBadgeText: async () => {}, setBadgeBackgroundColor: async () => {}, setTitle: async () => {}},
        storage: {local: {get: async () => ({}), set: async () => {}}},
        scripting: {getRegisteredContentScripts: async () => [], unregisterContentScripts: async () => {}, registerContentScripts: async () => {}, executeScript: async () => []},
        tabs: {query: async () => [], update: async () => {}, create: async () => {}},
        windows: {update: async () => {}},
        i18n: {getMessage: k => k}
    };
    const sandbox = {chrome, console, self: {}};
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync('background.js', 'utf8') + '\n;globalThis.__PAGE = PAGE_SCRIPTS; globalThis.__RESET = RESET_SCRIPT; globalThis.__URL = EDITOR_URL;', sandbox);
    return sandbox;
}

const listJs = dir => fs.readdirSync(dir, {recursive: true}).filter(f => f.endsWith('.js')).map(f => `${dir}/${f.replace(/\\/g, '/')}`);

test('background: Skriptliste vollständig, in Lade-Reihenfolge und vorhanden', () => {
    const s = loadBackground();
    const js = [...s.__PAGE.js];
    assert.deepEqual(js, ['lib/geometry.js', 'lib/layerling-access.js', 'course/i18n.js', 'course/i18n/de.js', 'course/i18n/en.js',
        'course/progress.js', 'course/context.js', 'course/flow.js', 'course/course-data.js', 'course/overlay.js',
        'course/panel.js', 'course/course.js']);
    js.forEach(f => assert.ok(fs.existsSync(f), f));
    const all = [...listJs('lib'), ...listJs('course')];
    all.forEach(f => assert.ok(js.includes(f), `fehlt in der Skriptliste: ${f}`));
    assert.deepEqual([...s.__PAGE.css], ['course/course.css']);
    assert.equal(s.__PAGE.world, 'MAIN');
    assert.deepEqual([...s.__PAGE.matches], ['https://layerling.com/*']);
});

test('background: Editor-Adresse und Reset-Skript', () => {
    const s = loadBackground();
    assert.equal(s.__URL, 'https://layerling.com/');
    assert.deepEqual([...s.__RESET.js], ['reset-pending.js']);
    assert.ok(fs.existsSync('reset-pending.js'));
});

test('locales: Menütexte in de und en', () => {
    for (const lang of ['de', 'en']) {
        const m = JSON.parse(fs.readFileSync(`_locales/${lang}/messages.json`, 'utf8'));
        for (const k of ['menuEnabled', 'menuReset', 'menuHelp', 'badgeOff', 'titleOn', 'titleOff', 'confirmReset', 'toastOn', 'toastOff', 'toastReset']) {
            assert.ok(m[k] && m[k].message, `${lang}: ${k}`);
        }
    }
});

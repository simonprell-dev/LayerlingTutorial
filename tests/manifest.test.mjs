import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {load} from './load.mjs';

test('manifest: nur layerling.com', () => {
    const m = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    assert.equal(m.manifest_version, 3);
    assert.deepEqual(m.host_permissions, ['https://layerling.com/*']);
    assert.deepEqual([...m.permissions].sort(), ['contextMenus', 'scripting', 'storage']);
    assert.equal(m.homepage_url, 'https://simonprell-dev.github.io/LayerlingTutorial/');
    assert.equal(m.background.service_worker, 'background.js');
    for (const s of ['16', '32', '48', '128']) assert.ok(fs.existsSync(m.icons[s]), m.icons[s]);
});

test('manifest: Namen in de und en', () => {
    for (const lang of ['de', 'en']) {
        const msg = JSON.parse(fs.readFileSync(`_locales/${lang}/messages.json`, 'utf8'));
        assert.ok(msg.extName.message.includes('Layerling'));
    }
    const de = JSON.parse(fs.readFileSync('_locales/de/messages.json', 'utf8'));
    assert.equal(de.extName.message, 'Einführungskurs für Layerling – 3D-Konstruieren lernen');
});

test('load: window ist global und hat localStorage', () => {
    const w = load([]);
    assert.equal(w.window, w);
    w.localStorage.setItem('a', '1');
    assert.equal(w.localStorage.getItem('a'), '1');
    assert.equal(w.localStorage.getItem('b'), null);
});

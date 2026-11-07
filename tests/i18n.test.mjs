import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './load.mjs';

const fresh = () => load(['course/i18n.js', 'course/i18n/de.js', 'course/i18n/en.js']).LK.i18n;

test('pick: vorhandene Sprache, sonst Englisch', () => {
    const i = fresh();
    assert.equal(i.pick('de'), 'de');
    assert.equal(i.pick('en'), 'en');
    assert.equal(i.pick('pt-br'), 'en');
    assert.equal(i.pick('ja'), 'en');
    assert.equal(i.pick(null), 'en');
    assert.equal(i.pick(''), 'en');
});

test('t: fehlender DE-Schlüssel fällt auf EN, unbekannter gibt den Schlüssel', () => {
    const i = fresh();
    i.messages.en['x.only'] = 'only en';
    i.setLanguage('de');
    assert.equal(i.t('x.only'), 'only en');
    assert.equal(i.t('gibts.nicht'), 'gibts.nicht');
});

test('t: Platzhalter', () => {
    const i = fresh();
    i.setLanguage('de');
    i.messages.de['x.hi'] = 'Hallo {name}';
    assert.equal(i.t('x.hi', {name: 'Mia'}), 'Hallo Mia');
});

test('setLanguage: unbekannte Sprache → en', () => {
    const i = fresh();
    i.setLanguage('ja');
    assert.equal(i.getLanguage(), 'en');
});

test('de und en haben dieselben Schlüssel', () => {
    const i = fresh();
    assert.deepEqual(Object.keys(i.messages.de).sort(), Object.keys(i.messages.en).sort());
});

test('Rahmentexte vorhanden', () => {
    const i = fresh();
    i.setLanguage('de');
    assert.equal(i.t('access.unknownVersion'), 'Diese Layerling-Version kenne ich noch nicht – hake die Aufgaben bitte selbst ab.');
    assert.equal(i.t('level.neu'), 'Neu dabei');
    assert.equal(i.t('level.etwas'), 'Schon mal 3D gemacht');
    assert.equal(i.t('level.profi'), 'Ich kenne Tinkercad o. Ä.');
    assert.equal(i.t('level.comingSoon'), 'kommt bald');
    i.setLanguage('en');
    assert.equal(i.t('level.profi'), 'I know Tinkercad or similar');
    assert.equal(i.t('level.comingSoon'), 'coming soon');
});

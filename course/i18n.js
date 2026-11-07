/*
 * Mehrsprachigkeit: Jede Sprachdatei trägt sich in LK.i18n.messages.<code> ein.
 * Die Kurssprache folgt der Sprache, die in Layerling eingestellt ist. Fehlt eine Sprache
 * oder ein einzelner Text, wird Englisch genommen.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    const messages = (LK.i18n && LK.i18n.messages) || {};
    let current = 'en';

    function pick (code) {
        return typeof code === 'string' && messages[code] ? code : 'en';
    }

    function setLanguage (code) {
        current = pick(code);
    }

    function getLanguage () {
        return current;
    }

    function has (key) {
        return Boolean((messages[current] && key in messages[current]) || (messages.en && key in messages.en));
    }

    function t (key, vars) {
        const own = messages[current] && messages[current][key];
        const text = own !== undefined ? own : (messages.en && messages.en[key] !== undefined ? messages.en[key] : key);
        if (!vars) return text;
        return text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m));
    }

    LK.i18n = {messages, pick, setLanguage, getLanguage, has, t};
})(typeof window !== 'undefined' ? window : globalThis);

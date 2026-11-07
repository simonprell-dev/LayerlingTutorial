/*
 * Kapitel „getriebe“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/getriebe.js,
 * zusätzliche Hinweis-Ziele: lib/targets/getriebe.js. Wird in course/course-data.js eingereiht.
 * Solange steps leer ist, zeigt der Kurs das Kapitel als „kommt bald“.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    LK.chapters['getriebe'] = {
        id: 'getriebe',
        level: 'profi',
        type: 'mechanics',
        icon: '⚙️',
        title: 'getriebe.title',
        desc: 'getriebe.desc',
        comingSoon: true,
        steps: []
    };
})(typeof window !== 'undefined' ? window : globalThis);

/*
 * Kapitel „handystaender“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/handystaender.js,
 * zusätzliche Hinweis-Ziele: lib/targets/handystaender.js. Wird in course/course-data.js eingereiht.
 * Solange steps leer ist, zeigt der Kurs das Kapitel als „kommt bald“.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    LK.chapters['handystaender'] = {
        id: 'handystaender',
        level: 'profi',
        type: 'sketch',
        icon: '📱',
        title: 'handystaender.title',
        desc: 'handystaender.desc',
        comingSoon: true,
        steps: []
    };
})(typeof window !== 'undefined' ? window : globalThis);

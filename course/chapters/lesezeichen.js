/*
 * Kapitel „lesezeichen“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/lesezeichen.js,
 * zusätzliche Hinweis-Ziele: lib/targets/lesezeichen.js. Wird in course/course-data.js eingereiht.
 * Solange steps leer ist, zeigt der Kurs das Kapitel als „kommt bald“.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    LK.chapters['lesezeichen'] = {
        id: 'lesezeichen',
        level: 'etwas',
        type: 'sketch',
        icon: '🔖',
        title: 'lesezeichen.title',
        desc: 'lesezeichen.desc',
        comingSoon: true,
        steps: []
    };
})(typeof window !== 'undefined' ? window : globalThis);

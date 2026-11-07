/*
 * Kapitel „schraubdose“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/schraubdose.js,
 * zusätzliche Hinweis-Ziele: lib/targets/schraubdose.js. Wird in course/course-data.js eingereiht.
 * Solange steps leer ist, zeigt der Kurs das Kapitel als „kommt bald“.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    LK.chapters['schraubdose'] = {
        id: 'schraubdose',
        level: 'profi',
        type: 'mechanics',
        icon: '🫙',
        title: 'schraubdose.title',
        desc: 'schraubdose.desc',
        comingSoon: true,
        steps: []
    };
})(typeof window !== 'undefined' ? window : globalThis);

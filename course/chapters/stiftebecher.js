/*
 * Kapitel „stiftebecher“ – Struktur, Prüfungen und Hinweise. Texte: course/i18n/<sprache>/stiftebecher.js,
 * zusätzliche Hinweis-Ziele: lib/targets/stiftebecher.js. Wird in course/course-data.js eingereiht.
 * Solange steps leer ist, zeigt der Kurs das Kapitel als „kommt bald“.
 */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.chapters = LK.chapters || {};

    LK.chapters['stiftebecher'] = {
        id: 'stiftebecher',
        level: 'etwas',
        type: 'body',
        icon: '✏️',
        title: 'stiftebecher.title',
        desc: 'stiftebecher.desc',
        comingSoon: true,
        steps: []
    };
})(typeof window !== 'undefined' ? window : globalThis);

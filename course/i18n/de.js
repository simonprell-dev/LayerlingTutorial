/* Kurstexte Deutsch. Schlüssel müssen in allen Sprachdateien gleich sein (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.de = Object.assign(LK.i18n.messages.de || {}, {
        'common.courseName': 'Einführungskurs für Layerling',
        'common.next': 'Weiter',
        'common.back': 'Zurück',
        'common.close': 'Schließen',
        'common.start': 'Los geht’s',
        'common.done': 'Geschafft!',

        'level.title': 'Wie gut kennst du dich mit 3D-Konstruieren aus?',
        'level.intro': 'Such dir einen Einstieg aus. Alle Kapitel bleiben offen – du kannst jederzeit wechseln.',
        'level.neu': 'Neu dabei',
        'level.neu.desc': 'Die Hand zeigt dir jeden Klick.',
        'level.etwas': 'Schon mal 3D gemacht',
        'level.etwas.desc': 'Die Hand zeigt dir nur etwas, wenn du auf 👆 klickst.',
        'level.profi': 'Ich kenne Tinkercad o. Ä.',
        'level.profi.desc': 'Weniger Hilfe, schneller voran.',
        'level.comingSoon': 'kommt bald',

        'panel.launcher': 'Kurs starten',
        'panel.overview': 'Übersicht',
        'panel.chapter': 'Kapitel {n}',
        'panel.step': 'Schritt {n} von {total}',
        'panel.tasks': 'Deine Aufgaben',
        'panel.manualHint': 'Zum Abhaken anklicken',
        'panel.showHint': '👆 Zeig’s mir',
        'panel.hintsOn': 'Hinweise an',
        'panel.hintsOff': 'Hinweise aus',
        'panel.chooseLevel': 'Einstieg wählen',
        'panel.stepDone': 'Super – Schritt geschafft!',
        'panel.chapterDone': 'Kapitel geschafft!',
        'panel.chapterDoneText': 'Du hast „{title}“ fertig gebaut. Weiter geht’s mit dem nächsten Kapitel, sobald es da ist.',
        'panel.courseDone': 'Du hast alle fertigen Kapitel geschafft. Neue Kapitel kommen mit den nächsten Updates.',
        'panel.openEditor': 'Öffne zuerst einen 3D-Entwurf, dann geht der Kurs los.',
        'panel.independent': 'Unabhängiges Projekt – nicht mit Layerling verbunden.',

        'access.unknownVersion': 'Diese Layerling-Version kenne ich noch nicht – hake die Aufgaben bitte selbst ab.',

        'transition.title': 'Entwurf sichern',
        'transition.text': '<p>Dein Entwurf ist automatisch im Browser gespeichert. Für das nächste Kapitel startest du einen <b>neuen Entwurf</b>.</p>',
        'transition.task.export': 'Fertiges Teil exportiert (falls du es drucken willst)',
        'transition.task.newDesign': 'Neuen 3D-Entwurf angelegt'
    });
})(typeof window !== 'undefined' ? window : globalThis);

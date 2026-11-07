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
        'transition.task.newDesign': 'Neuen 3D-Entwurf angelegt',

        'type.basics': 'Grundlagen',
        'type.sketch': 'Skizze',
        'type.body': 'Körper',
        'type.mechanics': 'Mechanik',

        // ---------- Kapitel 1: Namensschild ----------
        'namensschild.title': 'Dein Namensschild',
        'namensschild.desc': 'Platte, Text, Loch für den Schlüsselring – und fertig ist dein erstes Druckteil.',

        'namensschild.s1.title': 'Was bauen wir?',
        'namensschild.s1.text': '<p>Du baust ein <b>Namensschild</b> für den 3D-Drucker: eine flache Platte, darauf dein Name und ein Loch für einen Schlüsselring.</p>' +
            '<p>Dabei lernst du die wichtigsten Handgriffe in Layerling: Formen holen, Maße eintippen, Formen kombinieren und das Ergebnis für den Drucker speichern.</p>' +
            '<p>Schau dir kurz die markierten Bereiche an und klicke dann auf <b>Weiter</b>.</p>',
        'namensschild.s1.l1': 'Hier holst du Formen',
        'namensschild.s1.l2': 'Deine Arbeitsfläche',
        'namensschild.s1.l3': 'Ansicht drehen',

        'namensschild.s2.title': 'Neuer Entwurf',
        'namensschild.s2.text': '<p>Jedes Projekt beginnt mit einem leeren Entwurf. Klicke auf der Startseite auf <b>„Neuen 3D-Entwurf anlegen“</b>.</p>' +
            '<p>Layerling speichert deinen Entwurf automatisch im Browser.</p>',
        'namensschild.s2.t1': 'Leeren 3D-Entwurf geöffnet',
        'namensschild.s2.h1': 'Neuen Entwurf anlegen',

        'namensschild.s3.title': 'Die Grundplatte',
        'namensschild.s3.text': '<p>Klicke auf <b>„Form hinzufügen“</b> und dann auf <b>„Quader“</b>. Der Quader hängt jetzt an deiner Maus – klicke auf die Arbeitsfläche, um ihn abzulegen.</p>',
        'namensschild.s3.t1': 'Einen Quader auf die Arbeitsfläche gelegt',
        'namensschild.s3.h1': 'Klicke auf „Form hinzufügen“',
        'namensschild.s3.h2': 'Quader wählen, dann ablegen',

        'namensschild.s4.title': 'Genaue Maße',
        'namensschild.s4.text': '<p>Ein Namensschild ist flach. Klicke den Quader an. Rechts erscheinen seine <b>Eigenschaften</b>.</p>' +
            '<p>Tippe diese Maße ein und drücke jeweils <b>Enter</b>:</p>' +
            '<ul><li><b>Länge</b> 70 mm</li><li><b>Breite</b> 25 mm</li><li><b>Höhe</b> 3 mm</li></ul>' +
            '<p>Dein Schild darf auch etwas größer oder kleiner sein.</p>',
        'namensschild.s4.t1': 'Platte ist etwa 70 × 25 × 3 mm groß',
        'namensschild.s4.h1': 'Klicke den Quader an',
        'namensschild.s4.h2': 'Maße hier eintippen',

        'namensschild.s5.title': 'Dein Name',
        'namensschild.s5.text': '<p>Hol dir über <b>„Form hinzufügen“</b> die Form <b>„Text“</b> und klicke damit <b>auf deine Platte</b>.</p>' +
            '<p>Rechts in den Eigenschaften steht „TEXT“. Tippe dort deinen Namen ein – oder ein anderes Wort.</p>',
        'namensschild.s5.t1': 'Text mit deinem Namen platziert',
        'namensschild.s5.h1': 'Klicke auf „Form hinzufügen“',
        'namensschild.s5.h2': 'Text wählen, auf die Platte',
        'namensschild.s5.h3': 'Hier deinen Namen tippen',

        'namensschild.s6.title': 'Schrift auf die Platte',
        'namensschild.s6.text': '<p>Die Schrift soll <b>auf</b> der Platte liegen und nur wenig herausragen.</p>' +
            '<ul><li>Liegt der Text daneben? Zieh ihn mit der Maus auf die Platte.</li>' +
            '<li>Stell die <b>Höhe</b> des Textes auf etwa <b>2 mm</b>.</li>' +
            '<li>Passt der Name nicht drauf? Mach die Buchstaben kleiner.</li></ul>',
        'namensschild.s6.t1': 'Text liegt auf der Platte',
        'namensschild.s6.t2': 'Schrift ist flach (etwa 2 mm hoch)',
        'namensschild.s6.h1': 'Text auf die Platte ziehen',
        'namensschild.s6.h2': 'Höhe auf 2 mm',

        'namensschild.s7.title': 'Loch für den Schlüsselring',
        'namensschild.s7.text': '<p>Löcher baust du in Layerling mit einer <b>Aussparung</b>: Eine Form, die Material wegnimmt.</p>' +
            '<ul><li>Hol dir einen <b>„Zylinder“</b>.</li>' +
            '<li>Klicke rechts auf <b>„Aussparung“</b> – der Zylinder wird durchsichtig.</li>' +
            '<li>Mach ihn etwa <b>5 mm</b> dick und höher als die Platte.</li>' +
            '<li>Schieb ihn an eine Ecke der Platte.</li></ul>',
        'namensschild.s7.t1': 'Zylinder ist eine Aussparung',
        'namensschild.s7.t2': 'Etwa 5 mm dick (3–8 mm)',
        'namensschild.s7.t3': 'Sitzt an der Platte',
        'namensschild.s7.h1': 'Klicke auf „Form hinzufügen“',
        'namensschild.s7.h2': 'Zylinder wählen, ablegen',
        'namensschild.s7.h3': 'Auf „Aussparung“ klicken',
        'namensschild.s7.h4': 'Durchmesser etwa 5 mm',
        'namensschild.s7.h5': 'An eine Ecke schieben',

        'namensschild.s8.title': 'Alles zusammenfügen',
        'namensschild.s8.text': '<p>Noch sind es drei einzelne Formen. Erst beim <b>Gruppieren</b> verschmelzen sie: Die Schrift wächst aus der Platte, und die Aussparung schneidet das Loch.</p>' +
            '<ul><li>Wähle alles aus: <b>Strg+A</b> oder einen Rahmen um alles ziehen.</li>' +
            '<li>Klicke oben auf <b>„Gruppieren“</b> (im Bereich <b>„Verbinden“</b>) – oder drücke <b>Strg+G</b>.</li></ul>',
        'namensschild.s8.t1': 'Platte, Text und Loch sind gruppiert',
        'namensschild.s8.h1': 'Alles auswählen (Strg+A)',
        'namensschild.s8.h2': 'Auf „Gruppieren“ klicken',

        'namensschild.s9.title': 'Rundum anschauen',
        'namensschild.s9.text': '<p>Schau dir dein Schild von allen Seiten an. Klicke dazu auf die Seiten des <b>Ansichtswürfels</b> oder dreh die Ansicht mit der rechten Maustaste.</p>' +
            '<p>Prüfe: Geht das Loch ganz durch? Liegt die Schrift sauber auf?</p>',
        'namensschild.s9.t1': 'Von oben und von der Seite angeschaut',
        'namensschild.s9.t2': 'Das Loch geht ganz durch',
        'namensschild.s9.h1': 'Ansicht hier drehen',

        'namensschild.s10.title': 'Für den Drucker speichern',
        'namensschild.s10.text': '<p>Damit der 3D-Drucker dein Schild drucken kann, brauchst du eine <b>STL-Datei</b>.</p>' +
            '<p>Klicke auf <b>„Exportieren“</b> (oder <b>Strg+E</b>) und dann auf <b>„STL exportieren“</b>. Die Datei landet in deinem Download-Ordner – öffne sie im Slicer deines Druckers.</p>',
        'namensschild.s10.t1': 'STL-Datei exportiert',
        'namensschild.s10.h1': 'Auf „Exportieren“ klicken',
        'namensschild.s10.h2': 'STL exportieren',

        'namensschild.s11.title': 'Challenge',
        'namensschild.s11.text': '<p>Jetzt ohne Hilfe! Such dir eine Idee aus:</p>' +
            '<ul><li><b>Runde Ecken:</b> Nimm statt des Quaders einen <b>„Abgerundeten Quader“</b>.</li>' +
            '<li><b>Gravur:</b> Stell den Text auf <b>„Aussparung“</b> und lass ihn etwas in die Platte ragen – dann wird der Name eingraviert statt erhaben.</li>' +
            '<li><b>Rahmen:</b> Bau einen schmalen, erhabenen Rand rund um die Platte.</li></ul>' +
            '<p>Tipp: Mit Doppelklick auf eine Gruppe kannst du ihre Teile wieder bearbeiten.</p>',
        'namensschild.s11.t1': 'Eine Idee umgesetzt',

        'namensschild.s12.title': 'Geschafft!',
        'namensschild.s12.text': '<p>Du hast dein erstes Druckteil konstruiert. 🎉</p>' +
            '<p>Weitere Ideen: Türschild, Kofferanhänger, Lesezeichen, Geschenkanhänger.</p>' +
            '<p><b>Bonus:</b> Layerling hat auch ein fertiges Werkzeug <b>„Namensschild“</b> (in <b>„Form hinzufügen“</b>, Bereich <b>„Schrift &amp; Schilder“</b>). Damit geht so ein Schild mit einem Klick – sogar mit mehreren Farbschichten. Probier es aus!</p>',
        'namensschild.s12.t1': 'Werkzeug „Namensschild“ ausprobiert',
        'namensschild.s12.t2': 'Eigene Idee gebaut',
        'namensschild.s12.h1': 'Klicke auf „Form hinzufügen“',
        'namensschild.s12.h2': 'Fertiges Namensschild',

        // ---------- Kapitel 2–6: angekündigt ----------
        'lesezeichen.title': 'Lesezeichen mit eigener Form',
        'lesezeichen.desc': 'Eigene Umrisse skizzieren, Ecken runden, herausziehen und Text eingravieren.',
        'stiftebecher.title': 'Stiftebecher',
        'stiftebecher.desc': 'Körper aushöhlen, Lochmuster rundherum, Kanten abrunden.',
        'handystaender.title': 'Handyständer',
        'handystaender.desc': 'Profil mit Winkel skizzieren, Fasen und die Überhang-Warnung nutzen.',
        'schraubdose.title': 'Dose mit Schraubdeckel',
        'schraubdose.desc': 'Gewinde, zwei Teile mit Spiel, messen und ausrichten.',
        'getriebe.title': 'Kurbel-Getriebe',
        'getriebe.desc': 'Zahnräder, Achsen und mehrere Druckplatten.'
    });
})(typeof window !== 'undefined' ? window : globalThis);

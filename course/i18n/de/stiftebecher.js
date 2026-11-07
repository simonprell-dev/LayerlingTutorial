/* Kurstexte Deutsch für Kapitel „stiftebecher“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.de = Object.assign(LK.i18n.messages.de || {}, {
        'stiftebecher.s1.title': 'Was bauen wir?',
        'stiftebecher.s1.text': '<p>Du baust einen <b>Stiftebecher</b>: einen runden Becher mit dünner Wand, einem Lochmuster rundherum und einem weichen, abgerundeten Rand.</p>' +
            '<p>Dafür lernst du drei starke Werkzeuge kennen. Sie verändern einen Körper, statt neue Formen dazuzulegen:</p>' +
            '<ul><li><b>„Aushöhlen“</b> macht aus einem vollen Körper eine Schale.</li>' +
            '<li><b>„Verrundung“</b> rundet Kanten ab.</li>' +
            '<li><b>„Lochmuster“</b> setzt viele Löcher auf einmal.</li></ul>' +
            '<p>Du findest sie oben in den Bereichen <b>„Kanten &amp; Wände“</b> und <b>„Spiegeln &amp; Muster“</b>. Klicke dann auf <b>Weiter</b>.</p>',
        'stiftebecher.s1.l1': 'Aushöhlen',
        'stiftebecher.s1.l2': 'Kanten abrunden',
        'stiftebecher.s1.l3': 'Lochmuster',

        'stiftebecher.s2.title': 'Der Becher-Körper',
        'stiftebecher.s2.text': '<p>Lege einen <b>neuen 3D-Entwurf</b> an. Hol dir dann über <b>„Form hinzufügen“</b> einen <b>„Zylinder“</b> und klicke ihn auf die Arbeitsfläche.</p>' +
            '<p>Klicke den Zylinder an und tippe rechts in den <b>Eigenschaften</b> ein (jeweils mit <b>Enter</b>):</p>' +
            '<ul><li><b>Durchmesser</b> 70 mm</li><li><b>Höhe</b> 100 mm</li></ul>' +
            '<p>Dein Becher darf auch etwas dicker, dünner oder kleiner sein (Durchmesser 60–90 mm, Höhe 80–120 mm).</p>',
        'stiftebecher.s2.t1': 'Neuen 3D-Entwurf geöffnet',
        'stiftebecher.s2.t2': 'Zylinder etwa 70 mm breit, 100 mm hoch',
        'stiftebecher.s2.h1': 'Neuen Entwurf anlegen',
        'stiftebecher.s2.h2': 'Klicke auf „Form hinzufügen“',
        'stiftebecher.s2.h3': 'Zylinder wählen, dann ablegen',
        'stiftebecher.s2.h4': 'Jetzt auf die Fläche klicken',
        'stiftebecher.s2.h5': 'Durchmesser 70, Höhe 100',

        'stiftebecher.s3.title': 'Aushöhlen',
        'stiftebecher.s3.text': '<p>Noch ist dein Becher ein voller Klotz. <b>Aushöhlen</b> macht daraus eine Schale: Die <b>Wand</b> (die dünne Seitenwand) wächst nach innen, außen bleibt alles gleich.</p>' +
            '<ul><li>Klicke den Zylinder an.</li>' +
            '<li>Klicke oben auf <b>„Aushöhlen“</b> (Bereich <b>„Kanten &amp; Wände“</b>).</li>' +
            '<li><b>„Wandstärke“</b>: 2 mm. Bei <b>„Offene Seiten“</b> ist nur <b>„Oben“</b> markiert – der Boden bleibt zu.</li>' +
            '<li>Klicke unten auf <b>„Aushöhlen“</b>. Layerling rechnet kurz.</li></ul>' +
            '<p>Danach heißt die Form zwar noch „Zylinder“, ist aber ein bearbeiteter Körper.</p>',
        'stiftebecher.s3.t1': 'Becher ist ausgehöhlt',
        'stiftebecher.s3.t2': 'Wand etwa 2 mm dick',
        'stiftebecher.s3.t3': 'Oben offen, Boden geschlossen',
        'stiftebecher.s3.h1': 'Klicke den Zylinder an',
        'stiftebecher.s3.h2': 'Auf „Aushöhlen“ klicken',
        'stiftebecher.s3.h3': 'Wandstärke 2 mm',
        'stiftebecher.s3.h4': 'Nur „Oben“ markieren',
        'stiftebecher.s3.h5': 'Auf „Aushöhlen“ klicken',
        'stiftebecher.s3.h6': 'Rückgängig (Strg+Z), nochmal aushöhlen',

        'stiftebecher.s4.title': 'Weicher Rand',
        'stiftebecher.s4.text': '<p>Scharfe Kanten pieken. Mit einer <b>Verrundung</b> wird der obere Rand rund und angenehm.</p>' +
            '<ul><li>Klicke den Becher an.</li>' +
            '<li>Klicke oben auf <b>„Verrundung“</b> (Bereich <b>„Kanten &amp; Wände“</b>) – oder drücke <b>B</b>. Layerling bereitet die Kanten kurz vor.</li>' +
            '<li>Klicke auf <b>„Obere Kanten“</b>. Das sind die Kanten am Rand.</li>' +
            '<li><b>„Radius“</b>: 0,8 mm. Die Wand ist nur 2 mm dick, mehr passt nicht. Erscheint eine Fehlermeldung? Dann ist der Radius zu groß.</li>' +
            '<li>Klicke auf <b>„Anwenden“</b> und danach auf <b>„Fertig“</b>.</li></ul>' +
            '<p>Warum vor dem Lochmuster? Jetzt hat der Becher nur vier Kanten. Mit vielen Löchern müsste Layerling Hunderte Kanten prüfen – das dauert sehr lange.</p>',
        'stiftebecher.s4.t1': 'Rand ist abgerundet',
        'stiftebecher.s4.h1': 'Klicke den Becher an',
        'stiftebecher.s4.h2': 'Auf „Verrundung“ klicken',
        'stiftebecher.s4.h3': '„Obere Kanten“ wählen',
        'stiftebecher.s4.h4': 'Radius 0,8 mm',
        'stiftebecher.s4.h5': 'Auf „Anwenden“ klicken',

        'stiftebecher.s5.title': 'Lochmuster rundherum',
        'stiftebecher.s5.text': '<p>Jetzt bekommt die Wand ein Muster aus Löchern. Das sieht schick aus und spart Material.</p>' +
            '<ul><li>Klicke den Becher an.</li>' +
            '<li>Klicke oben auf <b>„Lochmuster“</b> (Bereich <b>„Spiegeln &amp; Muster“</b>).</li>' +
            '<li>Klicke auf die <b>runde Wand</b> des Bechers – nicht auf den Boden. Layerling zeigt die Löcher als Vorschau rundherum.</li>' +
            '<li>Probier <b>„Lochform“</b> und Größe aus. Größere Löcher und mehr Abstand ergeben weniger Löcher. Bei <b>„Tiefe“</b> bleibt <b>„Durch die Wand“</b>.</li>' +
            '<li>Klicke auf <b>„Erzeugen“</b>.</li></ul>' +
            '<p>Die Löcher sind <b>Aussparungen</b> und werden mit dem Becher gruppiert.</p>',
        'stiftebecher.s5.t1': 'Löcher sitzen in der Wand',
        'stiftebecher.s5.t2': 'Löcher gehen rundherum',
        'stiftebecher.s5.h1': 'Klicke den Becher an',
        'stiftebecher.s5.h2': 'Auf „Lochmuster“ klicken',
        'stiftebecher.s5.h3': 'Auf die runde Wand klicken',
        'stiftebecher.s5.h4': 'Auf „Erzeugen“ klicken',

        'stiftebecher.s6.title': 'Rundum anschauen',
        'stiftebecher.s6.text': '<p>Schau dir deinen Becher von allen Seiten an. Klicke auf die Seiten des <b>Ansichtswürfels</b> oder dreh die Ansicht mit der rechten Maustaste.</p>' +
            '<p>Schau von oben hinein: Ist der Boden zu? Gehen die Löcher durch die Wand?</p>',
        'stiftebecher.s6.t1': 'Von oben hineingeschaut',
        'stiftebecher.s6.t2': 'Boden ist zu, Löcher gehen durch',
        'stiftebecher.s6.h1': 'Ansicht hier drehen',

        'stiftebecher.s7.title': 'Für den Drucker speichern',
        'stiftebecher.s7.text': '<p>Speichere deinen Becher als <b>STL-Datei</b> für den 3D-Drucker.</p>' +
            '<p>Klicke auf <b>„Exportieren“</b> (oder <b>Strg+E</b>) und dann auf <b>„STL exportieren“</b>. Tipp: Der Becher steht auf dem Boden – so druckt er ohne Stützen.</p>',
        'stiftebecher.s7.t1': 'STL-Datei exportiert',
        'stiftebecher.s7.h1': 'Auf „Exportieren“ klicken',
        'stiftebecher.s7.h2': 'STL exportieren',

        'stiftebecher.s8.title': 'Challenge',
        'stiftebecher.s8.text': '<p>Jetzt ohne Hilfe! Bau einen <b>Mini-Becher</b> für Radiergummis und Büroklammern:</p>' +
            '<ul><li>etwa <b>40 mm</b> Durchmesser und <b>50 mm</b> hoch,</li>' +
            '<li>ausgehöhlt, oben offen, Boden zu.</li></ul>' +
            '<p>Stell ihn neben den großen Becher. Lust auf mehr? Gib ihm auch ein Lochmuster.</p>',
        'stiftebecher.s8.t1': 'Mini-Becher ausgehöhlt',
        'stiftebecher.s8.h1': 'Neuen Zylinder holen',
        'stiftebecher.s8.h2': 'Mini-Becher aushöhlen',
        'stiftebecher.s8.h3': 'Auf die Fläche klicken',

        'stiftebecher.s9.title': 'Geschafft!',
        'stiftebecher.s9.text': '<p>Dein Stiftebecher ist fertig. 🎉 Du kannst jetzt Körper aushöhlen, Lochmuster setzen und Kanten abrunden.</p>' +
            '<p>Ideen zum Weiterbauen:</p>' +
            '<ul><li>Schreib deinen <b>Namen</b> auf einen kleinen Sockel vor dem Becher.</li>' +
            '<li>Probier eine andere <b>„Lochform“</b> aus, zum Beispiel <b>„Langloch“</b>.</li>' +
            '<li>Bau eine <b>Schreibtisch-Ordnung</b> aus mehreren Bechern in verschiedenen Größen.</li>' +
            '<li>Höhle einen <b>Quader</b> aus – das gibt eine Schachtel.</li></ul>',
        'stiftebecher.s9.t1': 'Eine Idee ausprobiert',
        'stiftebecher.s9.t2': 'Becher gedruckt oder zum Drucken geschickt',
        'stiftebecher.s9.h1': 'Klicke auf „Form hinzufügen“',
        'stiftebecher.s9.h2': 'Text wählen, dann ablegen',
        'stiftebecher.s9.h3': 'Auf die Fläche klicken'
    });
})(typeof window !== 'undefined' ? window : globalThis);

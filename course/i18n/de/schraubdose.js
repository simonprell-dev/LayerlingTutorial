/* Kurstexte Deutsch für Kapitel „schraubdose“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.de = Object.assign(LK.i18n.messages.de || {}, {
        'schraubdose.s1.title': 'Was bauen wir?',
        'schraubdose.s1.text': '<p>Eine kleine <b>Dose mit Schraubdeckel</b> – zwei getrennte Druckteile, die nach dem Druck ineinander passen.</p>' +
            '<p>Der Weg: Zylinder → <b>„Aushöhlen“</b> → Werkzeug <b>„Deckel“</b> mit Gewinde und Spiel → messen, ausrichten, <b>„Spiel prüfen“</b> → Export.</p>' +
            '<p>Zwei Begriffe vorab: <b>Spiel</b> (Toleranz) ist der Luftspalt zwischen zwei Teilen, die ineinandergreifen – ohne ihn verschmelzen oder klemmen sie. Die <b>Steigung</b> ist der Weg, den ein Gewinde bei einer Umdrehung nach oben läuft.</p>',
        'schraubdose.s1.l1': 'Wände nach innen',
        'schraubdose.s1.l2': 'Deckel mit Gewinde',
        'schraubdose.s1.l3': 'Abstände prüfen',

        'schraubdose.s2.title': 'Der Dosenkörper',
        'schraubdose.s2.text': '<p>Hol einen <b>„Zylinder“</b> (<b>„Form hinzufügen“</b>) und stell im Eigenschaften-Fenster ein:</p>' +
            '<ul><li><b>„Durchmesser“</b> 40–70 mm, z. B. 50 mm</li><li><b>„Höhe“</b> 30–80 mm, z. B. 40 mm</li></ul>' +
            '<p>Das Gewinde kommt später außen oben an die Wand und braucht etwa 6 mm Höhe.</p>',
        'schraubdose.s2.t1': 'Neuen Zylinder abgelegt',
        'schraubdose.s2.t2': 'Ø 40–70 mm, 30–80 mm hoch',
        'schraubdose.s2.h1': '„Form hinzufügen“',
        'schraubdose.s2.h2': 'Zylinder wählen',
        'schraubdose.s2.h3': 'Auf die Fläche klicken',
        'schraubdose.s2.h4': 'Durchmesser und Höhe',

        'schraubdose.s3.title': 'Aushöhlen',
        'schraubdose.s3.text': '<p>Wähle den Zylinder und öffne <b>„Aushöhlen“</b> (Bereich <b>„Kanten &amp; Wände“</b>). Die Wände wachsen nach innen, außen bleibt das Maß.</p>' +
            '<ul><li><b>„Offene Seiten“</b>: nur <b>„Oben“</b> – unten bleibt der Boden.</li>' +
            '<li><b>„Wandstärke“</b>: 1,6–3 mm, z. B. 2 mm. Das Gewinde setzt außen auf und braucht mindestens 0,8 mm Wand.</li></ul>' +
            '<p>Dann <b>„Aushöhlen“</b> klicken.</p>',
        'schraubdose.s3.t1': 'Ausgehöhlt, nur oben offen',
        'schraubdose.s3.t2': 'Wandstärke etwa 2 mm',
        'schraubdose.s3.h1': 'Zylinder anklicken',
        'schraubdose.s3.h2': '„Aushöhlen“ öffnen',
        'schraubdose.s3.h3': 'Nur „Oben“ offen',
        'schraubdose.s3.h4': 'Wandstärke etwa 2 mm',
        'schraubdose.s3.h5': 'Auf „Aushöhlen“ klicken',

        'schraubdose.s4.title': 'Das Deckel-Werkzeug',
        'schraubdose.s4.text': '<p>Layerling baut Deckel passend zum Umriss einer oben offenen Form. Wähle die Dose und klicke auf <b>„Deckel“</b> (Bereich <b>„Kanten &amp; Wände“</b>).</p>' +
            '<p>Unter <b>„Art“</b> wählst du <b>„Aufgeschraubt“</b>: Die Dose bekommt oben außen ein Gewinde, der Deckel dasselbe innen im Rand – wie bei einem Schraubglas. Das geht nur bei runden Körpern.</p>',
        'schraubdose.s4.t1': 'Werkzeug „Deckel“ geöffnet',
        'schraubdose.s4.t2': 'Art „Aufgeschraubt“ gewählt',
        'schraubdose.s4.h1': 'Dose anklicken',
        'schraubdose.s4.h2': 'Auf „Deckel“ klicken',
        'schraubdose.s4.h3': '„Aufgeschraubt“ wählen',

        'schraubdose.s5.title': 'Spiel und Steigung',
        'schraubdose.s5.text': '<p>Gedruckte Teile werden nie ganz maßhaltig. Damit der Deckel sich drehen lässt, braucht das Gewinde <b>Spiel</b>: <b>„Spalt je Seite“</b>.</p>' +
            '<ul><li><b>„Passung“</b>: <b>„Normal 0,2“</b> passt für die meisten Drucker, <b>„Locker 0,3“</b> für ungenauere; <b>„Stramm 0,1“</b> klemmt oft.</li>' +
            '<li><b>„Gewindesteigung“</b> 3 mm und 2 <b>„Umdrehungen“</b> sind ein guter Start: Das Gewinde reicht 6 mm hinunter, die Flanken stehen 45° schräg und drucken ohne Stützen.</li></ul>' +
            '<p>Dann <b>„Deckel machen“</b>. Der Deckel liegt danach umgedreht neben der Dose.</p>',
        'schraubdose.s5.t1': 'Spiel 0,2–0,4 mm je Seite',
        'schraubdose.s5.t2': 'Schraubdeckel gemacht',
        'schraubdose.s5.h1': 'Werkzeug „Deckel“ öffnen',
        'schraubdose.s5.h2': '„Aufgeschraubt“ wählen',
        'schraubdose.s5.h3': 'Passung „Normal 0,2“',
        'schraubdose.s5.h4': 'Auf „Deckel machen“',

        'schraubdose.s6.title': 'Messen und ausrichten',
        'schraubdose.s6.text': '<p>Zwei Teile auf einer Druckplatte: Sie dürfen sich nicht berühren, sollen aber nicht unnötig weit auseinanderliegen. Ziel: <b>5 mm Abstand</b>.</p>' +
            '<ul><li><b>Messen:</b> <b>„Maßband“</b> in der Ansichtsleiste links → <b>„Maß hinzufügen“</b> → Punkt am Dosenrand, Punkt am Deckelrand. In der Maßblase <b>5</b> eintippen – der Deckel rückt genau auf diesen Abstand. (Alternativ: X-Position unter <b>„Position“</b> eintippen.)</li>' +
            '<li><b>Ausrichten:</b> beide wählen, <b>„Ausrichten“</b> (Bereich <b>„Anordnen“</b>, Taste <b>L</b>) und den Punkt „mittig“ quer zur Reihe anklicken.</li></ul>',
        'schraubdose.s6.t1': 'Abstand Dose–Deckel 4–6 mm',
        'schraubdose.s6.t2': 'Mittig auf einer Linie',
        'schraubdose.s6.t3': 'Beide stehen auf der Platte',
        'schraubdose.s6.h1': '„Maßband“: 5 mm Abstand',
        'schraubdose.s6.h2': 'Dose und Deckel wählen',
        'schraubdose.s6.h3': 'Auf „Ausrichten“ klicken',
        'schraubdose.s6.h4': 'Punkt „mittig“ anklicken',
        'schraubdose.s6.h5': 'Auf die Platte fallen lassen',

        'schraubdose.s7.title': 'Spiel prüfen',
        'schraubdose.s7.text': '<p>Vor dem Druck lässt du Layerling nachmessen: <b>„Spiel prüfen“</b> (Bereich <b>„Verbinden“</b>) findet Teile, die sich überschneiden oder berühren – die würden als ein Stück gedruckt – und Spalte, die enger sind als das <b>„Mindestspiel“</b>.</p>' +
            '<p>Ohne Auswahl prüft es alle sichtbaren Teile. Ziel: <b>„Keine Probleme“</b>.</p>',
        'schraubdose.s7.t1': '„Spiel prüfen“ meldet keine Probleme',
        'schraubdose.s7.t2': 'Zwei getrennte Druckteile',
        'schraubdose.s7.h1': '„Spiel prüfen“ öffnen',
        'schraubdose.s7.h2': '„Neu prüfen“ klicken',
        'schraubdose.s7.h3': 'Deckel weiter wegschieben',
        'schraubdose.s7.h4': 'Ins Leere klicken',

        'schraubdose.s8.title': 'Ins Gewinde schauen',
        'schraubdose.s8.text': '<p>Öffne die <b>„Schnittansicht“</b> in der Ansichtsleiste links. Sie schneidet die Ansicht auf – Entwurf und Export bleiben ganz.</p>' +
            '<p>Schau dir das Gewinde an der Dose und im Deckelrand an: 45°-Flanken, kein Überhang. Fällt dir auf, dass der Deckel mit der Platte nach unten liegt? So druckt er ohne Stützen.</p>',
        'schraubdose.s8.t1': 'Gewinde im Schnitt angeschaut',
        'schraubdose.s8.t2': 'Deckel liegt mit der Platte unten',
        'schraubdose.s8.h1': 'Schnittansicht öffnen',

        'schraubdose.s9.title': 'Exportieren',
        'schraubdose.s9.text': '<p>Beide Teile kommen in eine Datei: <b>„Exportieren“</b> (<b>Strg+E</b>) → <b>„STL exportieren“</b>. Im Slicer liegen Dose und Deckel dann nebeneinander, fertig zum Drucken.</p>' +
            '<p>Tipp: Druck erst einmal nur den Deckel und den oberen Ring der Dose als Passungstest, bevor du die ganze Dose druckst.</p>',
        'schraubdose.s9.t1': 'STL-Datei exportiert',
        'schraubdose.s9.h1': 'Auf „Exportieren“ klicken',
        'schraubdose.s9.h2': 'STL exportieren',

        'schraubdose.s10.title': 'Challenge',
        'schraubdose.s10.text': '<p>Ohne Hilfe – such dir eine Variante aus:</p>' +
            '<ul><li><b>Bajonett:</b> eine zweite Dose mit Deckel-Art <b>„Bajonett“</b> – aufstecken, drehen, einrasten.</li>' +
            '<li><b>Feingewinde:</b> <b>„Gewindesteigung“</b> 2 mm und 3 <b>„Umdrehungen“</b> – hält fester, braucht mehr Höhe.</li>' +
            '<li><b>Passungstest:</b> drei kleine Dosen mit 0,1 / 0,2 / 0,3 mm Spiel, um deinen Drucker kennenzulernen.</li></ul>',
        'schraubdose.s10.t1': 'Eine Variante gebaut',

        'schraubdose.s11.title': 'Geschafft!',
        'schraubdose.s11.text': '<p>Deine Dose hat ein echtes Gewinde mit Spiel – zwei Teile, die passen. 🎉</p>' +
            '<p>Ideen: Gewürzdose, Pillendose, Schraubenbox, Geocache-Behälter. Verziere den Deckel mit einem Muster (<b>„Oberfläche“</b>) oder einem eingravierten Namen.</p>',
        'schraubdose.s11.t1': 'Deckel verziert oder beschriftet',
        'schraubdose.s11.t2': 'Eigene Dose gebaut'
    });
})(typeof window !== 'undefined' ? window : globalThis);

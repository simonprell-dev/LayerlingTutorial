/* Kurstexte Deutsch für Kapitel „lesezeichen“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.de = Object.assign(LK.i18n.messages.de || {}, {
        'lesezeichen.s1.title': 'Was bauen wir?',
        'lesezeichen.s1.text': '<p>Du baust ein <b>Lesezeichen</b> mit deiner eigenen Umrissform und deinem eingravierten Namen.</p>' +
            '<p>Diesmal beginnst du nicht mit einer fertigen Form, sondern mit einer <b>Skizze</b>: einer flachen Zeichnung aus Punkten und Linien, die Layerling danach zu einem Körper herauszieht.</p>' +
            '<p>Du lernst: Skizze starten, Maße eintippen, den Umriss verändern, Ecken runden, die Skizze herausziehen und Schrift eingravieren.</p>' +
            '<p>Leg am besten einen <b>neuen, leeren Entwurf</b> an und klicke dann auf <b>Weiter</b>.</p>',
        'lesezeichen.s1.l1': 'Hier geht es zur Skizze',
        'lesezeichen.s1.l2': 'Deine Arbeitsfläche',

        'lesezeichen.s2.title': 'Eine Skizze starten',
        'lesezeichen.s2.text': '<ul><li>Klicke oben auf den Reiter <b>„Skizze“</b>.</li>' +
            '<li>Klicke auf <b>„Skizze extrudieren“</b>. <i>Extrudieren</i> heißt: Der Umriss wird später nach oben herausgezogen – wie Teig durch eine Form.</li>' +
            '<li>Klicke auf <b>„Skizzenform hinzufügen“</b> und wähle <b>„Rechteck“</b>.</li></ul>' +
            '<p>Das Rechteck ist der Anfang. Im nächsten Schritt bekommt es die richtige Größe.</p>',
        'lesezeichen.s2.t1': 'Skizze geöffnet',
        'lesezeichen.s2.t2': 'Rechteck in der Skizze',
        'lesezeichen.s2.h1': 'Auf „Skizze“ klicken',
        'lesezeichen.s2.h2': '„Skizze extrudieren“ klicken',
        'lesezeichen.s2.h3': 'Skizzenformen öffnen',
        'lesezeichen.s2.h4': '„Rechteck“ wählen',

        'lesezeichen.s3.title': 'Die richtige Größe',
        'lesezeichen.s3.text': '<p>Das Rechteck ist noch klein (20 × 20 mm). Ein Lesezeichen ist etwa <b>50 mm breit</b> und <b>150 mm lang</b>.</p>' +
            '<ul><li>Klicke <b>in das Rechteck</b>. Es bekommt einen Rahmen mit zwei Maßen.</li>' +
            '<li>Klicke auf das Maß <b>oben</b>, tippe <b>50</b> und drücke <b>Enter</b>.</li>' +
            '<li>Klicke auf das Maß <b>rechts</b>, tippe <b>150</b> und drücke <b>Enter</b>.</li></ul>' +
            '<p>Etwas größer oder kleiner ist auch in Ordnung.</p>',
        'lesezeichen.s3.t1': 'Umriss ist etwa 50 × 150 mm groß',
        'lesezeichen.s3.h1': 'In das Rechteck klicken',
        'lesezeichen.s3.h2': 'Hier 50 eintippen',
        'lesezeichen.s3.h3': 'Hier 150 eintippen',

        'lesezeichen.s4.title': 'Deine eigene Form',
        'lesezeichen.s4.text': '<p>Jetzt wird aus dem Rechteck deine eigene Form – zum Beispiel mit einer Kerbe unten, wie ein Schwalbenschwanz.</p>' +
            '<ul><li>Siehst du die untere Kante nicht? Zoome mit dem Mausrad oder mit <b>„−“</b> heraus.</li>' +
            '<li>Wähle <b>„Punkte setzen oder entfernen“</b> und klicke auf die Mitte der <b>unteren Kante</b>. Dort entsteht ein neuer Punkt.</li>' +
            '<li>Wähle <b>„Auswählen“</b> und zieh den neuen Punkt etwa 20 mm nach innen.</li></ul>' +
            '<p>Du kannst auch eine Spitze nach außen ziehen oder mehr Punkte setzen – Hauptsache, es ist deine Form.</p>',
        'lesezeichen.s4.t1': 'Umriss hat eine eigene Form',
        'lesezeichen.s4.h1': 'Erst herauszoomen',
        'lesezeichen.s4.h2': '„Punkte setzen“ wählen',
        'lesezeichen.s4.h3': 'Auf die untere Kante klicken',
        'lesezeichen.s4.h4': '„Auswählen“ wählen',
        'lesezeichen.s4.h5': 'Neuen Punkt nach innen ziehen',

        'lesezeichen.s5.title': 'Runde Ecken',
        'lesezeichen.s5.text': '<p>Spitze Ecken bleiben im Buch hängen. <b>Verrunden</b> macht aus einer Ecke einen kleinen Bogen.</p>' +
            '<ul><li>Klicke mit <b>„Auswählen“</b> in deine Form – dann sind alle Ecken gewählt. Für eine einzelne Ecke klickst du nur auf ihren Punkt.</li>' +
            '<li>Klicke auf <b>„Ecke verrunden“</b>.</li>' +
            '<li>Tippe bei <b>„Radius“</b> etwa <b>5</b> ein und drücke <b>Enter</b>.</li></ul>',
        'lesezeichen.s5.t1': 'Mindestens zwei Ecken gerundet',
        'lesezeichen.s5.h1': '„Auswählen“ wählen',
        'lesezeichen.s5.h2': 'In deine Form klicken',
        'lesezeichen.s5.h3': '„Ecke verrunden“ klicken',
        'lesezeichen.s5.h4': 'Radius 5, dann Enter',

        'lesezeichen.s6.title': 'Herausziehen',
        'lesezeichen.s6.text': '<p>Fertig gezeichnet? Klicke auf <b>„Skizze abschließen“</b>. Layerling zieht deinen Umriss nach oben heraus – zuerst 10 mm hoch.</p>' +
            '<p>Ein Lesezeichen muss dünn sein: Klicke es an und stell in den Eigenschaften die <b>Höhe</b> auf <b>2 mm</b> (mit Enter). ' +
            'Ist <b>„Proportionen beibehalten“</b> angehakt, nimm den Haken vorher weg.</p>' +
            '<p>Später noch etwas am Umriss ändern? Im Eigenschaften-Fenster gibt es <b>„Skizze bearbeiten“</b>.</p>',
        'lesezeichen.s6.t1': 'Aus der Skizze ist ein Körper geworden',
        'lesezeichen.s6.t2': 'Lesezeichen ist 1,5 bis 3 mm dünn',
        'lesezeichen.s6.h1': '„Skizze abschließen“ klicken',
        'lesezeichen.s6.h2': 'Lesezeichen anklicken',
        'lesezeichen.s6.h3': 'Erst diesen Haken wegnehmen',
        'lesezeichen.s6.h4': 'Höhe auf 2 mm',

        'lesezeichen.s7.title': 'Name eingravieren',
        'lesezeichen.s7.text': '<p>Eine <b>Gravur</b> ist Schrift, die in die Oberfläche hineingeschnitten ist. Dafür wird der Text zur <b>Aussparung</b> und ein Stück ins Lesezeichen gesenkt.</p>' +
            '<ul><li>Hol dir über <b>„Form hinzufügen“</b> einen <b>„Text“</b>, klicke damit aufs Lesezeichen und tippe deinen Namen.</li>' +
            '<li>Läuft der Name quer und ragt über den Rand? Dreh ihn (Text anklicken, zweimal <b>R</b>) oder mach die Buchstaben kleiner.</li>' +
            '<li>Klicke auf <b>„Aussparung“</b>.</li>' +
            '<li>Öffne die Karte <b>„Position“</b> und tippe bei <b>„Z (Höhe)“</b> eine <b>1</b> ein. Dann steckt die Schrift 1 mm tief im 2 mm dicken Lesezeichen – unten bleibt ein Boden stehen.</li>' +
            '<li>Wähle beides aus (<b>Strg+A</b>) und klicke auf <b>„Gruppieren“</b> (<b>Strg+G</b>). Erst jetzt wird die Schrift ausgeschnitten.</li></ul>',
        'lesezeichen.s7.t1': 'Name liegt ganz auf dem Lesezeichen',
        'lesezeichen.s7.t2': 'Text ist eine Aussparung',
        'lesezeichen.s7.t3': 'Schrift steckt im Lesezeichen, nicht ganz durch',
        'lesezeichen.s7.t4': 'Lesezeichen und Text sind gruppiert',
        'lesezeichen.s7.h1': 'Klicke auf „Form hinzufügen“',
        'lesezeichen.s7.h2': 'Text wählen',
        'lesezeichen.s7.h3': 'Aufs Lesezeichen klicken',
        'lesezeichen.s7.h4': 'Hier deinen Namen tippen',
        'lesezeichen.s7.h5': 'Text aufs Lesezeichen ziehen',
        'lesezeichen.s7.h6': 'Drehen: zweimal R oder hier 90',
        'lesezeichen.s7.h7': 'Buchstaben kleiner machen',
        'lesezeichen.s7.h8': 'Auf „Aussparung“ klicken',
        'lesezeichen.s7.h9': '„Z (Höhe)“ auf 1 mm',
        'lesezeichen.s7.h10': 'Alles auswählen (Strg+A)',
        'lesezeichen.s7.h11': 'Auf „Gruppieren“ klicken',

        'lesezeichen.s8.title': 'Rundum anschauen',
        'lesezeichen.s8.text': '<p>Dreh die Ansicht und schau dir die Gravur genau an. Klicke dazu auf die Seiten des <b>Ansichtswürfels</b> oder zieh mit der rechten Maustaste.</p>' +
            '<p>Prüfe: Ist die Schrift eingeschnitten und bleibt unten ein Boden? Sind die Ecken rund?</p>',
        'lesezeichen.s8.t1': 'Von oben und von der Seite angeschaut',
        'lesezeichen.s8.t2': 'Die Gravur geht nicht ganz durch',
        'lesezeichen.s8.h1': 'Ansicht hier drehen',

        'lesezeichen.s9.title': 'Für den Drucker speichern',
        'lesezeichen.s9.text': '<p>Klicke auf <b>„Exportieren“</b> (oder <b>Strg+E</b>) und dann auf <b>„STL exportieren“</b>.</p>' +
            '<p>Drucktipp: Das Lesezeichen liegt flach auf dem Druckbett. Wechselst du nach 1 mm die Farbe, leuchtet die Gravur in der ersten Farbe.</p>',
        'lesezeichen.s9.t1': 'STL-Datei exportiert',
        'lesezeichen.s9.h1': 'Auf „Exportieren“ klicken',
        'lesezeichen.s9.h2': 'STL exportieren',

        'lesezeichen.s10.title': 'Challenge',
        'lesezeichen.s10.text': '<p>Jetzt ohne Hilfe! Such dir eine Idee aus:</p>' +
            '<ul><li><b>Band-Loch:</b> Schneide oben ein rundes Loch für ein Bändchen – ein <b>„Zylinder“</b> als Aussparung, diesmal ganz durch.</li>' +
            '<li><b>Neuer Umriss:</b> Öffne mit <b>„Skizze bearbeiten“</b> deinen Umriss wieder und mach eine Spitze, eine Welle oder Zacken daraus.</li>' +
            '<li><b>Motiv:</b> Zeichne eine zweite Skizze mit einem <b>„Stern“</b> oder <b>„Kreis“</b> und graviere sie wie deinen Namen ein.</li></ul>' +
            '<p>Tipp: Mit Doppelklick auf eine Gruppe kannst du ihre Teile wieder bearbeiten.</p>',
        'lesezeichen.s10.t1': 'Eine Idee umgesetzt',

        'lesezeichen.s11.title': 'Geschafft!',
        'lesezeichen.s11.text': '<p>Dein Lesezeichen ist fertig. 🎉 Du kannst jetzt eigene Umrisse skizzieren, Ecken runden, Skizzen herausziehen und Schrift eingravieren.</p>' +
            '<p>Mit Skizzen geht noch viel mehr: ein Untersetzer in Blattform, ein Türschild als Wolke, ein Puzzleteil, eine Ausstechform.</p>' +
            '<p><b>Bonus:</b> Mit <b>„Linie“</b> zeichnest du ganz freie Umrisse – Punkt für Punkt, bis du wieder auf den ersten Punkt klickst.</p>',
        'lesezeichen.s11.t1': 'Mit „Linie“ eine Form gezeichnet',
        'lesezeichen.s11.t2': 'Eigene Idee gebaut'
    });
})(typeof window !== 'undefined' ? window : globalThis);

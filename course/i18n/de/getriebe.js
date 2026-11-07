/* Kurstexte Deutsch für Kapitel „getriebe“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.de = Object.assign(LK.i18n.messages.de || {}, {
        'getriebe.s1.title': 'Was bauen wir?',
        'getriebe.s1.text': '<p>Ein kleines <b>Kurbel-Getriebe</b> zum Drucken: Grundplatte mit zwei Achsen, ein Zahnrad mit 12 und eins mit 24 Zähnen, eine Kurbel am großen Rad.</p>' +
            '<p>Eine Kurbelumdrehung dreht das kleine Rad <b>zweimal</b> – Übersetzung 2:1.</p>' +
            '<p>Der Kern: der <b>Achsabstand</b>. Stimmt er, greifen die Zähne sauber ineinander. Am Ende verteilst du die Teile auf mehrere <b>Druckplatten</b>.</p>',
        'getriebe.s1.l1': 'Zahnräder, Quader, Zylinder',
        'getriebe.s1.l2': 'Druckplatten',
        'getriebe.s1.l3': 'Ansicht drehen',

        'getriebe.s2.title': 'Das kleine Rad',
        'getriebe.s2.text': '<p>Hol über <b>„Form hinzufügen“</b> ein <b>„Zahnrad“</b> und leg es ab.</p>' +
            '<p>In der Karte <b>„Verzahnung“</b> siehst du <b>„Zähne“</b> und <b>„Modul (mm)“</b>. Das <b>Modul</b> ist die Zahngröße: Außendurchmesser = Modul × (Zähne + 2). ' +
            'Neue Räder haben 12 Zähne und Modul 2 – also 28 mm. Lass die <b>„Zahnform“</b> auf <b>„Evolvente“</b>, nur damit greifen Räder sauber ineinander.</p>',
        'getriebe.s2.t1': 'Zahnrad abgelegt',
        'getriebe.s2.t2': 'Evolvente, etwa 12 Zähne (8–20)',
        'getriebe.s2.h1': 'Auf „Form hinzufügen“',
        'getriebe.s2.h2': '„Zahnrad“ wählen',
        'getriebe.s2.h3': 'Auf die Fläche klicken',
        'getriebe.s2.h4': 'Zahnform: „Evolvente“',
        'getriebe.s2.h5': 'Zähne einstellen',

        'getriebe.s3.title': 'Das große Rad',
        'getriebe.s3.text': '<p>Leg ein zweites <b>„Zahnrad“</b> daneben und gib ihm unter <b>„Zähne“</b> doppelt so viele: <b>24</b>.</p>' +
            '<p>Wichtig: Zwei Räder greifen nur ineinander, wenn sie <b>dasselbe Modul</b> haben. Ändere deshalb die Zähne, nicht die Größe – Layerling rechnet den Durchmesser selbst (2 × 26 = 52 mm).</p>',
        'getriebe.s3.t1': 'Rad mit doppelter Zähnezahl',
        'getriebe.s3.t2': 'Beide Räder: gleiches Modul',
        'getriebe.s3.h1': 'Auf „Form hinzufügen“',
        'getriebe.s3.h2': 'Noch ein „Zahnrad“',
        'getriebe.s3.h3': 'Daneben ablegen',
        'getriebe.s3.h4': 'Zähne verdoppeln',
        'getriebe.s3.h5': 'Gleiches Modul wie Rad 1',

        'getriebe.s4.title': 'Der Achsabstand',
        'getriebe.s4.text': '<p>Der Abstand der beiden Radmitten heißt <b>Achsabstand</b>:</p>' +
            '<p><b>Achsabstand = Modul × (Zähne 1 + Zähne 2) / 2</b> → 2 × (12 + 24) / 2 = <b>36 mm</b>.</p>' +
            '<p>Wähl beide Räder aus (Umschalt + Klick). Layerling zeigt dann den nötigen und den jetzigen Abstand. ' +
            'Ein Klick auf <b>„Zahnrad behalten, das andere anpassen“</b> rückt das andere Rad genau hin. Oder du tippst die Position unter <b>„Position“</b> selbst ein (X: 0 und 36).</p>',
        'getriebe.s4.t1': 'Räder stehen im Achsabstand',
        'getriebe.s4.h1': 'Beide Räder auswählen',
        'getriebe.s4.h2': 'Ein Rad behalten, anderes anpassen',

        'getriebe.s5.title': 'Grundplatte und Achsen',
        'getriebe.s5.text': '<p>Jetzt der Rahmen: ein <b>„Quader“</b> als Grundplatte, etwa 90 × 40 × 4 mm.</p>' +
            '<p>Darauf zwei <b>„Zylinder“</b> als Achsen – genau im <b>Achsabstand</b> (36 mm), z. B. über <b>„Position“</b>.</p>' +
            '<p><b>Spiel</b> heißt: Die Achse ist etwas dünner als die Bohrung, damit sich das Rad dreht. Die <b>„Mittelbohrung“</b> der Räder ist 6 mm, ' +
            'also nimm <b>5,5 mm</b> Durchmesser (0,2–1 mm weniger). Die Achsen müssen höher sein als das Rad dick ist, z. B. 10 mm.</p>',
        'getriebe.s5.t1': 'Grundplatte, etwa 90 × 40 × 4 mm',
        'getriebe.s5.t2': 'Zwei Achsen im Achsabstand',
        'getriebe.s5.t3': 'Achsen mit Spiel zur Bohrung',
        'getriebe.s5.t4': 'Achsen höher als die Räder',
        'getriebe.s5.h1': 'Auf „Form hinzufügen“',
        'getriebe.s5.h8': '„Quader“ wählen, ablegen',
        'getriebe.s5.h2': 'Plattenmaße eintippen',
        'getriebe.s5.h3': '„Zylinder“ als Achse holen',
        'getriebe.s5.h4': 'Auf die Platte setzen',
        'getriebe.s5.h5': 'Durchmesser etwa 5,5 mm',
        'getriebe.s5.h6': 'Achsen 36 mm auseinander',
        'getriebe.s5.h7': 'Achsen höher als die Räder',

        'getriebe.s6.title': 'Kurbel und Gruppen',
        'getriebe.s6.text': '<p>Klick einen <b>„Zylinder“</b> auf das <b>große Rad</b>, nahe am Rand – das ist der Kurbelgriff (etwa 6 mm dick, 15 mm hoch).</p>' +
            '<p>Damit beim Drucken je ein Teil entsteht, gruppierst du zweimal (<b>„Gruppieren“</b> oder <b>Strg+G</b>):</p>' +
            '<ul><li>großes Rad + Kurbel</li><li>Grundplatte + beide Achsen</li></ul>',
        'getriebe.s6.t1': 'Kurbel außermittig auf dem großen Rad',
        'getriebe.s6.t2': 'Kurbel und Rad gruppiert',
        'getriebe.s6.t3': 'Platte und Achsen gruppiert',
        'getriebe.s6.h1': '„Zylinder“ holen',
        'getriebe.s6.h2': 'Aufs große Rad, nahe am Rand',
        'getriebe.s6.h3': 'Rad und Kurbel auswählen',
        'getriebe.s6.h4': 'Auf „Gruppieren“ klicken',
        'getriebe.s6.h5': 'Platte und Achsen auswählen',
        'getriebe.s6.h6': 'Wieder „Gruppieren“',

        'getriebe.s7.title': 'Mehrere Druckplatten',
        'getriebe.s7.text': '<p>Zusammengebaut lässt sich das Getriebe nicht drucken. Darum kommen die Teile auf eigene <b>Druckplatten</b> – jede so groß wie die Arbeitsfläche.</p>' +
            '<ul><li>Klick oben auf <b>„Druckplatten“</b> (Bereich <b>„Anordnen“</b>): Unten erscheint die Plattenleiste.</li>' +
            '<li>Rechtsklick auf ein Zahnrad → <b>„Auf Platte …“</b> → <b>„Auf eine neue Platte“</b>. Das andere Rad kommt auf dieselbe neue Platte oder eine weitere.</li></ul>' +
            '<p>Jeder Platten-Knopf zeigt, wie viele Körper darauf stehen. Schau nach, dass kein Teil über den Rand seiner Platte ragt.</p>',
        'getriebe.s7.t1': 'Plattenleiste geöffnet',
        'getriebe.s7.t2': 'Teile auf mindestens zwei Platten',
        'getriebe.s7.t3': 'Nichts ragt über eine Platte (selbst prüfen)',
        'getriebe.s7.h1': 'Auf „Druckplatten“ klicken',
        'getriebe.s7.h2': 'Rechtsklick: „Auf Platte …“',
        'getriebe.s7.h3': 'Teile ganz auf die Platte',

        'getriebe.s8.title': 'Probedrehen',
        'getriebe.s8.text': '<p>Klick in der Plattenleiste auf <b>„Alle Platten zeigen“</b> und schau dir alles von oben und von der Seite an.</p>' +
            '<p>Prüf in Gedanken: Passt jedes Rad mit seiner Bohrung auf eine Achse? Steht die Kurbel am großen Rad? Wenn du druckst: Räder aufstecken, kurbeln – das kleine Rad dreht sich doppelt so schnell.</p>',
        'getriebe.s8.t1': 'Alle Platten angeschaut',
        'getriebe.s8.t2': 'Bohrungen und Achsen passen zusammen',
        'getriebe.s8.h1': 'Alle Platten zeigen',

        'getriebe.s9.title': 'Für den Drucker speichern',
        'getriebe.s9.text': '<p>Erst <b>Esc</b> drücken – ist etwas ausgewählt, exportiert Layerling nur die Auswahl.</p>' +
            '<p>Klick auf <b>„Exportieren“</b> (oder <b>Strg+E</b>). Bei mehreren Platten kannst du unter <b>„Platten“</b> <b>„Je Platte eine Datei (ZIP)“</b> wählen – dein Slicer öffnet jede Datei als eigene Platte.</p>' +
            '<p>Dann auf <b>„STL exportieren“</b>.</p>',
        'getriebe.s9.t1': 'Getriebe exportiert',
        'getriebe.s9.h1': 'Auf „Exportieren“ klicken',
        'getriebe.s9.h2': 'STL exportieren',

        'getriebe.s10.title': 'Challenge',
        'getriebe.s10.text': '<p>Jetzt ohne Hilfe! Such dir eine Idee aus:</p>' +
            '<ul><li><b>Zwischenrad:</b> Ein drittes Rad zwischen den beiden – dann dreht das kleine Rad in dieselbe Richtung wie die Kurbel. Achsabstände neu rechnen!</li>' +
            '<li><b>Mehr Untersetzung:</b> 12 zu 36 Zähne (3:1) – wie weit müssen die Achsen dann auseinander?</li>' +
            '<li><b>Achslöcher:</b> Statt fester Zapfen Löcher in die Platte (als <b>„Aussparung“</b>) und lose Stifte – mit Spiel.</li></ul>',
        'getriebe.s10.t1': 'Eine Idee umgesetzt',

        'getriebe.s11.title': 'Geschafft!',
        'getriebe.s11.text': '<p>Dein Getriebe ist fertig. ⚙️</p>' +
            '<p>Weiter geht’s: Schrägräder (<b>„Zahnradart“</b> → <b>„Schrägrad“</b>) laufen leiser, eine <b>„Zahnstange“</b> macht aus Drehen Schieben, ein <b>„Hohlrad“</b> ist der Anfang eines Planetengetriebes.</p>',
        'getriebe.s11.t1': 'Andere Zahnradart ausprobiert',
        'getriebe.s11.t2': 'Eigene Idee gebaut'
    });
})(typeof window !== 'undefined' ? window : globalThis);

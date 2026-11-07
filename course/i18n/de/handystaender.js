/* Kurstexte Deutsch für Kapitel „handystaender“. Gleiche Schlüssel in allen Sprachen (npm run check). */
(function (root) {
    'use strict';
    const LK = root.LK = root.LK || {};
    LK.i18n = LK.i18n || {messages: {}};
    LK.i18n.messages.de = Object.assign(LK.i18n.messages.de || {}, {
        'handystaender.s1.title': 'Was bauen wir?',
        'handystaender.s1.text': '<p>Du baust einen <b>Handyständer</b>. Statt ihn aus Quadern zusammenzusetzen, zeichnest du sein <b>Seitenprofil</b> in der <b>Skizze</b> – mit genauen Längen und Winkeln – und ziehst es zu einem Körper (<b>Extrudieren</b>).</p>' +
            '<p>Danach fast du die Kanten (<b>Fase</b> = schräg abgeschnittene Kante), prüfst mit <b>„Druck prüfen“</b> auf Überhänge und exportierst die STL.</p>' +
            '<p><b>Überhang</b> heißt: Eine Fläche zeigt nach unten und ist flacher als etwa 45° geneigt. Dort müsste der Drucker in die Luft drucken und bräuchte Stützen.</p>',
        'handystaender.s1.l1': 'Hier geht’s zur Skizze',
        'handystaender.s1.l2': 'Kanten fasen',
        'handystaender.s1.l3': 'Druck prüfen',

        'handystaender.s2.title': 'Profil skizzieren',
        'handystaender.s2.text': '<p>Wechsle oben in den Reiter <b>„Skizze“</b> und klicke auf <b>„Skizze extrudieren“</b>. Das Werkzeug <b>„Linie“</b> ist schon aktiv.</p>' +
            '<p>Klicke einen Startpunkt auf die Fläche. Jede weitere Linie tippst du als <b>Länge&lt;Winkel</b> und drückst <b>Enter</b> – 0° zeigt nach rechts, 90° nach oben. Das Profil (mm):</p>' +
            '<ul><li><b>80&lt;0</b> Boden, <b>6&lt;90</b>, <b>45&lt;180</b></li>' +
            '<li><b>90&lt;65</b> Lehne, 65° steil · <b>7&lt;180</b> · <b>90&lt;245</b> zurück nach unten</li>' +
            '<li><b>22&lt;180</b> Rinne fürs Handy · <b>10&lt;90</b> Lippe · <b>6&lt;180</b> · <b>16&lt;270</b> zum Start</li></ul>' +
            '<p>Die letzte Linie schließt den Umriss. Dann <b>„Skizze abschließen“</b>.</p>' +
            '<p>Vertippt? <b>„Skizze rückgängig“</b> im Bereich <b>„Verlauf“</b>. Später ändern: Körper anklicken → <b>„Skizze bearbeiten“</b>. Ein Klick auf eine Ecke zeigt dort den Winkel – anklicken und neu eintippen.</p>',
        'handystaender.s2.t1': 'Skizze zum Körper abgeschlossen',
        'handystaender.s2.t2': 'Lehne steht 60–75° schräg',
        'handystaender.s2.t3': 'Vorn hält eine Lippe das Handy',
        'handystaender.s2.h1': 'Reiter „Skizze“ öffnen',
        'handystaender.s2.h2': '„Skizze extrudieren“ klicken',
        'handystaender.s2.h3': 'Startpunkt klicken, dann 80<0 tippen',
        'handystaender.s2.h4': 'Umriss zu: „Skizze abschließen“',
        'handystaender.s2.h5': 'Winkel oder Lippe ändern',

        'handystaender.s3.title': 'Breite festlegen',
        'handystaender.s3.text': '<p>Der Körper ist erst 10 mm dick: So weit hat Layerling das Profil nach oben gezogen.</p>' +
            '<p>Klicke ihn an. Im Fenster <b>„Eigenschaften“</b> ist <b>„Höhe“</b> die Extrusion – hier also die <b>Breite</b> des Ständers. Tippe <b>70</b> ein; 60–90 mm passt für die meisten Handys.</p>' +
            '<p>Der Ständer liegt dabei auf der Seite. Das ist Absicht – warum, siehst du gleich.</p>',
        'handystaender.s3.t1': 'Ständer ist 60–90 mm breit',
        'handystaender.s3.h1': 'Ständer anklicken',
        'handystaender.s3.h2': 'Höhe = Breite: 70',

        'handystaender.s4.title': 'Kanten fasen',
        'handystaender.s4.text': '<p>Scharfe Kanten drücken in die Hand und brechen leicht aus. Eine <b>Fase</b> schneidet sie schräg ab.</p>' +
            '<ul><li>Ständer anklicken, dann im Bereich <b>„Kanten &amp; Wände“</b> auf <b>„Fase“</b>.</li>' +
            '<li><b>„Obere Kanten“</b> wählen, <b>„Abstand“</b> 1–2 mm.</li>' +
            '<li><b>„Anwenden“</b>, dann <b>„Fertig“</b>.</li></ul>' +
            '<p>Nur oben, weil die Unterseite flach auf der Druckplatte liegt. Faustregel: Unterkanten <b>nie runden</b> – eine Rundung unten hängt durch. Und mit <b>„Alle scharfen Kanten“</b> stoßen unten in den Ecken mehrere Fasen zusammen; dort entstehen kleine Überhänge.</p>' +
            '<p>Achtung: <b>„Skizze bearbeiten“</b> löscht die Fasen wieder, weil die Kanten neu entstehen.</p>',
        'handystaender.s4.t1': 'Kanten mit 1–3 mm gefast',
        'handystaender.s4.h1': 'Ständer anklicken',
        'handystaender.s4.h2': 'Werkzeug „Fase“',
        'handystaender.s4.h3': '„Obere Kanten“ wählen',
        'handystaender.s4.h4': 'Abstand 1–2 mm, „Anwenden“',
        'handystaender.s4.h5': 'Mit „Fertig“ schließen',

        'handystaender.s5.title': 'Aufstellen und anschauen',
        'handystaender.s5.text': '<p>Wie sieht der Ständer auf dem Tisch aus? Klicke ihn an und stell in der Karte <b>„Drehung“</b> den Wert <b>„Um X“</b> auf <b>90</b>. Schau ihn von allen Seiten an.</p>' +
            '<p>Überleg: Wo hätte er so im Drucker Überhänge? Und wo würden die Druckschichten liegen?</p>' +
            '<p>Leg ihn danach wieder aufs Profil: Werkzeug <b>„Auf Fläche legen“</b> (Bereich <b>„Anordnen“</b>) und die große Seitenfläche anklicken – oder <b>„Um X“</b> wieder auf 0.</p>',
        'handystaender.s5.t1': 'Aufgestellt und rundum angeschaut',
        'handystaender.s5.t2': 'Wieder aufs Profil gelegt',
        'handystaender.s5.h1': '„Um X“ auf 90',
        'handystaender.s5.h2': '„Auf Fläche legen“, Seite anklicken',

        'handystaender.s6.title': 'Druck prüfen',
        'handystaender.s6.text': '<p>Auf dem Profil liegend laufen alle Wände senkrecht nach oben: nichts hängt in der Luft. Und die Druckschichten gehen quer durch Lehne und Boden – so bricht die Lehne nicht ab.</p>' +
            '<p>Öffne <b>„Druck prüfen“</b> (Bereich <b>„Verbinden“</b>) und klicke auf <b>„Prüfen“</b>. Layerling sucht dünne Wände, schwebende Teile, wenig Halt, <b>Überhänge</b> und offene Netze.</p>' +
            '<p>Meldet die Zeile <b>„Überhänge“</b> etwas, hast du wohl <b>„Alle scharfen Kanten“</b> gefast. Nimm die Fase im Werkzeug <b>„Fase“</b> über <b>„Kantenbearbeitung zurücknehmen“</b> zurück und fase nur oben. Nach jeder Änderung: <b>„Neu prüfen“</b>.</p>',
        'handystaender.s6.t1': 'Ständer liegt auf seinem Profil',
        'handystaender.s6.t2': 'Druck prüfen: keine Überhänge',
        'handystaender.s6.h1': 'Aufs Profil legen: „Um X“ 0',
        'handystaender.s6.h2': '„Druck prüfen“ öffnen',
        'handystaender.s6.h3': 'Auf „Prüfen“ klicken',
        'handystaender.s6.h4': 'Überhang? Fase zurücknehmen, nur oben',

        'handystaender.s7.title': 'Für den Drucker speichern',
        'handystaender.s7.text': '<p>Klicke auf <b>„Exportieren“</b> (oder <b>Strg+E</b>) und dann auf <b>„STL exportieren“</b>.</p>' +
            '<p>Im Slicer liegt der Ständer schon richtig: Profil unten, keine Stützen nötig.</p>',
        'handystaender.s7.t1': 'STL-Datei exportiert',
        'handystaender.s7.h1': 'Auf „Exportieren“ klicken',
        'handystaender.s7.h2': 'STL exportieren',

        'handystaender.s8.title': 'Challenge',
        'handystaender.s8.text': '<p>Jetzt ohne Hilfe: ein <b>Kabelloch</b>, damit das Ladekabel unten durch die Lippe passt.</p>' +
            '<ul><li>Eine Form als <b>„Aussparung“</b> durch die Lippe legen und mit dem Ständer gruppieren.</li>' +
            '<li><b>„Druck prüfen“</b>: Ein runder Tunnel quer zur Druckrichtung hat oben einen Überhang.</li>' +
            '<li>Mach ihn druckbar – z. B. mit einem auf die Spitze gestellten Quader: Sein 45°-Dach druckt ohne Stützen.</li></ul>',
        'handystaender.s8.t1': 'Kabelloch gebaut, Druck ohne Überhang',

        'handystaender.s9.title': 'Geschafft!',
        'handystaender.s9.text': '<p>Du hast ein Profil mit exakten Winkeln skizziert, extrudiert, gefast und druckfertig geprüft. 🎉</p>' +
            '<p>Ideen: ein <b>Tablet-Ständer</b> mit längerer Lehne und 70°, ein Ständer für zwei Handys, die Ecken in der Skizze mit <b>„Ecke verrunden“</b> weicher machen oder deinen Namen in die Seite gravieren.</p>',
        'handystaender.s9.t1': 'Eine eigene Variante gebaut',
        'handystaender.s9.t2': 'Ständer gedruckt oder im Slicer angesehen'
    });
})(typeof window !== 'undefined' ? window : globalThis);

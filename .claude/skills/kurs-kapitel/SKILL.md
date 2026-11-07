---
name: kurs-kapitel
description: Schreibt neue Kapitel und Schritte für den Layerling-Einführungskurs dieser Browser-Erweiterung (course/course-data.js + course/i18n/*.js) – mit Texten für 8 bis 99 Jahre in allen Sprachen, automatischen Prüfungen und Zeige-Hinweisen. Verwende diesen Skill, wenn ein neues Kurs-Kapitel (z. B. eines der angekündigten 2–6), ein Kursschritt, eine Challenge oder eine Kursidee umgesetzt, ein Kapitel umgebaut oder Prüfungen bzw. Hinweise im Kurs geändert werden sollen.
---

# Kapitel für den Layerling-Einführungskurs schreiben

Der Kurs läuft als Browser-Erweiterung auf layerling.com. Inhalte stehen in
`course/course-data.js` (Struktur, Prüfungen, Hinweise) und `course/i18n/<sprache>.js` (alle
Texte). Die Engine prüft alle 250 ms die Formen des offenen Entwurfs. **Für ein neues Kapitel
werden nur diese Dateien plus ein Test geändert.** `lib/layerling-access.js` nur anfassen, wenn
ein Hinweis-Ziel fehlt – und das dann ausdrücklich sagen.

## Ablauf

1. **Verstehen:** Thema, Stufe (`neu` | `etwas` | `profi`), Lernziel und die Layerling-Werkzeuge
   klären. Fehlt etwas Wichtiges, kurz nachfragen; sonst sinnvoll annehmen und es sagen.
2. **Einlesen:** `course/course-data.js` (Hilfen oben, Kapitel 1 als Stilvorlage),
   `docs/layerling-interna.md` (Koordinaten, Gruppen, Selektoren) und
   [references/api.md](references/api.md).
3. **Knopfnamen nachschlagen:** in Layerlings Sprachdateien
   (`apps/web/src/lib/messages.de.ts`, `messages.en.ts` im Repo henmedia/layerling). Nie raten –
   z. B. heißt der Loch-Schalter „Aussparung“ / “Hole”.
4. **Planen:** Schrittfolge skizzieren und zeigen, bevor viel Code entsteht.
5. **Schreiben:** Kapitel nach [references/vorlage.js](references/vorlage.js) in `chapters`
   einsetzen (das „kommt bald“-Kapitel derselben `id` ersetzen), Texte in **jede** Sprachdatei.
6. **Testen:** Test nach dem Muster `tests/chapter1.test.mjs` schreiben – mindestens: fertiges
   Ergebnis erfüllt alle `learn`-Schritte, leere Szene keinen, typische Fehler (falsche Maße,
   Loch nicht durch) werden nicht abgehakt. Dann `npm test` und `npm run check` bis grün.
7. **Abschließen:** `CHANGELOG.md`, Kursübersicht in `README.md` und `docs/index.html` /
   `docs/en/index.html` aktualisieren. Dem Nutzer sagen, dass das Kapitel einmal im echten
   Editor durchgespielt werden muss (Erweiterung neu laden, Seite mit F5 aktualisieren).

## Aufbau eines Kapitels

6–12 Schritte, Ergebnis ist **ein fertiges Druckteil**:

1. `info` – Was bauen wir? Optional `labels` als Tour.
2. mehrere `learn` – je **ein** neuer Handgriff, das Teil wächst Schritt für Schritt
3. `game` – anschauen/ausprobieren, Selbst-Abhaken
4. `learn` – exportieren
5. `challenge` – Erweiterung ohne Hinweise (`autoHints: false`)
6. `creative` – Finale mit Ideen, Selbst-Abhaken

Den Schritt „Entwurf sichern“ zwischen Kapiteln fügt die Engine selbst ein.

## Regeln für Texte

- Du-Form, kurze Sätze, klar, aber nicht kindlich (8 bis 99). Fachwörter beim ersten Mal erklären.
- Layerling-Knöpfe fett in Anführungszeichen, so wie sie in der jeweiligen Sprache heißen:
  DE `<b>„Form hinzufügen“</b>`, EN `<b>“Add shape”</b>`. Tastenkürzel als Alternative nennen.
- `text` ist HTML (`<p>`, `<b>`, `<ul><li>`). Aufgaben ≤ 8 Wörter, Hinweise 2–6 Wörter.
- Schlüssel: `<kapitel>.title`, `<kapitel>.desc`, `<kapitel>.s<n>.title|text|t<i>|h<i>|l<i>`.

## Regeln für Prüfungen und Hinweise

- **Großzügig:** Bereiche statt fester Werte, lange/kurze Seite statt Breite/Tiefe
  (`c.size(s).long/short`), Drehung egal, eigene Wahl (Text, Farbe, Schrift) nie prüfen.
- Gruppen-Teile kommen über `c.shapes()` bereits in absoluten Koordinaten – Prüfungen müssen auch
  nach dem Gruppieren wahr bleiben (Vorgriff).
- „Neu in diesem Schritt“ mit `c.newShapes(kind)`, nicht über die Anzahl.
- Jeder Hinweis braucht `done(c)`; der erste nicht erledigte wird gezeigt. Beim Holen einer Form:
  `addShape` (done: Bibliothek offen oder `c.placing()`), `libItem:<art>` (done: `c.placing(art)`),
  `workplane` „auf die Fläche klicken“ (done: neue Form da).
- Nur Ziele aus `LK.access.TARGETS` verwenden; `toolbar:<werkzeug>` deckt alle
  `data-layerling-tool`-Werte ab, muss aber in `TARGETS` eingetragen werden.

## Typische Fehler

- Text-Platzhalter: Layerling setzt „TEXT“ ein – nicht als eigenen Text werten.
- Löcher, die nicht durchgehen: Unter- und Oberkante gegen die Platte prüfen (siehe `holeThrough`).
- Formenart falsch: Bibliotheks-Key und `kind` nachsehen (Liste in `docs/layerling-interna.md`).
- Schlüssel nur in einer Sprache angelegt → `npm run check` meldet es.

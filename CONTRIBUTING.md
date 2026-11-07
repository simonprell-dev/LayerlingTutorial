# Mitmachen

Danke, dass du helfen willst! Hier steht, wie das Projekt aufgebaut ist und wie du ein Kapitel
oder eine Sprache ergänzt.

## Aufbau

| Datei | Aufgabe |
|---|---|
| `background.js` | Symbol, Kontextmenü, registriert die Skripte für layerling.com |
| `lib/layerling-access.js` | **einziger** Zugriff auf Layerling-Interna (Formen, Ziele für die Hand) |
| `lib/geometry.js` | Hüllquader, Gruppen in absolute Koordinaten |
| `course/course-data.js` | Kapitel, Schritte, Aufgaben, Hinweise (nur Textschlüssel) |
| `course/i18n/<sprache>.js` | alle sichtbaren Texte einer Sprache |
| `course/context.js` | Prüf-Kontext `c` für Aufgaben und Hinweise |
| `course/flow.js` | Ablauf: Aufgaben auswerten, Hinweis wählen, Stufen |
| `course/course.js`, `panel.js`, `overlay.js`, `course.css` | Hauptschleife und Anzeige |
| `tools/check-course.mjs` | prüft Übersetzungen, Ziele, IDs (`npm run check`) |
| `tests/` | Unit-Tests (`npm test`, Node ≥ 20, keine Abhängigkeiten) |

Wie Layerling intern aussieht, steht in [docs/layerling-interna.md](docs/layerling-interna.md).

## Ein Kapitel schreiben

1. Kapitel in `course/course-data.js` ausarbeiten (Format im Kopfkommentar). Ein Kapitel hat
   6–12 Schritte und führt zu einem fertigen Druckteil: `info` → `learn` … → `game` →
   `challenge` → `creative`.
2. Jede `learn`-Aufgabe bekommt ein `check(c)`, jeder Hinweis ein `done(c)`. Großzügig prüfen:
   Bereiche statt fester Maße, Text nie über den Inhalt.
3. Alle Texte als Schlüssel `<kapitel>.s<n>.<feld>` in **jeder** Sprachdatei anlegen.
   Knopfnamen fett und so, wie Layerling sie in der Sprache nennt (in Layerlings
   `apps/web/src/lib/messages.<sprache>.ts` nachschlagen).
4. Tests in `tests/` ergänzen (Vorlage: `tests/chapter1.test.mjs`).
5. `npm test` und `npm run check` müssen grün sein.
6. Einmal im echten Editor durchspielen (Erweiterung neu laden, Seite mit F5 aktualisieren).
7. `CHANGELOG.md` und die Kursübersicht im `README.md` ergänzen.

Mit Claude Code hilft der Skill [`kurs-kapitel`](.claude/skills/kurs-kapitel/SKILL.md).

## Eine Sprache hinzufügen

1. `course/i18n/en.js` nach `course/i18n/<code>.js` kopieren (`<code>` wie in Layerling, z. B.
   `fr`, `pt-br`) und `LK.i18n.messages.en` durch `LK.i18n.messages['<code>']` ersetzen.
2. Alle Texte übersetzen. Knopfnamen aus Layerlings Sprachdatei übernehmen.
3. Datei in `background.js` (Liste `PAGE_SCRIPTS.js`) hinter `course/i18n/en.js` eintragen und in
   `tests/background.test.mjs` die erwartete Liste ergänzen.
4. Optional: `_locales/<code>/messages.json` für Store-Name und Menütexte.
5. `npm test` und `npm run check`.

## Wenn Layerling sich ändert

Meldet der Kurs „Diese Layerling-Version kenne ich noch nicht“ oder zeigt die Hand ins Leere:
nur `lib/layerling-access.js` anpassen, `docs/layerling-interna.md` aktualisieren und
`health()` im Browser prüfen (`LK.access.health()` in der Konsole von layerling.com).

<p align="center"><img src="icons/icon-128.png" width="96" alt=""></p>

# Einführungskurs für Layerling

**Ein geführter 3D-Konstruktionskurs direkt im Web-CAD [Layerling](https://layerling.com/) – für 8 bis 99 Jahre.**

Eine freie Browser-Erweiterung für Chrome, Edge und Brave. Sie blendet im Layerling-Editor ein
kleines Kursfenster ein: Schritt für Schritt, mit einer Hand, die zeigt, wohin man klicken soll,
und Aufgaben, die sich von selbst abhaken, sobald sie erledigt sind. Am Ende jedes Kapitels steht
ein fertiges Teil für den 3D-Drucker.

> Unabhängiges Projekt – nicht mit Layerling oder henmedia verbunden. Layerling selbst ist frei
> und quelloffen: <https://github.com/henmedia/layerling>.

*English summary at the end.*

## Warum?

Layerling ist so einfach wie Tinkercad, kann aber deutlich mehr – und läuft ohne Konto direkt im
Browser. Was fehlt, ist ein roter Faden für den Einstieg: Welche Form hole ich zuerst? Wie tippe
ich genaue Maße ein? Wie wird aus drei Formen ein Teil mit Loch? Der Kurs beantwortet das im
Editor selbst, nicht in einem zweiten Fenster.

Die Erklärlogik stammt aus dem [Einführungskurs für Scratch](https://simonprell-dev.github.io/scratchExtention/).

## Inhalt

- **Geführter Kurs** mit Kapiteln, die jeweils zu einem fertigen Druckteil führen.
- **Zeige-Hinweise:** Eine Hand zeigt auf den richtigen Knopf – auch wenn er in einem
  eingeklappten Bereich der Werkzeugleiste oder des Eigenschaften-Fensters steckt.
- **Automatisch abgehakt:** Die Erweiterung erkennt Formen, Maße, Löcher und Gruppen selbst
  und feiert mit Konfetti. Die Prüfungen sind großzügig – 68 mm statt 70 mm sind kein Fehler.
- **Drei Einstiegsstufen:** „Neu dabei“ (Hand zeigt jeden Klick), „Schon mal 3D gemacht“ und
  „Ich kenne Tinkercad o. Ä.“ (Hand nur auf Knopfdruck 👆).
- **Mehrsprachig:** Deutsch und Englisch; der Kurs folgt der Sprache, die in Layerling eingestellt
  ist. Weitere Sprachen sind eine einzelne Übersetzungsdatei (siehe [Mitmachen](#mitmachen)).
- **Datenschutzfreundlich:** kein Konto, kein Server, keine Datenübertragung.

## Kursübersicht

| # | Kapitel | Stufe | Was man lernt |
|---|---|---|---|
| 1 | 🏷️ **Dein Namensschild** | Neu dabei | Formen holen, Maße eintippen, Text auf eine Platte setzen, Aussparung als Loch, gruppieren, als STL exportieren |
| 2 | 🔖 **Lesezeichen mit eigener Form** | Schon mal 3D gemacht | Skizze, eigene Umrissform, Ecken verrunden, extrudieren, Namen eingravieren |
| 3 | ✏️ **Stiftebecher** | Schon mal 3D gemacht | Aushöhlen, Rand abrunden, Lochmuster rundherum |
| 4 | 📱 **Handyständer** | Ich kenne Tinkercad o. Ä. | Profil mit Länge<Winkel skizzieren, fasen, aufstellen, Druck-Prüfung (Überhänge) |
| 5 | 🫙 **Dose mit Schraubdeckel** | Ich kenne Tinkercad o. Ä. | Aushöhlen, Schraubdeckel mit Gewinde und Spiel, messen, ausrichten, Spiel prüfen |
| 6 | ⚙️ **Kurbel-Getriebe** | Ich kenne Tinkercad o. Ä. | Zahnräder mit Modul, Achsabstand, Achsen mit Spiel, Kurbel, mehrere Druckplatten |

Version 0.1.0: alle sechs Kapitel mit zusammen 63 Schritten.

## Installation

1. Erweiterung im Chrome Web Store bzw. bei Edge-Add-ons hinzufügen.
2. Über das Puzzle-Symbol anheften.
3. Auf das Symbol klicken – Layerling öffnet sich.
4. Unten links auf **🎓 Kurs starten** klicken und eine Stufe wählen.

### Ohne Store installieren (z. B. für verwaltete Schulrechner)

1. Unter [Releases](https://github.com/simonprell-dev/layerlingExtention/releases) die Datei
   `einfuehrungskurs-layerling-vX.Y.Z.zip` laden und entpacken.
2. `chrome://extensions` (bzw. `edge://extensions`) öffnen, **Entwicklermodus** einschalten.
3. **Entpackte Erweiterung laden** und den entpackten Ordner wählen.

## Benutzung

### Das Symbol in der Browserleiste

- **Klick:** öffnet layerling.com oder holt einen offenen Layerling-Tab nach vorn.
- **Rechtsklick:** *Erweiterung eingeschaltet* (an/aus – ausgeschaltet zeigt das Symbol „AUS“),
  *Lernfortschritt zurücksetzen …* (mit Rückfrage; Entwürfe bleiben erhalten), *Hilfe*.

### Das Kursfenster

- Kopfzeile: ☰ Kursübersicht, 👆 Hinweise an/aus, × schließen. Das Fenster lässt sich an der
  Kopfzeile verschieben.
- **Aufgaben** haken sich selbst ab. Aufgaben, die die Erweiterung nicht sehen kann (z. B.
  „Von allen Seiten angeschaut“), hakt man durch Anklicken selbst ab.
- **Weiter** leuchtet, sobald ein Schritt geschafft ist. Man kann aber jederzeit weiter- oder
  zurückblättern.
- Zwischen zwei Kapiteln kommt der Schritt **„Entwurf sichern“**: exportieren und einen neuen
  Entwurf anlegen, damit die Prüfungen nur das neue Projekt sehen.

### Schritt-Arten

| Abzeichen | Bedeutung |
|---|---|
| Info | Worum geht es? Kurze Tour mit Beschriftungen |
| Lernen | Ein neuer Handgriff, wird automatisch geprüft |
| Ausprobieren | Anschauen, drehen, testen |
| Challenge | Ohne Hinweise selbst umsetzen |
| Kreativ | Eigene Ideen, selbst abhaken |

## Tipps für Lehrkräfte

- Layerling speichert Entwürfe im Browser. Auf geteilten Rechnern am Ende **Exportieren → LYL**
  oder auf der Startseite **Alle sichern** nutzen.
- Selbst abgehakte Aufgaben (Challenge, Kreativ) kurz anschauen.
- Wer schneller ist, wählt die Stufe „Ich kenne Tinkercad o. Ä.“: Dann erscheint die Hand nur
  auf Knopfdruck.

## Problemlösung

- **Kein „Kurs starten“-Knopf?** Seite neu laden (F5). Prüfen, ob die Erweiterung eingeschaltet
  ist (Rechtsklick aufs Symbol).
- **„Diese Layerling-Version kenne ich noch nicht“:** Layerling wurde aktualisiert und die
  Erweiterung findet die Formen nicht mehr. Der Kurs läuft weiter, die Aufgaben hakt man selbst
  ab. Bitte als [Fehler melden](https://github.com/simonprell-dev/layerlingExtention/issues/new/choose).
- **Aufgabe hakt sich nicht ab:** Maße und Lage vergleichen (z. B. muss das Loch die Platte ganz
  durchdringen). Notfalls weiterblättern.

## Datenschutz

Die Erweiterung läuft nur auf `https://layerling.com/`. Sie sammelt keine Daten, hat keinen
Server und kein Konto und überträgt nichts. Gespeichert werden nur Kursfortschritt und
Einstellungen im Browser (`localStorage` von layerling.com, `chrome.storage.local`). Sie liest
die Formen des geöffneten Entwurfs nur, um Aufgaben zu prüfen, und verändert sie nie.

## Mitmachen

- **Fehler und Ideen:** über die [Issue-Vorlagen](https://github.com/simonprell-dev/layerlingExtention/issues/new/choose).
- **Neue Kapitel:** siehe [CONTRIBUTING.md](CONTRIBUTING.md) und den Claude-Code-Skill
  [`.claude/skills/kurs-kapitel`](.claude/skills/kurs-kapitel/SKILL.md).
- **Neue Sprache:** `course/i18n/en.js` kopieren, übersetzen, in `background.js` eintragen,
  `npm run check` ausführen. Knopfnamen so schreiben, wie Layerling sie in dieser Sprache nennt.
- Vorschlag: Nach dem Erscheinen einen freundlichen Hinweis in den
  [Layerling-Discussions](https://github.com/henmedia/layerling/discussions) posten, damit die
  Layerling-Entwicklung von der Erweiterung weiß.

Entwickeln: `npm test` (Unit-Tests, Node ≥ 20), `npm run check` (Kursinhalte). Wie die
Erweiterung Layerling ausliest, steht in [docs/layerling-interna.md](docs/layerling-interna.md).

## Lizenz und Danksagung

MIT – siehe [LICENSE](LICENSE). Danke an das Layerling-Team für einen freien, offenen 3D-Editor.

## English summary

**Intro Course for Layerling** is a free browser extension (Chrome, Edge, Brave) that adds a
guided 3D design course right inside the [Layerling](https://layerling.com/) web CAD, for ages
8 to 99. A pointing hand shows where to click, tasks tick themselves off when done, and every
chapter ends with a printable part. Six chapters are available: name tag, bookmark,
pen holder, phone stand, jar with screw lid and crank gearbox. The course follows Layerling’s language setting (German and English so far; other
languages are a single translation file). No account, no server, no data collection.
Independent project, not affiliated with Layerling.

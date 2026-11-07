# Abnahme 0.1.0 (2026-11-07)

Geprüft gegen Abschnitt 14 des Designs, auf https://layerling.com/ (Layerling v1.150.0).
Werkzeug: Playwright mit installiertem Chrome (Skripte in die Seite gelegt wie von der
Erweiterung) und Edge (Erweiterung echt entpackt geladen).

| Abnahmepunkt | Ergebnis |
|---|---|
| Kapitel 1 auf Deutsch von Anfang bis Ende, alle `learn`-Schritte haken automatisch ab | ✔ Schritt 1–12 durchgespielt, Konfetti, „Kapitel geschafft!“ |
| Kapitel 1 auf Englisch | ✔ Schritt 1–12 durchgespielt. In einem Lauf lag das Loch neben der Platte: Aufgabe „goes all the way through“ blieb offen, der Hinweis „Move it to a corner“ erschien – richtiges Verhalten |
| Sprache in Layerling umstellen → Kursfenster wechselt mit | ✔ en → de zur Laufzeit |
| Sprache ohne Übersetzung → Englisch | ✔ `ja` → Englisch |
| Erweiterung aus → keine Spur im Editor | ✔ (Edge): Badge „AUS“, kein Start-Knopf, kein `window.LK` |
| Fortschritt zurücksetzen | ✔ mit Rückfrage; ohne offenen Tab beim nächsten Besuch nachgeholt |
| Simulierter Fehlschlag des Formen-Zugriffs → freundliche Meldung, Selbst-Abhaken | ✔ Meldung nach 3 s, Aufgaben per Klick abhakbar |
| Neu laden mitten im Kapitel → Fortschritt bleibt | ✔ |
| Stufe „Schon mal 3D gemacht“: Hand nur über 👆 | ✔ |
| `npm test`, `npm run check` | ✔ 85 Tests, „Alles ok. 6 Kapitel, 12 Schritte, Sprachen: de, en“ |
| Projektseite bei 375 px und 1280 px, hell und dunkel, ohne waagerechtes Scrollen | ✔ DE und EN |

## Funde aus der Live-Prüfung (eingebaut)

- Formen liegen in Layerling als Props `{shapes, selectedIds, cruiseAsset}` vor; Gruppen-Teile
  haben **relative** Koordinaten.
- Im Ablege-Modus (Form hängt an der Maus) zeigt der Hinweis jetzt auf die Arbeitsfläche.
- Werkzeugbereiche und Eigenschaften-Karten können eingeklappt sein → die Hand zeigt dann auf den
  Bereichs- bzw. Kartenkopf.
- Ein Zylinder landete bei −9,5 bis 0,5 mm und hätte die Platte nicht durchbohrt → Schritt 7
  prüft „geht ganz durch“ und zeigt auf „Auf die Arbeitsebene fallen lassen“.
- „Proportionen beibehalten“ kann angehakt sein (der Quader wurde 3 × 3 × 3 mm) → Satz im Text
  und eigener Hinweis in Schritt 4.

## Nicht automatisch geprüft – bitte einmal von Hand

- Klick aufs Symbol in Chrome (öffnet/holt layerling.com). Chrome stable lädt entpackte
  Erweiterungen nicht per Kommandozeile; in Edge ist das Hintergrundskript geprüft.
- Ein echter Druck des exportierten STL.
- Dunkles Layerling-Farbschema (Kursfenster schaltet über die Hintergrundhelligkeit um).

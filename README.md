# Brabbel v5.42 – Duell-Feinschliff und Beutelanzeige

## Start
1. ZIP entpacken.
2. Ordner in einem lokalen Webserver öffnen, z. B. `python -m http.server 8000`.
3. Am PC: `http://localhost:8000`.
4. Am Android-Tablet im gleichen WLAN: `http://DEINE-PC-IP:8000`.
5. Chrome-Menü → Zum Startbildschirm hinzufügen.

## Enthalten
- Hauptmenü, Spielername, Neues Spiel, Fortsetzen, Bestenliste, App beenden
- 3 Speicherplätze
- 9×9-Brett mit Mitte
- Modi: leeres Brett / mit Startbuchstaben
- 7 Handbuchstaben, gewichtete deutsche Verteilung, Ä Ö Ü ß und QU
- max. 3 gleiche Buchstaben auf der Hand
- Zugvorschau und letzter Zug
- Wortprüfung mit persönlichem Wortschatz
- Überlegen ab Runde 2
- Passe

## Grenzen
- Demo-Wörterbuch ist klein.
- Noch keine echte APK.
- Wortlogik ist ein Prototyp und braucht später Tests für Randfälle.


## Änderungen in v2.1

- Neu gelegte oder überlegte Buchstaben können durch Antippen einzeln zurück in die Buchstabenleiste gelegt werden.
- Die Koordinaten hinter den gelegten Buchstaben wurden aus der Zugvorschau entfernt.
- Nach erfolgreichem Zug erscheint ein kurzer Lob-Spruch.
- „Zug zurücknehmen“ zeigt jetzt eine Info, wenn noch nichts gelegt wurde.
- „Passe“ fragt nach Bestätigung, beendet die Runde direkt und gibt 7 neue Buchstaben aus.


## Neu in v3

- Erweitertes lokales Prototyp-Wörterbuch mit 1238 Einträgen.
- Persönlicher Wortschatz im Hauptmenü.
- Eigene Wörter können manuell hinzugefügt und gelöscht werden.
- Normalisierung: Ä/AE, Ö/OE, Ü/UE und ß/SS werden gleich behandelt.
- Wörter aus dem Dialog "Wort verifizieren" werden ebenfalls im persönlichen Wortschatz gespeichert.

## Wichtig

Das eingebaute Wörterbuch ist weiterhin ein Prototyp-Wörterbuch. Für eine spätere Produktversion sollte Hunspell/igerman98 oder eine ähnlich geeignete freie deutsche Wortliste aufbereitet und lizenziert eingebunden werden.


## Neu in v4

- Lokale Wortliste aus @cspell/dict-de-de 4.1.2, basierend auf de-DE_frami / igerman98.
- Gefiltert für den Prototyp: alphabetische Wörter, Länge 2 bis 12, ohne Bindestrich/Apostroph.
- Normalisierte Prüfung: Ä/AE, Ö/OE, Ü/UE, ß/SS.
- Enthaltene Wörterbuch-Einträge nach Filterung: 322286.
- Lizenzhinweise liegen im Ordner `licenses/`.

## Warum gefiltert?

Das ursprüngliche Wörterbuch enthält sehr viele Formen und Zusammensetzungen. Für ein Tablet-Spiel ist eine kleinere, lokale Liste schneller und spielbarer. Längere Wörter und weitere Formen können später wieder ergänzt werden.

## Lizenzhinweis

Die v4 enthält Wörterbuchdaten aus @cspell/dict-de-de, das auf de-DE_frami / igerman98 verweist. Die zugehörigen Lizenzdateien wurden beigelegt. Vor Veröffentlichung im App Store oder außerhalb privater Tests sollte die Lizenzfrage final geprüft werden.


## Neu in v4.1

- Bugfix: Menüpunkt "Wortschatz" öffnet jetzt wieder die Wortschatz-Verwaltung.
- Persönlicher Wortschatz zeigt Anzahl der eigenen Wörter.
- Suchfeld im persönlichen Wortschatz.
- Wörter können gelöscht werden.
- Export als JSON-Datei.
- Import aus einer zuvor exportierten JSON-Datei.

## Neu in v4.4

Diese Version setzt wieder auf die stabile v4.1-Logik.

- Keine Änderungen an Zugabschluss, Passe, Dialogen oder Wortprüfung.
- Sichere CSS-Animationen:
  - Steine erscheinen sanft.
  - neu gelegte/überlegte Felder leuchten sanft.
  - Dialoge blenden weich ein.
- Einstellung: Animationen ein/aus.

Nicht enthalten in v4.4:
- Punkte-Popup.
- Erfolgsanimation nach finalem Zugabschluss.
- Wackeln bei ungültigem Zug.

Diese Effekte werden erst wieder eingebaut, wenn die Spielereignisse sauber testbar sind.


## Neu in v4.6 Seniorenfreundlich

- Dezente Steinausteilung (ca. 420 ms)
- Sanftes Hervorheben neuer Buchstaben
- Etwas stärkere Hervorhebung überlegter Steine
- Ruhige Dialoganimation
- Keine übertriebenen Bewegungen oder Rotation

## Neu in v5.1 Punkte-Fix

- Punktesystem auf stabiler v4.6-Basis neu eingebaut.
- Syntaxgeprüftes JavaScript.
- Dialoge, Passe und Zugabschluss bleiben auf der stabilen Logik.
- Buchstabenwerte, Längenbonus, Handbonus, Überlegebonus und Kombobonus.
- Punkteaufschlüsselung in Zugvorschau und letzter Zug.

## Neu in v5.2 Dialogfix

- Dialog-Buttons für Passe und Wort-Verifizierung repariert.
- Buttons haben jetzt type="button" und zusätzliche direkte Fallback-Aktionen.
- Service Worker aktualisiert alte Caches aggressiver, damit keine veralteten Dateien geladen werden.

Falls nach einem Update weiterhin alte Fehler auftauchen: Browser-Cache leeren oder die PWA einmal vom Startbildschirm entfernen und neu hinzufügen.

## Neu in v5.4 Layout links

- Spielfeld steht oben links.
- Rechts daneben steht die Statusbox mit Wortwandler, Punkten und Runde.
- Darunter rechts: Zug zurücknehmen, Zug abschließen, Passe.
- Darunter rechts: Zugvorschau ohne Scrollbar.
- Die Punktebewertung wird in der Zugvorschau dauerhaft angezeigt, zu Beginn mit 0 Punkten.
- Darunter rechts: Letzter Zug als kompaktere Box.
- Ganz unten rechts: Spiel speichern und Spiel beenden.

## Neu in v5.5 Layout-Aufräumung

- Spiel speichern und Spiel beenden liegen jetzt unter den Spielsteinen.
- Beide Buttons nutzen die volle Brettbreite.
- Die rechte Spalte enthält nur noch:
  - Status
  - Zug zurücknehmen / Zug abschließen / Passe
  - Zugvorschau
  - Letzter Zug
- Zugvorschau wurde etwas größer geplant.
- Letzter Zug wurde kompakter gehalten.

## Neu in v5.6

- Verbesserte Steinverteilung:
  - mindestens 1 Vokal
  - mindestens 2 Konsonanten
  - maximal 4 Vokale
  - maximal 3 gleiche Buchstaben
- Untere Navigation geändert:
  - links: Zum Hauptmenü
  - rechts: Spiel speichern
- Punktwerte werden rechts unten auf Handsteinen und Brettsteinen angezeigt.

## Neu in v5.7 Spielstruktur

- Startauswahl trennt jetzt Spielbrett, Brettgröße und Spielende.
- Brettgrößen: 9×9, 11×11 und 13×13.
- Spielende: Endlos, Rundenbasiert oder Klassisch.
- Rundenbasiert: 10 bis 100 Runden.
- Klassisch: begrenzter Buchstabenbeutel abhängig von der Brettgröße.
  - 9×9: 60 Steine
  - 11×11: 84 Steine
  - 13×13: 108 Steine
- Klassisch endet automatisch erst, wenn Beutel und Hand leer sind.
- „Zum Hauptmenü“ fragt jetzt nach, bevor das Spiel beendet und in die Bestenliste eingetragen wird.

## Neu in v5.8 Sortierung

- Handsteine können sortiert werden:
  - ABC: alphabetisch
  - Wert: hohe Punktwerte zuerst
  - Vokale: Vokale zuerst, danach Konsonanten
- Sortieren setzt die aktuelle Auswahl zurück, verändert aber keine gelegten Steine auf dem Brett.

## Neu in v5.9 Handsteine ordnen

- Handsteine können frei per Ziehen nach links oder rechts verschoben werden.
- Ein normaler kurzer Tipp wählt weiterhin einen Stein zum Legen aus.
- Die Schnell-Sortierungen ABC, Wert und Vokale bleiben zusätzlich erhalten.

## Neu in v5.10 Drag & Drop aufs Brett

- Handsteine können zusätzlich per Ziehen direkt auf ein Brettfeld gelegt werden.
- Die bisherige Bedienung bleibt erhalten: Stein antippen, Feld antippen.
- Das freie Ordnen der Handsteine per Ziehen bleibt erhalten.
- Beim Ziehen wird das Brett optisch hervorgehoben.

## Neu in v5.11 Kachelzentrierung

- Buchstaben auf Brett- und Handkacheln werden wieder exakt mittig positioniert.
- Punktwerte bleiben rechts unten sichtbar.

## Neu in v5.12 Buttonfix

- Spiel speichern reagiert wieder zuverlässig.
- Zum Hauptmenü nutzt eine robustere Bestätigung und kehrt danach sicher ins Menü zurück.
- Untere Aktionsbuttons sind explizit als Button-Elemente gesetzt und gegen Überlagerungen abgesichert.

## Neu in v5.13 Aufgeben

- In der klassischen Variante erscheint „Aufgeben“, wenn der Buchstabenbeutel leer ist und noch Handsteine übrig sind.
- Beim Aufgeben wird der Punktwert der verbliebenen Handsteine vom Gesamtstand abgezogen.
- „Zum Hauptmenü“ nutzt in dieser Situation ebenfalls die Aufgeben-Logik, damit der Abzug nicht umgangen wird.

## Neu in v5.14 Navigation und Speicherstände

- Beim Wechsel zu Menüs wie Speichern, Bestenliste oder Hauptmenü springt die Ansicht wieder nach oben.
- Die Bestenliste ist auf 10 Einträge begrenzt.
- Speicherstände können jetzt gelöscht werden.

## Neu in v5.15 Tablet-Feinschliff

- Tablet-Layout kompakter gemacht, damit die rechte Spalte bei 100% Zoom neben dem Brett bleibt.
- Besonders für iPad und größere Android-/Samsung-Tablets optimiert.
- Beim Ziehen eines Handsteins erscheint jetzt ein sichtbarer Stein direkt am Finger bzw. Mauszeiger.
- Zielfelder auf dem Brett werden beim Ziehen weiterhin hervorgehoben.

## Neu in v5.16

- 11×11- und 13×13-Bretter laufen auf Tablets nicht mehr in die rechte Spalte hinein.
- Die Brettfelder skalieren kompakter und bleiben innerhalb des Spielfeldrahmens.
- Spiele mit 0 Punkten werden nicht mehr in die Bestenliste eingetragen.
- Die Bestenliste zeigt nun Datum und Uhrzeit.

## Neu in v5.17

- Neue Menüseite „Spielregeln“.
- Neue Menüseite „Über“.
- Über-Seite enthält Version, Datum, Autor, Wortschatz, Buchstabenwerte, klassische Beutelverteilungen und Speicherhinweise.
- Spielregeln erklären Start, Legen, Wandeln, unbekannte Wörter, Spielende und Punktewertung.

## Neu in v5.18

- Zugleiste mit Zurücknehmen, Zug abschließen und Passe liegt nun direkt unter dem Brett.
- Rechte Info-Spalte kann ein- und ausgeblendet werden.
- Eingeklappte Info-Spalte gibt dem Brett mehr Platz, besonders für 11×11 und 13×13.
- Optionaler 2-Finger-Tipp auf das Brett schließt den Zug ab.
- Der 2-Finger-Tipp kann in den Einstellungen deaktiviert werden.
- Einstellungen wurden nebenbei repariert: Animationen und 2-Finger-Tipp speichern zuverlässig.

## Neu in v5.19

- Menüseiten blenden das Spielfeld jetzt wirklich aus.
- Nach „Zum Hauptmenü“, Speichern, Spielregeln, Über usw. bleibt das Brett nicht mehr unterhalb sichtbar.
- Buchstaben auf gelegten Steinen sind bei 11×11 und 13×13 größer.
- Die größere Schrift gilt besonders für Tablet-Ansichten und den eingeklappten Info-Modus.

## Neu in Brabbel v5.20

- Das Spiel wurde von Wortwandler in Brabbel umbenannt.
- Manifest, Titel, Menüs, Über-Seite und Exporthinweise verwenden nun Brabbel.
- Unter den Handsteinen gibt es zusätzlich „Mischen“.
- „Mischen“ ordnet die vorhandenen Handsteine jedes Mal zufällig neu an.
- Es werden keine neuen Buchstaben gezogen und kein Wort vorgeschlagen.
- Interne Speicher-Keys bleiben kompatibel, damit vorhandene Spielstände nicht verloren gehen.

## Neu in Brabbel v5.21

- QU-Fix: Ein einzelner QU-Stein wird nicht mehr als eigenes Zwei-Buchstaben-Wort „QU“ geprüft.
- Kreuzwörter werden jetzt nach Anzahl belegter Felder bewertet, nicht nach Zeichenlänge.
- Beispiel: Aus „ÖLE“ kann durch Anlegen von QU und Überlegen von Ö zu Ä nun korrekt „QUÄLE“ entstehen.

## Neu in Brabbel v5.22

- Handsteine sind größer und fetter.
- Spielbrett „Mit Sonderfeldern“ ist aktiviert.
- Sonderfelder: 2B, 3B, 2W, 3W.
- Sonderfelder werden nur einmal ausgelöst, wenn sie erstmals belegt werden.
- Jokerstein ★ mit 0 Punkten eingeführt.
- Beim Ablegen eines Jokers kann ein Buchstabe gewählt werden; auch QU ist möglich.
- Joker werden auf dem Brett markiert und zählen im Wort, aber mit 0 Punkten.

## Neu in Brabbel v5.23

- Sonderfeld-Beschriftungen sind jetzt farbig statt schwarz.
- Der Stern im Mittelfeld wurde entfernt, damit er nicht mit dem Punktwert kollidiert.
- Handstein-Buchstaben wurden weiter vergrößert und kräftiger gemacht.
- Brettbuchstaben bei 11×11 und 13×13 wurden weiter vergrößert, besonders in der großen Brettansicht.
- Nach „Zug abschließen“ zeigt das Hinweis-Popup nun eine Punkteaufschlüsselung.

## Neu in Brabbel v5.24

- Die große Ansicht ist jetzt Standard: Die Info-Spalte ist initial eingeklappt.
- Direkt unter dem Brett gibt es eine geteilte Leiste.
- Links stehen Beutel, aktueller Zugwert, Gesamtpunkte und Runde.
- Rechts stehen kompakte Zugbuttons mit Symbolen: Zug ✕, Zug ✓, ✋ Passe.
- Bei rundenbasierten Spielen wird die Runde als aktuelle Runde/Grenze angezeigt.
- Bei klassischem Spiel wird der Beutel als verbleibend/gesamt angezeigt.

## Neu in Brabbel v5.25

- Statusbox und Zugbox bleiben auf Tablet-Breiten nebeneinander.
- Die Handsteinbox wurde vertikal kompakter gemacht.
- Die Überschrift „Deine Buchstaben“ und der Hinweis „Ziehen oder sortieren“ wurden entfernt.
- Sortierleiste heißt jetzt „Sortieren nach“.
- Der Button „Mischen“ heißt jetzt „Zufall“.
- Zug zurücknehmen nutzt ein rotes X-Symbol.
- Zug abschließen nutzt ein Haken-Symbol.

## Neu in Brabbel v5.26

- Sonderfeld-Beschriftungen stehen nicht mehr mittig, sondern als kleine farbige Plakette oben links.
- Aktuell gelegte Steine sind deutlich grün.
- Abgeschlossene eigene Steine bleiben hellgrün.
- Das Mittelfeld bleibt nicht gelb, sobald ein Stein darauf liegt.
- Die aktuelle Punktebox nutzt ebenfalls ein helles Grün.
- Brettbuchstaben wurden weiter vergrößert.

## Neu in Brabbel v5.27

- Sonderfeld-Kennungen stehen wieder mittig und sind größer lesbar.
- Der Stern im Mittelfeld ist zurück, mittig und etwas größer.
- Sobald auf dem Mittelfeld ein Stein liegt, verschwindet der Stern.

## Neu in Brabbel v5.28

- Auf dem Mittelfeld wird die Sonderfeld-Bezeichnung ausgeblendet; dort bleibt nur der Stern.
- Gelegte Buchstaben auf dem Brett wurden weiter vergrößert.
- Für große Tablets gibt es zusätzliche Schriftgrößen-Anpassungen.

## Neu in Brabbel v5.29

- Autosave nach Spielstart und nach jedem Spielzug.
- Autosave wird bei „Spiel fortsetzen“ als eigener Eintrag angezeigt.
- Autosave kann geladen oder gelöscht werden.
- Beim regulären Spielende wird der Autosave entfernt.


## Neu in v5.30

- Joker-Auswahl öffnet keine Bildschirmtastatur mehr.
- Klassischer Buchstabenbeutel reduziert:
  - 9×9: 63 Steine
  - 11×11: 77 Steine
  - 13×13: 91 Steine
- Bestenliste zeigt zusätzlich die Anzahl der gespielten Runden.
- Handstein-Sortierung kompakter: A→Z, 1→8, AEIOU und 🎲.
- Spielinfo zeigt „Pkt.“ statt „Punkte“.
- Buchstabenwerte angepasst: X und QU = 6 Punkte, Y und ß = 8 Punkte.


## Neu in v5.31

- Sortierbuttons sind jetzt gleich groß und mittig ausgerichtet.
- Die Buttons verteilen sich nicht mehr über die komplette Handsteinbox.
- Der Punktwert-Sortierbutton heißt jetzt 8→1, passend zur absteigenden Sortierung.


## Neu in v5.32

- Vor dem Abschließen fragt Brabbel: „Zug für X Pkt. spielen?“
- Der Bestätigungsdialog zeigt die Punkteaufschlüsselung.
- Die Aktuell-Box zeigt ihren Status über Beschriftung und Farbe:
  - Aktuell = neutral/grau
  - Gültig = grün
  - Prüfen = gelb
  - Fehler = rot
- Nach einem erfolgreichen Zug erscheint eine freundlichere Abschlussmeldung mit Gesamtpunktestand.


## Neu in v5.33

- Die Zugbestätigung wurde gekürzt.
- Es erscheint nur noch: „Zug für X Pkt. spielen?“
- Die Überschrift und Punkteaufschlüsselung wurden aus diesem Bestätigungsschritt entfernt.


## Neu in v5.34

- „Zum Hauptmenü“ beendet das Spiel nicht mehr endgültig.
- Es erscheint die Abfrage: „Das Spiel ohne Speichern beenden?“
- Buttons: „Ja, beenden“ und „Nein, zurück“.
- Beim Wechsel ins Hauptmenü bleibt ein vorhandener Autosave erhalten.
- Es wird dabei kein Bestenlisten-Eintrag erzeugt und kein Autosave gelöscht.


## Neu in v5.35

- Neu gelegte oder überlegte Steine können vor dem Zugabschluss direkt auf dem Brett verschoben werden.
- Dadurch lässt sich ein ganzes Wort leichter korrigieren, ohne alles zurücknehmen zu müssen.
- Die Abschlussmeldung nach einem erfolgreichen Zug wurde gekürzt: „Du erhältst ...“ wird nicht mehr doppelt angezeigt.


## Neu in v5.36
- Sonderfelder haben jetzt eine Unterauswahl mit X-Form, Stern-Form, Konzentrisch und Zufall.
- Für 9×9, 11×11 und 13×13 gibt es eigene Muster pro Form.
- Zufall respektiert die Mitte und trennt 2W/3W-Felder voneinander.


## Neu in v5.37

- Im Menü „Neues Spiel“ steht jetzt zuerst die Brettgröße.
- Danach folgt die Auswahl des Spielbretts.
- Die Unterauswahl für Sonderfelder bzw. Startbuchstaben steht direkt darunter.
- Beim 13×13-Sternmuster wurden in Reihe 7, Spalte 3 und 11 die fehlenden 2B-Felder ergänzt.


## Neu in v5.38

- Spielstatistik wird während des Spiels mitgeführt.
- Spielende zeigt eine Zusammenfassung mit Gesamtpunkten, Runden, Ø pro Runde, gewerteten Wörtern, längstem Wort, stärkstem Zug und bestem Einzelwort.
- Bestenliste speichert und zeigt die Zusammenfassung kompakt mit an.
- Wechsel ins Hauptmenü löst weiterhin keine Spielende-Zusammenfassung aus.


## Neu in v5.39

- Menü „Neues Spiel“ wurde erweitert: Spielmodus steht jetzt an erster Stelle.
- „Einzel“ ist aktiv; „Spieler vs. Spieler“ und „Spieler vs. Dr. Brabbel“ sind als spätere Modi ausgegraut sichtbar.
- Jokeranzahl ist abhängig von der Brettgröße wählbar:
  - 9×9: 0–2, Standard 1
  - 11×11: 0–3, Standard 2
  - 13×13: 0–4, Standard 2
- Klassische Beutelgrößen bleiben konstant bei 63 / 77 / 91 Steinen; Joker ersetzen andere Buchstaben.
- Endlos- und Rundenmodus nutzen die gewählte Jokeranzahl als Zieh-Wahrscheinlichkeit.


## Neu in v5.40

- App-Icon für PWA/Home-Screen ergänzt.
- `manifest.json` enthält jetzt 192×192-, 512×512- und maskable-Icon.
- `apple-touch-icon.png` für iPad/iPhone ergänzt.
- `index.html` verweist auf das Apple-Touch-Icon.
- Service-Worker-Cache auf `brabbel-v5.40-app-icon` erhöht und Icon-Dateien in den Cache aufgenommen.



## Neu in v5.41

- Spielmodus „Zu zweit · Tablet weitergeben“ aktiviert.
- Zwei Spielernamen im Menü „Neues Spiel“ ergänzt. Spieler 1 wird mit dem Hauptnamen vorausgefüllt; Duell-Namen werden separat gespeichert.
- Zwei getrennte Handsteine, zwei Punktestände und getrennte Statistiken für den Zu-zweit-Modus.
- Gemeinsames Brett und gemeinsamer Buchstabenbeutel im klassischen Modus.
- Übergabebildschirm nach Zug und Passe, damit die nächste Hand verborgen bleibt.
- Autosave und manuelle Speicherstände unterstützen den Zu-zweit-Modus.
- Spielende-Zusammenfassung und Bestenliste zeigen Duell-Ergebnisse.



## Neu in v5.42

- Im Zu-zweit-Modus wird der Startspieler zufällig ausgelost. Vor dem ersten Zug erscheint ein Übergabebildschirm, bevor Handsteine sichtbar werden.
- Übergabebildschirm optisch entzerrt: Der Weiter-Button hat mehr Abstand zu den Punkteboxen.
- Aufgabe im Zu-zweit-Modus beendet nicht mehr sofort das Spiel: Der Handwert wird abgezogen und der andere Spieler erhält noch einen letzten Zug.
- Klassische Beutelgrößen reduziert: 9×9 = 56 Steine, 11×11 = 70 Steine, 13×13 = 84 Steine.
- In der Infoansicht wird im klassischen Modus unter „Letzter Zug“ angezeigt, welche Buchstaben noch im Beutel sind.


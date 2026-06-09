<h1>🎮 El Pollo Loco – 2D Canvas Game</h1>

<p>
Dieses Projekt ist ein objektorientiertes 2D‑Game, das vollständig mit 
<strong>JavaScript, HTML und CSS</strong> entwickelt wurde.  
Die Hauptfigur <strong>Pepe</strong> kämpft sich durch eine Welt voller Hühner.  
Sein Ziel: das große Endgegner‑Huhn besiegen – und das gelingt ihm nur, indem er 
<strong>Flaschen wirft</strong>, ausweicht und geschickt navigiert.
</p>

<hr>

<h2>🧩 Hauptkomponenten</h2>

<h3>🎨 Canvas</h3>
<p>
Das <strong>HTML5‑Canvas</strong> dient als Leinwand für das gesamte Spielgeschehen.  
Hier werden alle grafischen Elemente wie Pepe, Gegner, Hintergrund und Effekte dargestellt.
</p>

<h3>⌨️ Keylistener</h3>
<p>
Das Spiel nutzt die nativen <code>keydown</code>‑ und <code>keyup</code>‑Events des Browsers.  
Diese liefern Informationen über gedrückte Tasten, Modifier Keys und Wiederholungsstatus.  
Die Eingaben werden in einem eigenen Keyboard‑Objekt gespeichert und von der Spielfigur abgefragt.
</p>

<h3>🖌️ Draw() – Rendering Loop</h3>
<p>
Die <code>draw()</code>-Methode ist der <strong>Rendering‑Loop</strong> des Spiels.  
Sie:
</p>
<ul>
  <li>löscht das Canvas</li>
  <li>zeichnet alle Hintergrundobjekte</li>
  <li>rendert Clouds, Gegner und Pepe</li>
  <li>iteriert über alle <strong>MovableObjects</strong></li>
  <li>wird über <code>requestAnimationFrame()</code> bis zu 60x pro Sekunde aufgerufen</li>
</ul>

<h3>🔄 Update() – Game Logic Loop</h3>
<p>
Die <code>update()</code>-Methode ist für die <strong>Spielmechanik</strong> zuständig.  
Sie kümmert sich um:
</p>
<ul>
  <li>Positionsänderungen</li>
  <li>Bewegungslogik</li>
  <li>Kollisionserkennung</li>
  <li>Interaktionen zwischen Pepe und den Hühnern</li>
  <li>Wurfmechanik der Flaschen</li>
  <li>Bewegung der Kamera</li>
</ul>

<hr>

<h2>🐔 Spielinhalt</h2>

<h3>🧍 Hauptfigur: Pepe</h3>
<p>
Pepe ist der Held des Spiels. Er kann laufen, springen und Flaschen werfen, um sich gegen die Hühner zu verteidigen.
</p>

<h3>🐤 Gegner: Hühner</h3>
<p>
Mehrere kleine Hühner bewegen sich durch die Welt und stellen eine Gefahr für Pepe dar.
</p>

<h3>🐓 Endgegner: Das große Huhn</h3>
<p>
Der finale Boss ist ein riesiges Huhn, das Pepe nur mit <strong>präzise geworfenen Flaschen</strong> besiegen kann.
</p>

<hr>

<h2>🛠️ Technologien</h2>
<ul>
  <li><strong>JavaScript</strong> – Game‑Engine, Logik, Rendering, Input</li>
  <li><strong>HTML</strong> – Canvas‑Struktur</li>
  <li><strong>CSS</strong> – Layout und Styling</li>
</ul>

<hr>

<h2>🎵📷 Assets</h2>
<p>
Das Spiel verwendet zusätzliches Material:
</p>
<ul>
  <li><strong>Bilder</strong> (Sprites, Hintergründe, Animationen)</li>
  <li><strong>Audio</strong> (Soundeffekte, Musik)</li>
</ul>

<hr>

<h2>🚀 Ziel des Projekts</h2>
<p>
Dieses Repository dient als Grundlage für ein modular aufgebautes 2D‑Canvas‑Spiel.  
Es eignet sich ideal, um die Funktionsweise von Game‑Loops, Animationen, Input‑Handling und 
Canvas‑Rendering zu verstehen und zu erweitern.
</p>

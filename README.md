<h1>🎮 El Pollo Loco – 2D Canvas Game</h1>

<p>
This project is an object‑oriented 2D game built entirely with
<strong>JavaScript, HTML, and CSS</strong>.
The main character <strong>Pepe</strong> fights his way through a world full of chickens.
His goal: defeat the giant final boss chicken — and he can only succeed by
<strong>throwing bottles</strong>, dodging attacks, and navigating skillfully.
</p>

<hr>

<h2>🧩 Main Components</h2>

<h3>🎨 Canvas</h3>
<p>
The <strong>HTML5 Canvas</strong> serves as the drawing surface for the entire game.
All graphical elements such as Pepe, enemies, backgrounds, and effects are rendered here.
</p>

<h3>⌨️ Key Listener</h3>
<p>
The game uses the browser’s native <code>keydown</code> and <code>keyup</code> events.
These provide information about pressed keys, modifier keys, and repeat states.
The inputs are stored in a dedicated Keyboard object and queried by the character.
</p>

<h3>🖌️ Draw() – Rendering Loop</h3>
<p>
The <code>draw()</code> method is the game’s <strong>rendering loop</strong>.
It:
</p>
<ul>
<li>clears the canvas</li>
<li>draws all background objects</li>
<li>renders clouds, enemies, and Pepe</li>
<li>iterates through all <strong>MovableObjects</strong></li>
<li>is executed up to 60 times per second via <code>requestAnimationFrame()</code></li>
</ul>

<h3>🔄 Update() – Game Logic Loop</h3>
<p>
The <code>update()</code> method handles the <strong>game mechanics</strong>.
It manages:
</p>
<ul>
<li>position updates</li>
<li>movement logic</li>
<li>collision detection</li>
<li>interactions between Pepe and the chickens</li>
<li>bottle throwing mechanics</li>
<li>camera movement</li>
</ul>

<hr>

<h2>🐔 Game Content</h2>

<h3>🧍 Main Character: Pepe</h3>
<p>
Pepe is the hero of the game. He can run, jump, and throw bottles to defend himself against the chickens.
</p>

<h3>🐤 Enemies: Chickens</h3>
<p>
Several small chickens roam the world and pose a threat to Pepe.
</p>

<h3>🐓 Final Boss: The Giant Chicken</h3>
<p>
The final boss is a massive chicken that Pepe can only defeat with
<strong>precisely thrown bottles</strong>.
</p>

<hr>

<h2>🛠️ Technologies</h2>
<ul>
<li><strong>JavaScript</strong> – game engine, logic, rendering, input</li>
<li><strong>HTML</strong> – canvas structure</li>
<li><strong>CSS</strong> – layout and styling</li>
</ul>

<hr>

<h2>🎵📷 Assets</h2>
<p>
The game uses additional assets:
</p>
<ul>
<li><strong>Images</strong> (sprites, backgrounds, animations)</li>
<li><strong>Audio</strong> (sound effects, music)</li>
</ul>

<hr>

<h2>🚀 Project Goal</h2>
<p>
This repository serves as a foundation for a modular 2D canvas game.
It is ideal for understanding and extending concepts such as game loops, animations, input handling, and canvas rendering.
</p>
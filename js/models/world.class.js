/**
 * Represents the game world and controls the game logic, rendering,
 * collisions, collectibles, level progression and game states.
 */
class World {
    character = new Character();
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBarHealth = new Statusbar('health');
    statusBarCoins = new Statusbar('coin');
    statusBarBottle = new Statusbar('bottle');
    statusBarEndboss = new Statusbar('endboss');
    throwableObjects = [];
    hintMessage = "";
    gameState = 'running';
    soundEnabled = false;
    userHasInteracted = false;
    throwCooldown = false;

    /**
     * Initializes the game world with the canvas, keyboard and current level.
     * @param {HTMLCanvasElement} canvas - The canvas used to render the game.
     * @param {Keyboard} keyboard - The keyboard input handler.
     * @param {Level} level - The current game level.
     */
    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.collectibles = this.level.collectibles;
        this.levelEnd = this.level.levelEnd || null;
        this.setWorld();
        this.resetWorldState();
        this.draw();
        this.run();
    }

    /**
     * Connects the character and all enemies with the current game world.
     * Identifies the Endboss if the current level contains one.
     */
    setWorld() {
        this.endboss = null;
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy instanceof Endboss) {
                enemy.world = this;
                this.endboss = enemy;
            }
        });
    }

    /**
     * Starts the main game loop and repeatedly checks all
     * important game events and interactions.
     */
    run() {
        this.intervalId = setInterval(() => {
            this.checkCollisions();
            this.checkWonAgainstEndboss();
            this.checkThrowObjects();
            this.checkCrossingItem();
            this.checkLevelEnd();
            this.checkGateOpenByPlayer();
            this.checkIfCharacterReachedExit();
            this.checkLost();
            this.checkGameOver();
            this.convertDeadChickensToCoins();
        }, 1000 / 60);
    }

    /**
     * Checks whether the character can throw a bottle.
     * Creates and launches a new throwable object if possible.
     */
    checkThrowObjects() {
        if (
            this.keyboard.D &&
            this.character.bottles > 0 &&
            !this.throwCooldown
        ) {
            this.throwCooldown = true;
            this.character.bottles--;
            this.statusBarBottle.setPercentage(this.character.bottles * 20);
            let direction = this.character.otherDirection ? 1 : -1;
            let bottle = new ThrowableObject(
                this.character.x + this.character.width / 2,
                this.character.y + this.character.height / 2,
                direction
            );
            bottle.world = this;
            this.throwableObjects.push(bottle);
            setTimeout(() => {
                this.throwCooldown = false;
            }, 300);
        }
    }

    /**
     * Checks all collisions between the character, enemies and bottles.
     */
    checkCollisions() {
        this.betweenCharacterAndEnemies();
        this.betweenEnemiesAndBottle();
    }

    /**
     * Checks collisions between the character and all enemies.
     * Handles jump attacks and regular enemy attacks.
     */
    betweenCharacterAndEnemies() {
        for (let enemy of this.level.enemies) {
            if (enemy.energy <= 0) continue;
            if (!this.character.isColliding(enemy)) continue;
            if (this.checkJumpKill(enemy)) {
                return;
            }
        }
        for (let enemy of this.level.enemies) {
            if (enemy.energy <= 0) continue;
            if (!this.character.isColliding(enemy)) continue;
            this.checkIfNoJumpKill(enemy);
            return;
        }
    }

    /**
     * Checks whether an enemy is defeated by jumping on it.
     * @param {MovableObject} enemy - The enemy involved in the collision.
     * @returns {boolean} True if the enemy was defeated by a jump attack.
     */
    checkJumpKill(enemy) {
        if (enemy instanceof Chicken || enemy instanceof Babychicken) {
            if (this.character.isJumpKill(enemy)) {
                enemy.hit(100);
                if (enemy.isDead()) {
                    enemy.startCoinConversion();
                }
                this.character.jump();
                return true;
            }
        }
        return false;
    }

    /**
     * Applies damage to the character when a collision is not a jump kill.
     * Also applies knockback, stun and updates the health status bar.
     * @param {MovableObject} enemy - The enemy that damages the character.
     */
    checkIfNoJumpKill(enemy) {
        if (this.character.isHurt()) return;
        this.character.hit(enemy.damageGiven);
        if (this.character.energy < 0) this.character.energy = 0;
        this.statusBarHealth.setPercentage(this.character.energy);
        this.character.applyKnockback(enemy.knockbackForce, enemy.x);
        this.character.applyStun(enemy.stunDuration);
        if (enemy.isDead()) {
            enemy.startCoinConversion();
        }
    }

    /**
  * Checks collisions between thrown bottles and enemies.
  * Applies damage and triggers the appropriate bottle splash effect.
  * The endboss cannot be hit by bottles while performing a charge attack.
  */
    betweenEnemiesAndBottle() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.isSplashed) return;
            this.level.enemies.forEach((enemy) => {
                if (bottle.isSplashed) return;
                if (enemy instanceof Endboss && enemy.isCharging) {
                    return;
                }
                if (!bottle.isColliding(enemy)) return;
                if (enemy instanceof Endboss) {
                    enemy.hit(20);
                    this.statusBarEndboss.setPercentage(enemy.energy);
                    bottle.splash();
                    return;
                }
                if (enemy instanceof Chicken || enemy instanceof Babychicken) {
                    enemy.hit();
                    if (enemy.isDead()) {
                        enemy.isConvertedToCoin = true;
                        enemy.startCoinConversion();
                    }
                    bottle.splash();
                }
            });
        });
    }

    /**
     * Checks whether the character collects a coin or bottle.
     * Updates the corresponding inventory and status bar.
     */
    checkCrossingItem() {
        this.collectibles.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                if (item.type == 'coin') {
                    this.character.coins = Math.min(this.character.coins + 1, 5);
                    this.statusBarCoins.setPercentage(this.character.coins * 20);
                } else if (item.type == 'bottleOne' || item.type == 'bottleTwo') {
                    this.character.bottles++;
                    this.statusBarBottle.setPercentage(this.character.bottles * 20);
                }
                this.collectibles.splice(index, 1);
            }
        });
    }

    /**
     * Checks whether the character has reached the end of the level.
     * Displays a message depending on the number of collected coins.
     */
    checkLevelEnd() {
        if (!this.levelEnd) return;
        if (!this.character.isNearLevelEnd()) {
            this.hintMessage = "";
            return;
        }
        if (this.character.coins >= 5) {
            this.levelEnd.canBeOpened = true;
            this.hintMessage = 'Please press "F" to enter next level';
        } else {
            this.hintMessage = 'Please collect all coins!';
        }
    }

    /**
     * Checks whether the character has reached the opened level exit.
     * Starts the next level if the exit has been reached.
     */
    checkIfCharacterReachedExit() {
        if (!this.levelEnd) return;
        if (this.levelEnd.isFullyOpen && this.character.x > this.levelEnd.x - 50) {
            this.nextLevel();
        }
    }

    /**
     * Checks whether the player can open the level exit by pressing F.
     */
    checkGateOpenByPlayer() {
        if (!this.levelEnd) return;
        if (
            this.keyboard.F &&
            this.levelEnd.canBeOpened &&
            !this.levelEnd.isOpen &&
            this.character.x > this.levelEnd.x - 150 &&
            this.character.x < this.levelEnd.x + 150
        ) {
            this.levelEnd.open();
        }
    }

    /**
     * Checks whether the Endboss has been defeated.
     * Changes the game state and displays the win screen if necessary.
     */
    checkWonAgainstEndboss() {
        if (this.endboss && this.endboss.energy <= 0 && this.gameState == 'running') {
            this.gameState = 'won';
            this.stopAllGameSounds();
            showWinScreen();
        }
    }

    /**
     * Checks whether the character has lost while the Endboss is still alive.
     * Changes the game state and displays the lost screen if necessary.
     */
    checkLost() {
        if (this.gameState == 'running' &&
            this.character.energy <= 0 &&
            this.endboss &&
            this.endboss.energy > 0 &&
            this.character.hasStarted) {
            this.gameState = 'lost';
            this.stopAllGameSounds();
            showLostScreen();
        }
    }

    /**
     * Checks whether the character has lost all health without an active Endboss.
     * Changes the game state and displays the game-over screen if necessary.
     */
    checkGameOver() {
        if (this.gameState == 'running' &&
            this.character.energy <= 0 &&
            (!this.endboss || this.endboss.energy <= 0) &&
            this.character.hasStarted) {
            this.gameState = 'gameover';
            this.stopAllGameSounds();
            showGameOverScreen();
        }
    }

    /**
     * Converts defeated chickens into collectible coins and bottles.
     * Removes converted chickens from the enemy list.
     */
    convertDeadChickensToCoins() {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            let enemy = this.level.enemies[i];
            if ((enemy instanceof Chicken || enemy instanceof Babychicken) && enemy.isConvertedToCoin) {
                this.dropRandomCoins(enemy);
                this.dropRandomBottles(enemy);
                this.level.enemies.splice(i, 1);
            }
        }
    }

    /**
     * Creates collectible coins based on the enemy's loot settings.
     * @param {MovableObject} enemy - The defeated enemy dropping the coins.
     */
    dropRandomCoins(enemy) {
        for (let c = 0; c < enemy.loot.coins; c++) {
            if (Math.random() < enemy.loot.coinChance) {
                let coin = new Collectible('coin');
                coin.x = enemy.x + c * 15;
                coin.y = enemy.y;
                this.collectibles.push(coin);
            }
        }
    }

    /**
     * Creates collectible bottles based on the enemy's loot settings.
     * @param {MovableObject} enemy - The defeated enemy dropping the bottles.
     */
    dropRandomBottles(enemy) {
        for (let b = 0; b < enemy.loot.bottles; b++) {
            if (Math.random() < enemy.loot.bottleChance) {
                let bottle = new Collectible('bottleOne');
                bottle.x = enemy.x + b * 15;
                bottle.y = enemy.y;
                this.collectibles.push(bottle);
            }
        }
    }

    /**
     * Resets the world, character, collectibles and throwable objects
     * to their initial state. Also resets the Endboss if present.
     */
    resetWorldState() {
        this.collectibles = this.level.collectibles.map(c => new Collectible(c.type));
        this.camera_x = 0;
        this.character.x = 120;
        this.character.y = 100;
        this.character.speedY = 0;
        this.character.energy = 100;
        this.character.coins = 0;
        this.character.bottles = 0;
        this.throwableObjects = [];
        if (this.endboss) {
            this.endboss.endbossWasTriggered = false;
            this.endboss.energy = 100;
            this.endboss.x = 2500;
        }
    }

    /**
     * Enables or disables game sounds.
     * @param {boolean} state - Determines whether game sounds are enabled.
     */
    setSoundEnabled(state) {
        this.soundEnabled = state;
    }

    /**
   * Enables game sound after the user has interacted with
   * the sound button and therefore allows browser audio playback.
   */
    enableSoundAfterUserInteraction() {
        this.userHasInteracted = true;
        this.soundEnabled = true;
        this.resumeAllGameSounds();
    }

    /**
     * Stops all sounds of the character, enemies, throwable objects
     * and collectibles and disables game sounds.
     */
    stopAllGameSounds() {
        this.soundEnabled = false;
        this.character.mute();
        this.level.enemies.forEach(e => e.mute && e.mute());
        this.throwableObjects.forEach(o => o.mute && o.mute());
        this.collectibles.forEach(c => c.mute && c.mute());
    }

    /**
     * Resumes all sounds of the character, enemies, throwable objects
     * and collectibles and enables game sounds.
     */
    resumeAllGameSounds() {
        this.soundEnabled = true;
        this.character.unmute();
        this.level.enemies.forEach(e => e.unmute && e.unmute());
        this.throwableObjects.forEach(o => o.unmute && o.unmute());
        this.collectibles.forEach(c => c.unmute && c.unmute());
    }

    /**
     * Draws all game objects, background objects, character and status bars.
     * Continuously updates the canvas using requestAnimationFrame.
     */
    draw() {
        if (this.gameState == 'won') return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackgrounds();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.collectibles);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        if (this.levelEnd) {
            this.addToMap(this.levelEnd);
        }
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottle);
        this.drawLevelEndNotice();
        if (this.endboss && this.endboss.isVisible()) {
            this.addToMap(this.statusBarEndboss);
        }
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Draws the current level-end hint message on the canvas.
     */
    drawLevelEndNotice() {
        this.ctx.font = "32px Luckiest Guy";
        this.ctx.fillStyle = "yellow";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 4;
        this.ctx.textAlign = "right";
        const x = this.canvas.width - 20;
        const y = 50;
        this.ctx.strokeText(this.hintMessage, x, y);
        this.ctx.fillText(this.hintMessage, x, y);
        this.ctx.textAlign = "left";
    }

    /**
     * Draws all background objects with their individual parallax effect.
     */
    drawBackgrounds() {
        this.level.backgroundObjects.forEach(bg => {
            const offsetX = Math.round(
                this.camera_x * bg.parallaxFactor
            );
            this.ctx.save();
            this.ctx.translate(offsetX, 0);
            this.addToMap(bg);
            this.ctx.restore();
        });
    }

    /**
     * Adds multiple objects to the game map.
     * @param {MovableObject[]} objects - Objects that should be drawn.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        });
    }

    /**
     * Adds a single movable object to the canvas.
     * Handles horizontal image flipping when necessary.
     * @param {MovableObject} mo - The object that should be drawn.
     */
    addToMap(mo) {
        if (!mo || typeof mo.draw !== 'function') {
            return;
        }
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack();
        }
    }

    /**
     * Saves the current canvas state and flips an object horizontally.
     * @param {MovableObject} mo - The object whose image is flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.x + mo.width / 2, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-mo.x - mo.width / 2, 0);
    }

    /**
     * Restores the previously saved canvas state after flipping an image.
     */
    flipImageBack() {
        this.ctx.restore();
    }

    /**
     * Stops the current game loop and loads the next level.
     */
    nextLevel() {
        clearInterval(this.intervalId);
        currentLevel++;
        changeLevel();
    }
}
/**
 * Represents the game world and controls the game loop,
 * game states, level progression and object coordination.
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
     * Initializes the game world with canvas, keyboard and level.
     * @param {HTMLCanvasElement} canvas - Game canvas.
     * @param {Keyboard} keyboard - Keyboard input handler.
     * @param {Level} level - Current game level.
     */
    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.initializeWorld();
    }

    /**
     * Initializes world connections, state and game loops.
     */
    initializeWorld() {
        this.collectibles = this.level.collectibles;
        this.levelEnd = this.level.levelEnd || null;
        this.setWorld();
        this.resetWorldState();
        this.draw();
        this.run();
    }

    /**
     * Connects characters and enemies with the current world.
     */
    setWorld() {
        this.character.world = this;
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss) || null;
        this.level.enemies.forEach(enemy => enemy.world = this);
        this.collectibles.forEach(item => item.world = this);
    }

    /**
     * Starts the main game loop.
     */
    run() {
        this.intervalId = setInterval(() => this.updateWorld(), 1000 / 60);
    }

    /**
     * Updates all game systems during the main game loop.
     */
    updateWorld() {
        if (this.gameState != 'running') return;
        this.checkCollisions();
        this.checkGameProgress();
        this.checkThrowObjects();
        this.checkCrossingItem();
        this.convertDeadChickensToCoins();
        this.convertCoinsToBottles();
    }

    /**
     * Checks all conditions related to game progress and state.
     */
    checkGameProgress() {
        this.checkLevelEnd();
        this.checkGateOpenByPlayer();
        this.checkIfCharacterReachedExit();
        this.checkWonAgainstEndboss();
        this.checkLost();
        this.checkGameOver();
    }

    /**
     * Checks whether the character can throw a bottle.
     */
    checkThrowObjects() {
        if (!this.canThrowBottle()) return;
        this.throwBottle();
        this.startThrowCooldown();
    }

    /**
     * Checks whether the character is currently allowed to throw.
     * @returns {boolean} True if a bottle can be thrown.
     */
    canThrowBottle() {
        return this.gameState == 'running'
            && this.keyboard.D
            && this.character.bottles > 0
            && !this.throwCooldown;
    }

    /**
     * Creates and launches a throwable bottle.
     */
    throwBottle() {
        this.throwCooldown = true;
        this.character.bottles--;
        this.statusBarBottle.setPercentage(this.character.bottles * 20);

        const direction = this.character.otherDirection ? 1 : -1;
        const bottle = new ThrowableObject(
            this.character.x + this.character.width / 2,
            this.character.y + this.character.height / 2,
            direction
        );

        bottle.world = this;
        this.throwableObjects.push(bottle);
    }

    /**
     * Prevents another bottle from being thrown temporarily.
     */
    startThrowCooldown() {
        setTimeout(() => this.throwCooldown = false, 300);
    }

    /**
     * Checks collisions between characters, enemies and bottles.
     */
    checkCollisions() {
        betweenCharacterAndEnemies(this);
        betweenEnemiesAndBottle(this);
    }

    /**
     * Checks whether the character has reached the level exit.
     */
    checkLevelEnd() {
        updateLevelEnd(this);
    }

    /**
     * Checks whether the player can open the level gate.
     */
    checkGateOpenByPlayer() {
        openLevelGate(this);
    }

    /**
     * Checks whether the character has reached the open exit.
     */
    checkIfCharacterReachedExit() {
        if (this.levelEnd?.isFullyOpen
            && this.character.x > this.levelEnd.x - 50) {
            this.nextLevel();
        }
    }

    /**
     * Checks whether the Endboss has been defeated.
     */
    checkWonAgainstEndboss() {
        checkEndbossWin(this);
    }

    /**
     * Checks whether the character has lost against the Endboss.
     */
    checkLost() {
        checkCharacterLost(this);
    }

    /**
     * Checks whether the game is over without an active Endboss.
     */
    checkGameOver() {
        checkGameOver(this);
    }

    /**
     * Collects coins and bottles that collide with the character.
     */
    checkCrossingItem() {
        collectItems(this);
    }

    /**
     * Converts defeated chickens into collectible loot.
     */
    convertDeadChickensToCoins() {
        convertDeadChickens(this);
    }

    /**
     * Converts coins into bottles when level conditions are fulfilled.
     */
    convertCoinsToBottles() {
        convertCoinsToBottles(this);
    }

    /**
     * Resets character, collectibles, enemies and throwable objects.
     */
    resetWorldState() {
        resetWorld(this);
    }

    /**
     * Enables or disables game sounds.
     * @param {boolean} state - Determines whether sounds are enabled.
     */
    setSoundEnabled(state) {
        this.soundEnabled = state;
    }

    /**
     * Enables sound after user interaction.
     */
    enableSoundAfterUserInteraction() {
        this.userHasInteracted = true;
        this.soundEnabled = true;
        resumeAllGameSounds(this);
    }

    /**
     * Stops all game sounds.
     */
    stopAllGameSounds() {
        stopAllGameSounds(this);
    }

    /**
     * Resumes all game sounds.
     */
    resumeAllGameSounds() {
        resumeAllGameSounds(this);
    }

    /**
     * Draws the complete game world.
     */
    draw() {
        if (this.gameState === 'won') return;
        drawWorld(this);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Stops the game loop and loads the next level.
     */
    nextLevel() {
        clearInterval(this.intervalId);
        currentLevel++;
        changeLevel();
    }
}

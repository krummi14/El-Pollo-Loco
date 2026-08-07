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
    soundEnabled = true;

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

    run() {
        this.intervalId = setInterval(() => {
            this.checkCollisions();
            this.checkWonAgainstEndboss();
            this.ceckThrowObjects();
            this.checkCrossingItem();
            this.checkLevelEnd();
            this.checkGateOpenByPlayer();
            this.checkIfCharacterReachedExit();
            this.checkLost();
            this.checkGameOver();
            this.convertDeadChickensToCoins();
        }, 1000 / 60);
    }

    checkWonAgainstEndboss() {
        if (this.endboss && this.endboss.energy <= 0 && this.gameState == 'running') {
            this.gameState = 'won';
            this.stopAllGameSounds();
            showWinScreen();
        }
    }

    ceckThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0) {
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
        }
    }

    checkCollisions() {
        this.betweenCharacterAndEnemies();
        this.betweenEndbossAndBottle();
        this.betweenChickenAndBottle();
    }

    betweenCharacterAndEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (enemy.energy <= 0) return;
            if (!this.character.isColliding(enemy)) return;
            if (this.checkJumpKill(enemy)) return;
            this.checkIfNoJumpKill(enemy);
        });
    }

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

    betweenEndbossAndBottle() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach(enemy => {
                if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
                    enemy.hit();
                    this.statusBarEndboss.setPercentage(enemy.energy);
                    bottle.splash();
                }
            });
        });
    }

    betweenChickenAndBottle() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach(enemy => {
                if ((enemy instanceof Chicken || enemy instanceof Babychicken) &&
                    bottle.isColliding(enemy)) {
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

    checkIfCharacterReachedExit() {
        if (!this.levelEnd) return;
        if (this.levelEnd.isFullyOpen && this.character.x > this.levelEnd.x - 50) {
            this.nextLevel();
        }
    }

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

    checkWonAgainstEndboss() {
        if (this.endboss && this.endboss.energy <= 0 && this.gameState == 'running') {
            this.gameState = 'won';
            this.stopAllGameSounds();
            showWinScreen();
        }
    }

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

    setSoundEnabled(state) {
        this.soundEnabled = state;
    }

    stopAllGameSounds() {
        this.soundEnabled = false;
        this.character.mute();
        this.level.enemies.forEach(e => e.mute && e.mute());
        this.throwableObjects.forEach(o => o.mute && o.mute());
        this.collectibles.forEach(c => c.mute && c.mute());
    }

    resumeAllGameSounds() {
        this.soundEnabled = true;
        this.character.unmute();
        this.level.enemies.forEach(e => e.unmute && e.unmute());
        this.throwableObjects.forEach(o => o.unmute && o.unmute());
        this.collectibles.forEach(c => c.unmute && c.unmute());
    }

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

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        });
    }

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

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.x + mo.width / 2, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-mo.x - mo.width / 2, 0);
    }

    flipImageBack() {
        this.ctx.restore();
    }

    nextLevel() {
        clearInterval(this.intervalId);
        currentLevel++;
        changeLevel();
    }
}
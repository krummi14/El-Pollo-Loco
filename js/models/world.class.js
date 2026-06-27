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
        }, 200);
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
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            bottle.world = this;
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.betweenJumpingCharacterAndChicken();
        this.betweenCharacterAndEnemies();
        this.betweenEndbossAndBottle();
        this.betweenChckenAndBottle();
    }

    betweenCharacterAndEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken || enemy instanceof Babychicken && enemy.energy <= 0) {
                return;
            }
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBarHealth.setPercentage(this.character.energy);
            };
        });
    }

    betweenJumpingCharacterAndChicken() {
        this.level.enemies.forEach((enemy, index) => {
            if (enemy instanceof Chicken || enemy instanceof Babychicken) {
                if (this.character.isColliding(enemy)) {
                    if (this.character.isJumpKill(enemy)) {
                        enemy.energy = 0;
                        this.character.jump();
                    }
                }
            }
        });
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

    betweenChckenAndBottle() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach(enemy => {
                if (enemy instanceof Chicken || enemy instanceof Babychicken && bottle.isColliding(enemy)) {
                    enemy.energy = 0;
                    bottle.splash();
                }
            });
        });
    }

    checkCrossingItem() {
        this.collectibles.forEach((item, index) => {
            if (this.character.isColliding(item)) {
                if (item.type == 'coin') {
                    this.character.coins++;
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
        if (this.character.coins == this.level.totalCoins) {
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
        if (this.character.energy <= 0 && this.endboss && this.endboss.energy > 0) {
            this.gameState = 'lost';
            this.stopAllGameSounds();
            showLostScreen();
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

    stopAllGameSounds() {
        this.level.enemies.forEach(enemy => enemy.stopSound());
        this.character.stopSound();
    }

    draw() {
        if (this.gameState == 'won') return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackgrounds();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies)
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.collectibles);
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
            const offsetX = this.camera_x * bg.parallaxFactor;
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
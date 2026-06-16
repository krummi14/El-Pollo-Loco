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
    collectibles = [
        new Collectible('bottleOne'),
        new Collectible('bottleTwo'),
        new Collectible('bottleTwo'),
        new Collectible('bottleOne'),
        new Collectible('bottleTwo'),
        new Collectible('coin'),
        new Collectible('coin'),
        new Collectible('coin'),
        new Collectible('coin'),
        new Collectible('coin'),
    ];

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.createBackground();
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
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
        setInterval(() => {
            this.checkCollisions();
            this.ceckThrowObjects();
            this.checkCrossingItem();
        }, 200);
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

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackgrounds();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies)
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.collectibles);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottle);
        if (this.endboss && this.endboss.isVisible()) {
            this.addToMap(this.statusBarEndboss);
        }
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    drawBackgrounds() {
        this.level.backgroundObjects.forEach(background => {
            const offsetX = this.camera_x * background.parallaxFactor;
            this.ctx.save();
            this.ctx.translate(offsetX, 0);
            this.addToMap(background);
            this.ctx.restore();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        });
    }

    addToMap(mo) {
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

    createBackground() {
        for (let i = -1; i < 4; i++) {
            this.level.backgroundObjects.push(
                new BackgroundObject('img/5_background/layers/air.png', 720 * i, 0),
                new BackgroundObject(`img/5_background/layers/3_third_layer/${((i % 2) + 1) % 2 + 1}.png`, 720 * i, 0.1),
                new BackgroundObject(`img/5_background/layers/2_second_layer/${((i % 2) + 1) % 2 + 1}.png`, 720 * i, 0.2),
                new BackgroundObject(`img/5_background/layers/1_first_layer/${((i % 2) + 1) % 2 + 1}.png`, 720 * i, 0.3)
            );
        }
    }
}
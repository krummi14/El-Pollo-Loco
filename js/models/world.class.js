class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.createBackground();
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                };
            });
        }, 200);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackgrounds();
        this.ctx.translate(this.camera_x, 0);
        //this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);

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
        mo.drawFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.x + mo.width / 2, 0);
        //this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-mo.x - mo.width / 2, 0);
        //mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        //mo.x = mo.x * -1;
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
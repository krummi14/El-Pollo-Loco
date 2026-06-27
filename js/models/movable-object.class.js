class MovableObject extends DrawableObject {
    speed = 0.25;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    jumps = false;
    energy = 100;
    lastHit = 0;
    endbossWasTriggered = false;
    lastAction = 0;
    direction = 0;
    hasPlayedSound = false;
    borderLeft = 60;
    borderRight = 2200;

    applyGravity() {
        setInterval(() => {
            if (this.isSplashed) return;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) { //ThrowableObjects should always fall
            return true;
        } else {
            return this.y < 130
        }
    }

    isColliding(obj) {
        return this.x + this.width > obj.x &&
            this.y + this.height > obj.y &&
            this.x < obj.x &&
            this.y < obj.y + obj.height;
    }

    isJumpKill(obj) {
        return this.speedY < 0 &&
            this.y + this.height <= obj.y + obj.height * 0.5;
    }

    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
            this.lastAction = new Date().getTime();
        }
    }

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Difference in ms
        timepassed = timepassed / 1000; // Difference in sec
        return timepassed < 1;
    }

    isWaiting() {
        let timePassed = new Date().getTime() - this.lastAction;
        timePassed = timePassed / 1000;
        return timePassed <= 3 &&
            !this.world.keyboard.RIGHT &&
            !this.world.keyboard.LEFT &&
            !this.world.keyboard.SPACE &&
            !this.isAboveGround() &&
            !this.isHurt();
    }

    isNearLevelEnd() {
        if (!this.world || !this.world.levelEnd) return false;
        let distance = Math.abs(this.x - this.world.levelEnd.x);
        return distance < 150;
    }

    isSleeping() {
        let timePassed = new Date().getTime() - this.lastAction;
        timePassed = timePassed / 1000;
        return timePassed > 3 &&
            !this.world.keyboard.RIGHT &&
            !this.world.keyboard.LEFT &&
            !this.world.keyboard.SPACE &&
            !this.isAboveGround() &&
            !this.isHurt();
    }

    endbossWantsToFight() {
        if (this.x < -this.world.camera_x + this.world.canvas.width && !this.endbossWasTriggered) {
            setTimeout(() => {
                this.endbossWasTriggered = true;
            }, 2000);
        }
        return this.endbossWasTriggered == true;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length; // let i = 0 % 6
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 25;
        this.jumps = true;
    }

    setDirection() {
        if (Math.random() < 0.5) {
            this.direction = 'left';
        } else {
            this.direction = 'right';
        }
        return this.direction;
    }

    isVisible() {
        if (!this.world) return false;
        return this.x + this.width > -this.world.camera_x &&
            this.x < -this.world.camera_x + this.world.canvas.width;
    }

    moveWithBorders() {
        if (this.x >= this.borderRight) {
            this.direction = 'left';
        }
        if (this.x <= this.borderLeft) {
            this.direction = 'right';
        }
        if (this.direction === 'left') {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    stopSound() {
        if (this.sound) {
            this.sound.pause();
            this.sound.currentTime = 0;
        }
        if (this.sounds) {
            Object.values(this.sounds).forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
        }
    }
}
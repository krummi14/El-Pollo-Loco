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
    borderLeft = 100;
    borderRight = 2200;
    isConverting = false;
    isConvertedToCoin = false;
    damageGiven = 10;
    knockbackForce = 5;
    stunDuration = 0;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
    loot = {
        coins: 0,
        bottles: 0,
        coinChance: 1,
        bottleChance: 0
    };

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
            return this.y < 139;
        }
    }

    isColliding(obj) {
        if (obj.collidable == false) return false;
        const thisOffset = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        const objOffset = obj.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        const thisLeft = this.x + thisOffset.left;
        const thisRight = this.x + this.width - thisOffset.right;
        const thisTop = this.y + thisOffset.top;
        const thisBottom = this.y + this.height - thisOffset.bottom;
        const objLeft = obj.x + objOffset.left;
        const objRight = obj.x + obj.width - objOffset.right;
        const objTop = obj.y + objOffset.top;
        const objBottom = obj.y + obj.height - objOffset.bottom;
        return thisRight > objLeft &&
            thisLeft < objRight &&
            thisBottom > objTop &&
            thisTop < objBottom;
    }

    isJumpKill(obj) {
        return this.speedY < 0 &&
            this.y + this.height <= obj.y + obj.height * 0.95;
    }

    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
            this.collidable = false
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
        return timePassed > 0.25 &&
            timePassed <= 8 &&
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

    getDistanceToCharacter() {
        if (!this.world || !this.world.character) return Infinity;
        return this.world.character.x - this.x;
    }

    isNearBorder(offset = 100) {
        let nearLeft = this.x <= this.borderLeft + offset;
        let nearRight = this.x >= this.borderRight - offset;
        return nearLeft || nearRight;
    }

    isSleeping() {
        let timePassed = new Date().getTime() - this.lastAction;
        timePassed = timePassed / 1000;
        return timePassed > 8 &&
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

    startCoinConversion() {
        if (this.isConverting) return;
        this.isConverting = true;
        setTimeout(() => {
            this.isConvertedToCoin = true;
        }, 2000);
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
        if (this.direction == 'left') {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    mute() {
        if (this.sounds) {
            Object.values(this.sounds).forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
        }
        if (this.sound) {
            this.sound.pause();
            this.sound.currentTime = 0;
        }
    }

    unmute() {
        if (this.sounds) {
            Object.values(this.sounds).forEach(sound => {
                sound.volume = 1;
            });
        }
        if (this.sound) {
            this.sound.volume = 1;
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

    startChargeAttack() {
        if (this.isCharging) return;
        this.isCharging = true;
        this.speed = 4;
        setTimeout(() => {
            this.speed = 0.5;
            this.isCharging = false;
        }, 1000);
    }
}
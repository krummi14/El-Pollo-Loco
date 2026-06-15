class MovableObject extends DrawableObject {
    speed = 0.25;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    inAir = false;
    energy = 100;
    lastHit = 0;
    endbossWasTriggered = false;

    applyGravity() {
        setInterval(() => {
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

    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
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

    endbossWantsToFight() {
        let cameraLeft = -this.world.camera_x;
        let cameraRight = cameraLeft + this.world.canvas.width;
        if (this.x < cameraRight && !this.endbossWasTriggered) {
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
        this.inAir = true;
    }
}
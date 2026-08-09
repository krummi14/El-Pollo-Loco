class ThrowableObject extends MovableObject {
    IMAGES_BOTTLE_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates a throwable bottle and initializes its position,
     * direction, size and gravity.
     * @param {number} x - The horizontal starting position of the bottle.
     * @param {number} y - The vertical starting position of the bottle.
     * @param {number} direction - The direction in which the bottle is thrown.
     */
    constructor(x, y, direction) {
        super().loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATE);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.height = 60;
        this.width = 50;
        this.isSplashed = false;
        this.speedY = 20;
        this.acceleration = 1;
        this.applyGravity();
        this.animateThrowableObj();
    }

    /**
     * Changes the bottle into its splash state and stops its movement.
     * The bottle is removed from the world after the splash animation ends.
     */
    splash() {
        this.isSplashed = true;
        this.speedY = 0;
        this.acceleration = 0;
        setTimeout(() => {
            this.world.throwableObjects =
                this.world.throwableObjects.filter(obj => obj != this);
        }, this.IMAGES_BOTTLE_SPLASH.length * 50);
    }

    /**
     * Continuously moves the bottle horizontally and plays either
     * the rotation or splash animation depending on its current state.
     */
    animateThrowableObj() {
        setInterval(() => {
            if (!this.isSplashed) {
                this.x += 6 * -this.direction;
            }
        }, 25);
        setInterval(() => {
            if (this.isSplashed) {
                this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_BOTTLE_ROTATE);
            }
        }, 50);
    }
}

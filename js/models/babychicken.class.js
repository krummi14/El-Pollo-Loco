class Babychicken extends MovableObject {
    y = 340;
    height = 90;
    width = 90;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    babyChicken_sound = new Audio('audio/babychicken.wav');
    direction = 'left';

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.x = 400 + Math.random() * 2000;
        this.borderLeft = 400;
        this.borderRight = 2000;
        this.speed = 0.2 + Math.random() * 0.3;
        this.setDirection();
        this.animateBabychicken();
    }

    animateBabychicken() {
        setInterval(() => {
            if (!this.isDead() && !this.hasPlayedSound && this.isVisible()) {
                this.babyChicken_sound.play();
                this.hasPlayedSound = true;
            }
            if (this.hasPlayedSound && !this.isVisible()) {
                this.babyChicken_sound.pause();
                this.hasPlayedSound = false;
            }
            if (this.isDead()) {
                this.babyChicken_sound.pause();
                this.startCoinConversion();
                return;
            }
            this.moveWithBorders();
        }, 1000 / 60);
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGE_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    };
}
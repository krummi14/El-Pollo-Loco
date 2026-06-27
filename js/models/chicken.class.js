class Chicken extends MovableObject {
    y = 340;
    height = 90;
    width = 90;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    chicken_sound = new Audio('audio/chicken.wav');

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.x = 400 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.sound = this.chicken_sound;
        this.setDirection();
        this.animateChicken();
    }

    animateChicken() {
        setInterval(() => {
            if (!this.isDead() && !this.hasPlayedSound && this.isVisible()) {
                this.chicken_sound.play();
                this.hasPlayedSound = true;
            }
            if (this.hasPlayedSound && !this.isVisible()) {
                this.chicken_sound.pause();
                this.hasPlayedSound = false;
            }
            if (this.isDead()) {
                this.chicken_sound.pause();
                return;
            }
            if (this.direction == 'left') {
                this.moveLeft();
                this.otherDirection = false;
            } else {
                this.moveRight();
                this.otherDirection = true;
            }
        }, 1000 / 60);
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGE_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}
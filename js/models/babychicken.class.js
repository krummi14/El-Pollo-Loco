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
    babyChicken_sound = new Audio('audio/babychicken.mp3');
    direction = 'left';

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.x = 400 + Math.random() * 2000;
        this.energy = 20;
        this.borderLeft = 400;
        this.borderRight = 2000;
        this.speed = 0.35 + Math.random() * 0.25;
        this.damageGiven = 5;
        this.knockbackForce = 3;
        this.stunDuration = 0;
        this.loot = {
            coins: 1,
            coinChance: 1,
            bottles: 0,
            bottleChance: 0
        };
        this.offset = {
            top: 10,
            left: 10,
            right: 10,
            bottom: 5
        };
        this.setDirection();
        this.animateBabychicken();
    }

    animateBabychicken() {
        setInterval(() => {
            if (!this.isDead() && !this.hasPlayedSound && this.isVisible() && this.world.soundEnabled) {
                this.babyChicken_sound.play();
                this.hasPlayedSound = true;
            }
            if (this.hasPlayedSound && (!this.isVisible() || !this.world.soundEnabled)) {
                this.babyChicken_sound.pause();
                this.hasPlayedSound = false;
            }
            if (!this.isDead() && Math.random() < 0.005) {
                this.y -= 15;
                setTimeout(() => {
                    this.y += 15;
                }, 150);
            }
            if (Math.random() < 0.01) {
                this.direction = this.direction == 'left' ? 'right' : 'left';
            }
            if (this.isDead()) {
                this.babyChicken_sound.pause();
                this.startCoinConversion();
                return;
            }
            let distance = this.getDistanceToCharacter();
            if (!this.isNearBorder(100)) {
                if (Math.abs(distance) < 200) {
                    this.direction = distance < 0 ? 'right' : 'left';
                }
            }
            if (Math.random() < 0.01) {
                this.direction = this.direction == 'left' ? 'right' : 'left';
            }
            this.moveWithBorders();
        }, 1000 / 60);
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGE_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 120);
    };
}
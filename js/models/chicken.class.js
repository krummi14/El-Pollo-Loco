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
    chicken_sound = new Audio('audio/chicken.mp3');

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.x = 400 + Math.random() * 1600;
        this.energy = 40;
        this.borderLeft = 400;
        this.borderRight = 2000;
        this.speed = 0.15 + Math.random() * 0.15;
        this.damageGiven = 15;
        this.knockbackForce = 8;
        this.stunDuration = 200;
        this.loot = {
            coins: 2,
            coinChance: 0.8,
            bottles: 1,
            bottleChance: 0.2
        };
        this.offset = {
            top: 20,
            left: 20,
            right: 20,
            bottom: 10
        };
        this.sound = this.chicken_sound;
        this.setDirection();
        this.animateChicken();
    }

    animateChicken() {
        setInterval(() => {
            if (!this.isDead() && !this.hasPlayedSound && this.isVisible() && this.world.soundEnabled) {
                this.chicken_sound.play();
                this.hasPlayedSound = true;
            }
            if (this.hasPlayedSound && (!this.isVisible() || !this.world.soundEnabled)) {
                this.chicken_sound.pause();
                this.hasPlayedSound = false;
            }
            let distance = this.getDistanceToCharacter();
            if (!this.isNearBorder(100)) {
                if (Math.abs(distance) < 300) {
                    this.direction = distance < 0 ? 'left' : 'right';
                }
            }
            if (this.isDead()) {
                this.chicken_sound.pause();
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
    }
}
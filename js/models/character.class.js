class Character extends MovableObject {
    height = 300;
    y = 140;
    speed = 5;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUNPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURTING = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_WAITING = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ]
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ]
    world;
    coins = 0;
    bottles = 0;
    snoring_sound = new Audio('audio/snoring_man.mp3');
    ouch_sound = new Audio('audio/ouch.wav');
    jumping_sound = new Audio('audio/jump.wav');
    walking_sound = new Audio('audio/walking.wav');
    isStunned = false;

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUNPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURTING);
        this.loadImages(this.IMAGES_WAITING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.sounds = {
            snoring: this.snoring_sound,
            ouch: this.ouch_sound,
            jump: this.jumping_sound,
            walk: this.walking_sound
        };
        this.applyGravity();
        this.animateCharacter();
    }

    animateCharacter() {
        setInterval(() => {
            if (this.world.character.isStunned) return;
            if (this.world.gameState != 'running') return;
            if (this.world.gameState == 'won') return;
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                this.lastAction = new Date().getTime();
                this.sounds.walk.play();
            }
            if (this.world.keyboard.LEFT && this.x > this.world.level.level_start_x) {
                this.moveLeft();
                this.otherDirection = true;
                this.lastAction = new Date().getTime();
                this.sounds.walk.play();
            }
            if (this.world.keyboard.SPACE && this.jumps == false) {
                this.jump();
                this.lastAction = new Date().getTime();
                this.sounds.jump.play();
            }
            if (!this.isAboveGround()) {
                this.jumps = false;
            }
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                if (this.sounds.walk.paused) {
                    this.sounds.walk.play();
                }
            } else {
                if (!this.sounds.walk.paused) {
                    this.sounds.walk.pause();
                }
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.world.gameState != 'running') return;
            if (this.world.gameState == 'won') return;
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUNPING);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURTING);
                this.sounds.ouch.play();
            } else if (this.isWaiting()) {
                this.playAnimation(this.IMAGES_WAITING);
            } else if (this.isSleeping()) {
                this.playAnimation(this.IMAGES_SLEEPING);
                this.sounds.snoring.play();
            } else {
                this.sounds.snoring.pause();
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
    }

    applyKnockback(force, enemyX) {
        let direction = enemyX < this.x ? 1 : -1;
        this.x += direction * force;
    }

    applyStun(duration) {
        if (duration <= 0) return;
        this.isStunned = true;
        setTimeout(() => {
            this.isStunned = false;
        }, duration);
    }
}
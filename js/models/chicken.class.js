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

    /**
 * Starts the chicken movement and animation intervals.
 */
    animateChicken() {
        this.startChickenMovementInterval();
        this.startChickenAnimationInterval();
    }

    /**
     * Starts the interval responsible for chicken movement.
     */
    startChickenMovementInterval() {
        setInterval(() => this.updateChickenMovement(), 1000 / 60);
    }

    /**
     * Updates the chicken's movement, sound and character reaction.
     */
    updateChickenMovement() {
        this.handleChickenSound();
        this.handleCharacterDirection();
        if (this.isDead()) return this.handleChickenDeath();
        this.moveWithBorders();
    }

    /**
     * Handles the chicken sound based on visibility and sound settings.
     */
    handleChickenSound() {
        this.startChickenSound();
        this.stopChickenSound();
    }

    /**
     * Starts the chicken sound when all required conditions are met.
     */
    startChickenSound() {
        if (this.canPlayChickenSound()) {
            this.chicken_sound.play();
            this.hasPlayedSound = true;
        }
    }

    /**
     * Checks whether the chicken sound can currently be played.
     * @returns {boolean} True if the sound can be played.
     */
    canPlayChickenSound() {
        return !this.isDead()
            && !this.hasPlayedSound
            && this.isVisible()
            && this.world.soundEnabled;
    }

    /**
     * Stops the chicken sound when it is no longer required.
     */
    stopChickenSound() {
        if (this.hasPlayedSound && (!this.isVisible() || !this.world.soundEnabled)) {
            this.chicken_sound.pause();
            this.hasPlayedSound = false;
        }
    }

    /**
     * Adjusts the chicken's direction when the character is nearby.
     */
    handleCharacterDirection() {
        const distance = this.getDistanceToCharacter();
        if (this.shouldFollowCharacter(distance)) {
            this.setDirectionToCharacter(distance);
        }
    }

    /**
     * Checks whether the chicken should react to the character.
     * @param {number} distance - Distance between chicken and character.
     * @returns {boolean} True if the character is within reaction range.
     */
    shouldFollowCharacter(distance) {
        return !this.isNearBorder(100) && Math.abs(distance) < 300;
    }

    /**
     * Sets the chicken's direction toward the character.
     * @param {number} distance - Distance between chicken and character.
     */
    setDirectionToCharacter(distance) {
        this.direction = distance < 0 ? 'left' : 'right';
    }

    /**
     * Handles the chicken after it has died.
     */
    handleChickenDeath() {
        this.chicken_sound.pause();
        this.startCoinConversion();
    }

    /**
     * Starts the interval responsible for chicken animations.
     */
    startChickenAnimationInterval() {
        setInterval(() => this.playChickenAnimation(), 200);
    }

    /**
     * Plays the appropriate animation based on the chicken's state.
     */
    playChickenAnimation() {
        const images = this.isDead() ? this.IMAGE_DEAD : this.IMAGES_WALKING;
        this.playAnimation(images);
    }
}
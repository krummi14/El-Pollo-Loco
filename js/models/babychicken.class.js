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

    /**
     * Initializes the baby chicken with its images and properties.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.initializeProperties();
        this.setDirection();
        this.animateBabychicken();
    }

    /**
     * Initializes the baby chicken's position, movement and collision properties.
     */
    initializeProperties() {
        this.setPosition();
        this.setMovementProperties();
        this.setCombatProperties();
        this.setLoot();
        this.setOffset();
    }

    /**
     * Sets the initial random position and movement boundaries.
     */
    setPosition() {
        this.x = 400 + Math.random() * 2000;
        this.borderLeft = 400;
        this.borderRight = 2000;
    }

    /**
     * Sets the energy and movement speed of the baby chicken.
     */
    setMovementProperties() {
        this.energy = 20;
        this.speed = 0.35 + Math.random() * 0.25;
    }

    /**
     * Sets the damage, knockback and stun properties.
     */
    setCombatProperties() {
        this.damageGiven = 5;
        this.knockbackForce = 3;
        this.stunDuration = 0;
    }

    /**
     * Sets the loot and drop chances of the baby chicken.
     */
    setLoot() {
        this.loot = {
            coins: 1,
            coinChance: 1,
            bottles: 0,
            bottleChance: 0
        };
    }

    /**
     * Sets the collision offset values of the baby chicken.
     */
    setOffset() {
        this.offset = {
            top: 10,
            left: 10,
            right: 10,
            bottom: 5
        };
    }

    /**
     * Controls movement, sound effects and animation intervals.
     */
    animateBabychicken() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /**
     * Starts the interval responsible for movement and behavior.
     */
    startMovementInterval() {
        setInterval(() => this.updateMovement(), 1000 / 60);
    }

    /**
     * Updates the baby chicken's movement and behavior.
     */
    updateMovement() {
        this.handleBabyChickenSound();
        this.handleJump();
        this.handleDirectionChange();
        if (this.isDead()) return this.handleDeath();
        this.handleCharacterDirection();
        this.moveWithBorders();
    }

    /**
     * Starts the interval responsible for walking and death animations.
     */
    startAnimationInterval() {
        setInterval(() => this.playBabyChickenAnimation(), 120);
    }

    /**
     * Handles the baby chicken's sound based on visibility and sound settings.
     */
    handleBabyChickenSound() {
        this.startBabyChickenSound();
        this.stopBabyChickenSound();
    }

    /**
     * Starts the baby chicken sound when the required conditions are met.
     */
    startBabyChickenSound() {
        if (this.canPlayBabyChickenSound()) {
            this.babyChicken_sound.play();
            this.hasPlayedSound = true;
        }
    }

    /**
     * Checks whether the baby chicken sound can be played.
     * @returns {boolean} True if the sound can be played.
     */
    canPlayBabyChickenSound() {
        return !this.isDead()
            && !this.hasPlayedSound
            && this.isVisible()
            && this.world.soundEnabled;
    }

    /**
     * Stops the baby chicken sound when it is no longer required.
     */
    stopBabyChickenSound() {
        if (this.hasPlayedSound && (!this.isVisible() || !this.world.soundEnabled)) {
            this.babyChicken_sound.pause();
            this.hasPlayedSound = false;
        }
    }

    /**
     * Makes the baby chicken randomly jump.
     */
    handleJump() {
        if (!this.isDead() && Math.random() < 0.005) {
            this.performJump();
        }
    }

    /**
     * Moves the baby chicken upward and returns it after a short delay.
     */
    performJump() {
        this.y -= 15;
        setTimeout(() => this.y += 15, 150);
    }

    /**
     * Randomly changes the movement direction.
     */
    handleDirectionChange() {
        if (Math.random() < 0.01) {
            this.changeDirection();
        }
    }

    /**
     * Switches the current movement direction.
     */
    changeDirection() {
        this.direction = this.direction === 'left' ? 'right' : 'left';
    }

    /**
     * Handles the baby chicken after it has died.
     */
    handleDeath() {
        this.babyChicken_sound.pause();
        this.startCoinConversion();
    }

    /**
     * Adjusts the direction toward the character when nearby.
     */
    handleCharacterDirection() {
        const distance = this.getDistanceToCharacter();
        if (this.shouldFollowCharacter(distance)) {
            this.setDirectionToCharacter(distance);
        }
    }

    /**
     * Checks whether the baby chicken should follow the character.
     * @param {number} distance - Distance between the baby chicken and character.
     * @returns {boolean} True if the character should be followed.
     */
    shouldFollowCharacter(distance) {
        return !this.isNearBorder(100) && Math.abs(distance) < 200;
    }

    /**
     * Sets the movement direction toward the character.
     * @param {number} distance - Distance between the baby chicken and character.
     */
    setDirectionToCharacter(distance) {
        this.direction = distance < 0 ? 'right' : 'left';
    }

    /**
     * Plays either the walking or death animation.
     */
    playBabyChickenAnimation() {
        const images = this.isDead() ? this.IMAGE_DEAD : this.IMAGES_WALKING;
        this.playAnimation(images);
    }
}

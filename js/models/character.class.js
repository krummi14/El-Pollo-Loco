class Character extends MovableObject {
    height = 300;
    y = this.groundY;
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
    walking_sound = new Audio('audio/walking.mp3');
    isStunned = false;

    /**
    * Initializes the character, loads all required images and sounds,
    * and starts gravity and character animations.
    */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUNPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURTING);
        this.loadImages(this.IMAGES_WAITING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.lastAction = Date.now();
        this.sounds = {
            snoring: this.snoring_sound,
            ouch: this.ouch_sound,
            jump: this.jumping_sound,
            walk: this.walking_sound
        };
        this.offset = {
            top: 80,
            left: 40,
            right: 40,
            bottom: 20
        };
        this.applyGravity();
        this.animateCharacter();
    }

    /**
 * Starts the character movement and animation intervals.
 */
    animateCharacter() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /**
     * Starts the interval for character movement and interactions.
     */
    startMovementInterval() {
        setInterval(() => this.updateCharacterMovement(), 1000 / 60);
    }

    /**
     * Updates movement, jumping, sounds, UI and camera position.
     */
    updateCharacterMovement() {
        if (!this.canMoveCharacter()) return;
        this.handleHorizontalMovement();
        this.handleJumpInput();
        this.resetJumpState();
        this.hideThoughtBubble();
        this.handleWalkSound();
        this.updateCameraPosition();
    }

    /**
     * Checks whether the character can currently move.
     * @returns {boolean} True if the character can move.
     */
    canMoveCharacter() {
        return this.world
            && !this.world.character.isStunned
            && this.world.gameState === 'running';
    }

    /**
     * Handles horizontal movement based on keyboard input.
     */
    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT && this.canMoveRight()) {
            this.moveRight();
            this.otherDirection = false;
            this.updateLastAction();
        }
        if (this.world.keyboard.LEFT && this.canMoveLeft()) {
            this.moveLeft();
            this.otherDirection = true;
            this.updateLastAction();
        }
    }

    /**
     * Checks whether the character can move to the right.
     * @returns {boolean} True if movement to the right is possible.
     */
    canMoveRight() {
        return this.x < this.world.level.level_end_x;
    }

    /**
     * Checks whether the character can move to the left.
     * @returns {boolean} True if movement to the left is possible.
     */
    canMoveLeft() {
        return this.x > this.world.level.level_start_x;
    }

    /**
     * Updates the timestamp of the character's last action.
     */
    updateLastAction() {
        this.lastAction = Date.now();
    }

    /**
     * Handles jumping based on keyboard input.
     */
    handleJumpInput() {
        if (this.world.keyboard.SPACE && !this.jumps) {
            this.jump();
            this.updateLastAction();
            this.playJumpSound();
        }
    }

    /**
     * Plays the jump sound when sound is enabled.
     */
    playJumpSound() {
        if (this.world.soundEnabled) {
            this.sounds.jump.play();
        }
    }

    /**
     * Resets the jump state after the character lands.
     */
    resetJumpState() {
        if (!this.isAboveGround()) {
            this.jumps = false;
        }
    }

    /**
     * Hides the thought bubble after character input.
     */
    hideThoughtBubble() {
        const bubble = document.getElementById('pepeThoughtBubble');
        const hasInput = this.world.keyboard.RIGHT
            || this.world.keyboard.LEFT
            || this.world.keyboard.SPACE;
        if (bubble && hasInput) bubble.classList.add('hidden');
    }

    /**
     * Handles walking sound based on horizontal movement.
     */
    handleWalkSound() {
        const isWalking = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
        if (isWalking && this.world.soundEnabled) {
            this.playWalkSound();
        } else {
            this.stopWalkSound();
        }
    }

    /**
     * Starts the walking sound if it is currently paused.
     */
    playWalkSound() {
        if (this.sounds.walk.paused) {
            this.sounds.walk.play();
        }
    }

    /**
     * Stops the walking sound when the character is not moving.
     */
    stopWalkSound() {
        if (!this.sounds.walk.paused) {
            this.sounds.walk.pause();
        }
    }

    /**
     * Updates the camera position according to the character position.
     */
    updateCameraPosition() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Starts the interval for character animations.
     */
    startAnimationInterval() {
        setInterval(() => this.updateCharacterAnimation(), 150);
    }

    /**
     * Updates the character animation according to its current state.
     */
    updateCharacterAnimation() {
        if (!this.canAnimateCharacter()) return;
        if (this.isDead()) return this.playDeathAnimation();
        if (this.isAboveGround()) return this.playJumpAnimation();
        if (this.isHurt()) return this.playHurtAnimation();
        if (this.isWaiting()) return this.playWaitingAnimation();
        if (this.isSleeping()) return this.playSleepingAnimation();
        this.playWalkingAnimation();
    }

    /**
     * Checks whether character animations can currently be played.
     * @returns {boolean} True if animations can be played.
     */
    canAnimateCharacter() {
        return this.world && this.world.gameState === 'running';
    }

    /**
     * Plays the character's death animation.
     */
    playDeathAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
    }

    /**
     * Plays the character's jumping animation.
     */
    playJumpAnimation() {
        this.playAnimation(this.IMAGES_JUNPING);
    }

    /**
     * Plays the character's hurt animation and sound.
     */
    playHurtAnimation() {
        this.playAnimation(this.IMAGES_HURTING);
        if (this.world.soundEnabled) this.sounds.ouch.play();
    }

    /**
     * Plays the character's waiting animation.
     */
    playWaitingAnimation() {
        this.playAnimation(this.IMAGES_WAITING);
    }

    /**
     * Plays the sleeping animation and snoring sound.
     */
    playSleepingAnimation() {
        this.playAnimation(this.IMAGES_SLEEPING);
        if (this.world.soundEnabled) this.sounds.snoring.play();
    }

    /**
     * Plays the walking animation when the character is moving.
     */
    playWalkingAnimation() {
        this.sounds.snoring.pause();
        if (this.isMovingHorizontally()) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Checks whether the character is moving horizontally.
     * @returns {boolean} True if left or right movement is active.
     */
    isMovingHorizontally() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    /**
     * Moves the character away from an enemy after being hit.
     *
     * @param {number} force - Strength of the knockback movement.
     * @param {number} enemyX - X position of the enemy causing the knockback.
     */
    applyKnockback(force, enemyX) {
        let direction = enemyX < this.x ? 1 : -1;
        this.x += direction * force;
    }

    /**
    * Temporarily prevents the character from moving after being hit.
    *
    * @param {number} duration - Duration of the stun effect in milliseconds.
    */
    applyStun(duration) {
        if (duration <= 0) return;
        this.isStunned = true;
        setTimeout(() => {
            this.isStunned = false;
        }, duration);
    }
}
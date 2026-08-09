class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 50;
    isCharging = false;
    lastChargeAttack = 0;
    chargeDistance = 0;
    maxChargeDistance = 250;
    chargeSpeed = 8;
    chargeCooldown = 2000;
    bossAreaLeft = 1700;
    bossAreaRight = 3000;
    attackRange = 600;
    followDistance = 700;
    isReturningToArea = false;
    returnDirection = null;
    returnDistance = 300;
    isJumping = false;
    jumpHeight = 200;
    lastJump = 0;
    jumpCooldown = 3000;
    IMAGES_ANGRY = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ]
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ]
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ]
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ]
    endboss_sound = new Audio('audio/endboss.mp3');

    /**
     * Initializes the endboss with its images, energy, damage values,
     * loot configuration, sound and starting animation.
     */
    constructor() {
        super().loadImage('img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_ANGRY);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTACK);
        this.energy = 100;
        this.damageGiven = 40;
        this.speed = 1.2;
        this.loot = {
            coins: 10,
            bottles: 3,
            coinChance: 1,
            bottleChance: 0
        };
        this.sound = this.endboss_sound;
        this.waitForWorldThenStart();
    }

    /**
 * Makes the endboss perform a small jump when the jump cooldown has expired.
 */
    jump() {
        if (this.isJumping || this.isCharging || this.isDead()) return;
        const now = Date.now();
        if (now - this.lastJump < this.jumpCooldown) return;
        this.lastJump = now;
        this.isJumping = true;
        this.y -= 25;
        setTimeout(() => {
            this.y += 25;
            this.isJumping = false;
        }, 200);
    }

    /**
    * Moves the endboss towards the character when the character
    * is positioned to the left of the endboss.
    */
    moveTowardsPlayerFromLeft() {
        if (!this.world || !this.world.character) return;
        const player = this.world.character;
        if (player.x < this.x) {
            this.moveLeft();
            this.otherDirection = false;
        }
    }

    /**
    * Keeps the endboss inside its defined boss area and starts
    * the appropriate return movement when a border is reached.
    */
    stayInsideBossArea() {
        if (this.isReturningToArea) {
            return this.continueReturnToArea();
        }
        if (this.isAtLeftBossBorder()) {
            this.startReturnRight();
            return true;
        }
        if (this.isAtRightBossBorder()) {
            this.startReturnLeft();
            return true;
        }
        return false;
    }

    /**
     * Continues the endboss movement towards the inside of the
     * boss area according to the current return direction.
    */
    continueReturnToArea() {
        if (this.returnDirection == 'right') {
            return this.returnRight();
        }
        if (this.returnDirection == 'left') {
            return this.returnLeft();
        }
        return false;
    }

    /**
    * Moves the endboss to the right while returning from the
    * left border and stops the return movement after the
    * configured return distance is reached.
    */
    returnRight() {
        this.moveRight();
        this.otherDirection = true;
        if (this.x >= this.bossAreaLeft + this.returnDistance) {
            this.stopReturning();
        }
        return true;
    }

    /**
    * Moves the endboss to the right while returning from the
    * left border and stops the return movement after the
    * configured return distance is reached.
    */
    returnLeft() {
        this.moveLeft();
        this.otherDirection = false;
        if (this.x <= this.bossAreaRight - this.returnDistance) {
            this.stopReturning();
        }
        return true;
    }

    /**
     * Checks whether the endboss has reached or crossed the
    * left border of its defined boss area.
    */
    isAtLeftBossBorder() {
        return this.x <= this.bossAreaLeft;
    }

    /**
     * Checks whether the endboss has reached or crossed the
    * right border of its defined boss area.
    */
    isAtRightBossBorder() {
        return this.x >= this.bossAreaRight;
    }

    /**
    * Places the endboss at the left border and starts its
    * return movement towards the right side of the boss area.
    */
    startReturnRight() {
        this.x = this.bossAreaLeft;
        this.isReturningToArea = true;
        this.returnDirection = 'right';
    }

    /**
     * Places the endboss at the right border and starts its
     * return movement towards the left side of the boss area.
     */
    startReturnLeft() {
        this.x = this.bossAreaRight;
        this.isReturningToArea = true;
        this.returnDirection = 'left';
    }

    /**
    * Stops the current return movement and clears the
    * stored return direction.
    */
    stopReturning() {
        this.isReturningToArea = false;
        this.returnDirection = null;
    }

    /**
   * Waits until the world reference is available before
   * starting the endboss animation and behavior loops.
   */
    waitForWorldThenStart() {
        let interval = setInterval(() => {
            if (this.world) {
                clearInterval(interval);
                this.animateEndboss();
            }
        }, 50);
    }

    /**
     * Starts a charge attack when the endboss is able to attack
     * and is not currently charging.
     */
    startEndbossCharge() {
        if (this.isCharging || !this.canCharge()) return;
        this.prepareCharge();
    }

    /**
    * Checks whether the endboss currently has all requirements
    * needed to start a charge attack.
    * @returns {boolean} True if the endboss can start charging.
    */
    canCharge() {
        if (!this.world || !this.world.character) return false;
        if (this.isChargeOnCooldown()) return false;
        return this.isPlayerInAttackRange();
    }

    /**
    * Checks whether the cooldown period since the last charge
    * attack has not yet expired.
    * @returns {boolean} True while the charge is still on cooldown.
    */
    isChargeOnCooldown() {
        const now = Date.now();
        return now - this.lastChargeAttack < this.chargeCooldown;
    }

    /**
     * Checks whether the character is positioned to the left of
     * the endboss and within the configured attack range.
     * @returns {boolean} True if the character is in attack range.
     */
    isPlayerInAttackRange() {
        const player = this.world.character;

        if (player.x >= this.x) return false;

        const distance = this.x - player.x;
        return distance <= this.attackRange;
    }

    /**
    * Initializes the charge attack by storing the attack time,
    * enabling the charging state and setting the charge distance.
    */
    prepareCharge() {
        this.lastChargeAttack = Date.now();
        this.isCharging = true;
        this.chargeDistance = 0;
        this.otherDirection = false;
    }

    /**
  * Controls the main endboss AI by prioritizing charge attacks,
  * boss area restrictions, random jumps and movement towards the character.
  */
    updateBossAI() {
        if (!this.world || !this.world.character) return;
        if (this.handleCharge()) return;
        if (this.handleBossArea()) return;
        if (Math.random() < 0.005) {
            this.jump();
        }
        this.handlePlayerDistance();
    }

    /**
    * Handles the active charge attack and prevents other AI
    * actions while the endboss is charging.
    * @returns {boolean} True if a charge attack is currently active.
    */
    handleCharge() {
        if (!this.isCharging) return false;

        this.otherDirection = false;
        this.performChargeAttack();
        return true;
    }

    /**
    * Checks and handles the endboss movement restrictions
    * within its defined boss area.
    * @returns {boolean} True if the boss area behavior is active.
    */
    handleBossArea() {
        return this.stayInsideBossArea();
    }

    /**
    * Handles the endboss movement based on the character's
    * position and starts a charge attack when appropriate.
    */
    handlePlayerDistance() {
        const player = this.world.character;
        if (player.x >= this.x) return;
        const distance = this.x - player.x;
        if (distance <= this.attackRange) {
            this.startEndbossCharge();
            if (this.isCharging) return;
        }
        this.moveLeft();
        this.otherDirection = false;
    }

    /**
    * Moves the endboss forward during an active charge attack
    * and stops the attack when the maximum distance or boss
    * area border is reached.
    */
    performChargeAttack() {
        if (!this.isCharging) return;
        this.otherDirection = false;
        this.x -= this.chargeSpeed;
        this.chargeDistance += this.chargeSpeed;
        if (this.x <= this.bossAreaLeft) {
            this.x = this.bossAreaLeft;
            this.isCharging = false;
        }
        this.stopChargeAtMaxDistance();
    }

    /**
    * Stops the current charge attack once the configured
    * maximum charge distance has been reached.
    */
    stopChargeAtMaxDistance() {
        if (this.chargeDistance >= this.maxChargeDistance) {
            this.isCharging = false;
        }
    }

    /**
  * Plays the endboss sound only after the user has interacted
  * with the game and enabled game sounds.
  */
    playEndbossSound() {
        if (!this.world) return;
        if (!this.world.soundEnabled) return;
        if (!this.world.userHasInteracted) return;
        if (this.endboss_sound.paused) {
            this.endboss_sound.play().catch(() => { });
        }
    }

    /**
    * Starts the endboss AI and animation loops and updates
    * movement, attacks, sounds and animations while the game
    * is running.
    */
    animateEndboss() {
        setInterval(() => {
            if (this.world.gameState != 'running') return;
            if (this.isDead()) return;
            if (!this.endbossWantsToFight()) return;
            this.playEndbossSound();
            this.updateBossAI();

        }, 1000 / 60);
        setInterval(() => {
            if (this.world.gameState != 'running') return;
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isCharging) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else if (this.endbossWantsToFight()) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}  
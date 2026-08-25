/**
 * Represents a collectible item such as a bottle or coin.
 * The appearance of the collectible is determined by its type.
 */
class Collectible extends DrawableObject {
    IMAGE_BOTTLE_ONE = 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png';
    IMAGE_BOTTLE_TWO = 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
    IMAGE_COIN = 'img/8_coin/coin_1.png';
    collectibleSound = new Audio('audio/feedback.mp3');

    /**
     * Collision-box insets relative to the collectible image.
     *
     * @type {{
     *   top: number,
     *   left: number,
     *   right: number,
     *   bottom: number
     * }}
     */
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    /**
     * Creates a new collectible with a random horizontal position.
     * @param {string} type - The type of collectible to create.
     */
    constructor(type) {
        super();
        this.setTypeOfCollectible(type);
        this.x = 200 + Math.random() * 2000;
        this.y = 330;
        this.height = 100;
        this.width = 80;
        this.setCollisionOffset();
    }

    /**
     * Sets the collectible type and loads the corresponding image.
     * @param {string} type - The type of collectible.
     */
    setTypeOfCollectible(type) {
        this.type = type;
        if (type == 'bottleOne') {
            this.loadImage(this.IMAGE_BOTTLE_ONE);
        } else if (type == 'bottleTwo') {
            this.loadImage(this.IMAGE_BOTTLE_TWO);
        } else if (type == 'coin') {
            this.loadImage(this.IMAGE_COIN);
        }
    }

    /**
 * Plays the sound when the collectible is collected.
 */
    playCollectSound() {
        if (soundMuted) return;
        this.collectibleSound.currentTime = 0;
        playSound(this.collectibleSound, 'endboss');
    }

    /**
     * Mutes the collectible sound.
     */
    mute() {
        this.collectibleSound.pause();
        this.collectibleSound.currentTime = 0;
    }

    /**
     * Sets the collision-box according to the collectible type.
     */
    setCollisionOffset() {
        if (this.type == 'coin') {
            this.offset = {
                top: 25,
                left: 40,
                right: 40,
                bottom: 25
            };
            return;
        }
        this.offset = {
            top: 10,
            left: 45,
            right: 35,
            bottom: 10
        };
    }
}
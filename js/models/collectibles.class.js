/**
 * Represents a collectible item such as a bottle or coin.
 * The appearance of the collectible is determined by its type.
 */
class Collectible extends DrawableObject {
    IMAGE_BOTTLE_ONE = 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png';
    IMAGE_BOTTLE_TWO = 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
    IMAGE_COIN = 'img/8_coin/coin_1.png';

    /**
     * Creates a new collectible with a random horizontal position.
     * @param {string} type - The type of collectible to create.
     */
    constructor(type) {
        super();
        this.setTypeOfCollectible(type);
        this.x = this.x = 200 + Math.random() * 2000;
        this.y = 370;
        this.height = 60;
        this.width = 50;
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
}
class Collectible extends DrawableObject {
    IMAGE_BOTTLE = 'img/7_statusbars/3_icons/icon_salsa_bottle.png';
    IMAGE_COIN = 'img/8_coin/coin_1.png';

    constructor(type) {
        super();
        this.setTypeOfCollectible(type);
        this.x = this.x = 200 + Math.random() * 2000;
        this.y = 370;
        this.height = 60;
        this.width = 50;
    }

    setTypeOfCollectible(type) {
        this.type = type;
        if (type == 'bottle') {
            this.loadImage(this.IMAGE_BOTTLE);
        } else if (type == 'coin') {
            this.loadImage(this.IMAGE_COIN);
        }
    }
}
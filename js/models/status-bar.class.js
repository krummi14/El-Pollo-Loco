/**
 * Represents a status bar used to display health, coins, bottles
 * or the Endboss energy on the game screen.
 */
class Statusbar extends DrawableObject {
    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];
    IMAGES_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];
    IMAGES_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
    ]
    IMAGES_ENDBOSS = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ]
    percentage = 100;
    IMAGES;

    /**
     * Creates a new status bar and initializes its position,
     * size, images and starting percentage.
     * @param {string} type - The type of status bar to create.
     */
    constructor(type) {
        super();
        this.positionOfStatusbars(type);
        this.width = 200;
        this.height = 70;
        this.loadImages(this.IMAGES);
        this.setVolumeOfStatusbar(type)
    }

    /**
    * Selects the correct image set and screen position
    * based on the type of status bar.
    * @param {string} type - The type of status bar.
    */
    positionOfStatusbars(type) {
        if (type == 'bottle') {
            this.IMAGES = this.IMAGES_BOTTLE;
            this.x = 20;
            this.y = 0;
        } else if (type == 'coin') {
            this.IMAGES = this.IMAGES_COIN;
            this.x = 20;
            this.y = 50;
        } else if (type == 'health') {
            this.IMAGES = this.IMAGES_HEALTH;
            this.x = 20;
            this.y = 100;
        } else if (type == 'endboss') {
            this.IMAGES = this.IMAGES_ENDBOSS;
            this.x = 500;
            this.y = 10;
        }
    }

    /**
     * Sets the initial percentage value according to the status bar type.
     * @param {string} type - The type of status bar.
     */
    setVolumeOfStatusbar(type) {
        if (type == 'bottle') {
            this.setPercentage(0);
        } else if (type == 'coin') {
            this.setPercentage(0);
        } else if (type == 'health') {
            this.setPercentage(100);
        } else if (type == 'endboss') {
            this.setPercentage(100);
        }
    }

    /**
     * Updates the status bar percentage and selects the corresponding image.
     * @param {number} percentage - The current percentage value of the status bar.
     */
    setPercentage(percentage) {
        this.percentage = percentage; // => 0 ... 5
        let imagepath = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[imagepath];
    }

    /**
     * Determines which status bar image should be displayed
     * based on the current percentage.
     * @returns {number} The index of the image matching the percentage.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}


class Statusbar extends DrawableObject {
    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png', //0
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png' //5
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
    percentage = 100;
    IMAGES;

    constructor(type) {
        super();
        this.positionOfStatusbars(type);
        this.width = 200;
        this.height = 70;
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

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
        }
    }

    setPercentage(percentage) {
        this.percentageHealth = percentage; // => 0 ... 5
        let imagepath = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[imagepath];
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}


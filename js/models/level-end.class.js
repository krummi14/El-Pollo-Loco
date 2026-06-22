class LevelEnd extends MovableObject {
    IMAGES_OPENING = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png'
    ];

    IMAGES_OPEN = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png'
    ];

    constructor() {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_OPENING);
        this.loadImages(this.IMAGES_OPEN);
        this.x = 2100;
        this.y = -40;
        this.width = 400;
        this.height = 550;
        this.isOpen = false;
        this.isFullyOpen = false;
        this.canBeOpened = false;
    }

    open() {
        this.isOpen = true;
        this.playAnimation(this.IMAGES_OPENING);
        setTimeout(() => {
            this.playAnimation(this.IMAGES_OPEN);
            this.isFullyOpen = true;
        }, 600);
    }
}

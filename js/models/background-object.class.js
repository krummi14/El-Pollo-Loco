class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    constructor(imagepath, x, parallaxFactor = 1) {
        super();
        this.loadImage(imagepath);
        this.parallaxFactor = parallaxFactor;
        this.x = x;
        this.y = 480 - this.height;
    }
}
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    constructor(imagepath, x, parallaxFactor = 1) {
        super().loadImage(imagepath);
        this.x = x;
        this.y = 480 - this.height;
        this.parallaxFactor = parallaxFactor;
    }

    draw(ctx, camera_x) {
        const offsetX = camera_x * this.parallaxFactor;
        ctx.drawImage(this.img, this.x + offsetX, this.y, this.width, this.height);
    }
}
class DrawableObject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads an image from the specified path and stores it as
     * the current image of the drawable object.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image() // this.img = document.getElementById('image') <img id="image" src="">
        this.img.src = path;
    }

    /**
     * Draws the current image on the specified canvas context
     * using the object's position, width and height.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     */
    draw(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.img, Math.round(this.x), Math.round(this.y), this.width, this.height
        );
    }

    /**
      * Loads multiple images and stores them in the image cache
      * for later use by the object.
      * @param {Array<string>} arr - Array containing the paths to the image files.
      */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
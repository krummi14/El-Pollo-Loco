/**
 * Represents a background object that is rendered in the game world.
 * Supports individual positioning and a parallax factor for depth effects.
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a new background object.
     * @param {string} imagepath - The path to the background image.
     * @param {number} x - The horizontal position of the background object.
     * @param {number} parallaxFactor - The factor used for the parallax scrolling effect.
     */
    constructor(imagepath, x, parallaxFactor = 1) {
        super();
        this.loadImage(imagepath);
        this.parallaxFactor = parallaxFactor;
        this.x = x;
        this.y = 480 - this.height;
    }
}
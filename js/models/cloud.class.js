/**
 * Represents a moving cloud in the game background.
 * Clouds are placed at non-overlapping horizontal positions
 * and move continuously from right to left.
 */
class Cloud extends MovableObject {
    IMAGES_CLOUD = [
        'img/5_background/layers/4_clouds/1.png',
        'img/5_background/layers/4_clouds/2.png'
    ];

    /**
     * Creates a new cloud with a random non-overlapping position.
     * @param {Cloud[]} existingClouds - Existing clouds used to prevent overlapping.
     * @param {number} index - Index used to select the cloud image.
     */
    constructor(existingClouds = [], index = 0) {
        super();
        this.width = 500;
        this.height = 250;
        this.y = 20;
        this.loadImage(this.IMAGES_CLOUD[index % 2]);
        this.x = this.getNonOverlappingX(existingClouds);
        this.speed = 0.07 + Math.random() * 0.1;
        this.animateCloud();
    }

    /**
     * Finds a random horizontal position where the cloud does not overlap
     * with any existing cloud.
     * @param {Cloud[]} existingClouds - Existing clouds to check against.
     * @returns {number} A suitable horizontal position for the new cloud.
     */
    getNonOverlappingX(existingClouds) {
        let x;
        let tries = 0;
        do {
            x = 200 + Math.random() * 2800;
            tries++;
            if (tries > 200) break;
        } while (existingClouds.some(c =>
            x < c.x + c.width + 50 && x + this.width + 50 > c.x
        ));
        return x;
    }

    /**
     * Starts the cloud animation and continuously moves the cloud to the left.
     */
    animateCloud() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
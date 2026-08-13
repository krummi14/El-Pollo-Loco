/**
 * Represents a game level and contains all enemies, clouds,
 * background objects, collectibles and level boundaries.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    collectibles;
    level_end_x = 2200;
    level_start_x = 100;
    levelStart = 100;
    requiredCoins = 5;

    /**
     * Creates a new level with its game objects and initializes the background.
     * @param {MovableObject[]} enemies - Enemies contained in the level.
     * @param {Cloud[]} clouds - Clouds contained in the level.
     * @param {Collectible[]} collectibles - Collectible items in the level.
     * @param {LevelEnd} levelEnd - The exit object of the level.
     * @param {number} levelStart - The starting position of the level.
     */
    constructor(enemies, clouds, collectibles, levelEnd, levelStart) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.collectibles = collectibles;
        this.levelEnd = levelEnd;
        this.levelStart = levelStart
        this.backgroundObjects = [];
        this.createBackground();
        this.safeNumberOfCurrentCoins();
    }

    /**
    * Creates and adds the background layers with different
    * parallax factors to create a scrolling depth effect.
    */
    createBackground() {
        for (let i = -1; i < 4; i++) {
            this.backgroundObjects.push(
                new BackgroundObject('img/5_background/layers/air.png', 720 * i, 0),
                new BackgroundObject(`img/5_background/layers/3_third_layer/${((i % 2) + 1) % 2 + 1}.png`, 720 * i, 0.1),
                new BackgroundObject(`img/5_background/layers/2_second_layer/${((i % 2) + 1) % 2 + 1}.png`, 720 * i, 0.2),
                new BackgroundObject(`img/5_background/layers/1_first_layer/${((i % 2) + 1) % 2 + 1}.png`, 720 * i, 0.3)
            );
        }
    }

    /**
     * Calculates the total number of coins available from enemy loot.
     * Stores the result for use when checking level requirements.
     */
    safeNumberOfCurrentCoins() {
        this.totalCoins = this.enemies.reduce((sum, enemy) => {
            return sum + enemy.loot.coins;
        }, 0);
    }
}
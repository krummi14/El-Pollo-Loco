class Level {
    enemies;
    clouds;
    backgroundObjects;
    collectibles;
    level_end_x = 2200;
    level_start_x = 100;

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

    safeNumberOfCurrentCoins() {
        this.totalCoins = this.collectibles.filter(c => c.type == 'coin').length;
    }
}
class Level {
    enemies;
    clouds;
    backgroundObjects;
    collectibles;
    level_end_x = 2200;

    constructor(enemies, clouds, backgroundObjects, collectibles = [], levelEnd) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectibles = collectibles;
        this.levelEnd = levelEnd;
        this.safeNumberOfCurrentCoins();
    }

    safeNumberOfCurrentCoins() {
        this.totalCoins = this.collectibles.filter(c => c.type == 'coin').length;
    }
}
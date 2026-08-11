/**
 * Converts collected coins into bottles when level 3
 * and all required conditions are fulfilled.
 * @param {World} world - Current game world.
 */
function convertCoinsToBottles(world) {
    if (!canConvertCoins(world)) return;

    const bottles = Math.min(world.character.coins, 5);
    world.character.bottles = bottles;
    world.character.coins = 0;

    world.statusBarBottle.setPercentage(bottles * 20);
    world.statusBarCoins.setPercentage(0);
}

/**
 * Checks whether the player can convert coins into bottles.
 * @param {World} world - Current game world.
 * @returns {boolean} True if all conversion conditions are fulfilled.
 */
function canConvertCoins(world) {
    return currentLevel === 3
        && world.character.energy > 0
        && world.character.bottles === 0
        && world.character.coins > 0
        && world.endboss?.energy > 0
        && !areChickensAlive(world)
        && onlyEndbossRemains(world);
}

/**
 * Checks whether chickens are still alive.
 * @param {World} world - Current game world.
 * @returns {boolean} True if a chicken remains.
 */
function areChickensAlive(world) {
    return world.level.enemies.some(enemy => isChicken(enemy));
}

/**
 * Checks whether only the Endboss remains.
 * @param {World} world - Current game world.
 * @returns {boolean} True if no other enemy remains.
 */
function onlyEndbossRemains(world) {
    return world.level.enemies.every(
        enemy => enemy instanceof Endboss
    );
}

/**
 * Drops collectible coins according to the enemy's loot settings.
 * @param {World} world - Current game world.
 * @param {MovableObject} enemy - Enemy dropping the coins.
 */
function dropCoins(world, enemy) {
    for (let i = 0; i < enemy.loot.coins; i++) {
        if (Math.random() >= enemy.loot.coinChance) continue;

        const coin = new Collectible('coin');
        coin.x = enemy.x + i * 15;
        coin.y = enemy.y;
        world.collectibles.push(coin);
    }
}

/**
 * Drops collectible bottles according to the enemy's loot settings.
 * @param {World} world - Current game world.
 * @param {MovableObject} enemy - Enemy dropping the bottles.
 */
function dropBottles(world, enemy) {
    for (let i = 0; i < enemy.loot.bottles; i++) {
        if (Math.random() >= enemy.loot.bottleChance) continue;

        const bottle = new Collectible('bottleOne');
        bottle.x = enemy.x + i * 15;
        bottle.y = enemy.y;
        world.collectibles.push(bottle);
    }
}
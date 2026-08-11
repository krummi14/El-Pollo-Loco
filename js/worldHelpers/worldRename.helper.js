/**
 * Collects all items touched by the character.
 * @param {World} world - Current game world.
 */
function collectItems(world) {
    world.collectibles.forEach((item, index) => {
        if (!world.character.isColliding(item)) return;
        collectItem(world, item);
        world.collectibles.splice(index, 1);
    });
}

/**
 * Adds the collected item to the player's inventory.
 * @param {World} world - Current game world.
 * @param {Collectible} item - Collected item.
 */
function collectItem(world, item) {
    if (item.type === 'coin') collectCoin(world);
    if (isBottle(item)) collectBottle(world);
}

/**
 * Adds a coin to the player's inventory.
 * @param {World} world - Current game world.
 */
function collectCoin(world) {
    world.character.coins = Math.min(
        world.character.coins + 1,
        5
    );
    world.statusBarCoins.setPercentage(
        world.character.coins * 20
    );
}

/**
 * Adds a bottle to the player's inventory.
 * @param {World} world - Current game world.
 */
function collectBottle(world) {
    world.character.bottles++;
    world.statusBarBottle.setPercentage(
        world.character.bottles * 20
    );
}

/**
 * Checks whether an item is a bottle.
 * @param {Collectible} item - Item to check.
 * @returns {boolean} True if the item is a bottle.
 */
function isBottle(item) {
    return item.type === 'bottleOne'
        || item.type === 'bottleTwo';
}
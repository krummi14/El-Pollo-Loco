/**
 * Converts defeated chickens into collectible loot.
 * @param {World} world - Current game world.
 */
function convertDeadChickens(world) {
    for (let i = world.level.enemies.length - 1; i >= 0; i--) {
        const enemy = world.level.enemies[i];

        if (!isConvertedChicken(enemy)) continue;

        dropLoot(world, enemy);
        world.level.enemies.splice(i, 1);
    }
}

/**
 * Checks whether an enemy is a converted chicken.
 * @param {MovableObject} enemy - Enemy to check.
 * @returns {boolean} True if the enemy can be removed.
 */
function isConvertedChicken(enemy) {
    return isChicken(enemy) && enemy.isConvertedToCoin;
}

/**
 * Drops all configured loot for an enemy.
 * @param {World} world - Current game world.
 * @param {MovableObject} enemy - Enemy dropping loot.
 */
function dropLoot(world, enemy) {
    dropCoins(world, enemy);
    dropBottles(world, enemy);
}
/**
 * Resets the complete world state.
 * @param {World} world - Current game world.
 */
function resetWorld(world) {
    resetCollectibles(world);
    resetCharacter(world);
    resetThrowableObjects(world);
    resetEndboss(world);
}

/**
 * Resets all collectibles of the current level.
 * @param {World} world - Current game world.
 */
function resetCollectibles(world) {
    world.collectibles = world.level.collectibles.map(
        collectible => new Collectible(collectible.type)
    );
}

/**
 * Resets the character position, health and inventory.
 * @param {World} world - Current game world.
 */
function resetCharacter(world) {
    world.camera_x = 0;
    world.character.x = 120;
    world.character.y = 100;
    world.character.speedY = 0;
    world.character.energy = 100;
    world.character.coins = 0;
    world.character.bottles = 0;
}

/**
 * Removes all currently thrown objects.
 * @param {World} world - Current game world.
 */
function resetThrowableObjects(world) {
    world.throwableObjects = [];
}

/**
 * Resets the Endboss if the current level contains one.
 * @param {World} world - Current game world.
 */
function resetEndboss(world) {
    if (!world.endboss) return;

    world.endboss.endbossWasTriggered = false;
    world.endboss.energy = 100;
    world.endboss.x = 2500;
}
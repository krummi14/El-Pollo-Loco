/**
 * Stops all sounds belonging to the current game.
 * @param {World} world - Current game world.
 */
function stopAllGameSounds(world) {
    world.soundEnabled = false;
    muteObjects(world);
}

/**
 * Resumes all sounds belonging to the current game.
 * @param {World} world - Current game world.
 */
function resumeAllGameSounds(world) {
    world.soundEnabled = true;
    unmuteObjects(world);
}

/**
 * Mutes all sound-producing game objects.
 * @param {World} world - Current game world.
 */
function muteObjects(world) {
    world.character.mute();
    world.level.enemies.forEach(object => object.mute?.());
    world.throwableObjects.forEach(object => object.mute?.());
    world.collectibles.forEach(object => object.mute?.());
}

/**
 * Unmutes all sound-producing game objects.
 * @param {World} world - Current game world.
 */
function unmuteObjects(world) {
    world.character.unmute();
    world.level.enemies.forEach(object => object.unmute?.());
    world.throwableObjects.forEach(object => object.unmute?.());
    world.collectibles.forEach(object => object.unmute?.());
}
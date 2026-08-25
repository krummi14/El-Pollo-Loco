/**
 * Checks whether the Endboss has been defeated.
 * @param {World} world - Current game world.
 */
function checkEndbossWin(world) {
    if (
        world.gameState == 'running' &&
        world.endboss &&
        world.endboss.energy <= 0
    ) {
        world.gameState = 'won';
        world.stopAllGameSounds();
        showWinScreen();
    }
}

/**
 * Checks whether the character has lost against the Endboss.
 * @param {World} world - Current game world.
 */
function checkCharacterLost(world) {
    if (
        world.gameState == 'running' &&
        world.character.energy <= 0 &&
        world.endboss &&
        world.endboss.energy > 0 &&
        world.character.hasStarted
    ) {
        world.gameState = 'lost';
        world.stopAllGameSounds();
        showLostScreen();
    }
}

/**
 * Checks whether the game is over without an active Endboss.
 * @param {World} world - Current game world.
 */
function checkGameOver(world) {
    if (
        world.gameState === 'running' &&
        world.character.energy <= 0 &&
        (!world.endboss || world.endboss.energy <= 0) &&
        world.character.hasStarted
    ) {
        world.gameState = 'gameover';
        world.stopAllGameSounds();
        showGameOverScreen();
    }
}

/**
 * Updates the level-end state and displays the appropriate hint.
 * @param {World} world - Current game world.
 */
function updateLevelEnd(world) {
    if (!world.levelEnd) return;

    if (!world.character.isNearLevelEnd()) {
        world.hintMessage = "";
        return;
    }

    if (world.character.coins >= 5) {
        world.levelEnd.canBeOpened = true;
        world.hintMessage = 'Please press "F" to enter next level';
    } else {
        world.hintMessage = 'Please collect all coins!';
    }
}

/**
 * Opens the level gate when the player presses F near the gate.
 * @param {World} world - Current game world.
 */
function openLevelGate(world) {
    if (!world.levelEnd) return;

    if (
        world.keyboard.F &&
        world.levelEnd.canBeOpened &&
        !world.levelEnd.isOpen &&
        world.character.x > world.levelEnd.x - 150 &&
        world.character.x < world.levelEnd.x + 150
    ) {
        world.levelEnd.open();
    }
}

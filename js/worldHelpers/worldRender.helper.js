/**
 * Draws the complete game world.
 * @param {World} world - Current game world.
 */
function drawWorld(world) {
    world.ctx.clearRect(
        0,
        0,
        world.canvas.width,
        world.canvas.height
    );
    drawBackgrounds(world);
    drawGameObjects(world);
    drawStatusBars(world);
}

/**
 * Draws all background objects with their parallax effect.
 * @param {World} world - Current game world.
 */
function drawBackgrounds(world) {
    world.level.backgroundObjects.forEach(background => {
        const offsetX = Math.round(
            world.camera_x * background.parallaxFactor
        );
        world.ctx.save();
        world.ctx.translate(offsetX, 0);
        addToMap(world, background);
        world.ctx.restore();
    });
}

/**
 * Draws all movable game objects.
 * @param {World} world - Current game world.
 */
function drawGameObjects(world) {
    world.ctx.translate(world.camera_x, 0);
    addObjectsToMap(world, world.level.clouds);
    addObjectsToMap(world, world.level.enemies);
    addObjectsToMap(world, world.collectibles);
    addObjectsToMap(world, world.throwableObjects);
    addToMap(world, world.character);
    if (world.levelEnd) {
        addToMap(world, world.levelEnd);
    }
    world.ctx.translate(-world.camera_x, 0);
}

/**
 * Draws all status bars and the level-end message.
 * @param {World} world - Current game world.
 */
function drawStatusBars(world) {
    addToMap(world, world.statusBarHealth);
    addToMap(world, world.statusBarCoins);
    addToMap(world, world.statusBarBottle);

    if (world.endboss?.isVisible()) {
        addToMap(world, world.statusBarEndboss);
    }

    drawLevelEndNotice(world);
}

/**
 * Draws multiple objects on the game map.
 * @param {World} world - Current game world.
 * @param {MovableObject[]} objects - Objects to draw.
 */
function addObjectsToMap(world, objects) {
    objects.forEach(object => addToMap(world, object));
}

/**
 * Draws a single object and handles its direction.
 * @param {World} world - Current game world.
 * @param {MovableObject} object - Object to draw.
 */
function addToMap(world, object) {
    if (!object || typeof object.draw !== 'function') return;

    if (object.otherDirection) flipImage(world, object);
    object.draw(world.ctx);
    if (object.otherDirection) flipImageBack(world);
}

/**
 * Flips an object horizontally before drawing.
 * @param {World} world - Current game world.
 * @param {MovableObject} object - Object to flip.
 */
function flipImage(world, object) {
    world.ctx.save();
    world.ctx.translate(object.x + object.width / 2, 0);
    world.ctx.scale(-1, 1);
    world.ctx.translate(-object.x - object.width / 2, 0);
}

/**
 * Restores the canvas after flipping an object.
 * @param {World} world - Current game world.
 */
function flipImageBack(world) {
    world.ctx.restore();
}

/**
 * Draws the current level-end hint message.
 * @param {World} world - Current game world.
 */
function drawLevelEndNotice(world) {
    world.ctx.font = "32px Luckiest Guy";
    world.ctx.fillStyle = "yellow";
    world.ctx.strokeStyle = "black";
    world.ctx.lineWidth = 4;
    world.ctx.textAlign = "right";

    const x = world.canvas.width - 20;
    const y = 50;

    world.ctx.strokeText(world.hintMessage, x, y);
    world.ctx.fillText(world.hintMessage, x, y);
    world.ctx.textAlign = "left";
}
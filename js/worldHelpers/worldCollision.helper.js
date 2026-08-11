/**
 * Checks all collisions involving the character and enemies.
 * @param {World} world - Current game world.
 */
function betweenCharacterAndEnemies(world) {
    checkJumpCollisions(world);
    checkEnemyCollisions(world);
}

/**
 * Checks whether the character can defeat an enemy by jumping.
 * @param {World} world - Current game world.
 */
function checkJumpCollisions(world) {
    for (const enemy of world.level.enemies) {
        if (!isCollidableEnemy(world, enemy)) continue;
        if (checkJumpKill(world, enemy)) return;
    }
}

/**
 * Checks regular enemy collisions with the character.
 * @param {World} world - Current game world.
 */
function checkEnemyCollisions(world) {
    for (const enemy of world.level.enemies) {
        if (!isCollidableEnemy(world, enemy)) continue;
        damageCharacter(world, enemy);
        return;
    }
}

/**
 * Checks whether an enemy can currently collide with the character.
 * @param {World} world - Current game world.
 * @param {MovableObject} enemy - Enemy to check.
 * @returns {boolean} True if the enemy is active and colliding.
 */
function isCollidableEnemy(world, enemy) {
    return enemy.energy > 0
        && world.character.isColliding(enemy);
}

/**
 * Checks whether the character defeats a chicken by jumping.
 * @param {World} world - Current game world.
 * @param {MovableObject} enemy - Enemy to check.
 * @returns {boolean} True if the enemy was defeated by jumping.
 */
function checkJumpKill(world, enemy) {
    if (!isChicken(enemy)) return false;
    if (!world.character.isJumpKill(enemy)) return false;

    enemy.hit(100);

    if (enemy.isDead()) {
        enemy.startCoinConversion();
    }

    world.character.jump();
    return true;
}

/**
 * Checks whether an enemy is a chicken.
 * @param {MovableObject} enemy - Enemy to check.
 * @returns {boolean} True for chicken or baby chicken.
 */
function isChicken(enemy) {
    return enemy instanceof Chicken
        || enemy instanceof Babychicken;
}

/**
 * Applies enemy damage to the character.
 * @param {World} world - Current game world.
 * @param {MovableObject} enemy - Enemy causing damage.
 */
function damageCharacter(world, enemy) {
    if (world.character.isHurt()) return;

    world.character.hit(enemy.damageGiven);
    world.character.energy = Math.max(world.character.energy, 0);
    world.statusBarHealth.setPercentage(world.character.energy);
    world.character.applyKnockback(
        enemy.knockbackForce,
        enemy.x
    );
    world.character.applyStun(enemy.stunDuration);

    if (enemy.isDead()) {
        enemy.startCoinConversion();
    }
}

/**
 * Checks all thrown bottles for enemy collisions.
 * @param {World} world - Current game world.
 */
function betweenEnemiesAndBottle(world) {
    world.throwableObjects.forEach(bottle => {
        if (bottle.isSplashed) return;

        world.level.enemies.forEach(enemy => {
            if (bottle.isSplashed) return;
            handleBottleEnemyCollision(world, bottle, enemy);
        });
    });
}

/**
 * Handles a collision between a bottle and an enemy.
 * @param {World} world - Current game world.
 * @param {ThrowableObject} bottle - Bottle involved.
 * @param {MovableObject} enemy - Enemy involved.
 */
function handleBottleEnemyCollision(world, bottle, enemy) {
    if (cannotHitEnemy(bottle, enemy)) return;
    if (!bottle.isColliding(enemy)) return;

    handleBottleHit(world, bottle, enemy);
}

/**
 * Checks whether a bottle cannot hit an enemy.
 * @param {ThrowableObject} bottle - Bottle to check.
 * @param {MovableObject} enemy - Enemy to check.
 * @returns {boolean} True if the collision should be ignored.
 */
function cannotHitEnemy(bottle, enemy) {
    return bottle.isSplashed
        || (enemy instanceof Endboss && enemy.isCharging);
}

/**
 * Applies the correct effect when a bottle hits an enemy.
 * @param {World} world - Current game world.
 * @param {ThrowableObject} bottle - Hit bottle.
 * @param {MovableObject} enemy - Hit enemy.
 */
function handleBottleHit(world, bottle, enemy) {
    if (enemy instanceof Endboss) {
        hitEndbossWithBottle(world, bottle, enemy);
        return;
    }

    if (isChicken(enemy)) {
        hitChickenWithBottle(bottle, enemy);
    }
}

/**
 * Applies bottle damage to the Endboss.
 * @param {World} world - Current game world.
 * @param {ThrowableObject} bottle - Hit bottle.
 * @param {Endboss} enemy - Hit Endboss.
 */
function hitEndbossWithBottle(world, bottle, enemy) {
    enemy.hit(20);
    world.statusBarEndboss.setPercentage(enemy.energy);
    bottle.splash();
}

/**
 * Applies bottle damage to a chicken.
 * @param {ThrowableObject} bottle - Hit bottle.
 * @param {Chicken|Babychicken} enemy - Hit chicken.
 */
function hitChickenWithBottle(bottle, enemy) {
    enemy.hit();
    convertDeadChicken(enemy);
    bottle.splash();
}

/**
 * Marks a defeated chicken for coin conversion.
 * @param {Chicken|Babychicken} enemy - Defeated chicken.
 */
function convertDeadChicken(enemy) {
    if (!enemy.isDead()) return;

    enemy.isConvertedToCoin = true;
    enemy.startCoinConversion();
}

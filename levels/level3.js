let level3;
let enemies3 = [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Endboss()
];
let clouds3 = [];
let collectibles3 = [
    new Collectible('bottleOne'),
    new Collectible('bottleTwo'),
    new Collectible('bottleTwo'),
    new Collectible('bottleTwo'),
    new Collectible('bottleOne')
];

/**
 * Creates level 3 with its enemies, clouds and collectibles.
 * The level has no regular level exit because the Endboss
 * is the final challenge.
 */
function initLevel3() {
    level3 = new Level(
        enemies3,
        clouds3,
        collectibles3,
        null
    );
}

/**
 * Clears the current clouds and creates four new cloud objects
 * for level 3.
 */
function pushCloudsIntoLevel3() {
    clouds3.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds3.push(new Cloud(clouds3, i));
    }
}

/**
 * Resets all enemies, clouds and collectibles of level 3
 * to their initial state, including a new Endboss.
 */
function resetLevel3() {
    enemies3 = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ];
    clouds3 = [];
    collectibles3 = [
        new Collectible('bottleOne'),
        new Collectible('bottleTwo'),
        new Collectible('bottleTwo'),
        new Collectible('bottleTwo'),
        new Collectible('bottleOne')
    ];
}
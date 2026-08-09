let level2;
let enemies2 = [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Babychicken(),
    new Babychicken(),
    new Babychicken(),
    new Babychicken()
];
let clouds2 = [];
let collectibles2 = [
    new Collectible('bottleOne'),
    new Collectible('bottleTwo'),
    new Collectible('bottleOne'),
    new Collectible('bottleOne'),
    new Collectible('bottleTwo')
];

/**
 * Creates level 2 with its enemies, clouds, collectibles and level exit.
 */
function initLevel2() {
    level2 = new Level(
        enemies2,
        clouds2,
        collectibles2,
        new LevelEnd()
    );
}

/**
 * Clears the current clouds and creates four new cloud objects
 * for level 2.
 */
function pushCloudsIntoLevel2() {
    clouds2.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds2.push(new Cloud(clouds2, i));
    }
}

/**
 * Resets all enemies, clouds and collectibles of level 2
 * to their initial state.
 */
function resetLevel2() {
    enemies2 = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Babychicken(),
        new Babychicken(),
        new Babychicken(),
        new Babychicken()
    ];
    clouds2 = [];
    collectibles2 = [
        new Collectible('bottleOne'),
        new Collectible('bottleTwo'),
        new Collectible('bottleOne'),
        new Collectible('bottleOne'),
        new Collectible('bottleTwo')
    ];
}
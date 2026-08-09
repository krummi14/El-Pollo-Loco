let level1;
let enemies1 = [
    new Babychicken(),
    new Babychicken(),
    new Babychicken(),
    new Babychicken(),
    new Babychicken(),
    new Babychicken()
];
let clouds1 = [];
let collectibles1 = [
    new Collectible('bottleOne'),
    new Collectible('bottleTwo'),
    new Collectible('bottleTwo'),
    new Collectible('bottleOne')
];

/**
 * Creates level 1 with its enemies, clouds, collectibles and level exit.
 */
function initLevel() {
    level1 = new Level(
        enemies1,
        clouds1,
        collectibles1,
        new LevelEnd()
    );
}

/**
 * Clears the current clouds and creates four new cloud objects
 * for level 1.
 */
function pushCloudsIntoLevel() {
    clouds1.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds1.push(new Cloud(clouds1, i));
    }
}

/**
 * Resets all enemies, collectibles and clouds of level 1
 * to their initial state.
 */
function resetLevel1() {
    enemies1 = [
        new Babychicken(),
        new Babychicken(),
        new Babychicken(),
        new Babychicken(),
        new Babychicken(),
        new Babychicken()
    ];
    collectibles1 = [
        new Collectible('bottleOne'),
        new Collectible('bottleTwo'),
        new Collectible('bottleTwo'),
        new Collectible('bottleOne')
    ];
    clouds1 = [];
}
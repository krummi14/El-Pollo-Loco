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
    new Collectible('coin'),
    new Collectible('coin'),
    new Collectible('coin'),
    new Collectible('coin'),
    new Collectible('coin'),
    new Collectible('bottleOne'),
    new Collectible('bottleTwo'),
    new Collectible('bottleOne'),
    new Collectible('bottleOne'),
    new Collectible('bottleTwo')
];

function initLevel2() {
    level2 = new Level(
        enemies2,
        clouds2,
        collectibles2,
        new LevelEnd()
    );
}

function pushCloudsIntoLevel2() {
    clouds2.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds2.push(new Cloud(clouds2, i));
    }
}
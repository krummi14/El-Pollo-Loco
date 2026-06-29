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

function initLevel() {
    level1 = new Level(
        enemies1,
        clouds1,
        collectibles1,
        new LevelEnd()
    );
}

function pushCloudsIntoLevel() {
    clouds1.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds1.push(new Cloud(clouds1, i));
    }
}

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
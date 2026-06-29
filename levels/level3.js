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

function initLevel3() {
    level3 = new Level(
        enemies3,
        clouds3,
        collectibles3,
        null
    );
}

function pushCloudsIntoLevel3() {
    clouds3.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds3.push(new Cloud(clouds3, i));
    }
}

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
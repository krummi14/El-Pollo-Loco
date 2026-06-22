let level2;
const clouds2 = [];

function initLevel2() {
    level2 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Babychicken(),
            new Babychicken(),
            new Babychicken(),
            new Babychicken()
        ],
        clouds2,
        [],
        [
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
        ],
        new LevelEnd()
    );
}

function pushCloudsIntoLevel2() {
    clouds2.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds2.push(new Cloud(clouds2, i));
    }
}
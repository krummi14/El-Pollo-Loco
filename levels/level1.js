let level1;
const clouds = [];

function initLevel() {
    level1 = new Level(
        [
            new Babychicken(),
            new Babychicken(),
            new Babychicken(),
            new Babychicken(),
            new Babychicken(),
            new Babychicken()
        ],
        clouds,
        [],
        [
            new Collectible('bottleOne'),
            new Collectible('bottleTwo'),
            new Collectible('bottleTwo'),
            new Collectible('bottleOne'),
            new Collectible('coin'),
            new Collectible('coin'),
            new Collectible('coin'),
            new Collectible('coin'),
            new Collectible('coin'),
        ],
        new LevelEnd()
    );
}

function pushCloudsIntoLevel() {
    clouds.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds.push(new Cloud(clouds, i));
    }
}
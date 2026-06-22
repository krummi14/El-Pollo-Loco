let level3;
const clouds3 = [];

function initLevel3() {
    level3 = new Level(
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Babychicken(),
            new Babychicken(),
            new Endboss()
        ],
        clouds3,
        [],
        [
            new Collectible('coin'),
            new Collectible('coin'),
            new Collectible('coin'),
            new Collectible('coin'),
            new Collectible('coin'),
            new Collectible('bottleOne'),
            new Collectible('bottleTwo'),
            new Collectible('bottleTwo'),
            new Collectible('bottleTwo'),
            new Collectible('bottleOne')
        ]
    );
}

function pushCloudsIntoLevel3() {
    clouds3.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds3.push(new Cloud(clouds3, i));
    }
}
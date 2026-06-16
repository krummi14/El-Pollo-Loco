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
        []);
}

function pushCloudsIntoLevel() {
    clouds.length = 0;
    for (let i = 0; i < 4; i++) {
        clouds.push(new Cloud(clouds, i));
    }
}
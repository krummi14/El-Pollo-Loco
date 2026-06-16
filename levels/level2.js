const clouds2 = [];
for (let i = 0; i < 4; i++) {
    clouds.push(new Cloud(clouds, i));
}

const level2 = new Level(
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
    []);
const clouds3 = [];
for (let i = 0; i < 4; i++) {
    clouds.push(new Cloud(clouds, i));
}

const level3 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Babychicken(),
        new Babychicken(),
        new Endboss()
    ],
    clouds3,
    []);
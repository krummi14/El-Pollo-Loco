const clouds = [];
for (let i = 0; i < 4; i++) {
    clouds.push(new Cloud(clouds, i));
}

const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    clouds,
    []);
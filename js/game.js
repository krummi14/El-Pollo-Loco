let canvas;
let world;
let currentLevel = 1;
let keyboard = new Keyboard();
let startScreen = document.getElementById('startScreen');
let fullscreen = document.getElementById('fullscreen');
let starScreen_sound = new Audio('audio/intromusic.mp3');

function startGame() {
    pushCloudsIntoLevel();
    initLevel();
    initGame();
    hideStartScreen();
}

function initGame() {
    canvas = document.getElementById("canvas");
    changeLevel();
}

function hideStartScreen() {
    let startScreen = document.getElementById('startScreen');
    fullscreen.classList.remove('display_none');
    startScreen.classList.add('display_none');
    starScreen_sound.pause();
}

function changeLevel() {
    if (currentLevel == 1) world = new World(canvas, keyboard, level1);
    if (currentLevel == 2) world = new World(canvas, keyboard, level2);
    if (currentLevel == 3) world = new World(canvas, keyboard, level3);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        openFullscreen(fullscreen);
    } else {
        closeFullscreen();
    }
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

function startIntroMusicOnce() {
    starScreen_sound.loop = true;
    starScreen_sound.play();
    window.removeEventListener("click", startIntroMusicOnce);
}

window.addEventListener("click", startIntroMusicOnce);

window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft") keyboard.LEFT = true;
    if (e.key == "ArrowRight") keyboard.RIGHT = true;
    if (e.key == "ArrowUp") keyboard.UP = true;
    if (e.key == "ArrowDown") keyboard.DOWN = true;
    if (e.key == " ") keyboard.SPACE = true;
    if (e.key == "d") keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft") keyboard.LEFT = false;
    if (e.key == "ArrowRight") keyboard.RIGHT = false;
    if (e.key == "ArrowUp") keyboard.UP = false;
    if (e.key == "ArrowDown") keyboard.DOWN = false;
    if (e.key == " ") keyboard.SPACE = false;
    if (e.key == "d") keyboard.D = false;
});

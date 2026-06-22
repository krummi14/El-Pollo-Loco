let canvas;
let world;
let currentLevel = 2;
let keyboard = new Keyboard();
let startScreen = document.getElementById('startScreen');
let fullScreen = document.getElementById('fullscreen');
let optionScreen = document.getElementById('gameIntroduction');
let cursor = document.getElementById('cursor');
let cursorImg = document.getElementById('cursorImg');
let storyScreen = document.getElementById('gameStory');
let starScreen_sound = new Audio('audio/intromusic.mp3');
let gameStory_sound = new Audio('audio/gameStory.mp3');

const deadChicken = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
const normalChicken = 'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png';

function startGame() {
    initGame();
    hideStartScreen();
}

function openOption() {
    startScreen.classList.add('display_none');
    optionScreen.classList.add('addGameIntro');
}

function closeOption() {
    startScreen.classList.remove('display_none');
    optionScreen.classList.remove('addGameIntro');
}

function openStory() {
    startScreen.classList.add('display_none');
    storyScreen.classList.add('addGameStory');
    gameStory_sound.currentTime = 0;
    gameStory_sound.play();
}

function closeStory() {
    startScreen.classList.remove('display_none');
    storyScreen.classList.remove('addGameStory');
    gameStory_sound.pause();
    gameStory_sound.currentTime = 0;
}

function cursorControl() {
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX - cursor.offsetWidth / 2 + 'px';
        cursor.style.top = e.clientY - cursor.offsetHeight / 2 + 'px';
    });
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(1.3)';
    });
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
    document.querySelectorAll('.kill_btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            cursorImg.src = deadChicken;
        });

        btn.addEventListener('mouseleave', () => {
            cursorImg.src = normalChicken;
        });
    });
}

function initGame() {
    canvas = document.getElementById("canvas");
    changeLevel();
}

function hideStartScreen() {
    let startScreen = document.getElementById('startScreen');
    fullScreen.classList.remove('display_none');
    startScreen.classList.add('display_none');
    starScreen_sound.pause();
}

function changeLevel() {
    if (currentLevel == 1) {
        pushCloudsIntoLevel();
        initLevel();      // erzeugt level1 neu
        world = new World(canvas, keyboard, level1);
    }

    if (currentLevel == 2) {
        pushCloudsIntoLevel2();
        initLevel2();     // erzeugt level2 neu
        world = new World(canvas, keyboard, level2);
    }

    if (currentLevel == 3) {
        pushCloudsIntoLevel3();
        initLevel3();     // erzeugt level3 neu
        world = new World(canvas, keyboard, level3);
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        openFullscreen(fullScreen);
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
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
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
    if (e.key == "f") keyboard.F = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft") keyboard.LEFT = false;
    if (e.key == "ArrowRight") keyboard.RIGHT = false;
    if (e.key == "ArrowUp") keyboard.UP = false;
    if (e.key == "ArrowDown") keyboard.DOWN = false;
    if (e.key == " ") keyboard.SPACE = false;
    if (e.key == "d") keyboard.D = false;
    if (e.key == "f") keyboard.F = false;
});

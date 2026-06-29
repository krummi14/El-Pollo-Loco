let canvas;
let world;
let currentLevel = 1;
let keyboard = new Keyboard();
let startScreen = document.getElementById('startScreen');
let fullScreen = document.getElementById('fullscreen');
let optionScreen = document.getElementById('gameIntroduction');
let cursor = document.getElementById('cursor');
let cursorImg = document.getElementById('cursorImg');
let winImg = document.getElementById('winImg');
let lostImg = document.getElementById('lostImg');
let gameOverImg = document.getElementById('gameOverImg');
let storyScreen = document.getElementById('gameStory');
let winLostScreen = document.getElementById('winLostScreen');
let thinkingBubble = document.getElementById("pepeThoughtBubble");
let startScreen_sound = new Audio('audio/intromusic.mp3');
let gameStory_sound = new Audio('audio/gameStory.mp3');
let gameOver_sound = new Audio('audio/gameOver.wav');
const deadChicken = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
const normalChicken = 'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png';

function startGame() {
    currentLevel = 1;
    deactivateSounds();
    setTimeout(() => {
        thinkingBubble.classList.remove("hidden");
    }, 1500);
    startScreen.classList.add('fade_out');
    setTimeout(() => {
        gameIsVisible();
        initGame();
    }, 800);
}

function initGame() {
    canvas = document.getElementById("canvas");
    changeLevel();
}

function changeLevel() {
    if (currentLevel == 1) {
        resetLevel1();
        pushCloudsIntoLevel();
        initLevel();
        world = new World(canvas, keyboard, level1);
        world.character.hasStarted = true;
    }
    if (currentLevel == 2) {
        resetLevel2();
        pushCloudsIntoLevel2();
        initLevel2();
        world = new World(canvas, keyboard, level2);
        world.character.hasStarted = true;
    }
    if (currentLevel == 3) {
        resetLevel3();
        pushCloudsIntoLevel3();
        initLevel3();
        world = new World(canvas, keyboard, level3);
        world.character.hasStarted = true;
    }
}

function deactivateSounds() {
    startScreen_sound.pause();
    startScreen_sound.currentTime = 0;
    gameStory_sound.pause();
    gameStory_sound.currentTime = 0;
    if (world) {
        world.stopAllGameSounds();
    }
}

function gameIsVisible() {
    startScreen.classList.add('display_none');
    fullScreen.classList.remove('display_none');
    fullScreen.classList.add('visible');
    winLostScreen.classList.add('display_none');
}

function openOption() {
    optionScreen.classList.remove('display_none');
    startScreen.classList.add('display_none');
}

function closeOption() {
    optionScreen.classList.add('display_none');
    startScreen.classList.remove('display_none');
}

function openStory() {
    storyScreen.classList.remove('display_none');
    startScreen.classList.add('display_none');
    gameStory_sound.currentTime = 0;
    gameStory_sound.play();
}

function closeStory() {
    storyScreen.classList.add('display_none');
    startScreen.classList.remove('display_none');
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

function hideScreen(screen1, screen2) {
    screen1.classList.remove('display_none');
    screen2.classList.add('display_none');
}

function openStartScreen() {
    hideScreen(startScreen, winLostScreen);
    deactivateSounds();
    startScreen_sound.play();
    fullScreen.classList.add('display_none');
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

function startIntroMusicOnce(e) {
    if (e.target.id == "startBtn") return;
    if (startScreen.classList.contains("display_none")) return;
    startScreen_sound.loop = true;
    startScreen_sound.play();
    window.removeEventListener("click", startIntroMusicOnce);
}

function showWinScreen() {
    winLostScreen.classList.remove('display_none');
    winImg.classList.remove('display_none');
    lostImg.classList.add('display_none');
}

function showLostScreen() {
    winLostScreen.classList.remove('display_none');
    winImg.classList.add('display_none');
    lostImg.classList.remove('display_none');
}

function showGameOverScreen() {
    winLostScreen.classList.remove('display_none');
    winImg.classList.add('display_none');
    gameOverImg.classList.remove('display_none');
    gameOver_sound.play();
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

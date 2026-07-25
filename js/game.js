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
let overlay = document.getElementById('rotateDeviceOverlay');
let thinkingBubble = document.getElementById('pepeThoughtBubble');
let gameHeadline = document.getElementById('gameHeadline');
let mobileButtons = document.getElementById('mobileControls');
let soundBtn = document.getElementById('soundBtn');
let startScreen_sound = new Audio('audio/intromusic.mp3');
let gameStory_sound = new Audio('audio/gameStory.mp3');
let gameOver_sound = new Audio('audio/gameOver.wav');
let soundMuted = true;
const deadChicken = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
const normalChicken = 'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png';


function checkMobile() {
    const mobile = window.innerWidth <= 900 || ('ontouchstart' in window);
    mobileButtons.classList.toggle("display_none", !mobile);
}

function isMobile() {
    return window.innerWidth <= 900 || ('ontouchstart' in window);
}

function startGame() {
    currentLevel = 1;
    checkMobile();
    setTimeout(() => thinkingBubble.classList.remove("hidden"), 1500);
    startScreen.classList.add('fade_out');
    setTimeout(() => {
        gameIsVisible();
        initGame();
        if (soundMuted) {
            muteAll();
        } else {
            handleGameAudio();
        }
    }, 800);
}

function initGame() {
    canvas = document.getElementById("canvas");
    if (!canvas) return;
    if (isMobile()) {
        resizeCanvas();
    } else {
        canvas.width = 720;
        canvas.height = 480;
    }
    changeLevel();
}

function changeLevel() {
    if (currentLevel == 1) {
        resetLevel1();
        pushCloudsIntoLevel();
        initLevel();
        world = new World(canvas, keyboard, level1);
        world.soundEnabled = !soundMuted;
        world.character.hasStarted = true;
    }
    if (currentLevel == 2) {
        resetLevel2();
        pushCloudsIntoLevel2();
        initLevel2();
        world = new World(canvas, keyboard, level2);
        world.soundEnabled = !soundMuted;
        world.character.hasStarted = true;
    }
    if (currentLevel == 3) {
        resetLevel3();
        pushCloudsIntoLevel3();
        initLevel3();
        world = new World(canvas, keyboard, level3);
        world.soundEnabled = !soundMuted;
        world.character.hasStarted = true;
    }
}

function toggleSound() {
    soundMuted = !soundMuted;
    soundBtn.textContent = soundMuted ? "🔇" : "🔊";
    soundBtn.blur();
    if (soundMuted) {
        muteAll();
    } else {
        unmuteAll();
        if (isStoryOpen()) handleStoryAudio();
        else if (isStartScreenOpen() || isOptionOpen()) handleStartScreenAudio();
        else handleGameAudio();
    }
}

function muteAll() {
    startScreen_sound.pause();
    gameStory_sound.pause();
    gameOver_sound.pause();
    gameOver_sound.currentTime = 0;
    if (world) world.stopAllGameSounds();
}

function unmuteAll() {
    startScreen_sound.volume = 1;
    gameStory_sound.volume = 1;
}

function handleStoryAudio() {
    gameStory_sound.currentTime = 0;
    gameStory_sound.play();
    startScreen_sound.volume = 0.3;
    if (startScreen_sound.paused) startScreen_sound.play();
}

function handleStartScreenAudio() {
    startScreen_sound.volume = 1;
    startScreen_sound.play();
}

function handleGameAudio() {
    startScreen_sound.pause();
    startScreen_sound.currentTime = 0;
    gameStory_sound.pause();
    gameStory_sound.currentTime = 0;
    if (!soundMuted && world && world.resumeAllGameSounds) {
        world.resumeAllGameSounds();
    }
}

function isStoryOpen() {
    return !storyScreen.classList.contains('display_none');
}

function isStartScreenOpen() {
    return !startScreen.classList.contains('display_none');
}

function isOptionOpen() {
    return !optionScreen.classList.contains('display_none');
}

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
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
    if (soundMuted) {
        muteAll();
    } else {
        handleStartScreenAudio();
    }
}

function closeOption() {
    optionScreen.classList.add('display_none');
    startScreen.classList.remove('display_none');
    if (soundMuted) {
        muteAll();
    } else {
        handleStartScreenAudio();
    }
}

function openStory() {
    storyScreen.classList.remove('display_none');
    startScreen.classList.add('display_none');
    if (soundMuted) {
        muteAll();
    } else {
        handleStoryAudio();
    }
}

function closeStory() {
    storyScreen.classList.add('display_none');
    startScreen.classList.remove('display_none');
    gameStory_sound.pause();
    gameStory_sound.currentTime = 0;
    if (!soundMuted) handleStartScreenAudio();
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

function resizeCanvas() {
    const wrapper = document.querySelector('.canvas_wrapper');
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    if (world) {
        world.canvas = canvas;
        world.ctx = canvas.getContext('2d');
    }
}

function hideScreen(screen1, screen2) {
    screen1.classList.remove('display_none');
    screen2.classList.add('display_none');
}

function openStartScreen() {
    hideScreen(startScreen, winLostScreen);
    startScreen_sound.play();
    fullScreen.classList.add('display_none');
    checkMobile();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        openFullscreen(fullScreen);
        gameHeadline.classList.add('display_none');

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

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        gameHeadline.classList.add('display_none');
    } else {
        gameHeadline.classList.remove('display_none');
    }
});

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
    if (!soundMuted) {
        gameOver_sound.play();
    }
}

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

window.addEventListener("load", () => {
    checkMobile();
    initMobileControls(keyboard);
});

window.addEventListener("resize", () => {
    checkMobile();
    if (!isMobile()) return;
    if (!canvas) return;
    resizeCanvas();
});

window.addEventListener("load", checkOrientation);

window.addEventListener("resize", checkOrientation);

window.addEventListener("orientationchange", checkOrientation);

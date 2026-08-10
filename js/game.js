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
let soundMuted = JSON.parse(localStorage.getItem("soundMuted")) ?? true;
const deadChicken = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
const normalChicken = 'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png';

/**
 * Checks whether the current device should display mobile controls.
 */
function checkMobile() {
    const mobile = window.innerWidth <= 900 || ('ontouchstart' in window);
    mobileButtons.classList.toggle("display_none", !mobile);
}

/**
 * Checks whether the current device is a mobile device.
 *
 * @returns {boolean} True if the device is identified as mobile.
 */
function isMobile() {
    return window.innerWidth <= 900 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Starts the game and prepares the game interface and audio.
 */
function startGame() {
    currentLevel = 1;
    checkMobile();
    hideGameCursor();
    startScreen.classList.add('fade_out');
    gameIsVisible();
    initGame();
    world.userHasInteracted = true;
    if (soundMuted) {
        muteAll();
    } else {
        world.soundEnabled = true;
        handleGameAudio();
    }
    setTimeout(() => {
        thinkingBubble.classList.remove("hidden");
    }, 1500);
}

/**
 * Initializes the game canvas and loads the current level.
 */
function initGame() {
    canvas = document.getElementById("canvas");
    if (!canvas) return;
    canvas.width = 720;
    canvas.height = 480;
    changeLevel();
}

/**
 * Loads and initializes the currently selected game level.
 */
function changeLevel() {
    if (currentLevel == 1) {
        resetLevel1();
        pushCloudsIntoLevel();
        initLevel();
        changeLevelhelper(level1);
    }
    if (currentLevel == 2) {
        resetLevel2();
        pushCloudsIntoLevel2();
        initLevel2();
        changeLevelhelper(level2);
    }
    if (currentLevel == 3) {
        resetLevel3();
        pushCloudsIntoLevel3();
        initLevel3();
        changeLevelhelper(level3);
    }
}

/**
 * helper for changeLevel methode
 */
function changeLevelhelper(level) {
    world = new World(canvas, keyboard, level);
    world.soundEnabled = !soundMuted && world.userHasInteracted;
    world.character.hasStarted = true;
}

/**
 * Toggles the game's sound state and updates the sound button.
 * The first activation also registers the user's interaction
 * to allow browser audio playback.
 */
function toggleSound() {
    soundMuted = !soundMuted;
    localStorage.setItem("soundMuted", JSON.stringify(soundMuted));
    soundBtn.textContent = soundMuted ? "🔇" : "🔊";
    soundBtn.blur();
    if (soundMuted) {
        muteAll();
        return;
    }
    unmuteAll();
    if (world) {
        world.userHasInteracted = true;
        world.soundEnabled = true;
    }
    if (isStoryOpen()) {
        handleStoryAudio();
    } else if (isStartScreenOpen() || isOptionOpen()) {
        handleStartScreenAudio();
    } else {
        handleGameAudio();
    }
}

/**
 * Pauses all active game and interface sounds.
 */
function muteAll() {
    startScreen_sound.pause();
    gameStory_sound.pause();
    gameOver_sound.pause();
    gameOver_sound.currentTime = 0;
    if (world) world.stopAllGameSounds();
}

/**
 * Restores the default volume of interface sounds.
 */
function unmuteAll() {
    startScreen_sound.volume = 1;
    gameStory_sound.volume = 1;
}

/**
 * Starts the story audio and reduces the volume of the start screen audio.
 */
function handleStoryAudio() {
    if (soundMuted) return;
    gameStory_sound.currentTime = 0;
    gameStory_sound.play().catch(() => { });
    startScreen_sound.volume = 0.3;
    if (startScreen_sound.paused) {
        startScreen_sound.play().catch(() => { });
    }
}

/**
 * Starts the audio for the start screen.
 */
function handleStartScreenAudio() {
    if (soundMuted) return;
    startScreen_sound.volume = 1;
    startScreen_sound.play().catch(() => { });
}

/**
 * Switches from menu audio to game audio after audio playback
 * has been enabled by the user's interaction.
 */
function handleGameAudio() {
    startScreen_sound.pause();
    startScreen_sound.currentTime = 0;
    gameStory_sound.pause();
    gameStory_sound.currentTime = 0;
    if (
        !soundMuted &&
        world &&
        world.userHasInteracted &&
        world.resumeAllGameSounds
    ) {
        world.resumeAllGameSounds();
    }
}

/**
 * Checks whether the story screen is currently open.
 *
 * @returns {boolean} True if the story screen is visible.
 */
function isStoryOpen() {
    return !storyScreen.classList.contains('display_none');
}

/**
 * Checks whether the start screen is currently open.
 *
 * @returns {boolean} True if the start screen is visible.
 */
function isStartScreenOpen() {
    return !startScreen.classList.contains('display_none');
}

/**
 * Checks whether the options screen is currently open.
 *
 * @returns {boolean} True if the options screen is visible.
 */
function isOptionOpen() {
    return !optionScreen.classList.contains('display_none');
}

/**
 * Checks the device orientation and displays the rotation overlay if needed.
 */
function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

/**
 * Makes the game screen visible and hides the start and result screens.
 */
function gameIsVisible() {
    startScreen.classList.add('display_none');
    fullScreen.classList.remove('display_none');
    fullScreen.classList.add('visible');
    winLostScreen.classList.add('display_none');
}

/**
 * Opens the options screen and hides the start screen.
 */
function openOption() {
    optionScreen.classList.remove('display_none');
    startScreen.classList.add('display_none');
    if (soundMuted) {
        muteAll();
    } else {
        handleStartScreenAudio();
    }
}

/**
 * Closes the options screen and returns to the start screen.
 */
function closeOption() {
    optionScreen.classList.add('display_none');
    startScreen.classList.remove('display_none');
    if (soundMuted) {
        muteAll();
    } else {
        handleStartScreenAudio();
    }
}

/**
 * Opens the story screen and hides the start screen.
 */
function openStory() {
    storyScreen.classList.remove('display_none');
    startScreen.classList.add('display_none');
    if (soundMuted) {
        muteAll();
    } else {
        handleStoryAudio();
    }
}

/**
 * Closes the story screen and returns to the start screen.
 */
function closeStory() {
    storyScreen.classList.add('display_none');
    startScreen.classList.remove('display_none');
    gameStory_sound.pause();
    gameStory_sound.currentTime = 0;
    if (!soundMuted) handleStartScreenAudio();
}

/**
 * Updates the position of the custom cursor based on the mouse position.
 *
 * @param {MouseEvent} e - The current mouse event.
 */
function cursorMoveHandler(e) {
    cursor.style.left = e.clientX - cursor.offsetWidth / 2 + 'px';
    cursor.style.top = e.clientY - cursor.offsetHeight / 2 + 'px';
}

/**
 * Enlarges the custom cursor while the mouse button is pressed.
 */
function cursorDownHandler() {
    cursor.style.transform = 'scale(1.3)';
}

/**
 * Restores the normal size of the custom cursor.
 */
function cursorUpHandler() {
    cursor.style.transform = 'scale(1)';
}

/**
 * Enables or disables the custom cursor depending on the device type.
 */
function cursorControl() {
    if (isMobile()) {
        cursor.style.display = "none";
        cursorImg.src = "";
        document.removeEventListener('mousemove', cursorMoveHandler);
        document.removeEventListener('mousedown', cursorDownHandler);
        document.removeEventListener('mouseup', cursorUpHandler);
        return;
    }
    cursor.style.display = "block";
    cursorImg.src = normalChicken;
    document.addEventListener('mousemove', cursorMoveHandler);
    document.addEventListener('mousedown', cursorDownHandler);
    document.addEventListener('mouseup', cursorUpHandler);
    document.querySelectorAll('.kill_btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            cursorImg.src = deadChicken;
        });
        btn.addEventListener('mouseleave', () => {
            cursorImg.src = normalChicken;
        });
    });
}

/**
 * Adjusts the canvas wrapper size according to the fullscreen state.
 */
function resizeCanvas() {
    const wrapper = document.querySelector(".canvas_wrapper");
    if (document.fullscreenElement) {
        wrapper.style.width = window.innerWidth + "px";
        wrapper.style.height = window.innerHeight + "px";
    } else {
        wrapper.style.width = "720px";
        wrapper.style.height = "480px";
    }
}

/**
 * Hides one screen and displays another screen.
 *
 * @param {HTMLElement} screen1 - Screen that should become visible.
 * @param {HTMLElement} screen2 - Screen that should be hidden.
 */
function hideScreen(screen1, screen2) {
    screen1.classList.remove('display_none');
    screen2.classList.add('display_none');
}

/**
 * Opens the start screen and hides the game result screen.
 */
function openStartScreen() {
    hideScreen(startScreen, winLostScreen);
    fullScreen.classList.add('display_none');
    checkMobile();
}

/**
 * Toggles fullscreen mode for the game.
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        openFullscreen(fullScreen);
        gameHeadline.classList.add('display_none');

    } else {
        closeFullscreen();
    }
}

/**
 * Requests fullscreen mode for the given element.
 *
 * @param {HTMLElement} elem - Element that should enter fullscreen mode.
 */
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode using the browser's supported API.
 */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Updates the canvas size and game headline when fullscreen mode changes.
 */
document.addEventListener("fullscreenchange", () => {
    resizeCanvas();
    if (document.fullscreenElement) {
        gameHeadline.classList.add('display_none');
    } else {
        gameHeadline.classList.remove('display_none');
    }
});

/**
 * Displays the win screen and hides the lost screen.
 */
function showWinScreen() {
    winLostScreen.classList.remove('display_none');
    winImg.classList.remove('display_none');
    lostImg.classList.add('display_none');
}

/**
 * Displays the lost screen and hides the win screen.
 */
function showLostScreen() {
    winLostScreen.classList.remove('display_none');
    winImg.classList.add('display_none');
    lostImg.classList.remove('display_none');
}

/**
 * Displays the game over screen and plays the game over sound if enabled.
 */
function showGameOverScreen() {
    winLostScreen.classList.remove('display_none');
    winImg.classList.add('display_none');
    gameOverImg.classList.remove('display_none');
    if (!soundMuted) {
        gameOver_sound.play().catch(() => { });
    }
}

/**
 * Moves the custom cursor outside the visible game area.
 */
function hideGameCursor() {
    cursor.style.left = "-100px";
    cursor.style.top = "-100px";
}

/**
 * Open Impressum
 */
function openImpressum() {
    document.getElementById('startScreen').classList.add('display_none');
    document.getElementById('impressum').classList.remove('display_none');
}

/**
 * Close Impressum
 */
function closeImpressum() {
    document.getElementById('impressum').classList.add('display_none');
    document.getElementById('startScreen').classList.remove('display_none');
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

window.addEventListener("load", () => {
    soundBtn.textContent = soundMuted ? "🔇" : "🔊";
    if (!soundMuted && isStartScreenOpen()) {
        handleStartScreenAudio();
    }
});

document.getElementById("canvas").addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
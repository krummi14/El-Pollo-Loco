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
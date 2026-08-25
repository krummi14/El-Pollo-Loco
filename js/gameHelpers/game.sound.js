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
    playSound(gameStory_sound, 'gameStory');
    startScreen_sound.volume = 0.3;
    if (startScreen_sound.paused) {
        playSound(startScreen_sound, 'startScreen');
    }
}

/**
 * Starts the audio for the start screen.
 */
function handleStartScreenAudio() {
    if (soundMuted) return;
    startScreen_sound.volume = 1;
    playSound(startScreen_sound, 'startScreen');
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

window.addEventListener("load", () => {
    soundBtn.textContent = soundMuted ? "🔇" : "🔊";
});
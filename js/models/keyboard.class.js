/**
 * Stores the current state of all keyboard controls used by the game.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;
    F = false;
}

/**
 * Initializes the mobile control buttons and connects their touch events
 * to the corresponding keyboard states.
 * @param {Keyboard} keyboard - The keyboard object whose control states are updated.
 */
function initMobileControls(keyboard) {
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");
    const btnJump = document.getElementById("btnJump");
    const btnThrow = document.getElementById("btnThrow");

    function bindButton(button, key) {
        button.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            button.setPointerCapture(e.pointerId);
            keyboard[key] = true;
        });

        button.addEventListener("pointerup", (e) => {
            e.preventDefault();
            keyboard[key] = false;
            button.releasePointerCapture(e.pointerId);
        });

        button.addEventListener("pointercancel", () => {
            keyboard[key] = false;
        });
    }

    bindButton(btnLeft, "LEFT");
    bindButton(btnRight, "RIGHT");
    bindButton(btnJump, "SPACE");
    bindButton(btnThrow, "D");
}
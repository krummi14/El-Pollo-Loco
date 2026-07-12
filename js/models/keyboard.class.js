class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;
    F = false;
}

function initMobileControls(keyboard) {
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");
    const btnJump = document.getElementById("btnJump");
    const btnThrow = document.getElementById("btnThrow");
    btnLeft.addEventListener("touchstart", () => keyboard.LEFT = true);
    btnLeft.addEventListener("touchend", () => keyboard.LEFT = false);
    btnRight.addEventListener("touchstart", () => keyboard.RIGHT = true);
    btnRight.addEventListener("touchend", () => keyboard.RIGHT = false);
    btnJump.addEventListener("touchstart", () => keyboard.SPACE = true);
    btnJump.addEventListener("touchend", () => keyboard.SPACE = false);
    btnThrow.addEventListener("touchstart", () => keyboard.D = true);
    btnThrow.addEventListener("touchend", () => keyboard.D = false);
}
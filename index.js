const dialogs = [
  "あのね、ジェノサイダー翔が\nモノモノマシーンを\nやってたみたいなんだけど",
  "This is a second message.\nIt supports multiple lines.\nLike a game dialog.",
  "End of conversation."
];

const nowTime = new Date();

const digitsHours = String(nowTime.getHours()).padStart(2, "0").split("").map(Number);
const digitsMinutes = String(nowTime.getMinutes()).padStart(2, "0").split("").map(Number);
const digitsSeconds = String(nowTime.getSeconds()).padStart(2, "0").split("").map(Number);
const digitsDays = String(nowTime.getDate()).padStart(2, "0").split("").map(Number);
const digitsMonths = String(nowTime.getMonth()+1).padStart(2, "0").split("").map(Number);
const digitsYears = String(nowTime.getFullYear()).padStart(4, "0").split("").map(Number);

let dialogIndex = 0;
let charIndex = 0;
let typing = false;
const speed = 30;

let idClock;
let idMenuTransitionDisplay;
let faceType = 0;

let clock_start_check = false;
let clock_back_check = false;

let noiseName = 1;
let idNoiseCycle;
function noiseCycle() {
    idNoiseCycle = setInterval(() => {
        if (noiseName === 1) {
            document.getElementById("noise").src = "assets/main/noise_1.png";
            noiseName = 2;
        } else if (noiseName === 2) {
            document.getElementById("noise").src = "assets/main/noise_2.png";
            noiseName = 1;
        }
        
    }, 100);
}

function menuMainTransitionShow() {
    const alterEgoFace = String(faceType).padStart(2, "0");
    document.querySelectorAll('.animated-scale').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // force reflow (required)
        el.style.animation = `scale 0.1s ease-out forwards`;
        el.style.animationDirection = 'normal';
    });
    setTimeout(() => {
        document.getElementById("alterego-face").src = "assets/main/background_logo.png";
        document.getElementById("noise").style.display = "inline";
        noiseCycle();
    }, 200);
    setTimeout(() => {
        clearInterval(idNoiseCycle);
        document.getElementById("noise").style.display = "none";
        document.getElementById("alterego-face").src = `assets/face/AlterEgoFace${alterEgoFace}.png`;
        document.getElementById("menu-right").style.display = "flex";
        document.getElementById("menu-left").style.display = "flex";
    }, 700);
    clearTimeout(idMenuTransitionDisplay);
}

function menuMainTransitionGone() {
    const alterEgoFace = String(faceType).padStart(2, "0");
    document.querySelectorAll('.animated-scale').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // force reflow (required)
        el.style.animation = `scale 0.1s ease-out forwards`;
        el.style.animationDirection = 'reverse';
    });
    setTimeout(() => {
        document.getElementById("alterego-face").src = "assets/main/background_logo.png";
        document.getElementById("noise").style.display = "inline";
        noiseCycle();
    }, 200);
    setTimeout(() => {
        clearInterval(idNoiseCycle);
        document.getElementById("noise").style.display = "none";
        document.getElementById("alterego-face").src = `assets/face/AlterEgoFace${alterEgoFace}.png`;
        document.getElementById("menu-right").style.display = "none";
        document.getElementById("menu-left").style.display = "none";
    }, 700);
}

function typeDialog() {
    typing = true;
    document.getElementById("dialog-indicator").style.display = "none";
    document.getElementById("dialog-box").style.display = "inline";

    if (charIndex < dialogs[dialogIndex].length) {
        document.getElementById("dialog-text").textContent += dialogs[dialogIndex][charIndex];
        charIndex++;
        setTimeout(typeDialog, speed);
    } else {
        typing = false;
        document.getElementById("dialog-indicator").style.display = "inline";
        dialogIndex++;
    }

}

function nextDialog() {
    if (typing) {
        return;
    }

    if (dialogIndex < dialogs.length) {
        charIndex = 0;
        document.getElementById("dialog-text").textContent = "";
        document.getElementById("menu-right").style.display = "none";
        document.getElementById("menu-left").style.display = "none";
        typeDialog();
    } else if (dialogIndex >= dialogs.length) {
        dialogIndex = 0;
        charIndex = 0;
        document.getElementById("dialog-text").textContent = "";
        document.getElementById("dialog-indicator").style.display = "none";
        document.getElementById("dialog-box").style.display = "none";
        document.getElementById("menu-right").style.display = "flex";
        document.getElementById("menu-left").style.display = "flex";
    }
}

function clock() {
    document.getElementById("clock-hour-1").src = `assets/number/big_number/${digitsHours[0]}.png`;
    document.getElementById("clock-hour-2").src = `assets/number/big_number/${digitsHours[1]}.png`;
    document.getElementById("clock-minute-1").src = `assets/number/big_number/${digitsMinutes[0]}.png`;
    document.getElementById("clock-minute-2").src = `assets/number/big_number/${digitsMinutes[1]}.png`;
    document.getElementById("clock-year-1").src = `assets/number/small_number/${digitsYears[0]}.png`;
    document.getElementById("clock-year-2").src = `assets/number/small_number/${digitsYears[1]}.png`;
    document.getElementById("clock-year-3").src = `assets/number/small_number/${digitsYears[2]}.png`;
    document.getElementById("clock-year-4").src = `assets/number/small_number/${digitsYears[3]}.png`;
    document.getElementById("clock-month-1").src = `assets/number/small_number/${digitsMonths[0]}.png`;
    document.getElementById("clock-month-2").src = `assets/number/small_number/${digitsMonths[1]}.png`;
    document.getElementById("clock-day-1").src = `assets/number/small_number/${digitsDays[0]}.png`;
    document.getElementById("clock-day-2").src = `assets/number/small_number/${digitsDays[1]}.png`;
}

function clock_start() {
    if (clock_start_check !== true) {
        clock_start_check = true;
        menuMainTransitionGone();
        document.getElementById("clock-number-big").style.animation = 'none';
        document.getElementById("clock-number-big").style.offsetHeight;
        document.getElementById("clock-number-big").style.animation = `anim-clock-big-unshow 0.1s ease-out forwards`;
        document.getElementById("clock-number-small").style.animation = 'none';
        document.getElementById("clock-number-small").style.offsetHeight;
        document.getElementById("clock-number-small").style.animation = `anim-clock-small-unshow 0.1s ease-out forwards`;
        setTimeout(() => {
            document.getElementById("clock").style.display = "flex";
            clock();
            idClock = setInterval(clock, 500);
            clock_start_check = false;
        }, 700);
    }
}

function clock_back() {
    if (clock_back_check !== true) {
        clock_back_check = true;
        menuMainTransitionShow();
        document.getElementById("clock-number-big").style.animation = 'none';
        document.getElementById("clock-number-big").style.offsetHeight;
        document.getElementById("clock-number-big").style.animation = `anim-clock-big-show 0.1s ease-out forwards`;
        document.getElementById("clock-number-small").style.animation = 'none';
        document.getElementById("clock-number-small").style.offsetHeight;
        document.getElementById("clock-number-small").style.animation = `anim-clock-small-show 0.1s ease-out forwards`;
        setTimeout(() => {
            clearInterval(idClock);
            clock_back_check = false;
            document.getElementById("clock").style.display = "none";
        }, 700);
    }

}
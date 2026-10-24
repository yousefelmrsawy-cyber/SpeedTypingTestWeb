const querySelect = (selector) => document.querySelector(selector);

const StrBtn = querySelect(".start_btn");
const fogcurtain = querySelect(".fog_curtain");
const container = querySelect(".container");
const word = querySelect(".word");
const Input = querySelect(".input");
const WPM = querySelect(".WPM_num");
const easy = querySelect(".easy");
const medium = querySelect(".medium");
const hard = querySelect(".hard");
const s60 = querySelect(".s60");
const psgmode = querySelect(".psgmode");
const accuracy = querySelect(".accuracy_num");
const time = querySelect(".timer_num");
const bestscore = querySelect(".bestscore-num");
const TextTest = querySelect(".TextTest");
const restart_btn = querySelect(".restart_btn");
const resultsDiv = querySelect(".results");
const WPMInResult = querySelect(".WPMInResult");
const AccInResult = querySelect(".AccInResult");
const CharsCorrectInResult = querySelect(".chars-correct");
const CharsWrongInResult = querySelect(".chars-wrong");
const goAgainBtn = querySelect("#goAgainBtn");
const restartBtnDiv = querySelect(".restartBtnDiv");
const LrgSnt = querySelect(".LrgSnt");
const SmlSnt = querySelect(".SmlSnt");

let savedBestScore = parseInt(localStorage.getItem("typing_best_score")) || 0;
if (bestscore) {
  bestscore.textContent = savedBestScore;
}

let theRondomGeneratedNumber=RandomNumGenerator(0,9);
let PlayinValide = false;
let correctType=0;
let wrongType=0;
let time_start = 0.0;
let isTimerRunning = false;
let timer = null;
let targetTime = 60;
//the icon that apppears above the strt btn
if (document.getElementById("keyboard-anim") && typeof lottie !== "undefined" && typeof keyboardAnimData !== "undefined") {
  lottie.loadAnimation({
    container: document.getElementById("keyboard-anim"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: keyboardAnimData
  });}
// function that generate random number in specific range
function RandomNumGenerator(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let indexRefers = 0;
let typingData = window.typingData || {};

function alignFogToHr() {
  const hr = document.querySelector("hr");
  if (hr && fogcurtain) {
    const hrTop = hr.getBoundingClientRect().top + window.scrollY;
    fogcurtain.style.top = `${hrTop}px`;
  }
}

window.addEventListener("load", () => {
  updateText("medium");
  alignFogToHr();
});
window.addEventListener("resize", alignFogToHr);

function updateText(levelOfText) {
  if (TextTest && typingData[levelOfText] && typingData[levelOfText].length > 0) {
    indexRefers = 0;
    correctType = 0;
    wrongType = 0;
    time_start = 0.0;
    if (timer) clearInterval(timer);
    isTimerRunning = false;
    if (time) time.textContent = "0";
    if (accuracy) {
      accuracy.textContent = "0";
      accuracy.classList.remove("accGeen", "accRed");
    }
    if (WPM) WPM.textContent = "0";

    const rawText = typingData[levelOfText][theRondomGeneratedNumber].text;
    TextTest.innerHTML = rawText.split("").map(char => `<span class="char">${char}</span>`).join("");
    alignFogToHr();
  }
}
let levelOfText="medium";


StrBtn.addEventListener("click", () => {
  StrBtn.classList.add("disappear");
  const startMenu = StrBtn.closest(".start_menu");
  if (startMenu) startMenu.classList.add("disappear");
  if (fogcurtain) fogcurtain.classList.add("disappear");
  PlayinValide = true;
  setTimeout(() => {
    StrBtn.classList.add("hide");
    if (startMenu) startMenu.classList.add("hide");
    if (fogcurtain) fogcurtain.classList.add("hide");
  }, 5000);
});

easy.addEventListener("click", () => {
  easy.classList.toggle("focus");
  medium.classList.remove("focus");
  hard.classList.remove("focus");
  levelOfText="easy";
  updateText(levelOfText);
});
medium.addEventListener("click", () => {
  medium.classList.toggle("focus");
  easy.classList.remove("focus");
  hard.classList.remove("focus");
  levelOfText="medium";
  updateText(levelOfText);
});
hard.addEventListener("click", () => {
  hard.classList.toggle("focus");
  easy.classList.remove("focus");
  medium.classList.remove("focus");
  levelOfText="hard";
  updateText(levelOfText);
});
s60.addEventListener("click", () => {
  s60.classList.toggle("focus");
  psgmode.classList.remove("focus");
  targetTime = 60;
});
psgmode.addEventListener("click", () => {
  psgmode.classList.toggle("focus");
  s60.classList.remove("focus");
  targetTime = 200;
});

function finishTest() {
  if (timer) clearInterval(timer);
  isTimerRunning = false;
  PlayinValide = false;

  const totalTyped = correctType + wrongType;
  const finalAcc = totalTyped > 0 ? Math.round((correctType / totalTyped) * 100) : 0;
  const elapsedMinutes = time_start > 0 ? (time_start / 60) : (targetTime / 60);
  const words = correctType / 5;
  const finalWPM = Math.round(words / Math.max(elapsedMinutes, 0.01));

  if (WPMInResult) WPMInResult.textContent = finalWPM;
  if (AccInResult) AccInResult.textContent = `${finalAcc}%`;
  if (CharsCorrectInResult) CharsCorrectInResult.textContent = correctType;
  if (CharsWrongInResult) CharsWrongInResult.textContent = wrongType;

  if (finalWPM > savedBestScore && finalWPM > 0) {
    savedBestScore = finalWPM;
    localStorage.setItem("typing_best_score", savedBestScore);
    if (bestscore) bestscore.textContent = savedBestScore;
    if (SmlSnt) SmlSnt.textContent = "New personal best! Keep pushing your limits.";
  } else {
    if (SmlSnt) SmlSnt.textContent = "Solid run. Keep pushing to beat your high score.";
  }

  if (TextTest) TextTest.classList.add("hide");
  if (restartBtnDiv) restartBtnDiv.classList.add("hide");
  if (resultsDiv) resultsDiv.classList.remove("hide");
}

function restartTest() {
  if (resultsDiv) resultsDiv.classList.add("hide");
  if (TextTest) TextTest.classList.remove("hide");
  if (restartBtnDiv) restartBtnDiv.classList.remove("hide");

  const list = typingData[levelOfText];
  const maxIdx = (list && list.length > 0) ? list.length - 1 : 9;
  theRondomGeneratedNumber = RandomNumGenerator(0, maxIdx);
  updateText(levelOfText);

  PlayinValide = true;
}

if (goAgainBtn) {
  goAgainBtn.addEventListener("click", restartTest);
}

if (restart_btn) {
  restart_btn.addEventListener("click", restartTest);
}

window.addEventListener('keydown', function(event) {
  
  if (event.key === " " || event.code === "Space") {
    event.preventDefault();
  }

  if (!TextTest || !PlayinValide) return;
  const charSpans = TextTest.querySelectorAll("span");
  if (charSpans.length === 0) return;
  if (event.key.length > 1) return;
  if (indexRefers >= charSpans.length) return;
  const targetChar = charSpans[indexRefers].textContent;
  if (event.key === targetChar) {
    charSpans[indexRefers].classList.add("correct");
    correctType++;
  } else {
    charSpans[indexRefers].classList.add("incorrect");
    wrongType++;

  }
  indexRefers++;

  if((correctType/(correctType+wrongType))*100 > 50){
    accuracy.classList.add("accGeen");
    accuracy.classList.remove("accRed");

  }else{
    accuracy.classList.add("accRed");
    accuracy.classList.remove("accGeen");

  }

  accuracy.textContent = Math.round((correctType / (correctType + wrongType)) * 100);

  // Update  WPM
  if (WPM && time_start > 0) {
    const words = correctType / 5;
    const minutes = time_start / 60;
    WPM.textContent = Math.round(words / minutes);
  }

  // Start timer when the first key is pressed 
  if (!isTimerRunning) {
    isTimerRunning = true;
    timer = setInterval(() => {
      time_start = Math.round((time_start + 0.1) * 10) / 10;
      time.textContent = time_start.toFixed(1);

      if (WPM && time_start > 0) {
        const words = correctType / 5;
        const minutes = time_start / 60;          // Keep WPM updated as time ticks
        WPM.textContent = Math.round(words / minutes);
      }

      if (time_start >= targetTime) {
        finishTest();
      }
    }, 100);
  }

  // If user completed typing all characters in current text
  if (indexRefers >= charSpans.length) {
    finishTest();
  }
});





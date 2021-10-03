import { GameView } from "./GameView.js";

let newGame = new GameView();
const winNumber = newGame.list.length / 2; //Combinations for winning is total ( images or numbers ) / 2
const gameBoard = document.querySelector("#container");
let clicks = [];
let correct = 0;
let tries = 0;
const message = document.querySelector("#message");
let triesText = document.querySelector("#tries");
let highScoreText = document.querySelector("#highscore");
let highscore = +localStorage.getItem("highscore");

if (highscore) {
  highScoreText.innerText = highscore;
} else {
  highScoreText.innerText = "0";
}

newGame.shuffleBlocks();
newGame.assignBlocks();

function clearWrongBlocks() {
  //Targetting the first occurance AND the second
  const blockOne = document.querySelectorAll(`[data-number~="${clicks[0]}"]`);
  const blockTwo = document.querySelectorAll(`[data-number~="${clicks[1]}"]`);

  setTimeout(function () {
    blockOne[0].textContent = "";
    blockOne[1].textContent = "";
    blockTwo[0].textContent = "";
    blockTwo[1].textContent = "";
  }, 500);
}

function updateTries() {
  triesText.innerText = tries;
}

//#################################################################
//<img src="1.jpg" />
gameBoard.addEventListener("click", function (e) {
  const currentBlock = e.target.closest(".block");
  const blockNumber = currentBlock.getAttribute("data-number");

  /* current.innerHTML =
    current.innerHTML === "" ? current.getAttribute("data-number") : ""; */
  currentBlock.innerHTML =
    currentBlock.innerHTML === "" ? `<img src="${blockNumber}.jpg" />` : "";

  clicks.push(currentBlock.getAttribute("data-number"));

  console.log(clicks);
  console.log(correct);

  if (clicks[0] === clicks[1]) {
    const blockOne = document.querySelectorAll(`[data-number~="${clicks[0]}"]`);
    const blockTwo = document.querySelectorAll(`[data-number~="${clicks[1]}"]`);

    blockOne[0].classList.add("no_click");
    blockOne[1].classList.add("no_click");
    blockTwo[0].classList.add("no_click");
    blockTwo[1].classList.add("no_click");

    clicks = [];

    correct++;
    tries++;
    updateTries();

    if (correct === winNumber) {
      message.innerText = "Congrats! You Win!";

      if (highscore > tries) {
        localStorage.removeItem("highscore");
        localStorage.setItem("highscore", tries);
        message.innerText = "Congrats! A new record!";
      }
    }
  }
  if (clicks.length === 2 && clicks[0] !== clicks[1]) {
    clearWrongBlocks();
    clicks = [];
    tries++;
    updateTries();
  }
});

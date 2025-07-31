const btnsGame = document.querySelectorAll("#btn-play-game");
const playerImg = document.querySelector("#player-choice");
const pcImg = document.querySelector("#player-pc");
const selectionArr = ["rock", "paper", "scissors"];
const resultDiv = document.querySelector("#result");
const gameDetails = document.querySelector(".details-game");
const body = document.querySelector("#body-table");

let matchs = JSON.parse(localStorage.getItem("historyMatch")) || [];

const images = {
  rock: "images/rock.png",
  paper: "images/paper.png",
  scissors: "images/scissors.png",
};

// Event listener
btnsGame.forEach((el) => {
  el.addEventListener("click", (e) => {
    // player selection
    let playSelection = e.target.innerText.toLowerCase();
    playerImg.src = images[playSelection];

    // pc selection
    let clearTimer = setInterval(() => {
      let randomImg = Math.floor(Math.random() * selectionArr.length);
      pcImg.src = images[selectionArr[randomImg]];
      toggleButtons(true);
    }, 100);

    let pcSelection = Math.floor(Math.random() * selectionArr.length);

    setTimeout(() => {
      clearInterval(clearTimer);
      pcImg.src = images[selectionArr[pcSelection]];
      let result = resultGame(playSelection, selectionArr[pcSelection]);
      resultDiv.innerHTML = result;

      const match = {
        player: playSelection,
        pc: selectionArr[pcSelection],
        result: result,
      };
      gameDetails.classList.remove("d-none");
      gameDetails.classList.add("d-block");
      saveMatch(match);
      displayDetailsMatchs();
      updateCounter();
    }, 2000);

    setTimeout(() => {
      toggleButtons(false);
      resultDiv.innerHTML = "";
      playerImg.src = "images/choose.png";
      pcImg.src = "images/random.png";
    }, 3000);
  });
});

// resultGame
function resultGame(playerChoice, pcChoice) {
  if (playerChoice === pcChoice) return "Draw";
  if (
    (playerChoice === "rock" && pcChoice === "scissors") ||
    (playerChoice === "paper" && pcChoice === "rock") ||
    (playerChoice === "scissors" && pcChoice === "paper")
  )
    return "Win";
  return "Lose";
}

// toggleButtons
function toggleButtons(state) {
  btnsGame.forEach((btn) => (btn.disabled = state));
}

// saveMatch
function saveMatch(match) {
  matchs.push(match);
  localStorage.setItem("historyMatch", JSON.stringify(matchs));
}

// displayDetailsMatchs
function displayDetailsMatchs() {
  if (matchs.length === 0) return;

  if (matchs.length >= 1) {
    gameDetails.classList.remove("d-none");
    gameDetails.classList.add("d-block");
  }

  let bodyContent = "";
  matchs.forEach((el, index) => {
    bodyContent += `
      <tr>
        <td>${index + 1}</td>
        <td>${el.player}</td>
        <td>${el.pc}</td>
        <td>${el.result}</td>
      </tr>`;
  });
  body.innerHTML = bodyContent;
}
// updateCounter
function updateCounter() {
  const winContent = document.querySelector("#win");
  const loseContent = document.querySelector("#lose");
  const drawContent = document.querySelector("#draw");

  const winCount = matchs.filter((m) => m.result === "Win").length;
  const loseCount = matchs.filter((m) => m.result === "Lose").length;
  const drawCount = matchs.filter((m) => m.result === "Draw").length;

  winContent.innerHTML = winCount;
  loseContent.innerHTML = loseCount;
  drawContent.innerHTML = drawCount;
}

// btn reset
const btnReset = document.querySelector("#reset-btn");

btnReset.addEventListener("click", () => {
  localStorage.removeItem("historyMatch");
  matchs = [];
  gameDetails.classList.add("d-none");
  gameDetails.classList.remove("d-block");
  displayDetailsMatchs();
  updateCounter();
});

displayDetailsMatchs();
updateCounter()
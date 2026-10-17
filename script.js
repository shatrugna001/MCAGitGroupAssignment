const cells = Array.from(document.querySelectorAll(".game__cell"));
const status = document.querySelector("#game-status");
const resetButton = document.querySelector("#game-reset");
const scoreResetButton = document.querySelector("#score-reset");
const scoreX = document.querySelector("#score-x");
const scoreO = document.querySelector("#score-o");
const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
let currentPlayer = "X";
let gameOver = false;
const score = { X: 0, O: 0 };

function updateScoreboard() {
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
}

function finishGame(message, winningLine = []) {
  gameOver = true;
  status.textContent = message;

  if (winningLine.length) {
    score[currentPlayer] += 1;
    updateScoreboard();
  }

  cells.forEach((cell, index) => {
    cell.disabled = true;
    if (winningLine.includes(index)) {
      cell.classList.add("is-winner");
    }
  });
}

function playTurn(event) {
  const cell = event.currentTarget;
  if (gameOver || cell.textContent) return;

  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "is-x" : "is-o");
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, ${currentPlayer}`);

  const winningLine = winningLines.find(([first, second, third]) =>
    cells[first].textContent &&
    cells[first].textContent === cells[second].textContent &&
    cells[first].textContent === cells[third].textContent
  );

  if (winningLine) {
    finishGame(`${currentPlayer} wins!`, winningLine);
  } else if (cells.every((boardCell) => boardCell.textContent)) {
    finishGame("It's a draw!");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `${currentPlayer}'s turn`;
  }
}

function resetBoard() {
  currentPlayer = "X";
  gameOver = false;
  status.textContent = "X's turn";
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("is-x", "is-o", "is-winner");
    cell.setAttribute("aria-label", `Row ${row}, column ${column}`);
  });
}

function resetGame() {
  resetBoard();
}

function resetScore() {
  score.X = 0;
  score.O = 0;
  updateScoreboard();
  resetBoard();
}

cells.forEach((cell) => cell.addEventListener("click", playTurn));
resetButton.addEventListener("click", resetGame);
scoreResetButton.addEventListener("click", resetScore);
updateScoreboard();

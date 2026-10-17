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

<<<<<<< Updated upstream
if (cells.length) {
  cells.forEach((cell) => cell.addEventListener("click", playTurn));
}

if (resetButton) {
  resetButton.addEventListener("click", resetGame);
}

const memoryCards = Array.from(document.querySelectorAll(".memory-card"));
const memoryStatus = document.querySelector("#memory-status");
const memoryMoves = document.querySelector("#memory-moves");
const memoryMatches = document.querySelector("#memory-matches");
const memoryReset = document.querySelector("#memory-reset");

const memorySymbols = ["🌙", "🎯", "⚡", "🌸", "🍀", "⭐", "🚀", "🎵"];

let memoryFlippedCards = [];
let memoryMovesCount = 0;
let memoryMatchCount = 0;
let memoryLockBoard = false;

function shuffleCards(items) {
  const nextItems = [...items];
  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[randomIndex]] = [nextItems[randomIndex], nextItems[index]];
  }
  return nextItems;
}

function resetMemoryGame() {
  const deck = shuffleCards([...memorySymbols, ...memorySymbols]);
  memoryFlippedCards = [];
  memoryMovesCount = 0;
  memoryMatchCount = 0;
  memoryLockBoard = false;
  memoryMoves.textContent = "0";
  memoryMatches.textContent = "0";
  memoryStatus.textContent = "Find all the matching pairs.";

  memoryCards.forEach((card, index) => {
    card.textContent = "?";
    card.disabled = false;
    card.classList.remove("is-flipped", "is-matched");
    card.dataset.symbol = deck[index];
    card.setAttribute("aria-label", `Hidden memory card ${index + 1}`);
  });
}

function handleMemoryTurn(event) {
  const card = event.currentTarget;
  if (memoryLockBoard || card.disabled || card.classList.contains("is-flipped")) {
    return;
  }

  card.textContent = card.dataset.symbol;
  card.classList.add("is-flipped");
  card.setAttribute("aria-label", `Revealed memory card with ${card.dataset.symbol}`);
  memoryFlippedCards.push(card);

  if (memoryFlippedCards.length !== 2) {
    return;
  }

  memoryMovesCount += 1;
  memoryMoves.textContent = String(memoryMovesCount);

  const [firstCard, secondCard] = memoryFlippedCards;
  const matched = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (matched) {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    memoryFlippedCards = [];
    memoryMatchCount += 1;
    memoryMatches.textContent = String(memoryMatchCount);
    memoryStatus.textContent = "Nice match! Keep going.";

    if (memoryMatchCount === memorySymbols.length) {
      memoryStatus.textContent = "You matched every pair! Excellent work.";
    }
    return;
  }

  memoryLockBoard = true;
  memoryStatus.textContent = "Not a match — try again.";

  setTimeout(() => {
    firstCard.textContent = "?";
    secondCard.textContent = "?";
    firstCard.classList.remove("is-flipped");
    secondCard.classList.remove("is-flipped");
    firstCard.setAttribute("aria-label", "Hidden memory card");
    secondCard.setAttribute("aria-label", "Hidden memory card");
    memoryFlippedCards = [];
    memoryLockBoard = false;
    memoryStatus.textContent = "Find all the matching pairs.";
  }, 700);
}

if (memoryCards.length) {
  memoryCards.forEach((card) => card.addEventListener("click", handleMemoryTurn));
}

if (memoryReset) {
  memoryReset.addEventListener("click", resetMemoryGame);
}

resetMemoryGame();
=======
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
>>>>>>> Stashed changes

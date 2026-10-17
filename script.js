const xoCells = Array.from(document.querySelectorAll("#xo-board .game__cell"));
const xoStatus = document.querySelector("#game-status");
const xoResetButton = document.querySelector("#game-reset");
const scoreX = document.querySelector("#score-x");
const scoreO = document.querySelector("#score-o");
const scoreResetButton = document.querySelector("#score-reset");

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const xoState = {
  currentPlayer: "X",
  gameOver: false,
  score: { X: 0, O: 0 }
};

function updateScoreboard() {
  scoreX.textContent = String(xoState.score.X);
  scoreO.textContent = String(xoState.score.O);
}

function finishGame(message, winningLine = []) {
  xoState.gameOver = true;
  xoStatus.textContent = message;

  if (winningLine.length) {
    xoState.score[xoState.currentPlayer] += 1;
    updateScoreboard();
  }

  xoCells.forEach((cell, index) => {
    cell.disabled = true;
    if (winningLine.includes(index)) {
      cell.classList.add("is-winner");
    }
  });
}

function resetBoard() {
  xoState.currentPlayer = "X";
  xoState.gameOver = false;
  xoStatus.textContent = "X's turn";

  xoCells.forEach((cell, index) => {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("is-x", "is-o", "is-winner");
    cell.setAttribute("aria-label", `Row ${row}, column ${column}`);
  });
}

function handleXOTurn(event) {
  const cell = event.currentTarget;
  if (xoState.gameOver || cell.textContent) {
    return;
  }

  cell.textContent = xoState.currentPlayer;
  cell.classList.add(xoState.currentPlayer === "X" ? "is-x" : "is-o");
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, ${xoState.currentPlayer}`);

  const winningLine = winningLines.find(([first, second, third]) =>
    xoCells[first].textContent &&
    xoCells[first].textContent === xoCells[second].textContent &&
    xoCells[first].textContent === xoCells[third].textContent
  );

  if (winningLine) {
    finishGame(`${xoState.currentPlayer} wins!`, winningLine);
    return;
  }

  if (xoCells.every((boardCell) => boardCell.textContent)) {
    finishGame("It's a draw!");
    return;
  }

  xoState.currentPlayer = xoState.currentPlayer === "X" ? "O" : "X";
  xoStatus.textContent = `${xoState.currentPlayer}'s turn`;
}

function resetScore() {
  xoState.score.X = 0;
  xoState.score.O = 0;
  updateScoreboard();
  resetBoard();
}

if (xoCells.length) {
  xoCells.forEach((cell) => cell.addEventListener("click", handleXOTurn));
}

if (xoResetButton) {
  xoResetButton.addEventListener("click", resetBoard);
}

if (scoreResetButton) {
  scoreResetButton.addEventListener("click", resetScore);
}

updateScoreboard();
resetBoard();

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

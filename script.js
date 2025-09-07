let board = Array(9).fill(null);
let currentPlayer = 'X';
let mode = 'friend';
let gameActive = true;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');

function setMode(selectedMode) {
  mode = selectedMode;
  restartGame();
}

function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  renderBoard();
  statusEl.textContent = "Player X's turn";
}

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((cell, i) => {
    const cellEl = document.createElement('div');
    cellEl.classList.add('cell');
    if (cell) cellEl.classList.add(cell.toLowerCase());
    cellEl.textContent = cell || '';
    cellEl.addEventListener('click', () => handleMove(i));
    boardEl.appendChild(cellEl);
  });
}

function handleMove(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWin(currentPlayer)) {
    statusEl.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell)) {
    statusEl.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusEl.textContent = `Player ${currentPlayer}'s turn`;

  if (mode === 'robot' && currentPlayer === 'O') {
    setTimeout(robotMove, 500);
  }
}

function robotMove() {
  const difficulty = document.getElementById('difficulty').value;
  let move;

  if (difficulty === 'veryeasy') {
    move = board.findIndex(cell => cell === null);
  } else if (difficulty === 'easy') {
    move = getRandomMove();
  } else {
    move = getBestMove('O');
  }

  if (move !== -1) handleMove(move);
}

function getRandomMove() {
  const empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function getBestMove(player) {
  const opponent = player === 'X' ? 'O' : 'X';

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = player;
      if (checkWin(player)) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = opponent;
      if (checkWin(opponent)) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }

  return getRandomMove();
}

function checkWin(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === player)
  );
}

renderBoard();
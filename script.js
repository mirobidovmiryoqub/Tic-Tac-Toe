const Gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  function getBoard() {
      return board;
  }

  function updateBoard(index, marker) {
      if (board[index] === "") {
          board[index] = marker;
          return true;
      }
      return false;
  }

  function resetBoard() {
      board = ["", "", "", "", "", "", "", "", ""];
  }

  return { getBoard, updateBoard, resetBoard };
})();

const Player = function (name, marker) {
  return { name, marker };
};

const GameController = (function () {
  let players = [Player("O'yinchi 1", "X"), Player("O'yinchi 2", "O")];
  let currentPlayerIndex = 0;
  let gameActive = true;

  function switchPlayer() {
      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  }

  function getCurrentPlayer() {
      return players[currentPlayerIndex];
  }

  function checkWin() {
      const winPatterns = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8],
          [0, 3, 6], [1, 4, 7], [2, 5, 8],
          [0, 4, 8], [2, 4, 6]
      ];

      const board = Gameboard.getBoard();
      return winPatterns.some(pattern => {
          const [a, b, c] = pattern;
          return board[a] && board[a] === board[b] && board[a] === board[c];
      });
  }

  function makeMove(index) {
      if (!gameActive) return;

      const currentPlayer = getCurrentPlayer();
      if (Gameboard.updateBoard(index, currentPlayer.marker)) {
          DisplayController.renderBoard();
          if (checkWin()) {
              DisplayController.updateStatus(`${currentPlayer.name} (${currentPlayer.marker}) g'alaba qozondi!`);
              gameActive = false;
              return;
          }

          if (Gameboard.getBoard().every(cell => cell !== "")) {
              DisplayController.updateStatus("Durrang!");
              gameActive = false;
              return;
          }

          switchPlayer();
          DisplayController.updateStatus(`Hozirgi o'yinchi: ${getCurrentPlayer().marker}`);
      }
  }

  function resetGame() {
      Gameboard.resetBoard();
      currentPlayerIndex = 0;
      gameActive = true;
      DisplayController.renderBoard();
      DisplayController.updateStatus(`Hozirgi o'yinchi: ${getCurrentPlayer().marker}`);
  }

  return { makeMove, resetGame, getCurrentPlayer };
})();

const DisplayController = (function () {
  const boardElement = document.getElementById("board");
  const statusElement = document.getElementById("status");
  const resetButton = document.getElementById("reset");

  function renderBoard() {
      boardElement.innerHTML = "";
      Gameboard.getBoard().forEach((cell, index) => {
          const cellElement = document.createElement("div");
          cellElement.classList.add("cell");
          cellElement.dataset.index = index;
          cellElement.textContent = cell;
          if (cell) cellElement.classList.add("taken");
          cellElement.addEventListener("click", () => GameController.makeMove(index));
          boardElement.appendChild(cellElement);
      });
  }

  function updateStatus(message) {
      statusElement.textContent = message;
  }

  resetButton.addEventListener("click", GameController.resetGame);

  renderBoard();
  return { renderBoard, updateStatus };
})();


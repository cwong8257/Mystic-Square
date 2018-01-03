const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const moveCountDiv = document.getElementById("moveCountDiv");
const timerDiv = document.getElementById("timerDiv");
const moveCounter = document.getElementById("moveCount");
const sizeSelector = document.getElementById("selectSize");
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
var dimension;
const TILE_LENGTH = 100;

var app = (function() {
  function startGame() {
    board.init(sizeSelector.value);
    board.generateWinningBoard();
    view.init();
    view.clearBoard();
    view.buildBoard();
    view.setUpGameEventListeners();
    view.removeClickPlayListener();
    view.removePlayAgainListener();
    view.unHighlightStats();
    moveCount.resetMoveCount();
    timer.startTimer();
  }
  
  function getReady() {
    board.init(sizeSelector.value);
    view.init();
    view.setUpClickPlayListener();
    view.removePlayAgainListener();
    view.removeGameEventListeners();
    view.unHighlightStats();
    moveCount.resetMoveCount();
    timer.stopTimer();
    timer.resetTimer();
  }

  function checkWin() {
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (board.tiles[i][j] != board.winningBoard[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  function won() {
    view.drawWin();
    view.removeGameEventListeners();
    timer.stopTimer();

    view.highlightStats();
  }

  function playAgain(event, width, height) {
    let position = util.getMousePosition(event);
    let x = position.x;
    let y = position.y;
    
    if (x > (canvas.width - width) / 2 && x < (canvas.width + width) / 2 && y > (canvas.height - height) / 1.3 && y < (canvas.height + height) / 1.3) {
      app.startGame();
    }
  }

  return {
    startGame: startGame,
    getReady: getReady,
    checkWin: checkWin,
    won: won,
    playAgain: playAgain
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  app.getReady();
});
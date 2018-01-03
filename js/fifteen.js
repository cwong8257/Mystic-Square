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
        debugger;
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


var board = (function() {
  var tiles = [];
  var tileMap = [];
  var winningBoard = [];

  function init(dim) {
    dimension = dim;

    let temp;
    
    for (let i = 0; i < dimension; i++) {
      tiles[i] = [];
      for (let j = 0; j < dimension; j++) {
        tiles[i][j] = dimension * dimension - 1 - j - (i * dimension);
      }                   
    }
    
    if (dimension % 2 == 0) {
      temp = tiles[dimension - 1][dimension - 2];
      tiles[dimension - 1][dimension - 2] = tiles[dimension - 1][dimension - 3];
      tiles[dimension - 1][dimension - 3] = temp;
    }
  }

  function buildBoard() {

  }

  function getTile(x, y) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (y >= tileMap[i][j].y && y <= tileMap[i][j].y + TILE_LENGTH &&
          x >= tileMap[i][j].x && x <= tileMap[i][j].x + TILE_LENGTH) {
            return tileMap[i][j];
        }
      }
    }
  }

  function getZeroTile() {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (tileMap[i][j].tileName === 0) {
          return tileMap[i][j];
        }
      }
    }
  }

  function switchTile(currentTile, zeroTile) {
    let zeroRow = zeroTile.row;
    let zeroCol = zeroTile.col;
    let tileRow = currentTile.row;
    let tileCol = currentTile.col;
    let temp;
    
    temp = tiles[zeroRow][zeroCol];
    tiles[zeroRow][zeroCol] = tiles[tileRow][tileCol];
    tiles[tileRow][tileCol] = temp;

    temp = tileMap[zeroRow][zeroCol];
    tileMap[zeroRow][zeroCol] = tileMap[tileRow][tileCol];
    tileMap[tileRow][tileCol] = temp;
  }

  function canMove(currentTile, zeroTile) {
    let zeroRow = zeroTile.row;
    let zeroCol = zeroTile.col;
    let tileRow = currentTile.row;
    let tileCol = currentTile.col;
    
    if ((zeroRow === tileRow && Math.abs(zeroCol - tileCol) === 1) ||
    (Math.abs(zeroRow - tileRow) === 1 && zeroCol === tileCol)) {
      return true;
    }
    else {
      return false;
    }
  }

  function generateWinningBoard() {
    for (let i = 0; i < dimension; i++) {
      winningBoard[i] = [];
      for (let j = 0; j < dimension; j++) {
        let num = i * dimension + j + 1;
        winningBoard[i][j] = num;
      }
    }
    winningBoard[dimension - 1][dimension - 1] = 0;
  }

  return {
    init: init,
    tiles: tiles,
    tileMap: tileMap,
    winningBoard: winningBoard,
    getTile: getTile,
    getZeroTile: getZeroTile,
    switchTile: switchTile,
    canMove: canMove,
    generateWinningBoard: generateWinningBoard
  };
})();


var moveCount = (function() {
  var moveCount = 0;

  function resetMoveCount() {
    moveCount = 0;
    view.resetMoveCount();
  }

  function incrementMoveCount() {
    moveCount++;
    view.setMoveCount(moveCount);
  }

  return {
    resetMoveCount: resetMoveCount,
    incrementMoveCount: incrementMoveCount
  }
})();


var timer = (function() {
  var seconds = 0;

  function startTimer() {
    timer.stopTimer();
    timer.resetTimer();
    timer.timer = setInterval(timer.setTimer, 1000);
  }

  function setTimer() {
    seconds++;
    view.setTimer(seconds);
  }

  function resetTimer() {
    seconds = 0;
    view.resetTimer();
  }

  function stopTimer() {
    clearInterval(timer.timer);
  }

  return {
    startTimer: startTimer,
    setTimer: setTimer,
    resetTimer: resetTimer,
    stopTimer: stopTimer
  };
})();


var handler = (function() {
  function clickMove(event) {
    let position = util.getMousePosition(event);
    let x = position.x;
    let y = position.y;
    let currentTile = board.getTile(x, y);
    let zeroTile = board.getZeroTile();

    if (board.canMove(currentTile, zeroTile)) {
      board.switchTile(currentTile, zeroTile);
      moveCount.incrementMoveCount();
      view.clearBoard();
      view.buildBoard();

      if (app.checkWin()) {
        app.won();
      }
    }
  }

  function keyMove(event) {
    if (event.defaultPrevented) {
      return;
    }
    let zeroTile = board.getZeroTile();

    switch (event.key) {
      case "ArrowDown":
        if (zeroTile.row - 1 >= 0) {
          let currentTile = board.tileMap[zeroTile.row - 1][zeroTile.col];
          board.switchTile(currentTile, zeroTile);
          moveCount.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          if (app.checkWin()) {
            app.won();
          }
        }
        break;
      case "ArrowUp":
        if (zeroTile.row + 1 < dimension) {
          let currentTile = board.tileMap[zeroTile.row + 1][zeroTile.col];
          board.switchTile(currentTile, zeroTile);
          moveCount.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          if (app.checkWin()) {
            app.won();
          }
        }
        break;
      case "ArrowLeft":
        if (zeroTile.col + 1 < dimension) {
          let currentTile = board.tileMap[zeroTile.row][zeroTile.col + 1];
          board.switchTile(currentTile, zeroTile);
          moveCount.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          if (app.checkWin()) {
            app.won();
          }
        }
        break;
      case "ArrowRight":
        if (zeroTile.col - 1 >= 0) {
          let currentTile = board.tileMap[zeroTile.row][zeroTile.col - 1];
          board.switchTile(currentTile, zeroTile);
          moveCount.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          if (app.checkWin()) {
            app.won();
          }
        }
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function playAgain(event) {
    let width = 230;
    let height = 50;

    app.playAgain(event, width, height);
  }

  function clickPlay(event) {
    app.startGame();
  }


  return {
    clickMove: clickMove,
    keyMove: keyMove,
    playAgain: playAgain,
    clickPlay: clickPlay
  };
})();


var view = (function() {
  const TILE_OPACITY = 0.5;
  const BOARD_OPACITY = 0.8;

  function init() {
    canvas.width = dimension * TILE_LENGTH;
    canvas.height = dimension * TILE_LENGTH;
    ctx.globalAlpha = BOARD_OPACITY;
    ctx.fillStyle = '#3A3335';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Courier New";
    ctx.fillStyle = 'white';
    ctx.textAlign = "center"; 
    ctx.fillText("Play", canvas.width / 2, canvas.height / 2);
  }

  function drawTile(pos, map, i, j) {
    ctx.globalAlpha = TILE_OPACITY;
    ctx.fillStyle = '#ff392e';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.fillRect(pos.x + 5, pos.y + 5, TILE_LENGTH * 0.9, TILE_LENGTH * 0.9);
    ctx.fillStyle = '#ffffff';
    ctx.font = "20px Verdana";
    ctx.fillText(map[i][j], pos.textx + 5, pos.texty);
  }

  function buildBoard() {
    let map = board.tiles;
    let tileMap = board.tileMap;
    let pos = {
      x: 0,
      y: 0,
      textx: (TILE_LENGTH / 2) - 5,
      texty: (TILE_LENGTH / 2) + 5
    }
    for (let i = 0; i < map.length; i++) {
      tileMap[i] = [];

      for (let j = 0; j < map[i].length; j++) {
        let currentTile = {
          tileName: map[i][j],
          x: pos.x,
          y: pos.y,
          row: i,
          col: j
        };
        if (map[i][j] !== 0) {
          this.drawTile(pos, map, i, j);
        }
        tileMap[i].push(currentTile);
        pos.x += TILE_LENGTH;
        pos.textx += TILE_LENGTH;
      }
      pos.x = 0;
      pos.y += TILE_LENGTH;
      pos.textx = (TILE_LENGTH / 2) - 5;
      pos.texty += TILE_LENGTH; 
    }
  }

  function clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = BOARD_OPACITY;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#3A3335';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawWin() {
    let width = 230;
    let height = 50;

    view.clearBoard();
    ctx.font = "40px Courier New";
    ctx.fillStyle = 'white';
    ctx.textAlign = "center"; 
    ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
    ctx.strokeRect((canvas.width - width) / 2, (canvas.height - height) / 1.3, width, height);
    ctx.fillRect((canvas.width - width) / 2, (canvas.height - height) / 1.3, width, height);
    ctx.font = "30px Courier New";
    ctx.fillStyle = 'black';
    ctx.fillText("Play again", canvas.width / 2, canvas.height / 1.3);

    view.setUpPlayAgainListener(width, height);
  }

  function resetMoveCount() {
    moveCounter.innerText = 0;
  }

  function setMoveCount(moveCount) {
    moveCounter.innerText = moveCount;
  }

  function resetTimer() {
    minutesLabel.innerHTML = "00";
    secondsLabel.innerHTML = "00";
  }

  function setTimer(seconds) {
    secondsLabel.innerHTML = util.padding(seconds % 60);
    minutesLabel.innerHTML = util.padding(parseInt(seconds / 60));
  }

  function highlightStats() {
    moveCountDiv.style.animationName = "example";
    timerDiv.style.animationName = "example";
  }

  function unHighlightStats() {
    moveCountDiv.style.animationName = "";
    timerDiv.style.animationName = "";
  }

  function setUpGameEventListeners() {
    canvas.addEventListener("mousedown", handler.clickMove);
    document.addEventListener("keydown", handler.keyMove);
  }

  function removeGameEventListeners() {
    canvas.removeEventListener("mousedown", handler.clickMove);
    document.removeEventListener("keydown", handler.keyMove);
  }

  function setUpPlayAgainListener() {
    canvas.addEventListener("mousedown", handler.playAgain);
  }

  function removePlayAgainListener() {
    canvas.removeEventListener("mousedown", handler.playAgain);
  }

  function setUpClickPlayListener() {
    canvas.addEventListener("mousedown", handler.clickPlay);
  }

  function removeClickPlayListener() {
    canvas.removeEventListener("mousedown", handler.clickPlay);
  }

  return {
    init: init,
    drawTile: drawTile,
    buildBoard: buildBoard,
    clearBoard: clearBoard,
    drawWin: drawWin,
    resetMoveCount: resetMoveCount,
    setMoveCount: setMoveCount,
    resetTimer: resetTimer,
    setTimer: setTimer,
    highlightStats: highlightStats,
    unHighlightStats: unHighlightStats,
    setUpGameEventListeners: setUpGameEventListeners,
    removeGameEventListeners: removeGameEventListeners,
    setUpPlayAgainListener: setUpPlayAgainListener,
    removePlayAgainListener: removePlayAgainListener,
    setUpClickPlayListener: setUpClickPlayListener,
    removeClickPlayListener: removeClickPlayListener
  };
})();


var util = (function() {
  return {
    getMousePosition: function(event) {
      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
  
      return {
        x: x,
        y: y
      };
    },
    getInversionCount: function(tiles) {
      let count = 0;
      for (let i = 0; i < dimension * dimension - 1; i++) {
        for (let j = i + 1; j < dimension * dimension; j++) {
          if (arr[j] && arr[i] && arr[i] > arr[j])
            count++;
        }
      }
      return count;
    },
    padding: function(val) {
      let valString = val + "";
  
      if (valString.length < 2) {
        return "0" + valString;
      }
      else {
        return valString;
      }
    }
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  app.getReady();
});
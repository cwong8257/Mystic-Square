const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const moveCountDiv = document.getElementById("moveCountDiv");
const timerDiv = document.getElementById("timerDiv");
const moveCounter = document.getElementById("moveCount");
const sizeSelector = document.getElementById("selectSize");
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
const TILE_OPACITY = 0.5;
const BOARD_OPACITY = 0.8;
var dimension;
var tileLength;

var app = {
  startGame: function() {
    board.init(sizeSelector.value);
    view.init();
    view.clearBoard();
    view.buildBoard();
    view.setUpGameEventListeners();
    view.removeClickPlayListener();
    view.removePlayAgainListener();
    view.unHighlightStats();
    moveCount.resetMoveCount();
    timer.init();
  },
  getReady: function() {
    board.init(sizeSelector.value);
    view.init();
    view.setUpClickPlayListener();
    view.removePlayAgainListener();
    view.unHighlightStats();
    moveCount.resetMoveCount();
    timer.stopTimer();
    timer.resetTimer();
  },
  checkWin: function() {
    let check = [];

    for (var i = 0; i < dimension; i++) {
      check[i] = [];
      for (var j = 0; j < dimension; j++) {
        let num = i * dimension + j + 1;
        check[i][j] = num;
      }
    }
    check[dimension - 1][dimension - 1] = 0;
    
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (board.tiles[i][j] != check[i][j]) {
          return false;
        }
      }
    }
    return true;
  },
  won: function() {
    view.drawWin();
    view.removeGameEventListeners();
    timer.stopTimer();

    view.highlightStats();
  },
  playAgain: function(event, width, height) {
    let position = util.getMousePosition(event);
    let x = position.x;
    let y = position.y;
    
    if (x > (canvas.width - width) / 2 && x < (canvas.width + width) / 2 && y > (canvas.height - height) / 1.3 && y < (canvas.height + height) / 1.3) {
      app.startGame();
    }
  }
}

var board = {
  tiles: [],
  tileMap: [],
  getTile: function(x, y) {
    let tileMap = this.tileMap;
    let tile = view.tile;

    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (y >= tileMap[i][j].y && y <= tileMap[i][j].y + tileLength &&
          x >= tileMap[i][j].x && x <= tileMap[i][j].x + tileLength) {
            return tileMap[i][j];
        }
      }
    }
  },
  getZeroTile: function() {
    let tileMap = this.tileMap;

    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (tileMap[i][j].tileName === 0) {
          return tileMap[i][j];
        }
      }
    }
  },
  switchTile: function(currentTile, zeroTile) {
    let zeroRow = zeroTile.row;
    let zeroCol = zeroTile.col;
    let tileRow = currentTile.row;
    let tileCol = currentTile.col;
    let tiles = this.tiles;
    let tileMap = this.tileMap;
    let temp;
    
    temp = tiles[zeroRow][zeroCol];
    tiles[zeroRow][zeroCol] = tiles[tileRow][tileCol];
    tiles[tileRow][tileCol] = temp;

    temp = tileMap[zeroRow][zeroCol];
    tileMap[zeroRow][zeroCol] = tileMap[tileRow][tileCol];
    tileMap[tileRow][tileCol] = temp;
  },
  canMove: function(currentTile, zeroTile) {
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
  },
  init: function(dim) {
    dimension = dim;
    let tiles = this.tiles;

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
};

var moveCount = {
  resetMoveCount: function() {
    moveCounter.innerText = 0;
  },
  incrementMoveCount: function() {
    moveCounter.innerText = Number(moveCounter.innerHTML) + 1;
  }
}

var timer = {
  init: function() {
    timer.stopTimer();
    timer.resetTimer();
    timer.timer = setInterval(timer.setTime, 1000);
  },
  setTime: function() {
    ++totalSeconds;
    secondsLabel.innerHTML = timer.padding(totalSeconds % 60);
    minutesLabel.innerHTML = timer.padding(parseInt(totalSeconds / 60));
  },
  padding: function(val) {
    let valString = val + "";

    if (valString.length < 2) {
      return "0" + valString;
    }
    else {
      return valString;
    }
  },
  resetTimer: function() {
    totalSeconds = 0;
    minutesLabel.innerHTML = "00";
    secondsLabel.innerHTML = "00";
  },
  stopTimer: function() {
    clearInterval(timer.timer);
  }
};

var handler = {
  clickMove: function(event) {
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
  },
  keyMove: function(event) {
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
  },
  playAgain: function(event) {
    let width = 230;
    let height = 50;

    app.playAgain(event, width, height);
  },
  clickPlay: function(event) {
    app.startGame();
  }
}

var view = {
  init: function() {
    tileLength = 100;
    canvas.width = dimension * tileLength;
    canvas.height = dimension * tileLength;
    ctx.globalAlpha = BOARD_OPACITY;
    ctx.fillStyle = '#3A3335';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Courier New";
    ctx.fillStyle = 'white';
    ctx.textAlign = "center"; 
    ctx.fillText("Play", canvas.width / 2, canvas.height / 2);
  },
  drawTile: function(pos, map, i, j) {
    ctx.globalAlpha = TILE_OPACITY;
    ctx.fillStyle = '#48d1cc';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.fillRect(pos.x + 5, pos.y + 5, tileLength * 0.9, tileLength * 0.9);
    ctx.fillStyle = '#ffffff';
    ctx.font = "20px Verdana";
    ctx.fillText(map[i][j], pos.textx + 5, pos.texty);

  },
  buildBoard: function() {
    let map = board.tiles;
    let tileMap = board.tileMap;
    let pos = {
      x: 0,
      y: 0,
      textx: (tileLength / 2) - 5,
      texty: (tileLength / 2) + 5
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
        pos.x += tileLength;
        pos.textx += tileLength;
      }
      pos.x = 0;
      pos.y += tileLength;
      pos.textx = (tileLength / 2) - 5;
      pos.texty += tileLength; 
    }
  },
  clearBoard: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = BOARD_OPACITY;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#3A3335';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  drawWin: function() {
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
  },
  highlightStats: function() {
    moveCountDiv.style.animationName = "example";
    timerDiv.style.animationName = "example";
  },
  unHighlightStats: function() {
    moveCountDiv.style.animationName = "";
    timerDiv.style.animationName = "";
  },
  setUpGameEventListeners: function() {
    canvas.addEventListener("mousedown", handler.clickMove);
    document.addEventListener("keydown", handler.keyMove);
  },
  removeGameEventListeners: function() {
    canvas.removeEventListener("mousedown", handler.clickMove);
    document.removeEventListener("keydown", handler.keyMove);
  },
  setUpPlayAgainListener: function() {
    canvas.addEventListener("mousedown", handler.playAgain);
  },
  removePlayAgainListener: function() {
    canvas.removeEventListener("mousedown", handler.playAgain);
  },
  setUpClickPlayListener: function() {
    canvas.addEventListener("mousedown", handler.clickPlay);
  },
  removeClickPlayListener: function() {
    canvas.removeEventListener("mousedown", handler.clickPlay);
  }
};

var util = {
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
    return inv_count;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  app.getReady();
});

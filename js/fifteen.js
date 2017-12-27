const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const moveCount = document.getElementById("moveCount");
const sizeSelector = document.getElementById("selectSize")
var dimension;
var tileLength;

var app = {
  clickMove: function(event) {
    let position = util.getPosition(event);
    let x = position.x;
    let y = position.y;
    let currentTile = board.getTile(x, y);
    let zeroTile = board.getZero();

    if (board.canMove(currentTile, zeroTile)) {
      board.switchTile(currentTile, zeroTile);
      app.incrementMoveCount();
      view.clearBoard();
      view.buildBoard();
      console.log(app.won());
    }
  },
  keyMove: function(event) {
    if (event.defaultPrevented) {
      return;
    }
    let zeroTile = board.getZero();
    

    switch (event.key) {
      case "ArrowDown":
        if (zeroTile.row - 1 >= 0) {
          let currentTile = board.tileMap[zeroTile.row - 1][zeroTile.col];
          board.switchTile(currentTile, zeroTile);
          app.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          console.log(app.won());
        }
        break;
      case "ArrowUp":
        if (zeroTile.row + 1 < dimension) {
          let currentTile = board.tileMap[zeroTile.row + 1][zeroTile.col];
          board.switchTile(currentTile, zeroTile);
          app.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          console.log(app.won());
        }
        break;
      case "ArrowLeft":
        if (zeroTile.col + 1 < dimension) {
          let currentTile = board.tileMap[zeroTile.row][zeroTile.col + 1];
          board.switchTile(currentTile, zeroTile);
          app.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          console.log(app.won());
        }
        break;
      case "ArrowRight":
        if (zeroTile.col - 1 >= 0) {
          let currentTile = board.tileMap[zeroTile.row][zeroTile.col - 1];
          board.switchTile(currentTile, zeroTile);
          app.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          console.log(app.won());
        }
        break;
      default:
        return;
    }
    event.preventDefault();
  },
  incrementMoveCount: function() {
    moveCount.innerText = Number(moveCount.innerHTML) + 1;
  },
  won: function() {
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
  selectSize: function() {
    board.init(sizeSelector.value);
    view.init();
    view.buildBoard();
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
  getZero: function() {
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

var handlers = {

};

var view = {
  init: function() {
    tileLength = 100;
    canvas.width = dimension * tileLength;
    canvas.height = dimension * tileLength;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  drawTile: function(pos, map, i, j) {
    ctx.fillStyle = '#48d1cc';
    ctx.fillRect(pos.x + 5, pos.y + 5, tileLength * 0.9, tileLength * 0.9);
    ctx.fillStyle = '#ffffff';
    ctx.font = "20px Verdana";
    if (map[i][j] >= 10) {
      ctx.fillText(map[i][j], pos.textx - 5 , pos.texty);
    }
    else {
      ctx.fillText(map[i][j], pos.textx, pos.texty);
    }
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
  setUpEventListeners: function() {
    canvas.addEventListener("mousedown", app.clickMove);
    document.addEventListener("keydown", app.keyMove);
  },
  clearBoard: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

var util = {
  getPosition: function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    return {
      x: x,
      y: y
    };
  }
}

document.addEventListener('DOMContentLoaded', function() {
  board.init(sizeSelector.value);
  view.init();
  view.buildBoard();
  view.setUpEventListeners();
});

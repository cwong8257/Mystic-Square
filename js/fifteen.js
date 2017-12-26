const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const DIMENSION = 4;
const TILE_LENGTH = 100;

var board = {
  tiles: [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,0]
  ],
  tileMap: [],
  getTile: function(x, y) {
    let tileMap = this.tileMap;
    let tile = view.tile;

    for (let i = 0; i < tileMap.length; i++) {
      for (let j = 0; j < tileMap[i].length; j++) {
        if (y > tileMap[i][j].y && y < tileMap[i][j].y + TILE_LENGTH &&
          x > tileMap[i][j].x && x < tileMap[i][j].x + TILE_LENGTH) {
            return tileMap[i][j];
        }
      }
    }
  },
  getZero: function() {
    let tileMap = this.tileMap;

    for (let i = 0; i < tileMap.length; i++) {
      for (let j = 0; j < tileMap[i].length; j++) {
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
  moveTile: function(event) {
    let x = util.getPosition(event).x;
    let y = util.getPosition(event).y;
    let currentTile = board.getTile(x, y);
    let zeroTile = board.getZero();

    if (board.canMove(currentTile, zeroTile)) {
      board.switchTile(currentTile, zeroTile);
    }
    view.clearBoard();
    view.buildBoard();
  },
  canMove: function(currentTile, zeroTile) {
    let zeroRow = zeroTile.row;
    let zeroCol = zeroTile.col;
    let tileRow = currentTile.row;
    let tileCol = currentTile.col;
    
    if ((zeroRow === tileRow && Math.abs(zeroCol - tileCol) === 1) || (Math.abs(zeroRow - tileRow) === 1 && zeroCol === tileCol)) {
        return true;
    }
    else {
        return false;
    }
  }
};

var handlers = {

}

var view = {
  init: function() {
    canvas.width = 400;
    canvas.height = 400;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
  },
  drawTile: function(pos, map, i, j) {
    ctx.fillStyle = '#48d1cc';
    ctx.fillRect(pos.x + 5, pos.y + 5, TILE_LENGTH - 10, TILE_LENGTH - 10);
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
      textx: 45,
      texty: 55
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
        pos.x += 100;
        pos.textx += 100;
      }
      pos.x = 0;
      pos.y += 100;
      pos.textx = 45;
      pos.texty += 100; 
    }
  },
  setUpEventListeners: function() {
    canvas.addEventListener("mousedown", board.moveTile);
  },
  clearBoard: function(){
    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
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
  view.init();
  view.buildBoard();
  view.setUpEventListeners();
});

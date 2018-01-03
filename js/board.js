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
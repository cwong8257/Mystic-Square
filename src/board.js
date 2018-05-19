import Tile from './tile';

class Board {
  constructor(dimensions) {
    this.tiles = this.buildBoard(dimensions);
    this.winningBoard = this.buildWinningBoard(dimensions);
    this.dimensions = dimensions;
  }

  buildBoard(dimensions) {
    let tiles = [];

    for (let row = 0; row < dimensions; row++) {
      tiles[row] = [];
      for (let col = 0; col < dimensions; col++) {
        const value = dimensions * dimensions - 1 - col - row * dimensions;
        tiles[row][col] = new Tile(value, row, col);
      }
    }

    if (dimensions % 2 == 0) {
      let temp = tiles[dimensions - 1][dimensions - 2].value;
      tiles[dimensions - 1][dimensions - 2].value = tiles[dimensions - 1][dimensions - 3].value;
      tiles[dimensions - 1][dimensions - 3].value = temp;
    }

    return tiles;
  }

  getTiles() {
    return this.tiles;
  }

  getZeroTile() {
    const { dimensions, tiles } = this;

    for (let i = 0; i < dimensions; i++) {
      for (let j = 0; j < this.dimensions; j++) {
        if (tiles[i][j].value === 0) {
          return tiles[i][j];
        }
      }
    }
  }

  switchTile(currentTile, zeroTile) {
    const { tiles } = this;

    const zeroRow = zeroTile.row;
    const zeroCol = zeroTile.col;
    const tileRow = currentTile.row;
    const tileCol = currentTile.col;
    const temp = tiles[zeroRow][zeroCol].value;
    tiles[zeroRow][zeroCol].value = tiles[tileRow][tileCol].value;
    tiles[tileRow][tileCol].value = temp;
  }

  canMove(currentTile) {
    const zeroTile = this.getZeroTile();

    let zeroRow = zeroTile.row;
    let zeroCol = zeroTile.col;
    let tileRow = currentTile.row;
    let tileCol = currentTile.col;

    if (zeroRow === tileRow && zeroCol - tileCol === 1) {
      return 'right';
    } else if (zeroRow === tileRow && zeroCol - tileCol === -1) {
      return 'left';
    } else if (zeroCol === tileCol && zeroRow - tileRow === 1) {
      return 'down';
    } else if (zeroCol === tileCol && zeroRow - tileRow === -1) {
      return 'up';
    } else {
      return false;
    }

    return (
      (zeroRow === tileRow && Math.abs(zeroCol - tileCol) === 1) ||
      (Math.abs(zeroRow - tileRow) === 1 && zeroCol === tileCol)
    );
  }

  move(direction) {
    const zeroTile = this.getZeroTile();
    const { dimensions } = this;

    switch (direction) {
      case 'up':
        if (zeroTile.row + 1 < dimensions) {
          let currentTile = this.tiles[zeroTile.row + 1][zeroTile.col];
          this.switchTile(currentTile, zeroTile);
          return true;
        }
        break;
      case 'down':
        if (zeroTile.row - 1 >= 0) {
          let currentTile = this.tiles[zeroTile.row - 1][zeroTile.col];
          this.switchTile(currentTile, zeroTile);
          return true;
        }
        break;
      case 'left':
        if (zeroTile.col + 1 < dimensions) {
          let currentTile = this.tiles[zeroTile.row][zeroTile.col + 1];
          this.switchTile(currentTile, zeroTile);
          return true;
        }
        break;
      case 'right':
        if (zeroTile.col - 1 >= 0) {
          let currentTile = this.tiles[zeroTile.row][zeroTile.col - 1];
          this.switchTile(currentTile, zeroTile);
          return true;
        }
        break;
      default:
        return false;
    }
  }

  buildWinningBoard(dimensions) {
    let winningBoard = [];

    for (let i = 0; i < dimensions; i++) {
      winningBoard[i] = [];
      for (let j = 0; j < dimensions; j++) {
        let num = i * dimensions + j + 1;
        winningBoard[i][j] = num;
      }
    }
    winningBoard[dimensions - 1][dimensions - 1] = 0;

    return winningBoard;
  }
}

export { Board as default };

import Tile from './tile'

class Board {
  constructor (dimensions) {
    this.tiles = Board.buildBoard(dimensions)
    this.winningBoard = Board.buildWinningBoard(dimensions)
    this.dimensions = dimensions
  }

  static buildBoard (dimensions) {
    const tiles = []

    for (let row = 0; row < dimensions; row++) {
      tiles[row] = []
      for (let col = 0; col < dimensions; col++) {
        const value = dimensions * dimensions - 1 - col - row * dimensions
        tiles[row][col] = new Tile(value, row, col)
      }
    }

    if (dimensions % 2 === 0) {
      const temp = tiles[dimensions - 1][dimensions - 2].value
      tiles[dimensions - 1][dimensions - 2].value = tiles[dimensions - 1][dimensions - 3].value
      tiles[dimensions - 1][dimensions - 3].value = temp
    }

    return tiles
  }

  getTiles () {
    return this.tiles
  }

  getZeroTile () {
    const { dimensions, tiles } = this

    for (let i = 0; i < dimensions; i++) {
      for (let j = 0; j < this.dimensions; j++) {
        if (tiles[i][j].value === 0) {
          return tiles[i][j]
        }
      }
    }
    throw new Error('Something went wrong')
  }

  switchTile (currentTile, zeroTile) {
    const { tiles } = this

    const zeroRow = zeroTile.row
    const zeroCol = zeroTile.col
    const tileRow = currentTile.row
    const tileCol = currentTile.col
    const temp = tiles[zeroRow][zeroCol].value
    tiles[zeroRow][zeroCol].value = tiles[tileRow][tileCol].value
    tiles[tileRow][tileCol].value = temp
  }

  canMove (currentTile) {
    const zeroTile = this.getZeroTile()

    const zeroRow = zeroTile.row
    const zeroCol = zeroTile.col
    const tileRow = currentTile.row
    const tileCol = currentTile.col

    if (zeroRow === tileRow && zeroCol - tileCol === 1) {
      return 'right'
    } else if (zeroRow === tileRow && zeroCol - tileCol === -1) {
      return 'left'
    } else if (zeroCol === tileCol && zeroRow - tileRow === 1) {
      return 'down'
    } else if (zeroCol === tileCol && zeroRow - tileRow === -1) {
      return 'up'
    }
    return false
  }

  move (direction) {
    const zeroTile = this.getZeroTile()
    const { row: zeroTileRow, col: zeroTileCol } = zeroTile
    const { dimensions } = this

    switch (direction) {
      case 'up':
        if (zeroTileRow + 1 < dimensions) {
          const currentTile = this.tiles[zeroTileRow + 1][zeroTileCol]
          this.switchTile(currentTile, zeroTile)
          return true
        }
        break
      case 'down':
        if (zeroTileRow - 1 >= 0) {
          const currentTile = this.tiles[zeroTileRow - 1][zeroTileCol]
          this.switchTile(currentTile, zeroTile)
          return true
        }
        break
      case 'left':
        if (zeroTileCol + 1 < dimensions) {
          const currentTile = this.tiles[zeroTileRow][zeroTileCol + 1]
          this.switchTile(currentTile, zeroTile)
          return true
        }
        break
      case 'right':
        if (zeroTileCol - 1 >= 0) {
          const currentTile = this.tiles[zeroTileRow][zeroTileCol - 1]
          this.switchTile(currentTile, zeroTile)
          return true
        }
        break
      default:
        return false
    }
    return false
  }

  static buildWinningBoard (dimensions) {
    const winningBoard = []

    for (let i = 0; i < dimensions; i++) {
      winningBoard[i] = []
      for (let j = 0; j < dimensions; j++) {
        const value = i * dimensions + j + 1
        winningBoard[i][j] = value
      }
    }
    winningBoard[dimensions - 1][dimensions - 1] = 0

    return winningBoard
  }
}

export { Board as default }

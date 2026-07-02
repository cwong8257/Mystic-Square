const OFFSET_1 = 1
const OFFSET_2 = 2
const OFFSET_3 = 3
const EVEN_DIVISOR = 2
const ZERO_REMAINDER = 0
const DIMENSION_1D = 1
const DIMENSION_2D = 2
const FLAT_DEPTH = 2
const STEP = 1

class MysticBoard {
  constructor (dimensions) {
    this.tiles = MysticBoard.buildBoard(dimensions)
    this.dimensions = dimensions
    this.zeroRow = dimensions - OFFSET_1
    this.zeroCol = dimensions - OFFSET_1
  }

  static buildBoard (size) {
    const tiles = []

    for (let row = 0; row < size; row++) {
      tiles.push([])

      for (let col = 0; col < size; col++) {
        tiles[row][col] = size * size - OFFSET_1 - col - row * size
      }
    }

    if (size % EVEN_DIVISOR === ZERO_REMAINDER) {
      [tiles[size - OFFSET_1][size - OFFSET_2], tiles[size - OFFSET_1][size - OFFSET_3]] =
      [tiles[size - OFFSET_1][size - OFFSET_3], tiles[size - OFFSET_1][size - OFFSET_2]]
    }

    return tiles
  }

  checkWin () {
    const tiles = this.getTiles(DIMENSION_1D)

    for (let idx = 0; idx < this.dimensions ** DIMENSION_2D - OFFSET_1; idx++) {
      if (tiles[idx] !== idx + OFFSET_1) {return false}
    }

    return true
  }

  getTiles (dimensions) {
    switch (dimensions) {
      case DIMENSION_1D: return this.tiles.flat(FLAT_DEPTH)
      case DIMENSION_2D: return this.tiles
      default: return null
    }
  }

  moveDirection (direction) {
    let col = this.zeroCol
    let row = this.zeroRow

    switch (direction) {
      case 'ArrowUp': row += STEP
        break
      case 'ArrowDown': row -= STEP
        break
      case 'ArrowLeft': col += STEP
        break
      case 'ArrowRight': col -= STEP
        break
      default: return false
    }

    const tile = this.getTileAt(row, col)

    if (!tile) {return false}

    return this.moveTile(tile)
  }

  moveTile (tile) {
    const topOfZero = this.getTileAt(this.zeroRow - OFFSET_1, this.zeroCol)
    const bottomOfZero = this.getTileAt(this.zeroRow + OFFSET_1, this.zeroCol)
    const leftOfZero = this.getTileAt(this.zeroRow, this.zeroCol - OFFSET_1)
    const rightOfZero = this.getTileAt(this.zeroRow, this.zeroCol + OFFSET_1)

    switch (tile) {
      case topOfZero: this.swapTiles(this.zeroRow - OFFSET_1, this.zeroCol)
        break
      case bottomOfZero: this.swapTiles(this.zeroRow + OFFSET_1, this.zeroCol)
        break
      case leftOfZero: this.swapTiles(this.zeroRow, this.zeroCol - OFFSET_1)
        break
      case rightOfZero: this.swapTiles(this.zeroRow, this.zeroCol + OFFSET_1)
        break
      default: return false
    }

    return true
  }

  swapTiles (row, col) {
    [this.tiles[row][col], this.tiles[this.zeroRow][this.zeroCol]] =
    [this.tiles[this.zeroRow][this.zeroCol], this.tiles[row][col]]

    this.zeroRow = row
    this.zeroCol = col
  }

  getTileAt (row, col) {
    return this.tiles[row] && this.tiles[row][col]
  }
}

export default MysticBoard

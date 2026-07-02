const OFFSET_1 = 1
const EVEN_DIVISOR = 2
const ZERO_REMAINDER = 0
const BLANK_TILE = 0
const DIMENSION_1D = 1
const DIMENSION_2D = 2
const FLAT_DEPTH = 2
const STEP = 1
const NOT_FOUND = -1

class MysticBoard {
  constructor (dimensions) {
    this.tiles = MysticBoard.buildBoard(dimensions)
    this.dimensions = dimensions

    // Find the blank (0) position in the shuffled board
    for (let row = 0; row < dimensions; row++) {
      for (let col = 0; col < dimensions; col++) {
        if (this.tiles[row][col] === BLANK_TILE) {
          this.zeroRow = row
          this.zeroCol = col
        }
      }
    }
  }

  static buildBoard (size) {
    const flat = MysticBoard.buildSolvedFlat(size)

    MysticBoard.shuffle(flat)

    if (!MysticBoard.isSolvable(flat, size)) {
      MysticBoard.fixParity(flat)
    }

    return MysticBoard.reshapeTo2D(flat, size)
  }

  static buildSolvedFlat (size) {
    const totalTiles = size * size
    const flat = []

    for (let idx = OFFSET_1; idx < totalTiles; idx++) {
      flat.push(idx)
    }
    flat.push(BLANK_TILE)

    return flat
  }

  static shuffle (flat) {
    for (let idx = flat.length - OFFSET_1; idx > BLANK_TILE; idx--) {
      const swapIdx = Math.floor(Math.random() * (idx + OFFSET_1))
      ;[flat[idx], flat[swapIdx]] = [flat[swapIdx], flat[idx]]
    }
  }

  static reshapeTo2D (flat, size) {
    const tiles = []
    for (let row = 0; row < size; row++) {
      tiles.push(flat.slice(row * size, (row + OFFSET_1) * size))
    }
    return tiles
  }

  static countInversions (flat) {
    let inversions = 0
    for (let idx = 0; idx < flat.length; idx++) {
      if (flat[idx] === BLANK_TILE) {
        // Skip blank tile — not counted in inversions
      } else {
        for (let cmp = idx + OFFSET_1; cmp < flat.length; cmp++) {
          if (flat[cmp] !== BLANK_TILE && flat[idx] > flat[cmp]) {
            inversions++
          }
        }
      }
    }
    return inversions
  }

  static isSolvable (flat, size) {
    const inversions = MysticBoard.countInversions(flat)
    const blankIndex = flat.indexOf(BLANK_TILE)
    const blankRowFromBottom = size - Math.floor(blankIndex / size)

    if (size % EVEN_DIVISOR !== ZERO_REMAINDER) {
      // Odd-width boards: solvable when inversion count is even
      return inversions % EVEN_DIVISOR === ZERO_REMAINDER
    }

    // Even-width boards: solvable when
    // (blank on odd row from bottom + even inversions) or
    // (blank on even row from bottom + odd inversions)
    if (blankRowFromBottom % EVEN_DIVISOR !== ZERO_REMAINDER) {
      return inversions % EVEN_DIVISOR === ZERO_REMAINDER
    }
    return inversions % EVEN_DIVISOR !== ZERO_REMAINDER
  }

  static fixParity (flat) {
    // Swap two adjacent non-blank tiles to flip inversion parity
    let first = NOT_FOUND
    let second = NOT_FOUND
    for (let idx = 0; idx < flat.length; idx++) {
      if (flat[idx] !== BLANK_TILE) {
        if (first < BLANK_TILE) {
          first = idx
        } else {
          second = idx
          break
        }
      }
    }
    ;[flat[first], flat[second]] = [flat[second], flat[first]]
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

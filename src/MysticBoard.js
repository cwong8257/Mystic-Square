class MysticBoard {
  constructor (dimensions) {
    this.tiles = MysticBoard.buildBoard(dimensions)
    this.dimensions = dimensions
    this.zeroRow = dimensions - 1
    this.zeroCol = dimensions - 1
  }

  static buildBoard (n) {
    const tiles = []

    for (let row = 0; row < n; row++) {
      tiles.push([])

      for (let col = 0; col < n; col++) {
        tiles[row][col] = n * n - 1 - col - row * n
      }
    }

    if (n % 2 === 0) {
      [tiles[n - 1][n - 2], tiles[n - 1][n - 3]] =
      [tiles[n - 1][n - 3], tiles[n - 1][n - 2]]
    }

    return tiles
  }

  checkWin () {
    const tiles = this.getTiles(1)

    for (let i = 0; i < this.dimensions ** 2 - 1; i++) {
      if (tiles[i] !== i + 1) return false
    }

    return true
  }

  getTiles (dimensions) {
    switch (dimensions) {
      case 1: return this.tiles.flat(2)
      case 2: return this.tiles
      default: return null
    }
  }

  moveDirection (direction) {
    let col = this.zeroCol
    let row = this.zeroRow

    switch (direction) {
      case 'ArrowUp': row += 1
        break
      case 'ArrowDown': row -= 1
        break
      case 'ArrowLeft': col += 1
        break
      case 'ArrowRight': col -= 1
        break
      default: return false
    }

    const tile = this._getTile(row, col)

    if (!tile) return false

    return this.moveTile(tile)
  }

  moveTile (tile) {
    const topOfZero = this._getTile(this.zeroRow - 1, this.zeroCol)
    const bottomOfZreo = this._getTile(this.zeroRow + 1, this.zeroCol)
    const leftOfZero = this._getTile(this.zeroRow, this.zeroCol - 1)
    const rightOfZero = this._getTile(this.zeroRow, this.zeroCol + 1)

    switch (tile) {
      case topOfZero: this._swap(this.zeroRow - 1, this.zeroCol)
        break
      case bottomOfZreo: this._swap(this.zeroRow + 1, this.zeroCol)
        break
      case leftOfZero: this._swap(this.zeroRow, this.zeroCol - 1)
        break
      case rightOfZero: this._swap(this.zeroRow, this.zeroCol + 1)
        break
      default: return false
    }

    return true
  }

  _swap (row, col) {
    [this.tiles[row][col], this.tiles[this.zeroRow][this.zeroCol]] =
    [this.tiles[this.zeroRow][this.zeroCol], this.tiles[row][col]]

    this.zeroRow = row
    this.zeroCol = col
  }

  _getTile (row, col) {
    return this.tiles[row] && this.tiles[row][col]
  }
}

export default MysticBoard

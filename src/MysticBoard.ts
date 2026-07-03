const OFFSET_1 = 1
const EVEN_DIVISOR = 2
const ZERO_REMAINDER = 0
const BLANK_TILE = 0
const DIMENSION_1D = 1
const DIMENSION_2D = 2
const FLAT_DEPTH = 2
const STEP = 1
const NOT_FOUND = -1

export interface MysticBoard {
  tiles: number[][]
  dimensions: number
  zeroRow: number
  zeroCol: number
}

const buildSolvedFlat = (size: number): number[] => {
  const totalTiles = size * size
  const flat: number[] = []

  for (let idx = OFFSET_1; idx < totalTiles; idx++) {
    flat.push(idx)
  }
  flat.push(BLANK_TILE)

  return flat
}

const shuffle = (flat: number[]): void => {
  for (let idx = flat.length - OFFSET_1; idx > BLANK_TILE; idx--) {
    const swapIdx = Math.floor(Math.random() * (idx + OFFSET_1))
    ;[flat[idx], flat[swapIdx]] = [flat[swapIdx], flat[idx]]
  }
}

const reshapeTo2D = (flat: number[], size: number): number[][] => {
  const tiles: number[][] = []
  for (let row = 0; row < size; row++) {
    tiles.push(flat.slice(row * size, (row + OFFSET_1) * size))
  }
  return tiles
}

const countInversions = (flat: number[]): number => {
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

const isSolvable = (flat: number[], size: number): boolean => {
  const inversions = countInversions(flat)
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

const fixParity = (flat: number[]): void => {
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

const buildBoard = (size: number): number[][] => {
  const flat = buildSolvedFlat(size)

  shuffle(flat)

  if (!isSolvable(flat, size)) {
    fixParity(flat)
  }

  return reshapeTo2D(flat, size)
}

const getTileAt = (board: MysticBoard, row: number, col: number): number | undefined =>
  board.tiles[row] && board.tiles[row][col]

const swapTiles = (board: MysticBoard, row: number, col: number): void => {
  [board.tiles[row][col], board.tiles[board.zeroRow][board.zeroCol]] =
  [board.tiles[board.zeroRow][board.zeroCol], board.tiles[row][col]]

  board.zeroRow = row
  board.zeroCol = col
}

export const createBoard = (dimensions: number): MysticBoard => {
  const tiles = buildBoard(dimensions)

  let zeroRow = 0
  let zeroCol = 0

  // Find the blank (0) position in the shuffled board
  for (let row = 0; row < dimensions; row++) {
    for (let col = 0; col < dimensions; col++) {
      if (tiles[row][col] === BLANK_TILE) {
        zeroRow = row
        zeroCol = col
      }
    }
  }

  return { dimensions, tiles, zeroCol, zeroRow }
}

export const checkWin = (board: MysticBoard): boolean => {
  const tiles = getTiles(board, DIMENSION_1D) as number[]

  for (let idx = 0; idx < board.dimensions ** DIMENSION_2D - OFFSET_1; idx++) {
    if (tiles[idx] !== idx + OFFSET_1) { return false }
  }

  return true
}

export const getTiles = (board: MysticBoard, dimensions: number): number[] | number[][] | null => {
  switch (dimensions) {
    case DIMENSION_1D: return board.tiles.flat(FLAT_DEPTH)
    case DIMENSION_2D: return board.tiles
    default: return null
  }
}

export const moveDirection = (board: MysticBoard, direction: string): boolean => {
  let col = board.zeroCol
  let row = board.zeroRow

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

  const tile = getTileAt(board, row, col)

  if (!tile) { return false }

  return moveTile(board, tile)
}

export const moveTile = (board: MysticBoard, tile: number): boolean => {
  const topOfZero = getTileAt(board, board.zeroRow - OFFSET_1, board.zeroCol)
  const bottomOfZero = getTileAt(board, board.zeroRow + OFFSET_1, board.zeroCol)
  const leftOfZero = getTileAt(board, board.zeroRow, board.zeroCol - OFFSET_1)
  const rightOfZero = getTileAt(board, board.zeroRow, board.zeroCol + OFFSET_1)

  switch (tile) {
    case topOfZero: swapTiles(board, board.zeroRow - OFFSET_1, board.zeroCol)
      break
    case bottomOfZero: swapTiles(board, board.zeroRow + OFFSET_1, board.zeroCol)
      break
    case leftOfZero: swapTiles(board, board.zeroRow, board.zeroCol - OFFSET_1)
      break
    case rightOfZero: swapTiles(board, board.zeroRow, board.zeroCol + OFFSET_1)
      break
    default: return false
  }

  return true
}

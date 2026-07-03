const STORAGE_KEY = 'mystic-square-photo'
const TILE_RENDER_SIZE = 200
const FIRST_TILE = 1
const CENTER_DIVISOR = 2
const ORIGIN = 0
const CROP_QUALITY = 0.9
const SLICE_QUALITY = 0.85

interface CropResult {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

interface TileRegion {
  img: HTMLImageElement
  srcX: number
  srcY: number
  srcSize: number
}

const createCanvas = (width: number, height: number): CropResult | null => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) { return null }

  return { canvas, ctx }
}

const computeCropOffsets = (img: HTMLImageElement) => {
  const size = Math.min(img.width, img.height)
  const offsetX = (img.width - size) / CENTER_DIVISOR
  const offsetY = (img.height - size) / CENTER_DIVISOR
  return { offsetX, offsetY, size }
}

const createSquareCrop = (img: HTMLImageElement): CropResult | null => {
  const { offsetX, offsetY, size } = computeCropOffsets(img)
  const result = createCanvas(size, size)
  if (!result) { return null }

  result.ctx.drawImage(img, offsetX, offsetY, size, size, ORIGIN, ORIGIN, size, size)
  return result
}

const renderTileToDataUrl = (region: TileRegion): string | null => {
  const result = createCanvas(TILE_RENDER_SIZE, TILE_RENDER_SIZE)
  if (!result) { return null }

  result.ctx.drawImage(
    region.img, region.srcX, region.srcY,
    region.srcSize, region.srcSize,
    ORIGIN, ORIGIN, TILE_RENDER_SIZE, TILE_RENDER_SIZE
  )
  return result.canvas.toDataURL('image/jpeg', SLICE_QUALITY)
}

const computeTilePosition = (idx: number, gridSize: number, tileSize: number) => {
  const row = Math.floor((idx - FIRST_TILE) / gridSize)
  const col = (idx - FIRST_TILE) % gridSize
  return { srcX: col * tileSize, srcY: row * tileSize }
}

const buildTileSlices = (img: HTMLImageElement, gridSize: number): string[] | null => {
  const tileSize = img.width / gridSize
  const totalTiles = gridSize * gridSize
  // Index 0 = blank tile
  const tiles: string[] = ['']

  for (let idx = FIRST_TILE; idx < totalTiles; idx++) {
    const { srcX, srcY } = computeTilePosition(idx, gridSize, tileSize)
    const dataUrl = renderTileToDataUrl({ img, srcSize: tileSize, srcX, srcY })

    if (!dataUrl) { return null }
    tiles.push(dataUrl)
  }

  return tiles
}

/**
 * Loads an image file and center-crops it to a square.
 * Returns a base64 data URL of the cropped image.
 */
export const loadAndCropImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const img = new Image()

      img.onload = () => {
        const result = createSquareCrop(img)
        if (!result) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        resolve(result.canvas.toDataURL('image/jpeg', CROP_QUALITY))
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = reader.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

/**
 * Slices a square image into gridSize×gridSize tile pieces.
 * Returns an array of data URLs indexed by tile number (1-based).
 * Index 0 is an empty string (represents the blank tile).
 */
export const sliceImage = (dataUrl: string, gridSize: number): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const tiles = buildTileSlices(img, gridSize)
      if (!tiles) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      resolve(tiles)
    }

    img.onerror = () => reject(new Error('Failed to load image for slicing'))
    img.src = dataUrl
  })

/**
 * Persists the cropped photo data URL to localStorage.
 */
export const saveImageToStorage = (dataUrl: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY, dataUrl)
  } catch {
    // Storage may be full or unavailable — fail silently
  }
}

/**
 * Loads the saved photo data URL from localStorage.
 */
export const loadImageFromStorage = (): string | null =>
  localStorage.getItem(STORAGE_KEY)

/**
 * Removes the saved photo from localStorage.
 */
export const removeImageFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

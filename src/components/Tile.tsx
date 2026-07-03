import { PuzzleMode } from '../types'
import React from 'react'
import classNames from 'classnames'

const EMPTY_TILE_VALUE = 0

const getStyle = (isPhoto: boolean | undefined, isEmpty: boolean, imageUrl?: string): React.CSSProperties | undefined => {
  if (isPhoto && !isEmpty && imageUrl) {
    return { backgroundImage: `url(${imageUrl})` }
  }
  return undefined
}

const getContent = (isPhoto: boolean | undefined, value: number): React.ReactNode => {
  if (isPhoto) { return null }
  return value
}

interface TileProps {
  value: number
  onClickTile?: (event: React.MouseEvent<HTMLDivElement>) => void
  imageUrl?: string
  mode?: PuzzleMode
}

const Tile: React.FC<TileProps> = ({ value, onClickTile, imageUrl, mode }) => {
  const isEmpty = value === EMPTY_TILE_VALUE
  const isPhoto = mode === 'photo' && Boolean(imageUrl)

  const tileClass = classNames('board__tile', {
    'board__tile--empty': isEmpty,
    'board__tile--photo': isPhoto && !isEmpty
  })

  return (
    <div
      className={tileClass}
      data-number={value}
      onClick={onClickTile}
      style={getStyle(isPhoto, isEmpty, imageUrl)}
    >
      {getContent(isPhoto, value)}
    </div>
  )
}

export default Tile

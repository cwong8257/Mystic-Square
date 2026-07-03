import { GameState, PuzzleMode } from '../types'
import React from 'react'
import Tile from './Tile'
import classNames from 'classnames'

const getTileImageUrl = (tileImages: string[] | null | undefined, tile: number): string | undefined => {
  if (tileImages) { return tileImages[tile] }
  return undefined
}

interface BoardProps {
  onClickTile?: (event: React.MouseEvent<HTMLDivElement>) => void
  onClickBoardOverlay?: (event: React.MouseEvent<HTMLDivElement>) => void
  tiles: number[]
  gameState: GameState
  mode?: PuzzleMode
  tileImages?: string[] | null
}

const Board: React.FC<BoardProps> = ({ onClickTile, onClickBoardOverlay, tiles, gameState, mode, tileImages }) => {
  const tileComponents = tiles
    .map((tile) => (
      <Tile
        key={tile}
        value={tile}
        onClickTile={onClickTile}
        mode={mode}
        imageUrl={getTileImageUrl(tileImages, tile)}
      />
    ))

  const overlayText: string = {
    finished: 'you won!',
    paused: 'play',
    playing: ''
  }[gameState]

  return (
    <div className="board">
      <div
        className={classNames('board__overlay', { hide: gameState === 'playing' })}
        onClick={onClickBoardOverlay}
      >{overlayText}</div>
      <div className="board__content">{tileComponents}</div>
    </div>
  )
}

export default Board

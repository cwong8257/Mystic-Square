import PropTypes from 'prop-types'
import React from 'react'
import Tile from './Tile'
import classNames from 'classnames'

const getTileImageUrl = (tileImages, tile) => {
  if (tileImages) { return tileImages[tile] }
  return undefined
}

const Board = ({ onClickTile, onClickBoardOverlay, tiles, gameState, mode, tileImages }) => {
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

  const overlayText = {
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

Board.propTypes = {
  gameState: PropTypes.string,
  mode: PropTypes.string,
  onClickBoardOverlay: PropTypes.func,
  onClickTile: PropTypes.func,
  tileImages: PropTypes.array,
  tiles: PropTypes.array
}

export default Board


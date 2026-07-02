import PropTypes from 'prop-types'
import React from 'react'
import Tile from './Tile'
import classNames from 'classnames'

const Board = ({ onClickTile, onClickBoardOverlay, tiles, gameState }) => {
  const tileComponents = tiles
    .map((tile) => (
      <Tile
        key={tile}
        value={tile}
        onClickTile={onClickTile}
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
  onClickBoardOverlay: PropTypes.func,
  onClickTile: PropTypes.func,
  tiles: PropTypes.array
}

export default Board

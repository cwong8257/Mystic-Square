import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Tile from './Tile'

function Board ({ handleOnClickTile, handleOnClickBoardOverlay, tiles, gameState }) {
  const tileComponents = tiles
    .map((tile) => (
      <Tile
        key={tile}
        value={tile}
        handleOnClickTile={handleOnClickTile}
      />
    ))

  const overlayText = {
    paused: 'play',
    finished: 'you won!',
    playing: ''
  }[gameState]

  return (
    <div className="board">
      <div
        className={classNames('board__overlay', { hide: gameState === 'playing' })}
        onClick={handleOnClickBoardOverlay}
      >{overlayText}</div>
      <div className="board__content">{tileComponents}</div>
    </div>
  )
}

Board.propTypes = {
  tiles: PropTypes.array,
  gameState: PropTypes.string,
  handleOnClickTile: PropTypes.func,
  handleOnClickBoardOverlay: PropTypes.func
}

export default Board

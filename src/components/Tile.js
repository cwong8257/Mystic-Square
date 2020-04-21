import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function Tile ({ value, handleOnClickTile }) {
  return (
    <div
      className={classNames('board__tile', { 'board__tile--empty': value === 0 })}
      data-number={value}
      onClick={handleOnClickTile}
    >
      {value}
    </div>
  )
}

Tile.propTypes = {
  value: PropTypes.number,
  handleOnClickTile: PropTypes.func
}

export default Tile

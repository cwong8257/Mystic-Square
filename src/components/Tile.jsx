import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

const EMPTY_TILE_VALUE = 0

const Tile = ({ value, onClickTile }) => (
  <div
    className={classNames('board__tile', { 'board__tile--empty': value === EMPTY_TILE_VALUE })}
    data-number={value}
    onClick={onClickTile}
  >
    {value}
  </div>
)

Tile.propTypes = {
  onClickTile: PropTypes.func,
  value: PropTypes.number
}

export default Tile

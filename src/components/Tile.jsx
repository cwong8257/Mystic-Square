import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

const EMPTY_TILE_VALUE = 0

const getStyle = (isPhoto, isEmpty, imageUrl) => {
  if (isPhoto && !isEmpty) {
    return { backgroundImage: `url(${imageUrl})` }
  }
  return undefined
}

const getContent = (isPhoto, value) => {
  if (isPhoto) { return null }
  return value
}

const Tile = ({ value, onClickTile, imageUrl, mode }) => {
  const isEmpty = value === EMPTY_TILE_VALUE
  const isPhoto = mode === 'photo' && imageUrl

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

Tile.propTypes = {
  imageUrl: PropTypes.string,
  mode: PropTypes.string,
  onClickTile: PropTypes.func,
  value: PropTypes.number
}

export default Tile

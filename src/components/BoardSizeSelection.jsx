import PropTypes from 'prop-types'
import React from 'react'

const MIN_BOARD_SIZE = 3
const MAX_BOARD_SIZE = 10

const BoardSizeSelection = ({ onChangeSize, size }) => {
  const options = []

  for (let sizeOption = MIN_BOARD_SIZE; sizeOption < MAX_BOARD_SIZE; sizeOption++) {
    options.push(<option value={sizeOption} key={sizeOption}>{sizeOption}</option>)
  }

  return (
    <div className="select">
      <p className="select__text">Select board size:</p>
      <select
        className="select__input"
        id="select"
        value={size}
        onChange={onChangeSize}
      >
        {options}
      </select>
    </div>
  )
}

BoardSizeSelection.propTypes = {
  onChangeSize: PropTypes.func,
  size: PropTypes.number
}

export default BoardSizeSelection

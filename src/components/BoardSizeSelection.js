import React from 'react'
import PropTypes from 'prop-types'

function BoardSizeSelection (props) {
  const options = []

  for (let i = 3; i < 10; i++) {
    options.push(<option value={i} key={i}>{i}</option>)
  }

  return (
    <div className="select">
      <p className="select__text">Select board size:</p>
      <select
        className="select__input"
        id="select"
        value={props.size}
        onChange={props.handleOnChangeSize}
      >
        {options}
      </select>
    </div>
  )
}

BoardSizeSelection.propTypes = {
  size: PropTypes.number,
  handleOnChangeSize: PropTypes.func
}

export default BoardSizeSelection

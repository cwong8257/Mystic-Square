import React from 'react'
import PropTypes from 'prop-types'

import timeString from '../utils/timeString'

function Header ({ moves, time, handleOnClickReset, handleOnClickPlay }) {
  const timerString = timeString(time)

  return (
    <header className="header">
      <h1 className="heading-1 header__title">Mystic Square</h1>
      <div className="moves">
        <p className="heading-3 moves__text">Moves</p>
        <span className="moves__count">{moves}</span>
      </div>
      <div className="time">
        <p className="heading-3 moves__text">Time</p>
        <span className="moves__count">{timerString}</span>
      </div>
      <button
        className="btn"
        onClick={handleOnClickPlay}
      >Play</button>
      <button
        className="btn"
        onClick={handleOnClickReset}
      >Reset</button>
    </header>
  )
}

Header.propTypes = {
  moves: PropTypes.number,
  time: PropTypes.number,
  handleOnClickReset: PropTypes.func,
  handleOnClickPlay: PropTypes.func
}

export default Header

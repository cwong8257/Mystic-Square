import React from 'react'
import PropTypes from 'prop-types'

import timeString from '../utils/timeString'

function Header ({ moves, time, handleOnClickReset, handleOnClickPlay }) {
  const timerString = timeString(time)

  return (
    <header className="header">
      <h1 className="header__logo">Mystic Square</h1>
      <div className="header__controls">
        <div className="moves">
          <p className="moves__title">Moves</p>
          <span className="moves__count">{moves}</span>
        </div>
        <div className="time">
          <p className="time__title">Time</p>
          <span className="time__count">{timerString}</span>
        </div>
        <button onClick={handleOnClickPlay}>Play</button>
        <button onClick={handleOnClickReset}>Reset</button>
      </div>

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

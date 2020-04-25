import React from 'react'
import PropTypes from 'prop-types'

import timeString from '../utils/timeString'

function Header ({ gameState, moves, time, handleOnClickReset, handlePause }) {
  const timerString = timeString(time)
  const pauseText = gameState === 'playing' ? 'Pause' : 'Play'

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
        <button onClick={handlePause}>{pauseText}</button>
        <button onClick={handleOnClickReset}>Reset</button>
      </div>
    </header>
  )
}

Header.propTypes = {
  gameState: PropTypes.string,
  moves: PropTypes.number,
  time: PropTypes.number,
  handleOnClickReset: PropTypes.func,
  handlePause: PropTypes.func
}

export default Header

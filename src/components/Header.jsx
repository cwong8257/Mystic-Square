import PropTypes from 'prop-types'
import React from 'react'

import timeString from '../utils/timeString'

const StatDisplay = ({ className, count, title }) => (
  <div className={className}>
    <p className={`${className}__title`}>{title}</p>
    <span className={`${className}__count`}>{count}</span>
  </div>
)

StatDisplay.propTypes = {
  className: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string
}

const HeaderControls = ({ moves, onClickPause, onClickReset, pauseText, timerString }) => (
  <div className="header__controls">
    <StatDisplay className="moves" count={moves} title="Moves" />
    <StatDisplay className="time" count={timerString} title="Time" />
    <button onClick={onClickPause}>{pauseText}</button>
    <button onClick={onClickReset}>Reset</button>
  </div>
)

HeaderControls.propTypes = {
  moves: PropTypes.number,
  onClickPause: PropTypes.func,
  onClickReset: PropTypes.func,
  pauseText: PropTypes.string,
  timerString: PropTypes.string
}

const Header = ({ gameState, moves, onClickPause, onClickReset, time }) => {
  const timerString = timeString(time)
  let pauseText = 'Play'
  if (gameState === 'playing') {
    pauseText = 'Pause'
  }

  return (
    <header className="header">
      <h1 className="header__logo">Mystic Square</h1>
      <HeaderControls
        moves={moves}
        onClickPause={onClickPause}
        onClickReset={onClickReset}
        pauseText={pauseText}
        timerString={timerString}
      />
    </header>
  )
}

Header.propTypes = {
  gameState: PropTypes.string,
  moves: PropTypes.number,
  onClickPause: PropTypes.func,
  onClickReset: PropTypes.func,
  time: PropTypes.number
}

export default Header

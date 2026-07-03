import { GameState } from '../types'
import React from 'react'
import timeString from '../utils/timeString'

interface StatDisplayProps {
  className?: string
  count?: number | string
  title?: string
}

const StatDisplay: React.FC<StatDisplayProps> = ({ className = '', count = '', title = '' }) => (
  <div className={className}>
    <p className={`${className}__title`}>{title}</p>
    <span className={`${className}__count`}>{count}</span>
  </div>
)

interface HeaderControlsProps {
  moves: number
  onClickPause: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClickReset: (event: React.MouseEvent<HTMLButtonElement>) => void
  pauseText: string
  timerString: string
}

const HeaderControls: React.FC<HeaderControlsProps> = ({
  moves,
  onClickPause,
  onClickReset,
  pauseText,
  timerString
}) => (
  <div className="header__controls">
    <StatDisplay className="moves" count={moves} title="Moves" />
    <StatDisplay className="time" count={timerString} title="Time" />
    <button onClick={onClickPause}>{pauseText}</button>
    <button onClick={onClickReset}>Reset</button>
  </div>
)

interface HeaderProps {
  gameState: GameState
  moves: number
  onClickPause: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClickReset: (event: React.MouseEvent<HTMLButtonElement>) => void
  time: number
}

const Header: React.FC<HeaderProps> = ({ gameState, moves, onClickPause, onClickReset, time }) => {
  const timerStr = timeString(time)
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
        timerString={timerStr}
      />
    </header>
  )
}

export default Header

import React from 'react'

import Board from './Board'
import BoardSizeSelection from './BoardSizeSelection'
import Header from './Header'
import Instructions from './Instructions'
import MysticBoard from '../MysticBoard'

let gameBoard = new MysticBoard(4)

class App extends React.Component {
  state = {
    tiles: gameBoard.getTiles(1),
    size: 4,
    moveCount: 0,
    gameState: 'paused', // ENUM: 'paused', 'playing', 'finished'
    timerId: null,
    time: 0
  }

  componentDidMount = () => {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      return this.handlePause()
    }

    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return

    e.preventDefault()

    if (!(this.state.gameState === 'playing' && gameBoard.moveDirection(e.key))) return

    this.setState((prevState) => ({
      moveCount: prevState.moveCount + 1,
      tiles: gameBoard.getTiles(1),
      ...gameBoard.checkWin() && {
        gameState: 'finished',
        timerId: clearInterval(prevState.timerId)
      }
    }))
  }

  handleOnClickTile = (e) => {
    const num = parseInt(e.target.dataset.number)

    if (!(this.state.gameState === 'playing' && gameBoard.moveTile(num))) return

    this.setState((prevState) => ({
      moveCount: prevState.moveCount + 1,
      tiles: gameBoard.getTiles(1),
      ...gameBoard.checkWin() && {
        gameState: 'finished',
        timerId: clearInterval(prevState.timerId)
      }
    }))
  }

  handleOnChangeSize = (e) => {
    const size = parseInt(e.target.value)

    clearInterval(this.state.timerId)
    gameBoard = new MysticBoard(size)
    document.documentElement.style.setProperty('--board-columns', size)

    this.setState({
      tiles: gameBoard.getTiles(1),
      size,
      moveCount: 0,
      time: 0,
      gameState: 'paused',
      timerId: null
    })
  }

  handleOnClickReset = () => {
    clearInterval(this.state.timerId)
    gameBoard = new MysticBoard(this.state.size)

    this.setState({
      tiles: gameBoard.getTiles(1),
      moveCount: 0,
      time: 0,
      gameState: 'paused',
      timerId: null
    })
  }

  handleOnClickPlay = () => {
    if (this.state.gameState === 'playing') return

    this.unpause()
  }

  handlePause = () => {
    switch (this.state.gameState) {
      case 'playing': return this.pause()
      case 'paused': return this.unpause()
    }

    this.setState({
      timerId: this.startTimer(),
      gameState: 'playing'
    })
  }

  unpause = () => {
    this.setState({
      timerId: this.startTimer(),
      gameState: 'playing'
    })
  }

  pause = () => {
    clearInterval(this.state.timerId)

    this.setState({
      gameState: 'paused'
    })
  }

  handleOnClickBoardOverlay = () => {
    if (this.state.gameState === 'finished') {
      return this.handleOnClickReset()
    }

    this.handleOnClickPlay()
  }

  startTimer = () => {
    return setInterval(() => {
      this.setState((prevState) => ({ time: prevState.time + 1 }))
    }, 1000)
  }

  render = () => {
    return (
      <div className="container">
        <Header
          gameState={this.state.gameState}
          time={this.state.time}
          moves={this.state.moveCount}
          handleOnClickReset={this.handleOnClickReset}
          handlePause={this.handlePause}
        />
        <Board
          tiles={this.state.tiles}
          gameState={this.state.gameState}
          handleOnClickTile={this.handleOnClickTile}
          handleOnClickBoardOverlay={this.handleOnClickBoardOverlay}
        />
        <BoardSizeSelection
          size={this.state.size}
          handleOnChangeSize={this.handleOnChangeSize}
        />
        <Instructions />
      </div>
    )
  }
}

export default App

import Board from './board'
import { updateTimeDOM } from './views'

class Game {
  constructor () {
    this.board = null
    this.moveCount = 0
    // Enum: 'reset', 'paused', 'playing', 'finished'
    this.status = 'reset'
    this.time = 0
    this.timer = null
  }

  isWon () {
    const { board } = this
    const { dimensions } = board

    for (let i = 0; i < dimensions; i++) {
      for (let j = 0; j < dimensions; j++) {
        if (board.tiles[i][j].value !== board.winningBoard[i][j]) {
          return false
        }
      }
    }
    return true
  }

  move (direction) {
    if (this.status === 'finished') {
      return
    }

    const didMove = this.board.move(direction)

    if (didMove) {
      this.moveCount++
    }

    if (this.isWon()) {
      this.status = 'finished'
      clearInterval(this.timer)
    }
  }

  start (dimensions) {
    this.board = new Board(dimensions)
    this.status = 'playing'
    this.timer = setInterval(() => {
      if (this.status === 'playing') {
        this.time++
        updateTimeDOM(this.time)
      }
    }, 1000)
  }

  pause () {
    this.status = 'paused'
  }

  unpause () {
    this.status = 'playing'
  }

  reset () {
    this.board = null
    this.moveCount = 0
    this.status = 'reset'
    this.time = 0
    clearInterval(this.timer)
  }
}
export { Game as default }

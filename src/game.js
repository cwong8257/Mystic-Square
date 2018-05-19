import Board from './board';

class Game {
  constructor(dimensions) {
    this.board = new Board(dimensions);
    this.moveCount = 0;
    this.status = 'playing';
  }

  isWon() {
    const { board } = this;
    const { dimensions } = board;

    for (let i = 0; i < dimensions; i++) {
      for (let j = 0; j < dimensions; j++) {
        if (board.tiles[i][j].value != board.winningBoard[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  move(direction) {
    if (this.status === 'finished') {
      return;
    }

    this.board.move(direction) && this.moveCount++;

    if (this.isWon()) {
      this.status = 'finished';
    }
  }

  reset(dimensions) {
    this.board = new Board(dimensions);
    this.moveCount = 0;
    this.status = 'playing';
  }
}
export { Game as default };

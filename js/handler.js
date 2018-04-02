var handler = (function() {
  function clickMove(event) {
    let position = util.getMousePosition(event);
    let x = position.x;
    let y = position.y;
    let currentTile = board.getTile(x, y);
    let zeroTile = board.getZeroTile();

    if (board.canMove(currentTile, zeroTile)) {
      board.switchTile(currentTile, zeroTile);
      moveCount.incrementMoveCount();
      view.clearBoard();
      view.buildBoard();

      if (game.checkWin()) {
        game.won();
      }
    }
  }

  function keyMove(event) {
    if (event.defaultPrevented) {
      return;
    }
    let zeroTile = board.getZeroTile();

    switch (event.key) {
      case 'ArrowDown':
        if (zeroTile.row - 1 >= 0) {
          let currentTile = board.tileMap[zeroTile.row - 1][zeroTile.col];
          board.switchTile(currentTile, zeroTile);
          moveCount.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          if (game.checkWin()) {
            game.won();
          }
        }
        break;
      case 'ArrowUp':
        if (zeroTile.row + 1 < dimension) {
          let currentTile = board.tileMap[zeroTile.row + 1][zeroTile.col];
          board.switchTile(currentTile, zeroTile);
          moveCount.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          if (game.checkWin()) {
            game.won();
          }
        }
        break;
      case 'ArrowLeft':
        if (zeroTile.col + 1 < dimension) {
          let currentTile = board.tileMap[zeroTile.row][zeroTile.col + 1];
          board.switchTile(currentTile, zeroTile);
          moveCount.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          if (game.checkWin()) {
            game.won();
          }
        }
        break;
      case 'ArrowRight':
        if (zeroTile.col - 1 >= 0) {
          let currentTile = board.tileMap[zeroTile.row][zeroTile.col - 1];
          board.switchTile(currentTile, zeroTile);
          moveCount.incrementMoveCount();
          view.clearBoard();
          view.buildBoard();
          if (game.checkWin()) {
            game.won();
          }
        }
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function playAgain(event) {
    let width = 230;
    let height = 50;

    game.playAgain(event, width, height);
  }

  function clickPlay(event) {
    game.startGame();
  }

  return {
    clickMove: clickMove,
    keyMove: keyMove,
    playAgain: playAgain,
    clickPlay: clickPlay
  };
})();

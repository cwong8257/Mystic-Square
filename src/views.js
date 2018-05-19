import Game from './game';

const render = game => {
  const { moveCount } = game;

  generateBoardDOM(game);
  generateMoveCountDOM(moveCount);
};

const generateBoardDOM = game => {
  const boardEl = document.querySelector('#board');
  const { board } = game;
  const tiles = board.getTiles();
  boardEl.innerHTML = '';

  for (let i = 0; i < board.dimensions; i++) {
    const rowEl = document.createElement('div');

    for (let j = 0; j < board.dimensions; j++) {
      const tileEl = document.createElement('div');
      const { value } = tiles[i][j];

      tileEl.classList.add('tile');
      tileEl.innerText = value;

      if (value === 0) {
        tileEl.classList.add('empty');
      } else {
        tileEl.addEventListener('click', e => {
          const currentTile = tiles[i][j];

          if (board.canMove(currentTile)) {
            game.move(board.canMove(currentTile));
            render(game);
          }
        });
      }
      rowEl.appendChild(tileEl);
    }
    boardEl.appendChild(rowEl);
  }
};

const generateMoveCountDOM = moveCount => {
  document.querySelector('#move-count').innerText = moveCount;
};

export { render };

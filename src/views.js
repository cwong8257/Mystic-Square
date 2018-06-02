const generateBoardDOM = game => {
  const boardEl = document.querySelector('#board');
  const { board } = game;
  const { dimensions } = board;
  const tiles = board.getTiles();

  boardEl.innerHTML = '';

  for (let i = 0; i < dimensions; i++) {
    for (let j = 0; j < dimensions; j++) {
      const tileEl = document.createElement('div');
      const { value } = tiles[i][j];
      const percentage = 100 / dimensions;

      tileEl.classList.add('tile');
      tileEl.style.height = `${percentage}%`;
      tileEl.style.width = `${percentage}%`;
      tileEl.style.fontSize = `${percentage / 8}rem`;
      tileEl.innerText = value;
      boardEl.appendChild(tileEl);

      if (value === 0) {
        tileEl.classList.add('empty');
      } else {
        tileEl.addEventListener('click', () => {
          const currentTile = tiles[i][j];

          if (board.canMove(currentTile)) {
            game.move(board.canMove(currentTile));
            render(game);
          }
        });
      }
    }
  }
};

const generateMoveCountDOM = moveCount => {
  document.querySelector('#move-count').innerText = moveCount;
};

const render = game => {
  const { moveCount } = game;

  generateBoardDOM(game);
  generateMoveCountDOM(moveCount);
};

export { render as default };

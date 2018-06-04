import { leftPad } from './util';

const generateBoardDOM = game => {
  const boardContentEl = document.querySelector('#board__content');
  const { board } = game;

  boardContentEl.innerHTML = '';

  if (board) {
    const { dimensions } = board;
    const tiles = board.getTiles();

    for (let i = 0; i < dimensions; i++) {
      for (let j = 0; j < dimensions; j++) {
        const tileEl = document.createElement('div');
        const { value } = tiles[i][j];
        const percentage = 100 / dimensions;

        tileEl.classList.add('board__tile');
        tileEl.style.height = `${percentage}%`;
        tileEl.style.width = `${percentage}%`;
        tileEl.style.fontSize = `${percentage / 8}rem`;
        tileEl.innerText = value;
        boardContentEl.appendChild(tileEl);

        if (value === 0) {
          tileEl.classList.add('board__tile--empty');
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
  }
};

const updateMoveCountDOM = moveCount => {
  document.querySelector('#moves__count').innerText = moveCount;
};

const updateTimeDOM = time => {
  const minutes = Math.floor(time / 60).toString();
  const seconds = (time % 60).toString();
  const paddedMinutes = leftPad(minutes);
  const paddedSeconds = leftPad(seconds);
  const result = `${paddedMinutes}:${paddedSeconds}`;

  document.querySelector('#time__count').innerText = result;
};

const render = game => {
  const { moveCount, time } = game;

  generateBoardDOM(game);
  updateMoveCountDOM(moveCount);
  updateTimeDOM(time);
};

export { updateTimeDOM, render as default };

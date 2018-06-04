import Game from './game';
import render from './views';

import './styles/main.scss';

const game = new Game();
render(game);

const resetEl = document.querySelector('#reset-button');
const playEl = document.querySelector('#play-button');
const selectEl = document.querySelector('#select');
const boardOverlayEl = document.querySelector('#board__overlay');
const movesEl = document.querySelector('#moves');
const timeEl = document.querySelector('#time');

const handleTogglePlay = () => {
  const { status } = game;

  if (status === 'reset') {
    game.start(selectEl.value);
    playEl.innerText = 'pause';
    boardOverlayEl.style.display = 'none';
  } else if (status === 'playing') {
    game.pause();
    boardOverlayEl.style.display = 'flex';
    playEl.innerText = 'play';
  } else if (status === 'paused') {
    game.unpause();
    boardOverlayEl.style.display = 'none';
    playEl.innerText = 'pause';
  }

  render(game);
};

const handleResetGame = () => {
  game.reset(selectEl.value);
  playEl.innerText = 'play';
  boardOverlayEl.style.display = 'flex';
  render(game);
};

const handleSizeSelect = e => {
  game.reset(e.target.value);
  playEl.innerText = 'play';
  boardOverlayEl.style.display = 'flex';
  render(game);
};

const handleArrowKeys = e => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      game.move('up');
      break;
    case 'ArrowDown':
      e.preventDefault();
      game.move('down');
      break;
    case 'ArrowLeft':
      e.preventDefault();
      game.move('left');
      break;
    case 'ArrowRight':
      e.preventDefault();
      game.move('right');
      break;
    default:
      break;
  }

  if (game.status === 'finished') {
    movesEl.classList.add('flash');
    timeEl.classList.add('flash');
  }

  render(game);
};

window.addEventListener('keydown', handleArrowKeys);
resetEl.addEventListener('click', handleResetGame);
playEl.addEventListener('click', handleTogglePlay);
selectEl.addEventListener('change', handleSizeSelect);
boardOverlayEl.addEventListener('click', handleTogglePlay);

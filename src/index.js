import Game from './game';
import { render } from './views';

let game = new Game(4);
render(game);

document.addEventListener('keyup', e => {
  switch (e.key) {
    case 'ArrowUp':
      game.move('up');
      break;
    case 'ArrowDown':
      game.move('down');
      break;
    case 'ArrowLeft':
      game.move('left');
      break;
    case 'ArrowRight':
      game.move('right');
      break;
    default:
      break;
  }
  render(game);
});

const selectEl = document.querySelector('#select');
const resetEl = document.querySelector('#reset');

selectEl.addEventListener('change', e => {
  game = new Game(e.target.value);
  render(game);
});

resetEl.addEventListener('click', e => {
  game = new Game(selectEl.value);
  render(game);
});

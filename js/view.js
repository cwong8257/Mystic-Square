var view = (function() {
  function init() {
    canvas.width = dimension * TILE_LENGTH;
    canvas.height = dimension * TILE_LENGTH;
    ctx.globalAlpha = BOARD_OPACITY;
    ctx.fillStyle = BOARD_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Courier New";
    ctx.fillStyle = 'white';
    ctx.textAlign = "center"; 
    ctx.fillText("Play", canvas.width / 2, canvas.height / 2);

    buildLeaderBoard();
  }

  function drawTile(pos, map, i, j) {
    ctx.globalAlpha = TILE_OPACITY;
    ctx.fillStyle = TILE_COLOR;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.fillRect(pos.x + 5, pos.y + 5, TILE_LENGTH * 0.9, TILE_LENGTH * 0.9);
    ctx.fillStyle = 'white';
    ctx.font = "20px Verdana";
    ctx.fillText(map[i][j], pos.textx + 5, pos.texty);
  }

  function buildBoard() {
    let map = board.tiles;
    let tileMap = board.tileMap;
    let pos = {
      x: 0,
      y: 0,
      textx: (TILE_LENGTH / 2) - 5,
      texty: (TILE_LENGTH / 2) + 5
    };
    for (let i = 0; i < map.length; i++) {
      tileMap[i] = [];

      for (let j = 0; j < map[i].length; j++) {
        let currentTile = {
          tileName: map[i][j],
          x: pos.x,
          y: pos.y,
          row: i,
          col: j
        };
        if (map[i][j] !== 0) {
          this.drawTile(pos, map, i, j);
        }
        tileMap[i].push(currentTile);
        pos.x += TILE_LENGTH;
        pos.textx += TILE_LENGTH;
      }
      pos.x = 0;
      pos.y += TILE_LENGTH;
      pos.textx = (TILE_LENGTH / 2) - 5;
      pos.texty += TILE_LENGTH; 
    }
  }

  function clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = BOARD_OPACITY;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = BOARD_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function buildLeaderBoard() {
    clearLeaderBoard();

    let tableBody = leaderBoardTable.getElementsByTagName('tbody')[0];
    let scores = leaderBoard.getLeaderBoard();

    if (!scores) {
      return;
    }

    let filteredResult = scores.filter(score => score.size === dimension);

    filteredResult.forEach(score => {
      let row = tableBody.insertRow();
      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);
      
      row.classList.add("item");
      cell1.innerHTML = score.size;
      cell2.innerHTML = score.moveCount;
      cell3.innerHTML = score.time;
    })
  }

  function clearLeaderBoard() {
    let oldTableBody = leaderBoardTable.getElementsByTagName('tbody')[0];
    let newTableBody = document.createElement('tbody');
    oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
  }

  function drawWin() {
    let width = 230;
    let height = 50;

    view.clearBoard();
    ctx.font = '40px Courier New';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center'; 
    ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2);
    ctx.strokeRect((canvas.width - width) / 2, (canvas.height - height) / 1.3, width, height);
    ctx.fillRect((canvas.width - width) / 2, (canvas.height - height) / 1.3, width, height);
    ctx.font = '30px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText("Play again", canvas.width / 2, canvas.height / 1.3);

    view.setUpPlayAgainListener(width, height);
  }

  function resetMoveCount() {
    moveCounter.innerText = 0;
  }

  function setMoveCount(moveCount) {
    moveCounter.innerText = moveCount;
  }

  function resetTimer() {
    minutesLabel.innerHTML = "00";
    secondsLabel.innerHTML = "00";
  }

  function setTimer(seconds) {
    secondsLabel.innerHTML = util.padding(seconds % 60);
    minutesLabel.innerHTML = util.padding(parseInt(seconds / 60));
  }

  function highlightStats() {
    moveCountDiv.style.animationName = "example";
    timerDiv.style.animationName = "example";
  }

  function unHighlightStats() {
    moveCountDiv.style.animationName = "";
    timerDiv.style.animationName = "";
  }

  function setUpGameEventListeners() {
    canvas.addEventListener("mousedown", handler.clickMove);
    document.addEventListener("keydown", handler.keyMove);
  }

  function removeGameEventListeners() {
    canvas.removeEventListener("mousedown", handler.clickMove);
    document.removeEventListener("keydown", handler.keyMove);
  }

  function setUpPlayAgainListener() {
    canvas.addEventListener("mousedown", handler.playAgain);
  }

  function removePlayAgainListener() {
    canvas.removeEventListener("mousedown", handler.playAgain);
  }

  function setUpClickPlayListener() {
    canvas.addEventListener("mousedown", handler.clickPlay);
  }

  function removeClickPlayListener() {
    canvas.removeEventListener("mousedown", handler.clickPlay);
  }

  return {
    init: init,
    drawTile: drawTile,
    buildBoard: buildBoard,
    clearBoard: clearBoard,
    drawWin: drawWin,
    resetMoveCount: resetMoveCount,
    setMoveCount: setMoveCount,
    resetTimer: resetTimer,
    setTimer: setTimer,
    buildLeaderBoard: buildLeaderBoard,
    highlightStats: highlightStats,
    unHighlightStats: unHighlightStats,
    setUpGameEventListeners: setUpGameEventListeners,
    removeGameEventListeners: removeGameEventListeners,
    setUpPlayAgainListener: setUpPlayAgainListener,
    removePlayAgainListener: removePlayAgainListener,
    setUpClickPlayListener: setUpClickPlayListener,
    removeClickPlayListener: removeClickPlayListener
  };
})();

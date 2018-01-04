var leaderBoard = (function() {
  var d = new Date();

  function addToLeaderBoard(size, moveCount, time) {
    let oldItems = JSON.parse(localStorage.getItem('msLeaderBoard')) || [];

    let newItem = {
      size: size,
      moveCount: moveCount,
      time: time
    }
    oldItems.push(newItem);

    localStorage.setItem('msLeaderBoard', JSON.stringify(oldItems));
  }

  function getLeaderBoard() {
    return JSON.parse(localStorage.getItem('msLeaderBoard')) || false;
  }

  return {
    addToLeaderBoard: addToLeaderBoard,
    getLeaderBoard: getLeaderBoard
  };
})();
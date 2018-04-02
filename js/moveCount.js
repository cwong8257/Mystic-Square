var moveCount = (function() {
  var moveCount = 0;

  function getMoveCount() {
    return moveCount;
  }

  function resetMoveCount() {
    moveCount = 0;
    view.resetMoveCount();
  }

  function incrementMoveCount() {
    moveCount++;
    view.setMoveCount(moveCount);
  }

  return {
    getMoveCount: getMoveCount,
    resetMoveCount: resetMoveCount,
    incrementMoveCount: incrementMoveCount
  };
})();

var moveCount = (function() {
  var moveCount = 0;

  function resetMoveCount() {
    moveCount = 0;
    view.resetMoveCount();
  }

  function incrementMoveCount() {
    moveCount++;
    view.setMoveCount(moveCount);
  }

  return {
    resetMoveCount: resetMoveCount,
    incrementMoveCount: incrementMoveCount
  }
})();
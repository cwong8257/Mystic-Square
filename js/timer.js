var timer = (function() {
  var seconds = 0;

  function getSeconds() {
    return seconds;
  }

  function startTimer() {
    timer.stopTimer();
    timer.resetTimer();
    timer.timer = setInterval(timer.setTimer, 1000);
  }

  function setTimer() {
    seconds++;
    view.setTimer(seconds);
  }

  function resetTimer() {
    seconds = 0;
    view.resetTimer();
  }

  function stopTimer() {
    clearInterval(timer.timer);
  }

  return {
    getSeconds: getSeconds,
    startTimer: startTimer,
    setTimer: setTimer,
    resetTimer: resetTimer,
    stopTimer: stopTimer
  };
})();
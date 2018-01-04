var util = (function() {
  function getMousePosition(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    return {
      x: x,
      y: y
    };
  }

  function getInversionCount(tiles) {
    let count = 0;
    for (let i = 0; i < dimension * dimension - 1; i++) {
      for (let j = i + 1; j < dimension * dimension; j++) {
        if (arr[j] && arr[i] && arr[i] > arr[j])
          count++;
      }
    }
    return count;
  }

  function padding(val) {
    let valString = val + "";

    if (valString.length < 2) {
      return "0" + valString;
    }
    else {
      return valString;
    }
  }


  return {
    getMousePosition: getMousePosition,
    getInversionCount: getInversionCount,
    padding: padding
  };
})();

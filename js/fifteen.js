var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");

const tile = {
  width: 100,
  height: 100
}

var board = {
  tiles: [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,0]
  ],
  tileMap: [],

};

var view = {
  init: function() {
    canvas.width = 400;
    canvas.height = 400;
  },
  drawTile: function(pos) {

    ctx.fillStyle = '#EB5E55';
    ctx.fillRect(pos.x + 5, pos.y + 5, tile.width - 10, tile.height - 10);
    ctx.font = "20px Arial";

  },
  buildBoard: function() {
    var map = board.tiles;
    var tileMap = board.tileMap;
    var pos = {
      x: 0,
      y: 0,
      textx: 45,
      texty: 55
    }

    for (i = 0; i < map.length; i++) {

      tileMap[i] = [];

      for (j = 0; j < map[i].length; j++) {
        var currentTile = {
          tileName: map[i][j],
          x: pos.x,
          y: pos.y,
          width: 100,
          height: 100,
          tileIndex: j
        };

        if (map[i][j] !== 0) {

          this.drawTile(pos, map);

          tileMap[i].push(currentTile);

        }
        else {

          tileMap[i].push(currentTile);
        }
        pos.x += 100;
        pos.textx += 100;

      }
      pos.x = 0;
      pos.y += 100;
      pos.textx = 45;
      pos.texty += 100; 
    }
  }
};

view.init();
view.buildBoard();

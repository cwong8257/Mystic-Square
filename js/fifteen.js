var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");

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
  pos: {
    x: 0,
    y: 0,
    textx: 45,
    texty: 55
  },
  tile : {
    width: 100,
    height: 100
  },
  init: function() {
    canvas.width = 400;
    canvas.height = 400;
  },
  drawTile: function() {
    var pos = board.pos;

    ctx.fillStyle = '#EB5E55';
    ctx.fillRect(this.pos.x + 5, this.pos.y + 5, this.tile.width - 10, this.tile.height - 10);

  },
  buildBoard: function(){
    var map = board.tiles;
    var tileMap = board.tileMap;

    for (i = 0; i < map.length; i++) {

      tileMap[i] = [];

      for (j = 0; j < map[i].length; j++) {
        var currentTile = {
            tileName: map[i][j],
            x: this.pos.x,
            y: this.pos.y,
            width: 100,
            height: 100,
            tileIndex: j
          };

        if (map[i][j] !== 0) {

          this.drawTile();

          tileMap[i].push(currentTile);

        }
        else {

          tileMap[i].push(currentTile);
        }
        this.pos.x += 100;
      }
      this.pos.x = 0;
      this.pos.y += 100;
    }
  }
};

view.init();
view.buildBoard();

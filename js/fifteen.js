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
  moveTile: function(event) {
    let x = util.getPosition(event).x;
    let y = util.getPosition(event).y;

    board.getTile(x, y);
  },
  getTile: function(x, y) {
    let tileMap = this.tileMap;
    let tile = view.tile;

    for (let i = 0; i < tileMap.length; i++) {
      for ( let j = 0; j < tileMap[i].length; j++) {
        if(y > tileMap[i][j].y && y < tileMap[i][j].y + tile.height &&
          x > tileMap[i][j].x && x < tileMap[i][j].x + tile.width) {
            console.log(tileMap[i][j].tileName, tileMap[i][j].tileIndex);
        }
      }
    }
  }
};

var handlers = {

}

var view = {
  tile: {
    width: 100,
    height: 100
  },
  init: function() {
    canvas.width = 400;
    canvas.height = 400;
    ctx.fillStyle = '#00000';
    ctx.fillRect(0, 0, 400, 400);
  },
  drawTile: function(pos, map, i, j) {
    ctx.fillStyle = '#48d1cc';
    ctx.fillRect(pos.x + 5, pos.y + 5, this.tile.width - 10, this.tile.height - 10);
    ctx.fillStyle = '#ffffff';
    ctx.font = "20px Verdana";
    if (map[i][j] >= 10) {
      ctx.fillText(map[i][j], pos.textx - 5 , pos.texty);
    }
    else {
      ctx.fillText(map[i][j], pos.textx, pos.texty);
    }
  },
  buildBoard: function() {
    let map = board.tiles;
    let tileMap = board.tileMap;
    let pos = {
      x: 0,
      y: 0,
      textx: 45,
      texty: 55
    }

    for (let i = 0; i < map.length; i++) {
      tileMap[i] = [];

      for (let j = 0; j < map[i].length; j++) {
        let currentTile = {
          tileName: map[i][j],
          x: pos.x,
          y: pos.y,
          tileIndex: j
        };

        if (map[i][j] !== 0) {
          this.drawTile(pos, map, i, j);
        }
        tileMap[i].push(currentTile);
        pos.x += 100;
        pos.textx += 100;
      }
      pos.x = 0;
      pos.y += 100;
      pos.textx = 45;
      pos.texty += 100; 
    }
  },
  setUpEventListeners: function() {
    canvas.addEventListener("mousedown", board.moveTile);
  }
};

var util = {
  getPosition: function (event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    return {
      x: x,
      y: y
    };
  },


    
}

document.addEventListener('DOMContentLoaded', function() {
  view.init();
  view.buildBoard();
  view.setUpEventListeners();
});

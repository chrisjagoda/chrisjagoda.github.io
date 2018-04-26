import { GameOfLife, Colors } from './gameOfLife';

var canvas = document.getElementById("life");
var cell_width: number = 4;
var cell_height: number = 4;
var canvas_width: number = 300;
var canvas_height: number = 200;
var frequency: number = 0.1;
var colors: Colors = <Colors>{red: Math.random() < 0.5, green: Math.random() < 0.5, blue: Math.random() < 0.5};
var running: boolean = false;
var cells: number[][];
var game: GameOfLife;

function genCells(cell_size_x: number, cell_size_y: number, canvas_width?: number, canvas_height?: number, frequency?: number): number[][] {
  var width: number = canvas_width ||
                      window.innerWidth ||
                      document.documentElement.clientWidth ||
                      document.body.clientWidth;
  var height: number =  canvas_height ||
                        window.innerHeight ||
                        document.documentElement.clientHeight ||
                        document.body.clientHeight;
  var num_cells_x: number = Math.floor(width/cell_size_x);
  var num_cells_y: number = Math.floor(height/cell_size_y);
  var cells: number[][] = [];
  var live_frequency = frequency || .10; // default 1 in 10 alive
  // create cells, 0 - dead, 1 - alive
  for (var i = 0; i < num_cells_y; i++) {
    cells.push([]);
    for (var j = 0; j < num_cells_x; j++) {
      cells[i].push((Math.random() <= live_frequency) ? 1: 0);
    }      
  }
  return cells;
}

function createNewGame() {
  cells = genCells(cell_width, cell_height, canvas_width, canvas_height, frequency);
  game = new GameOfLife(cells, cell_width, cell_height, "life", colors);
}

function startGame() {
  game.interval = setInterval(function () { game.step(); }, 100);
  running = true;
}

function stopGame() {
  clearInterval(game.interval);
  game.interval = 0;
  running = false;
}

function resetGame() {
  stopGame();
  colors = { red: Math.random() < 0.5, green: Math.random() < 0.5, blue: Math.random() < 0.5 };
  createNewGame();
}

canvas.addEventListener("click", function () {
  if (!running)
      startGame();
  else
      stopGame();
});

canvas.addEventListener("dblclick", function () {
  resetGame();
});

createNewGame();
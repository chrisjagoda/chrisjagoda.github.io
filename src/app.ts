import { GameOfLife, Colors } from './gameOfLife';

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

document.getElementById("start").addEventListener("click", e => createNewGame());
document.getElementById("red").addEventListener("change", e => toggleColor("red"));
document.getElementById("green").addEventListener("change", e => toggleColor("green"));
document.getElementById("blue").addEventListener("change", e => toggleColor("blue"));
document.getElementById("evolve").addEventListener("click", e => toggleEvolve());

var cell_width: number = 3;
var cell_height: number = 3;
var canvas_width: number = null;
var canvas_height: number = 250;
var frequency: number = 0.1;
var colors: Colors = <Colors>{red: true, green: true, blue: true};

var cells: number[][];
var game: GameOfLife;

function createNewGame() {
  cells = genCells(cell_width, cell_height, canvas_width, canvas_height, frequency);
  game = new GameOfLife(cells, cell_width, cell_height, "life", colors);
  game.interval = setInterval(function () { game.step(); }, 100);
}

function toggleColor(color: string) {
  colors[color] = !colors[color];
}

function toggleEvolve() {
  game.evolved = !game.evolved;
}

createNewGame();
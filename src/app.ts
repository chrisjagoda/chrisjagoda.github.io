import { GameDisplay } from './GameDisplay';
import { GameOfLife, GameOfLifeBase, GameOfLifeMandala1, GameOfLifeMandala2 } from './GameOfLife';
import { Colors } from './types';

var base = document.getElementById("base");
var mandala = document.getElementById("mandala");
var cell_width: number = 4;
var cell_height: number = 4;
var canvas_width: number = 256;
var canvas_height: number = 256;
var frequency: number = 0.2;
var alpha: number = 0.5;
var colors: Colors = <Colors>{red: Math.random() < 0.5, green: Math.random() < 0.5, blue: Math.random() < 0.5};
var running1: boolean = false;
var running2: boolean = false;
var cells: number[][];
var game1: GameOfLifeBase;
var game2: GameOfLifeMandala1;

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

function createNewGame(type: string) {
  cells = genCells(cell_width, cell_height, canvas_width, canvas_height, frequency);
  let display: GameDisplay;
  switch(type) {
    case 'base':
      display = new GameDisplay(type, cells.length, cells[0].length, cell_width, cell_width, alpha);
      game1 = new GameOfLifeBase(display, cells, cell_width, cell_height, colors);
      break;
    case 'mandala':
      display = new GameDisplay(type, cells.length, cells[0].length, cell_width, cell_width, alpha);
      game2 = new GameOfLifeMandala1(display, cells, cell_width, cell_height, colors);
      break;
    default:
      display = new GameDisplay(type, cells.length, cells[0].length, cell_width, cell_width, alpha);
      game1 = new GameOfLifeBase(display, cells, cell_width, cell_height, colors);
  }
}

function startGame(type: string) {
  switch(type) {
    case 'base':
      game1.interval = setInterval(function () { game1.step(); }, 100);
      running1 = true;
    case 'mandala':
      game2.interval = setInterval(function () { game2.step(); }, 100);
      running2 = true;
    default:
      game1.interval = setInterval(function () { game1.step(); }, 100);
      running1 = true;
  }
}

function stopGame(type: string) {
  switch(type) {
    case 'base':      
      clearInterval(game1.interval);
      game1.interval = 0;
      running1 = false;
    case 'mandala':
      clearInterval(game2.interval);
      game2.interval = 0;
      running2 = false;
    default:
      clearInterval(game1.interval);
      game1.interval = 0;
      running1 = false;
  }
}

function resetGame(type: string) {
  colors = { red: Math.random() < 0.5, green: Math.random() < 0.5, blue: Math.random() < 0.5 };
  stopGame(type);
  createNewGame(type);
}

base.addEventListener("click", function () {
  if (!running1)
      startGame('base');
  else
      stopGame('base');
});

base.addEventListener("dblclick", function () {
  resetGame('base');
});

mandala.addEventListener("click", function () {
  if (!running2)
      startGame('mandala');
  else
      stopGame('mandala');
});

mandala.addEventListener("dblclick", function () {
  resetGame('mandala');
});

createNewGame('base');
createNewGame('mandala');
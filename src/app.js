"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameOfLife_1 = require("./gameOfLife");
function genCells(cell_size_x, cell_size_y, canvas_width, canvas_height, frequency) {
    var width = canvas_width ||
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    var height = canvas_height ||
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
    var num_cells_x = Math.floor(width / cell_size_x);
    var num_cells_y = Math.floor(height / cell_size_y);
    var cells = [];
    var live_frequency = frequency || .10; // default 1 in 10 alive
    // create cells, 0 - dead, 1 - alive
    for (var i = 0; i < num_cells_y; i++) {
        cells.push([]);
        for (var j = 0; j < num_cells_x; j++) {
            cells[i].push((Math.random() <= live_frequency) ? 1 : 0);
        }
    }
    return cells;
}
var cell_width = 4;
var cell_height = 4;
var canvas_width = null;
var canvas_height = 300;
var frequency = 0.1;
var colors = { red: Math.random() < 0.5, green: Math.random() < 0.5, blue: Math.random() < 0.5 };
var cells;
var game;
function createNewGame() {
    cells = genCells(cell_width, cell_height, canvas_width, canvas_height, frequency);
    game = new gameOfLife_1.GameOfLife(cells, cell_width, cell_height, "life", colors);
    game.interval = setInterval(function () { game.step(); }, 100);
}
createNewGame();

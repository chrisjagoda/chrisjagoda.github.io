(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The game display object
 */
class GameDisplay {
    /**
     * Game display constructor
     * @param {string} canvas_id the id of the canvas element
     * @param {number} num_cells_x the number of cells along the x axis
     * @param {number} num_cells_y the number of cells along the y axis
     * @param {number} cell_width the cell width
     * @param {number} cell_height the cell height
     * @param {number} alpha the alpha of the color left behind
     */
    constructor(canvas_id, num_cells_x, num_cells_y, cell_width, cell_height, alpha) {
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
        this.width_pixels = num_cells_x * cell_width;
        this.height_pixels = num_cells_y * cell_height;
        this.cell_width = cell_width;
        this.cell_height = cell_height;
        this.canvas.width = this.width_pixels;
        this.canvas.height = this.height_pixels;
        this.alpha = alpha;
    }
    /**
     * Draws or clears a single cell
     * @param {Cell} cell the cell to be draw
     */
    drawCell(cell) {
        // find start point (top left)
        var start_x = cell.x_pos * this.cell_width;
        var start_y = cell.y_pos * this.cell_height;
        // draw rectangle from that point, to bottom right point by adding cell_width/cell_height
        if (cell.alive) {
            this.ctx.fillStyle = "RGBa(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + cell.color.a + ")";
            this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
        }
        else {
            this.ctx.clearRect(start_x, start_y, this.cell_width, this.cell_height);
            if (cell.color) {
                this.ctx.fillStyle = "RGBa(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + this.alpha + ")";
                this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
            }
        }
    }
    /**
     * Updates all cells on board from previous generation to next
     * @param {Cell[][]} cell_array the 2D array of cells to be updated
     */
    updateCells(cell_array) {
        let length_y = cell_array.length;
        let length_x = cell_array[0].length || 0;
        // each row
        for (let y = 0; y < length_y; y++) {
            // each column in rows
            for (let x = 0; x < length_x; x++) {
                // Draw Cell on Canvas
                this.drawCell(cell_array[y][x]);
            }
        }
    }
}
exports.GameDisplay = GameDisplay;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The Game of Life object
 */
class GameOfLife {
    /**
     * Game of Life object constructor
     * @param {GameDisplay} display the game display object
     * @param {number[][]} init_cells the initial array of cells
     * @param {number} cell_width the cell width
     * @param {number} cell_height the cell height
     * @param {Colors} colors the available colors of the cells
     * @param {boolean} evolve the alternate evolve algorithm
     */
    constructor(display, init_cells, cell_width, cell_height, colors, evolve) {
        this.num_cells_y = init_cells ? init_cells.length : 0;
        this.num_cells_x = this.num_cells_y > 0 ? init_cells[0].length : 0;
        this.cell_width = cell_width || 5;
        this.cell_height = cell_height || 5;
        this.colors = colors || { red: true, green: true, blue: true };
        this.evolve = evolve || false;
        this.cell_array = [];
        this.display = display;
        this.interval = 0; // initial interval set to 0. Set when setInterval called on step
        // Convert init_cells array of 0s and 1s to Cell objects for each row
        for (var y = 0; y < this.num_cells_y; y++) {
            this.cell_array.push([]);
            // each column in rows
            for (var x = 0; x < this.num_cells_x; x++) {
                let alive = (init_cells[y][x] === 1);
                // assign a color if cell is alive
                let color = (alive) ? {
                    r: (this.colors["red"]) ? Math.floor(Math.random() * 256) : 0,
                    g: (this.colors["green"]) ? Math.floor(Math.random() * 256) : 0,
                    b: (this.colors["blue"]) ? Math.floor(Math.random() * 256) : 0,
                    a: Math.random() * (0.75 - 0.25) + 0.25 // rand between 0.25 and 0.75
                } : null;
                this.cell_array[y].push({ x_pos: x, y_pos: y, alive: alive, color: color });
            }
        }
        this.display.updateCells(this.cell_array);
    }
    /**
     * Calculates and returns the next gen of cells according to the rules of life
     * @return {Cell[][]} The next generation of cells
     */
    nextGenCells() {
        var current_gen = this.cell_array;
        var length_x = this.game_width;
        var length_y = this.game_height;
        var next_gen = new Array(length_y); // New array to hold the next gen cells
        var x;
        var y;
        for (y = 0; y < this.num_cells_y; y++) {
            next_gen[y] = new Array(this.num_cells_x); // Init new rows
        }
        // each row
        for (y = 0; y < length_y; y++) {
            // each column in rows
            for (x = 0; x < length_x; x++) {
                var cell = current_gen[y][x];
                // Calculate above/below/left/right row/column values
                var row_above = (y - 1 >= 0) ? y - 1 : length_y - 1; // If current cell is on first row, cell above is the last row
                var row_below = (y + 1 <= length_y - 1) ? y + 1 : 0; // If current cell is in last row, then cell below is the first row
                var column_left = (x - 1 >= 0) ? x - 1 : length_x - 1; // If current cell is on first row, then left cell is the last row
                var column_right = (x + 1 <= length_x - 1) ? x + 1 : 0; // If current cell is on last row, then right cell is in the first row
                var neighbors = [
                    current_gen[row_above][column_left],
                    current_gen[row_above][x],
                    current_gen[row_above][column_right],
                    current_gen[y][column_left],
                    current_gen[y][column_right],
                    current_gen[row_below][column_left],
                    current_gen[row_below][x],
                    current_gen[row_below][column_right] // bottom right
                ];
                var alive_count = 0;
                var neighbor_colors = [];
                let self = this;
                neighbors.forEach(function (neighbor) {
                    if (neighbor.alive) {
                        alive_count++;
                        if (self.colors && neighbor.color) {
                            neighbor_colors.push(neighbor.color);
                        }
                    }
                });
                // variant alg with evolve set to true
                let is_alive = cell.alive;
                if (cell.alive) {
                    if (alive_count < 2 || alive_count > 3) {
                        // new state: dead, overpopulation/underpopulation
                        if (this.evolve) {
                            cell.alive = false;
                        }
                        is_alive = false;
                    }
                    else if (alive_count === 2 || alive_count === 3) {
                        // lives on to next generation
                        if (this.evolve) {
                            cell.alive = true;
                            if (!cell.color) {
                                cell.color = neighbor_colors[Math.floor(Math.random() * neighbor_colors.length)];
                                ;
                            }
                        }
                        is_alive = true;
                    }
                }
                else {
                    if (alive_count === 3) {
                        // new state: live, reproduction
                        if (this.evolve) {
                            cell.alive = true;
                            if (!cell.color) {
                                cell.color = neighbor_colors[Math.floor(Math.random() * neighbor_colors.length)];
                                ;
                            }
                        }
                        is_alive = true;
                    }
                }
                var parent_colors;
                var child_color;
                if (is_alive) {
                    if (cell.color) { // if colors exist - create child color from two random neighbors - or parents
                        neighbor_colors.push(cell.color);
                    }
                    parent_colors = neighbor_colors.splice(Math.floor(Math.random() * neighbor_colors.length), 1);
                    if (neighbor_colors.length > 0) { // fix for evolve - allows single parent color
                        parent_colors.push(neighbor_colors[Math.floor(Math.random() * neighbor_colors.length)]);
                    }
                    child_color = parent_colors[Math.floor(Math.random() * parent_colors.length)];
                }
                let cell_color = (is_alive) ? child_color : cell.color;
                this.createNewCell(next_gen, x, y, cell_color, is_alive);
            }
        }
        return next_gen;
    }
    /**
     * Advances cells one generation and updates board
     */
    step() {
        // Set next gen as current cell array
        this.cell_array = this.nextGenCells();
        ;
        this.display.updateCells(this.cell_array);
    }
}
exports.GameOfLife = GameOfLife;
class GameOfLifeBase extends GameOfLife {
    /**
     * Game of Life object constructor
     * @param {GameDisplay} display the game display object
     * @param {number[][]} init_cells the initial array of cells
     * @param {number} cell_width the cell width
     * @param {number} cell_height the cell height
     * @param {Colors} colors the available colors of the cells
     * @param {boolean} evolve the alternate evolve algorithm
     */
    constructor(display, init_cells, cell_width, cell_height, colors, evolve) {
        super(display, init_cells, cell_width, cell_height, colors, evolve);
        this.game_width = init_cells.length;
        this.game_height = init_cells.length;
    }
    createNewCell(next_gen, x, y, cell_color, is_alive) {
        next_gen[y][x] = { x_pos: x, y_pos: y, alive: is_alive, color: cell_color }; // top left
    }
}
exports.GameOfLifeBase = GameOfLifeBase;
class GameOfLifeMandala1 extends GameOfLife {
    /**
     * Game of Life object constructor
     * @param {GameDisplay} display the game display object
     * @param {number[][]} init_cells the initial array of cells
     * @param {number} cell_width the cell width
     * @param {number} cell_height the cell height
     * @param {Colors} colors the available colors of the cells
     * @param {boolean} evolve the alternate evolve algorithm
     * @param {number} length_xy the length of the game
     */
    constructor(display, init_cells, cell_width, cell_height, colors, evolve) {
        super(display, init_cells, cell_width, cell_height, colors, evolve);
        this.game_width = Math.ceil(init_cells.length / 2);
        this.game_height = Math.ceil(init_cells.length / 2);
    }
    createNewCell(next_gen, x, y, cell_color, is_alive) {
        let length_x = this.num_cells_x - 1;
        let length_y = this.num_cells_y - 1;
        next_gen[y][x] = { x_pos: x, y_pos: y, alive: is_alive, color: cell_color }; // top left - bottom left
        next_gen[x][y] = { x_pos: y, y_pos: x, alive: is_alive, color: cell_color }; // top left - top right
        next_gen[y][length_x - x] = { x_pos: length_x - x, y_pos: y, alive: is_alive, color: cell_color }; // top right - top left
        next_gen[length_x - x][y] = { x_pos: y, y_pos: length_x - x, alive: is_alive, color: cell_color }; // top right - bottom right
        next_gen[length_y - y][length_x - x] = { x_pos: length_x - x, y_pos: length_y - y, alive: is_alive, color: cell_color }; // bottom right
        next_gen[length_x - x][length_y - y] = { x_pos: length_y - y, y_pos: length_x - x, alive: is_alive, color: cell_color }; // bottom right
        next_gen[length_y - y][x] = { x_pos: x, y_pos: length_y - y, alive: is_alive, color: cell_color }; // bottom left
        next_gen[x][length_y - y] = { x_pos: length_y - y, y_pos: x, alive: is_alive, color: cell_color }; // bottom left
    }
}
exports.GameOfLifeMandala1 = GameOfLifeMandala1;
class GameOfLifeMandala2 extends GameOfLife {
    /**
     * Game of Life object constructor
     * @param {GameDisplay} display the game display object
     * @param {number[][]} init_cells the initial array of cells
     * @param {number} cell_width the cell width
     * @param {number} cell_height the cell height
     * @param {Colors} colors the available colors of the cells
     * @param {boolean} evolve the alternate evolve algorithm
     */
    constructor(display, init_cells, cell_width, cell_height, colors, evolve) {
        super(display, init_cells, cell_width, cell_height, colors, evolve);
        this.game_width = Math.ceil(init_cells.length / 2);
        this.game_height = Math.ceil(init_cells.length / 2);
    }
    createNewCell(next_gen, x, y, cell_color, is_alive) {
        let length_x = this.num_cells_x - 1;
        let length_y = this.num_cells_y - 1;
        next_gen[y][x] = { x_pos: x, y_pos: y, alive: is_alive, color: cell_color }; // top left
        next_gen[y][length_x - x] = { x_pos: length_x - x, y_pos: y, alive: is_alive, color: cell_color }; // top right
        next_gen[length_y - y][length_x - x] = { x_pos: length_x - x, y_pos: length_y - y, alive: is_alive, color: cell_color }; // bottom right
        next_gen[length_y - y][x] = { x_pos: x, y_pos: length_y - y, alive: is_alive, color: cell_color }; // bottom left
    }
}
exports.GameOfLifeMandala2 = GameOfLifeMandala2;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameDisplay_1 = require("./GameDisplay");
const GameOfLife_1 = require("./GameOfLife");
var base = document.getElementById("base");
var mandala = document.getElementById("mandala");
var cell_width = 4;
var cell_height = 4;
var canvas_width = 256;
var canvas_height = 256;
var frequency = 0.2;
var alpha = 0.5;
var colors = { red: Math.random() < 0.5, green: Math.random() < 0.5, blue: Math.random() < 0.5 };
var running1 = false;
var running2 = false;
var cells;
var game1;
var game2;
var display1;
var display2;
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
function createNewGame(type) {
    cells = genCells(cell_width, cell_height, canvas_width, canvas_height, frequency);
    switch (type) {
        case 'base':
            display1 = new GameDisplay_1.GameDisplay(type, cells.length, cells[0].length, cell_width, cell_width, alpha);
            game1 = new GameOfLife_1.GameOfLifeBase(display1, cells, cell_width, cell_height, colors);
            break;
        case 'mandala':
            display2 = new GameDisplay_1.GameDisplay(type, cells.length, cells[0].length, cell_width, cell_width, alpha);
            game2 = new GameOfLife_1.GameOfLifeMandala1(display2, cells, cell_width, cell_height, colors);
            break;
        default:
            display1 = new GameDisplay_1.GameDisplay(type, cells.length, cells[0].length, cell_width, cell_width, alpha);
            game1 = new GameOfLife_1.GameOfLifeBase(display1, cells, cell_width, cell_height, colors);
    }
}
function startGame(type) {
    switch (type) {
        case 'base':
            game1.interval = setInterval(function () { game1.step(); }, 100);
            running1 = true;
            break;
        case 'mandala':
            game2.interval = setInterval(function () { game2.step(); }, 100);
            running2 = true;
            break;
        default:
            game1.interval = setInterval(function () { game1.step(); }, 100);
            running1 = true;
    }
}
function stopGame(type) {
    switch (type) {
        case 'base':
            clearInterval(game1.interval);
            game1.interval = 0;
            running1 = false;
            break;
        case 'mandala':
            clearInterval(game2.interval);
            game2.interval = 0;
            running2 = false;
            break;
        default:
            clearInterval(game1.interval);
            game1.interval = 0;
            running1 = false;
    }
}
function resetGame(type) {
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

},{"./GameDisplay":1,"./GameOfLife":2}]},{},[3])(3)
});
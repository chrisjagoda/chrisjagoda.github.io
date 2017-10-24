"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The Game of Life object
 * @param {number[][]} init_cells the initial array of cells
 * @param {number} num_cells_y the number of cells along the y axis
 * @param {number} cell_width the cell width
 * @param {number} cell_height the cell height
 * @param {string} the id of the canvas element
 */
class GameOfLife {
    constructor(init_cells, cell_width, cell_height, canvas_id, colors, evolved) {
        this.num_cells_y = init_cells.length;
        this.num_cells_x = init_cells[0].length || 0;
        this.cell_width = cell_width || 5;
        this.cell_height = cell_height || 5;
        this.canvas_id = canvas_id || "life";
        this.colors = colors || { red: true, green: true, blue: true };
        this.evolved = evolved || false;
        this.cell_array = [];
        this.display = new GameDisplay(this.num_cells_x, this.num_cells_y, cell_width, cell_height, canvas_id);
        this.interval = null; // initial interval to null. Set when setInterval called on step
        // Convert init_cells array of 0s and 1s to Cell objects for each row
        for (var y = 0; y < this.num_cells_y; y++) {
            this.cell_array.push([]);
            // each column in rows
            for (var x = 0; x < this.num_cells_x; x++) {
                let alive = (init_cells[y][x] === 1);
                let color = (alive) ? { r: (this.colors["red"]) ? Math.floor(Math.random() * 256) : 0,
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
     * @returns {Cell[][]} The next generation of cells
     */
    nextGenCells() {
        var current_gen = this.cell_array;
        var next_gen = []; // New array to hold the next gen cells
        var length_y = this.cell_array.length;
        var length_x = current_gen[0].length || 0;
        var x;
        var y;
        // each row
        for (y = 0; y < length_y; y++) {
            next_gen.push([]); // Init new row
            // each column in rows
            for (x = 0; x < length_x; x++) {
                var cell = current_gen[y][x];
                // Calculate above/below/left/right row/column values
                var row_above = (y - 1 >= 0) ? y - 1 : length_y - 1; // If current cell is on first row, cell "above" is the last row
                var row_below = (y + 1 <= length_y - 1) ? y + 1 : 0; // If current cell is in last row, then cell "below" is the first row
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
                var dead_count = 0;
                var neighbor_colors = [];
                let self = this;
                neighbors.forEach(function (neighbor) {
                    if (neighbor.alive) {
                        alive_count++;
                        if (self.colors && neighbor.color) {
                            neighbor_colors.push({ r: neighbor.color.r,
                                g: neighbor.color.g,
                                b: neighbor.color.b,
                                a: neighbor.color.a });
                        }
                    }
                    else {
                        dead_count++;
                    }
                });
                // variant alg with evolved set to true
                let is_alive = cell.alive;
                if (cell.alive) {
                    if (alive_count < 2 || alive_count > 3) {
                        // new state: dead, overpopulation/underpopulation
                        if (this.evolved) {
                            cell.alive = false;
                        }
                        is_alive = false;
                    }
                    else if (alive_count === 2 || alive_count === 3) {
                        // lives on to next generation
                        if (this.evolved) {
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
                        if (this.evolved) {
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
                    if (cell.color) {
                        neighbor_colors.push(cell.color);
                    }
                    parent_colors = neighbor_colors.splice(Math.floor(Math.random() * neighbor_colors.length), 1);
                    if (neighbor_colors.length > 0) {
                        parent_colors.push(neighbor_colors[Math.floor(Math.random() * neighbor_colors.length)]);
                    }
                    child_color = parent_colors[Math.floor(Math.random() * parent_colors.length)];
                }
                // create new cell based on color from neighbors dead cell color null
                let cell_color = (is_alive) ? child_color : null;
                next_gen[y].push({ x_pos: x, y_pos: y, alive: is_alive, color: cell_color });
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
/**
 * The game display
 * @param {number} num_cells_x the number of cells along the x axis
 * @param {number} num_cells_y the number of cells along the y axis
 * @param {number} cell_width the cell width
 * @param {number} cell_height the cell height
 * @param {string} the id of the canvas element
 */
class GameDisplay {
    constructor(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id) {
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
        this.width_pixels = num_cells_x * cell_width;
        this.height_pixels = num_cells_y * cell_height;
        this.cell_width = cell_width;
        this.cell_height = cell_height;
        this.canvas.width = this.width_pixels;
        this.canvas.height = this.height_pixels;
    }
    /**
     * Updates all cells on board from previous generation to next
     * @param {Cell[][]} cell_array the 2D array of cells to be updated
     */
    updateCells(cell_array) {
        var length_y = cell_array.length;
        var length_x = cell_array[0].length || 0;
        var y;
        var x;
        // each row
        for (y = 0; y < length_y; y++) {
            // each column in rows
            for (x = 0; x < length_x; x++) {
                // Draw Cell on Canvas
                this.drawCell(cell_array[y][x]);
            }
        }
    }
    /**
     * Draws or clears a single cell
     * @param {Cell} cell the c`ell to be drawn
     */
    drawCell(cell) {
        // find start point (top left)
        var start_x = cell.x_pos * this.cell_width;
        var start_y = cell.y_pos * this.cell_height;
        // draw rectangle from that point, to bottom right point by adding cell_width/cell_height
        if (cell.alive) {
            this.ctx.fillStyle = "rgba(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + cell.color.a + ")";
            this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
        }
        else {
            this.ctx.clearRect(start_x, start_y, this.cell_width, this.cell_height);
        }
    }
}

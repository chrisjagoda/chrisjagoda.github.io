import { Cell, Colors, RGBa } from './types';
import { GameDisplay } from './GameDisplay';

/**
 * The Game of Life object
 */
export abstract class GameOfLife {
	private cell_width: number;
	private cell_height: number;
	private canvas_id: string;
	protected game_height: number; // the height of the area of the game
	protected game_width: number; // the width of the area of the game
	protected num_cells_y: number;
	protected num_cells_x: number;
	protected colors: Colors;
	protected cell_array: Cell[][];
	private display: GameDisplay;
	public evolve: boolean;
	public interval: number;

	/**
	 * Game of Life object constructor
	 * @param {GameDisplay} display the game display object
	 * @param {number[][]} init_cells the initial array of cells
	 * @param {number} cell_width the cell width
	 * @param {number} cell_height the cell height
	 * @param {Colors} colors the available colors of the cells
	 * @param {boolean} evolve the alternate evolve algorithm
	 */
	constructor(display: GameDisplay, init_cells: number[][], cell_width?: number, cell_height?: number, colors?: Colors, evolve?: boolean) {
		this.num_cells_y = init_cells ? init_cells.length: 0;
		this.num_cells_x = this.num_cells_y > 0 ? init_cells[0].length: 0;
		this.cell_width = cell_width || 5;
		this.cell_height = cell_height || 5;
		this.colors = colors || <Colors>{red: true, green: true, blue: true};
		
		this.evolve = evolve || false;
		this.cell_array = [];
		this.display = display;
		this.interval = 0; // initial interval set to 0. Set when setInterval called on step

		// Convert init_cells array of 0s and 1s to Cell objects for each row
		for (var y = 0; y < this.num_cells_y; y++) {
			this.cell_array.push([]);
			// each column in rows
			for (var x = 0; x < this.num_cells_x; x++) {
				let alive: boolean = (init_cells[y][x] === 1);
				// assign a color if cell is alive
				let color: RGBa = (alive) ? <RGBa>{
					r: (this.colors["red"]) ? Math.floor(Math.random()*256): 0,
					g: (this.colors["green"]) ? Math.floor(Math.random()*256): 0,
					b: (this.colors["blue"]) ? Math.floor(Math.random()*256): 0,
					a: Math.random() * (0.75 - 0.25) + 0.25 // rand between 0.25 and 0.75
				}: null;
				this.cell_array[y].push(<Cell>{x_pos: x, y_pos: y, alive: alive, color: color});
			}
		}
		this.display.updateCells(this.cell_array);
	}

	/**
	 * Calculates and returns the next gen of cells according to the rules of life
	 * @return {Cell[][]} The next generation of cells
	 */
	private nextGenCells(): Cell[][] {
		var current_gen: Cell[][] = this.cell_array;
		var length_x: number = this.game_width;
		var length_y: number = this.game_height;
		var next_gen: Cell[][] = new Array(length_y);      // New array to hold the next gen cells
		var x: number;
		var y: number;

		for (y = 0; y < this.num_cells_y; y++) {
			next_gen[y] = new Array(this.num_cells_x); // Init new rows
		}

		// each row
		for (y = 0; y < length_y; y++) {
			// each column in rows
			for (x = 0; x < length_x; x++) {
				var cell: Cell = current_gen[y][x];
				// Calculate above/below/left/right row/column values
				var row_above: number = (y - 1 >= 0) ? y - 1: length_y - 1; // If current cell is on first row, cell above is the last row
				var row_below: number = (y + 1 <= length_y - 1) ? y + 1: 0; // If current cell is in last row, then cell below is the first row
				var column_left: number = (x - 1 >= 0) ? x - 1: length_x - 1; // If current cell is on first row, then left cell is the last row
				var column_right: number = (x + 1 <= length_x - 1) ? x + 1: 0; // If current cell is on last row, then right cell is in the first row
				
				var neighbors: Cell[] = [
					current_gen[row_above][column_left], // top left
					current_gen[row_above][x], // top center
					current_gen[row_above][column_right], // top right
					current_gen[y][column_left], // left
					current_gen[y][column_right], // right
					current_gen[row_below][column_left], // bottom left
					current_gen[row_below][x], // bottom center
					current_gen[row_below][column_right] // bottom right
				];
				var alive_count: number = 0;

				var neighbor_colors: RGBa[] = [];
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
				let is_alive: boolean = cell.alive;
				if (cell.alive) {
					if (alive_count < 2 || alive_count > 3) {
						// new state: dead, overpopulation/underpopulation
						if (this.evolve) {
							cell.alive = false;
						}
						is_alive = false;
					} else if (alive_count === 2 || alive_count === 3) {
						// lives on to next generation
						if (this.evolve) {
							cell.alive = true;
							if (!cell.color) {
								cell.color = neighbor_colors[Math.floor(Math.random()*neighbor_colors.length)];;
							}
						}
						is_alive = true;
					}
				} else {
					if (alive_count === 3) {
						// new state: live, reproduction
						if (this.evolve) {
							cell.alive = true;
							if (!cell.color) {
								cell.color = neighbor_colors[Math.floor(Math.random()*neighbor_colors.length)];;
							}
						}
						is_alive = true;
					}
				}

				var parent_colors: RGBa[];
				var child_color: RGBa;
				if (is_alive) {
					if (cell.color) { // if colors exist - create child color from two random neighbors - or parents
						neighbor_colors.push(cell.color);
					}
					parent_colors = neighbor_colors.splice(Math.floor(Math.random()*neighbor_colors.length), 1);
					if (neighbor_colors.length > 0) { // fix for evolve - allows single parent color
						parent_colors.push(neighbor_colors[Math.floor(Math.random()*neighbor_colors.length)]);
					}
					child_color = parent_colors[Math.floor(Math.random()*parent_colors.length)];
				}
				let cell_color: RGBa = (is_alive) ? child_color: cell.color;
				this.createNewCell(next_gen, x, y, cell_color, is_alive);				
			}
		}
		return next_gen;
	}

	/**
	 * Create new cell based on color from neighbors dead cell color null
	 */
	abstract createNewCell(next_gen: Cell[][], x: number, y: number, cell_color: RGBa, is_alive: boolean): void;

	/**
	 * Advances cells one generation and updates board
	 */
	public step(): void {
		// Set next gen as current cell array
		this.cell_array = this.nextGenCells();;
		this.display.updateCells(this.cell_array);
	}
}

export class GameOfLifeBase extends GameOfLife {
	/**
	 * Game of Life object constructor
	 * @param {GameDisplay} display the game display object
	 * @param {number[][]} init_cells the initial array of cells
	 * @param {number} cell_width the cell width
	 * @param {number} cell_height the cell height
	 * @param {Colors} colors the available colors of the cells
	 * @param {boolean} evolve the alternate evolve algorithm
	 */
	constructor(display: GameDisplay, init_cells: number[][], cell_width?: number, cell_height?: number, colors?: Colors, evolve?: boolean) {
		super(display, init_cells, cell_width, cell_height, colors, evolve);
		this.game_width = init_cells.length;
		this.game_height = init_cells.length;
	}

	createNewCell(next_gen: Cell[][], x: number, y: number, cell_color: RGBa, is_alive: boolean) {
		next_gen[y][x] = <Cell>{x_pos: x, y_pos: y, alive: is_alive, color: cell_color}; // top left
	}
}

export class GameOfLifeMandala1 extends GameOfLife {
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
	constructor(display: GameDisplay, init_cells: number[][], cell_width?: number, cell_height?: number, colors?: Colors, evolve?: boolean) {
		super(display, init_cells, cell_width, cell_height, colors, evolve);
		this.game_width = Math.ceil(init_cells.length/2);
		this.game_height = Math.ceil(init_cells.length/2);
	}

	createNewCell(next_gen: Cell[][], x: number, y: number, cell_color: RGBa, is_alive: boolean) {
		let length_x: number = this.num_cells_x - 1;
		let length_y: number = this.num_cells_y - 1;
		
		next_gen[y][x] = <Cell>{x_pos: x, y_pos: y, alive: is_alive, color: cell_color}; // top left - bottom left
		next_gen[x][y] = <Cell>{x_pos: y, y_pos: x, alive: is_alive, color: cell_color}; // top left - top right
		next_gen[y][length_x - x] = <Cell>{x_pos: length_x - x, y_pos: y, alive: is_alive, color: cell_color}; // top right - top left
		next_gen[length_x - x][y] = <Cell>{x_pos: y, y_pos: length_x - x, alive: is_alive, color: cell_color}; // top right - bottom right
		next_gen[length_y - y][length_x - x] = <Cell>{x_pos: length_x - x, y_pos: length_y - y, alive: is_alive, color: cell_color}; // bottom right
		next_gen[length_x - x][length_y - y] = <Cell>{x_pos: length_y - y, y_pos: length_x - x, alive: is_alive, color: cell_color}; // bottom right
		next_gen[length_y - y][x] = <Cell>{x_pos: x, y_pos: length_y - y, alive: is_alive, color: cell_color}; // bottom left
		next_gen[x][length_y - y] = <Cell>{x_pos: length_y - y, y_pos: x, alive: is_alive, color: cell_color}; // bottom left
	}
}

export class GameOfLifeMandala2 extends GameOfLife {
	/**
	 * Game of Life object constructor
	 * @param {GameDisplay} display the game display object
	 * @param {number[][]} init_cells the initial array of cells
	 * @param {number} cell_width the cell width
	 * @param {number} cell_height the cell height
	 * @param {Colors} colors the available colors of the cells
	 * @param {boolean} evolve the alternate evolve algorithm
	 */
	constructor(display: GameDisplay, init_cells: number[][], cell_width?: number, cell_height?: number, colors?: Colors, evolve?: boolean) {
		super(display, init_cells, cell_width, cell_height, colors, evolve);
		this.game_width = Math.ceil(init_cells.length/2);
		this.game_height = Math.ceil(init_cells.length/2);
	}

	createNewCell(next_gen: Cell[][], x: number, y: number, cell_color: RGBa, is_alive: boolean) {
		let length_x: number = this.num_cells_x - 1;
		let length_y: number = this.num_cells_y - 1;
		
		next_gen[y][x] = <Cell>{x_pos: x, y_pos: y, alive: is_alive, color: cell_color}; // top left
		next_gen[y][length_x - x] = <Cell>{x_pos: length_x - x, y_pos: y, alive: is_alive, color: cell_color}; // top right
		next_gen[length_y - y][length_x - x] = <Cell>{x_pos: length_x - x, y_pos: length_y - y, alive: is_alive, color: cell_color}; // bottom right
		next_gen[length_y - y][x] = <Cell>{x_pos: x, y_pos: length_y - y, alive: is_alive, color: cell_color}; // bottom left
	}
}
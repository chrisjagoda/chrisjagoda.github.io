import { Cell } from './types';

/**
 * The game display object
 */
export class GameDisplay {
	private canvas: HTMLCanvasElement;
	private num_cells_x: number;
	private num_cells_y: number;
	public ctx: CanvasRenderingContext2D;
	public width_pixels: number;
	public height_pixels: number;
	public cell_width: number;
	public cell_height: number;
	public alpha: number;

	/**
	 * Game display constructor
	 * @param {string} canvas_id the id of the canvas element
	 * @param {number} num_cells_x the number of cells along the x axis
	 * @param {number} num_cells_y the number of cells along the y axis
	 * @param {number} cell_width the cell width
	 * @param {number} cell_height the cell height
	 * @param {number} alpha the alpha of the color left behind
	 */
	constructor(canvas_id: string, num_cells_x: number, num_cells_y: number, cell_width: number, cell_height: number, alpha: number) {
		this.canvas = <HTMLCanvasElement>document.getElementById(canvas_id);
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
	public drawCell(cell: Cell): void {
		// find start point (top left)
		var start_x: number = cell.x_pos * this.cell_width;
		var start_y: number = cell.y_pos * this.cell_height;
		// draw rectangle from that point, to bottom right point by adding cell_width/cell_height
		if (cell.alive) {
			this.ctx.fillStyle = "RGBa(" + cell.color.r + "," + cell.color.g + "," + cell.color.b + "," + cell.color.a + ")";
			this.ctx.fillRect(start_x, start_y, this.cell_width, this.cell_height);
		} else {
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
	public updateCells(cell_array: Cell[][]): void {		
		let length_y: number = cell_array.length;
		let length_x: number = cell_array[0].length || 0;
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
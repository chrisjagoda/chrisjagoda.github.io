/**
 * Represents a living or dead cell
 * @param {x_pos} x_pos the x position of the cell
 * @param {y_pos} y_pos the y position of the cell
 * @param {alive} alive if the cell is alive or dead
 * @param {color} color the RGBA color value of the cell
 */
export interface Cell {
	x_pos: number;
	y_pos: number;
	alive: boolean;
	color: RGBa;
}

/**
 * RGBA value
 * @param {number} r the red value (0 - 255)
 * @param {number} g the green value (0 - 255)
 * @param {number} b the blue value (0 - 255)
 * @param {number} a the alpha value (0 - 1)
 */
export interface RGBa {
	r: number;
	g: number;
	b: number;
	a: number;
}

/**
 * The colors a new board of cells may have
 * @param {boolean} red if red is allowed
 * @param {boolean} green if green is allowed
 * @param {boolean} blue if blue is allowed
 */
export interface Colors {
	red: boolean;
	green: boolean;
	blue: boolean;
}
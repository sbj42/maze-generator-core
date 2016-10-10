var dirs = require('./directions');

/**
 * A Cell is a wrapper object that makes it easier to
 * ask for passage information by name.
 *
 * @constructor
 * @private
 * @param {integer} width
 * @param {integer} height
 */
function Cell(data) {
    this._data = data;
}

function cellPassage(data, dir) {
    return !!(data & dirs.bitmask(dir));
}

Cell.prototype.north = function() {
    return cellPassage(this._data, dirs.NORTH);
};

Cell.prototype.west = function() {
    return cellPassage(this._data, dirs.WEST);
};

Cell.prototype.south = function() {
    return cellPassage(this._data, dirs.SOUTH);
};

Cell.prototype.east = function() {
    return cellPassage(this._data, dirs.EAST);
};

/**
 * A Maze is a rectangular grid of cells, where each cell
 * may have passages in each of the cardinal directions.
 * The maze is initialized with each cell having no passages.
 *
 * @constructor
 * @param {integer} width
 * @param {integer} height
 */
function Maze(width, height) {
    if (width < 0 || height < 0)
        throw new Error('invalid size: ' + width + 'x' + height);
    this._width = width;
    this._height = height;
    this._grid = [];
    this._blockWidth = (width+7) >> 3;
    for (var i = 0; i < this._blockWidth * height; i ++)
        this._grid.push(0);
}

/**
 * The width of the Maze
 *
 * @return {integer}
 */
Maze.prototype.width = function() {
    return this._width;
};

/**
 * The height of the Maze
 *
 * @return {integer}
 */
Maze.prototype.height = function() {
    return this._height;
};

function cellData(grid, blockWidth, x, y) {
    var index = y * blockWidth + (x >> 3);
    var shift = ((x & 7) * 4);
    return (grid[index] >> shift) & 15;
}

function setCellPassage(grid, blockWidth, x, y, dir, value) {
    var index = y * blockWidth + (x >> 3);
    var shift = ((x & 7) * 4);
    var mask = dirs.bitmask(dir) << shift;
    if (value)
        grid[index] |= mask;
    else
        grid[index] &= ~mask;
}

/**
 * Returns the cell at the given position.
 *
 * @param {integer} x
 * @param {integer} y
 * @return {Cell}
 */
Maze.prototype.cell = function(x, y) {
    if (x < 0 || y < 0 || x >= this._width || y >= this._height)
        return new Cell(0);
    return new Cell(cellData(this._grid, this._blockWidth, x, y));
};

/**
 * Returns whether there is a passage at the given position and
 * direction
 *
 * @param {integer} x
 * @param {integer} y
 * @param {Direction} dir
 */
Maze.prototype.getPassage = function(x, y, dir) {
    return cellPassage(cellData(this._grid, this._blockWidth, x, y), dir);
};

/**
 * Creates or removes a passage at the given position and
 * direction.  Note that this also creates the corresponding
 * passage in the neighboring cell.
 *
 * @param {integer} x
 * @param {integer} y
 * @param {Direction} dir
 * @param {boolean} value
 */
Maze.prototype.setPassage = function(x, y, dir, value) {
    if (value == null)
        value = true;
    if (x < 0 || y < 0 || x >= this._width || y >= this._height)
        throw new Error('source cell out of bounds: ' + x + ',' + y);
    var x2 = x + dirs.dx(dir);
    var y2 = y + dirs.dy(dir);
    if (x2 < 0 || y2 < 0 || x2 >= this._width || y2 >= this._height)
        throw new Error('target cell out of bounds: ' + x2 + ',' + y2);
    setCellPassage(this._grid, this._blockWidth, x, y, dir, value);
    var dir2 = dirs.opposite(dir);
    setCellPassage(this._grid, this._blockWidth, x2, y2, dir2, value);
};

module.exports = Maze;

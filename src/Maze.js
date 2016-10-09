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
    for (var i = 0; i < width * height; i ++)
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

function cellData(grid, width, x, y) {
    return grid[y * width + x];
}

function setCellPassage(grid, width, x, y, dir, value) {
    if (value)
        grid[y * width + x] |= dirs.bitmask(dir);
    else
        grid[y * width + x] &= ~dirs.bitmask(dir);
}

/**
 * Returns the cell at the given position.
 *
 * @param {integer} x
 * @param {integer} y
 * @return {Cell}
 */
Maze.prototype.cell = function(x, y) {
    if (x < 0 || y < 0 || x >= this.width() || y >= this.height())
        return new Cell(0);
    return new Cell(cellData(this._grid, this._width, x, y));
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
    return cellPassage(cellData(this._grid, this._width, x, y), dir);
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
    if (x < 0 || y < 0 || x >= this.width() || y >= this.height())
        throw new Error('source cell out of bounds: ' + x + ',' + y);
    var x2 = x + dirs.dx(dir);
    var y2 = y + dirs.dy(dir);
    if (x2 < 0 || y2 < 0 || x2 >= this.width() || y2 >= this.height())
        throw new Error('target cell out of bounds: ' + x2 + ',' + y2);
    setCellPassage(this._grid, this._width, x, y, dir, value);
    var dir2 = dirs.opposite(dir);
    setCellPassage(this._grid, this._width, x2, y2, dir2, value);
};

module.exports = Maze;

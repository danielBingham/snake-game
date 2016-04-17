define(
[
	"underscore",
	"jquery",
	"Point"
], 
function(
	_,
	$,
	Point
) {

/**
 *
 * Initialize the game world.
 * @constructor
 * @param	{config}	config - A configuration object. 
 */
var World = function(config) {

	/**
	 *  The width of the game world in squares.
	 *
	 *  @type	{number}
	 */
	this.width = config.world_width;

	/**
	 * The height of the game world in squares.
	 *
	 * @type	{number}
	 */
	this.height = config.world_height;

	/**
	 * @property	{array}  squares - An array recording the position of all
	 * 		characters and items with in the game.
	 */
	this.squares = [];

	for (var x = 0; x < this.width; x++) {
		this.squares[x] = [];
		for (var y = 0; y < this.height; y++) {
			this.squares[x][y] = " ";
		}
	}

	this.generateBlock();
};

/**
 * Any and all data describing the game world itself.
 *
 * Prototype of the World class.
 *
 * @todo Decouple from Snake.character.
 */
World.prototype = {

	/**
	 * Generate a random coordinate point a certain distance from
	 * the edges of the world.
	 *
	 * @return	{Point}	A point object with a randomly generated
	 * coordinate.
	 */
	randomCoordinate: function() {
		var x = Math.floor(Math.random() * (this.width-4) + 2);
		var y = Math.floor(Math.random() * (this.height-4) + 2);	

		return new Point(x, y);
	},

	/**
	 * Generate a new block and place it randomly on the world.
	 */
	generateBlock: function(character) {
		var block = this.randomCoordinate();
		while (this.squares[block.x][block.y] != " "
			&& block.distance(character.head) < 5) {
			block = this.randomCoordinate();
		}

		this.squares[block.x][block.y] = "B";
	}
};

return World;

});

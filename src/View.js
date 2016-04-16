define(
[
	"underscore",
	"jquery"
], 
function(
	_,
	$
) {

/**
 * The view port through which we are viewing the game world.
 *
 * Initialize the view.
 * 
 * @constructor
 *
 * @param	{Config}	config - A configuration object.
 * @param	{world}		world  - An object representing the world state.
 */
var View = function(config, world) {

	/**
	 * @property 	{int}	square_size - Size of a single game square, in pixels.
	 */
	this.square_size = config.square_size;

	/**
	 * @property	{int}	width - Width of the game world, in pixels.
	 */
	this.width = world.width * this.square_size;

	/**
	 * @property	{int}	height -  Height of the game world, pixels.
	 */
	this.height = world.height * this.square_size; 



	$("#snake").attr("width", this.width);
	$("#snake").attr("height", this.height);

	$("#game-wrapper").css("width", this.width + 10);
	$("#game-wrapper").css("height", this.height + 10);
},


/**
 * The view port through which we are viewing the game world.
 *
 * The prototype of the view class.
 */
View.prototype = { 

	/**
	 * Update the score in the view.
	 *
	 * @param	{int}	score - The score in integer form.
	 */
	updateScore: function(score) {
		$("#score").html(score);
	},

	/**
	 * Render the view of the world.
	 *
	 * @param	{object} 	world - An object representing world state. (Snake.world)
	 * 
	 * @todo Decouple and inject Snake.draw.
	 */
	render: function(world, draw) {
		// Clear the view.
		draw.clear();

		// Redraw the world.
		for (var x = 0; x < world.width; x++) {
			for (var y = 0; y < world.height; y++) {

				// The square is occupied by the Snake. 
				if (world.squares[x][y][0] == "S") {
					draw.rectangle(
						x * this.square_size,
						y * this.square_size,
						this.square_size,
						this.square_size);	
				} else if (world.squares[x][y] == "B") {
					draw.rectangle(
						x * this.square_size,
						y * this.square_size,
						this.square_size,
						this.square_size);	
				}

			}
		}
	}
};

return View;

});

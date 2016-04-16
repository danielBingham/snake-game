/**
 * Snake
 *
 * A very basic javascript implementation of the classic snake game.
 *
 * See http://en.wikipedia.org/wiki/Snake_(video_game)
 *
 * The naming convention I'm using:
 *
 * 	underscore_case - For properties and variables.
 * 	camelCase - For methods and functions.
 * 	StudlyCase - For classes and top-level namespaces.
 *
 */
var Snake = Snake || {

	/**
	 * Important configuration parameters all in one place.
	 */	
	config: {

		/**
		 * The speed at which the game runs.  Lower numbers
		 * make for faster games.
		 *
		 * @type	{int}
		 */
		game_speed: 2, 

		/**
		 * The frame refresh rate.  Number of frames to display
		 * per second.
		 *
		 * @type	{int}
		 */
		frame_rate: 60,

		/**
		 * Size of a square in the game world in pixels.
		 *
		 * @type	{int}
		 */
		square_size: 10,

		/**
		 * Width of the game world in squares.
		 *
		 * @type	{int}
		 */
		world_width: 40,

		/**
		 * Height of the game world in squares.
		 *
		 * @type	{int}
		 */
		world_height: 40,
	},

	/**
	 * Game meta data and control.
	 */
	game: {

		/**
		 * The number of blocks the player has consumed.
		 *
		 * @type	{int}
		 */
		score: 0,		

		/**
		 * Has the game ended?  
		 *
		 * @type	{boolean}
		 */
		game_over: false,

		/**
		 * Is the game currently paused?
		 *
		 * @type	{boolean}
		 */
		paused: false,

		/**
		 * Number of frames per update.  A low number is a fast moving game,
		 * a high number moves more slowly, but can result in missed commands.
		 * 
		 * @todo Implement a command queue to avoid missed commands on slow
		 * game speeds.
		 *
		 * @type	{int}
		 */
		game_speed: 2,

		/**
		 * A ticker recording each frame.
		 *
		 * @type	{int}
		 */
		tick: 0,


		/**
		 * Initialize the game.
		 */
		init: function() {

			this.game_speed = Snake.config.game_speed;

			// Initialize the game world.
			Snake.world = new Snake.World(Snake.config);
			Snake.character = new Snake.Character(Snake.world);
			Snake.view = new Snake.View(Snake.config, Snake.world);

			Snake.draw = new Snake.Draw($("#snake")[0], Snake.view.width, Snake.view.height);
			Snake.command = new Snake.Command();
			$("#snake").focus();

			Snake.animate = new Snake.Animator(Snake.config);
			Snake.animate.start();
		},

		/**
		 * Reinitialize the game after it has ended.
		 */
		reinit: function() {
			this.game_over = false;
			this.score = 0;
			$("#message").html(" ");
			this.init();
		},

		/**
		 * Update the game state, a single iteration of the game loop.
		 */
		update: function() {
			this.tick++;
			if (this.tick == this.game_speed) {
				var ate_block = Snake.character.move(Snake.world, Snake.game);		
				if (ate_block) {
					Snake.world.generateBlock();
					this.score++;
				}
			
				Snake.command.previous_direction = Snake.character.getHeadDirection();	
				Snake.view.render(Snake.world);
				Snake.view.updateScore(this.score);
				
				this.tick = 0;
			}
		},

	},

};



//------------------------------------------------------------------------------
// 		Snake.Point
//------------------------------------------------------------------------------

/**
 * Define a point class we can use for coordinates.
 * @constructor
 * @param	{int}	x - The x coordinate.
 * @param	{int}	y - The y coordinate.
 */
Snake.Point = function(x,y) {

	/**
	 * @property	{number}	x - The x coordinate.
	 */
	this.x = x;

	/**
	 * @property	{number}	y - The y coordinate.
	 */
	this.y = y;
};

/**
 *  A point class we can use for coordinates and vectors.
 *
 * Prototype of the point class.
 */
Snake.Point.prototype = { 

	/**
	 * Add two points.
	 *
	 * @param	{object}	point - The point to add to this.
	 * @return	this
	 */
	add: function(point) {
		this.x = this.x + point.x;
		this.y = this.y + point.y;
		return this;
	},

	/** 
	 * Multiply this point by a scalar.
	 *
	 * @param	{number}	scalar - The scalar with which to multiply this point.
	 * @return	this
	 */
	scalarMultiply: function(scalar) {
		this.x = this.x * scalar;
		this.y = this.y * scalar;
		return this;
	},

	/**
	 * Copy another point in to this point.
	 *
	 * @param	{object}	point - The point to copy.
	 * @return 	this
	 */
	copy: function(point) {
		this.x = point.x;
		this.y = point.y;
		return this;
	},

	/**
	 * Check for equality with another point.
	 *
	 * @param	{object}	point - The point to check against this for equality.
	 * @return	{boolean}	true if equal, false otherwise.
	 */
	equals: function(point) {
		if (this.x == point.x && this.y == point.y) {
			return true;
		}
		return false;
	},

	/**
	 * Calculate the distance between this point and another.
	 *
	 * @param	{object}	point - The point to calculate distance with.
	 * @return	{int}	The distance between the two points.
	 */
	distance: function(point) {
		return Math.sqrt(
			(this.x-point.x)*(this.x-point.x) + 
			(this.y-point.y)*(this.y-point.y));
	}
}


/**
 * Initialize the game.
 */
$(document).ready(function() {

	// When we're ready, off we go.
	Snake.game.init();
});

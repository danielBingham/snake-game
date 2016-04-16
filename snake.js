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


// ----------------------------------------------------------------------------
// 		Snake.Character
// ----------------------------------------------------------------------------

/**
 * Initialize the character in the game world. Creates the character,
 * initializes the vectors and places the character in to the world.
 * @constructor
 * @param	{Snake.World}	world - The world in to which we want to place
 * 		the character.
 */
Snake.Character = function (world) {
	/**
	 * @constant
	 * @type	{Snake.Point}
	 */
	this.UP = new Snake.Point(0, -1);

	/**
	 * @constant
	 * @type	{Snake.Point}
	 */
	this.DOWN = new Snake.Point(0, 1);

	/**
	 * @constant
	 * @type	{Snake.Point}
	 */
	this.LEFT = new Snake.Point(-1, 0);

	/**
	 * @constant
	 * @type	{Snake.Point}
	 */
	this.RIGHT = new Snake.Point(1, 0);

	/**
	 * @property	{object}	head - A vector defining the position and
	 * 		direction of the character's head.
	 */
	this.head = { position: null, direction: null };

	/**
	 * @property	{Snake.Point}	position - The position of the character's
	 * 		head in the world map, in squares.
	 */
	this.head.position = new Snake.Point(1,3);

	/**
	 * @property	{Snake.Point}	direction - The direction vector of the character's head.
	 */
	this.head.direction = new Snake.Point(this.DOWN.x, this.DOWN.y);


	/**
	 * @property	{object}	tail - A vector defining hte position and
	 * 		direction of the character's head. 
	 */
	this.tail = { position: null, direction: null };

	/**
	 * @property	{Snake.Point}	position - The character's current position
	 * 		in the world map, in squares.
	 */
	this.tail.position = new Snake.Point(1,1);

	/**
	 * @property	{Snake.Point}	direction - The direction of the character's tail.
	 */
	this.tail.direction = new Snake.Point(this.DOWN.x, this.DOWN.y);


	// Add the character to the world with an initial position and directions.
	world.squares[1][1] = "S-down";
	world.squares[1][2] = "S-down";
	world.squares[1][3] = "S-down";
};

/**
 * The player's character.
 *
 * Prototype of the Character class.
 */
Snake.Character.prototype = {

	/**
	 * A generalized method to set the direction of one of the
	 * character's vectors (head or tail).
	 *
	 * @param	{object}	object - The vector on which to set the
	 * 		direction. One of head or tail.
	 * @param	{string}	direction - String representation of the
	 * 		direction to set.  From [left,right,up,down].
	 *
	 * @throws {string}	An exception is throw when the direction is not
	 * 		recognized.
	 */
	setDirection: function(object, direction) {
		if (direction == "left") {
			object.direction.copy(this.LEFT);
		} else if (direction == "right") {
			object.direction.copy(this.RIGHT);
		} else if (direction == "up") {
			object.direction.copy(this.UP);
		} else if (direction == "down") {
			object.direction.copy(this.DOWN);
		} else {
			throw new Error(direction + " is not a recognized direction.");
		}				
	},

	/**
	 * A generalized getter to determine what direction one of the
	 * character's vectors is going.
	 *
	 * @param	{object}	object - One of the character's vectors (head
	 * 		or tail).
	 * @returns	{string}	The direction in which the character's vector
	 * 		is going in string form.  From [left,right,up,down].
	 */
	getDirection: function(object) {
		if (object.direction.equals(this.LEFT)) {
			return "left";
		} else if (object.direction.equals(this.RIGHT)) {
			return "right";
		} else if (object.direction.equals(this.UP)) {
			return "up";
		} else if (object.direction.equals(this.DOWN)) {
			return "down";
		} else {
			throw new Error("A direction vector is in an unrecognized state.");
		}
	},

	/**
	 * Abstraction over the direction head going.  Set the direction
	 * using left, right, up and down rather than the velocity point.
	 *
	 * @param	{string}	direction - The direction to set.  From the
	 * 		set [up,down,left,right].
	 */
	setHeadDirection: function(direction) {
		this.setDirection(this.head, direction);
	},

	/**
	 * Abstraction over the direction head going.  Get the direction
	 * using left, right, up and down rather than the velocity point.
	 *
	 * @returns	{string}	The direction in which the head is going.
	 */
	getHeadDirection: function() {
		return this.getDirection(this.head);
	},

	/**
	 * Abstraction over the direction tail is going.  Set the direction
	 * using left, right, up and down rather than the velocity point.
	 *
	 * @param	{string}	direction - The direction to set the tail
	 * 		to travelling.  From the set [up,down,left,right].
	 */
	setTailDirection: function(direction) {
		this.setDirection(this.tail, direction);
	},

	/**
	 * Abstraction over the direction the tail going.  Get the direction
	 * using left, right, up and down rather than the velocity point.
	 *
	 * @returns	{string}	The direction the tail is going.
	 */
	getTailDirection: function() {
		return this.getDirection(this.tail);	
	},


	/**
	 *  A method to update the character's location in the game world.
	 *
	 *  @param	{object}	world - The game world in which the character
	 *  		resides.
	 *  @param	{object}	game - The game in which the character is
	 *  		playing.
	 */
	move: function(world, game) {
		if (this.detectCollision(world)) {
			game.game_over = true;
			return;
		}

		var ate_block = this.moveHead(world, game);
		if ( ! ate_block) {
			this.moveTail(world, game);
		}

		return ate_block;
	},

	/**
	 * Move the snake's head.
	 *
	 * @param	{object}	world - The game world in which we are moving
	 * 		this character's head.
	 * @param	{object}	game - The game in which this character exists.
	 */
	moveHead: function(world, game) {
		var ate_block = false;

		world.squares[this.head.position.x][this.head.position.y] = "S-" + this.getHeadDirection();
		this.head.position.add(this.head.direction);
		if (world.squares[this.head.position.x][this.head.position.y] == "B") {
			ate_block = true;		
		}
		world.squares[this.head.position.x][this.head.position.y] = "S-" + this.getHeadDirection();
		return ate_block;
	},

	/**
	 *  Move the snake's tail.
	 *
	 *  @fixme There's a hiesenbug in this method that will sometimes crash
	 *  the game on an error.  The infrequency and inconsistency with which
	 *  it occurs makes me suspect some sort of race condition.
	 *
	 *  @param	{object}	world - The world in which we are moving the
	 * 		character's tail.
	 * 	@param	{object}	game - The game in which this character exists.
	 */
	moveTail: function(world, game) {
		world.squares[this.tail.position.x][this.tail.position.y] = " ";	
		this.tail.position.add(this.tail.direction);	
		var tail_direction = world.squares[this.tail.position.x][this.tail.position.y].split('-')[1];
		this.setTailDirection(tail_direction);
	},

	/**
	 * Determine if the snake's head had any deadly collisions.
	 *
	 * @param	{object}	world - The world in which the character exists.
	 */
	detectCollision: function(world) {

		// Find where we'll be after the move.	
		var position = new Snake.Point(this.head.position.x,this.head.position.y);
		position.add(this.head.direction);

		// First see if we've walked off the world.
		if ( position.x >= world.width || position.x < 0 
			|| position.y >= world.height || position.y < 0) {
				return true;
		} else if (world.squares[position.x][position.y][0] == "S") {
			return true;
		}

		return false;
	}

};


// ----------------------------------------------------------------------------
//		Snake.World
// ----------------------------------------------------------------------------

/**
 *
 * Initialize the game world.
 * @constructor
 * @param	{Snake.config}	config - A configuration object. 
 */
Snake.World = function(config) {

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
Snake.World.prototype = {

	/**
	 * Generate a random coordinate point a certain distance from
	 * the edges of the world.
	 *
	 * @return	{Snake.Point}	A point object with a randomly generated
	 * coordinate.
	 */
	randomCoordinate: function() {
		var x = Math.floor(Math.random() * (this.width-4) + 2);
		var y = Math.floor(Math.random() * (this.height-4) + 2);	

		return new Snake.Point(x, y);
	},

	/**
	 * Generate a new block and place it randomly on the world.
	 */
	generateBlock: function() {
		var block = this.randomCoordinate();
		while (this.squares[block.x][block.y] != " "
			&& block.distance(Snake.character.head) < 5) {
			block = this.randomCoordinate();
		}

		this.squares[block.x][block.y] = "B";
	}
}

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

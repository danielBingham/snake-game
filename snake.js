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
			Snake.character.init(Snake.world);
			Snake.view.init(Snake.config, Snake.world);

			Snake.draw.init($("#snake")[0]);
			Snake.command.init();
			$("#snake").focus();
			Snake.animate.init(Snake.config);
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

	/**
	 * The player's character.
	 */
	character: {

		// Constants: Direction vectors for each possible
		// direction of travel.
		UP: null,
		DOWN: null,
		LEFT: null,
		RIGHT: null,

		/**
		 * The character's head vector.
		 *
		 * @type	{object}
		 */
		head: {
			/**
			 * The position of the character's head.
			 *
			 * @type	{object}
			 */
			position: null,

			/**
			 * The direction vector of the character's head.
			 *
			 * @type	{object}
			 */
			direction: null 
		},

		/**
		 * The character's tail vector.
		 *
		 * @type	{object}
		 */
		tail: {

			/**
			 * The position of the character's tail.
			 *
			 * @type	{object}
			 */
			position: null,

			/**
			 * The direction vector of the character's tail.
			 *
			 * @type	{object}
			 */
			direction: null 
		}, 

		/**
		 * Initialize the character in the game world. Creates the character,
		 * initializes the vectors and places the character in to the world.
		 *
		 * @param	{object}	world - The world in to which we want to place
		 * 		the character.
		 */
		init: function (world) {
			this.UP = new Snake.point(0, -1);
			this.DOWN = new Snake.point(0, 1);
			this.LEFT = new Snake.point(-1, 0);
			this.RIGHT = new Snake.point(1, 0);

			world.squares[1][1] = "S-down";
			world.squares[1][2] = "S-down";
			world.squares[1][3] = "S-down";

			this.head.position = new Snake.point(1,3);
			this.head.direction = new Snake.point(this.DOWN.x, this.DOWN.y);

			this.tail.position = new Snake.point(1,1);
			this.tail.direction = new Snake.point(this.DOWN.x, this.DOWN.y);
		},



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
			var position = new Snake.point(this.head.position.x,this.head.position.y);
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


	},



	/**
	 * A wrapper around the canvas and its context to implement any drawing
	 * methods we need.
	 */
	draw: {
		/**
		 * The canvas element on which we are drawing.
		 *
		 * @type	{object}
		 */
		canvas: null, 

		/**
		 * The 2d context of the canvas element on which we are drawing.
		 *
		 * @type	{object}
		 */
		context: null,

		/**
		 * Initialize our drawing library with the canvas.
		 */
		init: function(canvas) {
			this.canvas = canvas;
			this.context = canvas.getContext("2d");	
		},

		/**
		 * Draw a rectangle.
		 *
		 * @param	{int}	x - X coordinate on the canvas pixel coordinate plane.
		 * @param	{int}	y - Y coordinate on the canvas pixel coordinate plane.
		 * @param	{int}	width - The width of the rectangle in pixels.
		 * @param	{int}	height - The height of the rectangle in pixels.
		 */
		rectangle: function(x,y,width,height) {
			this.context.fillRect(x,y,width,height);
		},

		/**
		 * Clear the canvas.
		 *
		 * @todo Decouple this from the view.
		 */
		clear: function() {
			this.context.clearRect(0,0,Snake.view.width,Snake.view.height);
		}
	},

	/**
	 * A basic command interpreter.
	 */
	command: {
		// Constants: values of certain keyboard characters.
		KEY_LEFT: 37,
		KEY_RIGHT: 39,
		KEY_UP: 38,
		KEY_DOWN: 40,
		KEY_SPACE: 32,

		/**
		 * Snake head's direction at the time of the previous frame's rendering.
		 *
		 * Fixes a bug where the player hitting two directions in the space
		 * of a single game update could result in the snake turning back
		 * on itself and the game ending.
		 *
		 * @type	{string}
		 */
		previous_direction: "",

		/**
		 * Initialize the command interpreter by registering any
		 * listeners we need.
		 */
		init: function() {
			// Register the keyboard listener for arrow key control.
			$(document).keydown(this.listen);

			// Register a click listener to start a new game if the 
			// last one ended.
			$("#snake").click(function(event) {
				if (Snake.game.game_over) {
					Snake.game.reinit();
				}
			});
		},

		/**
		 * Listen to keydown events and handle them accordingly.
		 *
		 * @fixme There's something weird going on with scope here.  Don't have
		 * time to figure it out right now, so just use global scope
		 * references.  I suspect _.bind() could help with that scoping
		 * issue...
		 *
		 * @param	{object}	event - A jquery event object.
		 */
		listen: function(event) {
			if (event.which == Snake.command.KEY_SPACE) {
				event.preventDefault();
				if ( ! Snake.game.paused) {
					Snake.game.paused = true;
				} else {
					Snake.game.paused = false;
					Snake.animate.init(Snake.config);
					$("#message").html(" ");
				}
				return;
			}

			// Turn left.
			if (event.which == Snake.command.KEY_LEFT) {
				// Can't go in the opposite direction, so just ignore it.
				if (Snake.command.previous_direction == "right") {
					return;
				}
				Snake.character.setHeadDirection("left");
				event.preventDefault();


			// Turn right.
			} else if (event.which == Snake.command.KEY_RIGHT) {
				// Can't go in the opposite direction, so just ignore it.
				if (Snake.command.previous_direction == "left") {
					return;
				}
				Snake.character.setHeadDirection("right");
				event.preventDefault();

			// Turn up.
			} else if (event.which == Snake.command.KEY_UP) {
				// Can't go in the opposite direction, so just ignore it.
				if (Snake.command.previous_direction == "down") {
					return;
				}
				Snake.character.setHeadDirection("up");
				event.preventDefault();

			// Turn down.
			} else if (event.which == Snake.command.KEY_DOWN) {
				// Can't go in the opposite direction, so just ignore it.
				if (Snake.command.previous_direction == "up") {
					return;
				}
				Snake.character.setHeadDirection("down");
				event.preventDefault();
			}

		}

	},

	/**
	 * The view port through which we are viewing the game world.
	 */
	view: { 

		/**
		 * Width of the game world, in pixels.
		 * @type	{int}
		 */
		width: 0,

		/**
		 * Height of the game world, pixels.
		 * @type	{int}
		 */
		height: 0,

		/**
		 * Size of a single game square, in pixels.
		 * @type	{int}
		 */
		square_size: 1,	

		/**
		 * Initialize the view.
		 *
		 * @param	{object}	config - A configuration object (Snake.config).
		 * @param	{object}	world  - An object representing the world state.
		 */
		init: function(config, world) {
			this.square_size = config.square_size;

			this.width = world.width * this.square_size;
			this.height = world.height * this.square_size; 

			$("#snake").attr("width", this.width);
			$("#snake").attr("height", this.height);

			$("#game-wrapper").css("width", this.width + 10);
			$("#game-wrapper").css("height", this.height + 10);
		},

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
		render: function(world) {
			// Clear the view.
			Snake.draw.clear();

			// Redraw the world.
			for (var x = 0; x < world.width; x++) {
				for (var y = 0; y < world.height; y++) {

					// The square is occupied by the Snake. 
					if (world.squares[x][y][0] == "S") {
						Snake.draw.rectangle(
							x * this.square_size,
							y * this.square_size,
							this.square_size,
							this.square_size);	
					} else if (world.squares[x][y] == "B") {
						Snake.draw.rectangle(
							x * this.square_size,
							y * this.square_size,
							this.square_size,
							this.square_size);	
					}

				}
			}
		}
	},

	/**
	 * Handle animating the world.
	 */
	animate: {

		/**
		 * A unix timestamp recording the time at which
		 * the previous frame was rendered.
		 * @type	{int}
		 */
		last_frame: 0,

		/**
		 * A configuration property setting the framerate
		 * at which we wish to run the game.
		 * @type	{int}
		 */
		frame_rate: 60,

		/**
		 * Initialize the game's animation and set the game to running.
		 *
		 * @param	{object}	config - A configuration object. (Snake.config)
		 */
		init: function(config) {
			this.frame_rate = config.frame_rate;	

			// Set up the game loop.
			Snake.animate.last_frame = new Date().getTime();
			gameLoop = function() {
				var animation_id = window.requestAnimationFrame(gameLoop);
					
				var now = new Date().getTime();	

				if (now - Snake.animate.last_frame > 1000/Snake.animate.frame_rate) {
					Snake.animate.last_frame = now;
					Snake.game.update();
				}

				if (Snake.game.game_over) {
					$("#message").html("Game over!");
					window.cancelAnimationFrame(animation_id);
				} else if (Snake.game.paused) {
					$("#message").html("Game paused.");
					window.cancelAnimationFrame(animation_id);
				}
			}

			// Run the game loop.
			gameLoop();
		}
	}

};

// ------------------
//		Snake.World
// ------------------

/**
 *
 * Initialize the game world.
 *
 * @param	{object}	config - A configuration object. (Snake.config)
 */
Snake.World = function(config) {
	// The width of the game world in squares.  
	this.width = 80;

	// The height of the game world in squares.
	this.height = 80; 

	 // Array recording the position of all game items.
	this.squares = [];

	this.width = config.world_width;
	this.height = config.world_height;

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
 */
Snake.World.prototype = {

	/**
	 * Generate a random coordinate point a certain distance from
	 * the edges of the world.
	 *
	 * @return	{object}	A point object with a randomly generated
	 * coordinate.
	 */
	randomCoordinate: function() {
		var x = Math.floor(Math.random() * (this.width-4) + 2);
		var y = Math.floor(Math.random() * (this.height-4) + 2);	

		return new Snake.point(x, y);
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

//--------------------------
// 		Snake.Point
//-------------------------

/**
 * Define a point class we can use for coordinates.
 * @constructor
 * @param	{int}	x - The x coordinate.
 * @param	{int}	y - The y coordinate.
 */
Snake.point = function(x,y) {
	this.x = x;
	this.y = y;
};

/**
 * Prototype of the point class.
 */
Snake.point.prototype = { 

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



$(document).ready(function() {

	// When we're ready, off we go.
	Snake.game.init();
});

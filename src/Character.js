define([
	"underscore",
	"jquery",
	"Point"
], function(
	_,
	$,
	Point
) {

/**
 * Initialize the character in the game world. Creates the character,
 * initializes the vectors and places the character in to the world.
 * @constructor
 * @param	{World}	world - The world in to which we want to place
 * 		the character.
 */
var Character = function (world) {

	/**
	 * @constant
	 * @type	{Point}
	 */
	this.UP = new Point(0, -1);

	/**
	 * @constant
	 * @type	{Point}
	 */
	this.DOWN = new Point(0, 1);

	/**
	 * @constant
	 * @type	{Point}
	 */
	this.LEFT = new Point(-1, 0);

	/**
	 * @constant
	 * @type	{Point}
	 */
	this.RIGHT = new Point(1, 0);

	/**
	 * @property	{object}	head - A vector defining the position and
	 * 		direction of the character's head.
	 */
	this.head = { position: null, direction: null };

	/**
	 * @property	{Point}	position - The position of the character's
	 * 		head in the world map, in squares.
	 */
	this.head.position = new Point(1,3);

	/**
	 * @property	{Point}	direction - The direction vector of the character's head.
	 */
	this.head.direction = new Point(this.DOWN.x, this.DOWN.y);


	/**
	 * @property	{object}	tail - A vector defining hte position and
	 * 		direction of the character's head. 
	 */
	this.tail = { position: null, direction: null };

	/**
	 * @property	{Point}	position - The character's current position
	 * 		in the world map, in squares.
	 */
	this.tail.position = new Point(1,1);

	/**
	 * @property	{Point}	direction - The direction of the character's tail.
	 */
	this.tail.direction = new Point(this.DOWN.x, this.DOWN.y);


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
	 *  @param	{World}	world - The game world in which the character
	 *  		resides.
	 *  @param	{Game}	game - The game in which the character is
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
	 * @param	{World}	world - The game world in which we are moving
	 * 		this character's head.
	 * @param	{Game}	game - The game in which this character exists.
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
		var position = new Point(this.head.position.x,this.head.position.y);
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

return Character;

});

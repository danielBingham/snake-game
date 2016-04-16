define(
[
	"underscore",
	"jquery",
	"Game"
], 
function(
	_,
	$,
	Game
) {

// ----------------------------------------------------------------------------
// 		Command
// ----------------------------------------------------------------------------

/**
 * Initialize the command interpreter by registering any
 * listeners we need.
 *
 * @constructor
 */
var Command = function(game) {

	/**
	 * @property	{Game}	game	- The object representing the game's data.
	 * 		Also serves as a dependency wrapper.
	 */
	this.game = game;
		
	/**
	 * @property	{string} 	previous_direction - Snake head's direction at
	 * 		the time of the previous frame's rendering.
	 *
	 * Fixes a bug where the player hitting two directions in the space
	 * of a single game update could result in the snake turning back
	 * on itself and the game ending.
	 */
	this.previous_direction = "";

	// Register the keyboard listener for arrow key control.
	$(document).keydown(_.bind(this.listen, this));

	// Register a click listener to start a new game if the 
	// last one ended.
	$("#snake").click(function(event) {
		if (this.game.game_over) {
			this.game.reinit();
		}
	});
};

/**
 * @constant
 * @type	{int}
 */
Command.KEY_LEFT = 37;

/**
 * @constant
 * @type	{int}
 */
Command.KEY_RIGHT = 39;

/**
 * @constant
 * @type	{int}
 */
Command.KEY_UP = 38;

/**
 * @constant
 * @type	{int}
 */
Command.KEY_DOWN = 40;

/**
 * @constant
 * @type	{int}
 */
Command.KEY_SPACE = 32;

/**
 * A basic command interpreter.
 */
Command.prototype = {

	/**
	 * Listen to keydown events and handle them accordingly.
	 *
	 * @param	{object}	event - A jquery event object.
	 */
	listen: function(event) {
		if (event.which == Command.KEY_SPACE) {
			event.preventDefault();
			if ( ! this.game.paused) {
				this.game.paused = true;
			} else {
				this.game.paused = false;
				this.game.animate.init(Snake.config);
				$("#message").html(" ");
			}
			return;
		}

		// Turn left.
		if (event.which == Command.KEY_LEFT) {
			// Can't go in the opposite direction, so just ignore it.
			if (this.previous_direction == "right") {
				return;
			}
			this.game.character.setHeadDirection("left");
			event.preventDefault();


		// Turn right.
		} else if (event.which == Command.KEY_RIGHT) {
			// Can't go in the opposite direction, so just ignore it.
			if (this.previous_direction == "left") {
				return;
			}
			this.game.character.setHeadDirection("right");
			event.preventDefault();

		// Turn up.
		} else if (event.which == Command.KEY_UP) {
			// Can't go in the opposite direction, so just ignore it.
			if (this.previous_direction == "down") {
				return;
			}
			this.game.character.setHeadDirection("up");
			event.preventDefault();

		// Turn down.
		} else if (event.which == Command.KEY_DOWN) {
			// Can't go in the opposite direction, so just ignore it.
			if (this.previous_direction == "up") {
				return;
			}
			this.game.character.setHeadDirection("down");
			event.preventDefault();
		}

	}

};

return Command;

});

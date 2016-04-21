
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
 * Handle animating the world.
 *
 * @constructor
 * 
 * @param	{object}	config - A configuration object. (Snake.config)
 */
var Animator = function(config) {

	/**
	 * @property	{int}	frame_rate - A configuration property setting the
	 * 		framerate at which we wish to run the game.
	 */
	this.frame_rate = config.frame_rate;	

	/**
	 * @property	{int}	last_frame - A unix timestamp recording the time at
	 * 		which the previous frame was rendered.
	 */
	this.last_frame = new Date().getTime();

};

/**
 * Handle animating the world.
 *
 * Prototype of the animation class.
 */
Animator.prototype = {

	/**
	 * Initialize the game's animation and set the game to running.
	 */
	start: function(game) {

		// Set up the game loop.
		var gameLoop = function(animator) {

			// To detach gameLoop from the global scope, we need to use
			// an anonymous function that inherits gameLoop's scope.  That
			// way it can pass the animate object it receives back to itself
			// when requestAnimationFrame() calls it to recurse.
			var animation_id = window.requestAnimationFrame(function() {
				gameLoop(animator);	
			});
		
			// Is it time to show a new frame?		
			var now = new Date().getTime();	
			if (now - animator.last_frame > 1000/animator.frame_rate) {
				animator.last_frame = now;
				game.update();
			}

			// Have we reached the end of the game?
			if (game.game_over) {
				$("#message").html("Game over!");
				window.cancelAnimationFrame(animation_id);

			// ...or are we paused and awaiting a space?
			} else if (game.paused) {
				$("#message").html("Game paused.");
				window.cancelAnimationFrame(animation_id);
			}
		};

		// Run the game loop.
		gameLoop(this);
	}

};

return Animator;

});

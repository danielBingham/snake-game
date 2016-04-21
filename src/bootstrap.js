/**
 * Snake
 *
 * A very basic javascript implementation of the classic snake game.
 *
 * See http://en.wikipedia.org/wiki/Snake_(video_game)
 *
 * Naming convention:
 *
 * 	underscore_case - For properties and variables.
 * 	camelCase - For methods and functions.
 * 	StudlyCase - For classes and top-level namespaces.
 *
 */

require.config({
	baseUrl: 'src',
	paths: {
		jquery: 'lib/jquery',
		underscore: 'lib/underscore'
	},
	shim: {
		'underscore': {
			exports: '_'
		}
	}
});


requirejs(
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

	/**
	 * Important configuration parameters all in one place.
	 */	
	var config = {

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
	};


	/**
	 * Initialize the game.
	 */
	$(document).ready(function() {

		var game = new Game(config);
		// When we're ready, off we go.
		game.init();
	});

});

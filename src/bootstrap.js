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
 * Initialize the game.
 */
$(document).ready(function() {

	var game = new Game();
	// When we're ready, off we go.
	game.init();
});

});

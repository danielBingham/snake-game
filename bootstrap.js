requirejs(
[
	"underscore",
	"jquery"
], 
function(
	_,
	$
) {

/**
 * Initialize the game.
 */
$(document).ready(function() {

	// When we're ready, off we go.
	Snake.game.init();
});

});

define(
[
	"underscore",
	"jquery"
], 
function(
	_,
	$
) {	

var Game = function() {

	/**
	 * The number of blocks the player has consumed.
	 *
	 * @type	{int}
	 */
	this.score = 0;

	/**
	 * Has the game ended?  
	 *
	 * @type	{boolean}
	 */
	this.game_over = false;

	/**
	 * Is the game currently paused?
	 *
	 * @type	{boolean}
	 */
	this.paused = false;

	/**
	 * Number of frames per update.  A low number is a fast moving game,
	 * a high number moves more slowly, but can result in missed commands.
	 * 
	 * @todo Implement a command queue to avoid missed commands on slow
	 * game speeds.
	 *
	 * @type	{int}
	 */
	this.game_speed = 2;

	/**
	 * A ticker recording each frame.
	 *
	 * @type	{int}
	 */
	this.tick = 0;
};

Game.prototype = {

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
	}
};

return Game;

});

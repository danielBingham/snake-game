define(
[
	"underscore",
	"jquery",
	"Animator",
	"Character",
	"Command",
	"Draw",
	"Game",
	"Point",
	"View",
	"World"
], 
function(
	_,
	$,
	Animator,
	Character,
	Command,
	Draw,
	Game,
	Point,
	View,
	World
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

	/**
	 *
	 */
	this.animator = null;

	/**
	 *
	 */
	this.character = null;

	/**
	 *
	 */
	this.command = null;

	/**
	 *
	 */
	this.draw = null;
	
	/**
	 *
	 */
	this.point = null;

	/**
	 *
	 */
	this.view = null;

	/**
	 *
	 */
	this.world = null;
};

Game.prototype = {

	/**
	 * Initialize the game.
	 */
	init: function() {

		this.game_speed = this.config.game_speed;

		// Initialize the game world.
		this.world = new World(this.config);
		this.character = new Character(this.world);
		this.view = new View(this.config, this.world);

		this.draw = new Draw($("#snake")[0], this.view.width, this.view.height);
		this.command = new Command();
		$("#snake").focus();

		this.animator = new Animator(this.config);
		this.animator.start();
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
			var ate_block = this.character.move(this.world, this.game);		
			if (ate_block) {
				this.world.generateBlock();
				this.score++;
			}
		
			this.command.previous_direction = this.character.getHeadDirection();	
			this.view.render(this.world);
			this.view.updateScore(this.score);
			
			this.tick = 0;
		}
	}
};

return Game;

});

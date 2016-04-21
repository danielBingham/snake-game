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

var Game = function(config) {

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
	 * An object containing configuration parameters for the game.
	 */
	this.config = config;

	/**
	 * Handles animating the world.
	 *
	 * @type	{Animator}
	 */
	this.animator = null;

	/**
	 * The snake character.
	 *
	 * @type	{Character}
	 */
	this.character = null;

	/**
	 * The command interpreter.
	 *
	 * @type	{Command}
	 */
	this.command = null;

	/**
	 * An object for drawing on the canvas.
	 *
	 * @type	{Draw}
	 */
	this.draw = null;

	/**
	 * The view object.
	 *
	 * @type	{View}
	 */
	this.view = null;

	/**
	 * The world wrapper.
	 *
	 * @type	{world}
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
		this.command = new Command(this);
		$("#snake").focus();

		this.animator = new Animator(this.config);
		this.animator.start(this);
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
			var ate_block = this.character.move(this.world, this);		
			if (ate_block) {
				this.world.generateBlock(this.character);
				this.score++;
			}
		
			this.command.previous_direction = this.character.getHeadDirection();	
			this.view.render(this.world, this.draw);
			this.view.updateScore(this.score);
			
			this.tick = 0;
		}
	}
};

return Game;

});

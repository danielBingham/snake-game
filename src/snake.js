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
		},

	},

};



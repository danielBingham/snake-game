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
 * Construct our canvas wrapper object.
 *
 * @constructor
 * @param	{object}	canvas - The HTML5 canvas element that we'll be drawing on.
 * 		Needs to be the native DOM element, not a JQuery wrapper.
 * @param	{int}	width - The width of our canvas in pixels.
 * @param	{int}	height - The height of our canvas in pixels.	
 */
var Draw = function(canvas, width, height) {

	/**
	 * @property	{int}	width - The width of our canvas in pixels.
	 */
	this.width = width;

	/**
	 * @property	{int}	height - The height of our canvas in pixels.
	 */
	this.height = height;

	/**
	 * @property	{object}	canvas - The canvas element on which we are drawing.
	 */
	this.canvas = canvas;

	/**
	 * The 2d context of the canvas element on which we are drawing.
	 *
	 * @type	{object}
	 */
	this.context = canvas.getContext("2d");	
};

/**
 * A wrapper around the canvas and its context to implement any drawing
 * methods we need.
 *
 * Prototype of the Draw class.
 */
Draw.prototype = {

	/**
	 * Draw a rectangle.
	 *
	 * @param	{int}	x - X coordinate on the canvas pixel coordinate plane.
	 * @param	{int}	y - Y coordinate on the canvas pixel coordinate plane.
	 * @param	{int}	width - The width of the rectangle in pixels.
	 * @param	{int}	height - The height of the rectangle in pixels.
	 */
	rectangle: function(x, y, width, height) {
		this.context.fillRect(x, y, width, height);
	},

	/**
	 * Clear the canvas.
	 *
	 * @todo Decouple this from the view.
	 */
	clear: function() {
		this.context.clearRect(0, 0, this.width, this.height);
	}
};


return Draw;

});

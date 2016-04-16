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
 * Define a point class we can use for coordinates.
 * @constructor
 * @param	{int}	x - The x coordinate.
 * @param	{int}	y - The y coordinate.
 */
var Point = function(x,y) {

	/**
	 * @property	{number}	x - The x coordinate.
	 */
	this.x = x;

	/**
	 * @property	{number}	y - The y coordinate.
	 */
	this.y = y;
};

/**
 *  A point class we can use for coordinates and vectors.
 *
 * Prototype of the point class.
 */
Point.prototype = { 

	/**
	 * Add two points.
	 *
	 * @param	{object}	point - The point to add to this.
	 * @return	this
	 */
	add: function(point) {
		this.x = this.x + point.x;
		this.y = this.y + point.y;
		return this;
	},

	/** 
	 * Multiply this point by a scalar.
	 *
	 * @param	{number}	scalar - The scalar with which to multiply this point.
	 * @return	this
	 */
	scalarMultiply: function(scalar) {
		this.x = this.x * scalar;
		this.y = this.y * scalar;
		return this;
	},

	/**
	 * Copy another point in to this point.
	 *
	 * @param	{object}	point - The point to copy.
	 * @return 	this
	 */
	copy: function(point) {
		this.x = point.x;
		this.y = point.y;
		return this;
	},

	/**
	 * Check for equality with another point.
	 *
	 * @param	{object}	point - The point to check against this for equality.
	 * @return	{boolean}	true if equal, false otherwise.
	 */
	equals: function(point) {
		if (this.x == point.x && this.y == point.y) {
			return true;
		}
		return false;
	},

	/**
	 * Calculate the distance between this point and another.
	 *
	 * @param	{object}	point - The point to calculate distance with.
	 * @return	{int}	The distance between the two points.
	 */
	distance: function(point) {
		return Math.sqrt(
			(this.x-point.x)*(this.x-point.x) + 
			(this.y-point.y)*(this.y-point.y));
	}
}

return Point;

});

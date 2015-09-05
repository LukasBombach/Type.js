'use strict';

var Util = require('./utilities');

/**
 *
 * @constructor
 */
function OOP() {
}

(function() {

  /**
   * Implements classical inheritance for the constructor pattern
   *
   * @param {Function} constructor - The child class that shall
   *     inherit attributes and methods
   * @param {Function} parentConstructor - The parent class that
   *     shall be inherited from
   * @returns {Function} The child class that inherited
   */
  OOP.inherits = function(constructor, parentConstructor) {
    OOP._inheritInstanceProperties(constructor, parentConstructor);
    OOP._inheritStaticProperties(constructor, parentConstructor);
    constructor._super = parentConstructor;
    return constructor;
  };

  /**
   *
   * @param constructor
   * @param parentConstructor
   * @returns {*}
   * @private
   */
  OOP._inheritInstanceProperties = function(constructor, parentConstructor) {
    constructor.prototype = Object.create(parentConstructor.prototype);
    constructor.prototype.constructor = constructor;
    return constructor;
  };

  /**
   *
   * @param constructor
   * @param parentConstructor
   * @returns {*}
   * @private
   */
  OOP._inheritStaticProperties = function(constructor, parentConstructor) {
    Util.extend(constructor, parentConstructor);
    return constructor;
  };

}).call(OOP);

/**
 * TODO THIS IS A TEMPORARY HACK AND THIS DOES NOT BELONG HERE
 * Inherit event system
 */
//OOP.inherits(Type, Type.Events);

module.exports = OOP;

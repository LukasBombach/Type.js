'use strict';

var Type = require('./core');

/**
 *
 * @constructor
 */
Type.OOP = function() {
};

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
  Type.OOP.inherits = function(constructor, parentConstructor) {

    // Inherit instance attributes and methods
    Type.OOP._copyPrototype(constructor, parentConstructor);

    // Inherit static attributes and methods
    Type.OOP._copyFunctionProperties(constructor, parentConstructor);

    // Add parent / super property
    constructor._super = parentConstructor;

    // Return the inheriting class for convenience
    return constructor;

  };

  /**
   *
   * @param constructor
   * @param parentConstructor
   * @returns {*}
   * @private
   */
  Type.OOP._copyPrototype = function(constructor, parentConstructor) {
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
  Type.OOP._copyFunctionProperties = function(constructor, parentConstructor) {

    var key;

    for (key in parentConstructor) {
      if (parentConstructor.hasOwnProperty(key))
        constructor[key] = parentConstructor[key];
    }

    return constructor;

  };

}).call(Type.OOP);

module.exports = Type.OOP;

'use strict';

var Type = require('./core');

/**
 * @constructor
 */
Type.Utilities = function() {
};

(function() {

  /**
   * This behaves similar to jQuery's extend method. Writes all properties
   * from the objects passed as copyFrom to the object passed  as copyTo.
   * Copying starts from left to right and will overwrite each setting
   * subsequently.
   *
   * @param {Object} copyTo
   * @param {...Object} copyFrom
   * @returns {Object}
   */
  Type.Utilities.extend = function(copyTo, copyFrom) {

    var i;
    var key;

    for (i = 1; i < arguments.length; i += 1) {
      for (key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }

    return arguments[0];
  };

  /**
   * Tests and returns if a given object is a function instance
   * todo this should be called isFunctionInstance otherwise typeof obj === 'Function' should be used
   *
   * @param obj
   * @returns {boolean}
   */
  Type.Utilities.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

}).call(Type.Utilities);

module.exports = Type.Utilities;

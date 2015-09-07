'use strict';

/**
 * @constructor
 */
function Utilities() {
}

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
  Utilities.extend = function(copyTo, copyFrom) {

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
   *
   * @param obj
   * @returns {boolean}
   */
  Utilities.isnInstance = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.process);
  };

}).call(Utilities);

module.exports = Utilities;

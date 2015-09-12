'use strict';

export default class Utilities {

  /**
   * This behaves similar to jQuery's extend method. Writes all properties
   * from the objects passed as copyFrom to the object passed  as copyTo.
   * Copying starts from left to right and will overwrite each setting
   * subsequently.
   *
   * todo use es6
   *
   * @param {Object} copyTo
   * @param {...Object} copyFrom
   * @returns {Object}
   */
  static extend(copyTo, copyFrom) {

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
   * todo instanceof Function ?
   *
   * @param {*} obj - An arbitrary object
   * @returns {boolean} - Whether or not the given object is a function instance
   */
  static isInstance(obj) {
    return !!(obj && obj.constructor && obj.call && obj.process);
  };

  /**
   * Tests and returns if a given object is a function
   *
   * @param {*} obj - An arbitrary object
   * @returns {boolean} - Whether or not the given object is a function
   */
  static isFunction(obj) {
    return typeof obj === 'function';
  };

  /**
   * Implements jQuery-style getting and setting of arguments
   *
   * @param instance
   * @param base
   * @param nameOrObject
   * @param value
   * @returns {*}
   */
  static getterSetterParams(instance, base, nameOrObject, value) {

    // Pass no name or value to return the base object
    if (arguments.length === 2) {
      return base;
    }

    // Pass a name to get a value
    if (typeof nameOrObject === 'string' && arguments.length === 3) {
      return base[nameOrObject];
    }

    // Pass a name and a value to set a value
    if (typeof nameOrObject === 'string' && arguments.length === 4) {
      base[nameOrObject] = value;
    }

    // Pass an object of key-values to set them
    if (typeof nameOrObject === 'object') {
      Utilities.extend(base, nameOrObject);
    }

    // If values have been set, return the instance for chaining
    return instance;

  };

  /**
   * Return's the window's horizontal an vertical scroll positions
   *
   * @returns {{top: (number), left: (number)}}
   * @private
   */
  static getScrollPosition() {
    return {
      top: window.pageYOffset || document.documentElement.scrollTop,
      left: window.pageXOffset || document.documentElement.scrollLeft
    };
  };

}

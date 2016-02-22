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
  }

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
  }

  /**
   * Tests and returns if a given object is a function
   *
   * @param {*} obj - An arbitrary object
   * @returns {boolean} - Whether or not the given object is a function
   */
  static isFunction(obj) {
    return typeof obj === 'function';
  }

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
    if (typeof nameOrObject === 'string' && value === undefined) { // arguments.length === 3) { // todo fix me, this is all crap
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

  }

  /**
   * Return's the window's horizontal an vertical scroll positions
   *
   * @returns {{top: (number), left: (number)}}
   * @private
   */
  static getScrollPosition() {
    return {
      top: window.pageYOffset || document.documentElement.scrollTop,
      left: window.pageXOffset || document.documentElement.scrollLeft,
    };
  }

  /**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. If `immediate` is set to false, trigger the function on the
   * trailing edge, instead of the leading.
   *
   * By David Walsh (modified) {@link http://davidwalsh.name/function-debounce}
   *
   * @param {Function} func - The function to debounce
   * @param {number} wait - The milliseconds to debounce the function for
   * @param {boolean} [immediate] - Optional defaults to true. If set to false
   *     will trigger the function on the trailing edge, instead of the leading.
   * @returns {Function} - The debounced function
   */
  static debounce(func, wait, immediate) {

    immediate = immediate !== false;

    let timeout;

    return function() {

      const _this = this;
      const args = arguments;

      const later = function() {
        timeout = null;
        if (!immediate) func.apply(_this, args);
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) func.apply(_this, args);

    };
  }

}

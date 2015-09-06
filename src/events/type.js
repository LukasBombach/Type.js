'use strict';

var Type = require('../core');

/**
 * Creates a new Type event
 * @constructor
 */
Type.Events.Type = function () {
  this.canceled = false;
};

(function () {

  /**
   * Sets or gets data for this event. Parameters can be set
   * and retrieved like in jQuery:
   *
   * Call data with no params to retrieve all data set:
   * this.data() -> {}
   *
   * Pass a single string to get specific data:
   * this.data('foo')
   *
   * Pass a name value combination to set data
   * this.data('foo', 'bar')
   *
   * Pass an object to set multiple data
   * this.data({foo: 'foo', 'bar':'bar'})
   *
   * @param {(string|Object)} data - Either a plain object
   *     with keys and values to be set or a string that will
   *     be used as a name for a data setting. If you pass a
   *     string, pass a second parameter to set that data
   *     or no second parameter to retrieve that data.
   * @param {*} [value] - If the first parameter is a string,
   *     this value will be set to the key of the given first
   *     parameter. Any arbitrary value can be set.
   * @returns {Type.Events.Type|{}|*} Returns this instance
   *     if you set data or the according value if you get
   *     data. Will return all data in an object of you pass
   *     no parameters.
   */

  this.data = function (data, value) {

    // Initialize data object if not initialized yet
    this._data = this._data || {};

    // Pass a single option name to fetch it
    if (typeof data === "string" && arguments.length === 1) {
      return this._data[data];
    }

    // Pass an option name and a value to set it
    if (typeof data === "string" && arguments.length === 2) {
      data = {options: value};
    }

    // Pass an object of key-values to set them
    if (typeof data === "object") {
      Type.Utilities.extend(this._data, data);
    }

    // Data of no params have been passed, otherwise this for chaining
    return arguments.length ? this : this._data;

  };

  /**
   * Sets this event instance to be cancelled
   *
   * @param {boolean} [doCancel] - Set to false to uncancel
   *     the event. All other values or no value at all
   *     will set the event to be cancelled
   * @returns {Type.Events.Type} - This instance
   */
  this.cancel = function (doCancel) {
    this.canceled = doCancel !== false;
    return this;
  };

}).call(Type.Events.Type.prototype);

module.exports = Type.Events.Type;

'use strict';

var Utilities = require('../utilities/utilities');

/**
 * Creates a new Type event
 * @constructor
 */
function TypeEvent() {
  this.canceled = false;
}

(function() {

  /**
   * jQuery getting and setting of the _data object
   * @param data
   * @param value
   * @returns {*}
   */
  this.data = function(data, value) {
    this._data = this._data || {};
    return Utilities.getterSetterParams(this, this._data, data, value);
  };

  /**
   * Sets this event instance to be cancelled
   *
   * @param {boolean} [doCancel] - Set to false to uncancel
   *     the event. All other values or no value at all
   *     will set the event to be cancelled
   * @returns {TypeEvent} - This instance
   */
  this.cancel = function(doCancel) {
    this.canceled = doCancel !== false;
    return this;
  };

}).call(TypeEvent.prototype);

module.exports = TypeEvent;

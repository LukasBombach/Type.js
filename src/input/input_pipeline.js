'use strict';

var Events = require('../events');
var KeydownEvent = require('../events/keydown');

/**
 *
 * @param {Type} type
 * @constructor
 */
function InputPipeline(type) {
  this._filters = [];
  this._addListener(type.getEl());
}

(function() {

  /**
   *
   * @param {EventTarget} el
   * @returns {InputPipeline}
   * @private
   */
  this._addListener = function(el) {
    Events.addListener(el, 'input', this._processPipeline.bind(this));
    return this;
  };

  /**
   *
   * @param {KeyboardEvent} e
   * @returns {KeydownEvent}
   * @private
   */
  this._processPipeline = function(e) {

    var keydownEvent = KeydownEvent.fromNativeEvent(e);
    var len = this._filters.length;
    var i;

    for (i = 0; i < len; i++) {
      if (!this._processFilter(this._filters[i], e)) {
        e.preventDefault();
        break;
      }
    }

    return keydownEvent;
  };

  /**
   *
   * @param filter
   * @param {KeydownEvent} e
   * @returns {boolean}
   * @private
   */
  this._processFilter = function(filter, e) {
    filter.apply(e);
    return e.canceled !== false;
  };

}).call(InputPipeline.prototype);

module.exports = InputPipeline;

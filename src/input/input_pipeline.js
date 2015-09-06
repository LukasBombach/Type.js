'use strict';

var Events = require('../events');

/**
 *
 * @param {Type} type
 * @constructor
 */
function InputPipeline(type) {
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
    Events.addListener(el, 'input', this._dispatchEvent.bind(this));
    return this;
  };

  /**
   *
   * @param {InputEvent} e
   * @returns {InputPipeline}
   * @private
   */
  this._dispatchEvent = function(e) {
    return this;
  };

}).call(InputPipeline.prototype);

module.exports = InputPipeline;

'use strict';

var Events = require('../utilities/events');
var KeydownEvent = require('../events/keydown');

var DebugFilter = require('../input_filters/debug');
var CommandFilter = require('../input_filters/command');

/**
 *
 * @param {Type} type
 * @constructor
 */
function InputPipeline(type) {
  this._type = type;
  this._filters = [];
  this._addDefaultFilters();
  this._addListener(type.getEl());
}

(function() {

  /**
   *
   * @param {TypeFilter} filter
   * @param {number} [pos]
   * @returns {InputPipeline}
   */
  this.addFilter = function(filter, pos) {
    pos = pos || filter.length;
    this._filters.splice(pos, 0, filter);
    return this;
  };

  /**
   *
   * @param {number|TypeFilter} posOrFilter
   * @returns {InputPipeline}
   */
  this.removeFilter = function(posOrFilter) {
    if (typeof posOrFilter !== 'number')
      posOrFilter = this._filters.indexOf(posOrFilter);
    if (posOrFilter > 0)
      this._filters.splice(posOrFilter, 1);
    return this;
  };

  /**
   *
   * @returns {InputPipeline}
   * @private
   */
  this._addDefaultFilters = function() {
    this.addFilter(new DebugFilter(this._type));
    this.addFilter(new CommandFilter(this._type));
    return this;
  };

  /**
   *
   * @param {EventTarget} el
   * @returns {InputPipeline}
   * @private
   */
  this._addListener = function(el) {
    Events.addListener(el, 'keydown', this._processPipeline.bind(this));
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
      if (!this._processFilter(this._filters[i], keydownEvent)) {
        e.stopPropagation();
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
    filter.process(e);
    return e.canceled === false;
  };

}).call(InputPipeline.prototype);

module.exports = InputPipeline;

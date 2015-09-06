'use strict';

/**
 *
 * @param {Type} type
 * @constructor
 */
function TypeFilter(type) {
  this._keys = {};
}

(function() {

  /**
   * Searches for a callback in the _keys map of this
   * filter and calls it with the given event. Will also
   * check for an 'all' definition as a fallback.
   *
   * @param {KeydownEvent} e - The event to apply the
   *     filter for.
   * @returns {TypeFilter} - This instance
   */
  this.apply = function(e) {
    var func = this._keys[e.key] || this._keys.all;
    if (func) this[func](e);
    return this;
  };

}).call(TypeFilter.prototype);

module.exports = TypeFilter;

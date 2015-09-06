'use strict';

/**
 *
 * @param {Type} type
 * @constructor
 */
function TypeFilter(type) {
}

(function() {

  /**
   *
   * @param {KeydownEvent} e
   * @returns {TypeFilter}
   */
  this.apply = function(e) {

    var func = this._keys[e.key] || this._keys.all;

    if (func) {
      this[func](e);
    }

    return this;
  };

}).call(TypeFilter.prototype);

module.exports = TypeFilter;

'use strict';

var TypeRange = require('./range');
var DomWalker = require('./utilities/dom_walker');

function TypeSelection() {
}

(function() {

  /**
   *
   * @param {Range|TypeRange|Node[]} param
   * @returns {TypeSelection}
   */
  TypeSelection.select = function(param) {

    if (arguments[0] instanceof Range) {
      return TypeSelection._selectRange(arguments[0]);
    }

    if (arguments[0] instanceof TypeRange) {
      return TypeSelection._selectTypeRange(arguments[0]);
    }

    if (Array.isArray(arguments[0])) {
      return TypeSelection._selectElements(arguments[0]);
    }

    return this;

  };

  /**
   *
   * @param {Node[]} elements
   * @returns {TypeSelection}
   * @private
   */
  TypeSelection._selectElements = function(elements) {
    var range = document.createRange();
    var firstText = DomWalker.first(elements[0], 'text');
    var lastText = DomWalker.last(elements[elements.length - 1], 'text');
    range.setStart(firstText, 0);
    range.setEnd(lastText, lastText.nodeValue.length - 1);
    return TypeSelection._selectRange(range);
  };

  /**
   *
   * @param {TypeRange} typeRange
   * @returns {TypeSelection}
   * @private
   */
  TypeSelection._selectTypeRange = function(typeRange) {
    return TypeSelection._selectRange(typeRange.getNativeRange());
  };

  /**
   *
   * @param {Range} range
   * @returns {TypeSelection}
   * @private
   */
  TypeSelection._selectRange = function(range) {
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    return this;
  };

}).call(TypeSelection);

module.exports = TypeSelection;

'use strict';

import TypeRange from './range';
import DomWalker from './utilities/dom_walker';

export default class TypeSelection {

  /**
   *
   * @returns {{start: number, end: number}}
   */
  static save() {
    TypeRange.fromCurrentSelection().save();
    return { start: 20, end: 30 };
  };

  /**
   *
   * @param {Range|TypeRange|Node[]} param
   * @returns {TypeSelection}
   */
  static select(param) {

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
  static _selectElements(elements) {
    var range = document.createRange();
    var firstText = DomWalker.first(elements[0], 'text');
    var lastText = DomWalker.last(elements[elements.length - 1], 'text');
    range.setStart(firstText, 0);
    range.setEnd(lastText, lastText.nodeValue.length);
    return TypeSelection._selectRange(range);
  };

  /**
   *
   * @param {TypeRange} typeRange
   * @returns {TypeSelection}
   * @private
   */
  static _selectTypeRange(typeRange) {
    return TypeSelection._selectRange(typeRange.getNativeRange());
  };

  /**
   *
   * @param {Range} range
   * @returns {TypeSelection}
   * @private
   */
  static _selectRange(range) {
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    return this;
  };

}
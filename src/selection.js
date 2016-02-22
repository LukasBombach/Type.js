'use strict';

import TypeRange from './range';
import DomWalker from './utilities/dom_walker';
import Events from  './utilities/events';

export default class TypeSelection {

  /**
   *
   * @param {Text} startContainer
   * @param {number} startOffset
   * @param {Text} endContainer
   * @param {number} endOffset
   * @param {Type} type
   * @constructor
   */
  constructor(startContainer, startOffset, endContainer, endOffset, type) {
    this._typeRange = new TypeRange(startContainer, startOffset, endContainer, endOffset);
    this._absOffsets = this._absoluteOffsetsFrom(type.getEl());
  }

  /**
   *
   * @returns {TypeSelection}
   */
  select() {
    this._typeRange = this._revalidateRange();
    this.constructor.select(this._typeRange);
    return this;
  }

  /**
   *
   * @returns {TypeSelection}
   */
  deselect() {
    this.constructor.deselect();
    return this;
  }

  /**
   *
   * @param {TypeSelection} that
   * @returns {boolean}
   */
  equals(that) {
    return this._typeRange.equals(that.getRange());
  }

  /**
   *
   * @returns {boolean}
   */
  isCollapsed() {
    return this._typeRange.isCollapsed();
  }

  /**
   *
   * @returns {{top: number, bottom: number, left: number, right: number}}
   */
  getBoundingRect() {
    return this._typeRange.getBoundingRect();
  }

  /**
   *
   * @returns {TypeRange}
   */
  getRange() {
    this._typeRange = this._revalidateRange();
    return this._typeRange;
  }

  /**
   *
   * @returns {TypeRange}
   * @private
   */
  _revalidateRange() {
    return this._typeRange.isValid() ? this._typeRange : TypeRange.load(this._absOffsets);
  }

  /**
   *
   * @param {Element} el
   * @returns {{from: Element, start: number, end: number}}
   * @private
   */
  _absoluteOffsetsFrom(el) {
    return this.getRange().save(el);
  }

  /**
   * todo not sure if returning null is good here
   * @param {Type} [type]
   * @returns {TypeSelection}
   * @constructor
   */
  static fromNativeSelection(type) {
    const range = window.getSelection().getRangeAt(0);
    if (type.getEl().contains(range.startContainer) && type.getEl().contains(range.endContainer))
      return TypeSelection.fromRange(range, type);
    return null;
  }

  /**
   *
   * @param {Range} range
   * @param {Type} [type]
   * @returns {TypeSelection}
   * @constructor
   */
  static fromRange(range, type) {
    return new TypeSelection(range.startContainer, range.startOffset, range.endContainer, range.endOffset, type);
  }

  /**
   * todo emit type select events, vielleicht 2ter parameter = type als opt in
   * todo oder Type (base class) verwaltet instanzen und kann die instanz die
   * todo die selection hat ausfindig machen
   *
   * @param {Range|TypeRange|Node[]} param
   * @returns {TypeSelection}
   */
  static select(param) {

    if (arguments[0] instanceof Range) {
      return TypeSelection._selectRange(arguments[0]);

    } else if (arguments[0] instanceof TypeRange) {
      return TypeSelection._selectTypeRange(arguments[0]);

    } else if (Array.isArray(arguments[0])) {
      return TypeSelection._selectElements(arguments[0]);
    }

    return this;

  }

  /**
   *
   * @returns {TypeSelection}
   */
  static deselect() {
    window.getSelection().removeAllRanges();
    return this;
  }

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
  }

  /**
   *
   * @param {TypeRange} typeRange
   * @returns {TypeSelection}
   * @private
   */
  static _selectTypeRange(typeRange) {
    return TypeSelection._selectRange(typeRange.getNativeRange());
  }

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
  }

}

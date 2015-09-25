'use strict';

import Formatter from './formatter';
import DomUtilities from '../utilities/dom_utilities';
import DomWalker from '../utilities/dom_walker';

export default class BlockFormatter extends Formatter {

  /**
   *
   * @param {Type} type
   * @constructor
   */
  constructor(type) {
    super();
    this._type = type;
  }

  /**
   *
   * @param {String} tag
   * @param {TypeRange} typeRange
   * @returns {Element[]}
   */
  format(tag, typeRange) {
    typeRange.ensureIsInside(this._type.getEl());
    const blocks = this._getAffectedBlocks(typeRange);

    if (this._everyTagIs(tag, blocks)) {
      return this._removeBlock(tag, blocks);
    } else {
      return this._turnInto(tag, blocks);
    }
  }

  /**
   *
   * @param tag
   * @param blocks
   * @returns {boolean}
   * @private
   */
  _everyTagIs(tag, blocks) {
    const len = blocks.length;
    for (let i = 0; i < len; i++)
      if (!this._elementIs(blocks[i], tag)) return false;
    return true;
  }

  /**
   *
   * @param {Element} el
   * @param {string} tag
   * @returns {boolean}
   * @private
   */
  _elementIs(el, tag) {
    return el.tagName && el.tagName.toLowerCase() === tag.toLowerCase();
  }

  /**
   *
   * @param {String} tag
   * @param {Element[]} blocks
   * @returns {Element[]} - The transformed elements
   * @private
   */
  _turnInto(tag, blocks) {
    const len = blocks.length;
    for (let i = 0; i < len; i++)
      blocks[i] = this.constructor._changeTag(blocks[i], tag);
    return blocks;
  }

  /**
   *
   * @param tag
   * @param blocks
   * @private
   */
  _removeBlock(tag, blocks) {
    const len = blocks.length;
    for (let i = 0; i < len; i++)
      blocks[i] = this._defaultTag(blocks[i]);
    return blocks;
  }

  /**
   * todo make static
   *
   * @param {TypeRange} typeRange
   * @returns {Element[]}
   * @private
   */
  _getAffectedBlocks(typeRange) {

    let node = typeRange.getStartContainer();
    const blocks = [this._getBlock(node)];
    const walker = new DomWalker(node, 'text');
    let endFound = typeRange.startsAndEndsInSameNode();

    while (!endFound && (node = walker.next())) {
      this.constructor._addIfNotAlreadyAdded(this._getBlock(node), blocks);
      endFound = node !== typeRange.getEndContainer();
    }

    return blocks;
  }

  /**
   * todo make static
   *
   * @param {Node|Element} node
   * @returns {Element|null}
   * @private
   */
  _getBlock(node) {
    const typeEl = this._type.getEl();
    do {
      if (this._isBlock(node)) return node;
    } while ((node = node.parentNode) && node !== typeEl);
    return null;
  }

  /**
   * todo make static
   *
   * @param {Node|Element} node
   * @returns {boolean}
   * @private
   */
  _isBlock(node) {
    return node.tagName && this.constructor._blockTags.indexOf(node.tagName.toLowerCase()) > -1;
  }

  /**
   * todo return new elements / unwrapped elements
   * @param {Element} el
   * @returns {Element|null}
   * @private
   */
  _defaultTag(el) {
    const newTag = this._type.options('defaultBlockTag');
    if (newTag) return this.constructor._changeTag(el, newTag);
    DomUtilities.unwrap(el);
    return null;
  }

  /**
   *
   * @param {Element} el
   * @param {string} newTag
   * @returns {Element}
   * @private
   */
  static _changeTag(el, newTag) {
    const newEl = document.createElement(newTag);
    let child;
    while (child = el.firstChild)
      newEl.appendChild(child);
    el.parentNode.replaceChild(newEl, el);
    return newEl;
  }

  /**
   *
   * @param {Element} block
   * @param {Element[]} arr
   * @returns {Element[]}
   * @private
   */
  static _addIfNotAlreadyAdded(block, arr) {
    if (arr.indexOf(block) === -1)
      arr.push(block);
    return arr;
  }

  /**
   * A list of tags that are displayed as block elements. We generate different
   * markup for inline and block tags. We use this array as reference to determine
   * what kind of markup to generate.
   *
   * @type {string[]}
   * @private
   */
  static get _blockTags() { return ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']; };

}
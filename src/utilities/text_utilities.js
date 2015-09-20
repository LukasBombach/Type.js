'use strict';

import DomWalker from './dom_walker';

/**
 * @constructor
 */
export default class TextUtilities {

  /**
   * todo make recusive?
   * @param {Node} startNode
   * @param {number} offset
   * @param {number} [startOffset]
   * @returns {{node: Text, offset: number}}
   */
  static nodeAtOffset(startNode, offset, startOffset = 0) {
    offset += startOffset;
    if (offset >= 0) {
      return this._walkForwardBy(startNode, offset);
    } else {
      return this._walkBackwardsBy(startNode, offset);
    }
  }

  /**
   *
   * @param {Node} fromNode
   * @param {Node} toNode
   * @param {number} [fromOffset]
   * @param {number} [toOffset]
   * @returns {number}
   */
  static offsetFrom(fromNode, toNode, fromOffset = 0, toOffset = 0) {
    let walker = new DomWalker(fromNode, 'textual');
    let node = walker.next(true);
    let offsetWalked = 0;
    do {
      if (node === toNode)
        return offsetWalked + toOffset - fromOffset;
      offsetWalked += this.textLength(node);
    } while (node = walker.next());
    return null;
  };

  /**
   *
   * @param {Text|Node} node
   * @returns {number}
   */
  static textLength(node) {
    if (node.nodeName.toLocaleLowerCase() === 'br') {
      return 1;
    } else {
      return node.nodeValue.trim().length;
    }
  };

  /**
   *
   * @param {Node} node
   * @param {number} offset
   * @returns {{node: Node, offset: number}}
   * @private
   */
  static _walkForwardBy(node, offset) {
    const walker = new DomWalker(node, 'text');
    let offsetWalked = 0;
    let length = 0;
    do {
      length = this.textLength(node);
      if (offsetWalked + length >= offset)
        return this._createNodeOffset(node, offset - offsetWalked);
      offsetWalked += length;
    } while (node = walker.next());
  }

  /**
   *
   * @param {Node} node
   * @param {number} offset
   * @returns {{node: Node, offset: number}}
   * @private
   */
  static _walkBackwardsBy(node, offset) {
    const walker = new DomWalker(node, 'text');
    let offsetWalked = 0;
    let length = 0;
    while (node = walker.prev()) {
      length = this.textLength(node);
      if (offsetWalked - length <= offset)
        return this._createNodeOffset(node, offset - offsetWalked);
      offsetWalked -= length;
    }
  }

  /**
   *
   * @param {Node} node
   * @param {number} offset
   * @returns {{node: Node, offset: number}}
   */
  static _createNodeOffset(node, offset) {
    return { node: node, offset: offset };
  }

}
'use strict';

import RenderNode from './render_node';

/**
 * @augments RenderNode
 */
export default class InlineRenderNode extends RenderNode {

  /**
   *
   * @param {TextNode} textNode
   */
  constructor(textNode) {
    this._attributes = textNode.getAttributes();
    this._text = textNode.getNodeValue();
  }

  /**
   *
   * @param that
   * @returns {InlineRenderNode}
   */
  addAsChild(that) {
    return this;
  }

  /**
   *
   * @param {InlineRenderNode} that
   * @returns {boolean}
   */
  canContain(that) {
    return !that.missingAttributes(this._attributes);
  }

  /**
   *
   * @param attrs
   * @returns {boolean}
   */
  missingAttributes(attrs) {
    const len = attrs.length;
    for (let i = 0; i < len; i++)
      if (this._indexOfAttribute(attrs[i]) === -1) return true;
    return false;
  }

  /**
   *
   * @param attr
   * @returns {number}
   * @private
   */
  _indexOfAttribute(attr) {
    const len = this._attributes.length;
    for (let i = 0; i < len; i++)
      if (InlineRenderNode._attributesAreEqual(this._attributes[i], attr)) return i;
    return -1;
  }

  /**
   *
   * @param a
   * @param b
   * @returns {boolean}
   * @private
   */
  static _attributesAreEqual(a, b) {
    return a[0] == b[0] && a[1] == b[1];
  }

}

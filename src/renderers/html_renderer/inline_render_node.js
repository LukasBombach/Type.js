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
    super();
    this._attributes = textNode.getAttributes();
    this._children = [textNode.getNodeValue()];
  }

  /**
   *
   * @param that
   * @returns {InlineRenderNode}
   */
  appendAsChild(that) {

    that.removeAttributes(this._attributes);
    let currentNode = this._children[this._children.length - 1];

    if (typeof currentNode === InlineRenderNode && currentNode.canContain(that)) {
      currentNode.appendChild(that);
    } else if (that.getAttributes().length) {
      this._children.push(that);
    } else {
      this._children = this._children.concat(that.getChildren());
    }

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
   * @param attrs
   * @returns {InlineRenderNode}
   */
  removeAttributes(attrs) {
    const len = attrs.length;
    let index = -1;
    for (let i = 0; i < len; i++)
      if (index = this._indexOfAttribute(attrs[i]) > -1) this._attributes.splice(index, 1);
  }

  /**
   *
   * @returns {Array}
   */
  getAttributes() {
    return this._attributes.slice(0);
  }

  /**
   *
   * @returns {Array}
   */
  getChildren() {
    return this._children.slice(0);
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

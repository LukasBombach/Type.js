'use strict';

/**
 * @augments RenderNode
 */
export default class InlineRenderNode {

  /**
   *
   * @param {TextNode} textNode
   */
  constructor(textNode) {
    this.textNode = textNode;
  }

  /**
   *
   * @param that
   * @returns {InlineRenderNode|boolean}
   */
  appendAsChild(that) {

    if (!this.canContain(that)) return false;

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
   * @param that
   * @returns {boolean}
   */
  canContain(that) {
    const thisAttrs = this.textNode.attributes;
    const thatAttrs = that.textNode.attributes;
    return that !== this && !!thisAttrs.length() && !!thisAttrs.diff(thatAttrs).length();
  }

}

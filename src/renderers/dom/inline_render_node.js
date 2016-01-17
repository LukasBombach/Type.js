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
    const additionalAttributes = that.textNode.attributes.diff(this.textNode.attributes);
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

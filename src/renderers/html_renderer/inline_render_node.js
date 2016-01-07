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
   * @param {InlineRenderNode} that
   */
  canBeMergedWith(that) {
    return that instanceof InlineRenderNode &&
        that.getAttributes().toString() == this._attributes.toString(); // todo this is a hack ja?
  }

  /**
   *
   * @returns {Array}
   */
  getAttributes() {
    return this._attributes;
  }

}

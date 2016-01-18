'use strict';

import TextRenderNode from './text_render_node';

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
    this.attributes = textNode.attributes.copy();
    this.children = [new TextRenderNode(textNode)];
  }

  /**
   *
   * @param {InlineRenderNode} that
   * @returns {InlineRenderNode|boolean}
   */
  appendAsChild(that) {
    if (!this.canContain(that)) return false;
    const child = new InlineRenderNode(that.textNode);
    child.attributes = that.attributes.diff(this.attributes);
    this.children.push(child);
    return this;
  }

  /**
   *
   * @param {InlineRenderNode} that
   * @returns {boolean}
   */
  canContain(that) {
    const thisAttrs = this.attributes;
    const thatAttrs = that.attributes;
    return that !== this && !!thisAttrs.length() && !thisAttrs.diff(thatAttrs).length();
  }

  /**
   *
   * @returns {Element}
   */
  getDomNode() {
    this.domNode = this.domNode || this._createDomNode();
    return this.domNode;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  _createDomNode() {
    const [before, after] = this._createInlineElements();
    let text = '';
    for (let child of this.children) text += child.getDomNode();
    return before + text + after;
  }

  /**
   *
   * @returns {[string,string]}
   * @private
   */
  _createInlineElements() {

    const map = InlineRenderNode._attributeElementMap;
    const attrs = this.attributes.get();
    let beforeAndAfter = '';

    while (attrs.length) {
      beforeAndAfter += map[attrs.pop()[0]];
    }

    return [beforeAndAfter, beforeAndAfter];

  }

  /**
   *
   * @returns {{bold: string, italic: string, underline: string, del: string}}
   */
  static get _attributeElementMap() {
    return {bold: '**', italic: '*', underline: '[u]', del: '-'};
  }

}

'use strict';

/**
 * @augments RenderNode
 */
export default class TextRenderNode {

  /**
   *
   * @param {TextNode} textNode
   */
  constructor(textNode) {
    this.textNodeId = textNode.id;
    this.text = textNode.text;
  }

  /**
   *
   * @returns {Text}
   */
  getDomNode() {
    this.domNode = this.domNode || this._createDomNode();
    return this.domNode;
  }

  /**
   *
   * @returns {Text}
   * @private
   */
  _createDomNode() {
    const textNode = document.createTextNode(this.text);
    Type.data(textNode, 'documentNodeId', this.textNodeId);
    return textNode;
  }

}

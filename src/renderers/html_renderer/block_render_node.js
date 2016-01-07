'use strict';

import RenderNode from './render_node';
import InlineRenderNode from './inline_render_node';

/**
 * @augments RenderNode
 */
export default class BlockRenderNode extends RenderNode {

  /**
   *
   * @param {BlockNode} documentBlockNode
   */
  constructor(documentBlockNode) {
    this.setDocumentNode(documentBlockNode);
  }

  /**
   *
   * @param {BlockNode} documentBlockNode
   * @returns {BlockRenderNode} - This instance
   */
  setDocumentNode(documentBlockNode = null) {
    this._documentNode = documentBlockNode;
    return this;
  }

  /**
   *
   * @returns {Element}
   */
  getDomNode() {
    const domBlockNode = document.createElement(this._documentNode.getNodeType());
    const renderChildren = this._getBlockRenderNodeChildren(this._documentNode);
    return domBlockNode;
  }

  /**
   *
   * @param {BlockNode} documentBlockNode
   * @returns {InlineRenderNode[]}
   * @private
   */
  _getBlockRenderNodeChildren(documentBlockNode) {

    const inlineRenderNodes =  documentBlockNode.getChildren().map(function(textNode) {
      return new InlineRenderNode(textNode);
    });

    return BlockRenderNode._mergeInlineNodes(inlineRenderNodes);
  }

  /**
   *
   * @param {InlineRenderNode[]} inlineNodes
   * @returns {InlineRenderNode[]}
   * @private
   */
  static _mergeInlineNodes(inlineNodes) {

    inlineNodes = inlineNodes.slice(0);
    const len = inlineNodes.length;
    let currentNode = inlineNodes[0];

    if (len === 1)
      return inlineNodes;

    for (let i = 0; i < len; i++) {
      if (currentNode.canContain(inlineNodes[i]))
        currentNode.addAsChild(inlineNodes[i]);
      else
        currentNode = inlineNodes[i];
    }

    return inlineNodes;

  }

}

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
    const blockRenderNodeChildren = this._getBlockRenderNodeChildren(this._documentNode);
    return domBlockNode;
  }

  /**
   *
   * @param {BlockNode} documentBlockNode
   * @returns {InlineRenderNode[]}
   * @private
   */
  _getBlockRenderNodeChildren(documentBlockNode) {
    return this._documentNode.getChildren().map(function(textNode) {
      return new InlineRenderNode(textNode);
    });
  }

  /**
   *
   * @param {InlineRenderNode[]} inlineNodes
   * @returns {InlineRenderNode[]}
   * @private
   */
  _mergeInlineNodes(inlineNodes) {
    inlineNodes = inlineNodes.slice(0);
    return inlineNodes;
  }

}

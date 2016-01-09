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
    super();
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
    if (this._domNode)
      return this._domNode;
    this._domNode = document.createElement(this._documentNode.getNodeType());
    const renderChildren = this._getBlockRenderNodeChildren(this._documentNode);
    const len = renderChildren.length;
    for (let i = 0; i < len; i++)
      this._domNode.appendChild(renderChildren[i].getDomNode());
    return this._domNode;
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

    const len = inlineNodes.length;
    let currentNode = inlineNodes[0];
    const mergedNodes = [currentNode];

    if (len === 1)
      return inlineNodes;

    for (let i = 1; i < len; i++) {
      if (currentNode.canContain(inlineNodes[i])) {
        currentNode.appendAsChild(inlineNodes[i]);
      } else {
        currentNode = inlineNodes[i];
        mergedNodes.push(inlineNodes[i]);
      }
    }

    console.log(mergedNodes);
    return mergedNodes;

  }

}

'use strict';

import InlineRenderNode from './inline_render_node';

/**
 * @augments RenderNode
 */
export default class BlockRenderNode {

  /**
   *
   * @param {BlockNode} documentBlockNode
   */
  constructor(documentBlockNode) {
    this.documentNode = documentBlockNode;
    this.children = this._getChildrenFor(documentBlockNode);
    this.domNode = null;
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
   * @returns {Element}
   * @private
   */
  _createDomNode() {
    const domNode = document.createElement(this.documentNode.blockType);
    for (let child of this.children) this._domNode.appendChild(child.getDomNode());
    Type.data(domNode, 'documentNodeId', this.documentNode.id);
    return domNode;
  }

  /**
   *
   * @param documentBlockNode
   * @private
   */
  _getChildrenFor(documentBlockNode) {
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
    const mergedNodes = [inlineNodes[0]];
    for (let node of inlineNodes)
      mergedNodes[mergedNodes.length - 1].appendAsChild(node) || mergedNodes.push(node);
    return mergedNodes;
  }

}

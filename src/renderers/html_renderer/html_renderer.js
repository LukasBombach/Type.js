'use strict';

import BlockNode from '../../document/block_node';
import TextNode from '../../document/text_node';

export default class HtmlRenderer {

  /**
   *
   * @param {Type} type
   */
  constructor(type) {
    this._document = type.getDocument();
    this._el = type.getEl();
  }

  /**
   *
   * @returns {HtmlRenderer}
   */
  render() {
    var renderNodes = HtmlRenderer._getRenderNodes(this._document);
  }

  /**
   *
   * @param document
   * @returns {RenderNode[]}
   * @private
   */
  static _getRenderNodes(document) {

  }

  /**
   *
   * @param {DocumentNode[]} nodes
   * @returns {Node[]}
   * @private
   */
  static _renderNodes(nodes) {
    nodes = nodes.length ? nodes : [nodes];
    const len = nodes.length;
    const domNodes = [];
    for (let i = 0; i < len; i++)
      domNodes.push(HtmlRenderer._getDomNodeFor(nodes[i]));
    return domNodes;
  }

  /**
   *
   * @param {BlockNode|TextNode} node
   * @returns {HTMLElement|Text}
   * @private
   */
  static _getDomNodeFor(node) {
    if (node instanceof BlockNode) return HtmlRenderer._getDomNodeForBlockNode(node);
    if (node instanceof TextNode) return HtmlRenderer._getDomNodeForTextNode(node);
  }

  /**
   *
   * @param {BlockNode} blockNode
   * @returns {HTMLElement}
   * @private
   */
  static _getDomNodeForBlockNode(blockNode) {
    return document.createElement(blockNode.nodeType);
  }

  /**
   *
   * @param {TextNode} textNode
   * @returns {Text}
   * @private
   */
  static _getDomNodeForTextNode(textNode) {
    return document.createTextNode(textNode.nodeValue);
  }

}

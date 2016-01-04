'use strict';

import BlockNode from '../document/block_node';
import TextNode from '../document/text_node';

export default class DomRenderer {

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
   * @returns {DomRenderer}
   */
  render() {
    this._el.innerHTML = '';
    this._el.appendChild();
    return DomRenderer._renderNodes(this._document);
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
      domNodes.push(DomRenderer._getDomNodeFor(node[i]));
    return domNodes;
  }

  /**
   *
   * @param {BlockNode|TextNode} node
   * @returns {HTMLElement|Text}
   * @private
   */
  static _getDomNodeFor(node) {
    if (nodes[i] instanceof BlockNode) return DomRenderer._getDomNodeForBlockNode(node);
    if (nodes[i] instanceof TextNode) return DomRenderer._getDomNodeForTextNode(node);
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

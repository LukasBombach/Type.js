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
    return DomRenderer._renderNodes(this._document.getNodes());
  }

  /**
   *
   * @param {DocumentNode[]} nodes
   * @returns {Node[]}
   * @private
   */
  static _renderNodes(nodes) {
    nodes = Array.isArray(nodes) ? nodes : [nodes];
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
    var domNode = document.createElement(blockNode.nodeType);
    const children = blockNode.children;
    const len = children.length;
    let currentChild = children[0];
    for (let i = 0; i < len; i++)
      domNode.appendChild(DomRenderer._getDomNodeFor(children[i]));
    return domNode;
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

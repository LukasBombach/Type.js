'use strict';

import BlockNode from './block_node';
import TextNode from './block_node';

/**
 * @augments DocumentNode
 */
export default class TypeDocument {

  /**
   *
   * @param {Type} type
   * @param {DocumentNode[]} nodes
   */
  constructor(type, nodes = []) {
    this._type = type;
    this._renderer = type.getRenderer();
    this.setNodes(nodes);
  }

  /**
   *
   * @param {string|Array} attribute
   * @param {DocumentRange} range
   * @returns {TypeDocument}
   */
  addAttributeAtRange(attribute, range) {
    attribute = typeof attribute === 'string' ? [attribute, true] : attribute;
    const affectedTextNodes = this._textNodesBetween.apply(this, TypeDocument._splitTextNodesAtRange(range));
    for (let node of affectedTextNodes) node.addAttribute(attribute);
    this._renderer.render();
    return this;
  }

  _textNodesBetween(startNode, endNode) {
    let nodes = [];
    for (let node of this._nodes) {
      if (node instanceof BlockNode) nodes = nodes.concat(node.getTextNodes());
      else if (node instanceof TextNode) nodes.push(node);
    }
    return nodes;
  }

  /**
   *
   * @param {number} id
   * @returns {BlockNode}
   */
  getNode(id) {
    return this._nodeMap[id.toString()];
  }

  /**
   *
   * @returns {DocumentNode[]}
   */
  getNodes() {
    return this._nodes;
  }

  /**
   *
   * @param {DocumentNode[]} nodes
   * @returns {TypeDocument}
   */
  setNodes(nodes) {
    this._nodes = TypeDocument._mergeEqualNodes(nodes);
    this._refreshNodeMap();
    return this;
  }

  /**
   *
   * @returns {TypeDocument}
   * @private
   */
  _refreshNodeMap() {
    const len = this._nodes.length;
    this._nodeMap = {};
    for (let i = 0; i < len; i++)
      this._nodeMap[this._nodes[i].id.toString()] = this._nodes[i];
    return this;
  }

  /**
   * todo use DomWalker to prevent walking outside the document
   * @returns {BlockNode}
   */
  getParentBlock(el) {

    let documentNodeId = null;
    let documentEl = this._type.getEl();

    while (el !== documentEl) {
      documentNodeId = type.data(el, 'documentNodeId');
      if (documentNodeId) return this.getNode(documentNodeId);
      el = el.parentNode;
    }

    return null;
  }

  /**
   *
   * @param {DocumentRange} range
   * @returns {TextNode[]} - All nodes within the range
   */
  static _splitTextNodesAtRange(range) {
    const [, startNode] = range.getStartTextNode().splitAt(range.startDomOffset);
    const [, endNode] = range.getEndTextNode().splitAt(range.endDomOffset);
    return [startNode, endNode];
  }

  /**
   * todo implement
   * @param {DocumentNode[]} nodes
   * @returns {DocumentNode[]}
   * @private
   */
  static _mergeEqualNodes(nodes) {
    nodes = nodes.slice(0);
    return nodes;
  }

}

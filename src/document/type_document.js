'use strict';

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
    this.setNodes(nodes);
  }

  /**
   *
   * @param {DocumentRange} range
   * @returns {TextNode[]} - All nodes within the range
   */
  splitTextNodesAtRange(range) {

    const startNode = range.getStartNode();
    const endNode = range.getEndNode();

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
    while (el !== documentEl)
      if (documentNodeId = type.data(el, 'documentNodeId'))
        return this.getNode(documentNodeId);
    return null;
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

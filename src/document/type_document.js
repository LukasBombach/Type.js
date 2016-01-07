'use strict';

/**
 * @augments DocumentNode
 */
export default class TypeDocument {

  /**
   *
   * @param {DocumentNode[]} nodes
   */
  constructor(nodes = []) {
    this.setNodes(nodes);
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
    return this;
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

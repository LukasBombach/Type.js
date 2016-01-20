'use strict';

import NodeCache from './node_cache';

/**
 * @augments DocumentNode
 */
export default class TypeNodeList {

  /**
   *
   * @param {DocumentNode[]|TypeNodeList}nodes
   */
  constructor(nodes = []) {
    this.nodes = nodes instanceof TypeNodeList ? nodes.nodes.slice(0) : nodes;
    this._cache = new NodeCache(this);
  }

  /**
   *
   * @param {TypeRange} range
   * @returns {TypeNodeList}
   */
  addAttributeAtRange(range) {

    const [startBlock, endBlock] = range.getBlockNodes();
    const [startBlockIndex, endBlockIndex] = nodes.getIndices(startBlock, endBlock);

    if (startBlock === endBlock) {
      nodes.splice(startBlockIndex, 1, startBlock.splitNodesAtRange(range));
    } else {
      nodes.splice(startBlockIndex, 1, startBlock.splitNodeAtRangeStart(range));
      nodes.splice(endBlockIndex, 1, startBlock.splitNodeAtRangeEnd(range));
    }

    return this;

  }

  /**
   *
   * @returns {DocumentNode[]}
   */
  getAll() {
    return this.nodes;
  }

  /**
   *
   * @param {number} index
   * @returns {DocumentNode}
   */
  getByIndex(index) {
    return this.nodes[index];
  }

  /**
   *
   * @param {number} id
   * @returns {DocumentNode}
   */
  getById(id) {
    return this._cache.get(id);
  }

  /**
   *
   * @param {DocumentNode} node
   * @returns {number}
   */
  getIndex(node) {
    return this.nodes.indexOf(node);
  }

  /**
   *
   * @param {DocumentNode[]} nodes
   * @returns {number[]}
   */
  getIndices(...nodes) {
    return nodes.map(n => this.nodes.indexOf(n));
  }

}
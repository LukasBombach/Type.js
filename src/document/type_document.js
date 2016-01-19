'use strict';

import BlockNode from './block_node';
import TextNode from './block_node';
import DocumentCache from './document_cache';

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
    this._cache = new DocumentCache(this);
    this.nodes = nodes;
  }

  /**
   *
   * @returns {TypeDocument}
   */
  copy() {
    return new TypeDocument(this._type, this.nodes.slice(0));
  }

  /**
   *
   * @param id
   * @returns {DocumentNode|null}
   */
  getNode(id) {
    return this._cache.get(id);
  }

  /**
   *
   * @param {TypeRange} range
   * @returns {TypeDocument}
   */
  addAttributeAtRange(range) {

    const newDocument = this.copy();
    const nodes = newDocument.nodes;
    const startBlock = range.startNode.parent;
    const endBlock = range.endNode.parent;
    const startBlockIndex = nodes.indexOf(startBlock);
    const endBlockIndex = nodes.indexOf(endBlock);

    if (startBlock === endBlock) {
      nodes.splice(startBlockIndex, 1, startBlock.splitNodesAtRange(range));
    } else {
      nodes.splice(startBlockIndex, 1, startBlock.splitNodeAtRangeStart(range));
      nodes.splice(endBlockIndex, 1, startBlock.splitNodeAtRangeEnd(range));
    }

    return newDocument;

  }

}
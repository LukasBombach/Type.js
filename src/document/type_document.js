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

    const nodes = this.nodes.slice(0);

  }

}
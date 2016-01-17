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
    this.nodes = nodes;
  }

}
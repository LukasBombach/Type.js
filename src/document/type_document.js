'use strict';

import TypeNodeList from './type_node_list';

/**
 * @augments DocumentNode
 */
export default class TypeDocument {

  /**
   *
   * @param {Type} type
   * @param {DocumentNode[]|TypeNodeList} nodes
   */
  constructor(type, nodes = []) {
    this._type = type;
    this.nodes = new TypeNodeList(nodes);
  }

  /**
   *
   * @returns {TypeDocument}
   */
  copy() {
    return new TypeDocument(this._type, this.nodes.copy());
  }

  /**
   *
   * @param id
   * @returns {DocumentNode|null}
   */
  getNode(id) {
    return this.nodes.getById(id);
  }

  /**
   *
   * @param {TypeRange} range
   * @returns {TypeDocument}
   */
  addAttributeAtRange(range) {
    const document = this.copy();
    document.nodes.addAttributeAtRange(range);
    return document;
  }

}

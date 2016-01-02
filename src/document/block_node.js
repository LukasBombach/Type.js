'use strict';

import DocumentNode from './document_node';

/**
 * @augments DocumentNode
 */
export default class BlockNode extends DocumentNode {

  constructor(children = [], attributes = []) {
    super();
    this.children = children;
    this.attributes = attributes;
  }

  /**
   *
   * @param {TextNode} child
   * @returns {BlockNode}
   */
  addChild(child) {
    this.children.push(child);
    return this;
  }

  /**
   *
   * @param {TextNode[]} children
   * @returns {BlockNode}
   */
  setChildren(children) {
    this.children = children;
    return this;
  }

}

'use strict';

import DocumentNode from './document_node';

/**
 * @augments DocumentNode
 */
export default class TextNode extends DocumentNode {

  constructor(nodeValue = null, attributes = []) {
    super();
    this.nodeValue = nodeValue;
    this.attributes = attributes;
  }

  /**
   *
   * @param {String} nodeValue
   * @returns {TextNode}
   */
  setNodeValue(nodeValue) {
    this.nodeValue = nodeValue;
    return this;
  }

}

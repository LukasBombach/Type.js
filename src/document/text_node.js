'use strict';

import DocumentNode from './document_node';

/**
 * @augments DocumentNode
 */
export default class TextNode extends DocumentNode {

  constructor(nodeValue = null, attributes = []) {
    super(attributes);
    this.setNodeValue(nodeValue);
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

  /**
   *
   * @returns {{BOLD: string, ITALIC: string, UNDERLINE: string}}
   * @constructor
   */
  static get ATTRIBUTES() {
    return {
      BOLD: 'bold',
      ITALIC: 'italic',
      UNDERLINE: 'underline',
    };
  }

}

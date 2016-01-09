'use strict';

import DocumentNode from './document_node';

/**
 * @augments DocumentNode
 */
export default class TextNode extends DocumentNode {

  constructor(type, nodeValue = null, attributes = []) {
    super(type, attributes);
    this.setNodeValue(nodeValue);
  }

  /**
   *
   * @param {String} nodeValue
   * @returns {TextNode}
   */
  setNodeValue(nodeValue) {
    this._nodeValue = nodeValue;
    return this;
  }

  /**
   *
   * @returns {String}
   */
  getNodeValue() {
    return this._nodeValue;
  }

  /**
   *
   * @returns {{BOLD: string, ITALIC: string, UNDERLINE: string, DEL: string}}
   * @constructor
   */
  static get ATTRIBUTES() {
    return {
      BOLD: 'bold',
      ITALIC: 'italic',
      UNDERLINE: 'underline',
      DEL: 'del',
    };
  }

}

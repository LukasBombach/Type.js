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
    this.length = this._nodeValue.length;
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
   * @param offset
   * @returns {[TextNode,TextNode]}
   */
  splitAtOffset(offset) {
    const left = new TextNode(this._type, this._nodeValue.substr(0, offset));
    const right = new TextNode(this._type, this._nodeValue.substr(offset));
    return [left, right];
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

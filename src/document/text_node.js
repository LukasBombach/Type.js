'use strict';

import DocumentNode from './document_node';

/**
 * @augments DocumentNode
 */
export default class TextNode extends DocumentNode {

  /**
   *
   * @param type
   * @param attributes
   * @param text
   */
  constructor(type, attributes = [], text) {
    super(type, attributes);
    this.text = text;
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

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
   * @param parent
   */
  constructor(type, attributes = [], text, parent) {
    super(type, attributes, parent);
    this.text = text.trim();
  }

  /**
   *
   * @returns {{BOLD: string, ITALIC: string, UNDERLINE: string, DEL: string}}
   * @constructor
   */
  static get ATTRIBUTES() {
    return { BOLD: 'bold', ITALIC: 'italic', UNDERLINE: 'underline', DEL: 'del', };
  }

}

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
    this.text = text;
  }

  /**
   *
   * @param {number} offset
   * @returns {[TextNode,TextNode]}
   */
  splitAtOffset(offset) {
    const left = new TextNode(this._type, this.attributes.copy(), this.text.substr(0, offset));
    const right = new TextNode(this._type, this.attributes.copy(), this.text.substr(offset));
    return [left, right];
  }

  /**
   *
   * @returns {{BOLD: string, ITALIC: string, UNDERLINE: string, DEL: string}}
   * @constructor
   */
  static get ATTRIBUTES() {
    return { BOLD: 'bold', ITALIC: 'italic', UNDERLINE: 'underline', DEL: 'del' };
  }

}

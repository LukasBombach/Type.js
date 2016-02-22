import TextRenderNode from './text_render_node';

/**
 * @augments RenderNode
 */
export default class InlineRenderNode {

  /**
   *
   * @param {TextNode} textNode
   */
  constructor(textNode) {
    this.textNode = textNode;
    this.attributes = textNode.attributes.copy();
    this.children = [new TextRenderNode(textNode)];
  }

  /**
   * todo what if that.attributes === this.attributes, only a text node should be added
   * @param {InlineRenderNode} that
   * @returns {InlineRenderNode|boolean}
   */
  appendAsChild(that) {
    if (!this.canContain(that)) return false;
    const child = new InlineRenderNode(that.textNode);
    child.attributes = that.attributes.diff(this.attributes);
    this.children.push(child);
    return this;
  }

  /**
   *
   * @param {InlineRenderNode} that
   * @returns {boolean}
   */
  canContain(that) {
    const thisAttrs = this.attributes;
    const thatAttrs = that.attributes;
    return that !== this && !!thisAttrs.length() && !thisAttrs.diff(thatAttrs).length();
  }

  /**
   *
   * @returns {Element}
   */
  getDomNode() {
    this.domNode = this.domNode || this._createDomNode();
    return this.domNode;
  }

  /**
   *
   * @returns {Element}
   * @private
   */
  _createDomNode() {
    const [domNode, innerNode] = this._createInlineElements();
    for (const child of this.children) innerNode.appendChild(child.getDomNode());
    return domNode;
  }

  /**
   *
   * @returns {[Element,Element]}
   * @private
   */
  _createInlineElements() {
    const map = InlineRenderNode._attributeElementMap;
    const attrs = this.attributes.get();
    const domNode = attrs.length ?
        document.createElement(map[attrs.pop()[0]]) :
        document.createDocumentFragment();
    let innerNode = domNode;

    while (attrs.length) {
      innerNode.appendChild(document.createElement(map[attrs.pop()[0]]));
      innerNode = innerNode.childNodes[0];
    }

    return [domNode, innerNode];
  }

  /**
   *
   * @returns {{bold: string, italic: string, underline: string, del: string}}
   */
  static get _attributeElementMap() {
    return { bold: 'strong', italic: 'em', underline: 'u', del: 'del' };
  }

}

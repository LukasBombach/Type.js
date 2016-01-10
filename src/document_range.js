'use strict';

import TextUtilities from './utilities/text_utilities';

export default class DocumentRange {

  /**
   *
   * @param {Node} startContainer
   * @param {number} startOffset
   * @param {Node} endContainer
   * @param {number} endOffset
   * @param {Type} [type]
   */
  constructor(startContainer, startOffset, endContainer, endOffset, type) {
    this.startDomNode = startContainer;
    this.startDomOffset = startOffset;
    this.endDomNode = endContainer;
    this.endDomOffset = endOffset;
    this._startBlockNode = null;
    this._endBlockNode = null;
    this._startTextNode = null;
    this._endTextNode = null;
    this._type = type;
  };

  /**
   *
   * @returns {TextNode}
   */
  getStartTextNode() {
    if (this._startTextNode) return this._startTextNode;
    const startBlockOffset = this._getStartDomBlockOffset();
    this._startTextNode = this.getStartBlockNode().getTextNodeAtOffset(startBlockOffset);
    return this._startTextNode;
  }

  /**
   *
   * @returns {TextNode}
   */
  getEndTextNode() {
    if (this._endTextNode) return this._endTextNode;
    const endBlockOffset = this._getEndDomBlockOffset();
    this._endTextNode = this.getStartBlockNode().getTextNodeAtOffset(endBlockOffset);
    return this._endTextNode;
  }

  /**
   *
   * @returns {BlockNode|null}
   */
  getStartBlockNode() {
    if (this._startBlockNode) return this._startBlockNode;
    this._startBlockNode = this._type.getDocument().getParentBlock(this.startDomNode);
    return this._startBlockNode;
  }

  /**
   *
   * @returns {BlockNode|null}
   */
  getEndBlockNode() {
    if (this._endBlockNode) return this._endBlockNode;
    this._endBlockNode = this._type.getDocument().getParentBlock(this.endDomNode);
    return this._endBlockNode;
  }

  /**
   *
   * @returns {number}
   * @private
   */
  _getStartDomBlockOffset() {
    var domBlockNode = this._type.getRenderer().getDomNodeFor(this.getStartBlockNode());
    return TextUtilities.offsetFrom(domBlockNode, this.startDomNode, 0, this.startDomOffset);
  }

  /**
   *
   * @returns {number}
   * @private
   */
  _getEndDomBlockOffset() {
    var domBlockNode = this._type.getRenderer().getDomNodeFor(this.getEndBlockNode());
    return TextUtilities.offsetFrom(domBlockNode, this.endDomNode, 0, this.endDomOffset);
  }

  /**
   *
   * @returns {DocumentRange|null}
   */
  static fromCurrentSelection() {
    const sel = document.getSelection();
    return sel.isCollapsed ? null : DocumentRange.fromRange(sel.getRangeAt(0));
  };

  /**
   *
   * @param {Range} range
   * @returns {DocumentRange}
   */
  static fromRange(range) {
    return new DocumentRange(range.startContainer, range.startOffset, range.endContainer, range.endOffset);
  };

}

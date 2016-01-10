'use strict';

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
    this._startBlock = null;
    this._endBlock = null;
    this._type = type;
  };

  /**
   *
   * @returns {BlockNode|null}
   */
  getStartBlock() {
    if (this._startBlock) return this._startBlock;
    this._startBlock = this._type.getDocument().getParentBlock(this.startDomNode);
    return this._startBlock;
  }

  /**
   *
   * @returns {BlockNode|null}
   */
  getEndBlock() {
    if (this._endBlock) return this._endBlock;
    this._endBlock = this._type.getDocument().getParentBlock(this.endDomNode);
    return this._endBlock;
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

'use strict';

export default class DocumentRange {

  /**
   *
   * @param {Node} startContainer
   * @param {number} startOffset
   * @param {Node} endContainer
   * @param {number} endOffset
   */
  constructor(startContainer, startOffset, endContainer, endOffset) {
    this.startDomNode = startContainer;
    this.startDomOffset = startOffset;
    this.endDomNode = endContainer;
    this.endDomOffset = endOffset;
  };

  /**
   *
   * @returns {TextNode}
   */
  getStartNode() {

  }

  /**
   *
   * @returns {TextNode}
   */
  getEndNode() {

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

export default class TypeRange {

  /**
   *
   * @param startNode
   * @param endNode
   * @param startOffset
   * @param endOffset
   */
  constructor(startNode, endNode, startOffset, endOffset) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.startOffset = startOffset || 0;
    this.endOffset = endOffset || endNode.length;
  }

  /**
   *
   * @returns {TypeRange}
   */
  static nullRange() {
    return new TypeRange(null, null, null, null);
  }

  /**
   * Returns whether or not the startContainer equals the
   * endContainer.
   *
   * @returns {boolean}
   */
  startsAndEndsInSameNode() {
    return this.startContainer === this.endContainer;
  }

  /**
   *
   * @returns {[BlockNode,BlockNode]}
   */
  getBlockNodes() {
    return [this.startNode.parent, this.endNode.parent];
  }

}

'use strict';

export default class TypeRange {

  constructor(starNode, endNode, startOffset, endOffset) {
    this.starNode = starNode;
    this.endNode = endNode;
    this.startOffset = startOffset || 0;
    this.endOffset = endOffset || endNode.length;
  }

  static nullRange() {
    return new TypeRange(null, null, null, null);
  }

}
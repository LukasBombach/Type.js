'use strict';

export default class TypeRange {

  constructor(startNode, endNode, startOffset, endOffset) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.startOffset = startOffset || 0;
    this.endOffset = endOffset || endNode.length;
  }

  static nullRange() {
    return new TypeRange(null, null, null, null);
  }

}
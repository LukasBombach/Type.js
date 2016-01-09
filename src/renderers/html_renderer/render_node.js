'use strict';

export default class RenderNode {

  constructor() {
    this._domNode = null;
  }

  _setCachedDomNode(domNode) {
    this._domNode = domNode;
    return this;
  }

  _getCachedDomNode(domNode) {
    return this._domNode = domNode;
  }

}

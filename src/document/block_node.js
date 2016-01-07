'use strict';

import DocumentNode from './document_node';

/**
 * @augments DocumentNode
 */
export default class BlockNode extends DocumentNode {

  /**
   *
   * @param nodeType
   * @param children
   * @param attributes
   */
  constructor(nodeType = '', children = [], attributes = []) {
    super(attributes);
    this.setNodeType(nodeType);
    this.setChildren(children);
  }

  /**
   *
   * @param {string} nodeType
   * @returns {BlockNode}
   */
  setNodeType(nodeType = '') {
    if (this.validBlockTypes.indexOf(nodeType) === -1)
      throw 'You tried to set the nodeType "' + nodeType + '" ' +
      'for a BlockNode. You can only use these block types: ' +
      this.validBlockTypes.toString();
    this._nodeType = nodeType;
    return this;
  }

  /**
   * 
   * @returns {string}
   */
  getNodeType() {
    return this._nodeType;
  }

  /**
   *
   * @param {TextNode} child
   * @returns {BlockNode}
   */
  addChild(child) {
    this._children.push(child);
    return this;
  }

  /**
   *
   * @param {TextNode[]} children
   * @returns {BlockNode}
   */
  setChildren(children) {
    this._children = children;
    return this;
  }

  getChildren() {
    return this._children;
  }

  /**
   *
   * @returns {string[]}
   */
  get validBlockTypes() {
    var htmlBlockNodes = ['p', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div']; // todo remove div
    return htmlBlockNodes;
  }

}

'use strict';

import DocumentNode from './document_node';
import TextNode from './text_node';

/**
 * @augments DocumentNode
 */
export default class BlockNode extends DocumentNode {

  /**
   *
   * @param {Type} type
   * @param nodeType
   * @param children
   * @param attributes
   */
  constructor(type, nodeType = '', children = [], attributes = []) {
    super(type, attributes);
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

  /**
   *
   * @returns {TextNode[]|*}
   */
  getChildren() {
    return this._children;
  }

  /**
   *
   * @param {number} offset
   * @returns {TextNode|null}
   */
  getTextNodeAtOffset(offset) {

    const textNodes = this.getTextNodes();
    const len = textNodes.length;
    let nodeLen = 0;
    let offsetWalked = 0;

    for (let i = 0; i < len; i++) {
      nodeLen = textNodes[i].length;
      if (offset >= offsetWalked && offset < offsetWalked + nodeLen)
        return textNodes[i];
      offsetWalked += nodeLen;
    }

    return null;
  }

  /**
   *
   * @returns {TextNode[]}
   */
  getTextNodes() {

    const children = this._children;
    const len = children.length;
    let textNodes = [];

    for (let i = 0; i < len; i++) {
      if (children[i] instanceof TextNode)
        textNodes.push(children[i]);
      else if (typeof children[i] === BlockNode)
        textNodes = textNodes.concat(children[i].getTextNodes());
    }

    return textNodes;

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

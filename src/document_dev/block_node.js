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
   * @param attributes
   * @param startNode
   * @param endNode
   * @returns {BlockNode}
   */
  addAttributesFromNodeToNode(attributes, startNode, endNode) {

    const children = this._children;
    const startIndex = children.indexOf(startNode);
    const endIndex = children.indexOf(endNode);

    for (let i = startIndex; i < endIndex; i++)
      children[i].addAttribute(attributes);

    return this;
  }

  /**
   *
   * @param offset
   * @returns {[TextNode,TextNode]}
   */
  splitTextNodesAt(offset) {
    const [textNode, offsetInNode] = this.getTextNodeAtOffset(offset);
    const [leftNode, rightNode] = textNode.splitAtOffset(offsetInNode);
    const textNodeIndex = this._children.indexOf(textNode);
    this._children.splice(textNodeIndex, 1, leftNode, rightNode);
    return [leftNode, rightNode];
  }

  /**
   *
   * @returns {BlockNode}
   */
  copy() {
    return new BlockNode(this._type, this._nodeType, this._children.slice(0));
  }

  /**
   *
   * @param attributes
   * @param [fromOffset]
   * @param [toOffset]
   * @returns {BlockNode}
   */
  copyWithTextAttributes(attributes, fromOffset, toOffset) {

    const newBlockNode = this.copy();
    let newStartTextNode;
    let newEndTextNode;
    [, newStartTextNode] = newBlockNode.splitTextNodesAt(fromOffset);
    if (toOffset !== undefined)
      [newEndTextNode,] = newBlockNode.splitTextNodesAt(toOffset);
    else
      newEndTextNode = newBlockNode.getChildren()[newBlockNode.getChildren().length - 1];

    newBlockNode.addAttributesFromNodeToNode(attributes, newStartTextNode, newEndTextNode);

    return newBlockNode;

    // let newChildren = this.getChildren().slice(0);
    // let splitfirstNode;
    // let splitLastNode;
    // let firstNode;
    // let lastNode;

    // if (fromOffset === undefined) {
    //   firstNode = newChildren[0];
    // } else {
    //   splitfirstNode = this.getTextNodeAtOffset(fromOffset)
    //   a1.splice.apply(a1, [2, 0].concat(a2));
    // }

    // if (toOffset === undefined) {
    //   lastNode = newChildren[newChildren.length - 1];
    // } else {

    // }

    // for (child of newChildren) {

    // }

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
   * @returns {[TextNode,number]|null}
   */
  getTextNodeAtOffset(offset) {

    const textNodes = this.getTextNodes();
    const len = textNodes.length;
    let nodeLen = 0;
    let offsetWalked = 0;

    for (let i = 0; i < len; i++) {
      nodeLen = textNodes[i].length;
      if (offset >= offsetWalked && offset < offsetWalked + nodeLen)
        return [textNodes[i], offset - offsetWalked];
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

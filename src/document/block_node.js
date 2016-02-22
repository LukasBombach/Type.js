import DocumentNode from './document_node';

/**
 * @augments DocumentNode
 */
export default class BlockNode extends DocumentNode {

  /**
   *
   * @param {Type} type
   * @param attributesOrType
   * @param children
   * @param parent
   */
  constructor(type, attributesOrType = [], children = [], parent) {
    const attributes = typeof attributesOrType === 'string' ?
        new Array(['blockType', attributesOrType]) :
        attributesOrType;
    const blockType = BlockNode._extractBlockTypeFromAttributes(attributes);
    super(type, attributes, parent);
    this.blockType = blockType;
    this.children = children;
  }

  /**
   *
   * @returns {BlockNode}
   */
  copy() {
    return new BlockNode(this._type, this.attributes.copy(), this.children.slice(0), this.parent);
  }

  /**
   *
   * @param id
   * @returns {BlockNode|TextNode|null}
   */
  getChild(id) {
    if (this.id === id) return this;
    let childWithId;

    for (const child of this.children) {
      if (child instanceof BlockNode && (childWithId = child.getChild(id))) return childWithId;
      else if (child.id === id) return child;
    }

    return null;
  }

  /**
   *
   * @param {TypeRange} range
   * @returns {BlockNode}
   */
  splitNodesAtRange(range) {
    const blockNode = this.copy();
    const nodes = blockNode.children;
    const startNodeIndex = nodes.indexOf(range.startNode);
    const endNodeIndex = nodes.indexOf(range.endNode);

    if (range.startsAndEndsInSameNode()) {
      const [leftNode, rightNode] = range.startNode.splitAtOffset(range.startOffset);
      blockNode.children.splice(startNodeIndex, 1, leftNode, rightNode);
      blockNode.children.splice(startNodeIndex + 1, 1,
          ...rightNode.splitAtOffset(range.endOffset - range.startOffset));
    } else {
      blockNode.children.splice(startNodeIndex, 1,
          ...range.startNode.splitAtOffset(range.startOffset));
      blockNode.children.splice(endNodeIndex, 1,
          ...range.endNode.splitAtOffset(range.endOffset));
    }

    return blockNode;
  }

  /**
   *
   * @param {TypeRange} range
   * @returns {BlockNode}
   */
  splitNodeAtRangeStart(range) {
    return this.splitNodeAtOffset(range.startNode, range.startOffset);
  }

  /**
   *
   * @param {TypeRange} range
   * @returns {BlockNode}
   */
  splitNodeAtRangeEnd(range) {
    return this.splitNodeAtOffset(range.endNode, range.endOffset);
  }

  /**
   *
   * @param childTextNode
   * @param textNodeOffset
   * @returns {BlockNode}
   */
  splitNodeAtOffset(childTextNode, textNodeOffset) {
    const blockNode = this.copy();
    const childTextNodeIndex = blockNode.children.indexOf(childTextNode);
    blockNode.children.splice(
        childTextNodeIndex,
        1,
        ...childTextNode.splitAtOffset(textNodeOffset)
    );
    return blockNode;
  }

  /**
   *
   * @returns {number}
   */
  length() {
    return this.children.reduce((prev, curr) => prev + curr.length(), 0);
  }

  /**
   *
   * @param attributes
   * @returns {string|null}
   * @private
   */
  static _extractBlockTypeFromAttributes(attributes) {
    const len = attributes.length;
    let blockType = null;

    for (let i = 0; i < len; i++) {
      if (attributes[i][0] === 'blockType') {
        blockType = attributes[i][1];
        attributes.splice(i, 1);
        break;
      }
    }

    return blockType;
  }
}

'use strict';

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
   */
  constructor(type, attributesOrType = [], children = []) {
    const attributes = typeof attributesOrType === 'string' ? ['blockType', attributesOrType] : attributesOrType;
    this.blockType = BlockNode._extractBlockTypeFromAttributes(attributes);
    super(type, attributes);
    this.children = children;
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

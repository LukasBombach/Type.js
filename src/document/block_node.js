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
    super(type, attributes);
    this.children = children;
  }

}

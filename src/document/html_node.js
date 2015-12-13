'use strict';

import DocumentNode from './document_node';

/**
 * @augments DocumentNode
 */
export default class HtmlNode extends DocumentNode {

  /**
   *
   * @param {HTMLElement|Node} domNode
   * @returns {HtmlNode}
   */
  static fromDomNode(domNode) {
    return new HtmlNode(domNode.nodeName);
  }

}

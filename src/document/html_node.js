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
    const nodeName = domNode.nodeType === Node.TEXT_NODE ? HtmlNode.TEXT_NODE : domNode.nodeName;
    const nodeValue = domNode.nodeType === Node.TEXT_NODE ? domNode.nodeValue : undefined;
    return new HtmlNode(nodeName, nodeValue);
  }

  static get TEXT_NODE() {
    return 'text';
  }

}

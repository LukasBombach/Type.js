'use strict';

import HtmlNode from '../document/html_node';

export default class DomReader {

  /**
   *
   * @param {HTMLElement|Node} domNode
   * @returns {HtmlNode}
   */
  static parse(domNode) {

    var htmlNode = HtmlNode.fromDomNode(domNode);
    var len = domNode.childNodes.length;

    for (let i = 0; i < len; i += 1) {
      if (!DomReader.ignoreNode(domNode.childNodes[i]))
        htmlNode.addChild(DomReader.parse(domNode.childNodes[i]));
    }

    return htmlNode;

  }

  /**
   *
   * @param {Node} node
   * @returns {boolean}
   */
  static ignoreNode(node) {
    return !DomReader.hasAcceptedNodeType(node) || DomReader.isEmptyTextNode(node);
  }

  /**
   *
   * @param {Node} node
   * @returns {boolean}
   */
  static hasAcceptedNodeType(node) {
    var acceptedNodeTypes = [
      Node.ELEMENT_NODE,
      Node.TEXT_NODE,
    ];
    return acceptedNodeTypes.indexOf(node.nodeType) > -1;
  }

  /**
   *
   * @param {Node} node
   * @returns {boolean}
   */
  static isEmptyTextNode(node) {
    return !(node.nodeType !== Node.TEXT_NODE || /[^\t\n\r ]/.test(node.textContent));
  }

}

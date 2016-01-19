'use strict';

import HtmlNode from '../document/html_node';

export default class DomReader {

  /**
   *
   * @param {HTMLElement|Node} rootNode
   * @returns {HtmlNode[]}
   */
  static getDocument(rootNode) {
    return DomReader._parse(rootNode).children;
  }

  /**
   *
   * @param {HTMLElement|Node} domNode
   * @returns {HtmlNode}
   * @private
   */
  static _parse(domNode) {

    var htmlNode = HtmlNode.fromDomNode(domNode);
    var len = domNode.childNodes.length;

    for (let i = 0; i < len; i += 1) {
      if (!DomReader._ignoreNode(domNode.childNodes[i]))
        htmlNode.addChild(DomReader._parse(domNode.childNodes[i]));
    }

    return htmlNode;

  }

  // static _getNodeFromDomNode(domNode) {
  //   return domNode.nodeType === Node.TEXT_NODE ? TextNode.fromDomNode(domNode) : HtmlNode.fromDomNode(domNode);
  // }

  /**
   *
   * @param {Node} node
   * @returns {boolean}
   * @private
   */
  static _ignoreNode(node) {
    return !DomReader._hasAcceptedNodeType(node) || DomReader._isEmptyTextNode(node);
  }

  /**
   *
   * @param {Node} node
   * @returns {boolean}
   * @private
   */
  static _hasAcceptedNodeType(node) {
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
   * @private
   */
  static _isEmptyTextNode(node) {
    return !(node.nodeType !== Node.TEXT_NODE || /[^\t\n\r ]/.test(node.textContent));
  }

  /**
   *
   * @param tag
   * @returns {*}
   */
  getTextAttributeForTag(tag) {
    var aliases = this.attributeAliases;
    for (var key in aliases)
      if (aliases.hasOwnProperty(key) && aliases[key].indexOf(tag) !== -1)
        return key;
    return null;
  }

  /**
   *
   * @returns {{bold: string[], italic: string[], underline: string[], del: string[]}}
   */
  static get attributeAliases() {
    return {
      bold: ['strong', 'b'],
      italic: ['em', 'i'],
      underline: ['u'],
      del: ['del'],
    };
  }

}

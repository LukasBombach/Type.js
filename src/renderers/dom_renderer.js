'use strict';

import HtmlNode from '../document/html_node';

export default class DomRenderer {

  /**
   *
   * @param {Type} type
   */
  constructor(type) {
    this._document = type.getDocument();
    this._el = type.getEl();
  }

  /**
   *
   * @returns {DomRenderer}
   */
  render() {

    const len = this._document.length;

    this._el.innerHTML = '';

    for (let i = 0; i < len; i++) {
      this._el.appendChild(this._renderNode(this._document[i]));
    }

    return this;
  }

  /**
   *
   * @param {DocumentNode} documentNode
   * @returns {HTMLElement|Node}
   * @private
   */
  _renderNode(documentNode) {

    var domNode = DomRenderer._getNodeFromDocumentNode(documentNode);
    const len = documentNode.children.length;

    for (let i = 0; i < len; i++) {
      domNode.appendChild(this._renderNode(documentNode.children[i]));
    }

    return domNode;
  }

  /**
   *
   * @param documentNode
   * @returns {HTMLElement|Text}
   * @private
   */
  static _getNodeFromDocumentNode(documentNode) {
    if (documentNode.nodeName === HtmlNode.TEXT_NODE)
      return document.createTextNode(documentNode.nodeValue);
    else
      return document.createElement(documentNode.nodeName);
  }

}

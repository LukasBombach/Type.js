'use strict';

import BlockNode from '../document/block_node';
import TextNode from '../document/text_node';
import Development from '../utilities/development';

export default class HtmlReader {

  /**
   *
   * @param {HTMLElement|Node} rootNode
   * @returns {DocumentNode[]}
   */
  static getDocument(rootNode) {

    // var parsedNodes = HtmlReader._parse(rootNode);
    // return parsedNodes.children || [parsedNodes];


  }


  static _getBlockNode(domNode, attributes = []) {
    var nodeType = domNode.tagName.toLowerCase();
    var children = HtmlReader._getChildrenFor(domNode, attributes);
    return new BlockNode(nodeType, children);
  }

  static _getChildrenFor(domNode, attributes = []) {

    var childNodes = [];

    Array.prototype.forEach.call(domNode.childNodes, function(node) {

      if (HtmlReader._isBlockNode(node)) childNodes.push(HtmlReader._getBlockNode(node, attributes));
      if (HtmlReader._isTextNode(node)) childNodes.push(HtmlReader._getTextNode(node, attributes));

      if (HtmlReader._isAttributeNode(node)) {
        attributes = HtmlReader._addAttributeForNode(attributes, node);
      }

    });

    return childNodes;
  }

  /*Array.prototype.forEach.call(domNode.childNodes, function(node) {

    if (HtmlReader._isBlockNode(node)) childNodes.push(HtmlReader._getBlockNode(node));
    if (HtmlReader._isTextNode(node)) childNodes.push(HtmlReader._getTextNode(node, attributes));

    if (HtmlReader._isAttributeNode(node)) {
      attributes = HtmlReader._addAttributeForNode(attributes, node);
    }

  });*/

  /**
   *
   * @param node
   * @param attributes
   * @returns {TextNode}
   * @private
   */
  static _getTextNode(node, attributes = []) {
    return new TextNode(node.nodeValue, attributes);
  }

  static _addAttributeForNode(attributes = [], node) {
    var attributeMap = HtmlReader._tagAttributeMap;
    var tagName = node.tagName ? node.tagName.toLowerCase() : '';
    attributes = attributes.slice(0);
    if (attributeMap[tagName] && attributes.indexOf(tagName) !== -1)
      attributes.push(attributeMap[tagName]);
    return attributes;
  }

  static _isBlockNode(domNode) {
    return domNode.tagName && HtmlReader._blockTags.indexOf(domNode.tagName.toLowerCase()) !== -1;
  }

  /**
   *
   * @param {Element|Text|Node} domNode
   * @param currentTextAttributes
   * @returns {BlockNode|TextNode}
   * @private
   */
  static _parse(domNode, currentTextAttributes = []) {

    var tagName = domNode.tagName ? domNode.tagName.toLowerCase() : null;

    if (HtmlReader._blockTags.indexOf(tagName))



      var blockNode = HtmlReader._getBlockNodeForDomNode(domNode);
    var domNodeTagName = domNode.tagName ? domNode.tagName.toLowerCase() : null;
    var len = domNode.childNodes.length;

    for (let i = 0; i < len; i++) {
      if (HtmlReader._ignoreNode(domNode.childNodes[i]))
        continue;
      if (HtmlReader._isAttributeNode(domNode.childNodes[i])) {
        currentTextAttributes = HtmlReader._addTagIfIsValidAttribute(currentTextAttributes, domNodeTagName);
        HtmlReader._parse();
      }

    }

    //var documentNode = HtmlReader._getBlockNodeForDomNode(domNode);
    //var domNodeTagName = domNode.tagName ? domNode.tagName.toLowerCase() : null;
    //var len = domNode.childNodes.length;

    //currentTextAttributes = HtmlReader._addTagIfIsValidAttribute(currentTextAttributes, domNodeTagName);

    //for (let i = 0; i < len; i++) {
    //  if (HtmlReader._ignoreNode(domNode.childNodes[i]))
    //    continue;
    //  if (domNode.childNodes[i].nodeType === Node.TEXT_NODE)
    //    documentNode.addChild(new TextNode(domNode.childNodes[i].nodeValue, currentTextAttributes));
    //  else
    //    documentNode.addChild(HtmlReader._parse(domNode.childNodes[i], currentTextAttributes));
    //}

    //return documentNode;

  }

  /**
   *
   * @param domNode
   * @returns {boolean}
   * @private
   */
  static _isAttributeNode(domNode) {
    var attributeMap = HtmlReader._tagAttributeMap;
    var tagName = domNode.tagName ? domNode.tagName.toLowerCase() : null;
    return !!(tagName && attributeMap[tagName]);
  }

  /**
   *
   * @param domNode
   * @returns {BlockNode}
   * @private
   */
  static _getBlockNodeForDomNode(domNode) {
    var blockTags = HtmlReader._blockTags;
    var domNodeTagName = domNode.tagName ? domNode.tagName.toLowerCase() : null;
    if (domNodeTagName && blockTags.indexOf(domNodeTagName) !== -1)
      return new BlockNode(domNodeTagName);
    throw 'Could not find a document node for tag "' + domNodeTagName + '"';
  }

  /**
   *
   * @param {string[]} attributes
   * @param {string|undefined|null} tagName
   * @returns {string[]}
   * @private
   */
  static _addTagIfIsValidAttribute(attributes = [], tagName = null) {
    var attributeMap = HtmlReader._tagAttributeMap;
    attributes = attributes.slice(0);
    if (tagName && attributeMap[tagName] && attributes.indexOf(tagName) !== -1)
      attributes.push(attributeMap[tagName]);
    return attributes;
  }

  /**
   *
   * @param {Element|Text} domNode
   * @private
   */
  static _getDocumentNodeForDomNode(domNode) {

    var blockTags = HtmlReader._blockTags;
    var attributeTags = HtmlReader._attributeTags;
    var domNodeTagName = domNode.tagName ? domNode.tagName.toLowerCase() : null;
    var isTextNode = domNode.nodeType === Node.TEXT_NODE;

    if (domNodeTagName && blockTags.indexOf(domNodeTagName) !== -1)
      return new BlockNode(domNodeTagName);

    if (domNodeTagName && attributeTags.indexOf(domNodeTagName) !== -1)

      if (isTextNode)
        return new TextNode(domNode.nodeValue, HtmlReader._getTextAttributesFor(domNode));

    // Development.error('Could not find a document node for tag "' + domNodeTagName + '"');
    // return null;

    throw 'Could not find a document node for tag "' + domNodeTagName + '"';

  }

  /**
   *
   * @param textNode
   * @returns {string|null}
   * @private
   */
  static _getTextAttributesFor(textNode) {
    var tagName = textNode.tagName.toLowerCase();
    var attributeMap = HtmlReader._tagAttributeMap;
    return attributeMap[tagName] || null;
  }

  /**
   *
   * @returns {string[]}
   */
  static get _tagAttributeMap() {
    var ATTRIBUTES = TextNode.ATTRIBUTES;
    return {
      strong: ATTRIBUTES.BOLD,
      b: ATTRIBUTES.BOLD,
      em: ATTRIBUTES.ITALIC,
      i: ATTRIBUTES.ITALIC,
      u: ATTRIBUTES.UNDERLINE,
    };
  }

  /**
   *
   * @returns {string[]}
   */
  static get _blockTags() {
    return ['p', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div']; // todo remove div
  }

  /**
   *
   * @returns {string[]}
   */
  static get _attributeTags() {
    return ['strong', 'em', 'b', 'i', 'u'];
  }

  /**
   *
   * @param {Node} node
   * @returns {boolean}
   * @private
   */
  static _ignoreNode(node) {
    return !HtmlReader._hasAcceptedNodeType(node) || HtmlReader._isEmptyTextNode(node);
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

}

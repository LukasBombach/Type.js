'use strict';

import DomUtilities  from './utilities/dom_utilities';
import DomWalker  from './utilities/dom_walker';
import TypeRange  from './range';

export default class Formatter {

  /**
   *
   * @param {Type} type
   * @constructor
   */
  constructor(type) {
    this._type = type;
  }

  /**
   *
   * @param tag
   * @param typeRange
   * @param params
   * @returns {Formatter|Element[]}
   */
  format(tag, typeRange, params) {

    var args;
    var startNode;
    var endNode;
    var enclosingTag;

    typeRange.ensureIsInside(this._type.getEl());

    // If the selection is enclosed the tag we want to format with
    // remove formatting from selected area
    if (enclosingTag = typeRange.elementEnclosingStartAndEnd(tag)) {
      return this.removeInline(enclosingTag, typeRange);

      // Otherwise add formatting to selected area
    } else {
      startNode = this.constructor._getStartNode(tag, typeRange);
      endNode   = this.constructor._getEndNode(tag, typeRange);
      params    = Array.prototype.slice.call(arguments, 2);
      args      = [tag, startNode, endNode].concat(params);
      return this.insertInline.apply(this, args);
    }

  };

  /**
   * This method will wrap the given tag around (and including) all elements
   * between the startNode and endNode and try to maintain simple and valid
   * HTML. The tag should be an "inline"-element, for "block" elements use
   * {block}. Both methods have a different behaviour when generating markup.
   *
   * @param {String} tag
   * @param {Node} startNode
   * @param {Node} endNode
   * @param {...*} [params]
   * @returns {Element[]} - The elements created by the formatting function
   */
  insertInline(tag, startNode, endNode, params) {

    // Required variables
    var currentNode = startNode;
    var createdNodes = [];
    var nodesToWrap = [];
    var nextNode;

    // Collect the startNode and all its siblings until we
    // found the endNode or a node containing it
    while (currentNode && !currentNode.contains(endNode)) {
      nodesToWrap.push(currentNode);
      currentNode  = currentNode.nextSibling;
    }

    // If the node where we stopped is the endNode, add it
    // to our collection of nodes
    if (currentNode === endNode) {
      nodesToWrap.push(currentNode);
    }

    // If the node where we stopped contains the endNode,
    // apply this algorithm on it recursively
    if (currentNode && DomUtilities.containsButIsnt(currentNode, endNode)) {
      createdNodes.concat(this.insertInline(tag, currentNode.firstChild, endNode));
    }

    // If we did not find the endNode but there are no more
    // siblings, find the next node in the document flow and
    // apply this algorithm on it recursively
    if (currentNode === null) {
      nextNode = DomWalker.next(startNode.parentNode.lastChild, this._type.getEl());
      createdNodes.concat(this.insertInline(tag, nextNode, endNode));
    }

    // Wrap the nodes we got so far in the provided tag
    createdNodes.push(DomUtilities.wrap(tag, nodesToWrap));

    // Return all nodes that have been created
    return createdNodes;

  };

  /**
   *
   * @param {Node} enclosingTag
   * @param {TypeRange} typeRange
   * @returns {Formatter}
   */
  removeInline(enclosingTag, typeRange) {

    var tagName = enclosingTag.tagName;
    var tagPositions = TypeRange.fromElement(enclosingTag).save(this._type.getEl());
    var selPositions = typeRange.save(this._type.getEl());
    var leftRange;
    var rightRange;

    DomUtilities.unwrap(enclosingTag);

    leftRange = TypeRange.fromPositions(this._type.getEl(), tagPositions.start, selPositions.start);
    if (!leftRange.isCollapsed()) {
      this.inline(tagName, leftRange);
    }

    rightRange = TypeRange.fromPositions(this._type.getEl(), selPositions.end, tagPositions.end);
    if (!rightRange.isCollapsed()) {
      this.inline(tagName, rightRange);
    }

    return this;

  };

  /**
   *
   * @param tag
   * @param typeRange
   * @returns {*}
   * @private
   */
  static _getStartNode(tag, typeRange) {
    return typeRange.startTagIs(tag) ? typeRange.getStartElement() : typeRange.splitStartContainer();
  };

  /**
   *
   * @param tag
   * @param typeRange
   * @returns {*}
   * @private
   */
  static _getEndNode(tag, typeRange) {
    return typeRange.endTagIs(tag) ? typeRange.getEndElement() : typeRange.splitEndContainer();
  };

}
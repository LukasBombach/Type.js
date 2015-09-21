'use strict';

import Formatter from './formatter';
import DomUtilities  from '../utilities/dom_utilities';
import DomWalker  from '../utilities/dom_walker';
import TypeRange  from '../range';

export default class InlineFormatter extends Formatter {

  /**
   *
   * @param {Type} type
   * @constructor
   */
  constructor(type) {
    super();
    this._type = type;
  }

  /**
   *
   * @param {String} tag
   * @param {TypeRange} typeRange
   * @returns {InlineFormatter|Element[]}
   */
  format(tag, typeRange) {

    let startNode;
    let endNode;
    let enclosingTag;

    typeRange.ensureIsInside(this._type.getEl());

    // No formatting required if range is collapsed
    if (typeRange.isCollapsed()) {
      return this;

    // If the selection is enclosed the tag we want to format with
    // remove formatting from selected area
    } else if (enclosingTag = typeRange.elementEnclosingStartAndEnd(tag)) {
      return this.remove(enclosingTag, typeRange);

    // Otherwise add formatting to selected area
    } else {
      startNode = this.constructor._getStartNode(tag, typeRange);
      endNode   = this.constructor._getEndNode(tag, typeRange);
      return this.insert(tag, startNode, endNode);
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
   * @returns {Element[]} - The elements created by the formatting function
   */
  insert(tag, startNode, endNode) {

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
      createdNodes.concat(this.insert(tag, currentNode.firstChild, endNode));
    }

    // If we did not find the endNode but there are no more
    // siblings, find the next node in the document flow and
    // apply this algorithm on it recursively
    if (currentNode === null) {
      nextNode = DomWalker.next(startNode.parentNode.lastChild, this._type.getEl());
      createdNodes.concat(this.insert(tag, nextNode, endNode));
    }

    // Wrap the nodes we got so far in the provided tag
    createdNodes.push(DomUtilities.wrap(tag, nodesToWrap));
    this.constructor._connectAdjacent(createdNodes);

    // Return all nodes that have been created
    return createdNodes;

  };

  /**
   *
   * Todo I do not like this method
   *
   * @param {Element} enclosingTag
   * @param {TypeRange} typeRange
   * @returns {InlineFormatter}
   */
  remove(enclosingTag, typeRange) {

    const tagName = enclosingTag.tagName;
    const tagPositions = TypeRange.fromElement(enclosingTag).save(this._type.getEl());
    const selPositions = typeRange.save(this._type.getEl());
    let leftRange;
    let rightRange;

    DomUtilities.unwrap(enclosingTag);

    leftRange = TypeRange.fromPositions(this._type.getEl(), tagPositions.start, selPositions.start);
    this.format(tagName, leftRange);

    rightRange = TypeRange.fromPositions(this._type.getEl(), selPositions.end, tagPositions.end);
    this.format(tagName, rightRange);

    return this;

  };

  /**
   *
   * @param {Element[]} elems
   * @returns {Element[]}
   * @private
   */
  static _connectAdjacent(elems) {
    if (elems.length) {
      elems[0] = DomUtilities.connectLeft(elems[0]);
      elems[elems.length - 1] = DomUtilities.connectRight(elems[elems.length - 1]);
    }
    return elems;
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
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
   * A list of tags that are displayed inline. We generate different markup
   * for inline and block tags. We use this array as reference to determine
   * what kind of markup to generate.
   *
   * todo move me to dom utils
   *
   * @type {string[]}
   * @private
   */
  static get _inlineTags() { return ['strong', 'em', 'u', 's']; };

  /**
   * A list of tags that are displayed as block elements. We generate different
   * markup for inline and block tags. We use this array as reference to determine
   * what kind of markup to generate.
   *
   * todo move me to dom utils
   *
   * @type {string[]}
   * @private
   */
  static get _blockTags() { return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote']; };

  /**
   * Will call either this.inline, this.block or this._noop depending on
   * whether the given tag is an inline or block element or we do not know
   * this tag yet (the latter would call _noop which would utter no action).
   *
   * @param {String} tag - The tag that we want to format the text with
   * @param {TypeRange} typeRange - An object containing data on which part
   *     of the text to format
   * @param {...*} params - Any number of arguments that specify attributes
   *     for the tag
   * @returns {Element[]} - The elements created by the formatting function
   */
  format(tag, typeRange, params) {
    typeRange.ensureIsInside(this._type.getEl());
    const ret = this._handlerFor(tag).apply(this, arguments);
    this._type.emit('format', ret);
    return ret;
  };

  /**
   *
   * @param tag
   * @param range
   * @returns {*}
   */
  removeFormat(tag, range) {
  };

  /**
   *
   * @param tag
   * @param typeRange
   * @param params
   * @returns {Formatter|Element[]}
   */
  inline(tag, typeRange, params) {

    var args;
    var startNode;
    var endNode;
    var enclosingTag;

    // If the selection is enclosed the tag we want to format with
    // remove formatting from selected area
    if (enclosingTag = typeRange.elementEnclosingStartAndEnd(tag)) {
      return this.removeInline(enclosingTag, typeRange);

    // Otherwise add formatting to selected area
    } else {
      startNode = this._getStartNode(tag, typeRange);
      endNode   = this._getEndNode(tag, typeRange);
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
   * @param cmd
   * @param typeRange
   * @param params
   * @returns {Formatter}
   * @private
   */
  block (cmd, typeRange, params) {
    return this.inline.apply(this, arguments);
  };

  /**
   *
   * @param tag
   * @param typeRange
   * @returns {*}
   * @private
   */
  _getStartNode(tag, typeRange) {
    return typeRange.startTagIs(tag) ? typeRange.getStartElement() : typeRange.splitStartContainer();
  };

  /**
   *
   * @param tag
   * @param typeRange
   * @returns {*}
   * @private
   */
  _getEndNode(tag, typeRange) {
    return typeRange.endTagIs(tag) ? typeRange.getEndElement() : typeRange.splitEndContainer();
  };

  /**
   * Takes a tag name and returns the handler function for formatting
   * the DOM with this tag by checking if it is an inline or block tag.
   *
   * Todo Maybe use fallback http://stackoverflow.com/a/2881008/1183252 if tag is not found
   *
   * @param {String} tag - The name of the tag that the DOM should be
   *     formatted with.
   * @returns {inline|block|_noop} - The handler function for inline
   *     or block tags, or _noop if the tag is unknown.
   * @private
   */
  _handlerFor(tag) {
    tag = tag.toLowerCase();
    if (this.constructor._inlineTags.indexOf(tag) > -1) return this.inline;
    if (this.constructor._blockTags.indexOf(tag) > -1) return this.block;
    //Type.Development.debug('Tag "' + tag + '" not implemented');
    return this._noop;
  };

  /**
   * Multi-purpose no-op handler
   *
   * @returns {Formatter}
   * @private
   */
  _noop() {
    return this;
  };

}
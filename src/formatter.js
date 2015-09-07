'use strict';

var Type = require('./core');

/**
 *
 * @param {Type} type
 * @constructor
 */
Type.Formatter = function (type) {
  this._type = type;
};

(function () {

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
  this._inlineTags = ["strong", "em", "u", "s"];

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
  this._blockTags  = ["h1", "h2", "h3", "h4", "h5", "h6", "blockquote"];

  /**
   * Will call either this.inline, this.block or this._noop depending on
   * whether the given tag is an inline or block element or we do not know
   * this tag yet (the latter would call _noop which would utter no action).
   *
   * @param {String} tag - The tag that we want to format the text with
   * @param {Type.Range} typeRange - An object containing data on which part
   *     of the text to format
   * @param {...*} params - Any number of arguments that specify attributes
   *     for the tag
   * @returns {Element[]} - The elements created by the formatting function
   */
  this.format = function (tag, typeRange, params) {
    typeRange.ensureIsInside(this._type.getRoot());
    return this._handlerFor(tag).apply(this, arguments);
  };

  /**
   *
   * @param tag
   * @param range
   * @returns {*}
   */
  this.removeFormat = function (tag, range) {

    var startNode = this._getStartNode(tag, range),
      dom = this._type.createDomWalker(startNode),
      next;

    do {
      Type.DomUtilities.removeTag(dom.getNode(), tag, false);
      next = dom.next();
    } while(next && !next.contains(range.endContainer));// !== range.endContainer);

    return this;

  };

  /**
   *
   * @param tag
   * @param typeRange
   * @param params
   * @returns {Type.Formatter|Element[]}
   */
  this.inline = function (tag, typeRange, params) {

    var args, startNode, endNode, enclosingTag, selPositions;

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
  this.insertInline = function (tag, startNode, endNode, params) {

    // Required variables
    var currentNode = startNode,
      createdNodes  = [],
      nodesToWrap   = [],
      nextNode;

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
    if (currentNode && Type.DomUtilities.containsButIsnt(currentNode, endNode)) {
      createdNodes.concat(this.insertInline(tag, currentNode.firstChild, endNode));
    }

    // If we did not find the endNode but there are no more
    // siblings, find the next node in the document flow and
    // apply this algorithm on it recursively
    if (currentNode === null) {
      nextNode = Type.DomWalker.next(startNode.parentNode.lastChild, this._type.getRoot());
      createdNodes.concat(this.insertInline(tag, nextNode, endNode));
    }

    // Wrap the nodes we got so far in the provided tag
    createdNodes.push(Type.DomUtilities.wrap(tag, nodesToWrap));

    // Return all nodes that have been created
    return createdNodes;

  };

  /**
   *
   * @param {Node} enclosingTag
   * @param {Type.Range} typeRange
   * @returns {Type.Formatter}
   */
  this.removeInline = function (enclosingTag, typeRange) {

    var tagName = enclosingTag.tagName,
      tagPositions = Type.Range.fromElement(enclosingTag).save(this._type.getRoot()),
      selPositions = typeRange.save(this._type.getRoot()),
      leftRange,
      rightRange;

    Type.DomUtilities.unwrap(enclosingTag);

    leftRange = Type.Range.fromPositions(this._type.getRoot(), tagPositions.start, selPositions.start);
    if (!leftRange.isCollapsed()) {
      this.inline(tagName, leftRange);
    }

    rightRange = Type.Range.fromPositions(this._type.getRoot(), selPositions.end, tagPositions.end);
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
   * @returns {Type.Formatter}
   * @private
   */
  this.block = function (cmd, typeRange, params) {
    return this.inline.apply(this, arguments);
  };

  /**
   *
   * @param tag
   * @param typeRange
   * @returns {*}
   * @private
   */
  this._getStartNode = function (tag, typeRange) {
    return typeRange.startTagIs(tag) ? typeRange.getStartElement() : typeRange.splitStartContainer();
  };

  /**
   *
   * @param tag
   * @param typeRange
   * @returns {*}
   * @private
   */
  this._getEndNode = function (tag, typeRange) {
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
  this._handlerFor = function (tag) {
    tag = tag.toLowerCase();
    if (this._inlineTags.indexOf(tag) > -1) return this.inline;
    if (this._blockTags.indexOf(tag) > -1) return this.block;
    Type.Development.debug('Tag "' + tag + '" not implemented');
    return this._noop;
  };

  /**
   * Multi-purpose no-op handler
   *
   * @returns {Type.Formatter}
   * @private
   */
  this._noop = function () {
    return this;
  };

}).call(Type.Formatter.prototype);

module.exports = Type.Formatter;

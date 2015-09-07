'use strict';

var Utilities = require('./utilities');

/**
 * @param {Node} node - The node to be used as the starting point for the
 *     first traversal operation.
 * @param {Object|Node} [options] - If an object is passed, it should
 *     contain settings determining what node to return, see specifics
 *     below. If a {Node} is passed, this acts as options.constrainingNode
 * @param {Function|string} [options.filter] - nextNode traverses
 *     the DOM tree and passes each node to this function. This function
 *     should return true if the node passed is a node that we look for
 *     or false otherwise. E.g. if we want to find the next text node
 *     in the tree, the function should check if the node passed is of
 *     nodeType === 3. If this parameter is not set, any node found
 *     will be returned.
 *     todo allow css selectors to be used for traversal
 * @param {Node} [options.constrainingNode] While traversing the DOM,
 *     this method will check nodes' parents and parents' parents. By
 *     passing a DOM node as this parameter, traversing up will stop at
 *     this node and return null. This is useful when you want to permit
 *     traversing outside the editor's root node.
 * @constructor
 */
function DomWalker(node, options) {
  this.setNode(node);
  this.options(options);
}

(function() {

  /**
   * Returns the next node in the document flow and sets the internal reference
   * to the current node to that node.
   * @returns {null|Node}
   */
  this.next = function(returnMe) {
    return this._setNodeIfNotNull(DomWalker._nextNode(this._node, this._options, returnMe));
  };

  /**
   * Returns the next node in the document flow but does not set the internal
   * reference to the current node to that node.
   * @returns {null|Node}
   */
  this.prefetchNext = function(returnMe) {
    return DomWalker._nextNode(this._node, this._options, returnMe);
  };

  /**
   * Returns the previous node in the document flow and sets the internal reference
   * to the current node to that node.
   * @returns {null|Node}
   */
  this.prev = function(returnMe) {
    return this._setNodeIfNotNull(DomWalker._prevNode(this._node, this._options, returnMe));
  };

  /**
   * Returns the previous node in the document flow but does not set the internal
   * reference to the current node to that node.
   * @returns {null|Node}
   */
  this.prefetchPrev = function(returnMe) {
    return DomWalker._prevNode(this._node, this._options, returnMe);
  };

  /**
   * Returns the first child node matching the given filter or the node passed itself
   * if it matches the filter too. Sets the internal reference for the current node to
   * the node found.
   * @returns {null|Node}
   */
  this.first = function() {
    var node = DomWalker.first(this._node, this._options.filter);
    return this._setNodeIfNotNull(node);
  };

  /**
   * Returns the last child node matching the given filter or the node passed itself
   * if it matches the filter too. Sets the internal reference for the current node to
   * the node found.
   * @returns {null|Node}
   */
  this.last = function() {
    var node = DomWalker.last(this._node, this._options.filter);
    return this._setNodeIfNotNull(node);
  };

  /**
   * Sets the internal node from which traversal is made to the given node.
   * @param {Node} node
   */
  this.setNode = function(node) {
    if (!node.nodeType) {
      throw new Error('The given node is not a DOM node');
    }
    this._node = node;
    return this;
  };

  /**
   * Sets the options used for traversal by this walker
   * @param options
   * @returns {*}
   */
  this.options = function(options) {
    this._options = DomWalker.loadOptions(options);
    return this;
  };

  /**
   * Returns the current node the walker is on.
   * @returns {Node}
   */
  this.getNode = function() {
    return this._node;
  };

  /**
   * Will set this _node to the given node unless null is passed.
   * Will also return either null or the node, depending on what
   * has been passed. This method is used to process the return
   * values by the DomWalker traversal methods.
   *
   * @param {Node|null} node
   * @returns {Node|null}
   * @private
   */
  this._setNodeIfNotNull = function(node) {
    if (node === null) {
      return null;
    }
    this._node = node;
    return node;
  };

}).call(DomWalker.prototype);

/**
 * todo replace DomWalker with "this" where possible
 */
(function() {

  /**
   *
   * @type {Object}
   * @private
   */
  DomWalker._filterFunctions = {
    text: '_isTextNodeWithContents',
    textNode: '_isTextNode',
    textual: '_resemblesText',
    visible: '_isVisible'
  };

  /**
   *
   * @param node
   * @param options
   * @returns {null|Node}
   */
  DomWalker.next = function(node, options) {
    return DomWalker._nextNode(node, DomWalker.loadOptions(options));
  };

  /**
   *
   * @param node
   * @param options
   * @returns {null|Node}
   */
  DomWalker.prev = function(node, options) {
    return DomWalker._prevNode(node, DomWalker.loadOptions(options));
  };

  /**
   *
   * @param node
   * @param filter
   * @returns {null|Node}
   */
  DomWalker.first = function(node, filter) {
    var options = DomWalker.loadOptions(filter);
    options.constrainingNode = node;
    return DomWalker._nextNode(node, options, true);
  };

  /**
   *
   * @param node
   * @param filter
   * @returns {null|Node}
   */
  DomWalker.last = function(node, filter) {
    var options = DomWalker.loadOptions(filter);
    options.constrainingNode = node;
    return DomWalker._prevNode(node, options, true);
  };

  /**
   *
   * @param options
   * @returns {*}
   */
  DomWalker.loadOptions = function(options) {

    // If no options parameter has been passed
    options = options || {};

    // If a node has been passed as options parameter
    if (options.nodeType) {
      options = {constrainingNode: options};
    }

    // If a function has been passed as ooptions parameter
    if (typeof options === 'string' || Utilities.isFunction(options)) {
      options = {filter: options};
    }

    // Load internal filter function if filter param is a string
    if (options.filter) {
      options.filter = DomWalker._loadFilter(options.filter);
    }

    // Return processed options
    return options;

  };

  /**
   *
   * @param filter
   * @returns {*}
   * @private
   */
  DomWalker._loadFilter = function(filter) {
    var funcName;
    if (typeof filter === 'string') {
      funcName = DomWalker._filterFunctions[filter];
      return DomWalker[funcName];
    }
    return filter;
  };

  /**
   * Traverses the DOM tree and finds the next node after the node passed
   * as first argument. Will traverse the children, siblings and parents'
   * siblings (in that order) to find the next node in the DOM tree as
   * displayed by the document flow.
   *
   * @param {Node} node - The node from which the search should start
   * @param {Object|Node} [options] - If an object is passed, it should
   *     contain settings determining what node to return, see specifics
   *     below. If a {Node} is passed, this acts as options.constrainingNode
   * @param {Function} [options.filter] - nextNode traverses the
   *     DOM tree and passes each node to this function. This function
   *     should return true if the node passed is a node that we look for
   *     or false otherwise. E.g. if we want to find the next text node
   *     in the tree, the function should check if the node passed is of
   *     nodeType === 3. If this parameter is not set, any node found
   *     will be returned.
   * @param {Node} [options.constrainingNode] While traversing the DOM,
   *     this method will check nodes' parents and parents' parents. By
   *     passing a DOM node as this parameter, traversing up will stop at
   *     this node and return null. This is useful when you want to permit
   *     traversing outside the editor's root node.
   * @param {boolean} [returnMe] This should not be passed by the
   *     programmer, it is used internally for recursive function calls to
   *     determine if the current node should be returned or not. If the
   *     programmer passes a node and does *not* pass this argument, the
   *     node passed will not be considered for returning. After that,
   *     internally, this will be set to true and be passed on with the
   *     next node in the DOM to a recursive call. The node then passed to
   *     this method might be the node we are looking for, so having this
   *     set to true will return that node (given that the filter
   *     also returns true for that node)
   * @returns {null|Node} The next node in the DOM tree found or null
   *     if none is found for the options.filter criteria or
   *     options.constrainingNode has been hit.
   */
  DomWalker._nextNode = function(node, options, returnMe) {

    // For later use
    var parent = node.parentNode;

    // If a node is found in this call, return it, stop the recursion
    if (returnMe === true && (!options.filter || options.filter(node))) {
      return node;
    }

    // 1. If this node has children, go down the tree
    if (node.childNodes.length) {
      return DomWalker._nextNode(node.childNodes[0], options, true);
    }

    // 2. If this node has siblings, move right in the tree
    if (node.nextSibling !== null) {
      return DomWalker._nextNode(node.nextSibling, options, true);
    }

    // 3. Move up in the node's parents until a parent has a sibling or the constrainingNode is hit
    while (parent !== options.constrainingNode) {
      if (parent.nextSibling !== null) {
        return DomWalker._nextNode(parent.nextSibling, options, true);
      }
      parent = parent.parentNode;
    }

    // We have not found a node we were looking for
    return null;

  };

  /**
   * Traverses the DOM tree and finds the previous node before the node passed
   * as first argument. Will traverse the children, siblings and parents'
   * siblings (in that order) to find the next node in the DOM tree as
   * displayed by the document flow.
   *
   * @param {Node} node - The node from which the search should start
   * @param {Object|Node} [options] - If an object is passed, it should
   *     contain settings determining what node to return, see specifics
   *     below. If a {Node} is passed, this acts as options.constrainingNode
   * @param {Function} [options.filter] - nextNode traverses the
   *     DOM tree and passes each node to this function. This function
   *     should return true if the node passed is a node that we look for
   *     or false otherwise. E.g. if we want to find the next text node
   *     in the tree, the function should check if the node passed is of
   *     nodeType === 3. If this parameter is not set, any node found
   *     will be returned.
   * @param {Node} [options.constrainingNode] While traversing the DOM,
   *     this method will check nodes' parents and parents' parents. By
   *     passing a DOM node as this parameter, traversing up will stop at
   *     this node and return null. This is useful when you want to permit
   *     traversing outside the editor's root node.
   * @param {boolean} [returnMe] This should not be passed by the
   *     programmer, it is used internally for recursive function calls to
   *     determine if the current node should be returned or not. If the
   *     programmer passes a node and does *not* pass this argument, the
   *     node passed will not be considered for returning. After that,
   *     internally, this will be set to true and be passed on with the
   *     next node in the DOM to a recursive call. The node then passed to
   *     this method might be the node we are looking for, so having this
   *     set to true will return that node (given that the filter
   *     also returns true for that node)
   * @returns {null|Node} The next node in the DOM tree found or null
   *     if none is found for the options.filter criteria or
   *     options.constrainingNode has been hit.
   */
  DomWalker._prevNode = function(node, options, returnMe) {

    // For later use
    var parent = node.parentNode;

    // If a node is found in this call, return it, stop the recursion
    if (returnMe === true && (!options.filter || options.filter(node))) {
      return node;
    }

    // 1. If this node has children, go down the tree
    if (node.childNodes.length) {
      return DomWalker._prevNode(node.lastChild, options, true);
    }

    // 2. If this node has siblings, move right in the tree
    if (node.previousSibling !== null) {
      return DomWalker._prevNode(node.previousSibling, options, true);
    }

    // 3. Move up in the node's parents until a parent has a sibling or the constrainingNode is hit
    while (parent !== options.constrainingNode) {
      if (parent.previousSibling !== null) {
        return DomWalker._prevNode(parent.previousSibling, options, true);
      }
      parent = parent.parentNode;
    }

    // We have not found a node we were looking for
    return null;

  };

  /**
   * Returns true if a given node is a text node
   *
   * @param {Node} node The node to be checked.
   * @returns {boolean}
   * @private
   */
  DomWalker._isTextNode = function(node) {
    return node.nodeType === Node.TEXT_NODE;
  };

  /**
   * Returns true if a given node is a text node and its contents are not
   * entirely whitespace.
   *
   * @param {Node} node The node to be checked.
   * @returns {boolean}
   * @private
   */
  DomWalker._isTextNodeWithContents = function(node) {
    return node.nodeType === Node.TEXT_NODE && /[^\t\n\r ]/.test(node.textContent);
  };

  /**
   * Returns true if a given node is displayed as text on the screen
   *
   * @param {Node} node The node to be checked.
   * @returns {boolean}
   * @private
   */
  DomWalker._resemblesText = function(node) {
    return node.nodeName.toLocaleLowerCase() === 'br' || DomWalker._isTextNodeWithContents(node);
  };

  /**
   * Returns true if the given node is visible to the user.
   *
   * @param {Element} node - The node to be checked
   * @returns {boolean}
   * @private
   */
  DomWalker._isVisible = function(node) {
    return !!node.offsetHeight;
  };

}).call(DomWalker);


module.exports = DomWalker;

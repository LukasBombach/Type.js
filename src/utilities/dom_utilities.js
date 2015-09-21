'use strict';

import Settings  from './settings';
import DomWalker from './dom_walker';
import TextUtilities from './text_utilities';

/**
 * @constructor
 */
export default class DomUtilities {

  /**
   * The id attribute of the container element where all the helper
   * elements including carets and input fields of type will be
   * appended to
   *
   * @type {string}
   * @private
   */
  static get _containerId() { return Settings.prefix + 'container'; };

  /**
   * Matches a single HTML tag
   * @type {RegExp}
   * @private
   */
  static get _singleTag() { return /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/; };

  /**
   * Todo Use me wherever you find document.createElement or this.elementsContainer
   * @param {string} tagName
   * @param {string} [className]
   * @returns {Element}
   */
  static addElement(tagName, className) {
    var el = document.createElement(tagName);
    if (className) el.className = Settings.prefix + className;
    this.getElementsContainer().appendChild(el);
    return el;
  };

  /**
   * Removes a DOM element
   * @param {Element} el
   * @returns {*}
   */
  static removeElement(el) {
    el.parentNode.removeChild(el);
    return this;
  };

  /**
   * Will remove a node and each parent (recursively) if removing
   * leaves the parent with no *visible* content
   *
   * @param {Node} node - The node to remove
   * @param {Node} [constrainingNode] - The algorithm will stop and
   *     not remove this node if it reaches it
   * @returns {Node|null} - Will return the parent node where this
   *     algorithm stopped (The node it did *not* delete)
   */
  static removeVisible(node, constrainingNode) {
    var parent = node.parentNode;
    if (node === constrainingNode) return node;
    if (node === document.body) return node;
    if (parent === null) return null;
    parent.removeChild(node);
    if (!this.isVisible(parent))
      return this.removeVisible(parent, constrainingNode);
    return parent;
  };

  /**
   * Recursively unwraps the given tag from the element passed an all its children
   * Note to self and future developers, querySelectorAll can be used for this when
   * we drop IE 8 support.
   *
   * @param el
   * @param tag
   * @param deep
   * @returns {DomUtilities}
   */
  static removeTag(el, tag, deep) {
    var i;
    if (deep && el.childNodes.length) {
      for (i = 0; i < el.childNodes.length; i += 1) {
        this.removeTag(el.childNodes[i], tag, deep);
      }
    }
    if (el.nodeType === 1 && el.tagName.toLowerCase() === tag.toLowerCase()) {
      this.unwrap(el);
    }
    return this;
  };

  /**
   * Converts a string of HTML to a corresponding {NodeList}
   *
   * @param {String} htmlString - A string containing HTML
   * @returns {NodeList} - The elements represented by the string
   */
  static parseHTML(htmlString) {
    var fragment = document.createDocumentFragment(),
      div = fragment.appendChild(document.createElement('div'));
    div.innerHTML = htmlString;
    return div.childNodes;
  };

  /**
   *
   * By Dave Atchley, taken (and modified) from
   * {@link https://gist.github.com/datchley/11383482}
   * No license given. I asked for the license by mail.
   * Still waiting.
   *
   * @param tag
   * @param elms
   * @returns {Element}
   */
  static wrap(tag, elms) {

    // Even out parameters
    elms = elms.length ? elms : [elms];

    // Prepare vars and cache the current parent
    // and sibling of the first element.
    var el = elms[0],
      parent = el.parentNode,
      sibling = el.nextSibling,
      wrapper = document.createElement(tag),
      i;

    // If the first element had a sibling, insert the wrapper before the
    // sibling to maintain the HTML structure; otherwise, just append it
    // to the parent.
    if (sibling) {
      parent.insertBefore(wrapper, sibling);
    } else {
      parent.appendChild(wrapper);
    }

    // Move all elements to the wrapper. Each element is
    // automatically removed from its current parent and
    // from the elms array.
    for (i = 0; i < elms.length; i += 1) {
      wrapper.appendChild(elms[i]);
    }

    // Remove the tag we want to wrap from TypeContents
    // so we don't have the same tag nested
    for (i = 0; i < elms.length; i += 1) {
      this.removeTag(elms[i], tag, true);
    }

    // Return newly created element
    return wrapper;
  };

  /**
   * Todo use this.moveAfter()
   * @param {Node} el
   * @returns {DomUtilities}
   */
  static unwrap(el) {

    var next = el.nextSibling,
      parent = el.parentNode,
      childNodes = el.childNodes;

    if (next) {
      while (childNodes.length) {
        parent.insertBefore(el.lastChild, next);
      }
    } else {
      while (childNodes.length) {
        parent.appendChild(el.firstChild);
      }
    }

    parent.removeChild(el);
    parent.normalize();

    return this;
  };

  /**
   *
   * @param {Element} el
   * @returns {Element}
   */
  static connectLeft(el) {

    //const prevNonWhitespace = DomWalker.prev(el.previousSibling, 'nonWhitespace');
    //if (!this.isTextNode(prevNonWhitespace) && this.elementsAreSimilar(el, prevNonWhitespace)) {
    //  return this.mergeInto(prevNonWhitespace, el);
    //}
    //return el;

    //const siblings = Array.prototype.slice.call(el.childNodes).reverse();
    const siblings = [];
    let curSibl = el;

    while (curSibl = curSibl.previousSibling) {

      if (TextUtilities.isTextNodeWithContents(curSibl)) {
        return el;

      } else if (TextUtilities.isTextNode(curSibl)) {
        siblings.push(curSibl);

      } else if (this.elementsAreSimilar(el, curSibl)) {
        this.moveInside(curSibl, siblings.reverse());
        this.mergeInto(curSibl, el);
        curSibl.normalize(); // todo do not use normalize but merge nodes
        return curSibl;

      } else {
        return el;
      }
    }

  };

  /**
   *
   * @param {Element} el
   * @returns {Element}
   */
  static connectRight(el) {

    const siblings = [];
    let curSibl = el;

    while (curSibl = curSibl.nextSibling) {

      if (TextUtilities.isTextNodeWithContents(curSibl)) {
        return el;

      } else if (TextUtilities.isTextNode(curSibl)) {
        siblings.push(curSibl);

      } else if (this.elementsAreSimilar(el, curSibl)) {
        this.moveInside(el, siblings);
        this.mergeInto(el, curSibl);
        el.normalize(); // todo do not use normalize but merge nodes
        return el;

      } else {
        return el;
      }
    }

  };

  /**
   * todo account for style, class and maybe all other attributes
   *
   * @param {Element} a
   * @param {Element} b
   */
  static elementsAreSimilar(a, b) {
    return a !== null && b !== null && a.tagName === b.tagName;
  }

  /**
   *
   * @param reference
   * @param elems
   * @returns {*}
   */
  static moveAfter(reference, elems) {

    const next = reference.nextSibling;
    const parent = reference.parentNode;
    const len = elems.length;

    elems = !len ? [elems] : Array.prototype.slice.call(elems, 0);

    if (next) {
      for (let i = 0; i < len; i += 1) {
        parent.insertBefore(elems[i], next);
      }
    } else {
      for (let i = 0; i < len; i += 1) {
        parent.appendChild(elems[i]);
      }
    }

    return this;
  };

  /**
   *
   * @param {Element} target
   * @param {Element[]} elems
   * @returns {Element}
   */
  static moveInside(target, elems) {

    const len = elems.length;

    for (let i = 0; i < len; i++) {
      target.appendChild(elems[i]);
    }

    return target;
  }

  /**
   *
   * @param {Element} target - The element that should be merged into
   * @param {Element} source - The element that should be merged and removed
   * @returns {Element} - The resulting element
   */
  static mergeInto(target, source) {
    this.moveInside(target, source.childNodes);
    this.removeVisible(source);
    return target;
  }

  /**
   * Todo move to dom walker??
   *
   * @param {Node} el
   * @param {String} selector
   * @param {Node} [constrainingNode]
   * @returns {HTMLElement|null}
   */
  static parent(el, selector, constrainingNode) {
    while (el.parentNode && (!constrainingNode || el !== constrainingNode)) {
      if (this.matches(el, selector)) {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  };

  /**
   * Returns true if el matches the CSS selector given as second argument,
   * otherwise false
   *
   * Todo http://davidwalsh.name/element-matches-selector
   *
   * @param el
   * @param selector
   * @returns {boolean}
   */
  static matches(el, selector) {
    var _matches = (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector);

    if (_matches) {
      return _matches.call(el, selector);
    } else {
      var nodes = el.parentNode.querySelectorAll(selector);
      for (var i = nodes.length; i--;) {
        if (nodes[i] === el)
          return true;
      }
      return false;
    }
  };

  /**
   *
   * @returns {Element}
   */
  static getElementsContainer() {
    var container = window.document.getElementById(this._containerId());
    if (container === null) {
      container = window.document.createElement('div');
      container.setAttribute('id', this._containerId());
      window.document.body.appendChild(container);
    }
    return container;
  };

  /**
   *
   * @param {Node} container
   * @param {Node} node
   * @returns {boolean}
   */
  static containsButIsnt(container, node) {
    return container !== node && container.contains(node);
  };

  /**
   *
   * @param obj
   * @returns {boolean}
   */
  static isNode(obj) {
    return !!(obj && obj.nodeType);
  };

  /**
   *
   * @param node
   * @returns {boolean}
   */
  static isTextNode(node) {
    return node.nodeType && node.nodeType === Node.TEXT_NODE;
  }

  /**
   * Returns true if the given node is visible to the user.
   *
   * @param {Element} el - The element to be checked
   * @returns {boolean}
   * @private
   */
  static isVisible(el) {
    return !!el.offsetHeight;
  };

  /**
   * Compares the document positions of two DOM nodes
   *
   * @param {Node} a - A DOM node to compare with the given other node
   * @param {Node} b - A DOM node to compare with the given other node
   * @returns {number} - Returns -1 if a precedes b, 1 if it is the
   *     other way around and 0 if they are equal.
   */
  static order(a, b) {
    if (a === b) return 0;
    if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    return 1;
  };

}
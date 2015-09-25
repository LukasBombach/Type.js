'use strict';

import Type from './core';
import Utilities from './utilities/utilities';
import TextUtilities from './utilities/text_utilities';
import DomUtilities from './utilities/dom_utilities';
import DomWalker from './utilities/dom_walker';

export default class TypeRange {

  /**
   * Crates a new TypeRange
   *
   * TypeRange is a shim for the browsers' native {Range} objects and
   * is being used in Type for anything related to text ranges.
   *
   * Native ranges are often buggy, lack essential features and should
   * not be used other than for performance reasons. This class avoids
   * and / or fixes common issues with ranges and adds many methods
   * useful for text editing.
   *
   * Among many other factory methods, you can use the {TypeRange.fromRange}
   * method to create a {TypeRange} from a native {Range}.
   *
   * @param {Node} startContainer - A text node that the range should start in.
   * @param {number} startOffset - The offset (of characters) inside the
   *     startContainer where the range should begin.
   * @param {Node} endContainer - A text node that the range should end in.
   * @param {number} endOffset - The offset (of characters) inside the
   *     endContainer where the range should stop.
   * @constructor
   */
  constructor(startContainer, startOffset, endContainer, endOffset) {

    this.startContainer = startContainer;
    this.startOffset    = startOffset;
    this.endContainer   = endContainer;
    this.endOffset      = endOffset;

    this.ensureStartNodePrecedesEndNode();

  };

  /**
   * Returns whether or not the start and end containers of this
   * range are still <em>there</em>.
   * @returns {boolean}
   */
  isValid() {
    return this.startContainer.parentNode !== null && !!this.endContainer.parentNode !== null &&
        (!DomUtilities.isTextNode(this.startContainer) || this.startOffset <= this.startContainer.length) &&
        (!DomUtilities.isTextNode(this.endContainer) || this.endOffset <= this.endContainer.length);
  };

  /**
   *
   * @param {TypeRange} that
   * @returns {boolean}
   */
  equals(that) {
    return this.startContainer === that.startContainer &&
        this.startOffset === that.startOffset &&
        this.endContainer === that.endContainer &&
        this.endOffset === that.endOffset;
  };

  /**
   * Returns the position offsets of a rectangle containing this range's
   * contents.
   *
   * @returns {{top: number, bottom: number, left: number, right: number}}
   */
  getBoundingRect() {

    var rect = this.getNativeRange().getBoundingClientRect();
    var scroll = Utilities.getScrollPosition();

    return {
      top: rect.top + scroll.top,
      right: rect.right + scroll.left,
      bottom: rect.bottom + scroll.top,
      left: rect.left + scroll.left,
    };

  };

  /**
   * If the startContainer and the endContainer are enclosed by
   * the same element matching the selector, that element will
   * be returned. Otherwise null will be returned.
   *
   * todo call this commonAncestor and make the selector optional
   *
   * @param {String} selector - This method will only return a
   *     common ancestor matched by this selector.
   * @param {HTMLElement} [constrainingNode] - If given, this
   *     method will stop traversing the DOM tree when it hits
   *     this element.
   * @returns {HTMLElement|null} - Will either return the common
   *     ancestor matching the selector or null otherwise.
   */
  elementEnclosingStartAndEnd(selector, constrainingNode) {

    var tagEnclosingStartNode = DomUtilities.parent(this.startContainer, selector, constrainingNode),
      tagEnclosingEndNode;

    if (tagEnclosingStartNode === null) {
      return null;
    }

    tagEnclosingEndNode = DomUtilities.parent(this.endContainer, selector, constrainingNode);

    if (tagEnclosingStartNode === tagEnclosingEndNode) {
      return tagEnclosingStartNode;
    }

    return null;
  };

  /**
   * Will return whether or not the whole range (the
   * startContainer and the endContainer are both children
   * of the given element.
   *
   * @param {Node} node - The node to check if it
   *     is a parent to the start and endContainer.
   * @returns {boolean}
   */
  isInside(node) {
    return node.contains(this.startContainer) && node.contains(this.endContainer);
  };

  /**
   * Will throw an error if the start and endContainer are
   * not children to the given element. Returns true if
   * they are.
   *
   * @param {HTMLElement} el - The element to check if it
   *     is a parent to the start and endContainer.
   * @returns {boolean}
   */
  ensureIsInside(el) {
    if (this.isInside(el)) {
      return true;
    }
    throw new Error('Range is not contained by given node.');
  };

  /**
   * Will swap start and end containers as well as offsets if
   * either the containers or the offsets are in the wrong
   * order (the start container / offset should precede the end)
   *
   * @returns {TypeRange} - This instance
   */
  ensureStartNodePrecedesEndNode() {

    var startIsEnd, startPrecedesEnd;
    startIsEnd = this.startContainer === this.endContainer;

    if (startIsEnd && this.startOffset <= this.endOffset) {
      return this;
    }

    if (startIsEnd && this.startOffset > this.endOffset) {
      return this._swapOffsets();
    }

    startPrecedesEnd = this.startContainer.compareDocumentPosition(this.endContainer);
    startPrecedesEnd = startPrecedesEnd & Node.DOCUMENT_POSITION_FOLLOWING;

    if (!startPrecedesEnd) {
      this._swapStartAndEnd();
    }

    return this;
  };

  /**
   * Will split the startContainer text node at the startOffset and set
   * this' startContainer to the right node the resulting nodes of the
   * split and the startOffset to 0. Will return the new startContainer.
   *
   * @returns {Node} - The new startContainer
   */
  splitStartContainer () {

    if (this.startOffset === 0) {
      return this.startContainer;
    }

    const startsAndEndsInSameNode = this.startsAndEndsInSameNode();
    this.startContainer = this.startContainer.splitText(this.startOffset);

    if (startsAndEndsInSameNode) {
      this.endContainer = this.startContainer;
      this.endOffset -= this.startOffset;
    }

    this.startOffset = 0;

    return this.startContainer;
  };

  /**
   * Will split the endContainer text node at the endOffset and set
   * this' endContainer to the left node the resulting nodes of the
   * split and the endOffset to the end of the endContainer.
   * Will return the new endContainer.
   *
   * @returns {Node} - The new endContainer
   */
  splitEndContainer() {
    if (this.endOffset !== this.endContainer.length) {
      this.endContainer = this.endContainer.splitText(this.endOffset).previousSibling;
      this.endOffset = this.endContainer.length;
    }
    return this.endContainer;
  };

  /**
   * Creates a native {Range} object and returns it.
   * @returns {Range}
   */
  getNativeRange() {
    var range = document.createRange();
    range.setEnd(this.endContainer, this.endOffset);
    range.setStart(this.startContainer, this.startOffset);
    return range;
  };

  /**
   * Looks up the number of characters (offsets) where this range starts
   * and ends relative to a given {Element}. Returns an {Object} containing
   * the element itself and the offsets. This object can be used to restore
   * the range by using the {@link TypeRange.load} factory.
   *
   * @param {Element} fromNode
   * @returns {{from: Element, start: number, end: number}}
   */
  save(fromNode) {
    var start, end;
    start = this.getStartOffset(fromNode);
    end = this.startsAndEndsInSameNode() ? start - this.startOffset + this.endOffset : this.getEndOffset(fromNode);
    return { from: fromNode, start: start, end: end };
  };

  /**
   * Returns the length of this range as numbers of characters.
   * @returns {number}
   */
  getLength() {
    return TextUtilities.offsetFrom(this.startContainer, this.endContainer, this.startOffset, this.endOffset);
  };

  /**
   * Returns the offset (number of visible characters) from the given node
   * to the startContainer and its startOffset. If no node has been passed
   * this will return the startOffset
   *
   * @param {Node} [from] - The node to start counting characters from
   * @returns {number|null}
   */
  getStartOffset(from) {
    if (from) {
      return TextUtilities.offsetFrom(from, this.startContainer, 0, this.startOffset);
    }
    return parseInt(this.startOffset, 10);
  };

  /**
   * Returns the offset (number of visible characters) from the given node
   * to the endContainer and its endOffset. If no node has been passed
   * this will return the endOffset
   *
   * @param {Node} [from] - The node to start counting characters from
   * @returns {number|null}
   */
  getEndOffset(from) {
    if (from) {
      return TextUtilities.offsetFrom(from, this.endContainer, 0, this.endOffset);
    }

    return parseInt(this.endOffset, 10);
  };

  /**
   * Returns the element containing the startContainer.
   *
   * @returns {Node}
   */
  getStartElement() {
    return this.startContainer.parentNode;
  };

  /**
   * Returns the element containing the endContainer.
   *
   * @returns {Node}
   */
  getEndElement() {
    return this.endContainer.parentNode;
  };

  /**
   * Returns the tag name of the element containing the
   * startContainer.
   *
   * @returns {string}
   */
  getStartTagName() {
    return this.getStartElement().tagName.toLowerCase();
  };

  /**
   * Returns the tag name of the element containing the
   * endContainer.
   *
   * @returns {string}
   */
  getEndTagName() {
    return this.getEndElement().tagName.toLowerCase();
  };

  /**
   * Returns whether or not the the element containing the
   * startContainer is of the given tagName.
   *
   * @param {string} tagName - The tag name to compare.
   * @returns {boolean}
   */
  startTagIs(tagName) {
    return this.getStartTagName() === tagName.toLowerCase();
  };

  /**
   * Returns whether or not the the element containing the
   * endContainer is of the given tagName.
   *
   * @param {string} tagName - The tag name to compare.
   * @returns {boolean}
   */
  endTagIs(tagName) {
    return this.getEndTagName() === tagName.toLowerCase();
  };

  /**
   * Returns whether or not the startContainer equals the
   * endContainer.
   *
   * @returns {boolean}
   */
  startsAndEndsInSameNode() {
    return this.startContainer === this.endContainer;
  };

  /**
   * Returns whether or not this range spans over no characters
   * at all.
   *
   * @returns {boolean}
   */
  isCollapsed() {
    return this.startOffset === this.endOffset && this.startsAndEndsInSameNode();
  };

  /**
   * Merges another range with this range and returns this range.
   *
   * @param {TypeRange} that - The range that should be added to
   *     this range.
   * @returns {TypeRange} - This instance
   */
  mergeWith(that) {

    var startOrder, endOrder;

    startOrder = DomUtilities.order(this.startContainer, that.startContainer);
    endOrder = DomUtilities.order(this.endContainer, that.endContainer);

    if (startOrder === 0) {
      this.startOffset = Math.min(this.startOffset, that.startOffset);
    } else if (startOrder === 1) {
      this.startContainer = that.startContainer;
    }

    if (endOrder === 0) {
      this.endOffset = Math.max(this.endOffset, that.endOffset);
    } else if (startOrder === -1) {
      this.endContainer = that.endContainer;
    }

    return this;

  };

  /**
   * Getter for the start container
   * @returns {Text}
   */
  getStartContainer() {
    return this.startContainer;
  }

  /**
   * Getter for the end container
   * @returns {Text}
   */
  getEndContainer() {
    return this.endContainer;
  }

  /**
   * Internal method to swap the start and end containers as well
   * as their offsets when it is initialized with the endContainer
   * preceding the startContainer.
   *
   * @returns {TypeRange} - This instance
   * @private
   */
  _swapStartAndEnd() {
    this._swapContainers();
    this._swapOffsets();
    return this;
  };

  /**
   * Will swap the startContainer with the endContainer
   *
   * @returns {TypeRange} - This instance
   * @private
   */
  _swapContainers() {
    var swapContainer = this.startContainer;
    this.startContainer = this.endContainer;
    this.endContainer = swapContainer;
    return this;
  };

  /**
   * Will swap the startOffset with the endOffset
   *
   * @returns {TypeRange} - This instance
   * @private
   */
  _swapOffsets() {
    var swapOffset = this.startOffset;
    this.startOffset = this.endOffset;
    this.endOffset = swapOffset;
    return this;
  };

  /**
   * Will create a range spanning from the offset given as start to the
   * offset given as end, counting the characters contained by the given
   * el. This function should be used with the save method of {TypeRange}.
   *
   * @param {{from: HTMLElement, start: number, end: number}} bookmark -
   *     An object as returned by {TypeRange#save}
   * @param {HTMLElement} bookmark.from - The root element from which the
   *     start and end offsets should be counted
   * @param {number} bookmark.start - The offsets (number of characters)
   *     where the selection should start
   * @param {number} bookmark.end - The offsets (number of characters)
   *     where the selection should end
   * @returns {TypeRange} - A {TypeRange} instance
   */
  static load(bookmark) {
    return TypeRange.fromPositions(bookmark.from, bookmark.start, bookmark.end);
  };

  /**
   * Will create a range spanning from the offset given as start to the
   * offset given as end, counting the characters contained by the given
   * el.
   *
   * @param {HTMLElement|Node} el - The root element from which the start
   *     and end offsets should be counted
   * @param {number} startOffset - The offsets (number of characters) where the
   *     selection should start
   * @param {number} endOffset - The offsets (number of characters) where the
   *     selection should end
   * @returns {TypeRange} - A {TypeRange} instance
   */
  static fromPositions(el, startOffset, endOffset) {
    var start = TextUtilities.nodeAtOffset(el, startOffset),
      end = TextUtilities.nodeAtOffset(el, endOffset);
    return new TypeRange(start.node, start.offset, end.node, end.offset);
  };

  /**
   * Will read the current {Selection} on the document and create a {TypeRange}
   * spanning over the {Range}(s) contained by the selection. Will return
   * null if there is no selection on the document.
   *
   * todo Check if selection is actually inside editor and return null if not
   *
   * @returns {TypeRange|null} - A {TypeRange} instance or null
   */
  staticfromCurrentSelection () {
    var sel = document.getSelection();
    return sel.isCollapsed ? null : TypeRange.fromRange(sel.getRangeAt(0));
  };

  /**
   * Will create a {TypeRange} based on the start and end containers and
   * offsets of the given {Range}. This will also take care of browser
   * issues (especially WebKit) when the range is fetched from a selection
   * that ends at the end of an element.
   *
   * todo The "fix" is a solution for a single case
   * todo find the pattern of this and process all cases
   *
   * @param {Range} range - The {Range} that should be <em>migrated</em>
   *     to a {TypeRange}
   * @returns {TypeRange} - The {TypeRange} corresponding to the given
   *     {Range}
   */
  static fromRange(range) {

    //var endContainer = range.endContainer,
    //  endOffset = range.endOffset;
    //if (endOffset === 0 && endContainer === Type.DomWalker.next(range.startContainer.parentNode.nextSibling, 'visible')) {
    //  endContainer = Type.DomWalker.last(range.startContainer.parentNode, 'text');
    //  endOffset = endContainer.length;
    //}
    //return new TypeRange(range.startContainer, range.startOffset, endContainer, endOffset);

    return new TypeRange(range.startContainer, range.startOffset, range.endContainer, range.endOffset);
  };

  /**
   * Will create a {TypeRange} spanning from the offset of the given {Caret}
   * over a number of characters passed as selectedChars. If selectedChars is
   * a positive number, the range's start will be set to the cursor position
   * and the end spanning to the characters to its right. If selectedChars is
   * negative it will span to the characters to its left.
   *
   * @param {Caret} caret
   * @param {number} selectedChars
   * @returns {TypeRange}
   */
  static fromCaret(caret, selectedChars) {
    var startNode = caret.getNode(),
      startOffset = caret.getNodeOffset(),
      end = TextUtilities.nodeAtOffset(startNode, selectedChars, startOffset);
    return new TypeRange(startNode, startOffset, end.node, end.offset);
  };

  /**
   * Will create a {TypeRange} containing the given element's text by
   * finding the first and last text nodes inside the element and spanning
   * a range beginning at the start of the first text node and at the end
   * of the last text node.
   *
   * @param {HTMLElement} el - The element that should be <em>covered</em>
   *     by the returned {TypeRange}.
   * @returns {TypeRange} - A {TypeRange} spanning over the contents of the
   *     given element.
   */
  static fromElement(el) {
    var startNode = DomWalker.first(el, 'text'),
      endNode = DomWalker.last(el, 'text');
    return new TypeRange(startNode, 0, endNode, endNode.nodeValue.length);
  };

  /**
   * Will return a new {TypeRange} at the position read from a given
   * {MouseEvent}. Will return null if the event was not triggerd from
   * within a text node.
   *
   * @param {MouseEvent} e - The mouse event to read positions from
   * @returns {TypeRange|null} - Returns a new TypeRange or null if the
   *     event has not been triggered from inside a text node
   */
  static fromMouseEvent(e) {
    return TypeRange.fromPoint(e.clientX, e.clientY);
  };

  /**
   * Will create a {TypeRange} at the offset and inside the text node
   * found at the x and y positions relative to the document. The range
   * will be collapsed. Will return null
   *
   * @param {number} x - The horizontal position relative to the document
   * @param {number} y - The vertical position relative to the document
   * @returns {TypeRange|null} - Returns a new TypeRange or null if the
   *     position is not inside a text node
   */
  static fromPoint(x, y) {

    var range, node, offset;

    if (document.caretPositionFromPoint) {
      range = document.caretPositionFromPoint(x, y);
      node = range.offsetNode;
      offset = range.offset;

    } else if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
      node = range.startContainer;
      offset = range.startOffset;

    } else {
      Type.Development.debug('This browser does not support caretPositionFromPoint or caretRangeFromPoint.');
      return null;
    }

    // only split TEXT_NODEs
    if (node.nodeType === Node.TEXT_NODE) {
      return new TypeRange(node, offset, node, offset);
    }

    Type.Development.debug('User clicked in a non-text node, cannot create range');

    return null;

  };

}

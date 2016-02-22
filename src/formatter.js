'use strict';

import Development from './utilities/development';
import InlineFormatter  from './formatters/inline_formatter';
import BlockFormatter  from './formatters/block_formatter';
import {default as BaseFormatter} from './formatters/formatter';

export default class Formatter {

  /**
   *
   * @param {Type} type
   * @constructor
   */
  constructor(type) {
    this._type = type;
    this._inlineFormatter = new InlineFormatter(type);
    this._blockFormatter = new BlockFormatter(type);
    this._baseFormatter = new BaseFormatter(type);
  }

  /**
   * A list of tags that are displayed inline. We generate different markup
   * for inline and block tags. We use this array as reference to determine
   * what kind of markup to generate.
   *
   * @type {string[]}
   * @private
   */
  static get _inlineTags() { return ['strong', 'em', 'u', 's']; }

  /**
   * A list of tags that are displayed as block elements. We generate different
   * markup for inline and block tags. We use this array as reference to determine
   * what kind of markup to generate.
   *
   * @type {string[]}
   * @private
   */
  static get _blockTags() { return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote']; }

  /**
   * Will call either this.inline, this.block or this._noop depending on
   * whether the given tag is an inline or block element or we do not know
   * this tag yet (the latter would call _noop which would utter no action).
   *
   * @param {String} tag - The tag that we want to format the text with
   * @param {TypeRange} typeRange - An object containing data on which part
   *     of the text to format
   * @returns {Element[]} - The elements created by the formatting function
   */
  format(tag, typeRange) {
    typeRange.ensureIsInside(this._type.getEl());
    const ret = this._handlerFor(tag).format(tag, typeRange);
    this._type.emit('format', ret);
    return ret;
  }

  /**
   * Takes a tag name and returns the handler function for formatting
   * the DOM with this tag by checking if it is an inline or block tag.
   *
   * Todo Maybe use fallback http://stackoverflow.com/a/2881008/1183252 if tag is not found
   *
   * @param {String} tag - The name of the tag that the DOM should be
   *     formatted with.
   * @returns {InlineFormatter|BlockFormatter|BaseFormatter} - The handler function for inline
   *     or block tags, or _noop if the tag is unknown.
   * @private
   */
  _handlerFor(tag) {
    tag = tag.toLowerCase();
    if (this.constructor._inlineTags.indexOf(tag) > -1) return this._inlineFormatter;
    if (this.constructor._blockTags.indexOf(tag) > -1) return this._blockFormatter;
    Development.error('Tag "' + tag + '" not implemented');
    return this._baseFormatter;
  }

}

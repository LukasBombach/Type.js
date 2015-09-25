'use strict';

import Formatter from './formatter';

export default class NestedBlockFormatter extends Formatter {

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

    typeRange.ensureIsInside(this._type.getEl());

  };

  /**
   * A list of tags that are displayed as block elements. We generate different
   * markup for inline and block tags. We use this array as reference to determine
   * what kind of markup to generate.
   *
   * @type {string[]}
   * @private
   */
  static get _blockTags() { return ['blockquote']; };

}
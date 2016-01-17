'use strict';

import Type from './core';
import TypeRange from './range';
import TypeSelection from './selection';

/**
 * todo add namespace parameter
 * @param el
 * @param key
 * @param value
 * @returns {*}
 * @static
 */
Type.data = function(el, key, value) {
  const data = el[Type.expando] = el[Type.expando] || {};
  if (key === undefined) return data;
  if (value === undefined) return data[key];
  data[key] = value;
  return this;
};

/**
 *
 * @param htmlString
 * @returns {Type}
 */
Type.fn.format = function(htmlString) {
  var sel = TypeSelection.fromNativeSelection(this);
  this.getFormatter().format(htmlString, sel.getRange());
  sel.select();
  return this;
};

/**
 *
 * @param format
 * @returns {Type}
 */
Type.fn.format = function(format) {
  this._document = this.getDocument().copyWithAttributesAtRange(format, this.getRange());
  this._renderer.render();
  return this;
};
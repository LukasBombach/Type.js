import Type from './core';
import TypeSelection from './selection';

/**
 * todo add namespace parameter
 * @param el
 * @param key
 * @param value
 * @returns {*}
 * @static
 */
Type.data = (el, key, value) => {
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
Type.fn.format = (htmlString) => {
  const sel = TypeSelection.fromNativeSelection(this);
  this.getFormatter().format(htmlString, sel.getRange());
  sel.select();
  return this;
};

/**
 *
 * @param format
 * @returns {Type}
 */
Type.fn.format = (format) => {
  this._nodeList = this.getDocument().copyWithAttributesAtRange(format, this.getRange());
  this._renderer.render();
  return this;
};

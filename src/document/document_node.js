'use strict';

import Development from '../utilities/development';

export default class DocumentNode {

  /**
   *
   * @param {Type} type
   * @param attributes
   */
  constructor(type, attributes = []) {
    this._type = type;
    this.id = type.getUniqueId();
    this.setAttributes(attributes);
  }

  /**
   *
   * @param attributes
   * @returns {DocumentNode}
   */
  setAttributes(attributes = []) {

    this._attributes = attributes.map(function(attr) {
      return typeof attr === 'string' ? [attr,true] : attr;
    });

    return this;
  }

  /**
   *
   * @param attribute
   * @returns {DocumentNode}
   */
  addAttribute(attribute) {
    this._attributes.push(attribute);
    return this;
  }

  /**
   *
   * @returns {Array}
   */
  getAttributes() {
    return this._attributes.slice(0);
  }

}

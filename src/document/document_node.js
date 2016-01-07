'use strict';

import Development from '../utilities/development';

export default class DocumentNode {

  /**
   *
   * @param attributes
   */
  constructor(attributes = []) {
    this._attributes = attributes;
  }

  /**
   *
   * @param attributes
   * @returns {DocumentNode}
   */
  setAttributes(attributes = []) {
    this._attributes = attributes;
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

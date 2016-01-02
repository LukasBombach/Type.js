'use strict';

import Development from '../utilities/development';

export default class DocumentNode {

  /**
   *
   */
  constructor() {
    this.attributes = [];
  }

  /**
   *
   * @param attributes
   * @returns {DocumentNode}
   */
  setAttributes(attributes = []) {
    this.attributes = attributes;
    return this;
  }

  /**
   *
   * @param attribute
   * @returns {DocumentNode}
   */
  addAttribute(attribute) {
    this.attributes.push(attribute);
    return this;
  }

}

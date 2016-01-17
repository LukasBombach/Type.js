'use strict';

import Attributes from './attributes';

export default class DocumentNode {

  /**
   *
   * @param {Type} type
   * @param attributes
   */
  constructor(type, attributes = []) {
    this._type = type;
    this.id = type.getUniqueId();
    this.attributes = new Attributes(attributes);
  }

}

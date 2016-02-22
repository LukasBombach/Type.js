import Attributes from './attributes';

export default class DocumentNode {

  /**
   *
   * @param {Type} type
   * @param attributes
   * @param parent
   */
  constructor(type, attributes = [], parent = null) {
    this._type = type;
    this.id = type.getUniqueId();
    this.attributes = new Attributes(attributes);
    this.parent = parent;
  }

}

'use strict';

import Renderer from '../renderer';

/**
 * @augments Renderer
 */
export default class DomRenderer extends Renderer {

  /**
   *
   * @param {Type} type
   */
  constructor(type) {
    super(type);
    this._el = type.getEl();
  }

  /**
   *
   * @returns {DomRenderer}
   */
  render() {
    return this;
  }

  /**
   *
   * @returns {DomRenderer}
   */
  clear() {
    this._el.innerHTML = '';
    return this;
  }

}

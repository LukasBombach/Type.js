'use strict';

export default class Renderer {

  /**
   *
   * @param {Type} type
   */
  constructor(type) {
    this._type = type;
  }

  /**
   *
   * @returns {Renderer}
   */
  render() {
    return this;
  }

  /**
   *
   * @returns {Renderer}
   */
  clear() {
    return this;
  }

}

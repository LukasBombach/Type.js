'use strict';

export default class Environment {

  /**
   * Is the user's computer a Macintosh computer
   * @type {boolean}
   */
  static get mac() { return navigator.appVersion.indexOf('Mac') !== -1; };

}

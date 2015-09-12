'use strict';

import Development from './development';

var DEFAULT_MAX_LISTENERS = 12;

export default class EventEmitter {

  /**
   * @constructor
   */
  constructor() {
    this.setMaxListeners(DEFAULT_MAX_LISTENERS);
    this._eventListeners = {};
  }

  /**
   *
   * @param {string} type
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  on(type, listener) {

    if (typeof listener !== 'function') {
      throw new TypeError();
    }

    this._eventListeners[type] = this._eventListeners[type] || [];
    this._eventListeners[type].push(listener);

    if (this._eventListeners.length > this._maxListeners) {
      Development.error(
          'Possible memory leak, added %i %s listeners, ' +
          'use EventEmitter#setMaxListeners(number) if you ' +
          'want to increase the limit (%i now)',
          this._eventListeners.length, type, this._maxListeners
      );
    }

    return this;
  }

  /**
   *
   * @param {string} type
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  once(type, listener) {

    var onceCallback = () => {
      'use strict';
      this.off(type, onceCallback);
      listener.apply(null, arguments);
    };

    return this.on(type, onceCallback);
  };

  /**
   *
   * @param {string} type
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  off(type, listener) {

    const index = this._eventListeners[type] ? this._eventListeners[type].indexOf(listener) : -1;

    if (index > -1) {
      this._eventListeners[type].splice(index, 1);
    }

    return this;
  }

  /**
   *
   * @param {string} type
   * @param args
   * @returns {EventEmitter}
   */
  emit(type, ...args) {

    if (this._eventListeners[type]) {
      this._eventListeners.forEach(fn => fn.apply(null, args));
    }

    return this;
  }

  /**
   *
   * @param {number} maxListeners
   * @returns {EventEmitter}
   */
  setMaxListeners(maxListeners) {

    if (parseInt(maxListeners) !== maxListeners) {
      throw new TypeError();
    }

    this._maxListeners = maxListeners;
    return this;
  }
}

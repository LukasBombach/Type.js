import Development from './development';

let DEFAULT_MAX_LISTENERS = 12;

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
   * @param {boolean|Function} lazy
   * @param {Function} [listener]
   * @returns {EventEmitter}
   */
  on(type, lazy, listener) {

    if (typeof lazy === 'function') {
      listener = lazy;
      lazy = false;
    }

    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function, got ' + (typeof listener));
    }

    const multiple = type.split(' ');
    const modListener = lazy ? () => window.setTimeout(listener, 0) : listener;

    for (type of multiple) {
      this._addListener(type, modListener);
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
      this.off(type, onceCallback);
      listener.apply(null, arguments);
    };

    return this.on(type, onceCallback);
  }

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
      this._eventListeners[type].forEach(fn => fn.apply(null, args));
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

  /**
   *
   * @param {string} type
   * @param {Function} listener
   * @returns {EventEmitter}
   * @private
   */
  _addListener(type, listener) {
    this._eventListeners[type] = this._eventListeners[type] || [];
    this._eventListeners[type].push(listener);
    this._checkListenerStack(type);
    return this;
  }

  /**
   *
   * @param {string} type
   * @returns {EventEmitter}
   * @private
   */
  _checkListenerStack(type) {
    if (this._eventListeners[type].length > this._maxListeners) {
      Development.error(
          'Possible memory leak, added %i %s listeners, ' +
          'use EventEmitter#setMaxListeners(number) if you ' +
          'want to increase the limit (%i now)',
          this._eventListeners[type].length, type, this._maxListeners
      );
    }

    return this;
  }

}

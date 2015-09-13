'use strict';

/**
 *
 * @constructor
 */
export default class Events {

  /**
   * Adds a native event listener for an event. Does cross-browser Kung Fu stuff.
   *
   * @param {EventTarget} el - The target (element) to add the event listener to.
   * @param {string} type - A string representing the event type to listen for.
   * @param {Function} listener - The callback to be called on the event.
   * @param {boolean} [useCapture] - Optional, defaults to false. Native useCapture
   *     parameter. Read MDN.
   * @returns {*}
   */
  static addListener(el, type, listener, useCapture) {
    const multiple = type.split(' ');
    for (type of multiple) {
      if (el.addEventListener) {
        return el.addEventListener(type, listener, useCapture || false);
      } else if (el.attachEvent) {
        return el.attachEvent('on' + type, listener);
      }
    }
  };

  /**
   * Removes a native event listener from an event. Does cross-browser Kung Fu stuff.
   *
   * @param {EventTarget} el - The target (element) to remove the event listener from.
   * @param {string} type - A string representing the event type to listen for.
   * @param {Function} listener - The callback to be removed from the event.
   * @param {boolean} [useCapture] - Optional, defaults to false. Native useCapture
   *     parameter. Read MDN.
   * @returns {*}
   */
  static removeListener(el, type, listener, useCapture) {
    if (el.removeEventListener) {
      return el.removeEventListener(type, listener, useCapture || false);
    } else if (el.detachEvent) {
      return el.detachEvent('on' + type, listener);
    }
  };

}
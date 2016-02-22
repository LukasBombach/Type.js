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
   * @param {boolean} [lazy] - Optional, defaults to false. Whether or not the listener
   *     should be called after the event has completed firing.
   * @param {boolean} [useCapture] - Optional, defaults to false. Native useCapture
   *     parameter. Read MDN.
   * @returns {*}
   */
  static addListener(el, type, listener, lazy = false, useCapture = false) {
    const multiple = type.split(' ');
    const modListener = lazy ? () => window.setTimeout(listener, 0) : listener;

    for (type of multiple) {
      if (el.addEventListener) el.addEventListener(type, modListener, useCapture);
      else if (el.attachEvent) el.attachEvent(`on${type}`, modListener);
    }

    return this;
  }

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
  static removeListener(el, type, listener, useCapture = false) {
    if (el.removeEventListener) el.removeEventListener(type, listener, useCapture);
    else if (el.detachEvent) el.detachEvent(`on${type}`, listener);
    return this;
  }

}

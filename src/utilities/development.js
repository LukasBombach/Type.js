'use strict';

/**
 * Holds messages for developing and debugging Type
 * @constructor
 */
export default class Development {

  /**
   * Prints a message to the console if the browser's
   * console offers the log method.
   *
   * @param {...*} messages - Any number and type of arguments
   *     you want to pass to console.debug
   */
  static log(messages) {
    if (console && console.log) console.log.apply(console, arguments);
    return this;
  }

  /**
   * Prints a debug message to the console if the browser's
   * console offers a debug method.
   *
   * @param {...*} messages - Any number and type of arguments
   *     you want to pass to console.debug
   */
  static debug(messages) {
    if (console && console.debug) console.debug.apply(console, arguments);
    return this;
  }

  /**
   * Prints an error to the console if the browser's console
   * offers an error method.
   *
   * @param message
   * @param args
   * @returns {Development}
   */
  static error(message, ...args) {
    if (console && console.error) console.error.apply(console, [message].concat(args));
    if (console.trace) console.trace();
    return this;
  }

}

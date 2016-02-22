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
    if (window.console && window.console.log) window.console.log.apply(window.console, ...messages);
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
    if (window.console && window.console.debug) {
      window.console.debug.apply(window.console, ...messages);
    }

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
    if (window.console && window.console.error) {
      window.console.error.apply(window.console, [message].concat(args));
    }

    if (window.console.trace) {
      window.console.trace();
    }

    return this;
  }

}

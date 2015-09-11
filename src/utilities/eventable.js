'use strict';

/**
 * Todo should be mixin
 */
export default class Eventable {

  /**
   * Register a callback for a Type specific event
   *
   * @param {String} eventName - The name of the event on which you wish the
   *     function to be called
   * @param {Function} cb - The function you wish to be called on the event
   * @returns {Eventable}
   */
  on(eventName, cb) {
    this.eventCallbacks = this.eventCallbacks || {};
    this.eventCallbacks[eventName] = this.eventCallbacks[eventName] || [];
    this.eventCallbacks[eventName].push(cb);
    return this;
  };

  /**
   * Unregister a callback for a Type specific event
   *
   * @param {String} eventName - The name of the event on which you wish the
   *     for which you no longer wish to call the function
   * @param {Function} cb - The function you no longer wish to be called
   * @returns {Eventable}
   */
  off(eventName, cb) {

    var index;

    this.eventCallbacks = this.eventCallbacks || {};
    index = this.eventCallbacks[eventName] ? this.eventCallbacks[eventName].indexOf(cb) : -1;

    if (index > -1) {
      this.eventCallbacks[eventName].splice(index, 1);
    }

    return this;
  };

  /**
   * Trigger a Type specific event to call all callbacks for
   *
   * @param {String} eventName - The name of the event on which you wish to
   *     call its callbacks for
   * @param {...*} params - Arbitrary parameters you wish to pass to the
   *     callbacks
   * @returns {Eventable}
   */
  trigger(eventName, params) {

    var i;

    this.eventCallbacks = this.eventCallbacks || {};

    if (this.eventCallbacks[eventName]) {
      for (i = 0; i < this.eventCallbacks[eventName].length; i += 1) {
        this.eventCallbacks[eventName][i].process(this, params);
      }
    }

    return this;

  };

}

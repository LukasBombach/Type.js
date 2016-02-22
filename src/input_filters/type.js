export default class TypeFilter {

  /**
   *
   * @constructor
   */
  constructor() {
    this._keys = {};
  }

  /**
   * Searches for a callback in the _keys map of this
   * filter and calls it with the given event. Will also
   * check for an 'all' definition as a fallback.
   *
   * @param {KeydownEvent} e - The event to process the
   *     filter for.
   * @returns {TypeFilter} - This instance
   */
  process(e) {
    var func = this._keys[e.key] || this._keys.all;
    if (func) this[func](e);
    return this;
  }

}

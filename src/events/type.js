'use strict';

import Utilities from '../utilities/utilities';

export default class TypeEvent {

  /**
   * Creates a new Type event
   * @constructor
   */
  constructor() {
    this.canceled = false;
  };

  /**
   * jQuery getting and setting of the _data object
   * @param data
   * @param value
   * @returns {*}
   */
  data(data, value) {
    this._data = this._data || {};
    return Utilities.getterSetterParams(this, this._data, data, value);
  };

  /**
   * Sets this event instance to be cancelled
   *
   * @param {boolean} [doCancel] - Set to false to uncancel
   *     the event. All other values or no value at all
   *     will set the event to be cancelled
   * @returns {TypeEvent} - This instance
   */
  cancel(doCancel) {
    this.canceled = doCancel !== false;
    return this;
  };

}

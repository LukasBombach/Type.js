'use strict';

import Events from '../utilities/events';
import TypeSelection from '../selection';

export default class SelectionInput {

  /**
   *
   * @param {Type} type
   * @constructor
   */
  constructor(type) {
    this._type = type;
    this._lastSelection = null;
    this._addListenersFor(type);
  };

  /**
   *
   * @param {Type} type
   * @returns {SelectionInput}
   */
  _addListenersFor(type) {
    Events.addListener(type.getEl(), 'mousedown mouseup keydown keyup', this._checkSelectionAndEmit.bind(this), true);
    return this;
  };

  /**
   *
   * @returns {SelectionInput}
   * @private
   */
  _checkSelectionAndEmit() {
    var sel = TypeSelection.fromNativeSelection(this._type);
    sel = sel.isCollapsed() ? null : sel;
    this._checkAndEmitStart(sel);
    this._checkAndEmitChange(sel);
    this._checkAndEmitEnd(sel);
    this._lastSelection = sel;
    return this;
  };

  /**
   *
   * @param {TypeSelection} sel
   * @returns {SelectionInput}
   * @private
   */
  _checkAndEmitStart(sel) {
    if (this._lastSelection === null && sel !== null) {
      this._type.emit('selectstart', sel);
      this._type.emit('select', sel);
    }

    return this;
  };

  /**
   *
   * @param {TypeSelection} sel
   * @returns {SelectionInput}
   * @private
   */
  _checkAndEmitChange(sel) {
    if (this._lastSelection !== null && sel !== null && !this._lastSelection.equals(sel)) {
      this._type.emit('select', sel);
    }

    return this;
  };

  /**
   *
   * @param {TypeSelection} sel
   * @returns {SelectionInput}
   * @private
   */
  _checkAndEmitEnd(sel) {
    if (this._lastSelection !== null && sel === null) {
      this._type.emit('selectend', sel);
    }

    return this;
  }

}
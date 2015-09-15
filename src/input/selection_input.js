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
    //Events.addListener(type.getEl(), 'selectstart', this._selectionStart.bind(this));
    Events.addListener(type.getEl(), 'mouseup keydown', this._checkSelectionAndEmit.bind(this));
    return this;
  };

  /**
   * todo check if the user created a new selection, that does not touch the old selection
   * todo and emit selectend and selectstart instead of a select (change)
   *
   * @returns {SelectionInput}
   * @private
   */
  _checkSelectionAndEmit() {
    var sel = TypeSelection.fromNativeSelection();
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
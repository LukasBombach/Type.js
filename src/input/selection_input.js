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
    Events.addListener(type.getEl(), 'selectstart', this._selectionStart.bind(this));
    Events.addListener(type.getEl(), 'mouseup keydown', this._checkSelectionAndEmit.bind(this));
    return this;
  };

  /**
   *
   * @returns {SelectionInput}
   * @private
   */
  _checkSelectionAndEmit() {

    var sel = TypeSelection.fromNativeSelection();

    if (!this._lastSelection.equals(sel)) {
      this._lastSelection = sel;
      this._emitSelectionChange(this._lastSelection);
    }

    return this;

  };

  /**
   *
   * @private
   */
  _selectionStart() {
    this._lastSelection = TypeSelection.fromNativeSelection();
    this._emitSelectionStart(this._lastSelection);
    this._emitSelectionChange(this._lastSelection);
  }

  /**
   *
   * @param {TypeSelection} sel
   * @returns {SelectionInput}
   * @private
   */
  _emitSelectionStart(sel) {
    this._type.emit('selectstart', sel);
    return this;
  }

  /**
   *
   * @param {TypeSelection} sel
   * @returns {SelectionInput}
   * @private
   */
  _emitSelectionChange(sel) {
    this._type.emit('select', sel);
    return this;
  }

}
import Events from '../utilities/events';
import KeydownEvent from '../events/keydown';

import CommandFilter from '../input_filters/command';

/**
 *
 * @param {Type} type
 * @constructor
 */
export default class InputPipeline {

  /**
   *
   * @param type
   */
  constructor(type) {
    this._type = type;
    this._filters = [];
    this._addDefaultFilters();
    this._addListener(type.getEl());
  }

  /**
   *
   * @param {TypeFilter} filter
   * @param {number} [pos]
   * @returns {InputPipeline}
   */
  addFilter(filter, pos) {
    pos = pos || filter.length;
    this._filters.splice(pos, 0, filter);
    return this;
  }

  /**
   *
   * @param {number|TypeFilter} posOrFilter
   * @returns {InputPipeline}
   */
  removeFilter(posOrFilter) {
    if (typeof posOrFilter !== 'number') {
      posOrFilter = this._filters.indexOf(posOrFilter);
    }

    if (posOrFilter > 0) {
      this._filters.splice(posOrFilter, 1);
    }

    return this;
  }

  /**
   *
   * @returns {InputPipeline}
   * @private
   */
  _addDefaultFilters() {
    // this.addFilter(new DebugFilter(this._type));
    this.addFilter(new CommandFilter(this._type));
    return this;
  }

  /**
   *
   * @param {EventTarget} el
   * @returns {InputPipeline}
   * @private
   */
  _addListener(el) {
    Events.addListener(el, 'keydown', this._processPipeline.bind(this));
    return this;
  }

  /**
   *
   * @param {KeyboardEvent} e
   * @returns {KeydownEvent}
   * @private
   */
  _processPipeline(e) {
    const keydownEvent = KeydownEvent.fromNativeEvent(e);

    for (const filter of this._filters) {
      if (!this._processFilter(filter, keydownEvent)) {
        e.stopPropagation();
        e.preventDefault();
        break;
      }
    }

    return keydownEvent;
  }

  /**
   *
   * @param filter
   * @param {KeydownEvent} e
   * @returns {boolean}
   * @private
   */
  _processFilter(filter, e) {
    filter.process(e);
    return e.canceled === false;
  }

}

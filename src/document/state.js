export default class State {

  /**
   *
   * @param reducer
   * @param initialState
   */
  constructor(reducer = State._noOpReducer, initialState) {
    this._reducer = reducer;
    this._currentState = initialState;
    this._listeners = [];
    this._isDispatching = false;
  }

  /**
   *
   * @param action
   * @returns {State}
   */
  dispatch(action) {
    if (typeof action.type === 'undefined') throw new Error('Actions must have a "type" property.');
    if (this._isDispatching) throw new Error('Reducers may not dispatch actions.');

    try {
      this._isDispatching = true;
      this._currentState = this._reducer(this._currentState, action);
    } finally {
      this._isDispatching = false;
    }

    for (const listener of this._listeners) listener();

    return this;
  }

  /**
   *
   * @param listener
   * @returns {State}
   */
  subscribe(listener) {
    if (typeof listener !== 'function') throw new Error('Expected listener to be a function.');
    this._listeners.push(listener);
    return this;
  }

  /**
   *
   * @param listener
   * @returns {State}
   */
  unsubscribe(listener) {
    const index = this._listeners.indexOf(listener);
    this._listeners.splice(index, 1);
    return this;
  }

  /**
   *
   * @returns {*}
   */
  getState() {
    return this._currentState;
  }

  /**
   *
   * @param state
   * @returns {*}
   * @private
   */
  static _noOpReducer(state) {
    return state;
  }

}

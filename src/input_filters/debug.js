'use strict';

import TypeFilter from './type';

/**
 *
 * @constructor
 */
export default class DebugFilter extends TypeFilter {

  constructor() {

    super();

    this._keys = {
      all: 'log',
    };
  }

  log(e) {
    console.log('Keydown', e.key);
  };

}
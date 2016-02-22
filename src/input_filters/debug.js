import TypeFilter from './type';
import Development from '../utilities/development';

/**
 *
 * @constructor
 */
export default class DebugFilter extends TypeFilter {

  constructor() {
    super();
    this._keys = { all: 'log' };
  }

  log(e) {
    Development.log('Keydown', e.key);
  }

}

import TypeFilter from './type';
import TypeRange from '../range';
import TypeSelection from '../selection';

/**
 * Creates a command filter. Will fetch common
 * text formatting keyboard shortcuts and call
 * the according formatting methods.
 *
 * todo should listen for key codes and not keys
 *
 * @param {Type} type
 * @constructor
 */
export default class CommandFilter extends TypeFilter {

  constructor(type) {

    super();

    this._type = type;

    this._keys = {
      66: 'command', // b
      73: 'command', // i
      83: 'command', // s
      85: 'command', // u
    };

    this._tags = {
      66: 'strong',
      73: 'em',
      83: 's',
      85: 'u',
    };
  }

  /**
   * @param {KeydownEvent} e
   */
  command(e) {
    if (e.cmd) {
      var sel = this._type.getSelection();
      this._type.getFormatter().format(this._tags[e.key], sel.getRange());
      sel.select();
      e.cancel();
    }
  }

}

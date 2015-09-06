'use strict';

var TypeEvent = require('./type');
var OOP = require('../oop');
var Environment = require('../environment');

/**
 * Creates a new Type input event.
 * This is an abstraction for browser events that lead to an input in
 * the editor.
 *
 * @param {Object} options - Object holding parameters for the event
 * @param {string} [options.key] - A descriptive name for the key
 *     pressed as set in {@link InputEvent.keyDownNames}.
 * @param {number} [options.keyCode] - The key code of the key pressed
 * @param {boolean} [options.shift] - Whether or not the shift key has
 *     been pressed together with the given key.
 * @param {boolean} [options.alt] - Whether or not the alt key has
 *     been pressed together with the given key.
 * @param {boolean} [options.ctrl] - Whether or not the control key has
 *     been pressed together with the given key.
 * @param {boolean} [options.meta] - Whether or not the command key has
 *     been pressed together with the given key (for os x users).
 * @constructor
 */
function InputEvent(options) {

  options = options || {};

  this.key     = options.key     || null;
  this.keyCode = options.keyCode || null;
  this.shift   = options.shift   || false;
  this.alt     = options.alt     || false;
  this.ctrl    = options.ctrl    || false;
  this.meta    = options.meta    || false;
  this.cmd     = (!Environment.mac && options.ctrl) || (Environment.mac && options.meta);

  this.canceled = false;

}

/**
 * Inherit from general Type event
 */
OOP.inherits(InputEvent, TypeEvent);

/**
 * Maps character codes from key down events to readable names
 * @type {Object}
 */
InputEvent.keyDownNames = {
  8:  'backspace',
  9:  'tab',
  13: 'enter',
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  46: 'del',
};

/**
 * Factory to create a {InputEvent} from an {InputEvent}
 *
 * @param {InputEvent} e
 * @returns {InputEvent}
 */
InputEvent.fromInput = function(e) {
  return InputEvent.fromKeyDown(e);
};

/**
 * Factory to create a {InputEvent} from a {KeyboardEvent}
 *
 * @param {KeyboardEvent} e
 * @returns {InputEvent}
 */
InputEvent.fromKeyDown = function(e) {

  var charCode = (typeof e.which === 'number') ? e.which : e.keyCode;
  var options = {
      key:     InputEvent.keyDownNames[charCode] || charCode,
      keyCode: charCode,
      shift:   e.shiftKey,
      alt:     e.altKey,
      ctrl:    e.ctrlKey,
      meta:    e.metaKey,
    };

  return new InputEvent(options);

};

module.exports = InputEvent;

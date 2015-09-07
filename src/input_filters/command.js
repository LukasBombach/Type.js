'use strict';

var OOP = require('../utilities/oop');
var TypeFilter = require('./type');
var TypeRange = require('../utilities/range');

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
function CommandFilter(type) {
  this._type = type;
}

OOP.inherits(CommandFilter, TypeFilter);

(function() {

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

  /**
   * @param {InputEvent} e
   */
  this.command = function(e) {
    
    //var sel;
    var range;

    if (e.cmd) {

      range = TypeRange.fromCurrentSelection();
      this._type.getFormatter().format(this._tags[e.key], range);

      //sel = this._selection.save();
      //this._content.format(this.tags[e.key], this._selection.getRange());
      //this._selection.restore(sel);
      
      e.cancel();
    }

  };

}).call(CommandFilter.prototype);

module.exports = CommandFilter;

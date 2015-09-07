'use strict';

var TypeFilter = require('./type');
var OOP = require('../utilities/oop');

/**
 *
 * @constructor
 */
function DebugFilter() {
}

OOP.inherits(DebugFilter, TypeFilter);

(function() {

  this._keys = {
    all: 'log',
  };

  this.log = function(e) {
    console.log('Keydown', e.key);
  };

}).call(DebugFilter.prototype);

module.exports = DebugFilter;

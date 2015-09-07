'use strict';

var TypeFilter = require('./type');
var OOP = require('../oop');

/**
 *
 * @constructor
 */
function TestFilter() {
}

OOP.inherits(TestFilter, TypeFilter);

(function() {

  this._keys = {
    all: 'log',
  };

  this.log = function(e) {
    console.log('test filter', e.key);
  };

}).call(TestFilter.prototype);

module.exports = TestFilter;

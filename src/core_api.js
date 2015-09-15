'use strict';

import Type from './core';
import TypeRange from './range';
import TypeSelection from './selection';

Type.fn.format = function(htmlString) {
  var sel = TypeSelection.fromNativeSelection();
  this.getFormatter().format(htmlString, sel.getRange());
  sel.select();
};
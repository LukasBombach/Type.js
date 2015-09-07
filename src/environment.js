'use strict';

function Environment() {
}

(function() {

  /**
   * Is the user's computer a Macintosh computer
   * @type {boolean}
   */
  Environment.mac = navigator.appVersion.indexOf('Mac') !== -1;

}).call(Environment);

module.exports = Environment;

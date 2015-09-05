'use strict';

var OOP = require('./oop');

/**
 * Creates a new Type editor and sets up the core
 * modules used for WYSIWYG editing. The core
 * class only holds methods for setting and retrieving
 * options as well getters and setters for instances
 * of core modules.
 *
 * @param {{}|Element} options - Either pass
 *     an associative array with options for this
 *     editor or the root element that should be
 *     used to modify its contents for WYSIWYG
 *     editing
 * @param {Element} options.el The root element
 *     that should be used to modify its contents
 *     for WYSIWYG editing
 * @constructor
 */
function Type(options) {

  // Allow passing an element as only parameter
  if (Type.DomUtilities.isNode(options)) {
    options = {el: options};
  }

  // If no element has been passed, interrupt
  if (!options.el) {
    throw new Error('You must provide an element as root node for the editor\'s contents.');
  }

  // Set settings for this editor
  this._options = null;
  this.options(options);

  // Enable editing mode on root element
  this._setElementEditable(options.el);

  // Trigger events
  Type.trigger('ready', this);

}

// Todo WIP dev code
require('./settings');
require('./utilities');
require('./dom_utilities');
var Events = require('./events');

/**
 * Make Type eventable
 */
OOP.inherits(Type, Events);

(function() {

  /**
   * Allows fast detection if an object is a Type Editor
   * instance (or class)
   *
   * @type {boolean}
   */
  this.typeEditor = true;

  /**
   * Holds the default options for every editor. These options
   * will be extended by the options passed to each instance
   * on instantiation.
   *
   * @type {{el: null, undoSteps: number}}
   * @private
   */
  this._defaultOptions = {
    el: null,
    undoSteps: 20,
  };

  /**
   * Sets or gets the options to be used by this Type instance.
   * Parameters can be passed as you know it from jQuery:
   *
   * Pass a single string to get an option:
   * this.options('el')
   * returns your editor's TypeContents baseelement
   *
   * Pass a name value combination to set a specific option
   * this.options('el', myElement)
   * sets the base element
   *
   * Pass an object to set multiple options
   * this.options({el: myElement, foo:bar})
   * sets both parameters
   *
   * @param {(string|{el: Element}|{}|*)} options - Either a plain object
   *     with keys and values to be set or a string that will
   *     be used as a name for a option. If you pass a string,
   *     pass a second parameter to set that option or no
   *     second parameter to retrieve that option.
   * @param {*} [value] - If the first parameter is a string,
   *     this value will be set to the key of the given first
   *     parameter. Any arbitrary value can be set.
   * @returns {Type|*} Returns the type instance if you set an
   *     option or the according value if you get an option
   */
  this.options = function(options, value) {

    var opts;

    // Load default options if there are no instance options yet
    this._options = this._options || Type.Utilities.extend({}, this._defaultOptions);

    // Pass a single option name to fetch it
    if (typeof options === 'string' && arguments.length === 1) {
      return this._options[options];
    }

    // Pass an option name and a value to set it
    if (typeof options === 'string' && arguments.length === 2) {
      opts = {};
      opts[options] = value;
      options = opts;
    }

    // Pass an object of key-values to set them
    if (typeof options === 'object') {
      Type.Utilities.extend(this._options, options);
    }

    // Chaining
    return arguments.length ? this : this._options;

  };

  /**
   * Creates a {Type.DomWalker} that ist constrained to this
   * instance's root element unless you explicitly pass a
   * constrainingNode as argument. All other DomWalker options
   * can also be passed to this as usual.
   *
   * @param {Node} node - Any DOM {Node} to be set as starting
   *     node for the DomWalker
   * @param {Node|string|Function|{constrainingNode: Node, filter: string|Function}} [options]
   *     See {Type.DomWalker} for a description of possible arguments
   * @returns {Type.DomWalker}
   */
  this.createDomWalker = function(node, options) {
    options = Type.DomWalker.loadOptions(options || {});
    options.constrainingNode = options.constrainingNode || this._root;
    return new Type.DomWalker(node, options);
  };

  /**
   * Getter for this instance's root element, i.e. the
   * element that contains this editor's text.
   * @returns {Element}
   */
  this.getEl = function() {
    return this._options.el;
  };

  /**
   * Sets the editing mode of an element. The second parameter
   * determines if the editing mode should be enabled or disabled.
   * If no second parameter is give this defaults to true.
   *
   * @param {Element} el - The element to set the editing mode for
   * @param {boolean|string} [val] - Set to true to enable editing mode
   *     or false to disable it. Optional, defaults to true.
   * @returns {Type}
   * @private
   */
  this._setElementEditable = function(el, val) {
    val = val === false ? 'false' : 'true';
    el.setAttribute('contenteditable', val);
    return this;
  };

}).call(Type.prototype);

/**
 * Exposes Type's prototype as jQuery-style shorthand variable
 * @type {Object}
 */
Type.fn = Type.prototype;

/**
 * Module Exports for CommonJs
 * @type {Type}
 */
module.exports = Type;

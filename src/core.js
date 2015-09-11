'use strict';

//var InputPipeline = require('./input/input_pipeline');
//var Formatter = require('./formatter');

import Eventable from './utilities/eventable.es5';
import Utilities from './utilities/utilities';
import DomUtilities from './utilities/dom_utilities';

export default class Type {

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
  constructor(options) {

    // Allow passing an element as only parameter
    if (DomUtilities.isNode(options)) {
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

    // Core modules
    //this._inputPipeline = new InputPipeline(this);
    //this._formatter = new Formatter(this);

    // Trigger events
    Type.trigger('ready', this);

  }

  /**
   * Make Type eventable
   */
  //OOP.inherits(Type, Eventable);

  /**
   * Allows fast detection if an object is a Type Editor
   * instance (or class)
   *
   * @type {boolean}
   */
  //typeEditor = true;

  /**
   * Holds the default options for every editor. These options
   * will be extended by the options passed to each instance
   * on instantiation.
   *
   * @type {{el: null, undoSteps: number}}
   * @private
   */
  /*_defaultOptions = {
    el: null,
    undoSteps: 20,
  };*/

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
  options(options, value) {
    this._options = this._options || Utilities.extend({}, this._defaultOptions);
    return Utilities.getterSetterParams(this, this._options, options, value);
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
  //createDomWalker = function(node, options) {
  //  options = Type.DomWalker.loadOptions(options || {});
  //  options.constrainingNode = options.constrainingNode || this._root;
  //  return new Type.DomWalker(node, options);
  //};

  /**
   * Getter for this instance's root element, i.e. the
   * element that contains this editor's text.
   * @returns {Element}
   */
  getEl() {
    return this._options.el;
  };

  /**
   * Getter for this instance's formatter
   * @returns {Formatter}
   */
  //getFormatter = function() {
  //  return this._formatter;
  //};

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
  _setElementEditable(el, val) {
    val = val === false ? 'false' : 'true';
    el.setAttribute('contenteditable', val);
    return this;
  };

}

/**
 * Exposes Type's prototype as jQuery-style shorthand variable
 * @type {Object}
 */
//Type.fn = Type.prototype;

Object.assign(Type, Eventable);
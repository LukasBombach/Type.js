'use strict';

import EventEmitter from './utilities/event_emitter.js';
import Utilities from './utilities/utilities';
import DomUtilities from './utilities/dom_utilities';
import InputPipeline from './input/input_pipeline';
import Formatter from './formatter';
import SelectionInput from './input/selection_input';
import DomWalker from './utilities/dom_walker';
import HtmlReader from './readers/html_reader';
import DomRenderer from './renderers/dom/dom_renderer';

const version = '0.2.1';
const expando = 'typejs' + (version + Math.random()).replace(/\D/g, '');
const staticEmitter = new EventEmitter();

export default class Type {

  /**
   * Creates a new Type editor and sets up the core
   * modules used for WYSIWYG editing. The core
   * class only holds methods for setting and retrieving
   * options as well getters and setters for instances
   * of core modules.
   *
   * @param {{}|Element|string} options - Either pass
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

    // Allow passing an element or an element id as only parameter
    if (typeof options === 'string') {
      options = {el: document.getElementById(options)};
    } else if (DomUtilities.isNode(options)) {
      options = {el: options};
    }

    // If no element has been passed, interrupt
    if (!options.el) {
      throw new Error('You must provide an element as root node for the editor\'s contents.');
    }

    // Set up event system
    this._eventEmitter = new EventEmitter();

    // Set settings for this editor
    this._options = null;
    this.options(options);

    // Init the ID system
    this._currentUniqueId = 0;

    // Enable editing mode on root element
    this._setElementEditable(options.el);

    // Allows fast detection if an object is a Type editor instance
    this.typeEditor = true;

    // Core modules
    this._inputPipeline = new InputPipeline(this);
    this._formatter = new Formatter(this);

    // Editor contents
    this._nodeList = HtmlReader.getDocument(this);

    // Initial rendering of the document
    this._renderer = new DomRenderer(this);
    this._renderer.clear();
    this._renderer.render();

    // Events todo SelectionInput makes no sense when this comment says "Events"
    // new SelectionInput(this);
    Type.emit('ready', this);
  }

  /**
   * Holds the default options for every editor. These options
   * will be extended by the options passed to each instance
   * on instantiation.
   *
   * @type {{el: null, undoSteps: number}}
   * @private
   */
  static get defaultOptions() {
    return {
      el: null,
      undoSteps: 20,
      defaultBlockTag: 'p', // possible htmlString, '', false // todo '<p>'
    };
  }

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
   * todo newOptions && getterSetterParams === crap
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
    this._options = this._options || Utilities.extend({}, this.constructor.defaultOptions);
    let newOptions = Utilities.getterSetterParams(this, this._options, options, value);
    this.emit('optionsChanged', this._options);
    return newOptions;
  }

  /**
   * Return the current text selection
   * todo check if native selection is contained within this selection
   *
   * @returns {TypeSelection}
   */
  getSelection() {
    return Type.Selection.fromNativeSelection(this);
  }

  /**
   * todo this is DEV - remove me!
   * @returns {TypeRange}
   */
  getRange() {
    return this._renderer.getRange();
  }

  /**
   *
   * @param {string} type
   * @param {boolean|Function} lazy
   * @param {Function} [listener]
   * @returns {Type}
   */
  on(type, lazy, listener) {
    this._eventEmitter.on(type, lazy, listener);
    return this;
  }

  /**
   *
   * @param {string} type
   * @param {Function} listener
   * @returns {Type}
   */
  off(type, listener) {
    this._eventEmitter.off(type, listener);
    return this;
  }

  /**
   *
   * @param {string} type
   * @param args
   * @returns {Type}
   */
  emit(type, ...args) {
    this._eventEmitter.emit.apply(this._eventEmitter, [type].concat(args));
    return this;
  }

  /**
   * Creates a {Type.DomWalker} that ist constrained to this
   * instance's root element unless you explicitly pass a
   * constrainingNode as argument. All other DomWalker options
   * can also be passed to this as usual.
   *
   * @param {Node} node - Any DOM {Node} to be set as starting
   *     node for the DomWalker
   * @param {Node|string|Function|{constrainingNode: Node, filter: string|Function}} [options]
   *     See {DomWalker} for a description of possible arguments
   * @returns {DomWalker}
   */
  createDomWalker(node, options) {
    options = DomWalker.loadOptions(options || {});
    options.constrainingNode = options.constrainingNode || this.getEl();
    return new DomWalker(node, options);
  }

  /**
   * Getter for this instance's root element, i.e. the
   * element that contains this editor's text.
   * @returns {HTMLElement}
   */
  getEl() {
    return this._options.el;
  }

  /**
   * Getter for this instance's input pipelein
   * @returns {InputPipeline}
   */
  getInputPipeline() {
    return this._inputPipeline;
  }

  /**
   * Getter for this instance's formatter
   * @returns {Formatter}
   */
  getFormatter() {
    return this._formatter;
  }

  /**
   *
   * @returns {TypeDocument}
   */
  getDocument() {
    return this._nodeList;
  }

  /**
   *
   * @returns {HtmlRenderer}
   */
  getRenderer() {
    return this._renderer;
  }

  /**
   * Returns an ID that is unique within this editor's instance
   * @returns {number}
   */
  getUniqueId() {
    return ++this._currentUniqueId;
  }

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
  }

  /**
   *
   * @param {string} type
   * @param {boolean|Function} lazy
   * @param {Function} [listener]
   * @returns {Type}
   */
  static on(type, lazy, listener) {
    staticEmitter.on(type, lazy, listener);
    return this;
  }

  /**
   *
   * @param {string} type
   * @param {Function} listener
   * @returns {Type}
   */
  static off(type, listener) {
    staticEmitter.off(type, listener);
    return this;
  }

  /**
   *
   * @param {string} type
   * @param args
   * @returns {Type}
   */
  static emit(type, ...args) {
    staticEmitter.emit.apply(staticEmitter, [type].concat(args));
    return this;
  }

  /**
   * Returns the library's current version
   *
   * @returns {string}
   */
  static get version() {
    return version;
  }

  /**
   * Returns the expando identifier
   * @returns {string}
   */
  static get expando() {
    return expando;
  }

  /**
   * Exposes Type's prototype as jQuery-style shorthand variable
   *
   * @returns {Object}
   */
  static get fn() {
    return this.prototype;
  }

}

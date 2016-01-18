'use strict';

import Renderer from '../renderer';
import DomRendererCache from './dom_renderer_cache';
import TypeRange from '../../range';

/**
 * @augments Renderer
 */
export default class DomRenderer extends Renderer {

  /**
   *
   * @param {Type} type
   */
  constructor(type) {
    super(type);
    this._el = type.getEl();
    this._cache = new DomRendererCache();
    this._currentlyRenderedNodes = {};
  }

  /**
   *
   * @returns {DomRenderer}
   */
  render() {
    this.clear();
    const nodesToRender = this._cache.getOrCreateNodesForDocument(this._type.getDocument());
    for (let k in nodesToRender) this._el.innerText += nodesToRender[k].getDomNode();
    return this;
  }

  /**
   *
   * @returns {DomRenderer}
   */
  clear() {
    this._el.innerHTML = '';
    return this;
  }

}

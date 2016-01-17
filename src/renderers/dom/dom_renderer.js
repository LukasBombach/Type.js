'use strict';

import Renderer from '../renderer';
import DomRendererCache from './dom_renderer_cache';

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

    // Load all nodes that need to be rendered
    const nodesToRender = this._cache.getOrCreateNodesForDocument(this._type.getDocument());
    let lastIdInCurrentlyRenderedNodes = null;

    // Iterate nodes, skip nodes that are already there, append new nodes to the dom
    for (let id in nodesToRender) {
      if (!nodesToRender.hasOwnProperty(id)) continue;
      if (id in this._currentlyRenderedNodes) lastIdInCurrentlyRenderedNodes = id;
      else this._renderNode(nodesToRender[id], this._currentlyRenderedNodes[id]);
      delete this._currentlyRenderedNodes[id];
    }

    // Remove all nodes from dom that were previously rendered and not present anymore
    for (let id in this._currentlyRenderedNodes) {
      if (!this._currentlyRenderedNodes.hasOwnProperty(id)) continue;
      this._removeNodeFromDom(this._currentlyRenderedNodes[id]);
    }

    // Reference currently rendered nodes for next rendering
    this._currentlyRenderedNodes = nodesToRender;

    // Chaining
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

import Type from '../../core';
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
    // Load all nodes that need to be rendered
    const nodesToRender = this._cache.getOrCreateNodesForDocument(this._type.getDocument());
    // let lastIdInCurrentlyRenderedNodes = null;

    // Iterate nodes, skip nodes that are already there, append new nodes to the dom
    for (const id in nodesToRender) {
      if (!nodesToRender.hasOwnProperty(id)) continue;
      // if (id in this._currentlyRenderedNodes) lastIdInCurrentlyRenderedNodes = id;
      else this._renderNode(nodesToRender[id], this._currentlyRenderedNodes[id]);
      delete this._currentlyRenderedNodes[id];
    }

    // Remove all nodes from dom that were previously rendered and not present anymore
    for (const id in this._currentlyRenderedNodes) {
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

  /**
   *
   * @returns {TypeRange}
   */
  getRange() {
    const range = document.getSelection().getRangeAt(0);
    const startNodeId = Type.data(range.startContainer, 'documentNodeId');
    const endNodeId = Type.data(range.endContainer, 'documentNodeId');
    const startNode = this._type.getDocument().getNode(startNodeId);
    const endNode = this._type.getDocument().getNode(endNodeId);
    return new TypeRange(startNode, endNode, range.startOffset, range.endOffset);
  }

  /**
   *
   * @param node
   * @param afterNode
   * @returns {DomRenderer}
   * @private
   */
  _renderNode(node, afterNode) {
    if (!afterNode) {
      this._el.appendChild(node.getDomNode());
      return this;
    }

    const afterDomNode = afterNode.getDomNode();

    if (afterDomNode.nextSibling) {
      afterDomNode.parentNode.insertBefore(node.getDomNode(), afterDomNode.nextSibling);
    } else {
      afterDomNode.parentNode.appendChild(node.getDomNode());
    }

    return this;
  }

  /**
   *
   * @param nodeToRemove
   * @returns {DomRenderer}
   * @private
   */
  _removeNodeFromDom(nodeToRemove) {
    const removeDomNode = nodeToRemove.getDomNode();
    removeDomNode.parentNode.removeChild(removeDomNode);
    return this;
  }

}

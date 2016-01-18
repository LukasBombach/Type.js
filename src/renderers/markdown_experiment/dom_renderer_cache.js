'use strict';

import DomRenderer from './dom_renderer';
import BlockNode from '../../document/block_node';
import TextNode from '../../document/text_node';
import BlockRenderNode from './block_render_node';

export default class DomRendererCache {

  /**
   * Initializes the cache data structure
   * @constructor
   */
  constructor() {
    this._cache = {};
  }

  /**
   * Returns a RenderNode from the cache or null if the RenderNode
   * cannot be found. To retrieve a RenderNode pass the corresponding
   * ID of the DocumentNode
   *
   * @param {number} documentNodeId
   * @returns {RenderNode|null}
   */
  get(documentNodeId) {
    return this._cache[documentNodeId] || null;
  }

  /**
   * Writes a RenderNode to the cache identified by the ID of the
   * corresponding DocumentNode
   *
   * @param {number} documentNodeId
   * @param {RenderNode} renderNode
   * @returns {DomRendererCache}
   */
  set(documentNodeId, renderNode) {
    this._cache[documentNodeId.toString()] = renderNode;
    return this;
  }

  /**
   *
   * @param {DocumentNode} documentNode
   * @returns {RenderNode}
   */
  getOrCreateForDocumentNode(documentNode) {

    let cachedItem = this.get(documentNode.id);

    if (!cachedItem) {
      cachedItem = new BlockRenderNode(documentNode);
      this.set(documentNode.id, cachedItem);
    }

    return cachedItem;
  }

  /**
   *
   * @param {TypeDocument} document
   * @returns {{}}
   */
  getOrCreateNodesForDocument(document) {

    const documentNodes = document.nodes;
    const len = documentNodes.length;
    const renderNodes = {};
    let id;

    for (let i = 0; i < len; i++) {
      id = documentNodes[i].id.toString();
      renderNodes[id] = this.getOrCreateForDocumentNode(documentNodes[i]);
    }

    return renderNodes;

  }

}

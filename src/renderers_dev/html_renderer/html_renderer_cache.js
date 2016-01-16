'use strict';

import HtmlRenderer from './html_renderer';
import BlockNode from '../../document/block_node';
import TextNode from '../../document/text_node';

export default class HtmlRendererCache {

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
   * @returns {HtmlRendererCache}
   */
  set(documentNodeId, renderNode) {
    this._cache[documentNodeId.toString()] = renderNode;
    return this;
  }

  /**
   * Returns whether or not a given document node is in the cache
   *
   * @param documentNodeId
   * @returns {boolean}
   */
  isCached(documentNodeId) {
    return documentNodeId.toString() in this._cache;
  }

  /**
   *
   * @param {DocumentNode} documentNode
   * @returns {RenderNode}
   */
  getOrCreateForDocumentNode(documentNode) {

    let cachedItem = this.get(documentNode.id);

    if (!cachedItem) {
      cachedItem = HtmlRenderer.getRenderNodeFor(documentNode);
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

    const documentNodes = document.getNodes();
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

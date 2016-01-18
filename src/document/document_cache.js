'use strict';

export default class DocumentCache {

  /**
   * Initializes the cache data structure
   *
   * @param {TypeDocument} document
   * @constructor
   */
  constructor(document) {
    this._cache = {};
    this._document = document;
  }

  /**
   * Returns a DocumentNode from the cache or null if the DocumentNode
   * cannot be found. To retrieve a DocumentNode pass the corresponding
   * ID of the DocumentNode
   *
   * @param {number} documentNodeId
   * @returns {DocumentNode|null}
   */
  get(documentNodeId) {
    const key = documentNodeId.toString();
    if (this._cache[key] === undefined) this._cache[key] = this._getDocumentNodeFromDocument(documentNodeId);
    return this._cache[key] || null;
  }

  /**
   * Writes a DocumentNode to the cache identified by the ID of the
   * corresponding DocumentNode
   *
   * @param {DocumentNode} documentNode
   * @returns {DocumentCache}
   */
  set(documentNode) {
    this._cache[documentNode.id.toString()] = documentNode;
    return this;
  }

  /**
   *
   * @param documentNodeId
   * @returns {*}
   * @private
   */
  _getDocumentNodeFromDocument(documentNodeId) {
    let foundNode;
    for (let node of this._document.nodes) if (foundNode = node.getChild(documentNodeId)) return foundNode;
    return null;
  }

}

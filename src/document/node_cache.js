export default class NodeCache {

  /**
   * Initializes the cache data structure
   *
   * @param {TypeNodeList} nodeList
   * @constructor
   */
  constructor(nodeList) {
    this._cache = {};
    this._nodeList = nodeList;
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
    if (this._cache[key] === undefined) {
      this._cache[key] = this._getNodeFromNodeList(documentNodeId);
    }

    return this._cache[key] || null;
  }

  /**
   * Writes a DocumentNode to the cache identified by the ID of the
   * corresponding DocumentNode
   *
   * @param {DocumentNode} documentNode
   * @returns {NodeCache}
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
  _getNodeFromNodeList(documentNodeId) {
    for (const node of this._nodeList.nodes) {
      const foundNode = node.getChild(documentNodeId);
      if (foundNode) return foundNode;
    }

    return null;
  }

}

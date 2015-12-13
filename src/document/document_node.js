'use strict';

export default class DocumentNode {

  /**
   *
   * @param {String} nodeName
   * @param {DocumentNode[]} children
   */
  constructor(nodeName = null, children = []) {
    this.setNodeName(nodeName);
    this.setChildren(children);
  }

  /**
   *
   * @param {DocumentNode} child
   * @returns {DocumentNode}
   */
  addChild(child) {
    this.children.push(child);
    return this;
  }

  /**
   *
   * @param {String} nodeName
   * @returns {DocumentNode}
   */
  setNodeName(nodeName) {
    this.nodeName = nodeName.toLowerCase();
    return this;
  }

  /**
   *
   * @param {DocumentNode[]} children
   * @returns {DocumentNode}
   */
  setChildren(children) {
    this.children = children;
    return this;
  }

}

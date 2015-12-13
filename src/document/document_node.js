'use strict';

import Development from '../utilities/development';

export default class DocumentNode {

  /**
   *
   * @param {String} nodeName
   * @param {DocumentNode[]|String} contents - Either child nodes or a string containing the nodeValue
   */
  constructor(nodeName = null, contents = []) {

    const nodeValue = typeof contents === 'string' ? contents : null;
    const children = typeof contents === 'object' ? contents : [];

    this.setNodeName(nodeName);
    this.setNodeValue(nodeValue);
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

  /**
   *
   * @param {String} nodeValue
   * @returns {DocumentNode}
   */
  setNodeValue(nodeValue) {
    this.nodeValue = nodeValue;
    return this;
  }

}

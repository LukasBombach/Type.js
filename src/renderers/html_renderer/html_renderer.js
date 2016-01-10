'use strict';

import HtmlRendererCache from './html_renderer_cache';
import BlockNode from '../../document/block_node';
import TextNode from '../../document/text_node';
import BlockRenderNode from './block_render_node';
import InlineRenderNode from './inline_render_node';

export default class HtmlRenderer {

  /**
   *
   * @param {Type} type
   */
  constructor(type) {
    this._document = type.getDocument();
    this._cache = new HtmlRendererCache();
    this._currentlyRenderedNodes = {};
    this._el = type.getEl();
  }

  /**
   *
   * @returns {HtmlRenderer}
   */
  render() {

    const nodesToRender = this._cache.getOrCreateNodesForDocument(this._document);
    let lastIdInCurrentlyRenderedNodes = null;

    for (let id in nodesToRender) {
      if (!nodesToRender.hasOwnProperty(id)) continue;
      if (id in this._currentlyRenderedNodes) lastIdInCurrentlyRenderedNodes = id;
      else this._renderNode(nodesToRender[id], this._currentlyRenderedNodes[id]);
      delete this._currentlyRenderedNodes[id];
    }

    for (let id in this._currentlyRenderedNodes) {
      if (!this._currentlyRenderedNodes.hasOwnProperty(id)) continue;
      this._removeNodeFromDom(this._currentlyRenderedNodes[id]);
    }

    this._currentlyRenderedNodes = nodesToRender;

    return this;

  }

  /**
   *
   * @param blockNode
   * @returns {Text|Element|Element}
   */
  getDomNodeFor(blockNode) {
    return this._cache.get(blockNode.id).getDomNode();
  }

  /**
   *
   * @returns {HtmlRenderer}
   */
  clearElement() {
    this._el.innerHTML = '';
    return this;
  }

  /**
   *
   * @param {RenderNode|BlockRenderNode|InlineRenderNode} nodeToRender
   * @param {RenderNode|BlockRenderNode|InlineRenderNode} [afterNode]
   * @returns {HtmlRenderer}
   * @private
   */
  _renderNode(nodeToRender, afterNode) {

    if (!afterNode) {
      this._el.appendChild(nodeToRender.getDomNode());
      return this;
    }

    const afterDomNode = afterNode.getDomNode();

    if (afterDomNode.nextSibling)
      afterDomNode.parentNode.insertBefore(nodeToRender.getDomNode(), afterDomNode.nextSibling);
    else
      afterDomNode.parentNode.appendChild(nodeToRender.getDomNode());

    return this;
  }

  /**
   *
   * @param {RenderNode|BlockRenderNode|InlineRenderNode} nodeToRemove
   * @returns {HtmlRenderer}
   * @private
   */
  _removeNodeFromDom(nodeToRemove) {
    const removeDomNode = nodeToRemove.getDomNode();
    removeDomNode.parentNode.removeChild(removeDomNode);
    return this;
  }

  /**
   *
   * @param {TypeDocument} document
   * @returns {RenderNode[]}
   * @private
   */
  static _getRenderNodes(document) {
    return document.getNodes().map(function(node) {
      return this._cache.getOrCreateForDocumentNode(node);
    });
  }

  /**
   *
   * @param node
   * @returns {BlockRenderNode|InlineRenderNode|null}
   */
  static getRenderNodeFor(node) {
    if (node instanceof BlockNode) return new BlockRenderNode(node);
    // if (node instanceof TextNode) return new InlineRenderNode(node);
    // return null;
    throw 'Node is not a BlockNode. What is this? What are you trying to do?'; // todo dev code
  }

  /**
   *
   * @param {DocumentNode[]} nodes
   * @returns {Node[]}
   * @private
   */
  static _renderNodes(nodes) {
    nodes = nodes.length ? nodes : [nodes];
    const len = nodes.length;
    const domNodes = [];
    for (let i = 0; i < len; i++)
      domNodes.push(HtmlRenderer._getDomNodeFor(nodes[i]));
    return domNodes;
  }

  /**
   *
   * @param {BlockNode|TextNode} node
   * @returns {HTMLElement|Text}
   * @private
   */
  static _getDomNodeFor(node) {
    if (node instanceof BlockNode) return HtmlRenderer._getDomNodeForBlockNode(node);
    if (node instanceof TextNode) return HtmlRenderer._getDomNodeForTextNode(node);
  }

  /**
   *
   * @param {BlockNode} blockNode
   * @returns {HTMLElement}
   * @private
   */
  static _getDomNodeForBlockNode(blockNode) {
    return document.createElement(blockNode.nodeType);
  }

  /**
   *
   * @param {TextNode} textNode
   * @returns {Text}
   * @private
   */
  static _getDomNodeForTextNode(textNode) {
    return document.createTextNode(textNode.nodeValue);
  }

}

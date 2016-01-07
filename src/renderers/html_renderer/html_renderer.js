'use strict';

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
    this._el = type.getEl();
  }

  /**
   *
   * @returns {Element[]}
   */
  render() {
    const renderNodes = HtmlRenderer._getRenderNodes(this._document);
    const domNodes = [];
    for (let i = 0; i < renderNodes.length; i++)
      domNodes.push(renderNodes[i].getDomNode());
    console.log(domNodes[0]);
    return domNodes;
  }

  /**
   *
   * @param {TypeDocument} document
   * @returns {RenderNode[]}
   * @private
   */
  static _getRenderNodes(document) {
    return document.getNodes().map(function(node) {
      return HtmlRenderer._getRenderNodeFor(node);
    });
  }

  /**
   *
   * @param node
   * @returns {BlockRenderNode|InlineRenderNode|null}
   * @private
   */
  static _getRenderNodeFor(node) {
    if (node instanceof BlockNode) return new BlockRenderNode(node);
    //if (node instanceof TextNode) return new InlineRenderNode(node);
    else throw 'Node is not a BlockNode. What is this? What are you trying to do?'; // todo dev code
    return null;
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

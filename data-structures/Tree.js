import assert from 'node:assert';
import Stack from './Stack.js';

class Node {
  /**
   * 
   * @param {string|Node} tagOrNode 
   * @param {boolean} isOpen 
   * @param {Node|null} parent 
   * @returns 
   */
  constructor(tagOrNode, isOpen, parent = null, text = '' ) {
    if (tagOrNode instanceof Node) {
      this.#clone(tagOrNode);
      return;
    }

    this.isOpen = isOpen;
    this.parent = parent;
    this.children = [];
    this.tag = tagOrNode;
    this.text = text;
  }

  #clone(node) {
    this.parent = node.getParent();
    this.children = node.getChildren();
    this.tag = node.getTag();
    this.isOpen = node.getIsOpen();
    this.text = node.getText();
  }

  getText() {
    return this.text;
  }

  getIsOpen() {
    return this.isOpen;
  }

  getParent() {
    return this.parent;
  }

  hasChildren() {
    return this.children.length > 0;
  }

  getChildren() {
    return this.children;
  }

  addChild(node) {
    this.children.push(node);
  }

  setParent(parent) {
    this.parent = parent;
  }

  findNodes(tag) {
    const result = [];

    for (const child of this.children) {
      if (child.getTag() === tag) {
        result.push(child);
      }
    }

    return result;
  }

  findById(id) {
    return this.children.find((childNode) => childNode.getId() === id);
  }

  getTag() {
    return this.tag;
  }
}

class Tree {
  constructor() {
    this.root = null;
  }
  getRoot() {
    return this.root;
  }

  getChildren() {
    if (!this.root) {
      return null;
    }

    return this.root.getChildren();
  }

  getIsOpen() {
    return this.root && this.root.getIsOpen();
  }

  getParent() {
    return null;
  }

  addChild(node) {
    if (!this.root) {
      this.root = node;
      return;
    }
    
    this.node.addChild(node);
  }
}

/*
  {
    html: 
  }

*/

void function test() {
  const tree = new Tree();
  const node = new Node('html', true, null);

  tree.addChild(node);


  assert.equal(tree.getRoot().getTag(), 'html');
}();

export {
  Node,
  Tree,
};

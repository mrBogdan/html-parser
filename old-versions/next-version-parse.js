import assert from 'node:assert';

const TOKENS = {
  OPEN_ANGLE_BRACKET: '<',
  CLOSE_ANGLE_BRACKET: '>',
  BACKSLACH: '/',
  EMTPY_TOKEN: '',
  CR: '\r',
  LN: '\n',
  SP: ' ',
  VT: '\t',
}

class HTMLTree {
  constructor() {
    this.tree = {
      html: {
        head: [],
        body: [],
      }
    }
  }

  add(node) {

  }
}

class ListItem {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }

  getNext() {
    return this.next;
  }

  getPrev() {
    return this.prev;
  }

  setNext(next) {
    this.next = next;
  }

  setPrev(prev) {
    this.prev = prev;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  getLast() {
    let list = this.getNext();

    if (!list) {
      return this;
    }

    while(list.getNext() !== null) {
      list = list.getNext();
    }

    return list;  
  }  
}

class List {
  constructor() {
    this.listItem = new ListItem();
    this.size = 0;
  }

  isEmpty() {
    return !this.size;
  }

  getSize() {
    return this.size;
  }

  #incSize() {
    this.size += 1;
  }

  #decSize() {
    if (this.size <= 0) {
      this.size = 0;
      return;
    }

    this.size -= 1;
  }

  add(value) {
    if (this.isEmpty()) {
      this.listItem.setValue(value);
      this.#incSize();
      return undefined;
    }

    const lastListItem = this.listItem.getLast();
    const newListItem = new ListItem(value);
    lastListItem.setNext(newListItem);
    newListItem.setPrev(lastListItem);
    this.#incSize();
  }

  removeLast() {
    const last = this.listItem.getLast();
    const beforeLast = last.getPrev();
    beforeLast.setNext(null);

    this.#decSize();

    return last.value;
  }

  insert(value, index) {}

  // getByIndex(index) {
  //   let result = null;

  //   if (!index) {
  //     return this.listItem.value;
  //   }

  //   if (index === 1) {
  //     return this.nextValue && this.nextValue.value;
  //   }

  //   result = this.nextValue;

  //   for (let i = 2; i <= index; ++ i) {
  //     result = result.nextValue;
  //   }

  //   return result && result.value;
  // }

  getByIndex(index) {
    if (index < 0 || index > this.size - 1) {
      return null;
    }

    if (!index) {
      return this.listItem.value;
    }

    let i = 1;
    let result = this.listItem.getNext();

    while(i !== index) {
      result = result.getNext();

      i += 1;
    }

    return result.value;
  }

  getLast() {
    return this.getByIndex(this.getSize() - 1);
  }
}

const list = new List();

list.add(1);

list.add(2);

list.add(3);

assert.equal(list.getByIndex(0), 1);
assert.equal(list.getByIndex(1), 2);
assert.equal(list.getByIndex(2), 3);
assert.equal(list.removeLast(), 3);
assert.equal(list.getByIndex(2), null);

class Stack {
  constructor(value = undefined) {
    this.memory = [];
    this.memory.push(value);
  }

  push(value) {
    this.memory.push(value);
  }

  pop() {
    return this.memory.pop();
  }

  size() {
    return this.memory.length;
  }

  top() {
    return this.memory[this.size() - 1];
  }
}

class Attribute {

}

class Attributes {
  constructor() {
    this.storage = [];
  }


  add() {}
  clear() {}
}

class Node {
  constructor({ tag, isClosingTag, value, attributes }) {
    this.tag = tag;
    this.isClosingTag = isClosingTag;
    this.value = value;
    this.attributes = attributes;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }

  getTag() {
    return this.tag;
  }
}

/**
 * @param {string} data
 */
const parse = (data) => {
  const tags = [];
  const tree = new HTMLTree();
  const dom = {
    html: {
      head: [],
      body: [],
    }
  };
  const len = data.length;

  let openTag = false;
  let openNode = false;
  let nodeText = [];
  let tag = [];
  let attributes = [];
  const list = new List();

  for (let i = 0; i < len; ++ i) {
    const char = data[i];

    switch(char) {
      // Skip special characters
      case TOKENS.VT:
      case TOKENS.CR:
      case TOKENS.LN: {
        continue;
      }
      case TOKENS.OPEN_ANGLE_BRACKET: {
        openTag = true;
        continue;
      }
      case TOKENS.CLOSE_ANGLE_BRACKET: {
        openTag = false;

        const tagName = tag.join(TOKENS.EMTPY_TOKEN).replace(TOKENS.BACKSLACH, TOKENS.EMTPY_TOKEN);

        
        // open tag
        const isOpenTag = () => !tag.includes(TOKENS.BACKSLACH);
        const isSingleTag = () => tag.includes(TOKENS.BACKSLACH) && openNode
        if (isOpenTag()) {
          
          
          openNode = true;
          const node = new Node(tagName, tag.includes(TOKENS.BACKSLACH), nodeText.join(TOKENS.EMTPY_TOKEN));
          tags.push(node);
          list.add(node);

          const lastNode = list.getLast();

          console.log({ attributes: attributes.join('') });
          attributes = [];
          // single html elements like <link /> or <meta />
        } else if (tag.includes(TOKENS.BACKSLACH) && openNode) {
          const node = new Node(tagName, false, nodeText.join(TOKENS.EMTPY_TOKEN));
          tags.push(node);
          // const lastNode = list.getLast();

          




          openNode = false;
          attributes = [];
          
        } else if (tag.includes(TOKENS.BACKSLACH) && !openNode) {

        } else {
          nodeText = [];
          openNode = false;
        }
        
        tag = [];
      
        continue;
      }
    }

    if (openTag) {
      tag.push(char);
    }

    const isAttribute = () => openTag && !openNode;

    if (isAttribute()) {
      attributes.push(char);
    }

    const isText = () => openNode && !openTag; 
    if (isText()) {
      nodeText.push(char);
    }


  }

  return dom;
}

console.dir(parse(`<html><head><link /></head><body><h1>Hello, world!</h1><p>TEXT</p></body></html>`), { depth: null });

// const tree = {
//   html: {
//     head: [
//       { tag: 'meta' },
//       { tag: 'meta' },
//       { tag: 'link' },
//     ],
//     body: [
//       { tag: 'h1' },
//       { tag: 'p' },
//       { tag: 'p' },
//       { tag: 'p' },
//     ]
//   }
// }

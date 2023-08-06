
class ASTree {
  constructor() {
    this.tree = {};
  }

  push(node, level) {
    
  }
}

class Node {
  constructor(tag, lastIndex, isClosingTag = false) {
    this.tag = tag;
    this.nextIndex = lastIndex + 1;
    this.isClosingTag = isClosingTag;
  }

  getTag() {
    return this.tag;
  }

  getNextIndex() {
    return this.nextIndex;
  }
}

const TAGS_HANDLERS = {
  html: () => {},
  body: () => {},
  head: () => {}
}

const handleTag = (restString) => {
  const tag = [];
  const len = restString.length;
  for (let i = 0; i < len; ++ i) {
    const character = restString[i];
    if (character === '>') {
      return new Node(tag.join('').replace('/', ''), i, tag.includes('/'));
    }
    
    tag.push(character);
  }

  throw new Error('Invalid html');
}

const slice = (str, from) => {
  const result = [];
  const len = str.length;

  if (from >= len) {
    return '';
  }

  for (let i = from; i < len; ++ i) {
    result.push(str[i]);
  }

  return result.join('');
}

/**
 * @param {string} data
 */
const parse = (data) => {
  const len = data.length;
  const ast = new ASTree();

  for (let i = 0; i < len; ++ i) {
    const character = data[i];

    if (character === '<') {
      const node = handleTag(slice(data, i + 1));
      const nextIndex = node.getNextIndex();

      if (nextIndex < len) {
        i = nextIndex + i;
      }

      console.log({ node, len });
    }


  }
}

console.log(parse(`<html><head></head><body>TEXT</body></html>`));
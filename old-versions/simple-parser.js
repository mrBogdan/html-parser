import assert from 'node:assert';

const TOKENS = {
  OPEN_ANGLE_BRACKET: '<',
  CLOSE_ANGLE_BRACKET: '>',
  BACKSLACH: '/',
  EMTPY_TOKEN: '',
}

class Node {
  constructor(tag, isClosingTag, value) {
    this.tag = tag;
    this.isClosingTag = isClosingTag;
    this.value = value;
  }

  getTag() {
    return this.tag;
  }
}

const slice = (str, from) => {
  const result = [];
  const len = str.length;

  if (from >= len) {
    return TOKENS.EMTPY_TOKEN;
  }

  for (let i = from; i < len; ++ i) {
    result.push(str[i]);
  }

  return result.join(TOKENS.EMTPY_TOKEN);
}

/**
 * @param {string} data
 */
const parse = (data) => {
  const tags = [];
  const len = data.length;

  let openTag = false;
  let openNode = false;
  let nodeText = [];
  let tag = [];

  for (let i = 0; i < len; ++ i) {
    const character = data[i];

    switch(character) {
      case TOKENS.OPEN_ANGLE_BRACKET: {
        openTag = true;
        continue;
      }
      case TOKENS.CLOSE_ANGLE_BRACKET: {
        openTag = false;

        const tagName = tag.join(TOKENS.EMTPY_TOKEN).replace(TOKENS.BACKSLACH, TOKENS.EMTPY_TOKEN);

        if (!tag.includes(TOKENS.BACKSLACH)) {
          openNode = true;
        } else {
          const node = new Node(tagName, tag.includes(TOKENS.BACKSLACH), nodeText.join(TOKENS.EMTPY_TOKEN));
          tags.push(node);

          nodeText = [];
          openNode = false;
        }

        
        
        tag = [];
      
        continue;
      }
    }

    if (openTag) {
      tag.push(character);
    }


    if (openNode && !openTag) {

    
          nodeText.push(character);
        
      }
    


  }

  return tags;
}

console.log(parse(`<html><head></head><body>TEXT</body></html>`));

assert.deepEqual(parse(`<html><head></head><body>TEXT</body></html>`), [
  new Node('head', true, ''),
  new Node('body', true, 'TEXT'),
  new Node('html', true, ''),
]);
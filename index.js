import { TOKENS } from './const.js';
import structures from './data-structures/index.js';

function parse(html) {
  const tree = new structures.Tree();
  const len = html.length;
  const tags = [];
  const list = new structures.List();

  // list.push(tree);

  let tag = [];
  let textNode = [];
  let tagIsOpened = false;

  const PARSER_API = {
    clearTag() {
      tag = [];
    }
  }

  for (let i = 0; i < len; ++ i) {
    const char = html[i];

    switch(char) {
      case TOKENS.VT:
      case TOKENS.CR:
      case TOKENS.LN: {
        continue;
      }
      case TOKENS.OPEN_ANGLE_BRACKET: {
        tagIsOpened = true;


        if (textNode.length) {
          const parentNode = list.top();
          const node = new structures.Node('TextNode', false,  parentNode, textNode.join(TOKENS.EMTPY_TOKEN));
  
          parentNode.addChild(node);
  
          textNode = [];
        }
        

        continue;
      }
      case TOKENS.CLOSE_ANGLE_BRACKET: {
        const tagName = tag.join(TOKENS.EMTPY_TOKEN).replace(TOKENS.BACKSLACH, TOKENS.EMTPY_TOKEN).trim();
        tagIsOpened = false;

        if (!tag.includes(TOKENS.BACKSLACH)) {
          tags.push(tagName);

          const parentNode = list.top();

          const node = new structures.Node(tagName, true,  parentNode);

          if (!parentNode) {
            tree.addChild(node);
          } else {
            parentNode.addChild(node);
          }  

          list.push(node);
          
        } else if (tag.includes(TOKENS.BACKSLACH)) {
          const prev = list.top();

          if (prev.getTag() !== tagName && prev.getIsOpen()) {
            const node = new structures.Node(tagName, false, prev);
            prev.addChild(node);
            tags.push(tagName);
          } else if (prev.getTag() === tagName && prev.getIsOpen()) {
            list.pop();
          }
        }
        
        PARSER_API.clearTag();
        continue;
      } 
    }

    const currentTag = list.top();

    if (tagIsOpened) {
      tag.push(char);
    }

    if (!tagIsOpened && currentTag.getIsOpen()) {
      textNode.push(char);
    }
  }

  return {tree, tags};
}


parse(`<html><head><link /></head><body><h1>Hello, world!</h1><p>TEXT</p></body></html>`);

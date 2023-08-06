import assert from 'node:assert';

import { TOKENS } from './const.js';
import structures from './data-structures/index.js';

function parse(html) {
  const tree = new structures.Tree();
  const len = html.length;
  const tags = [];
  const stack = new structures.Stack();

  let tag = [];
  let textNode = [];
  let tagIsOpened = false;
  let attributeStarted = false;
  let attributes = {};
  let attribute = [];
  let attributeValue = [];
  let attributeValueStarted = false;

  const PARSER_API = {
    isTagOpened() {
      return tagIsOpened;
    },

    isAttributeStarted() {
      return attributeStarted;
    },

    isAttributeValueStarted() {
      return attributeValueStarted;
    },

    clearTag() {
      tag = [];
    },

    clearAttribute() {
      attribute = [];
    },

    clearAttributes() {
      attributes = {};
    },

    clearAttributeValue() {
      attributeValue = [];
    },

    toggleTagOpening() {
      tagIsOpened = !tagIsOpened;
    },

    setAttributeStarting(bValue) {
      attributeStarted = bValue;
    },

    setAttributeValueStarted(bValue) {
      attributeValueStarted = bValue;
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

      case TOKENS.BACKSLACH: {
        if (PARSER_API.isAttributeValueStarted()) {
          attributeValue.push(char);
          continue;
        }
        PARSER_API.setAttributeStarting(false);
        PARSER_API.setAttributeValueStarted(false);
        tag.push(char);
        continue;
      }

      case TOKENS.OPEN_ANGLE_BRACKET: {
        tagIsOpened = true;


        if (textNode.length) {
          const parentNode = stack.top();
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

          const parentNode = stack.top();

          const node = new structures.Node(tagName, true,  parentNode, '', attributes);

          if (!parentNode) {
            tree.addChild(node);
          } else {
            parentNode.addChild(node);
          }  

          stack.push(node);
          PARSER_API.clearAttributes();
          
          
        } else if (tag.includes(TOKENS.BACKSLACH)) {
          const prev = stack.top();

          if (prev.getTag() !== tagName && prev.getIsOpen()) {
            const node = new structures.Node(tagName, false, prev, '', attributes);
            prev.addChild(node);
            tags.push(tagName);
            PARSER_API.clearAttributes();
          } else if (prev.getTag() === tagName && prev.getIsOpen()) {
            stack.pop();
          }

          
        }
        
        PARSER_API.clearTag();
        continue;
      } 
    }

    const currentTag = stack.top();

    if (PARSER_API.isTagOpened()) {
      switch(char) {
        case TOKENS.SP: {
          if (!PARSER_API.isAttributeStarted()) {
            PARSER_API.setAttributeStarting(true);
          } else if (PARSER_API.isAttributeStarted()) {
            PARSER_API.clearAttribute();
            PARSER_API.setAttributeStarting(false);
          }
          
          continue;
        }
        case TOKENS.EQUAL_SIGN: {
          attributes[attribute.join(TOKENS.EMTPY_TOKEN)] = true;
          PARSER_API.setAttributeStarting(false);
          continue;
        }
        case TOKENS.SINGLE_QUOTE:
        case TOKENS.DOUBLE_QUOTE: {
          if (!PARSER_API.isAttributeValueStarted()) {
            PARSER_API.setAttributeValueStarted(true);
          } else if (PARSER_API.isAttributeValueStarted()) {
            PARSER_API.setAttributeValueStarted(false);
            attributes[attribute.join(TOKENS.EMTPY_TOKEN)] = attributeValue.join(TOKENS.EMTPY_TOKEN);
            PARSER_API.clearAttribute();
            PARSER_API.clearAttributeValue();
            continue;
          }
          
          continue;
        }
        default: {
          if (!PARSER_API.isAttributeStarted() && !PARSER_API.isAttributeValueStarted()) {
            tag.push(char);
          } else if (PARSER_API.isAttributeStarted()) {
            attribute.push(char);
          } else if (PARSER_API.isAttributeValueStarted()) {
            attributeValue.push(char);
          }

         
        }
      }

      
    }

    if (!tagIsOpened && currentTag.getIsOpen()) {
      textNode.push(char);
    }
  }

  return {tree, tags};
}


parse(`<html><head><link src="/main.css" /></head><body><h1>Hello, world!</h1><p>TEXT</p></body></html>`);

void function simpleTest() {
  const { tree, tags } = parse('<html></html>');
  const root = tree.getRoot();

  assert.equal(root.getParent(), null);
  assert.equal(root.hasChildren(), false);
  assert.equal(root.getTag(), 'html');
  assert.equal(root.getParent(), null);
  assert.equal(tags.length, 1);
  assert.equal(tags[0], 'html');
}();

void function testAttributes() {
  const { tree } = parse(`<html><head><link src="/main.css" /></head><body><h1>Hello, world!</h1><p>TEXT</p></body></html>`);
  const head = tree.findNodes('head');
  const link = head.findNodes('link');

  assert.equal(head.hasChildren(), true);
  assert.equal(link.getAttributes()['src'], '/main.css');

}();

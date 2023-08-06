import assert from 'node:assert';

class Stack {
  constructor() {
    this.memory = [];
  }

  push(...value) {
    this.memory.push(...value);
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

  isEmpty() {
    return this.size() === 0;
  }
}

void function test() {
  const stack = new Stack();

  stack.push(1);
  stack.push(2);
  stack.push(3);

  assert.equal(stack.top(), 3);
  assert.equal(stack.size(), 3);
  assert.equal(stack.pop(), 3);
  assert.equal(stack.pop(), 2);
  assert.equal(stack.pop(), 1);
  assert.equal(stack.isEmpty(), true);
}();

export default Stack;
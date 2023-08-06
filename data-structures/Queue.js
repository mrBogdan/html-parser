import assert from 'node:assert';

class Queue {
  constructor() {
    this.memory = [];
  }


  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.memory.length;
  }

  pop() {
    return this.memory.shift();
  }

  push(value) {
    this.memory.push(value);
  }
}

void function test() {
  const queue = new Queue();

  queue.push(1);
  queue.push(2);
  queue.push(3);

  assert.equal(queue.pop(), 1);
  assert.equal(queue.isEmpty(), false);
  assert.equal(queue.pop(), 2);
  assert.equal(queue.pop(), 3);
  assert.equal(queue.isEmpty(), true);
}();

export default Queue;

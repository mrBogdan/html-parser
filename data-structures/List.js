import assert from 'node:assert';

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
    this.listItem = null;
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

  push(value) {
    if (this.isEmpty()) {
      this.listItem = new ListItem(value);
      this.#incSize();
      return undefined;
    }

    const lastListItem = this.listItem.getLast();
    const newListItem = new ListItem(value);
    lastListItem.setNext(newListItem);
    newListItem.setPrev(lastListItem);
    this.#incSize();
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }

    const last = this.listItem.getLast();

    if (!last) {
      return null;
    }

    const beforeLast = last.getPrev();

    if (beforeLast) {
      beforeLast.setNext(null);
    } else {
      this.listItem = null;
    }

    this.#decSize();

    return last.value;
  }

  getOrderdedArray() {
    if (this.isEmpty()) {
      return [];
    }

    const result = [];
    let currentListItem = this.listItem;
    result.push(currentListItem.getValue());

    let i = 1;
    while (i < this.getSize()) {
      currentListItem = currentListItem.getNext();
      result.push(currentListItem.getValue());
      i += 1;
    }

    return result;
  }

  insert(value, index) {}

  getByIndex(index) {
    if (index < 0 || index > this.size - 1) {
      return null;
    }

    if (!index) {
      return this.listItem.value || null;
    }

    let i = 1;
    let result = this.listItem.getNext();

    while(i !== index) {
      result = result.getNext();

      i += 1;
    }

    return result.value || null;
  }

  top() {
    return this.getByIndex(this.getSize() - 1);
  }
}

void function testBase() {
  const list = new List();

  list.push(1);
  
  list.push(2);
  
  list.push(3);
  
  assert.equal(list.getByIndex(0), 1);
  assert.equal(list.getByIndex(1), 2);
  assert.equal(list.getByIndex(2), 3);
  assert.equal(list.pop(), 3);
  assert.equal(list.getByIndex(2), null);
  assert.equal(list.top(), 2);
}();

void function testGetOrderedArray() {
  const list = new List();

  list.push(1);
  
  list.push(2);
  
  list.push(3);

  assert.deepEqual(list.getOrderdedArray(), [1,2,3]);
}();



export default List;
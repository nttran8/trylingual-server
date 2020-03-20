class _Node {
  constructor(value, next) {
    (this.value = value), (this.next = next);
  }
}

class LinkedList {
  constructor() {
    this.total_score = 0;
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  insertAfter(key, itemToInsert) {
    let tempNode = this.head;
    while (tempNode !== null && tempNode.value !== key) {
      tempNode = tempNode.next;
    }
    if (tempNode !== null) {
      tempNode.next = new _Node(itemToInsert, tempNode.next);
    }
  }

  insertBefore(key, itemToInsert) {
    if (this.head == null) {
      return;
    }
    if (this.head.value == key) {
      this.insertFirst(itemToInsert);
      return;
    }
    let prevNode = null;
    let currNode = this.head;
    while (currNode !== null && currNode.value !== key) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log("Node not found to insert");
      return;
    }
    prevNode.next = new _Node(itemToInsert, currNode);
  }

  insertAt(nthPosition, currNode) {
    // nthPosition will always be 1 or greater because we initialize it to 1 in
    // our database
    // if (nthPosition < 0) {
    //   throw new Error("Position error");
    // }
    // if (nthPosition === 0) {
    //   this.insertFirst(itemToInsert);
    // } else {
    // const beforeNode = this._findNthElement(nthPosition - 1);
    const beforeNode = this._findNthElement(nthPosition);
    if (beforeNode === null) {
      console.log("before node is null");
    }
    // creating a new node every time we make a guess
    // but we only want to re-position the node
    // we can just pass in the entire node and update the beforeNode next pointer
    // and the current node next pointer

    // const newNode = new _Node(itemToInsert, null);
    // newNode.next = beforeNode.next;
    currNode.next = beforeNode.next;
    beforeNode.next = currNode;
    // }
    return [currNode.value.id, beforeNode.value.id];
  }

  moveHeadBy(level) {
    // Before we relocate the head, we want to find the
    let tempNode = this.head;
    this.head = this.head.next;
    // pass in the entire note
    // this.insertAt(level, tempNode.value);
    return this.insertAt(level, tempNode);
  }

  _findNthElement(position) {
    let node = this.head;
    for (let i = 0; i < position - 1; i++) {
      node = node.next;
    }
    return node;
  }
  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;
    while (currNode !== null && currNode.value !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log("Item not found");
      return;
    }
    previousNode.next = currNode.next;
  }

  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  listNodes() {
    let node = this.head;
    const arr = [];
    while (node) {
      arr.push(node);
      node = node.next;
    }
    return arr;
  }

  map(callback) {
    let node = this.head;
    let arr = [];
    while (node) {
      arr.push(callback(node));
      node = node.next;
    }
    return arr;
  }

  // used in method persistLinkedList
  // located in '../language/language-service.js'
  forEach(cb) {
    let node = this.head;
    const arr = [];
    while (node) {
      arr.push(cb(node));
      node = node.next;
    }
    return arr;
  }

  size(list) {
    let nodeCounter = 1;
    if (list.head === null) {
      return console.log("Empty list");
    }
    let currentNode = list.head;
    while (currentNode.next !== null) {
      currentNode = currentNode.next;
      nodeCounter++;
    }
    return nodeCounter;
  }

  isCorrect(guess, list) {
    if (list.head.value.translation.toUpperCase() === guess.toUpperCase()) {
      return true;
    } else {
      return false;
    }
  }

  convertArrayToList(arr, list) {
    arr.forEach(element => {
      list.insertLast(element);
    });
    return list;
  }

  displayTranslation() {
    let node = this.head;
    while (node !== null) {
      console.log(node.value.translation);
      node = node.next;
    }
    return;
  }
}

module.exports = LinkedList;

---
title: Leetcode-146-LRU缓存📌
author: Licodeao
publishDate: 2023-5-26
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 146. LRU 缓存

请你设计并实现一个满足 LRU (最近最少使用) 缓存约束的数据结构。

实现 `LRUCache` 类：

- `LRUCache(int capacity)` 以 **正整数** 作为容量 `capacity` 初始化 LRU 缓存
- `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 `-1` 。
- `void put(int key, int value)` 如果关键字 `key` 已经存在，则变更其数据值 `value` ；如果不存在，则向缓存中插入该组 `key-value` 。如果插入操作导致关键字数量超过 `capacity` ，则应该 **逐出** 最久未使用的关键字。

函数 `get` 和 `put` 必须以 `O(1)` 的平均时间复杂度运行。

**示例：**

```
输入
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
输出
[null, null, null, 1, null, -1, null, -1, 3, 4]

解释
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1);    // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.get(2);    // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lRUCache.get(1);    // 返回 -1 (未找到)
lRUCache.get(3);    // 返回 3
lRUCache.get(4);    // 返回 4
```

**提示：**

- `1 <= capacity <= 3000`
- `0 <= key <= 10000`
- `0 <= value <= 105`
- 最多调用 `2 * 105` 次 `get` 和 `put`

## 解题思路

[什么是 LRU？](https://baike.baidu.com/item/LRU)

思路：单链表

- put 操作：
  - 如果节点不存在，直接把节点插入到头部
  - 如果节点存在，则把这个节点从链表中删除，并且更新值再插入到头部
  - 如果插入时，超过最大容量，则将链表的最后一个节点删除，并且将新节点插入到头部
- get 操作：
  - 如果节点存在，则返回，并且将节点删除以及插入到链表头部
  - 如果节点不存在，则直接返回-1，没有额外操作
- 该方法下，put 和 get 操作的时间复杂度都为 O(n)，并不符合题目所要求的 O(1)
- 那么，如何优化？
  - 加哈希表，省去 get 操作遍历的过程；但实际上，时间复杂度还是 O(n)。
    - 为什么？
      - 因为不管是 put 操作还是 get 操作，都有删除操作，虽然加入哈希表能够省去遍历的过程，但是不能优化删除操作。删除节点需要找到其前驱节点，那么这个寻找前驱节点的过程也需要 O(n)的时间复杂度。
    - 如何省去寻找节点的前驱节点这个过程呢？
      - 可以使用双向链表，从而节点本身就包含了其前驱节点和后驱节点的信息，不用再去寻找了，以此达到 O(1)的要求。
  - 双向链表 + 哈希表（最终的解决方案）

```javascript
class ListNode {
  constructor(key, value) {
    //双向链表的单个节点
    this.key = key;
    this.value = value;
    this.next = null; //指向后一个节点
    this.prev = null; //指向前一个节点
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; //容量
    this.hashTable = {}; //存放键值对信息
    this.count = 0; //键值对数量
    this.dummyHead = new ListNode(); //dummy头节点 方便在链表从开始的地方插入
    this.dummyTail = new ListNode(); //dummy尾节点 方便在链表从末尾删除
    this.dummyHead.next = this.dummyTail; //dummyHead和dummyTail相互连接
    this.dummyTail.prev = this.dummyHead;
  }

  get(key) {
    let node = this.hashTable[key]; //查找哈希表中的键值对
    if (node == null) return -1; //不存在该键值对 返回-1
    this.moveToHead(node); //移动到链表头
    return node.value;
  }

  put(key, value) {
    let node = this.hashTable[key]; //哈希表中查找该键值对
    if (node == null) {
      let newNode = new ListNode(key, value); //不存在就创建节点
      this.hashTable[key] = newNode; //加入哈希表
      this.addToHead(newNode); //加入链表头
      this.count++; //节点数+1
      if (this.count > this.capacity) {
        //超过容量 从队尾删除一个
        this.removeLRUItem();
      }
    } else {
      node.value = value; //键值对存在于哈希表中 就更新
      this.moveToHead(node); //移动到队头
    }
  }

  moveToHead(node) {
    this.removeFromList(node); //从链表中删除节点
    this.addToHead(node); //将该节点添加到链表头
  }

  removeFromList(node) {
    //删除的指针操作
    let tempForPrev = node.prev;
    let tempForNext = node.next;
    tempForPrev.next = tempForNext;
    tempForNext.prev = tempForPrev;
  }

  addToHead(node) {
    //加入链表头的指针操作
    node.prev = this.dummyHead;
    node.next = this.dummyHead.next;
    this.dummyHead.next.prev = node;
    this.dummyHead.next = node;
  }

  removeLRUItem() {
    let tail = this.popTail(); //从链表中删除
    delete this.hashTable[tail.key]; //从哈希表中删除
    this.count--;
  }

  popTail() {
    let tailItem = this.dummyTail.prev; //通过dummyTail拿到最后一个节点 然后删除
    this.removeFromList(tailItem);
    return tailItem;
  }
}
```

```typescript
class DoubleSide {
  key: number;
  value: number;
  next: DoubleSide;
  prev: DoubleSide;

  // 双向链表的单个节点
  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
    this.next = null; //指向后一个节点
    this.prev = null; //指向前一个节点
  }
}

class LRUCache {
  // 哈希表
  hash = {};
  // 容量
  capacity: number;
  // 真实大小
  size: number;
  // 头指针
  head: DoubleSide;
  // 尾指针(用来删除最后一个节点)
  tail: DoubleSide;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.size = 0;
    // 虚拟头结点(方便删除)
    this.head = new DoubleSide(-1, -1);
    // 虚拟尾节点(方便删除)
    this.tail = new DoubleSide(-2, -2);
    // 组成双向链表
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    // 判断节点是否存在
    let temp: DoubleSide = this.hash[key];
    // 如果存在，则删除
    if (temp !== null) {
      // 删除节点
      this.deleteNode(temp);
      // 插入到头部
      this.insertHead(temp);

      return temp.value;
    }
    // 不存在
    return -1;
  }

  put(key: number, value: number): void {
    // 判断节点是否存在
    let temp: DoubleSide = this.hash[key];
    // 如果存在，删除并插入头部
    if (temp !== null) {
      // 删除
      this.deleteNode(temp);
      // 更新值并插入头部
      temp.value = value;
      this.insertHead(temp);
      return;
    }
    // 如果不存在，直接插入头部
    let newHead = new DoubleSide(key, value);
    this.insertHead(newHead);
    this.size++;
    // 判断大小是否超过容量，超过则删除尾节点
    if (this.size > this.capacity) {
      // 最后一个节点
      let last = this.tail.prev;
      this.deleteNode(last);
      // hash表中清除这个key
      delete this.hash[last.key];
      this.size--;
    }
  }

  // 删除节点
  deleteNode(temp: DoubleSide) {
    let tempForPrev = temp.prev;
    let tempForNext = temp.next;
    tempForPrev.next = tempForNext;
    tempForNext.prev = tempForPrev;
  }

  // 插入到头部
  insertHead(temp: DoubleSide) {
    // 先与后驱节点连接
    temp.next = this.head.next;
    this.head.next.prev = temp;
    // 与head连接
    this.head.next = temp;
    temp.prev = this.head;
  }
}
```

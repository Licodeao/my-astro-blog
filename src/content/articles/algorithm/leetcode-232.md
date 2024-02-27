---
title: Leetcode-232-用栈实现队列📌
author: Licodeao
publishDate: "2023-5-28"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 232.用栈实现队列

请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（`push`、`pop`、`peek`、`empty`）：

实现 `MyQueue` 类：

- `void push(int x)` 将元素 x 推到队列的末尾
- `int pop()` 从队列的开头移除并返回元素
- `int peek()` 返回队列开头的元素
- `boolean empty()` 如果队列为空，返回 `true` ；否则，返回 `false`

**说明：**

- 你 **只能** 使用标准的栈操作 —— 也就是只有 `push to top`, `peek/pop from top`, `size`, 和 `is empty` 操作是合法的。
- 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。

**示例 1：**

```
输入：
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[], [1], [2], [], [], []]
输出：
[null, null, null, 1, 1, false]

解释：
MyQueue myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
myQueue.peek(); // return 1
myQueue.pop(); // return 1, queue is [2]
myQueue.empty(); // return false
```

**提示：**

- `1 <= x <= 9`
- 最多调用 `100` 次 `push`、`pop`、`peek` 和 `empty`
- 假设所有操作都是有效的 （例如，一个空的队列不会调用 `pop` 或者 `peek` 操作）

## 解题思路

两个栈 stack1 和 stack2，stack1 负责入栈，stack2 负责出栈；

- 如果 stack2 中没有元素了，直接将 stack1 的所有元素拿到 stack2
- 如果 stack2 非空，直接返回栈顶元素即可
- 栈顶元素实际上相当于是数组中的最后一个元素了，[ 栈顶(index: 0) => 栈顶(index: arr.length - 1) ]

这样，两个栈就能模拟队列。

```typescript
class MyQueue {
  stack1: Array<any>;
  stack2: Array<any>;

  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }

  push(x: number): void {
    // stack1处理入栈
    this.stack1.push(x);
  }

  pop(): number {
    // stack2非空
    if (this.stack2.length !== 0) {
      return this.stack2.pop();
    }

    // stack2为空, 从stack1取出所有元素放到stack2中
    while (this.stack1.length !== 0) {
      this.stack2.push(this.stack1.pop());
    }

    return this.stack2.pop();
  }

  peek(): number {
    // stack2不为空
    if (this.stack2.length !== 0) {
      return this.stack2[this.stack2.length - 1];
    }

    // stack2为空，从stack1取出所有元素放到stack2中
    while (this.stack1.length !== 0) {
      this.stack2.push(this.stack1.pop());
    }

    return this.stack2[this.stack2.length - 1];
  }

  empty(): boolean {
    // 两个栈都为空时，才为空
    return this.stack1.length === 0 && this.stack2.length === 0;
  }
}
```

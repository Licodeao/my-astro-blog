---
title: Leetcode-225-用队列实现栈📌
author: Licodeao
publishDate: "2023-5-28"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 225. 用队列实现栈

请你仅使用两个队列实现一个后入先出（LIFO）的栈，并支持普通栈的全部四种操作（`push`、`top`、`pop` 和 `empty`）。

实现 `MyStack` 类：

- `void push(int x)` 将元素 x 压入栈顶。
- `int pop()` 移除并返回栈顶元素。
- `int top()` 返回栈顶元素。
- `boolean empty()` 如果栈是空的，返回 `true` ；否则，返回 `false` 。

**注意：**

- 你只能使用队列的基本操作 —— 也就是 `push to back`、`peek/pop from front`、`size` 和 `is empty` 这些操作。
- 你所使用的语言也许不支持队列。 你可以使用 list （列表）或者 deque（双端队列）来模拟一个队列 , 只要是标准的队列操作即可。

**示例：**

```
输入：
["MyStack", "push", "push", "top", "pop", "empty"]
[[], [1], [2], [], [], []]
输出：
[null, null, null, 2, 2, false]

解释：
MyStack myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.top(); // 返回 2
myStack.pop(); // 返回 2
myStack.empty(); // 返回 False
```

**提示：**

- `1 <= x <= 9`
- 最多调用`100` 次 `push`、`pop`、`top` 和 `empty`
- 每次调用 `pop` 和 `top` 都保证栈不为空

## 解题思路

两个队列，在入栈的过程中，要始终保持一个队列为空。

- 如果一个队列中有了元素时，下一个元素入队列时，入的是空的那个队列
- 进入之后，再将原来队列中的所有元素移过来
- 这样就保证了一个队列始终为空，从而实现栈后进先出的特点
- 每次入栈过程中，栈顶元素要保证压入队列的底部，即第一个元素

```typescript
class MyStack {
  queue1: Array<any>;
  queue2: Array<any>;

  constructor() {
    this.queue1 = [];
    this.queue2 = [];
  }

  push(x: number): void {
    this.queue1.push(x);

    // queue2不为空，将所有元素移到queue1中
    while (this.queue2.length !== 0) {
      this.queue1.push(this.queue2.shift());
    }

    // 让queue1永远为空，queue2永远不为空，交换一下即可实现
    let temp = this.queue1;
    this.queue1 = this.queue2;
    this.queue2 = temp;
  }

  pop(): number {
    // 栈顶元素为队列中的第一个元素
    return this.queue2.shift();
  }

  top(): number {
    // 栈顶元素为队列中的第一个元素
    return this.queue2[0];
  }

  empty(): boolean {
    // 因为queue1永远为空，所以只需要判断queue2为不为空即可
    return this.queue2.length === 0;
  }
}
```

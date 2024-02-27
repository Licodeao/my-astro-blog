---
title: Leetcode-155-最小栈📌
author: Licodeao
publishDate: 2023-5-30
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 155. 最小栈

设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。

实现 `MinStack` 类:

- `MinStack()` 初始化堆栈对象。
- `void push(int val)` 将元素 val 推入堆栈。
- `void pop()` 删除堆栈顶部的元素。
- `int top()` 获取堆栈顶部的元素。
- `int getMin()` 获取堆栈中的最小元素。

**示例 1:**

```
输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

输出：
[null,null,null,null,-3,null,0,-2]

解释：
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.getMin();   --> 返回 -2.
```

**提示：**

- `-231 <= val <= 231 - 1`
- `pop`、`top` 和 `getMin` 操作总是在 **非空栈** 上调用
- `push`, `pop`, `top`, and `getMin`最多被调用 `3 * 104` 次

## 解题思路

两个栈，其中一个栈始终代表另一个栈中的最小值。

```typescript
class MinStack {
  // 正常栈
  stack1: Array<number>;
  // 正常栈中的最小值
  stack2: Array<number>;

  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }

  push(val: number): void {
    this.stack1.push(val);
    // stack2为空 或者 stack2栈顶元素 >= val
    if (
      this.stack2.length === 0 ||
      this.stack2[this.stack2.length - 1] >= val
    ) {
      this.stack2.push(val);
    }
  }

  pop(): void {
    // stack1栈顶元素 等于 stack2栈顶元素
    if (
      this.stack1[this.stack1.length - 1] ===
      this.stack2[this.stack2.length - 1]
    ) {
      this.stack2.pop();
    }
    this.stack1.pop();
  }

  top(): number {
    return this.stack1[this.stack1.length - 1];
  }

  getMin(): number {
    return this.stack2[this.stack2.length - 1];
  }
}
```

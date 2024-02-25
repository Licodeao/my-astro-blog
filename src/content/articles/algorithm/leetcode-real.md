---
title: 字节真题-仅用递归反转栈📌
author: Licodeao
publishDate: "2023-5-13"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 仅用递归反转栈

[1,2,3,4,5] => [5,4,3,2,1]
只能通过递归实现，而不能借助于栈、队列等结构

## 解题思路

```typescript
// 法一：栈顶弹出元素

const arr: number[] = [];
for (let i = 1; i < 6; i++) {
  arr.push(i);
}

console.log(arr);
console.log(reverseStack(arr));

function reverseStack(stack: number[]) {
  if (stack.length <= 1) {
    return stack;
  }

  let top = stack.pop() as number; //stack: 1,2,3,4
  stack = reverseStack(stack) as number[]; // stack:4,3,2,1
  stack = pushFirst(stack, top);
  return stack;
}

function pushFirst(stack: number[], top: number) {
  if (stack.length === 0) {
    stack.push(top);
    return stack;
  }
  let temp = stack.pop() as number; // stack: 4,3,2
  stack = pushFirst(stack, top);
  stack.push(temp);
  return stack;
}
```

```typescript
// 法二：取出栈底元素

const arr: number[] = [];
for (let i = 1; i < 6; i++) {
  arr.push(i);
}

console.log(arr);
console.log(reverseStack1(arr));

function reverseStack1(stack: number[]) {
  if (stack.length <= 1) {
    return stack;
  }

  let last = getLast(stack); //stack: 2,3,4,5 last = 1
  stack = reverseStack1(stack) as number[]; // stack:4,3,2,1
  stack.push(last);
  return stack;
}

function getLast(stack: number[]): number {
  if (stack.length === 1) {
    return stack.pop() as number;
  }
  let temp = stack.pop() as number; // stack: 1,2,3,4 temp = 5
  let last = getLast(stack); // stack: 2,3,4
  stack.push(temp); // stack: 2,3,4,5
  return last;
}
```

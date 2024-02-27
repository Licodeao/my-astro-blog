---
author: Licodeao
title: 剑指offer-22-链表中倒数第k个节点📌
publishDate: "2023-5-16"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 剑指 Offer 22. 链表中倒数第 k 个节点

输入一个链表，输出该链表中倒数第 k 个节点。为了符合大多数人的习惯，本题从 1 开始计数，即链表的尾节点是倒数第 1 个节点。

例如，一个链表有 `6` 个节点，从头节点开始，它们的值依次是 `1、2、3、4、5、6`。这个链表的倒数第 `3` 个节点是值为 `4` 的节点。

**示例：**

```
给定一个链表: 1->2->3->4->5, 和 k = 2.

返回链表 4->5.
```

## 解题思路

这道题可以使用快慢指针和统计节点个数来做

这道题中，快慢指针的做法是：先让 fast 走 k 步，随后快慢指针再一起走

统计节点个数是：统计链表中的节点个数为 n 个，那么第(n - k + 1)个节点即是答案

- 由于我们需要两次遍历链表，所以第一次遍历时，需要维护一个新的头节点指针向后遍历，而不能用原头节点指针遍历，否则第二次就没法遍历了。

```typescript
// 快慢指针

function getKthFromEnd(head: ListNode | null, k: number): ListNode | null {
  // 边界判断
  if (head === null) {
    return head;
  }

  let slow = head;
  let fast = head;

  // 快指针先走k步, 并且从1开始计数，所以循环k-1次
  for (let i = 0; i < k - 1; i++) {
    // 先判断一下
    if (fast.next === null) {
      return head;
    }
    fast = fast.next;
  }

  // 再一起走
  while (fast.next !== null) {
    slow = slow.next;
    fast = fast.next;
  }

  return slow;
}
```

```typescript
// 统计节点个数

function getKthFromEnd(head: ListNode | null, k: number): ListNode | null {
  // 边界判断
  if (head === null) {
    return head;
  }

  // 第一次遍历，统计总节点数量 n
  let h = head;
  let n = 0;
  while (h) {
    n++;
    h = h.next;
  }

  // 第二次遍历，找正数第 n - k + 1 个节点
  let cnt = 0;
  while (head) {
    cnt++;
    if (cnt === n - k + 1) break;
    head = head.next;
  }

  return head;
}
```

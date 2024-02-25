---
title: Leetcode-19-删除链表的倒数第N个结点📌
author: Licodeao
publishDate: "2023-5-17"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 19. 删除链表的倒数第 N 个结点

给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。

**示例 1：**

![img](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/remove_ex1.jpg)

```
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```

**示例 2：**

```
输入：head = [1], n = 1
输出：[]
```

**示例 3：**

```
输入：head = [1,2], n = 1
输出：[1]
```

**提示：**

- 链表中结点的数目为 `sz`
- `1 <= sz <= 30`
- `0 <= Node.val <= 100`
- `1 <= n <= sz`

**进阶：**你能尝试使用一趟扫描实现吗？

## 解题思路

这道题和之前返回中间结点的题一样，同样可以使用快慢指针和统计节点个数的方法来做。

但在这道题中，使用统计节点个数的方法来做会更简单一点，因为要删除链表中的节点是需要找到其前驱节点的。

如果使用快慢指针来做的话，相当于快指针先走 k-1 步。

```typescript
// 快慢指针

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // 边界判断
  if (head === null) {
    return head;
  }

  let fast = head;
  let slow = head;

  for (let i = 0; i < n; i++) {
    // 如果fast为空，表示删除的是头结点
    if (fast.next === null) return head.next;
    fast = fast.next;
  }

  while (fast.next !== null) {
    slow = slow.next;
    fast = fast.next;
  }

  // 此时快指针已经走完了，通过慢指针来删除第n个节点
  slow.next = slow.next.next;

  return head;
}
```

```typescript
// 统计节点个数

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  // 边界判断
  if (head === null) {
    return head;
  }

  // 统计节点个数
  let k = 0;
  // 借助临时变量来遍历链表
  let h = head;

  while (h) {
    k++;
    h = h.next;
  }

  // 第index节点，即为需要删除的节点
  let index = k - n + 1;
  // index节点的前驱节点
  let pre = head;

  // 删除的是第一个节点时
  if (index === 1) return head.next;

  // 寻找需要删除的节点
  while (index > 2) {
    index--;
    pre = pre.next;
  }

  // 进行删除
  pre.next = pre.next.next;

  return head;
}
```

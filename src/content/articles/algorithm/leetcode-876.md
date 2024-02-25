---
title: Leetcode-876-链表的中间结点📌
author: Licodeao
publishDate: "2023-5-15"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 876. 链表的中间结点

给你单链表的头结点 `head` ，请你找出并返回链表的中间结点。

如果有两个中间结点，则返回第二个中间结点。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/07/23/lc-midlist1.jpg)

```
输入：head = [1,2,3,4,5]
输出：[3,4,5]
解释：链表只有一个中间结点，值为 3 。
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2021/07/23/lc-midlist2.jpg)

```
输入：head = [1,2,3,4,5,6]
输出：[4,5,6]
解释：该链表有两个中间结点，值分别为 3 和 4 ，返回第二个结点。
```

**提示：**

- 链表的结点数范围是 `[1, 100]`
- `1 <= Node.val <= 100`

## 解题思路

快慢指针，慢指针走一步，快指针走两步。

当快指针走到底时，如果当前链表的节点个数为

- 奇数时，慢指针恰好在链表的中间
- 偶数时，慢指针恰好在链表的中间第二个节点

while(fast !== null && fast.next !== null)，返回中间第二个节点

while(fast.next !== null && fast.next.next !== null)，返回中间第一个节点（快指针少走一步，所以慢指针也会少走一步，停在中间偏左）

```typescript
// 快慢指针

function middleNode(head: ListNode | null): ListNode | null {
  // 边界判断: 空链表或只有一个节点时
  if (head === null || head.next === null) {
    return head;
  }

  // 定义快指针，初始指向头结点
  let fast = head;
  // 定义慢指针，初始指向头结点
  let slow = head;

  // 中间第二个节点
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}
```

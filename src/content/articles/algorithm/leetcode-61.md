---
title: Leetcode-61-旋转链表📌
author: Licodeao
publishDate: "2023-5-24"
img: /assets/articles/leetcode.png
img_alt: Leetcode-61-旋转链表📌
description: |
  Leetcode-61-旋转链表📌
categories:
  - Algorithm
tags:
  - Algorithm
---

## 61. 旋转链表

给你一个链表的头节点 `head` ，旋转链表，将链表每个节点向右移动 `k` 个位置。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/11/13/rotate1.jpg)

```
输入：head = [1,2,3,4,5], k = 2
输出：[4,5,1,2,3]
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2020/11/13/roate2.jpg)

```
输入：head = [0,1,2], k = 4
输出：[2,0,1]
```

**提示：**

- 链表中节点的数目在范围 `[0, 500]` 内
- `-100 <= Node.val <= 100`
- `0 <= k <= 2 * 109`

## 解题思路

首先需要统计节点个数，方便后期找到第 n-k 个节点，因为需要在这个位置断链。

找到第 n-k 个节点的前提是需要先成环

成环之后，在第 n-k 个节点的位置断链，然后返回 n-k 的下一个节点即可，即图中的 4=>5

```typescript
function rotateRight(head: ListNode | null, k: number): ListNode | null {
  // 边界判断: 空或只有一个节点
  if (head === null || head.next === null) {
    return head;
  }

  // 统计节点个数
  let n = 1;
  let temp = head;
  while (temp.next !== null) {
    n++;
    temp = temp.next;
  }

  // 对k进行取模，防止k > n
  k = k % n;
  // k = n时，是不需要旋转的；k=n=3时，相当于是没有旋转
  if (k - n == 0) {
    return head;
  }

  // 成环
  temp.next = head;

  // 走到第n - k个节点
  for (let i = 1; i < n - k; i++) {
    head = head.next;
  }

  // 需要返回的是n-k的下一个头结点，即断开的第二部分作为头结点
  let newHead = head.next;
  // 在n-k的位置断链
  head.next = null;

  return newHead;
}
```

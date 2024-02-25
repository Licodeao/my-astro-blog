---
title: Leetcode-25-K 个一组翻转链表📌
author: Licodeao
publishDate: "2023-5-22"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 25. K 个一组翻转链表

给你链表的头节点 `head` ，每 `k` 个节点一组进行翻转，请你返回修改后的链表。

`k` 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 `k` 的整数倍，那么请将最后剩余的节点保持原有顺序。

你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/10/03/reverse_ex1.jpg)

```
输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2020/10/03/reverse_ex2.jpg)

```
输入：head = [1,2,3,4,5], k = 3
输出：[3,2,1,4,5]
```

**提示：**

- 链表中的节点数目为 `n`
- `1 <= k <= n <= 5000`
- `0 <= Node.val <= 1000`

## 解题思路

这道题可以将 k 个一组的节点，与其后面的节点进行切割。分别用变量保存被切割的两部分，同时对两部分进行反转，随后再拼接返回即可。

```typescript
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  // 保存切割的部分
  let temp = head;

  // 先让temp走到第k个节点
  for (let i = 1; temp != null && i < k; i++) {
    temp = temp.next;
  }

  // 如果切割后不能分成一组的话
  if (temp == null) {
    return head;
  }

  // 保存切割点之后的节点
  let t = temp.next;
  // 断链
  temp.next = null;

  // 反转两个链表
  let newHead = reverseList(head);
  let newTemp = reverseKGroup(t, k);
  // 拼接
  head.next = newTemp;
  return newHead;

  // 反转节点
  function reverseList(head: ListNode | null): ListNode | null {
    if (head == null || head.next == null) {
      return head;
    }
    let newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
  }
}
```

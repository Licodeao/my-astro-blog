---
title: Leetcode-92-反转链表 II📌
author: Licodeao
publishDate: "2023-5-21"
img: /assets/articles/leetcode.png
img_alt: Leetcode-92-反转链表 II📌
description: |
  Leetcode-92-反转链表 II📌
categories:
  - Algorithm
tags:
  - Algorithm
---

## 92. 反转链表 II

给你单链表的头指针 `head` 和两个整数 `left` 和 `right` ，其中 `left <= right` 。请你反转从位置 `left` 到位置 `right` 的链表节点，返回 **反转后的链表** 。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/02/19/rev2ex2.jpg)

```
输入：head = [1,2,3,4,5], left = 2, right = 4
输出：[1,4,3,2,5]
```

**示例 2：**

```
输入：head = [5], left = 1, right = 1
输出：[5]
```

**提示：**

- 链表中节点数目为 `n`
- `1 <= n <= 500`
- `-500 <= Node.val <= 500`
- `1 <= left <= right <= n`

## 解题思路

通过先理解反转第 1~n 个节点的问题，进而来求解反转第 left~right 的节点的问题。

那么，反转第 1~n 个节点的问题如何解决？

- 通过临时变量来保存 n 之后的链表节点，这样做的目的是方便第 1~n-1 之间的节点反转后，方便进行拼接，并且 n 之后的链表节点不会丢失
- 在反转后进行拼接时，同" 反转链表 I "的操作方式是一样的（图解过程完全一致，只是 null 变成了 last 保存的部分）

```typescript
// 反转第1~n个节点

function reverseNth(head: ListNode | null, n: number): ListNode | null {
  // 保存n之后的节点的变量
  let last = null;

  // 1个节点时，仍然需要保存n之后的变量，不然会丢失这些节点
  if (n == 1) {
    last = head.next;
    return head;
  }

  // 递归调用，缩小问题的规模进而求解
  let newHead = reverseNth(head.next, n - 1);
  // 进行节点的拼接
  head.next.next = head;
  head.next = last;

  return newHead;
}
```

```typescript
// 理解了反转第1~n个节点的问题后，就可以求解该题了
// 以下是（完整过程）

function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number
): ListNode | null {
  // 保存节点
  let last = null;

  // left为1的情况下，其实就相当于1~n的情况
  if (left === 1) {
    return reverseNth(head, right);
  }

  // 如果left不为1的情况下（即1~left-1），直接递归调用即可，即缩小问题的规模进而求解
  head.next = reverseBetween(head.next, left - 1, right - 1);
  return head;

  // 反转第1~n个节点
  function reverseNth(head: ListNode | null, n: number): ListNode | null {
    if (n == 1) {
      last = head.next;
      return head;
    }

    let newHead = reverseNth(head.next, n - 1);
    head.next.next = head;
    head.next = last;

    return newHead;
  }
}
```

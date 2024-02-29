---
title: Leetcode-203-移除链表元素📌
author: Licodeao
publishDate: "2023-5-14"
img: /assets/articles/leetcode.png
img_alt: Leetcode-203-移除链表元素📌
description: |
  Leetcode-203-移除链表元素📌
categories:
  - Algorithm
tags:
  - Algorithm
---

## 203. 移除链表元素

给你一个链表的头节点 `head` 和一个整数 `val` ，请你删除链表中所有满足 `Node.val == val` 的节点，并返回 **新的头节点** 。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2021/03/06/removelinked-list.jpg)

```
输入：head = [1,2,6,3,4,5,6], val = 6
输出：[1,2,3,4,5]
```

**示例 2：**

```
输入：head = [], val = 1
输出：[]
```

**示例 3：**

```
输入：head = [7,7,7,7], val = 7
输出：[]
```

**提示：**

- 列表中的节点数目在范围 `[0, 104]` 内
- `1 <= Node.val <= 50`
- `0 <= val <= 50`

## 解题思路

- 常规解法
- 递归
- dummyhead

```typescript
// 常规解法

function removeElements(head: ListNode | null, val: number): ListNode | null {
  // 删除头节点
  while (head !== null && head.val == val) {
    head = head.next;
  }

  // 空链表情况
  if (head == null) {
    return head;
  }

  // 当前节点
  let cur = head.next;
  // 前驱节点
  let pre = head;

  while (cur !== null) {
    // 找到删除的节点
    if (cur.val == val) {
      pre.next = cur.next;
      cur = cur.next;
    } else {
      pre = cur;
      cur = cur.next;
    }
  }

  return head;
}
```

```typescript
// 递归

function removeElements(head: ListNode | null, val: number): ListNode | null {
  // 空链表
  if (head == null) {
    return head;
  }
  // 缩小问题规模
  head.next = removeElements(head.next, val);

  return head.val === val ? head.next : head;
}
```

```typescript
// dummyHead

function removeElements(head: ListNode | null, val: number): ListNode | null {
  if (head == null) {
    return head;
  }

  // dummyHead
  let ele = {
    next: head,
  };
  let p = ele;
  while (p.next) {
    if (p.next.val == val) {
      p.next = p.next.next;
    } else {
      p = p.next;
    }
  }
  return ele.next;
}
```

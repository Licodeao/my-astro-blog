---
title: Leetcode-21-合并两个有序链表📌
author: Licodeao
publishDate: "2023-5-24"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 21. 合并两个有序链表

将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/10/03/merge_ex1.jpg)

```
输入：l1 = [1,2,4], l2 = [1,3,4]
输出：[1,1,2,3,4,4]
```

**示例 2：**

```
输入：l1 = [], l2 = []
输出：[]
```

**示例 3：**

```
输入：l1 = [], l2 = [0]
输出：[0]
```

**提示：**

- 两个链表的节点数目范围是 `[0, 50]`
- `-100 <= Node.val <= 100`
- `l1` 和 `l2` 均按 **非递减顺序** 排列

## 解题思路

这道题使用 dummyHead 解法会更容易一点，否则需要在循环中写较多判断。同样的，也可以使用递归。

思路：两个链表依次进行比较，值较小的就添加到辅助链表中，直至链表遍历完成。值相等的情况下，随便哪个都行。

```typescript
// dummyHead

function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  // 边界判断
  if (list1 === null) {
    return list2;
  }
  if (list2 === null) {
    return list1;
  }

  // 创建虚拟头结点
  let list3 = new ListNode(-1);
  // 辅助链表
  let temp = list3;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      temp.next = list1;
      list1 = list1.next;
    } else {
      temp.next = list2;
      list2 = list2.next;
    }
    temp = temp.next;
  }

  // 出循环后继续串联
  if (list1 !== null) {
    temp.next = list1;
  }
  if (list2 !== null) {
    temp.next = list2;
  }

  return list3.next;
}
```

```typescript
// 递归

function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  // 边界判断
  if (list1 === null) {
    return list2;
  }
  if (list2 === null) {
    return list1;
  }

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      list1.next = mergeTwoLists(list1.next, list2);
      return list1;
    } else {
      list2.next = mergeTwoLists(list1, list2.next);
      return list2;
    }
  }
}
```

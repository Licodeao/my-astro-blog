---
title: Leetcode-148-排序链表📌
author: Licodeao
publishDate: 2023-5-24
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 148. 排序链表

给你链表的头结点 `head` ，请将其按 **升序** 排列并返回 **排序后的链表** 。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2020/09/14/sort_list_1.jpg)

```
输入：head = [4,2,1,3]
输出：[1,2,3,4]
```

**示例 2：**

![img](https://assets.leetcode.com/uploads/2020/09/14/sort_list_2.jpg)

```
输入：head = [-1,5,3,4,0]
输出：[-1,0,3,4,5]
```

**示例 3：**

```
输入：head = []
输出：[]
```

**提示：**

- 链表中节点的数目在范围 `[0, 5 * 104]` 内
- `-105 <= Node.val <= 105`

## 解题思路

这道题思路还是很清晰，只不过整体代码量较多，使用到的是归并排序思想。

```typescript
function sortList(head: ListNode | null): ListNode | null {
  // 边界判断
  if (head === null || head.next === null) {
    return head;
  }

  // 找出中间节点
  let mid = findMiddleNode(head);

  // 将链表拆分成左右两个链表，记得断链
  let left = head;
  let right = mid.next;
  mid.next = null;

  // 递归排序左右链表
  let leftHead = sortList(left);
  let rightHead = sortList(right);

  // 合并两个有序链表
  let mergeHead = mergeTwoLinkedList(leftHead, rightHead);

  return mergeHead;

  // 找出链表的中间结点，如果链表的个数是偶数，则返回中间节点的第一个节点
  function findMiddleNode(head: ListNode | null): ListNode | null {
    if (head === null || head.next === null) {
      return head;
    }

    let slow = head;
    let fast = head;

    while (fast.next !== null && fast.next.next !== null) {
      slow = slow.next;
      fast = fast.next.next;
    }

    return slow;
  }

  // 合并两个有序的链表
  function mergeTwoLinkedList(
    list1: ListNode | null,
    list2: ListNode | null
  ): ListNode | null {
    // dummyHead
    let list3 = new ListNode(-1);
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

    temp.next = list1 === null ? list2 : list1;

    return list3.next;
  }
}
```

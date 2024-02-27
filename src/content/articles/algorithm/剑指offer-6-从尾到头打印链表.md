---
author: Licodeao
title: 剑指offer-6-从尾到头打印链表📌
publishDate: "2023-5-18"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 剑指 Offer 06. 从尾到头打印链表

输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

**示例 1：**

```
输入：head = [1,3,2]
输出：[2,3,1]
```

**限制：**

```
0 <= 链表长度 <= 10000
```

## 解题思路

```typescript
// 常规解法: 使用栈空间来辅助

function reversePrint(head: ListNode | null): number[] {
  let newArr = [];
  while (head) {
    newArr.unshift(head.val);
    head = head.next;
  }
  return newArr;
}
```

特殊解法：

- 其实这种解法，有点像是统计节点个数和使用栈空间辅助相结合
  - 通过创建一个临时变量先来遍历整个链表，以此来统计链表节点的个数
  - 通过链表节点的个数来创建对应大小的栈空间，然后再从后往前依次填入元素
- 那么，这种解法达到的效果就是其额外的空间复杂度为 O(1)，相比于用栈空间辅助达到的空间复杂度 O(n)是要好许多的

```typescript
// 特殊解法

function reversePrint(head: ListNode | null): number[] {
  if (head === null) return new Array(0);

  let n = 0;
  let h = head;
  while (h) {
    n++;
    h = h.next;
  }

  let newArr = new Array(n);

  while (head !== null) {
    // 从后往前
    newArr[--n] = head.val;
    head = head.next;
  }

  return newArr;
}
```

![image-20230521135252783](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230521135252783.png)

![image-20230521135313311](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230521135313311.png)

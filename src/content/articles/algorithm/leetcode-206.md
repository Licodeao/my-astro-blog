---
title: Leetcode-206-反转链表📌
author: Licodeao
publishDate: "2023-5-20"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 206. 反转链表

给你单链表的头节点 `head` ，请你反转链表，并返回反转后的链表。

**示例 1：**

![img](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/rev1ex1.jpg)

```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

**示例 2：**

![img](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/rev1ex2.jpg)

```
输入：head = [1,2]
输出：[2,1]
```

**示例 3：**

```
输入：head = []
输出：[]
```

**提示：**

- 链表中节点的数目范围是 `[0, 5000]`
- `-5000 <= Node.val <= 5000`

## 解题思路

- 递归（图解）

<img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/3df7c616cddafb452eca27e2c5da7ae.jpg" style="transform: rotate(-90deg)" />

- ```typescript
  function reverseList(head: ListNode | null): ListNode | null {
    // 边界判断: 空链表或只有一个节点时
    if (head === null || head.next === null) {
      return head;
    }

    let newHead = reverseList(head.next);
    // 2 -> 1
    head.next.next = head;
    // 1 -> null
    head.next = null;

    return newHead;
  }
  ```

- 栈空间辅助

- ```typescript
  function reverseList(head: ListNode | null): ListNode | null {
    if (head === null || head.next === null) {
      return head;
    }

    let newArr = [];

    while (head) {
      newArr.unshift(head.val);
      head = head.next;
    }

    // 将数组重新构造为链表
    let linkedList = new ListNode();
    newArr.reduce((prev, cur) => {
      prev.next = new ListNode(cur);
      return prev.next;
    }, linkedList);

    return linkedList.next;
  }
  ```

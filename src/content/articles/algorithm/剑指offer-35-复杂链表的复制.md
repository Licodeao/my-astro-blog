---
author: Licodeao
title: 剑指offer-35-复杂链表的复制📌
publishDate: 2023-5-26
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 剑指 Offer 35. 复杂链表的复制

请实现 `copyRandomList` 函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个 `next` 指针指向下一个节点，还有一个 `random` 指针指向链表中的任意节点或者 `null`。

**示例 1：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e1.png)

```
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**示例 2：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e2.png)

```
输入：head = [[1,1],[2,1]]
输出：[[1,1],[2,1]]
```

**示例 3：**

**![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e3.png)**

```
输入：head = [[3,null],[3,0],[3,null]]
输出：[[3,null],[3,0],[3,null]]
```

**示例 4：**

```
输入：head = []
输出：[]
解释：给定的链表为空（空指针），因此返回 null。
```

**提示：**

- `-10000 <= Node.val <= 10000`
- `Node.random` 为空（null）或指向链表中的节点。
- 节点数目不超过 1000 。

## 解题思路

思路：复制+拆分

- 复制：
  - A -> B -> C -> D
  - 进行复制节点：A -> A' -> B -> B' -> C -> C' -> D -> D' -> null
  - 让复制节点互相指向
    - cur 指向 A 节点，cur.random 指向 C 节点
    - cur.next.random = cur.random.next，即 A' -> C'
- 拆分
  - 由于原节点和复制节点没有指向的问题，也就是在个指个的
  - 那么，就可以拆分成两个链表：原节点链表和复制节点链表
    - A -> B -> C -> D
    - A' -> B' -> C' -> D'

```javascript
var copyRandomList = function (head) {
  // 边界判断
  if (head === null) {
    return head;
  }

  // 复制链表节点
  let cur = head;
  while (cur !== null) {
    // 保存后驱节点
    let next = cur.next;
    cur.next = new Node(cur.val);
    cur.next.next = next;
    cur = next;
  }

  // 复制随机节点
  cur = head;
  while (cur !== null) {
    let newCur = cur.next;
    newCur.random = cur.random === null ? null : cur.random.next;
    cur = cur.next.next;
  }

  // 拆分
  let newHead = head.next;
  cur = head;
  // 随机节点
  let curNew = head.next;
  while (cur !== null) {
    cur.next = cur.next.next;
    cur = cur.next;
    curNew.next = cur === null ? null : cur.next;
    curNew = curNew.next;
  }

  return newHead;
};
```

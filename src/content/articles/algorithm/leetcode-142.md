---
title: Leetcode-142-环形链表 II📌
author: Licodeao
publishDate: "2023-5-23"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 142. 环形链表 II

给定一个链表的头节点 `head` ，返回链表开始入环的第一个节点。 _如果链表无环，则返回 `null`。_

如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（**索引从 0 开始**）。如果 `pos` 是 `-1`，则在该链表中没有环。**注意：`pos` 不作为参数进行传递**，仅仅是为了标识链表的实际情况。

**不允许修改** 链表。

**示例 1：**

![img](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png)

```
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。
```

**示例 2：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test2.png)

```
输入：head = [1,2], pos = 0
输出：返回索引为 0 的链表节点
解释：链表中有一个环，其尾部连接到第一个节点。
```

**示例 3：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test3.png)

```
输入：head = [1], pos = -1
输出：返回 null
解释：链表中没有环。
```

**提示：**

- 链表中节点的数目范围在范围 `[0, 104]` 内
- `-105 <= Node.val <= 105`
- `pos` 的值为 `-1` 或者链表中的一个有效索引

## 解题思路

找到指针相交的点，先查看是否成环，然后再统计节点个数，最后一样的套路：让一个指针先走 n（即节点个数）步，然后再同时走，最后会发现指针会在环的入口处相遇，返回慢指针即可。可以画个小环模拟一下，确实是这样的。

```typescript
function detectCycle(head: ListNode | null): ListNode | null {
  // 边界条件：空或自成环
  if (head === null || head.next === head) {
    return head;
  }

  // 找出指针相交的点
  let fast = head;
  let slow = head;
  while (fast !== null && fast.next !== null) {
    fast = fast.next.next;
    slow = slow.next;
    if (fast === slow) {
      break;
    }
  }

  // 统计节点个数前，判断是不是环
  if (fast === null || fast.next === null) {
    return null;
  }

  // 统计节点个数
  let n = 1;
  while (true) {
    // slow停止，让fast去走，统计个数
    fast = fast.next;
    if (fast === slow) {
      break;
    }
    n++;
  }

  // 找入口，指针会在入口处相遇
  let prev = head;
  let last = head;
  // 让last先走n步
  for (let i = 0; i < n; i++) {
    last = last.next;
  }
  // 同时走
  while (true) {
    // 判断是否已经相遇，并且这时候相遇是在入口处，返回prev即可
    if (last === prev) return prev;
    last = last.next;
    prev = prev.next;
  }
}
```

---
title: 字节真题-变形的链表反转📌
author: Licodeao
publishDate: "2023-5-23"
img: /assets/articles/leetcode.png
img_alt: 字节真题-变形的链表反转📌
description: |
  字节真题-变形的链表反转📌
categories:
  - Algorithm
tags:
  - Algorithm
---

## 变形的链表反转

给定一个单链表的头节点 head,实现一个调整单链表的函数，使得每 K 个节点之间为一组进行逆序，并且从链表的 尾部 开始组起，头部剩余节点数量不够一组的不需要逆序。（不能使用队列或者栈作为辅助）

例如：
链表:1->2->3->4->5->6->7->8->null, K = 3。那么 6->7->8，3->4->5，1->2 各位一组。调整后：1->2->5->4->3->8->7->6->null。其中 1，2 不调整，因为不够一组。

## 解题思路

此题变形于力扣第 25 题，区别于第 25 题的是：这道题是从链表的尾部开始组起，而第 25 题是从头部开始组起。

那么，思路就是：整体反转 => 分组反转 => 整体反转

- 先反转整个链表
- 此时，问题就回到了"从头部开始组起"。于是就再分组反转，与头部一样的操作
- 最后，再反转整个链表，相当于还原

```typescript
// 头部反转
function reverseKGroup(head: any, k: number) {
  let temp = head;

  for (let i = 1; temp !== null && i < k; i++) {
    temp = temp.next;
  }

  if (temp === null) {
    return head;
  }

  let t = temp.next;
  temp.next = null;

  let newHead = reverseList(head);
  let newTemp = reverseKGroup(t, k);
  head.next = newTemp;
  return newHead;

  // 反转整个链表
  function reverseList(head: any) {
    if (head === null || head.next === null) {
      return head;
    }
    let newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
  }

  function reverseKGroup2(head: any, k: number) {
    // 整体反转
    head = reverseList(head);

    // 局部反转
    head = reverseKGroup(head, k);

    // 整体反转
    head = reverseList(head);

    return head;
  }
}
```

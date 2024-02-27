---
title: Leetcode-160-相交链表📌
author: Licodeao
publishDate: "2023-5-19"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 160. 相交链表

给你两个单链表的头节点 `headA` 和 `headB` ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 `null` 。

图示两个链表在节点 `c1` 开始相交**：**

[![img](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/160_statement.png)](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)

题目数据 **保证** 整个链式结构中不存在环。

**注意**，函数返回结果后，链表必须 **保持其原始结构** 。

**自定义评测：**

**评测系统** 的输入如下（你设计的程序 **不适用** 此输入）：

- `intersectVal` - 相交的起始节点的值。如果不存在相交节点，这一值为 `0`
- `listA` - 第一个链表
- `listB` - 第二个链表
- `skipA` - 在 `listA` 中（从头节点开始）跳到交叉节点的节点数
- `skipB` - 在 `listB` 中（从头节点开始）跳到交叉节点的节点数

评测系统将根据这些输入创建链式数据结构，并将两个头节点 `headA` 和 `headB` 传递给你的程序。如果程序能够正确返回相交节点，那么你的解决方案将被 **视作正确答案** 。

**示例 1：**

[![img](https://assets.leetcode.com/uploads/2021/03/05/160_example_1_1.png)](https://assets.leetcode.com/uploads/2018/12/13/160_example_1.png)

```
输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
输出：Intersected at '8'
解释：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。
从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,6,1,8,4,5]。
在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
— 请注意相交节点的值不为 1，因为在链表 A 和链表 B 之中值为 1 的节点 (A 中第二个节点和 B 中第三个节点) 是不同的节点。换句话说，它们在内存中指向两个不同的位置，而链表 A 和链表 B 中值为 8 的节点 (A 中第三个节点，B 中第四个节点) 在内存中指向相同的位置。
```

**示例 2：**

[![img](https://assets.leetcode.com/uploads/2021/03/05/160_example_2.png)](https://assets.leetcode.com/uploads/2018/12/13/160_example_2.png)

```
输入：intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
输出：Intersected at '2'
解释：相交节点的值为 2 （注意，如果两个链表相交则不能为 0）。
从各自的表头开始算起，链表 A 为 [1,9,1,2,4]，链表 B 为 [3,2,4]。
在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。
```

**示例 3：**

[![img](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/160_example_3.png)](https://assets.leetcode.com/uploads/2018/12/13/160_example_3.png)

```
输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：null
解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。
由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
这两个链表不相交，因此返回 null 。
```

**提示：**

- `listA` 中节点数目为 `m`
- `listB` 中节点数目为 `n`
- `1 <= m, n <= 3 * 104`
- `1 <= Node.val <= 105`
- `0 <= skipA <= m`
- `0 <= skipB <= n`
- 如果 `listA` 和 `listB` 没有交点，`intersectVal` 为 `0`
- 如果 `listA` 和 `listB` 有交点，`intersectVal == listA[skipA] == listB[skipB]`

## 解题思路

- 第一种做法（快慢指针）：两个链表进行相减，取到其链表长度的差。然后让长度较长的链表先走|长度差|步，之后再一起走。如果有相交节点的话，那么就会相遇。
- 第二种做法（双指针）：两个链表同时走，当较短的链表碰到 null，即走完时跳到较长的链表上继续走；当较长的链表碰到 null 时，跳到较短的链表上继续走，这种走法等于抵消掉了原本的长度差。那么，意味着如果有相交的节点时，肯定会碰到；反之，如果没有相交节点时，两者的值都会为 null

```typescript
// 第一种做法: 快慢指针

function getIntersectionNode(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  // 边界判断
  if (headA === null || headB === null) {
    return null;
  }

  // 计算链表A的长度
  let A = headA;
  let lenA = 0;
  while (A !== null) {
    lenA++;
    A = A.next;
  }

  // 计算链表B的长度
  let B = headB;
  let lenB = 0;
  while (B !== null) {
    lenB++;
    B = B.next;
  }

  // 由于一开始并不知道哪个链表长，所以要分情况，让较长的链表先走|长度差|步
  if (lenA > lenB) {
    for (let i = 0; i < lenA - lenB; i++) {
      headA = headA.next;
    }
  } else if (lenA < lenB) {
    for (let i = 0; i < lenB - lenA; i++) {
      headB = headB.next;
    }
  }

  // 最后一起走
  while (headA !== headB) {
    headA = headA.next;
    headB = headB.next;
  }

  return headA;
}
```

```typescript
// 第二种做法: 双指针

function getIntersectionNode(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  // 边界判断
  if (headA === null || headB === null) {
    return null;
  }

  let A = headA;
  let B = headB;

  while (A != B) {
    // 查看A链表走完没，如果走完了就跳到B链表去，否则继续走下去
    A = A === null ? headB : A.next;
    // B链表同理
    B = B === null ? headA : B.next;
  }

  // 返回A或B都行
  return A;
}
```

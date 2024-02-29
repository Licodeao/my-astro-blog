---
author: Licodeao
title: 剑指offer-3-数组中重复的数字📌
publishDate: "2023-5-13"
img: /assets/articles/offer.jpeg
img_alt: 剑指offer-3-数组中重复的数字📌
description: |
  剑指offer-3-数组中重复的数字📌
categories:
  - Algorithm
tags:
  - Algorithm
---

![alt text](image.png)

## 剑指 Offer 03. 数组中重复的数字

找出数组中重复的数字。

在一个长度为 n 的数组 nums 里的所有数字都在 0 ～ n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

**示例 1：**

```
输入：
[2, 3, 1, 0, 2, 5, 3]
输出：2 或 3
```

**限制：**

```
2 <= n <= 100000
```

## 解题思路

这道题实际上有三种解法：

- 排序（时间复杂度 O(nlogn)）
- 哈希表（时间复杂度 O(n)，空间复杂度 O(n)）
- 数组下标法

但是，数组下标法才是这道题的最优解，时间复杂度 O(n)，空间复杂度 O(1)

```typescript
// 排序

function findRepeatNumber(nums: number[]): number {
  if (nums.length === 0) return -1;
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === nums[i + 1]) {
      return nums[i];
    }
  }
}
```

```typescript
// 哈希表

function findRepeatNumber(nums: number[]): number {
  if (nums.length === 0) return -1;
  let hash = {};
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] in hash) {
      return nums[i];
    } else {
      hash[nums[i]] = 1;
    }
  }
}
```

```typescript
// 数组下标法

function findRepeatNumber(nums: number[]): number {
  for (let i = 0; i < nums.length; i++) {
    while (i != nums[i]) {
      // 交换之前进行判断该位置是否已经存在一样的了
      // 找到重复的, 实际上重复的也就是 nums[i] nums[nums[i]]
      if (nums[i] === nums[nums[i]]) {
        return nums[i];
      }

      // 交换
      let temp = nums[nums[i]];
      nums[nums[i]] = nums[i];
      nums[i] = temp;
    }
  }
  // 没有找到
  return -1;
}
```

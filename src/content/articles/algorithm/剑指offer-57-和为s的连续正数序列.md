---
title: 剑指offer-57-和为s的连续正数序列📌
author: Licodeao
publishDate: "2023-5-6"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 剑指 Offer 57 - II. 和为 s 的连续正数序列

输入一个正整数 `target` ，输出所有和为 `target` 的连续正整数序列（至少含有两个数）。

序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。

**示例 1：**

```
输入：target = 9
输出：[[2,3,4],[4,5]]
```

**示例 2：**

```
输入：target = 15
输出：[[1,2,3,4,5],[4,5,6],[7,8]]
```

**限制：**

- `1 <= target <= 10^5`

## 解题思路

这道题是个滑动窗口，关键点在于：

- 左右窗口
- 窗口里的数之和

```typescript
function findContinuousSequence(target: number): number[][] {
  // 定义返回数组
  let res = [];

  // 因为至少要含有两个数
  if (target <= 2) return res;

  // target从1开始
  let l = 1;
  let r = 1;

  // 窗口和
  let sum = 1;

  // 终止条件：l > target / 2
  while (l <= target / 2) {
    if (sum === target) {
      // 这里创建了一个数组，是因为结果需要为一个二维数组
      let temp = [];
      for (let i = l; i <= r; i++) {
        temp.push(i);
      }
      res.push(temp);
    }
    // 窗口和 < target，窗口需要扩大
    if (sum < target) {
      r++;
      sum += r;
    } else {
      // 窗口和 > target，窗口需要缩小
      // 这里的缩小是指：将上一次窗口和中的某个数减掉，相当于窗口进行了缩小
      sum -= l;
      l++;
    }
  }

  return res;
}
```

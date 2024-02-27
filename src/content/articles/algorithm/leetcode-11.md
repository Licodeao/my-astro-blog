---
title: Leetcode-11-盛最多水的容器📌
author: Licodeao
publishDate: "2023-5-5"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 11. 盛最多水的容器

给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

**说明：**你不能倾斜容器。

**示例 1：**

![img](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/question_11.jpg)

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

**示例 2：**

```
输入：height = [1,1]
输出：1
```

**提示：**

- `n == height.length`
- `2 <= n <= 105`
- `0 <= height[i] <= 104`

## 解题思路

如何盛最多的水？取决于两个柱子中较短的那一个，即木桶效应。

```typescript
function maxArea(height: number[]): number {
  // 定义左指针
  let l = 0;
  // 定义右指针
  let r = height.length - 1;
  // 保存结果
  let res = 0;
  while (l < r) {
    // 矩形面积
    let area = Math.min(height[l], height[r]) * (r - l);
    res = Math.max(res, area);

    // 双指针技巧，移动较低的一边
    if (height[l] < height[r]) {
      l++;
    } else {
      r--;
    }
  }

  return res;
}
```

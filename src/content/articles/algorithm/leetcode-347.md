---
title: Leetcode-347-前 K 个高频元素📌
author: Licodeao
publishDate: "2023-7-16"
img: /assets/articles/leetcode.png
img_alt: Leetcode-347-前 K 个高频元素📌
description: |
  Leetcode-347-前 K 个高频元素📌
categories:
  - Algorithm
tags:
  - Algorithm
---

## 347. 前 K 个高频元素

给你一个整数数组 `nums` 和一个整数 `k` ，请你返回其中出现频率前 `k` 高的元素。你可以按 **任意顺序** 返回答案。

**示例 1:**

```
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
```

**示例 2:**

```
输入: nums = [1], k = 1
输出: [1]
```

## 解题思路

这道题需要求前 k 个元素，那么自然而言使用优先队列解题。

```typescript
function topKFrequent(nums: number[], k: number): number[] {
  // 定义一个map，key存放数字，value存放出现次数
  const map: Map<number, number> = new Map();

  // 统计出现次数
  for (const n of nums) {
    // key不存在，则为0
    map.set(n, (map.get(n) || 0) + 1);
  }

  // TS没有最小堆的数据结构，所以直接对整个数组进行排序，取前k个元素
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map((i) => i[0]);
}
```

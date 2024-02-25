---
title: Leetcode-215-数组中的第K个最大元素📌
author: Licodeao
publishDate: "2023-6-5"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 215. 数组中的第 K 个最大元素

给定整数数组 `nums` 和整数 `k`，请返回数组中第 `**k**` 个最大的元素。

请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。

你必须设计并实现时间复杂度为 `O(n)` 的算法解决此问题。

**示例 1:**

```
输入: [3,2,1,5,6,4], k = 2
输出: 5
```

**示例 2:**

```
输入: [3,2,3,1,2,4,5,5,6], k = 4
输出: 4
```

**提示：**

- `1 <= k <= nums.length <= 105`
- `-104 <= nums[i] <= 104`

## 解题思路

使用排序或优先队列解题。

```typescript
// 排序 时间复杂度O(nlogn)

function findKthLargest(nums: number[], k: number): number {
  if (nums.length === 0) return 0;

  nums.sort((a, b) => a - b);

  return nums[nums.length - k];
}
```

```typescript
// 优先队列

class CustomPriorityQueue<T> {
  private data: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  // 返回队列中元素的数量
  size(): number {
    return this.data.length;
  }

  // 将一个元素插入队列中
  offer(item: T) {
    this.data.push(item);
    this.bubbleUp(this.data.length - 1);
  }

  // 弹出队列中最小的元素（即根节点），并返回该元素。如果队列为空，则返回undefined。
  poll(): T | undefined {
    if (this.data.length === 0) {
      return undefined;
    }

    const result = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0 && last !== undefined) {
      this.data[0] = last;
      this.bubbleDown(0);
    }
    return result;
  }

  // 返回队列中最小的元素（即根节点），但不弹出该元素。如果队列为空，则返回undefined。
  peek(): T | undefined {
    return this.data.length > 0 ? this.data[0] : undefined;
  }

  // 指定位置的元素（索引为index）上浮到合适的位置，以维护小根堆的性质。
  private bubbleUp(index: number) {
    const item = this.data[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.data[parentIndex];
      if (this.compare(item, parent) >= 0) {
        break;
      }
      this.data[index] = parent;
      index = parentIndex;
    }
    this.data[index] = item;
  }

  // 将指定位置的元素（索引为index）下沉到合适的位置，以维护小根堆的性质。
  private bubbleDown(index: number) {
    const item = this.data[index];
    const lastIndex = this.data.length - 1;
    while (true) {
      const leftChildIndex = index * 2 + 1;
      const rightChildIndex = index * 2 + 2;
      let swapIndex = -1;
      if (leftChildIndex <= lastIndex) {
        const leftChild = this.data[leftChildIndex];
        if (this.compare(leftChild, item) < 0) {
          swapIndex = leftChildIndex;
        }
      }
      if (rightChildIndex <= lastIndex) {
        const rightChild = this.data[rightChildIndex];
        if (
          (swapIndex === -1 && this.compare(rightChild, item) < 0) ||
          (swapIndex !== -1 &&
            this.compare(rightChild, this.data[swapIndex]) < 0)
        ) {
          swapIndex = rightChildIndex;
        }
      }
      if (swapIndex === -1) {
        break;
      }
      this.data[index] = this.data[swapIndex];
      index = swapIndex;
    }
    this.data[index] = item;
  }
}

function findKthLargest(nums: number[], k: number): number {
  // 默认是小根堆 复杂度 空间：O(k). 时间 nlogk
  const minHeap = new CustomPriorityQueue<number>((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (minHeap.size() < k) {
      minHeap.offer(nums[i]);
    } else if (minHeap.peek() < nums[i]) {
      minHeap.poll();
      minHeap.offer(nums[i]);
    }
  }

  return minHeap.peek();
}
```

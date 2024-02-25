---
title: Leetcode-295-数据流的中位数📌
author: Licodeao
publishDate: "2023-7-19"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 295. 数据流的中位数

**中位数**是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。

- 例如 `arr = [2,3,4]` 的中位数是 `3` 。
- 例如 `arr = [2,3]` 的中位数是 `(2 + 3) / 2 = 2.5` 。

实现 MedianFinder 类:

- `MedianFinder() `初始化 `MedianFinder` 对象。
- `void addNum(int num)` 将数据流中的整数 `num` 添加到数据结构中。
- `double findMedian()` 返回到目前为止所有元素的中位数。与实际答案相差 `10-5` 以内的答案将被接受。

**示例 1：**

```
输入
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
输出
[null, null, null, 1.5, null, 2.0]

解释
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // 返回 1.5 ((1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0
```

## 解题思路

声明一个大顶堆和一个小顶堆

大顶堆负责放置较小的部分，小顶堆负责放置较大的部分

列表大小为偶数时，大顶堆和小顶堆分别返回各自堆顶元素，即可得到中位数

列表大小为奇数时，大顶堆多放置一个元素，返回多出的这个元素即是中位数（即返回大顶堆堆顶元素）

> add 操作思路：

- 假设当前大顶堆和小顶堆存放的元素分别为 1、2 和 3、4，后续需要加入 5
- 加入前需要判断当前堆里的元素个数是奇还是偶
  - 如果是偶数，则放入小顶堆中，并将当前小顶堆的堆顶元素取出放到大顶堆中 => [1, 2, 3] 和 [4, 5]
  - 如果是奇数，则放入大顶堆中，并将当前大顶堆的堆顶元素取出放到小顶堆中
    - 如再进行加入 0 => [0, 1, 2] 和 [3, 4, 5]

```typescript
// 解法一

class MedianFinder {
  private heap: number[] = [];

  public addNum(num: number): void {
    this.insert(num);
  }

  public findMedian(): number {
    const n = this.heap.length;
    if (n % 2 === 0) {
      return (this.heap[n / 2 - 1] + this.heap[n / 2]) / 2;
    } else {
      return this.heap[Math.floor(n / 2)];
    }
  }

  private insert(num: number): void {
    let lo = 0;
    let hi = this.heap.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (this.heap[mid] < num) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    this.heap.splice(lo, 0, num);
  }
}
```

```typescript
// 解法二

class MedianFinder {
  private nums: number[];

  constructor() {
    this.nums = [];
  }

  public addNum(num: number): void {
    this.nums.push(num);
  }

  public findMedian(): number {
    const n = this.nums.length;
    if (n === 0) {
      return 0;
    }
    this.nums.sort((a, b) => a - b);
    if (n % 2 === 0) {
      return (this.nums[n / 2 - 1] + this.nums[n / 2]) / 2;
    } else {
      return this.nums[Math.floor(n / 2)];
    }
  }
}
```

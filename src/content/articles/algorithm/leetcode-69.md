---
title: Leetcode-69-x的平方根📌
author: Licodeao
publishDate: "2023-4-6"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 69. x 的平方根

给你一个非负整数 `x` ，计算并返回 `x` 的 **算术平方根** 。

由于返回类型是整数，结果只保留 **整数部分** ，小数部分将被 **舍去 。**

**注意：**不允许使用任何内置指数函数和算符，例如 `pow(x, 0.5)` 或者 `x ** 0.5` 。

**示例 1：**

```
输入：x = 4
输出：2
```

**示例 2：**

```
输入：x = 8
输出：2
解释：8 的算术平方根是 2.82842..., 由于返回类型是整数，小数部分将被舍去。
```

**提示：**

- `0 <= x <= 231 - 1`

## 解题思路

> 示例 2 中，从"小数部分被舍去"可知，这是在<font color="red">求二分法的下界</font>
>
> 因此，可以使用二分查找来解题

```typescript
function mySqrt(x: number): number {
  // 定义左边界（下界）
  let l = 0;
  // 定义右边界（上界）
  let r = x;
  // 这里取等，是因为题目范围是个闭区间
  while (l <= r) {
    // 当收缩范围直到只有两个数时，左边界不确定，因此借助r*r > x来判断我们需要的数
    if (r - l <= 1) {
      return r * r > x ? l : r;
    }
    // 定义中间值
    let mid = l + Math.floor((r - l) / 2);
    // 这道题求下界，代表着当mid*mid < x时，我们无法确定左边界，因此直接使用mid来模糊确定左边界
    // 而当mid*mid > x时，我们能直接收缩右边界的范围，是因为符合mid*mid > x的数并不是需要的数
    // 因此，我们可以直接收缩右边界范围
    // 当然，如果mid*mid == x时，就代表找到了符合的数，直接返回即可
    if (mid * mid > x) {
      r = mid - 1;
    } else if (mid * mid == x) {
      return mid;
    } else {
      l = mid;
    }
  }
  return -1;
}
```

![image-20230406222748526](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230406222748526.png)

> 另外，这道题还可以进行变形
>
> 也即是：将问题变成<font color="red">求上界</font>
>
> 比如当 x = 8 时，x 的平方根大约是 2.8，那我们的答案就是 3，也就是求上界

```typescript
function myUpperSqrt(x: number): number {
  // 定义左边界（下界）
  let l = 0;
  // 定义右边界（上界）
  let r = x;
  while (l <= r) {
    if (r - l <= 1) {
      // 当收缩范围直到只有两个数时，右边界不确定，因此借助l*l > x来判断我们需要的数
      return l * l > x ? l : r;
    }
    // 相当于 let mid = l + Math.floor((r - l) / 2)
    let mid = l + ((r - l) >> 1);
    /**
     *	同样的思路，右边界不确定，借助mid来模糊确定右边界
     * 左边界确定，直接收缩左边界范围即可
     */
    if (mid * mid > x) {
      r = mid;
    } else if (mid * mid == x) {
      return mid;
    } else {
      l = mid + 1;
    }
  }
  return -1;
}
```

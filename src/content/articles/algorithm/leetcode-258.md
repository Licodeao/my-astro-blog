---
title: Leetcode-258-各位相加📌
author: Licodeao
publishDate: "2023-4-3"
img: /assets/articles/leetcode.png
img_alt: Leetcode-258-各位相加📌
description: |
  Leetcode-258-各位相加📌
categories:
  - Algorithm
tags:
  - Algorithm
---

```typescript
function addDigits(num: number): number {
  let sum = 0;
  while (num >= 10) {
    // 该while循环为数字的各个位相加
    // 这里不用担心结束条件，因为num最终会变为0，即false，然后终止该while循环
    while (num) {
      sum += Math.floor(num % 10);
      num /= 10;
    }
    num = sum;
    // 重置sum
    sum = 0;
  }
  return num;
}
```

---
title: Leetcode-20-有效的括号📌
author: Licodeao
publishDate: "2023-5-29"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Algorithm
tags:
  - Algorithm
---

## 20. 有效的括号

给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。

有效字符串需满足：

1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。

**示例 1：**

```
输入：s = "()"
输出：true
```

**示例 2：**

```
输入：s = "()[]{}"
输出：true
```

**示例 3：**

```
输入：s = "(]"
输出：false
```

**提示：**

- `1 <= s.length <= 104`
- `s` 仅由括号 `'()[]{}'` 组成

## 解题思路

遇到左开的符号，将与之相对的右开符号放入栈中，这样方便判断。

```typescript
function isValid(s: string): boolean {
  // 字符串为奇数，肯定是不行的
  if (s.length % 2 === 1) {
    return false;
  }

  let stack = [];

  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) === "(") {
      stack.push(")");
    } else if (s.charAt(i) === "{") {
      stack.push("}");
    } else if (s.charAt(i) === "[") {
      stack.push("]");
    } else {
      // 碰到右开符号，栈为空或栈顶元素与当前字符不相等
      if (stack.length === 0 || stack.pop() !== s.charAt(i)) {
        return false;
      }
    }
  }

  // 最后判断栈是否为空，栈为空则表示匹配完毕
  return stack.length === 0 ? true : false;
}
```

---
title: 关系运算符的探索
author: Licodeao
publishDate: "2022-9-16"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - JavaScript
tags:
  - ECMAScript
  - JavaScript
---

## 前瞻

此篇内容并不是关系运算符的全部探索，仅仅是我学习过程中遇到的比较新奇的 point，以此来记录一下。

## 关系运算符

### 起因

> Object 类型与其他数据类型进行比较时，都会得到 false。
>
> 有什么办法将结果变为 true 呢？

### 奇特的 point

![](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20220819170141494.png)

```javascript
let foo1 = ""
let foo2 = 0

// ==运算符，在类型不相同的情况下，会先将运算元转成Number类型的值，再进行比较(隐式转换)
console.log(foo1 == foo2) -> true

// ===运算符，在类型不相同的情况下，直接返回false，因为该运算符在类型不相同的情况下不会做任何的类型转换
console.log(foo1 === foo2) -> false
```

> Object 类型与其他数据类型比较

查阅[ECMA 文档](https://262.ecma-international.org/5.1/#sec-11.9.3)，第 11.9.3 点的第 8 条原文如下：

If [Type](https://262.ecma-international.org/5.1/#sec-8)(_x_) is either String or Number and [Type](https://262.ecma-international.org/5.1/#sec-8)(_y_) is Object,
return the result of the comparison _x_ == [ToPrimitive](https://262.ecma-international.org/5.1/#sec-9.1)(_y_).

```javascript
let foo1 = ""
let foo2 = null
console.log(foo1 == foo2) -> false

/**
*	根据上面的原文，可以发现：如果比较的类型有Object类型或null，那么此类型会被ToPrimitive函数转换为初始值
* 而初始值是哪些呢？ 就在上方的图中
* 依据上图，ToPrimitive(null)没有返回值，因为null没有对应的初始值
* 故比较结果为false
*/
```

### 解决疑惑

> 如何将有变量为 Object 类型的比较的结果变为 true 呢？

```javascript
let foo = {
  name: "licodeao",
  age: 20,
  // 在对象中写入[Symbol.toPrimitive]，并重写toPrimitive函数，修改其返回值即可
  [Symbol.toPrimitive]: function() {
    return 123
  }
}
// 实现将有变量为Object类型的比较的结果变为true
console.log(foo == 123) -> true
```

### 总结

- **严格相等运算符不会进行任何的类型转换**
- 使用**关系运算符进行比较**时，当**运算元中出现了 Object 类型**时，可以**重写其 toPrimitive 函数**，**修改其返回值为期望值**即可

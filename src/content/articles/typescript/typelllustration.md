---
title: 类型插图
author: Licodeao
publishDate: "2023-1-4"
img: /assets/articles/ts.png
img_alt: 类型插图
description: |
  TypeScript 类型插图
categories:
  - TypeScript
tags:
  - TypeScript
---

## 前瞻

在使用 TypeScript 进行类型检测时，遇到过几个不可思议的现象，这篇将赘述现象之一 —— 类型插图

## 类型插图

> 什么是类型插图？
>
> 看见这名字会觉得很抽象，去了解后再回看这个命名，依然觉得很抽象...
>
> 在对于对象的字面量赋值时，会出现类型插图

```typescript
interface Person {
  name: string;
  eating: () => void;
}

// 代码显然会报错
// Object literal may only specify know properties, and 'age' does not exist
const p: Person = {
  name: "licodeao",
  age: 18,
  eating: function () {
    console.log("eating");
  },
};

// 直接赋值给p不行，那我们间接赋值给p
const obj = {
  name: "licodeao",
  age: 18,
  eating: function () {
    console.log("eating");
  },
};
const p: Person = obj;

// 在VSCode上跑，你会发现VSCode并不会报错，也表明了TypeScript是允许这样子干的
// 那么为什么会有这么奇葩的现象出现呢？
// 往下看↓
```

奇葩的现象被 TypeScript 默许了，这表明了 TypeScript 内部的检测机制是允许这种现象的发生的

引用 TypeScript 首席架构师 Ahejlsberg 在 TypeScript PR 里面的回答：

![image-20230104122543241](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230104122543241.png)

[查看评论详情戳这里~](https://github.com/microsoft/TypeScript/pull/3823)

上方的代码为什么不报错？原因在这里：

- **每个对象字面量最初都被认为是 fresh（新鲜的）**
- **当一个新鲜的对象字面量分配给一个变量或传递给一个非空目标类型的参数时，对象字面量指定（含有）目标类型中不存在的属性是错误的**
  - **第一次创建的对象字面量，被认为是 fresh（新鲜的）**
  - **对于新鲜的对象字面量，TypeScript 会进行严格的类型检测，必须完全满足类型的要求（不能有多余的属性）**
- **当类型断言或对象字面量的类型扩大（复用）时，新鲜度会消失（从而不进行严格的类型检测）**

在我们间接赋值时，对象字面量的类型扩大（可以理解为复用），从而导致了对象字面量的新鲜度消失了，因此 TypeScript 不会对新鲜度消失的对象字面量进行严格的类型检测

```typescript
// 依然拿上方的代码作为例子

interface Person {
  name: string;
  eating: () => void;
}

// { name: "licodeao", age: 18, eating: function() { console.log("eating") } }
// 这个对象字面量首次被创建，被认为是新鲜的，所以会进行严格的类型检测，因此会报错×
const p: Person = {
  name: "licodeao",
  age: 18,
  eating: function () {
    console.log("eating");
  },
};

// { name: "licodeao", age: 18, eating: function() { console.log("eating") } }
// 这个对象字面量在有新鲜度时，被分配给obj变量了
// obj变量又分配给了p变量，那么此时上方的对象字面量进行了复用（即对象字面量的类型扩大），因此该对象字面量失去了新鲜度
// TypeScript不会对该对象字面量进行严格的类型检测，因此不会报错√
const obj = {
  name: "licodeao",
  age: 20,
  eating: function () {
    console.log("eating");
  },
};
const p: Person = obj;

// 首次创建的对象字面量传递给一个非空目标类型的参数，会进行严格的类型检测
function print(message: Person) {
  console.log(message.name);
}
// 进行严格的类型检测，报错×
print({ name: "licodeao2", height: 1.88, eating: function () {} });

// 以同样的方式使首次创建的对象字面量失去新鲜度
const obj2 = {
  name: "licodeao2",
  height: 1.88,
  eating: function () {},
};
// 不会进行严格的类型检测，不报错√
print(obj2);
```

## 总结

**类型插图，也可以称为严格字面量赋值检测（这个看着应该就不会那么抽象了）**

这种现象虽然看起来很奇怪，但依然符合 TypeScript 内部的检测机制，为什么会存在这种现象呢？

- **其实一方面增加了对象的复用性**
- **另一方面避免了在之后复用对象时再添加类型的麻烦**

**知识点**：

- **每个对象字面量最初都被认为是 fresh（新鲜的）**
- **当一个新鲜的对象字面量分配给一个变量或传递给一个非空目标类型的参数时，对象字面量指定（含有）目标类型中不存在的属性是错误的**
  - **第一次创建的对象字面量，被认为是 fresh（新鲜的）**
  - **对于新鲜的对象字面量，TypeScript 会进行严格的类型检测，必须完全满足类型的要求（不能有多余的属性）**
- **当类型断言或对象字面量的类型扩大（复用）时，新鲜度会消失（从而不进行严格的类型检测）**

这些现象虽然奇怪，但依然符合 TypeScript 内部的检测机制，因此从某种角度来说，这种现象是合理的。不过，看来 TypeScript 的类型约束并没有那么严格，并不像 Java 等语言一样。因此，TypeScript 奇怪现象多，但也代表了细节多，这也让 TypeScript 变得更有意思了，另外类型体操是痛并快乐的一点~

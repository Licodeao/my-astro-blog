---
title: V8引擎(三)
author: Licodeao
publishDate: "2022-10-11"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - V8
tags:
  - V8
---

## 前瞻

> JavaScript 中"函数是一等公民"背后的含义是什么？

​ 在 JavaScript 中，可以将一个函数赋值给一个变量，还可以将函数作为一个参数传递给另外一个函数，亦是可以使得一个函数返回另外一个函数。由此可以看出 JavaScript 中的函数非常灵活，**其根本原因在于 JavaScript 中的函数是一种特殊的对象**，将**JavaScript 中的函数称为一等公民(First Class Function)**。基于这样的设计，使得 JavaScript 非常容易实现一些特性，如闭包、函数式编程。

## JavaScript 中的对象是什么

​ 在前瞻中提到：在 JavaScript 中函数是一种特殊的对象，那到底特殊在哪里呢？什么是 JavaScript 中的对象呢？

​ 和其他语言不同的是，JavaScript 是一门**基于对象**(**Object-Based**)的语言，函数、数组都是 JavaScript 中的对象。并且，在这些对象运行时可以动态修改其内容。

![image-20221011170939810](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20221011170939810.png)

​ **虽然 JavaScript 是基于对象设计的**，但**它并不是传统的面向对象(OOP)的语言**，因为 OOP 语言天然支持封装、继承、多态，但 JavaScript 并没有直接提供多态的支持。除了多态，在实现继承的方面同样与传统的 OOP 语言存在着较大的差异。**JavaScript 实现继承的方式**：**只是在对象中添加了一个称为原型的属性，把继承的对象通过原型链接起来**，这就实现了继承，这种继承方式称为**基于原型链继承**。

​ 其实，JavaScript 中的对象非常简单，**每个对象就是由一组组属性和值构成的集合**，如下方代码创建了一个 person 对象：

```JavaScript
var person = new Object();
person.name = "licodeao";
person.age = 20;
person.sex = "male";
```

| 属性 | 值         |
| ---- | ---------- |
| name | "licodeao" |
| age  | 20         |
| sex  | "male"     |

表格展示了 person 对象的结构，**由多组属性和值组成，这就是 JavaScript 中的对象**。当然，**对象中属性的值可以是任意类型的数据**。

```javascript
var person = new Object();
person.name = "licodeao";
person.sex = "male";
person.info = new Object();
person.info.age = 30;
person.info.eyeColor = "blue";
person.showInfo = function () {
  console.log("showInfo");
};
```

上方代码的内存图，如下图所示：

![image-20221011174356775](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20221011174356775.png)

从图中，可以看出对象的属性值有三种类型：

- 原始类型
  - 所谓的原始类的数据，是**指值本身无法被改变**。比如，字符串就是原始类型，如果修改了字符串的值，那么**V8 引擎会返回给你一个新的字符串，而原始字符串并没有被改变**。
  - JavaScript 中的**原始类型的值**有**null、undefined、boolean、number、string、bigint、symbol 这七种**。
- 对象类型
  - **对象的属性值也可以是另外一个对象**
- 函数类型
  - **如果对象中的某个属性的属性值是一个函数，那么这个属性称为方法**

## 函数的本质

了解了对象，就能更好的理解函数了。

一直说的：在 JavaScript 中函数是一种特殊的对象，那到底特殊在哪里呢？特殊在**函数能被调用**。

函数是一种特殊的对象，**它和对象一样可以拥有属性和值**。

```javascript
function foo() {
  var test = 1;
  console.log(test);
}
// 函数的属性和值
foo.name = "foo";
foo.id = "123";

// 函数被调用
foo();
```

### V8 引擎是如何实现函数能被调用的特点呢？

> 一段很长的代码中，假设有几十个函数被调用了，那么 V8 引擎是如何知道哪些函数被调用了？
>
> 以及如何正确地执行对应的函数体中的代码呢？
>
> 能够猜到的是，V8 引擎应该是在每个函数的内部做了某些标记。

​ 实际上，V8 引擎确实对函数做了一些手脚。**在 V8 引擎内部，会为函数对象添加两个隐藏属性(name 和 code)**，如下图：

![image-20221011195207385](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20221011195207385.png)

- **隐藏属性 name 的值就是函数名称**，**如果某个函数没有设置函数名**，如下方代码：

  ```javascript
  (function () {
    var test = 1;
    console.log(test);
  })();
  ```

  那么**该函数对象的默认的 name 属性值就是 anonymous**，表示**该函数对象没有被设置名字**。

- **隐藏属性 code 的值表示函数体中的代码**，**以字符串的形式存储在内存中**。

- 当**执行到一个函数调用语句时**，V8 引擎便会**从函数对象中取出 code 属性值**，即对应的函数体代码，然后**再解释执行这段函数代码**。

## 函数是一等公民

> 语言中的函数可以和数据类型做一样的事情，则该语言中的函数称为一等公民

执行 JavaScript 函数的过程中，**为了实现变量的查找，V8 引擎会为其维护一个作用域链，如果函数中使用了某个变量，但是在函数内部又没有定义该变量，那么函数就会沿着作用域链去外部的作用域中查找该变量**。

```javascript
function foo() {
  var number = 0;
  function bar() {
    number++;
    console.log(number);
  }
  return bar;
}
var myBar = foo();
myBar();
```

在上方的代码中，在 foo 函数中定义了一个新的 bar 函数，并且 bar 函数引用了 foo 函数中的变量 number，当调用 foo 函数时，它会返回 bar 函数。那么，**"函数是一等公民"就体现在：如果要返回函数 bar 给外部(即 myBar)，那么即便 foo 函数执行结束了，其内部定义的 number 变量也不能销毁，因为 bar 函数依然引用了该变量**。

> 为什么不能销毁？

- 其一：**bar 函数依然引用了 number 变量**
- 其二：**被引用的外部变量是需要确定存在的，因为虚拟机还需要处理函数引用的外部变量**，贸然删除会导致虚拟机懵逼的。

**这种将外部变量和函数绑定起来的技术称为闭包**，关于闭包更详细的内容可以翻阅前面的文章《关于 JavaScript 闭包的理解》，看完前面的文章再看此篇，相信会对函数以及闭包会有更加偏底层的理解。

## 总结

- JavaScript 中的**对象是由多组属性和值组成的集合**
- 与传统 OOP 语言实现继承不同的是，**JavaScript 是基于原型链继承**
- JavaScript 中"**函数是一等公民**"
- V8 引擎在处理函数的"**可被调用**"特性时，会**在函数对象内部添加隐藏属性 name 和 code，name 是函数名称，code 是函数体中的代码；name 属性的默认值是 anonymous，code 所存储的值以字符串的形式存储在内存中**。
- **"函数是一等公民"体现在：返回内部函数给外部时，即便父函数执行结束，其内部定义的变量也不能销毁(因为被内部函数引用了或与内部函数产生了绑定)**

度过了一个无聊且惬意的国庆，该使劲输出了~

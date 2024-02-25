---
title: V8引擎(九)
author: Licodeao
publishDate: "2022-11-26"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - V8
tags:
  - V8
---

## 前瞻

在前面章节介绍了 V8 是如何通过作用域链来查找变量的，JavaScript 中的对象相关内容也算是告了一段落。此篇章节将会讲述 JavaScript 中的类型系统，以及 V8 是如何实现类型转换的。

## V8 是如何实现类型转换的？

```javascript
1 + "2" = ?
```

不同于其他语言，上方表达式在 JavaScript 中是成立的，相加所得结果便是字符串"12"了。这个现象是令人疑惑的，感觉不符合人的直觉。为了解决这种疑惑，不妨可以了解下什么是 JavaScript 中的类型系统(Type System)？

**什么是类型系统（Type System）？**

要想理清上面的问题，需要知道类型的概念，以及 JavaScript 操作类型的策略了。

**对于机器语言而言，所有的数据都是一堆二进制代码，CPU 处理这些数据的时候，并没有类型的概念，CPU 所做的仅仅是移动数据，如对数据进行移位，相加或相乘。**

**对于高级语言而言，都会为操作的数据赋予指定的类型，类型可以确认一个值或者一组值具有特定的意义和目的。因此，类型是高级语言中的概念，这是机器语言所没有的**。可以想象，机器语言是个冷冰冰的人，而高级语言相比之下似乎带有一点人情味。

![image-20230301134658000](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230301134658000.png)

在 C / C++中，需要为处理的每条数据指定类型：

```c
int counter = 666
float miles = 6666.0
char* name = "Licodeao"
```

定义变量后，C / C++编译器负责将这些数据片段转换为供 CPU 处理的正确命令，通常是二进制的机器代码。

在其他语言，如 Python、JavaScript 中，就不必为数据指定专门的数据类型了：

```python
counter = 666
miles = 6666.0
name = "Licodeao"
```

```javascript
let counter = 666;
let miles = 6666.0;
const name = "Licodeao";
```

**尽管 Python 和 JavaScript 定义变量的方式不同，但它们都不需要直接指定变量的类型，因为虚拟机会根据数据自动推导出类型。引入这些类型之后，编译器或者解释器就可以根据类型来限制一些有害的或者没有意义的操作了**。就像开头的表达式一样，对于 Python 而言，它觉得这个操作没有意义，而对于 JavaScript 来说，字符串和数字相加是有意义的，所以会得出一个结果。

每种语言都定义了自己的类型，还定义了如何操作这些类型，另外还定义了这些类型应该如何相互作用和相互约束，这就是类型系统。

> 维基百科是这样解释类型系统的：
>
> **在计算机科学中，类型系统（Type System）用于定义如何将编程语言中的数值和表达式归类为许多不同的类型，如何操作这些类型，以及这些类型如何互相作用。**

直观地理解，一门语言的类型系统定义了各种类型之间应该如何相互操作，如：两种不同类型相加如何处理、两种相同的类型相加又如何处理以及各种不同类型应该如何相互转换等等各种操作。因此，也可以为开头的问题解开一点眉目了，因为 JavaScript 的"类型系统"规定了两种不同类型相加是可行的，所以开发者不要觉得奇怪啦。

当有两个值相加时，V8 会严格根据 ECMAScript 规范来执行操作（ECMAScript 是一个语言标准，JavaScript 就是 ECMAScript 的一个实现），在 ECMAScript 中就定义了如何执行加法操作。具体可参考[ECMAScript 规范](https://262.ecma-international.org/5.1/#sec-11.6.1)，大概翻译如下：

> AdditiveExpression : AdditiveExpression + MultiplicativeExpression

1. 将第一个表达式 AdditiveExpression 的值赋值给左引用（lref）

2. 使用 GetValue(lref)获取左引用(lref)的计算结果，并赋值给左值(lval)

3. 使用 ReturnAbrupt(lval)获取左值，如果报错就返回错误

4. 将第二个表达式 MultiplicativeExpression 的值赋值给右引用(rref)

5. 使用 GetValue(rref)获取右引用(rref)的计算结果，并赋值给右值(rval)

6. 使用 ReturnAbrupt(rval)获取右值，如果报错就返回错误

7. 使用 ToPrimitive(lval)获取左值(lval)的计算结果，并将其赋值给左原生值(lprim)

8. 使用 ToPrimitive(rval)获取右值(rval)的计算结果，并将其赋值给右原生值(rprim)

9. 如果 Type(lprim)和 Type(rprim)中有一个是 String 类型，则：

   a. 把 ToString(lprim)的结果赋值给左字符串(lstr)

   b. 把 ToString(rprim)的结果赋值给右字符串(rstr)

   c. 返回左字符串(lstr)和右字符串(rstr)拼接的字符串

10. 把 ToNumber(lprim)的结果赋值给左数字(lnum)

11. 把 ToNumber(rprim)的结果赋值给右数字(rnum)

12. 返回左数字(lprim)和右数字(rprim)相加的数值

显而易见的是，**两种不同类型的值相加时，如果一个为 String 类型，那么最终的结果为一个字符串，这导致了另一个值的类型需要转为字符串类型，然后与 String 类型进行拼接得结果。**

**通俗地讲，V8 会提供一个 ToPrimitive 方法，其作用是将 a 和 b 转换为原生数据类型**，其实我在另一篇博客中也提到过这个方法，[详情可看这里](https://www.licodeao.top/articles/Exploration%20of%20relational%20operators.html)。转换流程如下：

- **先检测该对象是否存在 valueOf 方法，如果有就返回原始类型，那么就使用该值进行强制类型转换**
- **如果 valueOf 方法没有返回原始类型，那么就使用 toString 方法的返回值**
- **如果 valueOf 方法和 toString 方法都不返回基本类型值，便会触发一个 TypeError 的错误**

> **将对象转换为原生类型**的流程图，如下：

![image-20230301145016740](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230301145016740.png)

当 V8 执行 1+"2"时，**因为这是两个原始值相加，原始值相加时，如果其中一项是字符串，那么 V8 会默认将另外一个值也转换为字符串**，相当于执行了以下操作：

```javascript
Number(1).toString() + "2";
```

这里**把数字 1 偷偷转换为字符串"1"的过程也称为强制类型转换，这种转换是隐式的。**

再来看段代码：

```javascript
var Obj = {
  toString() {
    return "200"
  }
  valueOf() {
    return 100
  }
}
console.log(Obj + 3)
```

根据之前的描述，由于需要使用 ToPrimitive 方法将 Obj 转换为原生数据类型，而 ToPrimitive 会优先调用对象中的 valueOf 方法，由于 valueOf 方法返回 100，那么 Obj 就会被转换为数字 100，那么数字 100 加数字 3，结果当然是 103 了。

假如让 valueOf 方法和 toString 方法都返回对象，结果又如何呢？

```javascript
var Obj = {
  toString() {
    return new Object()
  }
  valueOf() {
    return new Object()
  }
}
console.log(Obj + 3)
```

结合之前的描述，是不是隐隐猜出会报错？

因为 ToPrimitive 会优先调用 valueOf 方法，发现返回的是一个对象，并不是原生类型，当 ToPrimitive 继续调用了 toString 方法时，发现 toString 方法返回的也是一个对象，都是对象，自然无法继续执行相加运算了，这时 V8 就会抛出一个异常：

> ❌Uncaught TypeError ：Cannot convert object to primitive value

提示的是类型错误，错误原因是无法将对象类型转换为原生类型。

因此，**在执行相加操作时，V8 会通过 ToPrimitive 方法将对象类型转换为原生类型，最后就是两个原生类型相加。如果其中一个值的类型是字符串时，则另一个值也需要强制转换为字符串，然后做字符串的拼接。在其他情况时，所有的值都会转换为数字类型，然后做数字的相加。**

## 总结

- **JavaScript 有自己的"类型系统"，其规定了哪些操作是可行的或有意义的。**
- **对于机器语言来说，是不存在类型这种概念的，而高级语言存在类型。**
- **ToPrimitive 方法，其作用是将 a 和 b 转换为原生数据类型。**
- **将对象转换为原生类型**的过程：
  - **先检测该对象是否存在 valueOf 方法，如果有就返回原始类型，那么就使用该值进行强制类型转换**
  - **如果 valueOf 方法没有返回原始类型，那么就使用 toString 方法的返回值**
  - **如果 valueOf 方法和 toString 方法都不返回基本类型值，便会触发一个 TypeError 的错误**
- **数字 1 偷偷转换为字符串"1"的过程也称为强制类型转换，这种转换是隐式的。**

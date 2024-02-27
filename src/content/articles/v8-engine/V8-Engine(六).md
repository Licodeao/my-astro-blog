---
title: V8引擎(六)
author: Licodeao
publishDate: "2022-10-29"
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

之前，分析了什么是 JavaScript 中的对象，以及 V8 内部是如何存储对象的，那么此篇将揭示 V8 引擎是如何实现 JavaScript 中的对象继承的。

## 基于原型的继承是如何实现的？

**什么是继承？**

简单地说，**继承就是一个对象可以访问另外一个对象中的属性和方法**，如下图：

![](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/extend.png)

因为 B 继承了 A，所以 B 就可以直接使用 A 中的 name 属性了，就好比儿子可以使用父亲的遗产、可以住进父亲所买的房子...

当然，**不同的语言实现继承的方式是不同的**，其中**最典型的两种方式**是

- **基于类的继承**
- **基于原型的继承**

**基于类的继承，提供了很多复杂的规则，以及非常多的关键字，如 class、friend、protected 等等，通过组合使用这些关键字，就可以实现继承的效果**。可预见的是，当业务复杂时，需要维护非常复杂的继承关系，从而导致代码过于臃肿和复杂。

而在 JavaScript 这门语言中，实现继承的方式与其他语言有着很大差别。**JavaScript 本身不提供一个 class 实现，尽管在 ES6 中引入了 class 关键字，但这仅仅是语法糖，和基于类的继承没有任何关系**。这也代表着，JavaScript 并没有向传统的 OOL 偏移。**JavaScript 仅仅在对象中引入了一个原型的属性，就实现了语言的继承机制**，某种意义来说，基于原型的继承没有基于类的继承那么复杂，反而显得简短与简洁。

---

**基于原型的继承到底是如何实现的？**

> 说明：\_ _ proto _ \_（这里是连着的双短横线，因为 typora 的限制，连着的短横线会造成加粗的效果，因此只能分开短横线了）

![image-20230226235556186](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230226235556186.png)

如上图，有一个对象 C，它包含了一个 type 属性，毫无疑问的是，对象 C 可以直接访问它自己的 type 属性。

**如何让对象 C 像访问自己的属性一样，访问对象 B 呢？**

在前一章中，可以发现**在 V8 的内存快照中，JavaScript 的每个对象都包含了一个隐藏属性** proto **，该隐藏属性称之为对象的原型（prototype）， \_ _ proto _ _指向了内存中的另外一个对象，我们就把 _ _ proto _ \_ 指向的对象称为该对象的原型对象，那么该对象就可以直接访问其原型对象中的属性或方法了。**

![image-20230227000947899](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227000947899.png)

上图中，让对象 C 的原型（即 \_ _ proto _ \_ ）指向了对象 B，那么依据上方的概念，对象 B 不就是对象 C 的原型对象了吗？因此，便可以利用对象 C 来访问对象 B 中的属性或方法了。

![image-20230227001442970](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227001442970.png)

上图中，当对象 C 将它的 \_ _ proto _ \_ 属性指向了对象 B 后，通过对象 C 来访问对象 B 中的 name 属性时，V8 会先从对象 C 中开始查找，没有查找到时，V8 会继续在其原型对象(即对象 B)中查找，因为对象 B 中包含了 name 属性，所以 V8 就直接返回对象 B 中的 name 属性值了。

![image-20230227002241892](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227002241892.png)

观察上图，对象 A 有个属性是 color，那么通过对象 C 去访问对象 A 中的 color 属性时，V8 会先在对象 C 中查找，没有查找到时，接着继续在对象 C 的原型对象 B 中查找，依然没有查找到时，会继续去对象 B 的原型对象 A 中查找，因为对象 A 包含了 color 属性，所以 V8 就返回了该属性值。**这种查找属性的路径称为原型链，它像一个链条一样，将几个原型链接了起来。**

## 总结

- **继承就是一个对象可以访问另外一个对象中的属性和方法**
- **实现继承的方式最典型的两种方式**
  - **基于类的继承**
  - **基于原型的继承**
- **JavaScript 仅仅在对象中引入了一个原型的属性，就实现了语言的继承机制**
- **JavaScript 的每个对象都包含了一个隐藏属性** proto **，该隐藏属性称之为对象的原型（prototype）**
- **\_ _ proto _ _指向了内存中的另外一个对象，我们就把 _ _ proto _ \_ 指向的对象称为该对象的原型对象**

关于 V8 引擎是如何实现 JavaScript 中的对象继承的，还没说完，继续看下一章...

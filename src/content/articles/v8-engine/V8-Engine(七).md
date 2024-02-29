---
title: V8引擎(七)
author: Licodeao
publishDate: "2022-11-12"
img: /assets/articles/v8.webp
img_alt: V8引擎(七)
description: |
  V8 引擎学习(七)
categories:
  - V8
tags:
  - V8
---

## 前瞻

在上一章中，了解了什么是继承，以及 JavaScript 是如何实现基于原型的继承的，并且提到了原型链。

## 基于原型的继承是如何实现的？(二)

实际上，关于继承，还有一种情况。

![image-20230227100954911](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227100954911.png)

在上图中，因为对象 D 和对象 C 的原型都指向了对象 B，对象 D 和对象 C 有同一个原型对象 B。通过对象 D 去访问对象 B 中的 name 属性或对象 A 中的 color 属性时，返回的值和使用对象 C 去访问是一样的，因为它们是同一个数据。

同时，再来回顾下继承的概念：继承就是一个对象可以访问另外一个对象的属性和方法，在 JavaScript 中，我们通过原型和原型链的方式来实现了继承特性。

至此，是否能感觉到 JavaScript 中继承的实现非常简单？就是每个对象都有一个原型属性(\_ _ proto_ \_)，该属性指向了原型对象，查找属性时，V8 会沿着原型一层一层向上查找，直到找到正确的属性为止。

理论说的多了，不妨写一段代码来看看：

```javascript
let person = {
  type: "Default",
  height: "Default",
  getInfo: function () {
    return `Type is: ${this.type}, color is ${this.height}.`;
  },
};

let jack = {
  type: "student",
  height: "1.88",
};
```

上方代码中，创建了两个对象 person 和 jack，想让 jack 对象继承自 person 对象，最直接的方式就是让 jack 对象的原型指向 person 对象，思路是这样，但如何用代码表示？

当然是将 jack 对象中的\_ _ proto_ \_属性指向 person 对象啦。

```javascript
let person = {
  type: "Default",
  height: "Default",
  getInfo: function () {
    return `Type is: ${this.type}, color is ${this.height}.`;
  },
};

let jack = {
  type: "student",
  height: "1.88",
};

jack.__proto__ = person;

console.log(jack.getInfo());
```

将原型指定完毕后，就可以使用 jack 对象来调用 person 对象中的 getInfo 方法了。

![image-20230227103059358](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227103059358.png)

扯个题外话，getInfo 中的函数的 this 指向谁？为什么？

显然，我们通过 jack 对象来调用 getInfo 方法，隐式地将 this 绑定到了 jack 对象上，但隐式绑定有一个条件是：在调用的对象中必须有一个函数的引用，通过该引用来找到函数，进而间接地将 this 绑定到该对象上。这个怎么理解？

其实，也挺好理解的。首先，V8 在 jack 对象中找是否有 getInfo 函数的引用，发现没找到，但 V8 发现了 jack 对象继承自 person 对象，进而去 person 对象中查找，终于在 person 对象中找到了 getInfo 函数的引用，并返回了该属性值。正因为 jack 对象继承自 person 对象，因此 jack 对象相当于也有了 getInfo 函数的引用，这种引用关系是通过继承加上去的，且 this 是在运行时绑定的，所以 this 指向的是 jack 对象。

或者，也可以这么理解。V8 发现在 jack 对象中没有找到 getInfo 函数的引用，但在 person 对象中发现了，同时 V8 发现了 jack 对象和 person 对象是继承关系，它们是同一类，因此默认 jack 对象也有 getInfo 函数的引用，这层引用是通过继承关系加上的，并不是凭空而来。所以，this 指向的是 jack 对象。

或者，直接大白话：一个对象调用一个方法时，V8 去该对象中找，发现没找到，没找到就要报错啊！但发现找完该对象后，还有个后门，通向了 person 对象，而在 person 对象的新世界里找到了方法的引用。这下，JavaScript 虚拟机明白了，该对象和 person 对象是父子关系啊，一家人嘛也就不计较谁是谁了，那就算该对象调用的吧~

总之，对象调用方法时，JavaScript 虚拟机在该对象中没找到方法时，是会报错的！代码永远不会骗人，有就是有，没有就是没有，如果有，肯定是该对象和其他对象有关系。

```javascript
let person = {
  type: "Default",
  height: "Default",
  getInfo: function () {
    console.log(this);
    return `Type is: ${this.type}, color is ${this.height}`;
  },
};

let jack = {
  type: "student",
  height: "1.88",
};

jack.__proto__ = person;

console.log(jack.getInfo());
```

![image-20230227110317110](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227110317110.png)

输出结果后，发现 this 指向的就是 jack 对象。

---

另外，需要注意的是：**通常隐藏属性是不能使用 JavaScript 来直接与之交互的，在实际项目中，不应该直接通过\_ _proto _ \_来访问或修改该属性**，因为：

- **这是隐藏属性，并没有被 ECMAScript 标准定义**
- **使用该属性会造成严重的性能问题**

**那么，如何正确地设置对象的原型对象呢？**

**使用构造函数来创建对象**

首先，可以创建一个 PersonFactory 函数，属性通过参数的传递，在函数体内，通过 this 设置属性值。

```javascript
function PersonFactory(type, height) {
  this.type = type;
  this.height = height;
}
```

然后，再结合关键字 new 就可以创建对象了。

```javascript
let person = new PersonFactory("Default", "Default");
```

**通过执行 new 配合一个函数，JavaScript 虚拟机会返回一个对象，并且这个对象是个空对象。**

流程实际上是这样的：

> 执行 new 配合一个函数 -> 创建了一个空对象 person -> 构造函数中的 this 指向这个空对象 -> 属性通过参数的传递赋值 ->完成

PersonFactory 是构造函数，这是需要明白的。

其次，对象中如果没有某个属性时，通过 this 对该属性进行赋值时，相当于是将该属性添加到对象上。

明白以上两点，就很好理解了：

new 创建了一个空对象 person，构造函数的 this 指向空对象，属性通过参数的传递赋值，将属性添加到空对象上，操作完成。

其实，当 V8 执行上面这段代码时，V8 会在背后悄悄地做以下几件事：

```javascript
let person = {};
person.__proto__ = PersonFactory.prototype;
PersonFactory.call(person, "Default", "Default");
```

![image-20230227114000433](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227114000433.png)

观察上图，执行流程分为了三步：

- 首先，创建了一个空白对象 person
- 然后，将 PersonFactory 的 prototype 属性设置为 person 的原型对象
- 最后，再使用 person 来调用 PersonFactory，这时，PersonFactory 函数中的 this 就指向了对象 person，然后在 PersonFactory 函数中，利用 this 对对象 person 执行属性填充操作，最终就创建了对象 person。

---

**构造函数是如何实现继承的？**

```javascript
function PersonFactory(type, height) {
  this.type = type;
  this.height = height;
  this.constant = 1;
}

let person1 = new PersonFactory("Default", "Default");
let person2 = new PersonFactory("Default", "Default");
let person3 = new PersonFactory("Default", "Default");
```

上方代码中，创建了三个 person 对象，每个对象都占用一个空间。

![image-20230227115249012](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227115249012.png)

图中可以看出，三个对象中都有 constant 属性，并且都占用了一块空间，但是这是一个通用的属性，所以没必要在每个对象中都为该属性分配一块空间，我们可以将该属性设置为公用的。如何设置呢？

在前面章节介绍函数时，提到过函数有两个隐藏属性 name 和 code，**其实函数还有另外一个隐藏属性，那就是 prototype**，刚才在说构造函数创建过程时有提到过。一个函数有以下几个隐藏属性：

![image-20230227120123529](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227120123529.png)

**每个函数对象中都会有一个公开的 prototype 属性，当你将这个函数作为构造函数来创建一个新对象时，新创建的对象的原型就会指向该函数的 prototype 属性。当然，如果只是正常调用该函数，那么 prototype 将不会起作用，仅限于用作构造函数时，才会生效。**

现在我们知道了新对象的原型指向了构造函数的 prototype 属性，当通过一个构造函数创建了多个新对象时，这几个对象的原型都指向了该函数的 prototype 属性：

![image-20230227121501386](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230227121501386.png)

这时，我们就可以将 constant 属性添加到 PersonFactory 的 prototype 属性上了。

```javascript
function PersonFactory(type, height) {
  this.type = type;
  this.height = height;
}

PersonFactory.prototype.constant = 1;

let person1 = new PersonFactory("Default", "Default");
let person2 = new PersonFactory("Default", "Default");
let person3 = new PersonFactory("Default", "Default");
```

这样，三个 person 对象的原型都指向了 PersonFactory 的 prototype 属性，并且 prototype 又包含了 constant 属性，这就是实现继承的正确方式了！🌟

---

**一段关于 new 的历史**

现在我们知道 new 关键字结合构造函数，就能生成一个对象，不过这种方式很怪异，为什么会这样呢？这就不得不了解以下 JavaScript 的历史了，其实有时候，了解了某些历史，才能真正地理解某些特性为何会出现，这样就记忆深刻了。

在 JavaScript 刚刚诞生的时代，最火的语言就是 Sun 公司的 Java，现在 Sun 公司被甲骨文收购了。单单从名字上看，可能会以为 JavaScript 和 Java 出自同一家公司或同一个人，其实没半毛钱关系哈哈。推出一门新的语言需要吸引开发者来，而当时最大的开发者群体就是 Java 程序员，因此，JavaScript 就蹭了 Java 的热度，现如今看来，蹭的非常成功~

在 Java 中，创建一个对象使用的就是关键字 new，而当时的 JavaScript 并没有使用这种方式来创建对象，为了进一步吸引 Java 开发者，便在语法层面蹭了 Java 的热点，所以 JavaScript 就被强制地加入了关键字 new。表面上看着非常相似，但背后的原理却是大相径庭的。其实，对于 JavaScript 而言，new 关键字的设计不是很合理，但是对于市场而言，对于历史而言，是非常成功的。若是没有当初这般作为，很难想象现如今 JavaScript 会被如此庞大的团体所喜欢。

## 总结

- **JavaScript 中每个对象都有一个隐藏属性** proto **，该属性直接指向了该对象的原型对象，而原型对象也有自己的 \_ _ proto _ \_属性，这些属性串联在一起就变成了原型链。**
- **不过，在 JavaScript 中并不建议直接使用** proto **属性，原因有两个**
  - **这是隐藏属性，并没有被 ECMAScript 标准定义**
  - **使用该属性会造成严重的性能问题**
- **因此，在 JavaScript 中，正确的做法是使用 new 加上构造函数这种组合来创建对象和实现对象的继承。**
- **每个函数对象都有一个公开的 prototype 属性，将这个函数作为构造函数来创建一个新对象时，新创建的对象的原型就会指向该函数的 prototype 属性。当然，如果只是正常调用该函数，那么 prototype 将不会起作用。**

---
title: 详解TypeScript装饰器(一)
author: Licodeao
publishDate: "2023-6-5"
img: /assets/articles/ts.png
img_alt: 详解TypeScript装饰器(一)
description: |
  详解 TypeScript Decorator(一)
categories:
  - TypeScript
tags:
  - TypeScript
---

## 什么是装饰器?

> 装饰器<font color="red">本质上是一个**函数**，用来**扩展类和类的成员**</font>

## 启用装饰器语法

为了能够使用装饰器语法，需要在 tsconfig.json 中将 experimentalDecorators 开启，以此来消除警告。

```ts
"experimentalDecorators": true
```

## 装饰器用法

> 因为装饰器本身是一个函数，并且它可以用来修饰类
>
> 那么，它的参数意味着什么？

```typescript
function Decorator(target: any) {
  console.log(target);
}

@Decorator
class Animal {}
```

> 这个 target 是什么？
>
> 实际上，<font color="red">这个 target 就是 class Animal，它指向类本身</font>
>
> 另外，<font color="red">target 除了指向类之外，就是类的原型了</font>。

![image-20230604180307484](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230604180307484.png)

将 ts 文件编译成 js 文件后

```javascript
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
function Decorator(target) {
  console.log(target);
}
var Animal = /** @class */ (function () {
  function Animal() {}
  Animal = __decorate([Decorator], Animal);
  return Animal;
})();
```

可以看到在<font color="red">\_\_decorate 方法中第二个参数就为 target，而其对应的值就是 Animal。</font>

那么，还有一个疑问：为什么\_\_decorate 方法可以传一个 Decorator 数组？

因为，<font color="red">**一个类可以有多个装饰器**，并且在最后通过 d 函数去处理装饰器，将结果赋值给 r，最后返回 r</font>。

再观察循环的方式，可以发现：<font color="red">**装饰器是倒序执行的**，也就是说先执行离自己最近的那个装饰器，再向上执行</font>。实际上，<font color="red">整个执行的流程有点类似于洋葱模型</font>。

> <font color="blue">扩展类的属性和原型</font>

```typescript
function Decorator(target: any) {
  target.type = "animal";
  target.getType = function () {
    return this.type;
  };

  target.prototype.eat = function () {
    console.log("eat");
  };

  target.prototype.run = function () {
    console.log("run");
  };
}

@Decorator
class Animal {}

console.log((Animal as any).getType());
```

> <font color="blue">返回子类，这个子类用于重写父类</font>

```typescript
function OverwriteAnimal(target: any) {
  return class extends target {
    eat() {
      super.eat(); // parent eat
      console.log("child eat");
    }
  };
}

@OverwriteAnimal
class Animal {
  eat() {
    console.log("parent eat");
  }
}

let animal = new Animal();
console.log(animal.eat()); // child eat
```

> <font color="blue">扩展类中的方法</font>
>
> （<font color="red">装饰器函数在修饰成员函数时一定会执行，无论有没有创建实例</font>）

```typescript
function Enum(isEum: boolean) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    // 此时target指向的是类的原型，key为方法，descriptor为属性描述器
    console.log(target, key, descriptor);
    descriptor.enumerable = isEum;

    // 进行函数增强
    let originalValue = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log("eat prev");
      originalValue.call(this, ...args);
      console.log("eat next");
    };
  };
}

class Animal {
  @Enum(true)
  eat() {
    console.log("parent eat");
  }
}

let animal = new Animal();
console.log(animal.eat());
```

![image-20230604182940317](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230604182940317.png)

> <font color="blue">扩展属性访问器</font>

```typescript
function valueToUpper(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) {
  let originalValue = descriptor.set;

  descriptor.set = function (newValue) {
    originalValue?.call(this, newValue.toUpperCase());
  };
}

class Animal {
  private _value: string = "";

  @valueToUpper
  set value(newValue: string) {
    this._value = newValue;
  }
}

let animal = new Animal();
animal.value = "hhhhh";
console.log(animal);
```

![](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/89dbd5326c08563da41f3ce9bc944b0.png)

通过这些例子，可以感知出来：

- <font color="red">如果需要在装饰器中传参的话，需要在装饰器函数外先包一层，但最终还是需要返回一个函数。</font>

## 装饰器的执行流程

```typescript
function Decorator(val: string) {
  return function (
    target: any,
    key?: string,
    descriptor?: PropertyDescriptor | number
  ) {
    console.log(val);
  };
}

@Decorator("类装饰器")
class Flow {
  constructor(@Decorator("构造函数参数装饰器") val: string) {}

  @Decorator("静态属性装饰器")
  static type = "flow";

  @Decorator("静态方法装饰器")
  static getType() {
    return this.type;
  }

  @Decorator("实例属性装饰器")
  public name!: string;

  @Decorator("实例/原型方法装饰器")
  run(@Decorator("函数参数装饰器") val: string) {}

  @Decorator("属性访问器装饰器")
  get value() {
    return "value";
  }
}
```

![](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/75113db60624925bcfb16044c869145.png)

> 一直会是这个固定的顺序吗？
>
> 不是。

倘若将静态方法装饰器和静态属性装饰器交换位置，会出现如下图：

![image-20230605141703049](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230605141703049.png)

由此可得出：<font color="red">**方法和属性之间没有顺序关系，谁先写谁先执行**</font>。

那么，根据此结论，可以将代码这样分：

```typescript
function Decorator(val: string) {
  return function (
    target: any,
    key?: string,
    descriptor?: PropertyDescriptor | number
  ) {
    console.log(val);
  };
}

// 最后执行
@Decorator("类装饰器")
class Flow {
  // 倒数第二个执行
  constructor(@Decorator("构造函数参数装饰器") val: string) {}

  // 以下两个，谁先写谁先执行
  @Decorator("静态方法装饰器")
  static getType() {
    return this.type;
  }
  @Decorator("静态属性装饰器")
  static type = "flow";

  // 以下三个，谁先写谁先执行
  @Decorator("属性访问器装饰器")
  get value() {
    return "value";
  }
  @Decorator("实例/原型方法装饰器")
  run(@Decorator("函数参数装饰器") val: string) {}
  @Decorator("实例属性装饰器")
  public name!: string;
}
```

![image-20230605142543688](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230605142543688.png)

> 这里可能会有一个疑问：明明实例/原型方法装饰器写在了函数参数装饰器之上，怎么和之前说的不一样？

其实很好理解，执行函数时肯定要先找参数，随后在执行函数体中的逻辑，来完成函数的功能。所以会先执行函数参数装饰器，再执行实例/原型方法装饰器。

但整个装饰器执行的流程不变，<font color="red">总体分为：**实例 -> 静态 -> 构造函数 -> 类**</font>。

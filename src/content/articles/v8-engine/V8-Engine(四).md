---
title: V8引擎(四)
author: Licodeao
publishDate: "2022-10-15"
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

在上一章中，我们介绍了 JavaScript 中的对象以及函数，并提到了函数调用在 V8 引擎中是如何表现的，那么 JavaScript 中的对象在 V8 引擎中是怎样的表现形式呢？

## V8 引擎实现对象存储

前一章中，了解到 JavaScript 中的对象是一组组属性和值的集合，可以通过属性找到对应的值，因此，可以将对象看作是一个字典。

然而，**V8 引擎实现对象存储时，并没有完全采用字典的存储方式**。由于**字典是非线性的数据结构**，**其查询效率不如线性的数据结构**。于是，就如 V8 引擎采取即时编译(JIT)技术一样，在对象存储方面采取了折中的策略。

## V8 引擎提升了对象属性的访问速度

- **常规属性（properties）**和**排序属性（elements）**

  > 什么是常规属性和排序属性？

  ```javascript
  function Person() {
    this["age"] = 20
    this["name"] = "licodeao"
    this["height"] = 175
    this["A"] = 'man-A'
    this[1] = 'man-1'
  }
  var boy = new Person()

  for (key in boy) {
    console.log(`indedx:${key} value:${boy[key]}`)
  }

  ================ 执行结果 ================
  indedx:1 value:man-1
  indedx:age value:20
  indedx:name value:licodeao
  indedx:height value:175
  indedx:A value:man-A
  ```

  ​ 从上方的执行结果来看，输出的属性顺序并不是原来我们设置的顺序，并且有一定规律(这个例子并不一定能得出下面某些规律，你可以多增添一些属性来观察即可)：

  1.  **设置的数字属性被最先输出出来**，**并且会按照数字大小的顺序打印出来**
  2.  **设置的字符串属性依然按照原来的顺序打印出来**

  之所以会有这样的规律，是因为在 ECMAScript 规范中定义了**数字属性应该按照索引值大小升序排列**，**字符串属性根据创建时的顺序升序排序。**这里**将对象中的数字属性称为排序属性**，在**V8 引擎中称为 elements**，**字符串属性被称为常规属性**，在**V8 引擎中称为 properties**。在 V8 引擎内部，**为了提升存储和访问的速度，分别使用了两个线性数据结构来分别保存排序属性和常规属性**。

  例如上面代码的结果如下：

  ![image-20221021215456959](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20221021215456959.png)

  ​ 如图所示，boy 对象包含了**两个隐藏属性**：**elements 属性和 properties 属性**，**elements 属性指向了 elements 对象**，**在 elements 对象中，会按照顺序存放排序属性**；**properties 属性则指向了 properties 对象，在 properties 对象中，会按照创建时的顺序存放常规属性**。如此，**当 V8 引擎执行索引操作时，会先从 elements 属性中按照顺序读取所有的元素，然后再在 properties 属性中读取所有的元素，这样就完成一次索引操作了**。

- **快属性和慢属性**

  ​ 虽然，V8 引擎使用了两个线性的数据结构来简化复杂度，**但是在查找元素时，却需要多一步操作：如执行 boy.name 整个语句时，需要先查找出 properties 属性所指向的 properties 对象，再在 properties 对象中查找属性 name，故影响了元素的查找效率**。

  ​ 基于这个原因，V8 引擎则采取了一个权衡的策略以加快查找属性的效率，即是：**将部分常规属性直接存储到对象本身**，把**这称为对象内属性(in-object properties)**。

  ​ **采用对象内属性后，常规属性就被保存到 boy 对象本身了**，于是当再次使用 boy.name 来查找 name 的属性值时，V8 引擎就可以直接从 boy 对象本身去获取该值就可以了，提升了查找效率。

  ​ 不过**对象内属性的数量是固定的，默认为 10 个**，如果**添加的属性超出了对象分配的空间，则它们将被保存在常规属性中存储了**。通常，我们**将保存在线性数据结构中的属性称之为**"**快属性**"，因为线性数据结构中只需要通过索引即可访问到属性，虽然访问速度快，但是如果从线性结构中添加或者删除大量的属性时，执行效率会非常低。因此，**如果一个对象的属性过多时，V8 引擎就会采取另外一种存储策略** - "**慢属性**"**策略**，但**慢属性的对象内部会有独立的非线性数据结构(字典)作为属性存储容器**。**所有的属性元信息不再是线性存储的，而是直接保存在属性字典中**。

## Chrome 中的内存快照

> 在 Chrome 浏览器的控制台中输入以下代码

```javascript
function Person(property_num, element_num) {
  // 添加排序属性
  for (let i = 0; i < element_num; i++) {
    this[i] = `element${i}`;
  }
  // 添加常规属性
  for (let i = 0; i < property_num; i++) {
    let property = `property${i}`;
    this[property] = property;
  }
}
var boy = new Person(10, 10);
```

> 切换到内存标签，并点击左上角圆圈生成内存快照
>
> 搜索 Person 构造函数，即可看到创建的 boy 对象了

![1](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/1.png)

> 以下为所有经过构造函数 Person 创建的对象

![2](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/2.png)

观察上图，可以发现 boy 对象有一个 elements 属性，这里就包含了我们创造的所有的排序属性，为何没有常规属性呢？

还记得前面说的对象内属性的默认个数吗？

这是因为只创建了 10 个常规属性，所以 V8 引擎将这些常规属性直接划为了 boy 对象的对象内属性了。

## 总结

- 由于 JavaScript 中的对象是一组组属性和值组成的，所以**使用一个字典来保存属性和值，但是由于字典是非线性结构，导致了读取效率很低**。
- 为了提高查找效率，V8 引擎在对象中添加了**两个隐藏属性**：**排序属性和常规属性，分别指向 elements 对象和 properties 对象，在 elements 对象中会按照顺序存放排序属性，而在 properties 对象中则按照创建时的顺序保存常规属性**。
- 为了进一步提升查找效率，V8 引擎还实现了**对象内属性(in-object properties)的策略**，**当常规属性少于默认数量(10)时，V8 引擎就会将这些常规属性直接写进对象中，超出部分则按原来的方式存储在 properties 对象中，并按照创建时的顺序存储常规属性**。
- **如果对象中的属性过多，或存在添加或删除大量属性的操作时，V8 引擎就会将线性的数据结构变为非线性的字典存储结构，降低了查找速度，提升了修改对象的属性的速度**。

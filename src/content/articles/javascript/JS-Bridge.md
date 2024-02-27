---
title: 什么是JS Bridge?
author: Licodeao
publishDate: "2023-7-16"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - JavaScript
tags:
  - JavaScript
---

最近老是在公司项目中看到各种 bridge，尤其 JS Bridge 居多。碰上不懂的问题肯定得去了解一下，本着<font style="text-decoration: line-through">好奇心害死猫</font>（热爱学习）的原则，就来探索一下什么是 JS Bridge？

## 什么是 JS Bridge?

从名字上看，JS Bridge 不就是用 JavaScript 搭建的桥吗？诶，好像有这么个意思了。但这桥连接的是哪里？肯定是用 JavaScript 无法覆盖的地方，哪些地方呢？如各种系统的 Native API。譬如 IOS、Android 系统，都无法通过 JavaScript 直接调用其 Native API，需要通过一些特定的"格式"来调用，而这些格式其实就是 JS Bridge 了。

> 什么是 JS Bridge？
>
> 由于 JavaScript 无法直接调用 Native API，需要通过一些特定的"格式"来调用，这些"格式"统称为 JS Bridge。

而在日常生活中，我们肯定使用过基于 JS Bridge 实现的功能。例如微信 JS-SDK，它能让基于微信内的网页，高效地使用拍照、选图、语音、获取位置等手机系统的能力。JS Bridge 实际上仍然是一堆 JavaScript 代码，只不过是封装了 Native API 提供的能力而已。

<img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230716160422622.png" width="100%" />

话说，微信里为什么能打开一个网页呢？微信也不是一个浏览器啊！

其实，当我们通过微信的扫一扫功能打开一个网页时，这个 H5 网页是由 WebView 来承载的。而 WebView 又是啥呢？WebView 其实是 App 里的一个组件，通过它就能像浏览器一样去展示一个网页了。经常用的 Chrome 浏览器，它实际上也可以看作是一个 App，它展示一个网页实际上也是通过 WebView 组件来实现的，为啥不叫 Chrome App 呢，因为 Chrome 的大部分功能都是与网页有关的，叫 App 反而有点不合适了。

<img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230716162207905.png" width="100%" />

观看上方的层级图，应该能明白，JavaScript 不能直接穿过 WebView 去调用微信 App 包含的功能。

<img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230716163139615.png" width="100%" />

## JS Bridge 实现的方式

- **注册全局 API**

  - 如在 window 对象上添加全局属性或注册全局事件
  - 这种方式的缺点是不合适处理异步的情况，会造成卡顿

- **URL Scheme**

  - 这种方式是如今比较成熟的方案

  - 对于在网页中请求网络资源，都会先经过 App 层中转后，再向外发出；返回资源时，仍然是先经过 App 层后，再返回给网页

  - 正是由于这个特点，App 可以自定义一些内置协议标准，如果网页发出的请求符合某个自定义的协议，便直接拦截掉并返回；当然，http 请求并不会拦截，而是保持原样处理。

    <img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230716180500040.png" width="100%" />

  - 如微信 js sdk 的 URL scheme：`weixin://dl/scan`；在 Chrome 浏览器的地址栏输入`chrome://version`可以查看版本信息，输入`chrome://dino`就能玩一个类似于跳一跳的小游戏，这些都属于 URL Scheme 的方式。

---
title: 打开一个页面，浏览器背后会做什么?🤔
author: Licodeao
publishDate: "2023-4-7"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - 浏览器工作原理
tags:
  - 浏览器工作原理
---

## 前瞻

作为一名前端 er，浏览器一定是绕不过去的。当然，这里始终以 Chrome 浏览器为例，毕竟它是浏览器界中的佼佼者，因此，研究 Chrome 就够了。

## 浏览器的单进程架构

早期，浏览器都是单进程的。顾名思义，浏览器的所有功能模块都运行在同一个进程内，这导致了当时的浏览器无法处理太多的任务，从而导致浏览器出现不稳定、崩溃的问题。

![image-20230407224314553](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230407224314553.png)

📌<font color="red">单进程的浏览器都有哪些问题呢？</font>

- <font color="blue">不稳定</font>
  - 早期浏览器需要借助插件来实现强大的功能，但如果插件出现了问题，浏览器也会随之崩溃
- <font color="blue">不流畅</font>
  - 上图中，页面渲染、页面展示、JavaScript 执行以及插件的运行都是在同一个线程中，这就意味着同一时刻只能有一个模块可以执行。
  - 但如果 JavaScript 代码中出现了无限循环的情况，它会独占一个线程，导致其他模块无法被执行，也就无法及时地处理任务，从而导致整个浏览器失去响应，变得卡顿。
  - 同样地，页面的内存泄露也是单进程变慢的一个原因。运行一个复杂点的页面再关闭页面，会存在内存不能完全回收的情况，这导致了使用时间越长，内存占用就越高，浏览器就变得越来越慢了。
- <font color="blue">不安全</font>
  - 说到不安全，也能扯上插件了。因为插件是运行在浏览器进程之中，倘若插件包含恶意的行为，那么它就会引发安全性问题。
  - 除了插件可以引发安全性问题，页面脚本也是一大因素。它可以通过浏览器的漏洞来获取系统权限，获取系统权限之后，也可以做一些恶意的事情。

## 浏览器的多进程架构

问题出现了就解决它，于是浏览器来到了多进程的时代，使得浏览器的性能得到了大幅提升。

![image-20230407225003838](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230407225003838.png)

上图为浏览器的多进程架构，与之前的单进程架构进行对比，可以发现：

- <font color="blue">网络进程和 GPU 进程从浏览器进程中独立了出来</font>
- <font color="blue">渲染进程采用了沙箱机制，而插件进程实际上也采用了沙箱机制，但部分系统不支持</font>

> ✨**总的来说**：
>
> 多进程架构下的 Chrome 浏览器包括了<font color="red">1 个浏览器主线程、1 个 GPU 进程、1 个网络进程、多个渲染进程以及多个插件进程</font>
>
> - 浏览器主线程
>   - 负责界面展示、用户交互、子进程管理等职责，同时提供存储等功能
> - 渲染进程
>   - 主要职责是将 HTML、CSS、JavaScript 转换为可以与用户进行交互的网页，排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中。默认情况下，Chrome 会为每个 Tab 标签创建一个渲染进程，而渲染进程都是运行在沙箱中的。
> - GPU 进程
>   - GPU 进程是为了实现 3D CSS，而今天[Chrome 团队也发布了 Web GPU](https://mp.weixin.qq.com/s/6o6Ci0bMEC4Y9e1Pxfi6zQ)，使得在 Web 上能够进行高性能 3D 图像和数据并行计算。
> - 网络进程
>   - 主要负责页面的网络资源加载。
> - 插件进程
>   - 主要负责插件的运行，同时插件进程也是运行在沙箱中，但并不是所有系统都适用。

---

📌<font color="red">单进程架构出现的问题，多进程架构是如何解决的呢？</font>

- 解决单进程架构的不稳定
  - <font color="blue">进程之间采用 IPC 机制进行相互通信</font>，而 Chromium IPC 是基于 Mojo 的，关于更多 Chromium IPC 可以看这篇文章[《深入分析 Chromium IPC》](https://zhuanlan.zhihu.com/p/508362483)。
  - <font color="blue">由于进程是相互隔离的，所以当一个页面或插件崩溃时，仅仅影响当前的页面进程或插件进程，并不会影响到浏览器或其他页面，从而解决了早期浏览器的不稳定问题。</font>
- 解决单进程架构的不流畅
  - <font color="blue">因为 JavaScript 代码是运行在渲染进程的，所以及时 JavaScript 代码阻塞了渲染进程，受到影响的也只是当前的渲染页面，并不会影响到浏览器和其他页面。</font>
  - 关于内存泄露的问题：<font color="blue">因为当关闭一个页面时，整个渲染进程也会被关闭，之后该进程所占用的内存都会被系统回收，从而解决了内存泄漏的问题。</font>
- 解决单进程架构的不安全
  - 多进程架构的额外好处就是可以使用<font color="blue">安全沙箱</font>
  - **<font color="lightblue">什么是沙箱呢？</font>**
    - <font color="lightblue">可以将沙箱看成是操作系统给进程上了一把锁，沙箱里面的程序可以运行，但是不能在你的硬盘上写入任何数据，也不能在敏感的地方读取任何数据。</font>
  - 在多进程架构的 Chrome 浏览器中，<font color="blue">渲染进程和插件进程都使用了安全沙箱，这样即使在渲染进程或插件进程中执行了恶意程序，恶意程序也无法突破沙箱去获取到系统权限。</font>至此，解决了单进程架构的不安全问题。

---

## 总结

那么，到这里我们就明白了，打开一个页面，浏览器在背后做了什么？

打开 1 个页面至少需要 1 个网络进程、1 个浏览器主线程、1 个 GPU 进程以及 1 个渲染进程，一共 4 个进程。倘若打开的页面有运行插件的话，还需要再加上 1 个插件进程。
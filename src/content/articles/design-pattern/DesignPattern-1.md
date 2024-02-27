---
title: 访问者模式
author: Licodeao
publishDate: "2023-7-4"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - 设计模式
tags:
  - 设计模式
---

## 什么是访问者模式?

其核心思想：当被操作的对象结构比较稳定，而操作对象的逻辑经常变化时，通过分离逻辑和对象结构，使得它们能够独立扩展。

<img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230703154019366.png" width="100%" />

于上图而言，Element 和 Visitor 分别代表了对象结构和操作逻辑，两者可以在自己的分支独立扩展和延申，最后在 Client 里面组合，并使用 visitor 来操作 element，这就是访问者模式。

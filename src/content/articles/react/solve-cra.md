---
title: 解决cra脚手架创建项目过慢的问题
author: Licodeao
publishDate: "2023-5-13"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - React
tags:
  - React
---

## 起因

每次使用 create-react-app 脚手架来创建新项目，是真的龟速啊。

表面上：wait a couple of minutes

实际上：刷了近半小时 bilibili，还停留在 install

难崩 🤣

## 解决方法

调侃的同时，也可以理解为什么速度慢，因为要拉取各种资源。按照 React 团队的设计，create-react-app 会生成一个纯客户端应用，这意味着用它创建的每个应用都包含一个空的 HTML 文件、一个带有 React 的 script 标签和应用包，问题就出现在应用包这一块。create-react-app 通过将多个工具组合在一个包中，以达到花费少量精力让所有工具协同工作。那么，在创建应用时，应用包的大小不可忽视，因此，在网速不佳的情况下，导致下载过慢。

### 换源

解决办法是 <font color="red">换源</font>

由于<font color="blue">create-react-app 指令默认调用 npm</font>，所以直接设置 npm registry 即可

```bash
# 将registry换成淘宝源
npm config set registry https://registry.npm.taobao.org
```

通过以下方式验证是否配置成功

```bash
npm config get registry
```

如果显示 https://registry.npm.taobao.org，即表示配置成功。

### 向 Vite 迁移

另外一种解决办法，或许可以向 vite 迁移，因为 vite 实在是太快啦。

使用[create vite](https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project)创建想要使用的模板，当然使用指令前，必须得 install vite 才行。

```bash
# npm 7+, extra double-dash is needed:
npm create vite@latest react-ts-app -- --template react-ts

# yarn
yarn create vite react-ts-app --template react-ts
```

更多模板与细节在[vite 的模板库](https://github.com/vitejs/vite/tree/main/packages/create-vite)

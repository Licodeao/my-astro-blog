---
title: 如何对CRA脚手架创建的React项目进行版本降级？
author: Licodeao
publishDate: "2023-11-29"
img: /assets/articles/react.webp
img_alt: 如何对CRA脚手架创建的React项目进行版本降级？
description: |
  如何对 CRA 脚手架创建的 React 项目进行版本降级？
categories:
  - React
tags:
  - React
---

## 前言

由于项目需要使用 Enzyme（爱彼迎开源的一个 React 测试类库，常与 Jest 等测试运行器搭配一起使用），但很不巧的是 Enzyme 仅仅支持 React v16，而现如今通过 CRA 脚手架创建的 React 项目的版本早已稳定在 v18 了，所以需要对 React 进行降级处理。

## 降级处理

> 先对 react、react-dom 进行降级处理

```bash
$ npm install react@16.x --legacy-peer-deps react-dom@16.x --legacy-peer-deps
```

> 如果采用了 typescript 模版，也需要对@types/xxx 的库进行处理；如果没有使用 typescript，则不用

```bash
$ npm install @types/react@16.x --legacy-peer-deps @types/react-dom@16.x --legacy-peer-deps
```

> 安装 Enzyme 及其 adapter，这里可能会出现安装失败的情况，若失败在命令后添加 `-f` 即可，强制下载

```bash
$ npm install --save-dev enzyme @types/enzyme enzyme-adapter-react-16 @types/enzyme-adapter-react-16 -D
```

> 安装完 Enzyme 后，终端可能会出现黄色的警告，建议你安装以下插件
>
> 同样地，安装过程中也可能出现失败的情况，此时也可以添加 `-f` 选项进行强制下载

```bash
$ npm install @babel/plugin-proposal-private-property-in-object -f
```

## 总结

⚠️ 都安装完了，最好删除一下 node_modules，然后再 install，防止与降级之前下载的依赖产生冲突

🔚 运行 `npm start` 命令后，发现网页运行正常，网页控制台以及终端都没有任何警告和报错。至此，降级成功！

😄 可以玩一玩 Enzyme 了～

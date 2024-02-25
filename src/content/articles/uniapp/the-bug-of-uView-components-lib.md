---
title: uView组件库引入Bug
author: Licodeao
publishDate: "2022-8-22"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Bug
tags:
  - 解决Bug
---

## 起因

今天在重写工作室小程序时，由于使用的是 uniapp 框架，所以在原有的 ColorUI 上，外加了 uView 组件库(原配一起使用当然更加顺滑 😋)

使用 Hbuilder X 导入 uView 组件库，在配置时一直报错，怀疑引入方式错了，于是根据文件目录路径，改成了下面这种方法：

```javascript
/**
*	main.js
*/
import uView from '../components/uview-v1/uview-v1.vue'
Vue.use(uView)

/**
*	uni.scss
*/
import 'theme.scss'

结果：编译成功...
```

在改完编译成功后，我尝试了几种组件，发现都有效果，于是就没有在意了...

当使用到 u-navbar 这个组件时，出现了报错并且，默认的左箭头在**is-back 为 true**的情况下，怎样都弹出不了...

然后，我就找之前用 uView 组件库写的项目找了出来，并复制了一段有用到 u-navbar 组件的代码放到此项目上，依然报错...

我左思右想，怎么会出错呢，我也跑了一遍之前的项目，发现依然有效果。

最后，我对比两个项目的 package.json 文件，查看了两个项目的 dependencies 是否一致，发现没问题。

## 解决

重装呢？

我 uninstall 了 uView 并重装了一下，并且重新按照官方文档的配置方式：

```javascript
/**
*	main.js
*/
import uView from "uview-ui"
Vue.use(uView)

/**
*	uni.scss
*/
@import 'uview-ui/theme.scss'

结果：u-navbar的使用没有问题
```

## Bug 总结

​ 重新思考了一下，当使用`import uView from '../components/uview-v1/uview-v1.vue'`引入时，去追溯源文件，会发现 uview-v1.vue 这个文件是空的，而之所以使用其他组件成功，是因为在 components 目录下已经存在大量导入的组件源码了。并且，在`import 'theme.scss'`时，文件也被找到了，因此会**误导用户以为 uView 配置完成，实际上某些组件会出现令人匪夷所思的 Bug**(如 u-navbar)。本地之前已经安装过 uView 组件库的情况下，使用 Hbuilder X 导入 uView 组件库，在配置时仍然会报错，怀疑路径遭到了污染。因此，算是踩到了一个坑：**之前本地若安装过 uView 的情况下，最好不要使用 Hbuilder X 导入 uView 组件库**。最好是，**uninstall 之前的 uView 组件库，再重新下载**，这样避免了路径遭到污染的情况，一步到位。

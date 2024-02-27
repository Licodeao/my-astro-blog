---
title: 迁移完毕
author: Licodeao
publishDate: "2022-8-25"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - 日常
tags:
  - 序章
---

Blog 已经迁移完毕了，今天续费了域名并且进行了重定向，同时也宣告着博客的迁移工作画上了句号。

## Blog 的配置

- Vuepress
- GitHub Pages
- Vuepress-reco 主题

相关配置教程，网上一大堆，搭配自动化指令食用更佳。

这一套配置可以帮助你省去服务器的成本，当然可能会失去访问速度。

## reco 主题的体验

搭建完后给我的第一感觉是非常不错的，优点与缺点都有吧，相较于之前的 Wordpress 主题：

优点：

1. 在更加专注于写作的前提下，页面保留了一丝丝美感(符合我个人心中的博客主题)
2. 支持 markdown 语法(其实更多的是 Vuepress 的功劳)
3. 可配置的插件也挺多的，博客该有的都有

缺点：

1. 文档写的不够详细，我踩坑了

## reco 主题的坑

1. 关于时间轴

   文档写的时间轴的路径为

   ```
   /docs/timeLine/README.md
   ```

   实际上为

   > 注意是.vuepress 文件的子文件

   ```
   /docs/.vuepress/timeLine/README.md
   ```

2. 关于文章的分类与标记

   reco 主题导航栏上的分类与标签，是根据你每篇 markdown 文件的**Front Matter**来增加与分类的。

   例如此篇文章的 Front Matter 为：

   ```
   title: 迁移完毕
   author: Licodeao
   publishDate: '2022-8-25'
   categories:
     - 日常
   tags:
     - 序章
   ```

   那么此时导航栏中的分类就会多出"日常"，标签中就会多出"序章"。

## 展望未来

浅浅算了一下，还有小半年，自己就将进入职场去实习了，时间好快！

后面的技术栈会偏向于 React，而不在 Vue 上了，并不是 Vue 不好。

浅浅定一个暑期实习的目标：能进字节尽量进。

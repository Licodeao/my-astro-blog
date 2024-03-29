---
title: 版本控制总结
author: Licodeao
publishDate: "2023-6-28"
img: /assets/articles/git.png
img_alt: 版本控制总结
description: |
  版本控制系统的总结
categories:
  - Git
tags:
  - Git
  - 版本控制
---

## 什么是版本控制

> 版本控制(Version Control)是维护工程蓝图的标准做法，能追踪工程蓝图从诞生一直到定案的过程。此外，版本控制也是一种软件工程技巧，借此能在软件开发的过程中，确保由不同人所编辑的同一程序文件都得到同步。(来自 [维基百科](https://zh.wikipedia.org/wiki/%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6))

版本控制工具有很多，如 CVS、SVN、Git 等

版本控制也分为两类：

- 集中式版本控制
- 分布式版本控制

## 集中式版本控制工具

- CVS
  - 早期大规模使用的就是 CVS（Concurrent Versions System），代表协作版本系统
  - 它是 SVN 的前身
- SVN
  - SVN（Subversion）
  - 目的是为了取代 CVS，并且对 CVS 进行了很多优化

## 分布式版本控制工具

> 老话常说：一个新东西的出现一定是为了解决旧事物的麻烦
>
> 那么究竟集中式版本控制工具有什么问题呢？后面会提到

首先，Git 的作者是 Linus，没错和 Linux 操作系统的名字很像，其实 Git 出现的历史原因也和 Linux 操作系统有一定关系。

早期，Linux 社区都在使用 BitKeeper 进行版本控制，但后面因为某些原因，BitKeeper 宣布收回对 Linux 社区的免费授权。这时候，大佬 Linus 看不下去了，用得好好的，干嘛突然搞个收费啊？然后，大佬就花费了一周左右的时间，推出了 Git 来取代 BitKeeper。事实证明，BitKeeper 这一步走错了，后面慢慢地在历史中淡出了大众的视野。

## 集中式与分布式的区别

- 集中式版本控制工具

  - 其主要特点是由<font color="red">单一服务器进行集中管理，保存所有文件的修订版本</font>
  - 协同开发人员<font color="red">通过客户端连接到这台服务器，取出最新的文件或者提交更新</font>

  优点：

  - 相比较以前的老式的本地存储管理方案，集中式版本控制工具可以让每个人都在一定程度上看到项目中的其他人在做什么

  缺点：

  - <font color="red">中央服务器不能出现故障</font>
    - 若出现宕机，则谁都无法提交更新，也无法协同工作
    - 若服务器的数据库所在磁盘损坏，且未做备份，则将丢失所有数据

- 分布式版本控制工具

  - 客户端并不只是提供最新版本的文件快照，而是<font color="red">把代码仓库完整地镜像下来，包括完整的历史记录</font>
  - 这样一来，任何一处协同工作用的服务器发生故障，事后都可以用任何一个镜像出来的本地仓库来恢复
  - 因为每一次的克隆操作，<font color="red">实际上都是一次对代码仓库的完整备份</font>

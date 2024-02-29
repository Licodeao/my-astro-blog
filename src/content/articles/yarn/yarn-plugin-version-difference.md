---
title: yarn&npm查询线上版本不一致
author: Licodeao
publishDate: "2023-7-6"
img: /assets/articles/yarn.png
img_alt: yarn&npm查询线上版本不一致
description: |
  yarn&npm查询线上版本不一致
categories:
  - Package-Manager
tags:
  - yarn
  - npm
---

今天在<font style="text-decoration: line-through; color: gray; text-decoration-thickness: 3px;">摸鱼</font>搬砖中，发现之前写的 babel 插件在运用时有点问题，于是在更新后便在我的笔记本上发布了。发布成功后，在公司的电脑上安装插件时，发现命令行出现的还是以前的版本，这就很奇怪了，明明都推上去了怎么还是下载的以前版本呢？

1. 首先，查看两台电脑的镜像源是否一致：

   发现其中一台电脑的镜像源为`https://registry.yarnpkg.com`，于是改成一样的镜像源，再尝试了一番，发现依然不同，其中笔记本是一直能获取到最新的版本，而公司电脑却只能查询到之前的版本。

2. 其次，查看 npm&yarn 版本是否一致”

   检查后，两台电脑 npm 版本一致，并且都能查询到最新版本；yarn 版本基本一致，一个是 v1.22.9，一个是 v1.22.14，但我认为这不是大版本更新，没啥问题，所以排除了。

3. 查看 npm&yarn 查询策略

   - npm 查询线上版本时，默认先直接从线上仓库查询，而非优先本地缓存

   - yarn 查询线上版本时，默认先从本地缓存中查询，而非线上仓库

     ```bash
     # 如果要强制从线上仓库中查询，使用以下命令
     $ yarn info <package-name> versions --no-cache
     ```

   将 yarn 的查询策略改为强制从线上仓库中查询后，依然查询不到最新版本。

4. 查看两台电脑的网络环境是否一致

   查看笔记本的网络环境：公司 WiFi + 无 VPN，公司电脑的网络环境：公司网线 + 有 VPN

   对比后，关闭公司电脑上的 VPN，再进行查询线上版本，发现可以查询到最新版本了。

造成这样问题的原因有很多，如：

- yarn 的配置不同
- 镜像源不同
- 查询策略不同
- 网络环境不同
- 是否开启了代理
- 等等...

---
title: net start mysql启动MySQL失败(无提示错误)
author: Licodeao
publishDate: "2023-6-2"
img: /assets/articles/mysql.png
img_alt: net start mysql启动MySQL失败(无提示错误)
description: |
  解决 MySQL 启动失败的问题
categories:
  - MySQL
tags:
  - MySQL
---

## 前瞻

最近，在进行 MySQL 降版本时，遇到了一个从未遇到的问题，以此记录一下。

将之前安装的 MySQL v8 版本降到 v5，从网上下载了 v5 压缩包并解压后，进行安装 v5，一切显得很丝滑。

但在 cmd 输入 net start mysql 命令后，最终会显示 mysql 启动失败，并且没有报告任何错误。

## 解决办法

这是因为根目录下没有 data 文件夹，需要输入以下命令进行数据初始化。

```bash
mysqld --initialize-insecure
```

如果 MySQL 安装根目录下出现了 data 文件夹，即表明成功。

为何 data 文件夹如此重要，因为在配置 my.ini 时，需要用到该文件路径。

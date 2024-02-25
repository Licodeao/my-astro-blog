---
title: Mac运行sh文件报错command not found
author: Licodeao
publishDate: "2023-10-22"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Mac
tags:
  - Mac
---

最近将生产力换成了 Mac OS，用着很舒服。令人头疼的是之前在 Win 本上的文件资料也需要转移到 Mac 上，没有去买硬盘，所以直接用百度网盘转移算了，正巧也是会员。其他文件转移挺顺利的，但唯独 shell 文件转移到 Mac 上后，运行出现了 `command not found`，我就很纳闷。于是，我自己又在项目里创建了一个`1.sh` 文件去测试，通过 `sh 1.sh` 命令发现可以成功输出内容。转头想了想，这个文件是我在 Mac 上刚刚创建的，不符合从 Windows 系统迁移过来的情况。于是，我问了问 gpt，它说我可能没有增加权限，`chmod +x deploy.sh` 一顿操作也无济于事。

最终原因是由于 Mac 系统下的 shell 文件的编码格式不同，需要对 Mac 系统下的文件进行转码：

```bash
# 确保当前文件具有足够的权限
$ chmod +x deploy.sh
```

```bash
# 通过 vi 打开文件
$ vi deploy.sh
```

```bash
# 在当前界面通过 set ff 查看该文件格式
# Windows平台对应的是 fileformat=dos，而Mac上需要的是 fileformat=unix
$ set ff

# 设置文件格式，最后键入 :wq 保存并退出
$ set ff=unix
```

经过以上设置，使用命令重新运行 shell 文件，发现就可以跑起来了。

---
title: Express静态服务访问错误
author: Licodeao
publishDate: "2023-6-14"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Node
tags:
  - Node
---

最近，在修改某个课程的小组大作业。

上周在进行答辩时，老师指出了系统欠缺了一个审核模块，于是，今晚在赶工进行审核模块的开发。

另外吐槽一句：虽然是小组开发的形式，其实是自己狂奶整个小组罢了，不过也没啥，天将降大任于斯人也。

由于，项目不用部署在服务器上，而审核模块又得要求管理员能够看见用户上传的图片或者 doc 文件内容，进而进行文件的驳回操作。

以上需求，可以通过开启一个静态服务来管理所有文件，或者自己写程序读取整个文件模块，然后通过接口暴露出去。

但为了方便，显然是开启一个静态服务更为便捷。

> 说句题外话：
>
> 个人感觉 Node 后端框架中 Express 和 Koa 其实是同一类，可以无痛切换，而 Nest 则是另一类。
>
> 本着以开发成本最低为选择，果断选择使用 Express 来作为开发。

说回主题，再开启静态服务后，通过以下代码来指定需要开启静态服务的目录

```javascript
const express = require("express");
const app = express();
app.use(express.static("uploads"));
```

指定后，通过 url 访问，这里是 http://localhost:3333/uploads/filename.extension

访问后，会发现页面显示 404 错误

## 解决办法

- 方式一：直接访问当前 url+存储静态服务文件夹名

  - 如 http://localhost:3333/uploads/1231312.jpg

  - ```javascript
    app.use(express.static(__dirname));
    ```

- 方式二：直接访问当前 url+存储的文件，不需要在路径中加文件夹名

  - 如 http://localhost:3333/1231312.jpg

  - ```javascript
    app.use(express.static("uploads"));
    ```

至此，图片就能显示了。也就是说，指定了文件夹，就不需要在路径中加上文件夹名了。

---
title: VS Code配置TSLint不生效的问题
author: Licodeao
publishDate: "2023-6-28"
img: /assets/articles/ts.png
img_alt: VS Code配置TSLint不生效的问题
description: |
  VS Code配置TSLint不生效的问题
categories:
  - VScode
tags:
  - VScode
  - TSLint
---

最近在进行更改一个项目时，由于是老项目，发现项目中还在使用 tslint 进行自动格式化代码，但很尴尬的是 tslint 早已被废弃了，转投 eslint 了，但项目都拉下来了，而且电脑里还是全新的 VS Code，什么插件配置都没安装。那怎么办嘛？遇到困难就去尝试解决啰~

## 解决方法

- 首要的是安装 tslint 插件

  <img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/486397993203053251.png" width="100%" />

- 然后通过`Ctrl + , `快捷键打开设置面板，搜索 Default Formatter，将其值设置为 TSLint(deprecated)

  <img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/277918476352909413.png" />

- 随后在 VS Code 右下角的 `{ }` 图标中，选择"使用工作区版本"的 TypeScript

  <img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/506315008781405659.png" width="100%" />

  <img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/120757996874422801.png" width="100%" />

- 同时，在 settings.json 文件中，添加以下配置：

  <img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/640705701755363270.png" width="100%" />

  ```json
  {
    "tslint.autoFixOnSave": true
  }
  ```

至此，关于 tslint 配置不生效的问题就能够顺利解决了。

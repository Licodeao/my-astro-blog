---
title: ts-node 错误的解决方案集合📦
author: Licodeao
publishDate: "2024-2-2"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - TypeScript
tags:
  - TypeScript
---

## 前言

本来想着用 `Node` 写点东西玩儿，写着写着发现没有 `TypeScript` 的类型提示真的好难受，于是马不停蹄地安装 `TypeScript` 一系列工具包：

```bash
$ npm install typescript ts-node @types/node --save-dev
```

再通过手动创建 `tsconfig.json` 文件，并手动指定相关选项：

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "baseUrl": "src",
    "outDir": "dist",
    "sourceMap": true,
    "noImplicitAny": true
  },
  "include": ["src/**/*"]
}
```

使用 `nodemon` 的热重载，避免手动重启：

```json
// nodemon.json
{
  "watch": ["src"],
  "ext": ".ts .js",
  "exec": "ts-node ./src/index.ts"
}
```

配置 `scripts` 命令：

```json
{
  // 省略其他部分
  "main": "index.ts",
  "type": "module",
  "scripts": {
    "start:dev": "cross-env NODE_ENV=dev nodemon"
  }
}
```

然而，在启动之后报错：

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"
```

本着 Bug 不可怕原则，就开始着手解决了，然而没想到这个错误竟然耗费了我整个下午...

即使是去搜索网上的解决方案，也依然没有解决“我”的问题。所以将解决该错误的方式总结成一篇文章，方便下次回顾 👀

## ts-node

可以看到究其原因是 `nodemon` 在执行命令时出错了，根本原因还是在 `ts-node` 没有执行成功。那么，什么是 `ts-node` 呢？

简而言之，`ts-node` 是 `Node` 环境下的 `TypeScript` 引擎和 `REPL`，它将 `TypeScript` 编译为 `JavaScript` ，并且可以在 `Node` 环境中执行 `TypeScript` ，无需任何预编译操作。由于在内部挂载了 `Node` 模块加载的 `API` ，所以可以和其他 `NodeJS` 工具无缝地使用。

更多内容可以看看[官方文档](https://typestrong.org/ts-node/docs/)。

## 解决方案

### esm

可以在使用 `ts-node` 时尝试添加 `--esm` 标签或者在 `tsconfig.json` 文件中开启 `esm` 。

> --esm 标签

在原来的 `nodemon.json` 文件中添加上 `esm` 标签：

![image-20240208144802968](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208144802968.png)

运行启动命令后：

![image-20240208144912660](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208144912660.png)

可以看到能够正常运行了。

> 在配置文件中开启 esm

我们将原来 `nodemon.json` 文件中的 `--esm` 标签删掉：

![image-20240208145046623](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208145046623.png)

转向 `tsconfig.json` 配置文件，并在该文件中开启 `esm`：

![image-20240208145147087](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208145147087.png)

运行启动命令后：

![image-20240208145347378](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208145347378.png)

可以看到依然能够正常运行，其实以上两种方式是等价的，都是同一种解决办法，只不过是两种形式而已。

`esm` 表示启用 `ES Module loader`，通过这个 `loader` 就可以将 `import` 等 `ES6` 语法与 `ts-node` 结合使用了。

开启 `ES Module loader` ，还有两种办法，其实就是通过指定 `loader` ：

- 使用 `ts-node-esm` 这个库，[点击查看](https://www.npmjs.com/package/ts-node-esm)
- 使用 `--loader` 标签，[点击查看](https://nodejs.org/docs/latest-v16.x/api/esm.html#loaders)

> 使用 ts-node-esm

我们通过以下命令来运行：

```bash
$ npx ts-node-esm src/index.ts
```

将原来在配置文件中开启 `esm` 进行删除，并保持 `nodemon.json` 和 `tsconfig.json` 和之前一样：

![image-20240208151050969](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208151050969.png)

![image-20240208151111791](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208151111791.png)

运行上方的命令：

![image-20240208151147499](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208151147499.png)

可以看到能够正常运行，使用 `npx` 命令时，如果本地没有安装指定的包，则 `npx` 会自动帮你安装并执行该包的命令。具体的查找规则：

- 当前目录下的 `node_modules/.bin` 目录
- 全局下的 `node_modules/.bin` 目录
- 以上两个地方都没找到，`npx` 就会下载该包，并将其安装在临时目录下，然后执行相应的命令。

> 这个临时目录在哪儿？

它通常是系统的临时目录，不同的系统有不同的临时目录：

- 在 `Linux` 上，临时目录是 `/tmp`
- 在 `Mac` 上，临时目录是 `/var/folders`
- 在 `Windows` 上，临时目录是 `%TEMP%` 或 `%TMP%`

由于我使用的是 `Mac` ，所以去看看临时目录里有啥，当然我们并不知道临时目录在哪儿，需要一条指令来查看临时目录的位置：

```bash
$ echo $TMPDIR # 适用于 Mac/Linux
$ echo %TEMP% # 适用于 Windows
```

执行以上命令：

![image-20240208153102582](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208153102582.png)

可以看到临时目录已经出来了，我们进入该目录看看有啥：

![image-20240208153201785](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208153201785.png)

可以看到有非常多文件，继续往下滑就能看到熟悉的身影：

![image-20240208153255131](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208153255131.png)

可以看到其中有非常多 `yarn` 开头的文件，这些文件就是通过 `npx` 命令下载的包的临时目录了，进入其中一个临时目录看看：

![image-20240208153511183](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208153511183.png)

可以看到有 `node` 和 `yarn` 两个关键词，它们表示通过 `npx yarn` 命令下载的 `yarn` 包，也就是说 `ts-node-esm` 这个包是通过 `yarn` 这个包管理工具下载的。

除了使用 `ts-node-esm` 这个包，还可以使用 `--loader` 标签。

> --loader 标签

![image-20240208154100101](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208154100101.png)

可以看到 `--loader` 标签是通过 `node` 运行的，并且指定该 `loader` 为 `ts-node/esm` 即可。

该方式下，还可以使用 `Node` 环境变量注入指定的 `loader` ：

```bash
$ NODE_OPTIONS="--loader ts-node/esm" node src/index.ts
```

看看输出：

![image-20240208161323913](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208161323913.png)

可以看到能够成功运行，当然该指令目前只能在 `Mac/Linux` 系统下或 `Git bash` 环境运行，如果你想在 `Windows` 平台上及 `CMD` 或 `PowerShell` 环境运行时，可以安装 `cross-env` 包来运行。

其实使用 `ts-node-esm` 和 `--loader` 也是等价的，只是 `ts-node-esm` 相当于是显式地使用 `--loader` 标签。

综上所述，对于开启 `esm` ，其实有四种解决办法：

- `--esm` 标签
- 在 `tsconfig.json` 文件中开启 `esm: true`
- 使用 `ts-node-esm` 工具包
- 指定 `node loader ` 为 `ts-node/esm`

### 删除 `type: module`

当 `type` 属性设置为 `module` 时，项目中的所有 `.js` 文件都被视为 `ES Modules` 。当使用 `ts-node` 时这会导致问题，因为 `ES Modules` 没有完全集成。如果删除掉 `type` 字段或将其设置为 `commonjs` ，则所有的 `.js` 文件都将被视为 `commonjs`。

将 `package.json` 文件中的 `type` 字段删除：

![image-20240208155955009](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208155955009.png)

运行启动命令：

![image-20240208160029057](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208160029057.png)

可以看到能够运行成功。当然这种解决方式不太合理，尽量不要使用这种方式。

### tsc 和 node 替代

`ts-node` 实际上就是结合了 `tsc` 和 `node` ，如果 `ts-node` 使用上述方案仍然不能够运行，可以使用 `tsc` + `node` 进行替代：

通过以下命令进行替代：

```bash
$ npx tsc --outDir dist && node dist/index.js
```

看看输出：

![image-20240208160554291](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240208160554291.png)

可以看到能够运行成功。

如果以上方案都不能解决问题，可以再仔细检查检查配置，或者干脆就不用 `TypeScript` 🤣，希望这篇文章能够帮助你。

---
title: Rust 环境配置
author: Licodeao
publishDate: "2023-9-4"
img: /assets/articles/rust.png
img_alt: Rust 环境配置
description: |
  Rust 环境配置
categories:
  - Rust
tags:
  - Rust
---

作为一个前端 er，初次了解 Rust 还是在字节推出 Rspack 的时候。在此之前，从未学习过可以直接与系统进行交互的编程语言，一开始接触编程即是通过 JavaScript 上手。学习 Rust，也是为了补齐编程生涯的一块空白，毕竟作为一个程序员没有与计算机底层交互过，某种意义上来说是否算是一种遗憾呢。All In Rust ～

Rust 是一门静态强类型编程语言，也就是编译器必须在编译期间知道所有变量的类型，对于前端 er 来说，如果有了解 TypeScript，那能够感受到一点亲切感，但是 Rust 与 TypeScript 的类型检测的底层不太一样。Rust 的语法类似于 C++，所以初次写 Rust 代码可能会非常不适应，但任何语言都是一样的，只有语言能够调教你，而你不能去调教语言:D，主打一个自适应。不得不说的是，Rust 的学习曲线比较陡峭，但再硬的骨头也是能够啃下来的，毕竟教员曾经说过一句话：办法总比困难多。Rust 与前端还是有很多相似之处，Rust 有类型检测机制、包管理工具、项目依赖文件等等，前端社区中有关 Rust 的身影越来越多，相信 Rust 能够在前端中大放异彩。

安装 Rust 的教程网上非常多，这里就引用其中的一篇[安装教程](https://course.rs/first-try/installation.html)。

安装完成后，需要检查 Rust 是否安装成功：

```bash
# 注意都是大写
$ rustc -V
$ cargo -V
```

在安装 Rust 的同时，也会在本地安装一个文档服务，方便离线阅读

```bash
# 通过浏览器打开本地文档
$ rustup doc
```

## 为什么要用 Rust ？

Rust 可以用来替换 C/C++，Rust 和它们具有相同的性能，但是很多常见的 bug 都能在编译时被消灭。

Rust 是一种通用的编程语言，但是它更善于以下场景：

- 需要运行时的速度，高性能
- 需要内存安全
- 需要更好地利用多处理器，高并发

## 新建项目

```bash
$ cargo new project_name
```

Rust 项目主要分为两种：

- bin：可运行项目
- lib：依赖库项目

### 查看项目结构

```bash
# 通过该命令展示项目结构
$ tree
```

```
.
 .git
 .gitignore
 Cargo.toml
 src
  main.rs
```

## 运行项目

### cargo run

```bash
$ cargo run
```

`cargo run` 实际上<font color="red">等同于手动编译和运行项目</font>这个两个命令，<font color="red">默认运行 `debug` 模式</font>，这种模式下会产生很多 debug 输出，如果不想要这么多输出，可以使用 `--release` 参数使用生产发布的模式。

### 手动编译和运行项目

通过 `cargo build` 命令进行手动编译

```bash
$ cargo build
```

运行编译后的文件，如 `./target/debug/hello_world`

```bash
$ ./target/debug/hello_world
```

## 验证代码正确性

在项目越来越大时，使用 `cargo run` 和 `cargo build` 命令变得慢，`cargo check` 呼之欲出

```bash
# 快速检查代码是否能编译通过（该命令速度非常快）
$ cargo check
```

## Cargo 核心文件

`Cargo.toml` 和 `Cargo.lock` 是 Cargo 的核心文件

### Cargo.toml

`Cargo.toml` 是 Cargo 的<font color="red">项目数据描述文件</font>，其<font color="red">存储了项目的所有元配置信息</font>。

### Cargo.lock

`Cargo.lock` 是 Cargo 根据项目的 `toml` 文件生成的项目依赖详细清单

> 基于前面说的 Rust 项目主要分为 bin 项目和 lib 项目，那什么时候该上传 `Cargo.lock` 文件呢？

- 当项目是 bin 项目（可运行项目）时，需要将 `Cargo.lock` 文件上传到 Git 仓库中
- 当项目是 lib 项目（依赖库项目）时，不需要将 `Cargo.lock` 文件上传到 Git 仓库中，即将该文件添加到 `.gitignore` 文件中

## 配置镜像源

> 官方的镜像源 <a href="https://crates.io/">crates.io</a>

<font color="red">事实上，翻墙工具默认开启的仅仅是浏览器的翻墙代理，对于命令行或者软件中的访问，并不会代理流量，因此这些访问还是通过正常网络进行的，自然会失败。</font>

由于官方镜像源地址是在国外的，难免出现下载依赖缓慢的问题，为了解决这个问题可以使用以下两种：

- 新增镜像地址（不推荐，项目过大时，修改依赖版本很麻烦）

- 覆盖默认的镜像地址（推荐）

  在环境变量配置的 toml 文件中 `$HOME/.cargo/config.toml` 添加以下内容

  > 这个 toml 文件的意思是：
  >
  > 首先创建一个新的镜像源 `[source.ustc]` , 然后将默认的 `crates.io` 镜像源替换成 `ustc`

  ```toml
   [source.crates-io]
   replace-with = "ustc"

   [source.ustc]
   registry = "git://mirrors.ustc.edu.cn/crates.io-index"
  ```

---
title: Nginx(一)
author: Licodeao
publishDate: "2022-9-22"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Nginx
tags:
  - Nginx
---

## 初识 Nginx

### 三个主要应用场景

![image-20220922183543177](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20220922183543177.png)

#### 静态资源服务

- 通过**本地文件系统**提供服务

#### 反向代理服务

- **缓存**
- **负载均衡**

#### API 服务

- **OpenResty**

## Nginx 的主要优点

- **高并发、高性能**
  - 相较于 Apache 一个连接对应一个进程而言，Nginx 在一定条件下可以达到数千万的并发连接
- **可扩展性好**
  - 基于 Nginx 的模块化设计，使得其第三方生态圈丰富；OpenResty 基于 Nginx 又生成了一套新的生态圈
- **高可靠性**
  - Nginx 可以在服务器上不间断地运行数年
- **热部署**
  - 在不停止服务的情况下，能够升级 Nginx
- **BSD 许可证**
  - 可以在商业用途中使用 Nginx

## Nginx 的组成

> 将 Nginx 想象成一辆汽车

- 汽车本身 - **Nginx 二进制可执行文件**
  - 由各模块源码编译出的一个文件
- 驾驶员 - **Nginx.conf 配置文件**
  - **控制 Nginx 的行为**
- 轨迹 - **access.log 访问日志**
  - 记录每一条 Nginx 处理过的 http 请求信息
- 黑匣子 - **error.log 错误日志**
  - 定位出现的错误

## Nginx 配置语法

- 配置文件**由指令与指令块构成**
- 每条指令**以；分号结尾**，**指令与参数间以空格符号分隔**
- 指令块以 { } 大括号将多条指令组织在一起
- **include 语句允许组合多个配置文件以提升可维护性**
- 使用 **# 符号添加注释**，提高可读性
- 使用 **$ 符号使用变量**
- 部分指令的参数支持正则表达式

### 配置参数

#### 时间的单位

ms(毫秒)、s(秒)、m(秒)、h(小时)、d(天)、w(周)、M(月)、y(年)

#### 空间的单位

- 不加任何单位时，**默认为 bytes**
- k/K - 千字节
- m/M - 兆字节
- g/G - 千兆字节

### http 配置的指令块

- http：由 http 模块解析指令块内的指令
- **server：域名**
- **upstream**：**与上游服务(tomcat 等)进行通讯**
- **location: url 表达式**

## Nginx 命令行

> **格式：nginx 基本指令 指令中的参数**
>
> 如 nginx -s reload

- 帮助：-? / -h
- 使用指定的配置文件：-c
  - 默认情况下，编译出的 nginx 会去寻找 conf 中的配置
- 指定配置指令：-g
- 指定运行目录：-p
- 发送信号：-s
  - **stop**：**立刻停止服务**
  - **quit**：**优雅地停止服务**
  - **reload**：**重载配置文件**
  - **reopen**：**重新开始记录日志文件**
- 测试配置文件是否有语法错误：-t / -T
- 打印 nginx 的版本信息、编译信息等：-v / -V

## 如何搭建一个可用的静态资源 Web 服务器

```nginx
server {
  # 监听端口
  listen 8080;
  # 域名
  server_name licodeao.top;
  # 日志文件
  access_log logs/access.log main;
  # url
  location / {
    # 这里不使用root，是因为root会将url中的一些路径代入到文件目录中
    alias dlib/;
    # 将文件目录映射到url上(这样就可以在url上访问文件目录中的路径了)
    autoindex on;
    # 设置限制访问速率(适用于高并发场景)
    set $limit_rate 1k;
    index index.html index.htm;
  }
}
```

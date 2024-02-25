---
title: 如何保证页面文件能被完整地送达浏览器?🛫
author: Licodeao
publishDate: "2023-4-12"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - 浏览器工作原理
tags:
  - 浏览器工作原理
---

## 前瞻

在网络中，一个文件通常会被拆分为很多数据包来进行传输，而数据包在传输过程中可能会出现丢失或者出错的情况。

那么如何保证页面文件能被完整地送达浏览器呢？

使用<font color="red">TCP 协议</font>

## 什么是 FP？

> <font color="red">FP（First Paint），指从页面加载到首次开始绘制的时长</font>

更快的页面响应意味着更多的 PV（Page View）、更高的参与度，以及更高的转化率。

那么，什么又影响 FP 指标呢？

- 其中一个重要的因素是：<font color="red">网络加载速度</font>

通过优化网络加载速度，降低了 FP 指标，进而提升 Web 页面性能。

## 数据包如何被完整地送达到应用程序？

我们都知道，<font color="red">数据是通过数据包来传输的。如果发送的数据很大，那么该数据就会被拆分为很多小数据包来传输</font>。

而<font color="red">数据包被送达到应用程序需要经过以下阶段</font>：

> <font color="blue">通过 IP，将数据包发送到目标主机</font>
>
> ​ 👇
>
> <font color="blue">通过 UDP，将数据包发送到指定的应用程序中</font>
>
> ​ 👇
>
> <font color="blue">通过 TCP，保证了数据完整地传输</font>

### IP

> <font color="red">什么是 IP 呢？</font>
>
> - <font color="red">网际协议（Internet Protocol），简称 IP</font>
> - <font color="red">计算机的地址就称为 IP 地址，访问任何网站实际上只是你的计算机向另外一台计算机请求信息</font>

数据包在互联网上进行传输时，就要符合网际协议标准，同时，互联网上不同的在线设备都有唯一的地址。

如果想要把一个数据包从主机 A 发送到主机 B，那么在传输之前，数据包上会被附加上主机 B 的 IP 地址信息，这样在传输的过程中才能正确地寻找到主机 B。另外，数据包上也会有主机 A 本身的 IP 地址信息，有了这些信息，主机 B 才会向主机 A 进行回复。这些信息会被装进 IP 头，而<font color="blue">IP 头是 IP 数据包开头的信息，包含了 IP 版本、源 IP 地址、目标 IP 地址、生存时间等信息。</font>

![image-20230412234051901](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230412234051901.png)

> 传输的过程：
>
> - 上层将数据包传输给网络层
> - <font color="blue">网络层再将 IP 头附加到数据包上，组成新的 IP 数据包</font>，并传递给下一层
> - 底层通过网络再将数据包传递给主机 B
> - 数据包被传输到主机 B 的网络层，这时主机 B 拆开数据包的 IP 头信息，解析出数据部分并传输给上层
> - 最终，数据包到达了主机 B 的上层

### UDP

> <font color="red">什么是 UDP 呢？</font>
>
> - <font color="red">用户数据包协议（User Datagram Protocol），简称 UDP</font>

IP 协议是非常底层的协议，只负责将数据包传输到对方主机，而对方主机并不知道将数据包交给哪个程序。因此，需要能和应用程序进行对话的协议，最常见的就是 UDP 协议了。

UDP 协议中，有一个最重要的信息是端口号，每个想访问网络的程序都需要绑定一个端口号。通过端口号，UDP 就能把指定的数据包发送给指定的应用程序了。所以，<font color="red">IP 通过 IP 地址信息把数据包发送给指定的主机，而 UDP 则通过端口号将数据包分发给正确的应用程序</font>。同样，端口号会被装进 UDP 头里面，UDP 头再和原始的数据包进行合并组成新的 UDP 数据包。UDP 头中除了目标端口，还有源端口号等信息。

![image-20230413003859926](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230413003859926.png)

> 传输的过程：
>
> - 上层将数据包传输给传输层
> - <font color="blue">传输层会在数据包前面附加上 UDP 头，组成新的 UDP 数据包，再将新的 UDP 数据包传输给网络层</font>
> - <font color="blue">网络层再将 IP 头附加到数据包上，组成新的 IP 数据包，并传输给下一层</font>
> - 数据包被传输到主机 B 的网络层，在这里主机 B 拆开 IP 头信息，并将拆开来的数据部分交给传输层
> - 在主机 B 的传输层中，数据包的 UDP 头会被拆开，并根据 UDP 头中所提供的端口号，将数据部分传递给指定的应用程序
> - 最终，数据包被传送到了主机 B 的应用程序中

在使用 UDP 协议发送数据时，可能会出现各种因素导致的错误，进而导致数据包发送失败。虽然 UDP 可以校验数据是否正确，但<font color="red">对于错误的数据包，UDP 协议并不具备重发机制，只是丢弃当前的包，而且 UDP 在发送数据包之后也无法确认数据包是否能够到达目的地</font>。

虽然 UDP 协议不能保证数据可靠性，但是其<font color="red">传输速度还是非常快的</font>，因此，UDP 协议会应用在一些注重传输速度、但对数据完整性要求不严格的场景，如在线视频等。

### TCP

> <font color="red">什么是 TCP 呢？</font>
>
> - <font color="red">传输控制协议（Transmission Control Protocol），简称 TCP。</font>
> - TCP 协议是一种<font color="red">面向连接的、可靠的、基于字节流</font>的<font color="red">传输层通信协议</font>

在使用 UDP 协议进行传输数据时，会存在两个问题：

- 数据包在传输过程中容易丢失
- 在大文件会被拆分成很多小的数据包来传输时，这些小的数据包会经过不同的路由，到达接收端的时间也各不相同，并且 UDP 协议并不知道如何封装这些数据包，然后把这些数据包还原成原来完整的文件。

相对于 UDP 协议，TCP 协议具有以下特点：

- <font color="red">对于数据包丢失的情况，TCP 提供重传机制</font>
- <font color="red">TCP 引入了数据包排序机制，用来保证把乱序的数据包组合成一个完整的文件</font>

和 UDP 头一样，<font color="blue">TCP 头除了包含了目标端口和本机端口外，还提供了用于排序的序列号，以便接收端通过序号来重排数据包</font>。

![image-20230413004024219](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230413004024219.png)

> <font color="red">TCP 是如何保证重排机制和数据包排序机制呢？</font>

![image-20230413091858167](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230413091858167.png)

> <font color="red">一个完整的 TCP 连接的生命周期</font>：
>
> <font color="red">建立连接 👉 传输数据 👉 断开连接</font>

- 建立连接阶段
  - 该阶段<font color="blue">通过"三次握手"来建立客户端和服务器的连接</font>，TCP 是一种面向连接的传输层协议，所谓的<font color="blue">面向连接是指，在数据通信开始之前，先做好两端之间的准备工作</font>。所谓的<font color="blue">三次握手是指，在建立一个 TCP 连接时，客户端和服务器之间需要发送 3 个数据包以确认连接的建立</font>。
- 传输数据阶段
  - 该阶段，<font color="blue">接收端需要对每个数据包进行确认操作</font>，也就是<font color="blue">接收端接收到数据之后，需要发送确认数据包给发送端</font>。所以<font color="blue">当发送端发送了一个数据包之后，在规定时间内没有接收到接收端的反馈的确认信息，则判断为数据包丢失，并触发发送端的重发机制</font>。
  - 同样，<font color="blue">一个大的文件在传输过程中会被拆分成多个小的数据包，这些数据包到达接收端之后，接收端会按照 TCP 头中的序号为其排序，从而保证文件数据的完整性</font>。
- 断开连接阶段
  - 数据传输完毕后，就要断开连接了。而在最后，需要<font color="blue">通过"四次挥手"来保证双方都能断开连接</font>。
- 浏览整个生命周期，可以看出：<font color="red">TCP 为了保证数据传输的可靠性，牺牲了数据包的传输速度，因为"三次握手"和"数据包校验机制"等在传输过程中增加了大量的数据包</font>。

## 总结

- 互联网中的数据都是通过数据包来传输的，而数据包在传输过程中容易丢失或出错
- IP 负责将数据包发送到目标主机
- UDP 负责将数据包发送到具体的目标应用程序
- TCP 负责保证传输数据的完整性，其连接的生命周期可分为三个阶段：建立连接、传输数据、断开连接

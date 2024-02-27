---
title: JSON Web Token Error
author: Licodeao
publishDate: "2023-6-7"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - OpenSSL
tags:
  - OpenSSL
  - RSA
  - JWT
---

今天在写登录逻辑时，出现了一个错误：

```
Error: secretOrPrivateKey has a minimum key size of 2048 bits for RS256
```

这个错误通常是由于使用了长度小于 2048 位的 RSA 密钥而导致的。在使用 RS256 签名算法时，JWT 规范建议使用长度为 2048 位或更长的密钥来提供足够的安全性。

然后，就用以下命令创建了一个私钥

```shell
openssl genrsa -out private.key 2048
```

生成私钥后，发现用于解密的公钥并没有

于是，傻乎乎地用以下命令去生成了一个公钥（注意：以下命令是错误的 ❌）

```shell
openssl genrsa -out public.key 2048
```

然后，又去走了一遍验证 token 的流程，发现还是返回错误。

---

事后，我发现其实上面生成公钥的命令，其实就是生成了一个私钥，只是在输出文件时，将文件名换成了 public.key 而已 😓

## 解决办法

正确的做法应该是：

使用以下命令来生成私钥：

```shell
# 用于生成长度为 2048 位的 RSA 私钥，并将其保存到名为 private.key 的文件中
openssl genrsa -out public.key 2048
```

注意：在私钥所在目录下，使用以下命令来生成公钥：

当然，如果非要将公钥放在另一个地方，那应该将对应的私钥所在目录的路径放入命令中。

```shell
# 使用 openssl rsa 命令和 -pubout 选项来从私钥中提取公钥，并将其保存到名为 public.key 的文件中
openssl rsa -in private.key -pubout -out public.key
```

公钥生成后，再去走一遍验证 token 的流程，发现就可以走通了。

之前 JWT 的逻辑没少做，只是最近后端摸的少了，思路比较生了，忘了这些细的点，这才造成了这样的错误。

最近，会将后端慢慢的捡起来，成长为真正的全栈开发者~

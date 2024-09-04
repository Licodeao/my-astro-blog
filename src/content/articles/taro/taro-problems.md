---
title: Taro 踩坑日记
author: Licodeao
publishDate: "2024-9-4"
img: /assets/articles/taro.png
img_alt: Taro 开发
description: |
  记录用 Taro 开发微信小程序所遇到的坑
categories:
  - Taro
tags:
  - Taro
---

# 初始化

1.`npm install @tarojs/cli -g` 这个命令会直接下载 taro v4 版本，而 taro-ui 等其他组件库只支持 taro v3，导致你使用不了组件库。

2.如果你将 taro cli 降为 v3 版本，生成项目成功，此时你的 node 版本恰好为 17+，那么恭喜你将会遇到这个错误：

```
Error: error:0308010C:digital envelope routines::unsupported
```

这个错误说是，由于 node 17+版本的 Open SSL 限制，Taro v3 无法在高版本的环境下无法正常运行。你去查询该错误的解决办法，会看到这个解决办法：

```js
// 命令行设置环境变量 NODE_OPTIONS
export NODE_OPTIONS=-openssl-legacy-provider
```

没屁用，后果就是让 node 也无法使用了：

```
node: -openssl-legacy-provider is not allowed in NODE_OPTIONS
```

然后你就不得不，通过以下命令清空 `NODE_OPTIONS`

```bash
$ set NODE_OPTIONS=
```

注意 ⚠️：在命令行清空后，此时 node 依然运行不了。==还得重新启动一次编译器才行==

所以，目前使用 taro 进行开发时，面临两种情况：

- taro v4，无法使用 taro 相关的组件库，其只能适配 taro v3；并且 v4 版本的热重载也有点问题，无法实时监听文件的改动，必须手动操作
- taro v3，注意将 node 版本降为 17-

# 组件库

推荐 [Taroify](https://taroify.github.io/taroify.com/quickstart/) 作为 Taro 组件库。为啥不推荐 `Taro-ui` ？因为我被其 `Checkbox` 组件恶心到了，太臃肿了。当然这得看业务是否匹配，因为我认为大多数复选框的情况，只需要用到圆点，而非像 `Taro-ui` 一样用于列表展示的情况。综上所述，`Taroify` 是个使用起来简单且轻量的组件库，没那么大的心智负担；而用 `Taro-ui` 就要考虑的更多了... 简单来说，用 `Taroify` 由简入奢，体验良好；但是用 `Taro-ui` 由奢入俭，得看你能不能受得了它的折磨了 😄

在使用 `Taroify` 组件库开发省市区级联选择功能时，又遇到了个坑：

- `Taro` v3.4.14
- `Taroify` v0.4.0-alpha.0
- `@vant/area-data` v1.5.2

![image-20240904222915222](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904222915222.png)

![image-20240904222940564](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904222940564.png)

依据文档所说的做，会是如下结果：

<video src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/iShot_2024-09-04_22.32.26.mp4" autoplay controls>

我们将数据打印出来看看：

![image-20240904223545994](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904223545994.png)

视频中所显示的数据恰好为 value，而我们需要的是 text。在官方 GitHub 的[使用指南](https://github.com/youzan/vant/tree/main/packages/vant-area-data)上，可以看到，用到 `Cascader` 组件时，需要用 hook 获取到数据。

![image-20240904223838317](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904223838317.png)

很不幸，仍然无法解决问题。我们再观察，`Taroify` 官网上 `Cascader` 组件的示例代码，可以发现：

![image-20240904224126630](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224126630.png)

这里的字段明明是 `label` ！ 本着试一试的心态，我们将 `dept` 数据放到代码里试一试。

<video src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/iShot_2024-09-04_22.42.47.mp4" autoplay controls>

发现竟然可行，这就证明了 `Cascader` 组件实际需要的是 `label` 字段，而非 `text`。那只好去修改源码了...

![image-20240904224556838](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224556838.png)

![image-20240904224617872](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224617872.png)

我们只需要将这几个地方的 `text` 改成 `label` 就可以了。

![image-20240904224719072](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224719072.png)

![image-20240904224732529](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224732529.png)

最后，看看效果：

<video src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/iShot_2024-09-04_22.48.49.mp4" autoplay controls>

成功解决！😯 开发进行中，后续碰到坑，会持续更新本文......

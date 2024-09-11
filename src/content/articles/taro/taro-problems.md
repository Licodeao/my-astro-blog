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

在使用 `Taroify` 组件库开发省市区级联选择功能时，又遇到了个坑（开发紧张，就不提 PR 了，本来想提个 issue 的，但是发现这个小问题，被 issue 规范挡住了。如果您能在本地复现该 bug，欢迎您给 @vant 提 PR。）：

- `Taro` v3.4.14
- `Taroify` v0.4.0-alpha.0
- `@vant/area-data` v1.5.2

![image-20240904222915222](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904222915222.png)

![image-20240904222940564](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904222940564.png)

依据文档所说的做，会是如下结果：

<video src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/iShot_2024-09-04_22.32.26.mp4" autoplay controls></video>

我们将数据打印出来看看：

![image-20240904223545994](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904223545994.png)

视频中所显示的数据恰好为 value，而我们需要的是 text。在官方 GitHub 的[使用指南](https://github.com/youzan/vant/tree/main/packages/vant-area-data)上，可以看到，用到 `Cascader` 组件时，需要用 hook 获取到数据。

![image-20240904223838317](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904223838317.png)

很不幸，仍然无法解决问题。我们再观察，`Taroify` 官网上 `Cascader` 组件的示例代码，可以发现：

![image-20240904224126630](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224126630.png)

这里的字段明明是 `label` ！ 本着试一试的心态，我们将 `dept` 数据放到代码里试一试。

<video src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/iShot_2024-09-04_22.42.47.mp4" autoplay controls></video>

发现竟然可行，这就证明了 `Cascader` 组件实际需要的是 `label` 字段，而非 `text`。那只好去修改源码了...

![image-20240904224556838](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224556838.png)

![image-20240904224617872](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224617872.png)

我们只需要将这几个地方的 `text` 改成 `label` 就可以了。

![image-20240904224719072](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224719072.png)

![image-20240904224732529](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240904224732529.png)

最后，看看效果：

<video src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/iShot_2024-09-04_22.48.49.mp4" autoplay controls></video>
成功解决！😯

# 引入 Redux 报错

在安装完 `Redux` 后，编译运行后微信开发者工具会报以下错误：

```
Uncaught TypeError: Cannot read properties of undefined (reading 'isBatchingLegacy')
```

解决方法就是将 `react` 相关包升级到 v18 版本，并且注意 `@tarojs/**` 系列包的版本需要一致。

解决完后的 `package.json` 如下：

```json
{
  "resolutions": {
    "@types/react": "18.0.0"
  },
  "dependencies": {
    "@babel/runtime": "^7.7.7",
    "@reduxjs/toolkit": "^1.9.0",
    "@taroify/core": "^0.4.0-alpha.0",
    "@tarojs/components": "3.5.7",
    "@tarojs/plugin-framework-react": "3.5.7",
    "@tarojs/react": "3.5.7",
    "@tarojs/runtime": "3.5.7",
    "@tarojs/taro": "3.5.7",
    "@types/react-dom": "18.0.0",
    "@vant/area-data": "^1.5.2",
    "classnames": "^2.5.1",
    "react": "18.0.0",
    "react-dom": "18.0.0",
    "react-redux": "^8.0.5",
    "taro-ui": "^3.3.0"
  },
  "devDependencies": {
    "@babel/core": "^7.8.0",
    "@tarojs/mini-runner": "3.5.7",
    "@tarojs/webpack-runner": "3.5.7",
    "@types/react": "18.0.0",
    "@types/webpack-env": "^1.13.6",
    "@typescript-eslint/eslint-plugin": "^5.20.0",
    "@typescript-eslint/parser": "^5.20.0",
    "babel-plugin-import": "^1.13.8",
    "babel-preset-taro": "3.4.14",
    "eslint": "^8.12.0",
    "eslint-config-taro": "3.4.14",
    "eslint-plugin-import": "^2.12.0",
    "eslint-plugin-react": "^7.8.2",
    "eslint-plugin-react-hooks": "^4.2.0",
    "stylelint": "^14.4.0",
    "typescript": "^4.1.0"
  }
}
```

# 网络请求

在 `Taro` 开发中，发起网络请求时，不能直接使用封装的 `axios` 。这会导致编译器中没有报错，但是在微信开发者工具中出现类似以下错误：

```
TypeError: Cannot read property 'prototype' of undefined
```

且这个报错指向 `axios` ，因此使用 `Taro` 开发中不能直接使用 `axios` 。

下面是个 `Taro` 中简单的网络请求封装：

```ts
import Taro from "@tarojs/taro";

export const BASE_URL = "xxx";
const TIMEOUT = 10000;

class LiRequest {
  request(options: {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    data?: object;
    header?: object;
    query?: object;
  }) {
    return new Promise((resolve, reject) => {
      // 处理查询参数
      let queryString = "";
      if (options.query) {
        queryString = Object.keys(options.query)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                options.query![key]
              )}`
          )
          .join("&");
      }

      Taro.request({
        url: `${BASE_URL}${options.url}${queryString ? `?${queryString}` : ""}`,
        timeout: TIMEOUT,
        method: options.method || "GET",
        data: options.data || {},
        header: options.header || {
          "content-type": "application/json",
        },
        success: (res: any) => {
          if (res.data.code === 602) {
            reject(new Error("登录过期"));
          } else {
            resolve(res.data);
          }
        },
        fail: reject,
      });
    }).catch((e) => {
      if (e.message === "登录过期") {
        Taro.showModal({
          title: "登录过期",
          content: "您的登录已过期，请重新登录！",
          showCancel: false,
          success: (modalRes) => {
            if (modalRes.confirm) {
              Taro.removeStorageSync("token");
              Taro.removeStorageSync("userInfo");
              Taro.getApp().token = null;
              Taro.getApp().userInfo = null;
              Taro.reLaunch({
                url: "/pages/me/index",
              });
            }
          },
        });
      } else {
        throw e;
      }
    });
  }

  get(url, query) {
    return this.request({ url, method: "GET", query });
  }

  post(url, data) {
    return this.request({ url, method: "POST", data });
  }
}

export default new LiRequest();
```

# 缓存读取不了

![image-20240911203005802](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240911203005802.png)

`Taro` 开发微信小程序时，有时候会读取不了存在本地的数据。我以为只是 `Taro` 的问题，查了一圈发现，就是使用原生开发微信小程序也存在这个问题...

所以无奈下，只能去适配这种情况，<font color="red">将需要存储的数据分别在缓存、全局变量、状态管理库中，存储一遍</font>，在后续使用时，再依次读取并判断。

```ts
// 针对于全局变量，需要在 app 入口组件中设置(app.js/app.tsx)
// 设置全局数据
taroGlobalData = {
  token: "",
  userInfo: {},
};

// example 用于存储用户信息
export async function getUserInfoSync(token) {
  // Taro 使用React 时，获取全局变量通过 getApp 方法
  let app = Taro.getApp();

  // 优先使用缓存数据
  let cacheUserInfo = Taro.getStorageSync("userInfo") || app.userInfo || {};
  // 注意空对象在隐式转换为布尔值时，会转为true，所以判断条件需要多一点
  if (
    Object.keys(cacheUserInfo).length !== 0 &&
    typeof cacheUserInfo === "object" &&
    cacheUserInfo !== null
  ) {
    app.userInfo = cacheUserInfo;
    Taro.setStorageSync("userInfo", cacheUserInfo);
    return {
      code: 200,
      userInfo: cacheUserInfo,
      message: "缓存中存在userInfo",
    };
  }

  // 缓存中不存在userInfo，再请求接口，并缓存数据
  let res: any = await LiRequest.request({
    url: "/getWxUserInfo",
    method: "GET",
    header: {
      Authorization: token,
    },
  });
  let requestUserInfo = res.code === 200 ? res.user : {};
  res.code !== 200 && console.log("获取用户信息失败!");
  app.userInfo = requestUserInfo;
  Taro.setStorageSync("userInfo", requestUserInfo);

  return {
    code: res.code,
    userInfo: requestUserInfo,
    message: res.code === 200 ? "重新请求获取userInfo成功" : "获取用户信息失败",
  };
}
```

开发进行中，后续碰到坑，会持续更新本文......

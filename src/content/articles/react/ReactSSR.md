---
title: 从零开始搭建React SSR
author: Licodeao
publishDate: "2023-1-8"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - React
  - Next
  - Node
tags:
  - React
  - SSR
  - Next
  - Node
---

## 前瞻

为了方便理解服务端渲染的原理，开始从零搭建一套简易的 React SSR。

需要用到的技术栈：

- React 全家桶，基于最新的 React18.2.0 版本
- Node Express 框架

此次，并没有集成 TypeScript，是因为 TypeScript 的作用与 SSR 原理并没有啥关系。

## 从零开始搭建

### Node Server 搭建

> 需要安装的依赖项：
>
> - npm i express（后端服务，这里以 express 为例子）
> - npm i -D nodemon（启动 Node 程序时监听文件的变化，变化即刷新）
> - npm i -D webpack webpack-cli webpack-node-externals（webpack-node-externals：排除掉 node_modules 中所有的模块，该库只针对于 node 环境，web 环境是不需要的）

express 服务：

```javascript
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send(`Hello Node Server!`);
});

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
```

webpack 配置（你可以将该文件命名为 server.config.js，方便之后引入客户端配置好区分）：

```javascript
const path = require("path");
const nodeExternals = require("webpack-node-externals");
module.exports = {
  target: "node",
  mode: "development",
  entry: "./src/server/index.js",
  output: {
    filename: "server_bundle.js",
    path: path.resolve(__dirname, "../build/server"),
  },
  externals: [nodeExternals()],
};
```

文件树：

![image-20230128155655089](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128155655089.png)

### React 搭建

> 需要安装的依赖项：
>
> - npm i react react-dom
> - npm i -D webpack-merge
> - npm i -D babel-loader @babel/preset-react @babel/preset-env

App 组件：

```jsx
import React, { useState } from "react";

const App = () => {
  const [counter, setCounter] = useState(0);

  function add() {
    setCounter(counter + 1);
  }

  return (
    <div>
      <h2>App</h2>
      <div>{counter}</div>
      <button onClick={add}>+1</button>
    </div>
  );
};

export default App;
```

express 服务更新为：

> **ReactDOMServer 对象允许你将组件渲染成静态标记，通常，它被使用在 Node 服务端上**
>
> ```javascript
> // ES modules
> import * as ReactDOMServer from "react-dom/server";
> // CommonJS
> var ReactDOMServer = require("react-dom/server");
> ```

```javascript
const express = require("express");
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../app.jsx";
const app = express();

app.get("/", (req, res) => {
  // 这里就是服务端渲染 => 生成的是静态页面
  const AppHtmlString = ReactDOMServer.renderToString(<App />);
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div id="root">
          ${AppHtmlString}
        </div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
```

webpack 配置更新为：

```javascript
const path = require("path");
const nodeExternals = require("webpack-node-externals");
module.exports = {
  target: "node",
  mode: "development",
  entry: "./src/server/index.js",
  output: {
    filename: "server_bundle.js",
    path: path.resolve(__dirname, "../build/server"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"],
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".wasm", ".jsx"],
  },
  externals: [nodeExternals()],
};
```

> 如果在以上步骤中出现以下报错：
>
> - const AppHtmlString = ReactDOMServer.renderToString(<App />);
>   ^
>   SyntaxError: Unexpected token '<'
> - Error: Cannot find module '@babel/core'
> - babel-loader@9 requires Babel 7.12+ (the package '@babel/core'). If you'd like to use Babel 6.x ('babel-core'), you should install 'babel-loader@7'.
> - **原因是因为缺少了@babel/core 这个包，导致解析不了 jsx 语法**
> - **解法办法：npm install @babel/core --save**

文件树：

![image-20230128160043014](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128160043014.png)

效果：

![image-20230128160057910](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128160057910.png)

![image-20230128160107520](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128160107520.png)

​ 至此，服务端渲染已完成，但此时页面并不具备交互性，因为渲染成的页面是个静态页面，还需要进行 hydration 水合！

### Hydration 搭建

> 此步骤将使静态页面具备交互性，从而实现完整的 SSR。

创建客户端，并进行 Hydration

```javascript
// client/index.js

import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "../app";

ReactDOMClient.hydrateRoot(document.getElementById("root"), <App />);
```

express 服务更新为：

```javascript
const express = require("express");
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../app.jsx";
const app = express();

// 部署打包好的静态资源
app.use(express.static("build"));

app.get("/", (req, res) => {
  // 这里就是服务端渲染
  const AppHtmlString = ReactDOMServer.renderToString(<App />);
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div id="root">
          ${AppHtmlString}
        </div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
```

创建属于客户端的 webpack 配置：

```javascript
// client.config.js

const path = require("path");
module.exports = {
  target: "web",
  mode: "development",
  entry: "./src/client/index.js",
  output: {
    filename: "client_bundle.js",
    path: path.resolve(__dirname, "../build/client"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"],
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".wasm", ".jsx"],
  },
};
```

文件树：

![image-20230128160339461](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128160339461.png)

效果：

> 访问部署好的静态资源

![image-20230128160406013](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128160406013.png)

之后，再引入打包好的 App 实例，express 服务更新为：

```javascript
const express = require("express");
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../app.jsx";
const app = express();

// 部署打包好的静态资源
app.use(express.static("build"));

app.get("/", (req, res) => {
  // 这里就是服务端渲染
  const AppHtmlString = ReactDOMServer.renderToString(<App />);
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
      	// 注意：这里不能有空格（即换行），否则会报错
        <div id="root">${AppHtmlString}</div>
        // 这里其实就是Hydration
        <script src="/client/client_bundle.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
```

> 值得注意的是：上方 body 中的 root 部分不能有空格（即换行），否则会报错

![image-20230128160637127](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128160637127.png)

效果：

![image-20230128160708350](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128160708350.png)

至此，Hydration 的工作就完成了，此时页面具有了交互性。

### Router 搭建

> 需要安装的依赖项：
>
> - npm i react-router-dom --save（默认会自动安装 react-router）
>
> **注意：路由在客户端及服务端都要配置！**

使用 webpack-merge 进行合并配置，config 更新为：

```javascript
// base.config.js

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"],
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".wasm", ".jsx"],
  },
};
```

```javascript
// client.config.js

const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./base.config");
module.exports = merge(baseConfig, {
  target: "web",
  entry: "./src/client/index.js",
  output: {
    filename: "client_bundle.js",
    path: path.resolve(__dirname, "../build/client"),
  },
});
```

```javascript
// webpack.config.js（实际上就是server.config.js，只不过我没这样子命名）

const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { merge } = require("webpack-merge");
const baseConfig = require("./base.config");
module.exports = merge(baseConfig, {
  target: "node",
  entry: "./src/server/index.js",
  output: {
    filename: "server_bundle.js",
    path: path.resolve(__dirname, "../build/server"),
  },
  externals: [nodeExternals()],
});
```

路由配置文件：

```javascript
import Home from "../views/home";
import Mine from "../views/Mine";
import React from "react";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/mine",
    element: <Mine />,
  },
];

export default routes;
```

客户端路由配置：

```jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "../app";

ReactDOMClient.hydrateRoot(
  document.getElementById("root"),
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

服务端路由配置：

```javascript
const express = require("express");
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../app.jsx";
const app = express();

// 部署打包好的静态资源
app.use(express.static("build"));

// 注意这里的路径要改，否则不能匹配到/mine，就会报错404！
app.get("/*", (req, res) => {
  // 这里就是服务端渲染
  const AppHtmlString = ReactDOMServer.renderToString(
    // 指定服务器端渲染的是哪个页面
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
  );
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div id="root">${AppHtmlString}</div>
        <script src="/client/client_bundle.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
```

App 路由配置：

```jsx
import React, { useState } from "react";
import { Link, useRoutes } from "react-router-dom";
import routes from "./router";

const App = () => {
  const [counter, setCounter] = useState(0);

  function add() {
    setCounter(counter + 1);
  }

  return (
    <div>
      <h2>App</h2>
      <div>{counter}</div>
      <button onClick={add}>+1</button>
      {useRoutes(routes)}
      <div>
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/mine">
          <button>Mine</button>
        </Link>
      </div>
    </div>
  );
};

export default App;
```

文件树：

![image-20230128161257378](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128161257378.png)

效果：

![image-20230128161309650](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128161309650.png)

![image-20230128161318782](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128161318782.png)

![image-20230128161327085](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128161327085.png)

至此，Router 搭建完成。

### Redux 搭建

> 需要的依赖项：
>
> - npm i react-redux @reduxjs/toolkit

创建 store 以及 home 切片

```javascript
// store/index.js

import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./modules/home";

const store = configureStore({
  reducer: {
    home: homeReducer,
  },
});

export default store;
```

```javascript
// store/modules/home.js

import { createSlice } from "@reduxjs/toolkit";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    counter: 100,
  },
  reducers: {
    changeCounterAction(state, { payload }) {
      state.counter += payload;
    },
  },
});

export const { changeCounterAction } = homeSlice.actions;
export default homeSlice.reducer;
```

客户端配置 store：

```jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "../app";
import { Provider } from "react-redux";
import store from "../store/index";

ReactDOMClient.hydrateRoot(
  document.getElementById("root"),
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
```

服务端配置 store：

```javascript
const express = require("express");
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../app.jsx";
import { Provider } from "react-redux";
import store from "../store/index";
const app = express();

// 部署打包好的静态资源
app.use(express.static("build"));

app.get("/*", (req, res) => {
  // 这里就是服务端渲染
  const AppHtmlString = ReactDOMServer.renderToString(
    // 指定服务器端渲染的是哪个页面
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  );
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div id="root">${AppHtmlString}</div>
        <script src="/client/client_bundle.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
```

页面展示数据：

```jsx
// views/home.jsx

import React from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { changeCounterAction } from "../store/modules/home";

const Home = () => {
  const dispatch = useDispatch();
  const { counter } = useSelector(
    (state) => ({
      counter: state.home.counter,
    }),
    shallowEqual
  );

  function handleCounterClick() {
    dispatch(changeCounterAction(10));
  }

  return (
    <div>
      <h2>Home</h2>
      <h3>{counter}</h3>
      <button onClick={handleCounterClick}>+10</button>
    </div>
  );
};

export default Home;
```

```jsx
// views/mine.jsx

import React from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { changeCounterAction } from "../store/modules/home";

const Mine = () => {
  const dispatch = useDispatch();
  const { counter } = useSelector(
    (state) => ({
      counter: state.home.counter,
    }),
    shallowEqual
  );

  function handleCounterClick() {
    dispatch(changeCounterAction(20));
  }
  return (
    <div>
      <h2>Mine</h2>
      <h3>{counter}</h3>
      <button onClick={handleCounterClick}>+20</button>
    </div>
  );
};

export default Mine;
```

文件树：

![image-20230128161602600](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128161602600.png)

效果：

![image-20230128161613622](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128161613622.png)

![image-20230128161621376](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230128161621376.png)

> 关于异步 action，即 createAsyncThunk API 的使用和原来在 React 项目中是一样的，这里就没有演示了。

至此，Redux 的搭建已完成，并且已经成功搭建了一个简易的 React SSR 了。

## 总结

在 React 中创建 SSR 应用时，需要**调用 ReactDOM.hydrateRoot 函数（client 中调用）**

- **hydrateRoot：创建水合 Root，是在激活的模式下渲染 App**
- **服务器端可以用 ReactDOM.renderToString 来进行渲染静态页面**
- **路由需要在客户端和服务器端都配置，并且 API 是不同的**

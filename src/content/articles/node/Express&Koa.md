---
title: Express与Koa的比较及源码解读
author: Licodeao
publishDate: "2022-11-5"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Node
tags:
  - Node
---

## 前瞻

Express 框架和 Koa 框架都出自于同一个团队，可以说 Koa 框架是 Express 框架的衍生但有别于 Express 框架，因为 Koa 框架的核心代码仅有 1600+行，且由 TJ 大佬在维护。**从架构设计上来说，Express 是完整和强大的，在其中帮助我们内置了很多好用的功能；而 Koa 则是简洁和自由的，毕竟核心代码只有 1600+行，完全称得上轻量级，它只包含最核心的功能，并不会对我们使用其他中间件进行任何的限制。两个框架的核心其实都是中间件，但两者的中间件执行机制是不同的，特别是针对某个中间件包含异步操作时**，接下来会详细说说~

## Express 与 Koa 的比较

### 创建服务器

```javascript
// Express框架
const express = require("express");
const app = express();
app.listen(1234, (req, res, next) => {
  console.log("Express server has running at http://localhost:1234");
});

// Koa框架
const Koa = require("koa");
const app = new Koa();
app.listen(1235, (ctx, next) => {
  console.log("Koa server has running at http://localhost:1235");
});
```

### 静态资源服务器

- Express 框架

  > Express 内置了 static 方法实现托管静态资源

  ```javascript
  // 通过添加路径前缀，统一访问public目录中的静态文件
  app.use("/public", express.static("public"));
  ```

- Koa 框架

  > Koa 实现托管静态资源需使用第三方库：koa-static

  ```javascript
  const Koa = require("koa");
  const static = require("koa-static");
  const app = new Koa();

  // 处理静态资源
  app.use(static("./build"));
  ```

### 创建中间件

> **中间件的本质就是一个回调函数**

- Express 框架

  - 请求对象（request 对象）

  - 响应对象（response 对象）

  - next 函数（用于执行下一个中间件的函数）

    ```javascript
    app.use((req, res, next) => {
      console.log("这是Express中的中间件~");
    });
    ```

- Koa 框架

  - 上下文对象

    - **Koa 将请求对象和响应对象封装在了上下文对象中了**
    - 获取请求对象：ctx.request
    - 获取响应对象：ctx.response

  - next 函数

    - 在 Koa 中，**next 本质上是 dispatch 函数（源码中体现）**，其作用与 Express 框架中的 next 函数类似

    ```javascript
    app.use((ctx, next) => {
      console.log("这是Koa中的中间件~");
    });
    ```

- **Koa 没有提供 methods 方式来注册中间件，也没有提供 path 中间件来匹配路径，同样也没有连续注册中间件的方式**；而 Express 拥有这些方式

  ```javascript
  // Express所独有的特点
  // methods方式注册中间件
  app.get("url", (req, res, next) => {
    res.end("methods方式注册中间件");
  });

  // path中间件匹配路径
  app.post("/user", (req, res, next) => {
    res.end("path中间件匹配路径");
  });

  // 连续注册中间件
  app.get(
    "/home",
    (req, res, next) => {
      console.log("home path and method middleware 01");
      next();
    },
    (req, res, next) => {
      console.log("home path and method middleware 02");
      next();
    },
    (req, res, next) => {
      console.log("home path and method middleware 03");
      next();
    },
    (req, res, next) => {
      console.log("home path and method middleware 04");
      res.end("home middleware end");
    }
  );
  ```

### 路由

- Express 框架

  > Express 可以自动处理路径和 method 的匹配问题，如果两者同时匹配成功，则 Express 会将这次请求，转交给对应的中间件处理

  ```javascript
  // 匹配GET请求，且请求url为 /
  app.get("/", (req, res, next) => {
    res.end("Hello Express~");
  });
  ```

  > 模块化路由

  ```javascript
  const express = require("express");
  const userRouter = express.Router();

  userRouter.get("/", (req, res, next) => {
    res.end("获取用户列表成功~");
  });

  userRouter.post("/", (req, res, next) => {
    res.end("创建用户成功~");
  });

  userRouter.delete("/", (req, res, next) => {
    res.end("删除用户成功~");
  });

  app.use("/users", userRouter);
  ```

- Koa 框架

  > Koa 不能自动处理路径和 method 的匹配问题，但可以根据 request 自己来判断或使用第三方路由中间件（koa-router）

  - 根据 request 自己来判断

    ```javascript
    app.use((ctx, next) => {
      if (ctx.request.url === "/users") {
        if (ctx.response.method === "POST") {
          ctx.response.body = "Create User Success";
        } else {
          ctx.response.body = "Users List";
        }
      } else {
        ctx.response.body = "Other Request";
      }
    });
    ```

  - 使用第三方路由中间件

    > 模块化路由

    ```javascript
    const Router = require("koa-router");
    // 创建路由实例，定义当前路由统一前缀
    const router = new Router({ prefix: "/users" });

    router.put("/", (ctx, next) => {
      ctx.response.body = "put request";
    });

    module.exports = router;

    // 主文件中
    const userRouter = require("./router/user");
    app.use(userRouter.routes());
    app.use(userRouter.allowedMethods());
    ```

    注意：**allowedMethods 方法用于判断一个 method 是否支持，如果我们请求一些未实现的请求，就会自动报错：Method Not Allowed**

### 参数解析

- Express 框架

  - 获取 URL 中携带的**查询参数**

    请求地址：http://localhost:8000/user?name=zs&age=20

    ```javascript
    app.get("/user", (req, res, next) => {
      // req.query 默认是一个空对象
      console.log(req.query);
    });
    ```

  - 获取 URL 中的**动态参数**

    请求地址：http://localhost:8000/user/216

    ```javascript
    app.get("/user/:id", (req, res, next) => {
      // req.params 默认是一个空对象，里面存放着通过冒号动态匹配到的参数值
      console.log(req.params.id);
    });
    ```

  - 解析 JSON 格式的数据

    > 内置中间件 express.json()

    ```javascript
    app.use(express.json());

    app.use((req, res, next) => {
      if (req.headers["content-type"] === "application/json") {
        req.on("data", (data) => {
          const info = JSON.parse(data.toString());
          // 通过req.body将数据传递给下一个中间件
          req.body = info;
        });
        req.on("end", () => {
          next();
        });
      } else {
        next();
      }
    });
    ```

  - 解析 URL-encoded 格式的数据

    - **true**：**使用第三方库(qs)进行解析**
    - **false**：**使用 Node 内置模块(querystring)进行解析**

    ```javascript
    // 配置解析 application/x-www-form-urlencoded 格式数据的内置中间件
    // 解析urlencoded格式的数据时，需要添加extended属性表明使用哪个模块进行解析
    app.use(express.urlencoded({ extended: true }));
    ```

  - 解析 form-data 格式的数据

    > 需要用到**multer**这个第三方库

    ```javascript
    const multer = require('multer')

    =========== 解析非文件类型 ===========
    const upload = multer()
    // any()解析非文件类型数据
    app.use(upload.any())

    =========== 解析文件类型 ===========
    const upload = multer({
      // 文件存放位置
      dest: './uploads/'
    })
    // upload.single('key') -> 上传单个文件，并将数据的key传递给single函数
    app.post('/upload', upload.single('file'), (req, res, next) => {
      res.end("文件上传成功~")
    })

    ======== 使用diskStorage自定义文件名 ========
    const path = require('path')
    const storage = multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, './uploads/')
      },
      filename: (req, res, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
      }
    })
    const upload = multer({
      storage
    })
    app.post('/upload', upload.single('file'), (req, res, next) => {
      res.end("文件上传成功~")
    })
    ```

- Koa 框架

  - 获取 URL 中携带的**查询参数**

    请求地址：http://locahost:8000/login?username=licodeao&password=123

    ```javascript
    app.use((ctx, next) => {
      console.log(ctx.request.query);
      ctx.body = "Hello Koa";
    });
    ```

  - 获取 URL 中的**动态参数**

    请求地址：http://localhost:8000/users/123

    ```javascript
    const userRouter = new Router({ prefix: "/users" });

    // 获取params，使用路由可以自动解析
    userRouter.get("/:id", (ctx, next) => {
      console.log(ctx.params.id);
      ctx.body = "Hello Koa";
    });
    ```

  - 解析 JSON 格式的数据

    > 需要使用第三方库 koa-bodyparser

    请求地址：http://localhost:8000/login

    ```javascript
    // body是json格式
    {
      "username": "licodeao",
      "password": "123"
    }

    const bodyParser = require('koa-bodyparser')

    app.use(bodyParser())
    app.use((ctx, next) => {
      // 解析后的数据被放在了request中
      console.log(ctx.request.body)
      ctx.body = "Hello koa"
    })
    ```

  - 解析 URL-encoded 格式的数据

    请求地址：http://localhost:8000/login

    > body 是 x-www-form-urlencoded 格式
    >
    > 获取数据和 json 一样，安装 koa-bodyparser

  - 解析 form-data 格式的数据

    > 需要使用 koa-multer 第三方库

    ```javascript
    const multer = require("koa-multer");
    const upload = multer();
    app.use(upload.any());

    app.use((ctx, next) => {
      // 注意解析的数据被放在了req中，而不是request（与json不一样）！！！
      console.log(ctx.req.body);
      ctx.body = "Hello Koa";
    });
    ```

  - 文件上传

    ```javascript
    const Koa = require("Koa");
    const path = require("path");
    const multer = require("koa-multer");
    const Router = require("koa-router");

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads/");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

    const upload = multer({
      storage,
    });

    const fileRouter = new Router({ prefix: "/upload" });
    fileRouter.post("/", upload.single("avatar"), (ctx, next) => {
      // 解析数据在req中
      console.log(ctx.req.file);
      ctx.response.body = "上传成功~";
    });
    ```

### 错误处理

- Express 框架

  ```javascript
  // 错误级别的中间件必须注册在所有路由之后!
  app.use((err, req, res, next) => {
    // 在服务器打印错误消息
    console.log("发生了错误:" + err.message);
    // 向客户端响应错误相关的内容
    res.send("Error!" + err.message);
  });
  ```

- Koa 框架

  ```javascript
  const Koa = require("koa");

  const app = new Koa();

  app.use((ctx, next) => {
    // 通过ctx.app.emit()发出错误事件
    ctx.app.emit("error", new Error("还没有登录嗷~"), ctx);
  });

  // 监听错误事件
  app.on("error", (err, next) => {
    // 错误信息在err.message中
    console.log(err.message);
    ctx.response.body = err.message;
  });

  app.listen(8000, () => {
    console.log("错误处理服务器启动成功~");
  });
  ```

## 源码分析

### Express 框架

- **调用 express()到底创建的是什么**

  > 调用 express()实际上是调用了 createApplication 函数

  ```javascript
  // 源码
  exports = module.exports = createApplication;

  // express()实际上是调用了该函数
  function createApplication() {
    var app = function (req, res, next) {
      app.handle(req, res, next);
    };

    mixin(app, EventEmitter.prototype, false);
    mixin(app, proto, false);

    // 封装了request
    app.request = Object.create(req, {
      app: { configurable: true, enumerable: true, writable: true, value: app },
    });
    // 封装了response
    app.response = Object.create(res, {
      app: { configurable: true, enumerable: true, writable: true, value: app },
    });

    app.init();
    return app;
  }

  // 启动服务器
  app.listen = function listen() {
    // this就是app对象
    var server = http.createServer(this);
    return server.listen.apply(server, arguments);
  };
  ```

- **use 注册一个中间件**

  > 无论是 app.use 还是 app.methods 都会注册一个**主路由**
  >
  > **app 本质上会将所有的函数交给整个主路由来处理**

  ```javascript
  // 源码
  app.use = function use(fn) {
    var offset = 0
    var path = '/'
    ......
    // 扁平化处理
    var fns = flatten(slice.call(arguments, offset))
    // 注册一个主路由
    this.lazyrouter()
    var router = this._router
    // 不断去查找中间件
    fns.forEach(function(fn) {
      // 无app被创建时
      if (!fn || !fn.handle || !fn.set) {
        return router.use(path, fn)
      }
      ......
      router.use(path, function mounted_app(req, res, next){ ... })
    })
  }

  // use函数中
  var layer = new Layer(path, {
      sensitive: this.caseSensitive,
      strict: false,
      end: false
  }, fn)
  layer.route = undefined
  // 加入调用栈中
  this.stack.push(layer)
  ```

- **一个请求过来，从哪里开始处理**

  > **从 app 函数被调用开始**

  ```javascript
  // 上面观察到createApplication函数中有app.handle方法

  app.handle = function (req, res, callback) {
    var router = this._router;
    // 最终handle
    var done =
      callback ||
      finalhandler(req, res, {
        env: this.get("env"),
        onerror: logger.bind(this),
      });
    // 没有路由时
    if (!router) {
      debug("no routes defined on app");
      done();
      return;
    }
    // 开始匹配路由和方法，并处理请求
    router.handle(req, res, done);
  };
  ```

- **router.handle 中做了什么事情**

  ```javascript
  proto.handle = function handle(req, res, out) {
    var self = this
    ......
    // 取出stack
    var stack = self.stack;
    ......
  }

  // 在handle的next方法中，不断查询是否匹配，如果匹配，就离开调用栈并执行该next方法所对应的中间件
  while(match !== true && idx < stack.length) {
    ......
    // 查看是否匹配
    if (match !== true) {
      continue;
    }
    ......
  }
  ```

### Koa 框架

- **require('koa')，导出的是什么**

  > 导出的是 Application 这个类
  >
  > const Koa = require('koa')
  >
  > 这也是为什么在创建实例时需要大写

  ```javascript
  // 源码
  module.exports = class Application extends Emitter {
    constructor(options) {
      super();
      options = options || {};
      this.proxy = options.proxy || false;
      this.subdomainOffset = options.subdomainOffset || 2;
      this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
      this.maxIpsCount = options.maxIpsCount || 0;
      this.env = options.env || process.env.NODE_ENV || 'development';
      if (options.keys) {
        this.keys = options.keys
      }
      // 中间件数据
      this.middleware = []
      // 创建请求上下文
      this.context = Object.create(context)
      this.request = Object.create(request)
      this.response = Object.create(response)
      ...
    }
  }
  ```

- **Koa 中如何开启监听？**

  ```javascript
  // 同样是封装了listen方法
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback())
    return server.listen(...args);
  }
  ```

- **Koa 如何注册中间件？**

  ```javascript
  // use函数注册中间件
  use(fn) {
    // 判断是否为函数
    if (typeof fn !== 'function') {
      throw new TypeError('middleware muse be a function!')
    }
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3...')
      fn = convert(fn)
    }
    debug('use %s', fn._name || fn.name || '-');
    // 推入中间件数组中，处于待执行状态
    this.middleware.push(fn);
    return this;
  }
  ```

- **监听回调**

  ```javascript
  // const server = http.createServer(this.callback())
  		↑
  callback() {
    // 处理后的中间件，返回的是个Promise
    const fn = compose(this.middleware);
    // 错误处理
    if (!this.listenerCount('error')) {
       this.on('error', this.onerror)
    }
    // 闭包
    const handleRequest = (req, res) => {
      // 创建请求上下文
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    }
    return handleRequest;
  }
  ```

- **handleRequest 方法**

  ```javascript
  // 处理请求
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    // 这里意味着: 等所有中间件运行完后，才会响应结果
    // 同样注意：这里的结果是个Promise
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
  ```

- **compose 方法**

  ```javascript
  function compose(middleware) {
    // 判断middleware是否为数组，如果不是则抛出异常
    if (!Array.isArray(middleware)) {
      throw new TypeError("Middleware stack must be an array!");
    }
    // middleware的原生如果不是函数，则抛出异常
    for (const fn of middleware) {
      if (typeof fn !== "function") {
        throw new TypeError("Middleware must be composed of functions!");
      }
    }
    // 返回值
    return function (context, next) {
      let index = -1;
      return dispatch(0);
      // 执行中间件的函数
      function dispatch(i) {
        if (i <= index)
          return Promise.reject(new Error("next() called multiple times"));
        index = i;
        let fn = middleware[i];
        if (i == middleware.length) fn = next;
        if (!fn) return Promise.resolve();
        try {
          // dispatch.bind(null, i + 1)相当于是next函数
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));

          // 相当于是以下代码
          Promise.resolve(
            (async (ctx, next) => {
              console.log("执行中间件");
              await Promise.resolve(fn(context, dispatch.bind(null, i + 1)))();
              next();
              console.log("中间件next之后代码");
            })(context, dispatch.bind(null, i + 1))
          );
        } catch (err) {
          return Promise.reject(err);
        }
      }
    };
  }
  ```

### 中间件的执行顺序

> 对于**某个中间件包含异步操作**时，Express 框架和 Koa 框架的机制是不一样的

假设有三个中间件会在一次请求中匹配到，并且按照顺序执行

希望实现的结果是：

- 在 middleware1 中，在 req.message 中添加一个字符串 aaa
- 在 middleware2 中，在 req.message 中添加一个字符串 bbb
- 在 middleware3 中，在 req.message 中添加一个字符串 ccc
- 当所有的内容添加结束后，在 middleware1 中，通过 res 返回最终的结果

> Express 同步数据的实现

![image-20221031183802223](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20221031183802223.png)

```javascript
const express = require("express");

const app = express();

const middleware1 = (req, res, next) => {
  req.message = "aaa";
  // 这里去执行下一个中间件，只有当所有中间件执行完成时，才会执行下一步，这里返回的结果将会是所有中间件累加的结果(对于这个需求来说)
  next();
  // 中间件都执行完毕后，才会向服务器返回完整的数据
  res.end(req.message);
};

const middleware2 = (req, res, next) => {
  req.message += "bbb";
  next();
};

const middleware3 = (req, res, next) => {
  req.message += "ccc";
};

app.use(middleware1, middleware2, middleware3);

app.listen(8000, () => {
  console.log("服务器启动成功~");
});
```

> Express 异步数据的实现
>
> Express 异步数据的实现相较于 Koa 比较麻烦

```javascript
const express = require("express");
const axios = require("axios");

const app = express();

const middleware1 = async (req, res, next) => {
  req.message = "aaa";
  await next();
  res.end(req.message);
};

const middleware2 = async (req, res, next) => {
  req.message += "bbb";
  await next();
};

const middleware3 = async (req, res, next) => {
  const result = await axios.get("http://123.207.32.32:9001/lyric?id=167876");
  req.message += result.data.lrc.lyric;
};

app.use(middleware1, middleware2, middleware3);

app.listen(8000, () => {
  console.log("服务器启动成功~");
});

// 结果：aaabbb
```

> Koa 同步数据的实现
>
> 实现原理图与 Express 同步数据的实现一致

```javascript
const Koa = require("koa");

const app = new Koa();

const middleware1 = (ctx, next) => {
  ctx.message = "aaa";
  next();
  ctx.body = ctx.message;
};

const middleware2 = (ctx, next) => {
  ctx.message += "bbb";
  next();
};

const middleware3 = (ctx, next) => {
  ctx.message += "ccc";
};

app.use(middleware1);
app.use(middleware2);
app.use(middleware3);

app.listen(8000, () => {
  console.log("服务器启动成功~");
});
```

> Koa 异步数据的实现
>
> **Koa 异步数据的实现较为方便，是因为其内部返回了一个 Promise**(详细可看上方源码)

```javascript
const Koa = require("koa");
const axios = require("axios");

const app = new Koa();

const middleware1 = async (ctx, next) => {
  ctx.message = "aaa";
  // 由于内部返回的是一个Promise，所以不管同步还是异步，都会等到有结果后才执行下一步
  await next();
  ctx.body = ctx.message;
};

const middleware2 = async (ctx, next) => {
  ctx.message += "bbb";
  await next();
};

const middleware3 = async (ctx, next) => {
  const result = await axios.get("http://123.207.32.32:9001/lyric?id=167876");
  ctx.message += result.data.lrc.lyric;
};

app.use(middleware1);
app.use(middleware2);
app.use(middleware3);

app.listen(8000, () => {
  console.log("服务器启动成功~");
});

// 结果：aaabbb+axios得到的数据
```

**值得注意的是：虽然上方的 Express 与 Koa 的异步实现看起来一样，但运行结果却大相径庭。**

**Express 异步得到的结果：aaabbb**

**Koa 异步得到的结果：aaabbb+axios 返回的数据**

造成这样结果的原因，**显然是因为 Express 框架和 Koa 框架的机制是不一样的，Koa 处理中间件时返回的是 Promise**，所以一定会得到一个完整的结果。 **而 Express 处理中间件是同步执行的**，**有异步操作时会得不到数据**。所以**上方 Express 异步数据的实现中的 async、await 相当于白加**。

## Koa 洋葱模型

> 来自 Koa 社区针对于**中间件**的盛行的说法

**两层理解**：

- **中间件处理代码的过程**

  > **直至中间件所有代码执行完毕后，才会返回 response 结果**

  ![image-20221031223910473](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20221031223910473.png)

- **response 返回 body 执行**

  > res.body = "结果"

- **Express 框架有洋葱模型吗？**

  其实算有的，上方代码《Express 同步数据的实现》就是一个洋葱模型，**当然在 Express 框架中必须得是同步数据才行**，而**在 Koa 中，不管同步还是异步，都有洋葱模型存在**。至于为什么，上方已经解释的很清楚啦。

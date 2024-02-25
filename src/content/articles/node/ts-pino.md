---
title: TypeScript 集成 Pino
author: Licodeao
publishDate: "2024-2-4"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - TypeScript
  - Node
tags:
  - TypeScript
  - Node
---

## 集成 Pino

`Pino` 是一个高效、低开销、拥有色彩输出的日志库，用于 `NodeJS` 应用程序。下面揭示了如何在 `TypeScript` 中集成 `Pino` 日志库。

> 安装依赖

```bash
$ npm install pino pino-pretty

# 设置为开发依赖
$ npm install @types/pino -D
```

> tsconfig.json

```json
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

> nodemon.json

```json
{
  "watch": ["src"],
  "ext": ".ts .js",
  "exec": "ts-node --esm ./src/index.ts"
}
```

> package.json

```json
{
  "name": "nodejs-mysql-docker",
  "version": "1.0.0",
  "main": "index.ts",
  "type": "module",
  "scripts": {
    "start:dev": "cross-env NODE_ENV=dev nodemon",
    "start:prod": "cross-env NODE_ENV=prod tsc"
  },
  "author": "Licodeao",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "cross-env": "^7.0.3",
    "dotenv": "^16.4.1",
    "express": "^4.18.2",
    "ip": "^1.1.8",
    "mysql": "^2.18.1",
    "pino": "^8.18.0",
    "pino-pretty": "^10.3.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/ip": "^1.1.3",
    "@types/mysql": "^2.15.25",
    "@types/node": "^20.11.16",
    "@types/pino": "^7.0.5",
    "nodemon": "^3.0.3",
    "ts-node": "^10.9.2",
    "tslib": "^2.6.2",
    "typescript": "^5.3.3"
  }
}
```

> 编写 logger.ts

```typescript
// logger.ts

// 在 tsconfig.json 中指定了 module: 'NodeNext' 时，需要使用这种导入方式，否则会报错。
import { pino } from "pino";

const logger = pino({
  base: {
    pid: false,
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorized: true,
    },
  },
  timestamp: () => `, "time": " ${new Date().toLocaleString()}"`,
});

export default logger;
```

> 使用 pino

```typescript
// index.ts

import express from "express";
import ip from "ip";
import cors from "cors";
import logger from "./utils/logger.js";
import type { Express, Request, Response } from "express";

const PORT = process.env.SERVER_PORT || 3000;
const app: Express = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// 使用 pino
app.listen(PORT, () => {
  logger.info(`Server is running at ${ip.address()}:${PORT}`);
});
```

运行启动命令，看看输出：

![image-20240209162004594](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240209162004594.png)

可以运行，集成成功～

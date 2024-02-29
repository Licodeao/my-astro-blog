---
author: Licodeao
title: NestJS 集成 GraphQL 和 MongoDB
publishDate: "2024-2-10"
img: /assets/articles/nestjs.png
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - NestJS
  - GraphQL
  - MongoDB
tags:
  - NestJS
  - GraphQL
  - MongoDB
---

## 集成 GraphQL / MongoDB

安装依赖：

```bash
# GraphQL 依赖
$ npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql

# MongoDB 依赖
$ npm install @nestjs/mongoose mongoose
```

NestJS 集成：

```typescript title="app.module.ts"
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
// schema 验证器
import * as Joi from "joi";
import { DbModule } from "./common/db/db.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 当前环境中不存在 MONGODB_URI 时，应用程序就不会启动。
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    // MongoDB
    DbModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## MongoDB

```typescript title="src/common/db/db.module.ts"
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
```

## GraphQL

可以通过 `nest cli` 命令来生成 `graphql` 模版：

```bash
# 前提：全局安装了 nest-cli

$ nest g resource users
```

![image-20240214233718470](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240214233718470.png)

选择 `GraphQL（code first）` 。

![image-20240214234445793](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240214234445793.png)

可以看到生成的 `GraphQL` 模版。

```typescript
// 和 app.module.ts 中一样，这里精简一下

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

启动项目后，就可以在浏览器中输入： `http://localhost:端口号/graphql` 。

![image-20240215001557171](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240215001557171.png)

即可看到 `GraphQL Server` 生成的 `GraphQL Playground` 页面了，至此 `GraphQL` 和 `MongoDB` 集成完毕了。

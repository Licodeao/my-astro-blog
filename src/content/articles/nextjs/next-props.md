---
title: 如何在Next页面中传递Props？
author: Licodeao
publishDate: "2023-11-15"
img: /assets/articles/nextjs.png
img_alt: 如何在Next页面中传递Props？
description: |
  解决如何在 Next 页面中传递Props出现错误的问题
categories:
  - Next
tags:
  - Next
---

## 起因

最近在写 Next （v14 App Router）时，发现运行 `next build` 出现了以下错误：

```
Linting and checking validity of types ...Failed compile.
"src/app/home/updatelog/bugfix/page.tsx" has an invalid "default" export: Type "{ type: number; }" is not valid.
```

查看报错是在 Next 进行类型检查时出现的，根据给出的文件路径查看相关文件：

```tsx
// updatelog/bugfix/page.tsx

export default function BugFixPage({ type }: { type: number }) {
  return <div>...</div>;
}
```

发现组件定义并没有错，而且传入的参数的类型也没写错。

但报错却出现了 `export: Type "{ type: number; }" is not valid.` ，试着取消传递参数，再重新 build 时，发现就没报错了。

在其父文件中，是这样定义的：

```tsx
// updatelog/page.tsx

export default function UpdateLogPage() {
  const [updatePage, setUpdatePage] = useState<string>("/home/updatelog/newfeature")

  const renderContent = () => {
    switch (updatePage) {
      // 这样的做法是错误的❌
      case "/home/updateLog/newfeature":
        return <NewFeature type={0} />;
      case "/home/updateLog/bugfix":
        return <BugFixPage type={1} />;
      default:
        break;
    }
  }

  ...
}
```

## 解决

由于 Next 的路由是基于文件系统的，也就是说每个页面都是一个单独的组件文件，当然这里说的"每个页面"指的是在 `pages` 目录下或者 `app` 目录下的页面。正是由于这样的特点，Next 就不能像传统的 SPA 应用一样在组件之间传递 Props 了。但这并不是说 Next 的页面组件不能接受参数，它可以接受参数，但并不能像 SPA 应用一样可以接收从另一个组件传递过来的参数。

<font color="red">要在 Next 中的页面之间传递属性，可以通过 getStaticProps 、 getServerSideProps、fetch 等数据获取方法</font>

> getStaticProps
>
> 仅限 <font color="red">Pages Router</font> 模式下才能使用

如果需要在**构建时使用 Props**，则可以使用 `getStaticProps` 方法，它是在构建时运行的服务端函数，并返回一个对象，该对象作为 Props 传递给组件。

```tsx
import type { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await fetchAPI("...");

  return {
    props: {
      result: res.data,
    },
  };
};

export default function ResultPage({ result }) {
  return (
    <div>
      {result.map((item) => {
        <div key={item.id}>{item}</div>;
      })}
    </div>
  );
}
```

> getServerSideProps
>
> 仅限 <font color="red">Pages Router</font> 模式下才能使用

如果需要在**请求时使用 Props**，可以使用 `getServerSideProps` 方法，它也是一个服务端函数，但会针对每个请求运行。

```tsx
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetchAPI("...");

  return {
    props: {
      result: res.data,
    },
  };
};

export default function ResultPage({ result }) {
  return (
    <div>
      {result.map((item) => {
        <div key={item.id}>{item}</div>;
      })}
    </div>
  );
}
```

> fetch
>
> 在 <font color="red">App Router</font> 模式下，可以直接 fetch 来获取数据

Next 扩展了原生的 `fetch Web API` ，额外添加了 `配置缓存` 和 `重新验证行为`。

可以在 `服务器组件(Server Component)`、`路由处理程序(页面目录的API路由)`、`服务器操作(Server Action，在服务器上执行的异步函数)`

``` tsx
async function getData() {
  const res = await fetch("...", {
    // 配置缓存
    cache: 'force-cache',
    // 重新验证行为
    next: {
      revalidate: 3600
    },
  })

  return res.json()
}

export default async function FetchPage() {
  const data = await getData()

  return (
    <div>
      {data.map(i => {
        <div key={i}>{i}</div>
      })}
    </div>
  )
}
```

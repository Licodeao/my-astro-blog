---
title: TypeScript常见的内置工具与实现
author: Licodeao
publishDate: "2023-1-15"
img: /assets/articles/ts.png
img_alt: TypeScript常见的内置工具与实现
description: |
  TypeScript 常见的内置工具与实现
categories:
  - TypeScript
tags:
  - TypeScript
---

## 前瞻

TypeScript 中有许多内置工具，它们每个都可以帮助我们进行类型体操的练习，实际上，工具本身的实现也是一种类型体操。

## 常见的内置工具

### Partial

> **Partial< Type >**
>
> 用于构造一个 Type，其**所有属性都设置为可选类型**

```typescript
interface IPartial {
  name: string;
  age: number;
  height?: number;
}
type IPartialOptional = Partial<IPartial>;

// 实现Partial原理
type LiPartial<T> = {
  [P in keyof T]?: T[P];
};
type IPartialOptional = LiPartial<IPartial>;
```

### Required

> **Required< Type >**
>
> 用于构造一个 Type，其**所有属性都设置为必填类型，与 Partial< T >相反**

```typescript
interface IRequired {
  name: string;
  age: number;
  height?: number;
}
type customRequired = Required<IRequired>;

// 实现Required原理
type LiRequired<T> = {
  [P in keyof T]-?: T[P];
};
type customRequired = LiRequired<IRequired>;
```

### Readonly

> **Readonly< Type >**
>
> 用于构造一个 Type，其**所有属性都设置为只读类型，意味着这个类型的所有属性全都不可以重新赋值**

```typescript
interface IReadonly {
  name: string;
  age: number;
  height?: number;
}
type customReadonly = Readonly<IReadonly>;

// 实现Readonly原理
type LiReadonly<T> = {
  readonly [P in keyof T]: T[P];
};
type customReadonly = LiReadonly<IReadonly>;
```

### Record

> **Record<Keys, Type>**
>
> 用于**构造一个对象类型，它所有的 key 都是 Keys 类型，所有的 value 都是 Type 类型**
>
> 注意：**keyof any => string | number | symbol**
>
> **Keys 一般都为联合类型**

```typescript
interface IRecord {
  name: string;
  age: number;
  height?: number;
}
type Keys = "A" | "B" | "C";
type customRecord = Record<Keys, IRecord>;

// 实现Record原理
// keyof any => string | number | symbol
type LiRecord<K extends keyof any, T> = {
  [P in K]: T;
};
type Keys = "A" | "B" | "C";
type customRecord = LiRecord<Keys, IRecord>;
```

### Pick

> **Pick<Type, Keys>**
>
> 用于构造一个类型，**它是从 Type 类型中挑了一些属性 Keys 组成的**

```typescript
interface IPick {
  name: string;
  age: number;
  height?: number;
}
type customPick = Pick<IPick, "name" | "height">;

// 实现Pick原理
type LiPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type customPick = LiPick<IPick, "name" | "height">;
```

### Omit

> **Omit<Type, Keys>**
>
> 用于构造一个类型，**它是从 Type 类型中过滤了一些属性 Keys**

```typescript
interface IOmit {
  name: string;
  age: number;
  height?: number;
}
type customOmit = Omit<IOmit, "name" | "height">;

// 实现Omit原理
type LiOmit<T, K extends keyof T> = {
  // P in keyof T => 属于遍历原来对象中的key => 即IOmit中的key
  // P extends K => 属于遍历传入的key => 即"name" | "height"
  // 二者取交集 => 删除
  [P in keyof T as P extends K ? never : P]: T[P];
};
type customOmit = LiOmit<IOmit, "name" | "height">;
```

### Exclude

> **Exclude<UnionType, ExcludeMembers>**
>
> 用于构造一个类型，**它是从 UnionType 联合类型里面排除了 ExcludeMembers 的类型**
>
> **Exclude 的实现涉及到了分发条件类型（传入的类型是个联合类型）**

```typescript
// 传入的是一个联合类型
type words = "A" | "B" | "C";
type customExclude = Exclude<words, "C">;

// 实现Exclude原理
type LiExclude<T, E> = T extends E ? never : T;
type customExclude = LiExclude<words, "C">;
```

### Extract

> **Extract<Type, Union>**
>
> 用于构造一个类型，**它是从 Type 类型中提取了 Union 的类型**
>
> **与 Exclude 相反**
>
> **Extract 的实现依然涉及到了分发条件类型**

```typescript
type words = "A" | "B" | "C";
type customExtract = Extract<words, "A">;

// 实现Extract原理
type LiExtract<T, U> = T extends U ? T : never;
type customExtract = LiExtract<words, "A">;
```

### NonNullable

> **NonNullable< Type >**
>
> 用于构造一个类型，**这个类型从 Type 中排除了 null、undefined**

```typescript
type example = "A" | "B" | "C" | null | undefined;
type customNonNullable = NonNullable<example>;

// 实现NonNullable原理
type LiNonNullable<T> = T extends null | undefined ? never : T;
type customNonNullable = LiNonNullable<example>;
```

### ReturnType

> **ReturnType< Type >**
>
> 用于构造一个**获取函数的返回值的类型是 Type**

```typescript
function sum(num1: number, num2: number) {
  return num1 + num2;
}
type customReturnType = ReturnType<typeof sum>;

// 实现ReturnType原理
// 第一个extends是对传入的类型进行限制
// 第二个extends是为了进行条件获取类型
type LiReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;
type customReturnType = LiReturnType<typeof sum>;
```

### InstanceType

> **InstanceType< Type >**
>
> **用于构造一个由所有 Type 的构造函数的实例类型组成的类型**
>
> **typeof class => 构造函数具体的类型**
>
> **InstanceType => 构造函数创建出来的实例对应的类型**

```typescript
class Person {}
class Dog {}

// typeof class => 构造函数具体的类型
// InstanceType => 构造函数创建出来的实例对应的类型
type LiPerson = InstanceType<typeof Person>;
const p: LiPerson = new Person();

// example
// 帮助我们创建某种类型的对象
// 这里函数的返回值的类型不可以写T，因为T的类型会是typeof Person
// 这里就可以使用InstanceType<T>，它可以帮助我们返回构造函数创建出来的实例对应的类型
function factory<T extends new (...args: any[]) => any>(
  ctor: T
): InstanceType<T> {
  return new ctor();
}
const p2 = factory(Person);
const dog = factory(Dog);

// 实现InstanceType原理
type LiInstanceType<T extends new (...args: any[]) => any> = T extends new (
  ...args: any[]
) => infer R
  ? R
  : never;

type customInstanceType = LiInstanceType<typeof Person>;

function factory<T extends new (...args: any[]) => any>(
  ctor: T
): LiInstanceType<T> {
  return new ctor();
}
const p3 = factory(Person);
const dog2 = factory(Dog);
```

## 总结

TypeScript 中常见的内置工具的实现其实并不难，有些特别的知识点记住就行：

- **keyof any => string | number | symbol**
- **typeof class => 构造函数具体的类型**
- **InstanceType => 构造函数创建出来的实例对应的类型**

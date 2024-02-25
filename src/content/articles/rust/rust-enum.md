---
title: Rust 枚举
author: Licodeao
publishDate: "2024-1-7"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 枚举

枚举（enums），允许你通过列举可能的成员（variants）来定义一个类型。枚举是一个单独的类型。

### 定义

结构体能够将字段和数据结合在一起，枚举给予你将一个值成为集合之一的方法。

通过 `enum` 关键字来定义枚举，语法和 TypeScript 定义枚举一样：

```rust
enum NumberType {
  OneHundred,
  TwoHundreds,
}
```

`OneHundred`、`TwoHundreds` 被称为枚举的成员（variants）。

### 枚举值

```rust
let one_hundred = NumberType::OneHundred;
let two_hundreds = NumberType::TwoHundreds;
```

<font color="red">在定义枚举时，可以让枚举成员关联某个数据类型</font>，这样就不需要额外的结构体了：

```rust
#[derive(Debug)]
enum NumberType {
  OneHundred(u32),
  TwoHundreds(u32),
}

fn main() {
  let one_hundred = NumberType::OneHundred(100);
  let two_hundreds = NumberType::TwoHundreds(200);

  println!("one_hundred: {:?}, two_hundreds: {:?}", one_hundred, two_hundreds);
}
```

这样每一个我们定义的枚举成员的名字都变成了一个构建枚举实例的函数。

相比于结构体，枚举的另一个优势就是：每个成员可以处理不同类型和不同数量的数据。

```rust
enum NumberType {
  OneHundred(u8, u8, u8, u8),
  TwoHundreds(String),
}

fn main() {
  let one_hundred = NumberType::OneHundred(255, 255, 255, 0);
  let two_hundreds = NumberType::TwoHundreds(String::from("200"));
}
```

枚举成员不仅可以关联数字、字符串，还可以关联结构体，甚至于另一个枚举！总之，可以将任意类型的数据放入枚举成员中！

```rust
// 结构体
#[derive(Debug)]
struct OneHundredStruct {}
#[derive(Debug)]
struct TwoHundredsStruct {}

// 枚举成员关联结构体
#[allow(unused)]
#[derive(Debug)]
enum NumberType {
  OneHundred(OneHundredStruct),
  TwoHundreds(TwoHundredsStruct),
}

fn main() {
  let one_hundred_struct = OneHundredStruct {};
  let two_hundreds_struct = TwoHundredsStruct {};

  let one_hundred = NumberType::OneHundred(one_hundred_struct);
  let two_hundreds = NumberType::TwoHundreds(two_hundreds_struct);

  println!("one_hundred: {:?}, two_hundreds: {:?}", one_hundred, two_hundreds);
}
```

与结构体一样，也可以使用 `impl` 关键字在枚举上定义方法。

```rust
fn main() {
  enum NumberType {
    OneHundred(String),
    TwoHundreds(String),
	}

  // 在枚举上定义方法
  impl NumberType {
    fn get(&self) {
     	...
    }
  }

  let m = NumberType::OneHundred(String::from("Get"));
  m.get();
}
```

### Option 枚举

Option 枚举广泛应用于<font color="red">一个值要么有值要么没值</font>的场景。<font color="red">空值（Null）是一个值，它代表没有值，在 Rust 中并没有空值</font>。

在 Rust 中虽然没有空值，但是<font color="red">可以拥有一个可以编码存在或不存在的枚举</font>！这个枚举就是 `Option<T>`

```rust
#![allow(unused)] // 告诉 lint 可以允许未使用的变量存在，不要出警告
fn main() {
  enum Option<T> {
    None,
    OneHundred(T),
  }
}
```

标准库中的 `Option`

```rust
pub enum Option<T> {
    /// No value.
    #[lang = "None"]
    #[stable(feature = "rust1", since = "1.0.0")]
    None,
    /// Some value of type `T`.
    #[lang = "Some"]
    #[stable(feature = "rust1", since = "1.0.0")]
    Some(#[stable(feature = "rust1", since = "1.0.0")] T),
}
```

由于 `None` 可以已经在标准库中定义了，所以直接不需要枚举前缀 `Option::` 就可以使用它了。

```rust
fn main() {
  enum Option<T> {
    None,
    OneHundred(T),
  }

  let one_hundred = None; // 但是这里有问题
}
```

会出现这个错误提示：

![image-20240113112025650](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240113112025650.png)

这告诉我们需要为 `one_hundred` 变量显式地添加一个类型注解！给 `one_hundred` 变量添加一个类型

```rust
#![allow(unused)]
fn main() {
  enum Option<T> {
    None,
    OneHundred(T),
  }

  let one_hundred: Option<i32> = None;
}
```

但是依然会报错：

![image-20240113135007506](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240113135007506.png)

这个错误告诉我们标准库中的 `Option` 和 主程序中的 `Option` 产生了冲突！

```rust
#![allow(unused)]
fn main() {
  let one_hundred: Option<i32> = None;
}
```

去掉主程序中的 `Option` 枚举就可以了。这说明了直接使用 `None` 时，它来自标准库，在当前作用域中不能再实现 `Option` 枚举了！

当 `Option` 类型和其他类型进行运算时：

```rust
#![allow(unused)]
fn main() {
  let x: i32 = 5;
  let y: Option<i32> = Some(5);
  let sum = x + y;

  println!("sum: {:?}", sum);
}
```

会出现以下提示和错误：

![image-20240113141512587](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240113141512587.png)

```rust
  |
5 |   let sum = x + y;
  |               ^ no implementation for `i32 + Option<i32>`
  |
  = help: the trait `Add<Option<i32>>` is not implemented for `i32`
  = help: the following other types implement trait `Add<Rhs>`:
            <i32 as Add>
            <i32 as Add<&i32>>
            <&'a i32 as Add<i32>>
            <&i32 as Add<&i32>>
```

诚然，类型不同的值必然不能相加。一个类型为 `i32` 的值，Rust 编译器确保它总是有效的，无需做空值检查。

只有当使用了 `Option<T>` 类型时，可能会出现空值的情况，因为在标准库 `Option<T>` 存在着 `None` 值。

只要一个值不是 `Option<T>` 类型时，就可以安全地认为它的值不为空。

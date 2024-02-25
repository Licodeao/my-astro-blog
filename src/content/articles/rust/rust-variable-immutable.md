---
title: Rust 中的变量和常量
author: Licodeao
publishDate: "2023-9-15"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 变量

<font color="red">Rust 中默认变量是不可变的</font>

当变量不可变时，一旦值被绑定到一个名称上，你就不能改变这个值。

```rust
fn main() {
  let x = 5;
  println!("The value of x is: {x}");
  x = 6;
  println!("The value of x is: {x}");
}
```

使用 `cargo run` 运行该程序后，会出现如下错误：

```rust
2 |     let x = 5;
  |         -
  |         |
  |         first assignment to `x`
  |         help: consider making this binding mutable: `mut x`
3 |     println!("The value of x is: {x}");
4 |     x = 6;
  |     ^^^^^ cannot assign twice to immutable variable
```

错误原因：不能对不可变变量进行二次赋值

> Rust 编译器能够保证：如果声明一个值不可变，那它真的就不会变，所以就不必跟踪它，这导致代码更容易推导。

尽管 Rust 默认变量是不可变的，但也可以通过 `mut` 关键字来使其可变。

```rust
fn main() {
  let mut x = 5;
  println!("The value of x is: {x}");
  x = 6;
  println!("The value of x is: {x}");
}
```

使用 `cargo run` 运行该程序后，出现如下信息：

```rust
    Finished dev [unoptimized + debuginfo] target(s) in 0.30s
     Running `target/debug/variables`
The value of x is: 5
The value of x is: 6
```

表示编译没有错误，运行成功！通过 `mut` 关键字，允许把绑定到 x 的值从 5 改到 6，这里的绑定和赋值是一个意思，但在 Rust 中更倾向于 `绑定` 这种说法。

## 常量

与不可变变量类似，<font color="red">常量是绑定到一个名称的不允许改变的值</font>，但常量和不可变变量仍然有些区别：

- 常量无法使用 `mut` 关键字

- 常量不仅默认不可变，也总是不可变

- 声明常量需要使用 `const` 关键字，而不是 `let` 关键字，并且必须要注明值的类型

- 常量可以声明在任何作用域中

- 常量只能被设置为常量表达式，而不能是在运行时计算出的值

  ```rust
  // 定义常量
  const TIME_SECONDS: u32 = 60 * 60;
  ```

Rust 对常量的命名规范是：名称全大写，使用下划线进行分割

## 变量遮蔽

定义一个与之前变量同名的新变量，Rust 称之为第一个变量被第二个隐藏了（Shadowing）。这意味着当使用变量时，编译器看到的将会是第二个变量，直到第二个变量被隐藏或第二个变量的作用域结束。可以使用相同的变量名来隐藏一个变量，或者重复使用 `let` 关键字来实现多次隐藏。

```rust
fn main() {
  let x = 5;

  let x = x + 1;

  {
    let x = x * 2;
    println!("Inner Scope value of x is: {x}");
  }

  println!("Outer Scope value of x is: {x}");
}
```

首先，将 x 绑定到了 5 上，接着通过 `let` 关键字创建了一个 x 变量，这时 x 的值就为 6 了。

进入花括号创建的内部作用域中，第三个 `let` 语句也创建了一个 x 变量，并且隐藏了之前的 x 变量，这时输出的 x 的值为 12。

进入下一行语句后，花括号的作用域结束了，内部进行的 Shadowing 也结束了，此时 x 的值回退到了之前的 6，至此程序结束了。

```rust
    Finished dev [unoptimized + debuginfo] target(s) in 0.38s
     Running `target/debug/rust_tests`
Inner Scope value of x is: 12
Outer Scope value of x is: 6
```

> 变量遮蔽与 `mut` 是有区别的

- 在使用变量遮蔽时，如果没有重新使用 `let` 关键字进行声明，会导致在编译阶段出现错误；而使用 `mut` 关键字后，重新赋值时则不会出现错误
- <font color="red">使用变量遮蔽时，实际上相当于创建了一个新的变量</font>，可以改变这个变量的类型并且可以复用这个变量的名称。

```rust
let str = "     ";
let str = str.len();
```

第一个 str 的类型是字符串，第二个 str 的类型是数字。如果使用 `mut` 关键字后，编译将得到错误：

```rust
let mut str = "     ";
str = str.len();
```

```rust
   |
59 |     let mut str = "     ";
   |                   ------- expected due to this value
60 |     str = str.len();
   |           ^^^^^^^^^ expected `&str`, found `usize`
```

这个错误说明，不能去更改变量的类型。

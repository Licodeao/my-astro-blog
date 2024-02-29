---
title: Rust 函数
author: Licodeao
publishDate: "2023-9-29"
img: /assets/articles/rust.png
img_alt: Rust 函数
description: |
  Rust 函数
categories:
  - Rust
tags:
  - Rust
---

## 函数

Rust 通过 `fn` 关键字声明函数，函数和变量名的命名规范都使用 `snake case` 风格，所有字母都是小写且通过下划线进行分割。

```rust
fn main() {
  println!("Main Function");
  anthor_fn();
}

fn anthor_fn() {
  println!("Anthor Function");
}
```

Rust 并不关心函数的定义位置，你可以定义在 `main` 函数的前面和其他任何位置，这点和灵活的 `JavaScript` 是一样的。

### 参数

参数是特殊的变量，它属于函数签名的一部分。当函数拥有参数（形参）时，可以为这些参数提供实际的值（实参）；

<font color="red">在函数签名中，必须显式地声明每个参数的类型</font>。这是 Rust 的一个设计：要求在函数定义中提供参数的类型注解，这有助于编译器理解你的意图并能给出更有用的错误提示信息。

定义多个参数时，使用 `逗号` 分隔：

```rust
fn main() {
  test(3, 'c');
}

fn test(x: i32, c: char) {
  println!("The value of x is: {x}, the value of c is {c}");
}
```

### 语句和表达式

Rust 也是一门基于表达式的语言，这也是与其他语言更显著的区别。

> 什么是语句？什么又是表达式？

语句：执行一些操作，但是不返回值的指令

表达式：计算并产生值

```rust
// 语句
let x = 123;

// 表达式
let y = {
  let x = 3;
  x + 1 // 表达式的结尾没有分号，如果加上了分号就变成了语句，这个代码块的值被直接绑定到了变量 y 上
}

println!("The value of y is: {y}");
```

### 具有返回值的函数

通过 `->` 声明返回值的类型

在 Rust 中，<font color="red">函数的返回值等同于函数体最后一个表达式的值</font>。正由于是最后一个表达式的值，所以它<font color="red">并无分号</font>！

使用 `return` 关键字和指定值，可以从函数中提前返回，但大部分函数都是隐式返回的。

```rust
fn num() -> i32 {
  6
}

fn main() {
  let num = num();

  println!("The value of num is: {num}");
}
```

给函数加上参数

```rust
fn num(x: i32) -> i32 {
  x + 1
}

fn main() {
  let num = num(3);

  println!("The value of num is: {num}");
}
```

如果在 返回值的末尾加上分号，这会导致一个类型错误：

```rust
fn num(x: i32) -> i32 {
  x + 1; // 加上分号
}

fn main() {
  let num = num(3);

  println!("The value of num is: {num}");
}
```

```rust
   |
63 | fn num(x: i32) -> i32 {
   |    ---            ^^^ expected `i32`, found `()` // 语句不返回值，所以返回一个单位类型()，表示空值
   |    |
   |    implicitly returns `()` as its body has no tail or `return` expression
64 |   x + 1;
   |        - help: remove this semicolon to return this value // 编译器提示信息
```

主要是因为产生了类型不匹配的错误，并且 Rust 的编译器还会给你一条提示信息，帮助你去修改错误。

不得不说，Rust 的编译器真的牛～

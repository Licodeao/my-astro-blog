---
title: Rust 注释与控制流
author: Licodeao
publishDate: "2023-10-6"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 注释

留下注释，编译器在编译时会忽略注释。

### 代码注释

简单的注释：

```rust
// hello world
```

在 Rust 中，惯用的注释都是以 `//` 双斜线开始的，并持续到本行结尾。

对于超过一行的注释，需要在每行的开头都加上 `//`

```rust
// hello world
// hello rust
```

### 文档注释

在 Rust 中，文档注释以 `///` 开始，并且文档注释在编译后会生成 HTML 文档。

不过文档注释常用在 `crate` 包中，生成的 HTML 文档会展示公有 API 文档注释的内容，使得对这个库感兴趣的开发者能够理解如何使用这个 `crate` 包。

文档注释一般位于项目的代码之前：

````rust
/// Make a plus
/// # Example
/// ```
/// let arg = 5;
/// let answer = my_crate::plus(arg);
/// assert_eq!(6, answer);
/// ```
pub fn plus(num: i32) -> i32 {
  num + 1
}
````

通过 `cargo doc` 来生成当前文档注释的 HTML 文档。

通过 `cargo doc --open` 会构建当前 `crate` 文档的 HTML，并在浏览器打开。

## 控制流

Rust 中常见的控制流结构是 `if 表达式` 和 `循环`。

### if 表达式

```rust
let number = 5;

if number < 3 {
  println!("True");
} else {
  println!("False");
}
```

⚠️：条件必须是 `bool` 类型，否则编译会出错。

```rust
   |
66 |   if number {
   |      ^^^^^^ expected `bool`, found integer
```

这个错误表明了 Rust 期望一个 `bool` 类型，却得到了一个整数。不像 JavaScript 一样，Rust 并不能自动地隐式地将非布尔值转换为布尔值，<font color="red">必须显式地使用布尔值作为 if 表达式的条件</font>。

#### 在 let 语句中使用 if

因为 `if` 是一个表达式，所以可以在 `let` 语句的右侧使用它。

```rust
fn main() {
  let flag = true;

  let v = if flag { 6 } else { 5 };

  println!("The value of v is: {v}");
}
```

`if` 的<font color="red">每个分支的返回值都必须是相同的类型</font>，否则编译器会报错。

```rust
fn main() {
  let flag = true;

  let v = if flag { 6 } else { "false" };

  println!("The value of v is: {v}");
}
```

```rust
   |
66 |   let v = if flag { 6 } else { "false" };
   |                     -          ^^^^^^^ expected integer, found `&str`
   |                     |
   |                     expected because of this
```

这是因为变量只能拥有一个类型，所以必须保证 `if` 的每个分支的返回值都是相同类型。

### 循环

在 Rust 中，有三种循环：`loop` , `while` , `for`

#### loop

```rust
fn main() {
  loop {
    println!("loop");
  }
}
```

#### 从循环中返回值

如果将返回值加入到用来停止循环的 `break` 表达式，它会被停止的循环返回：

```rust
fn main() {
  let mut counter = 1;

  let result = loop {
      counter += 1;

      if counter == 10 {
        break counter * 2;
      }
  };

  println!("The result is {result}"); // 20
}
```

#### 循环标签

循环标签的作用是在多个循环之间消除歧义

如果存在嵌套循环，那么 `break` 和 `continue` 会应用于此时最内层的循环；

可以<font color="red">在一个循环上指定一个循环标签（loop label），然后将标签和 `break` 、`continue` 一起使用，使得这些关键字应用于已经标记的循环，而不是最内层的循环</font>。

使用 `'` 定义一个循环标签

```rust
fn main() {
  let mut counter = 0;

  'Outer_loop: loop {
      println!("Outer loop counter: {counter}");

      let mut remaining = 10;

      loop {
          println!("Inner loop remaining: {remaining}");

          if remaining == 9 {
            break;
          }

          if counter == 2 {
            break 'Outer_loop;
          }

          remaining -= 1;
      }

      counter += 1;
  }

  println!("The value of counter: {counter}");
}
```

从循环来看，外层有个循环 `Outer_loop` ，内层有个循环。

观察两个循环的结束条件，可以看出 `Outer_loop` 标签从 0 数到 2，内层循环从 10 减到 9。

没有指定标签的 `break` 将退出内层循环，而有标签的 `break 'Outer_loop` 将退出外层循环。

输出以下结果：

```rust
Outer loop counter: 0
Inner loop remaining: 10
Inner loop remaining: 9
Outer loop counter: 1
Inner loop remaining: 10
Inner loop remaining: 9
Outer loop counter: 2
Inner loop remaining: 10
The value of counter: 2
```

#### while

Rust 内置了一个语言结构，它被称为 `while 循环`

```rust
fn main() {
  let mut number = 3;

  while number != 0 {
      println!("{}!", number);

      number -= 1;
  }

  println!("done");
}
```

输出以下结果：

```rust
3!
2!
1!
done
```

#### for

`for` 常用来循环遍历集合，当然也可以使用 `while` 循环来遍历，但是会变得更慢，因为编译器增加了运行时代码对每次循环进行条件检查。

```rust
fn main() {
  let a = [10, 20, 30, 40, 50];

  for item in a {
    println!("The value in a is: {item}");
  }
}
```

也可以使用 `range` 库中的 `rev` 函数来实现倒计时的效果：

```rust
fn main() {
  for item in (1..4).rev() {
    println!("{}", item);
  }
  println!("done");
}
```

```rust
3
2
1
done
```

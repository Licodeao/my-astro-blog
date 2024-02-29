---
title: Rust 错误处理
author: Licodeao
publishDate: "2024-1-18"
img: /assets/articles/rust.png
img_alt: Rust 错误处理
description: |
  Rust 错误处理
categories:
  - Rust
tags:
  - Rust
---

## 错误处理

Rust 中的错误处理能够使得程序更加健壮，因为它可以确保你在将代码部署到生产环境之前就能发现错误并进行适当的处理。在 Rust 中，<font color="red">将错误分为两大类：可恢复的和不可恢复的</font>。可以恢复的错误，可以尝试重试解决；不可恢复的错误，会是 bug 出现的前兆。大多数语言并不区分这两种错误，但 Rust 会。`Result<T, E>` 类型来处理可恢复的错误；`panic!` 宏用于处理不可恢复的错误，在程序遇到不可恢复的错误时停止执行。

### `panic!` 宏

`panic!` 宏用于处理不可恢复的错误，在 Rust 中有两种方法造成 `panic`：

- 执行代码造成 `panic`
- 显式地调用 `panic!` 宏

`panic` 会打印出错误信息，可以通过一个环境变量，你也可以让 Rust 在 `panic` 发生时打印调用堆栈以便于定位 `panic` 出现的原因，因为通常情况下，`panic` 在打印错误信息后，会展开并清理栈数据，然后退出。

可以在 `Cargo.toml` 文件中设置不展开调用堆栈：

```toml
[profile.release]
panic = "abort"
```

`[profile.release]` 表示了在 `release` 模式下 `panic` 会直接终止，当然你也可以在 `dev` 模式下终止 `panic`：

```toml
[profile.dev]
panic = "abort"
```

> 有一种情况是：在自己的项目中使用了别人的库，别人的库中使用了 `panic!` 宏，那么如何去寻找别人代码里出现的问题呢？

使用 `panic!` 宏的 `backtrace` 。

可以通过设置 `RUST_BACKTRACE` 环境变量来得到一个 `backtrace` 。`backtrace` 是一个<font color="red">执行到目前位置所有被调用的函数的列表</font>。

> 倘若我们运行一个会出现 `panic` 的程序时，如果在输出看到 `backtrace` ？

将 `RUST_BACKTRACE` 环境变量设置为任何不是 0 的值来获取 `backtrace`。

```bash
$ RUST_BACKTRACE=1 cargo run
```

以一个访问不存在的无效索引为例子，来看看 `backtrace` ：

```rust
fn main() {
  let v = vec![1, 2, 3];

  v[10];
}
```

使用 `RUST_BACKTRACE` 环境变量的输出为：

```rust
thread 'main' panicked at src/main.rs:4:4:
index out of bounds: the len is 3 but the index is 10
stack backtrace:
   0: rust_begin_unwind
             at /rustc/cc66ad468955717ab92600c770da8c1601a4ff33/library/std/src/panicking.rs:595:5
   1: core::panicking::panic_fmt
             at /rustc/cc66ad468955717ab92600c770da8c1601a4ff33/library/core/src/panicking.rs:67:14
   2: core::panicking::panic_bounds_check
             at /rustc/cc66ad468955717ab92600c770da8c1601a4ff33/library/core/src/panicking.rs:162:5
note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.
[1]    36990 abort      RUST_BACKTRACE=1 cargo run
```

### `Result<T, E>` 类型

`Result<T, E>` 类型用于处理可恢复的错误，它是一样枚举并且它有两个成员：`Ok` 和 `Err`：

```rust
enum Result<T, E> {
  Ok(T),
  Err(E),
}
```

以打开某个文件为例子，使用 `match` 表达式来处理返回的 `Result<T, E>` 成员

```rust
#![allow(unused)]
use std::fs::File;

fn main() {
  let result = File::open("hello.txt");

  let file = match result {
    Ok(file) => file,
    Err(error) => {
      panic!("There was a problem opening the file: {:?}", error)
    }
  };
}
```

输出：

```rust
There was a problem opening the file: Os { code: 2, kind: NotFound, message: "No such file or directory" }
```

> 匹配不同的错误

在 `Err` 成员中，还可以匹配不同的错误。

```rust
#![allow(unused)]
use std::{fs::File, io::ErrorKind};
fn main() {
  let result = File::open("hello.txt");

  let file = match result {
    Ok(file) => file,
    Err(error) => match error.kind() {
      ErrorKind::NotFound => match File::create("hello.txt") {
        Ok(fc) => fc,
        Err(e) => panic!("Problem creating the file: {:?}", e),
      },
      other_error => {
        panic!("Problem opening the file: {:?}", other_error)
      }
    }
  };
}
```

在代码中可以看到有三个 `match` 分支，它们分别处理对应不同的情况。

`File::open` 返回的 `Err` 成员中的值类型是 `io::Error`，它是一个结构体，这个结构体中有一个返回 `io::ErrorKind` 值的 `kind` 方法可以调用。`io::ErrorKind` 是一个标准库提供的枚举，里面有 `NotFound` 等枚举成员。

> 失败时 `panic` 的简写

上方 `match` 的写法可以看到比较乱且冗长。`Result<T, E>` 类型中有 `unwrap` 这个方法，它可以辅助我们进行处理并以简洁的形式代替之前相同的工作。它类似于 `match` 语句：

- 如果 `Result` 的值是成员 `Ok`，`unwrap` 会返回 `Ok` 中的值
- 如果 `Result` 的值是成员 `Err` ，`unwrap` 会调用 `panic!`

还有一个 `expect` 方法，它允许我们选择 `panic!` 的错误信息，也就是自定义 `panic!` 的错误信息。

```rust
let result = File::open("hello.txt").expect("expect message");
```

知道了 `unwrap` 和 `expect` ，就可以重写之前的“匹配不同错误”中的例子了：

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let greeting_file = File::open("hello.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello.txt").unwrap_or_else(|error| {
                panic!("Problem creating the file: {:?}", error);
            })
        } else {
            panic!("Problem opening the file: {:?}", error);
        }
    });
}
```

> 传播错误

<font color="red">除了在当前函数中处理错误外，可以让调用者知道这个错误并决定该如何处理，这个过程被称为传播错误</font>。

```rust
#![allow(unused)]
use std::{fs::File, io::{Read, self}};
fn main() {
  fn read() -> Result<String, io::Error> {
    let file = File::open("hello.txt");

    let mut result = match file {
      Ok(file) => file,
      Err(error) => return Err(error),
    };

    let mut name = String::new();

    match result.read_to_string(&mut name) {
      Ok(_) => Ok(name),
      Err(error) => Err(error),
    }
  }
}
```

函数以调用 `File::open` 函数开始，接着使用 `match` 处理函数返回值 `Result` 。继续执行，在 `Err` 的情况下，没有调用 `panic!` 宏，而是使用了 `return` 关键字提前结束整个函数，并将来自 `File::open` 的错误值作为函数的错误值传回给调用者。可以看到，在最后一个 `match` 表达式里的 `Err` 模式下并没有调用 `return` 语句，因为这是函数的最后一个表达式。

> 传播错误的简写

Rust 提供了 `?` 问号运算符来使其更易于处理。

```rust
#![allow(unused)]
use std::{fs::File, io::{Read, self}};
fn main() {
  fn read() -> Result<String, io::Error> {
    let mut file = File::open("hello.txt")?;
    let mut name = String::new();
    file.read_to_string(&mut name)?;
    Ok(name)
  }
}
```

第一个问号 `?` 与 传播错误中的第一个 `match` 表达式有着完全相同的工作方式。如果 `Result` 的值是 `Ok`，那么这个表达式就会返回 `Ok` 中的值而程序将继续执行。如果值是 `Err` ，`Err` 将作为整个函数的返回值，就好像使用了 `return` 关键字一样，这样错误就被传播给了调用者。

总的来说就是，`File::open` 调用结尾的 `?` 会将 `Ok` 中的值返回给变量 `file`。如果发生了错误，`?` 运算符会使整个函数提前返回并将任何 `Err` 值返回给调用者。

我们甚至可以在 `?` 之后直接使用<font color="red">链式调用</font>来进一步缩短代码！

```rust
#![allow(unused)]
use std::{fs::File, io::{Read, self}};
fn main() {
  fn read() -> Result<String, io::Error> {
    let mut name = String::new();

    File::open("hello.txt")?.read_to_string(&mut name)?;

    Ok(name)
  }
}
```

什么可选链？（幻视

```rust
File::open("hello.txt")?.read_to_string(&mut name)?;
```

这一行代码可以看成是 “逻辑与” 的关系：

```rust
File::open("hello.txt")? && read_to_string(&mut name)?;
```

`File::open("hello.txt")?` 的结果直接链式调用了 `read_to_string` ，当 `File::open` 和 `read_to_string` <font color="red">都成功没有失败时</font>，函数才返回变量 `name` 的 `Ok` 值。也就是前者如果返回 `Err` 值，则整个函数直接返回 `Err` 值并结束。

虽然 `?` 问号运算符能使代码更简洁，但是也不是所有地方都可以使用问号运算符的。

> 哪里可以使用 `?` 问号运算符呢？

`?` 问号运算符<font color="red">只能用于返回值与 `?` 作用的值相兼容的函数</font>。因为 `?` 问号运算符<font color="red">被定义为从函数中提前返回一个值</font>。例如使用 `?` 问号运算符提早返回了一个 `Err` 值，函数的返回值必须是 `Result` 才能与这个提早返回的值相兼容。

```rust
#![allow(unused)]
use std::fs::File;
fn main() {
  let file = File::open("hello.txt")?;
}
```

以上代码就是 `?` 问号运算符作用的值与函数返回值不兼容的情况。

会出现以下错误提示：

```rust
  |
3 | fn main() {
  | --------- this function should return `Result` or `Option` to accept `?`
4 |   let file = File::open("hello.txt")?;
  |                                     ^ cannot use the `?` operator in a function that returns `()`
  |
  = help: the trait `FromResidual<Result<Infallible, std::io::Error>>` is not implemented for `()`
```

`main` 函数返回的是一个空类型 `()` ，而 `?` 问号运算符作用的 `File::open` 返回的是一个 `Result` 类型，两者不兼容，于是报错。

### 处理原则

当有可能会导致有害状态的情况下，建议使用 `panic!`。<font color="red">有害状态是指无效的值、自相矛盾的值或者被传递了不存在的值</font>等等情况。

- 有害状态是非预期行为，与偶尔发生的行为相对，如用户偶尔输错数据，这不属于有害状态
- 在这之后代码的运行依赖不处于这种有害状态
- 有害状态必须处理，而无法通过编码进所使用的类型中来解决

当错误预期会出现时，使用 `Result` 会比调用 `panic!` 更加合适。

总结就是错误是自己能预见的，就使用 `Result` 类型去处理错误，反之使用 `panic!` 宏。

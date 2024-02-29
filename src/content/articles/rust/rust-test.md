---
title: Rust 自动化测试
author: Licodeao
publishDate: "2024-1-23"
img: /assets/articles/rust.png
img_alt: Rust 自动化测试
description: |
  Rust 自动化测试
categories:
  - Rust
tags:
  - Rust
---

## 自动化测试

Rust 是一个相当重视正确性的编程语言，<font color="red">即使 Rust 拥有类型系统，但类型系统不可能捕获所有的问题</font>。于是，Rust 包含了对自动化测试的支持。倘若我们编写了一个函数，Rust 会进行所有的借用检查和类型检查，但是 Rust 并不能检查该函数是否能准确地完成我们预期的功能。这时就需要 Rust 支持的测试功能了。

### 如何编写测试

Rust 中的测试函数是<font color="red">用来验证非测试代码是否按照期望的方式运行的</font>。

测试函数体通常执行三种操作：

- 设置所需的数据或状态
- 运行需要测试的代码
- 断言其结果是我们所期望的

#### `test` 属性注解

<font color="red">Rust 中的测试就是一个带有 `test` 属性注解的函数</font>。属性是关于 Rust 代码片段的元数据，为了将一个函数变成测试函数，需要在 `fn` 之前加上 `#[test]`。

使用 `cargo test` 命令运行测试时，Rust 会构建一个测试执行程序用来调用被标注的函数，并报告每一个测试函数是通过还是失败。

```rust
// 注意是 lib.rs，而不能在 main.rs 中

#[cfg(test)]
mod tests {
  #[test]
  fn testing() {
    let result = 66 + 66;
    assert_eq!(result, 132);
  }
}
```

使用 `cargo test` 命令运行后，输出为：

```rust
running 1 test
test tests::testing ... ok // test tests 模块下的 testing 测试函数，测试结果为 ok

// test result 代表所有测试都通过了，1 passed; 0 failed 表示通过或失败的测试数量
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
	 // 所有文档测试的结果，Rust 会编译任何在 API 文档中的代码示例，使文档和代码保持同步
   Doc-tests adder

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

每次使用 `Cargo` 新建一个库项目时，它会自动为我们生成一个测试模块和测试函数，这个模块提供了一个编写测试的模板。

使用 `cargo new project_name --lib` 命令新建一个库项目：

```bash
$ cargo new test_lib --lib
```

在生成的 `lib.rs` 文件中，可以看见自动生成的测试模块和测试函数：

```rust
// 自动生成的测试函数
pub fn add(left: usize, right: usize) -> usize {
    left + right
}

// 自动生成的测试模块
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}

```

在自动生成的测试模块中，函数体通过使用 `assert_eq!` 宏来断言 `2 + 2 = 4`。

当测试函数中出现了 `panic` 时测试就失败了，每一个测试都在一个新线程中运行，当主线程发现测试线程异常了，将对应测试标记为失败。

```rust
pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
  	// 这是一个内部的模块，要测试外部模块中的代码，需要将其引入到内部模块的作用域中
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }

    #[test]
    fn error() {
        panic!("This is panic!");
    }
}
```

使用 `cargo test` 命令运行后，输出：

```rust
running 2 tests
test tests::it_works ... ok
test tests::error ... FAILED

failures:

---- tests::error stdout ----
thread 'tests::error' panicked at src/lib.rs:17:9:
This is panic!
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    tests::error

test result: FAILED. 1 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

可以在单独的测试结果和摘要之间多了两个新的部分：第一个部分显示测试失败详细的错误原因，第二个部分列出了所有失败的测试。

#### `assert!` 宏

`assert!` 宏由标准库提供，`assert!` 宏接受一个布尔值参数，它可以用来检查结果。如果值是 `true`，`assert!` 宏什么也不做，同时测试会通过；如果值为 `false` ，`assert!` 宏会调用 `panic!` 宏，导致测试失败。

```rust
#[cfg(test)]
mod tests {

    #[test]
    fn validate() {
        assert!(3 > 2);
    }
}
```

#### `assert_eq!` 宏和 `assert_ne!` 宏

使用 `assert_eq!` 宏和 `assert_ne!` 宏来测试相等与不相等，将需要测试的代码值与期望值进行比较，并检查是否相等与不相等。

- `assert_eq!` 宏用于测试是否相等
- `assert_ne!` 宏用于测试是否不相等

```rust
pub fn add(x: i32, y: i32) -> i32 {
  x + y
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_assert_eq() {
    assert_eq!(add(4, 6), 10);
  }

  #[test]
  fn test_assert_ne() {
    assert_ne!(add(4, 6), 11);
  }
}
```

使用 `cargo test` 命令运行后，输出为：

```rust
running 2 tests
test tests::test_assert_ne ... ok
test tests::test_assert_eq ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests test_lib

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

可以看到两个测试函数都通过了，`assert_eq!` 宏用于测试是否相等，如果相等就返回 `true` ；`assert_ne!` 宏用于测试是否不相等，如果不相等就返回 `true` 。

看看 `assert_eq!` 宏报错会输出什么：

```rust
pub fn add(x: i32, y: i32) -> i32 {
    x + y
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_assert_eq() {
      	// 改变了 assert_eq! 的输入参数
        assert_eq!(add(4, 6), 11);
    }

    #[test]
    fn test_assert_ne() {
        assert_ne!(add(4, 6), 11);
    }
}
```

```rust
running 2 tests
test tests::test_assert_ne ... ok
test tests::test_assert_eq ... FAILED

failures:

---- tests::test_assert_eq stdout ----
thread 'tests::test_assert_eq' panicked at src/lib.rs:11:9:
assertion `left == right` failed
  left: 10
 right: 11
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    tests::test_assert_eq

test result: FAILED. 1 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

可以看到在错误提示中出现了 `left === right` ，并且 `left` 和 `right` 的值分别为 `10` 和 `11` ，并不相等，所以报错了。在其他编程语言里，断言两个值相等的函数的参数被称为 `expected` 和 `actual` ，在 Rust 中，它们被称为 `left` 和 `right` ，指定期望的值和被测试代码产生的值的顺序并不重要。

`assert_eq!` 宏和 `assert_ne!` 宏在底层分别使用了 `==` 和 `!=` 。当断言失败时，这些宏就会调用调试格式来打印出其参数，这意味着被比较的值必须实现了 `PartialEq` 和 `Debug trait` 。对于自定义枚举和结构体，需要实现 `PartialEq` 才能断言它们的值是否相等，需要实现 `Debug trait` 才能在断言失败的时候打印它们的值。<font color="red">通常可以在枚举或结构体上添加 `#[derive(PartialEq, Debug)]` 注解即可解决</font>。

#### `should_panic!` 宏

`should_panic!` 宏用于检查代码是否按照期望处理错误，可以对函数增加一个属性 `should_panic` 来实现这些，这个属性会在函数 `panic` 时通过，没有 `panic` 时失败。

```rust
pub struct Person {
    age: i32
}

impl Person {
    pub fn new(age: i32) -> Self {
        if age < 0 {
            panic!("Age cannot be negative");
        }
        Person { age }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic]
    fn testing() {
        Person::new(-1);
    }
}
```

使用 `cargo test` 命令运行后，输出为：

```rust
running 1 test
test tests::testing - should panic ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests test_lib

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

在代码中，当 `age` 小于 0 时会出现 `panic` ，并且在测试函数上添加了 `#[should_panic]` 注解，所以测试通过。

为了使用 `should_panic` 测试结果更加精确，可以给它添加一个可选的 `expected` 参数。

```rust
pub struct Person {
    age: i32
}

impl Person {
    pub fn new(age: i32) -> Self {
        if age < 0 {
            panic!("Age cannot be negative");
        }
        Person { age }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "less than zero")]
    fn testing() {
        Person::new(-1);
    }
}
```

这一次运行就会报错了：

```rust
running 1 test
test tests::testing - should panic ... FAILED

failures:

---- tests::testing stdout ----
thread 'tests::testing' panicked at src/lib.rs:8:13:
Age cannot be negative
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
note: panic did not contain expected string
      panic message: `"Age cannot be negative"`,
 expected substring: `"less than zero"`

failures:
    tests::testing

test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

#### `Result<T, E>` 避免 `panic`

上面编写的测试在出错时都会出现 `panic` ，也可以使用 `Result<T, E>` 来编写测试。使用 `Result<T, E>` 重写，可以避免在失败时返回 `panic` 而是返回 `Err`。

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn testing() -> Result<(), String> {
        if 3 + 3 == 6 {
            Ok(())
        } else {
            Err(String::from("less than zero from Err"))
        }
    }
}
```

输出为：

```rust
running 1 test
test tests::testing ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests test_lib

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

注意 ⚠️：不能对 `Result<T, E>` 使用 `#[should_panic]` 注解。

### 控制测试如何运行

`cargo test` 在测试模式下编译代码并运行生成的测试二进制文件，`cargo test` 产生的二进制文件的默认行为是并发运行所有测试，并截获测试中产生的输出，阻止它们显示出来。不过可以指定命令行参数来改变 `cargo test` 的默认行为。

#### 并行或连续的运行测试

<font color="red">当运行多个测试时，Rust 默认使用线程来并行运行</font>。因为测试是同时运行的，应该确保测试不能相互依赖。

如果不想测试是并行运行的，或者想要更加准确地控制线程的数量。可以传递 `--test-threads` 参数和希望使用的线程数量：

```bash
$ cargo test -- --test-threads=2
```

将测试线程设置为 2 个，并且告诉程序不要使用并行运行。

#### 显示函数输出

默认情况下，测试通过时并不会显示标准输出流的内容，比如 `println!` 。测试通过了，也不会在终端中看到 `println!` 的输出内容。如果测试失败了，则会看到所有标准输出和其他错误信息。

如果你想要看到通过测试中打印的值，可以加上 `--show-output` 参数告诉 Rust 显示成功测试的输出。

```bash
$ cargo test -- --show-output
```

#### 运行指定的测试

可以通过指定名字来运行部分测试，你可以向 `cargo test` 传递所希望运行的测试名称的参数来选择运行哪些测试。

```rust
pub fn plus(a: i32) -> i32 {
    a + 1
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn testing_one() {
        assert_eq!(2, plus(1));
    }

    #[test]
    fn testing_two() {
        assert_eq!(3, plus(2));
    }
}
```

如果没有传递参数，则三个测试函数都会并行运行。

向 `cargo test` 传递任意测试的名称来只运行这个测试，我们来只运行 `testing_one` 这个函数试试：

```bash
$ cargo test testing_one
```

输出为：

```rust
running 1 test
test tests::testing_one ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 1 filtered out; finished in 0.00s
```

只有名称为 `testing_one` 的测试被运行了。

同样地，我们可以指定部分测试的名称，任何匹配（包含关系）这个名称的测试都会被运行。

运行以下命令，看看是不是包含 `testing` 的测试名称的测试都会被运行。

```bash
$ cargo test testing
```

输出为：

```rust
running 2 tests
test tests::testing_one ... ok
test tests::testing_two ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

可以看到 `testing_one` 和 `testing_two` 都被运行了。

#### 忽略某些测试

有时候并不是所有的测试都希望运行，有些测试函数希望被忽略。可以使用 `ignore` 属性来标记耗时的测试并排除它们。

```rust
pub fn plus(a: i32) -> i32 {
    a + 1
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn testing_one() {
        assert_eq!(2, plus(1));
    }

    #[test]
    #[ignore]
    fn testing_two() {
        assert_eq!(3, plus(2));
    }
}
```

假设 `testing_two` 函数需要运行 2 小时，并使用 `ignore` 属性进行标记，再使用 `cargo test` 命令运行，输出为：

```rust
running 2 tests
test tests::testing_two ... ignored
test tests::testing_one ... ok

test result: ok. 1 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests test_lib

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

可以看到 `testing_two` 函数被标记为了 `ignored` ，并且没有运行。

但是我们只希望要运行被忽略的测试，可以给 `cargo` 添加 `--ignored` 参数：

```bash
$ cargo test -- --ignored
```

输出为：

```rust
running 1 test
test tests::testing_two ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 1 filtered out; finished in 0.00s

   Doc-tests test_lib

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

可以看到只运行了 `testing_two` 函数。

### 测试的组织结构

Rust 社区倾向于根据测试的两个主要分类来组织测试：

- 单元测试（unit tests）
- 集成测试（integration tests）

单元测试倾向于更小且更集中，在隔离的环境中一次测试一个模块；而集成测试对于你的库来说完全是外部的，只测试公有接口且每个测试都有可能会测试多个模块。抽象地来说，就是按独立还是整体来组织测试。

#### 单元测试

单元测试主要在与其他部分隔离的环境中测试每个单元的代码。

规范是在每个文件中创建包含测试函数的 `tests` 模块，并使用 `cfg(test)` 来标注模块。

```rust
// lib.rs

#[cfg(test)]
mod tests {
  #[test]
  fn testing() {
    assert!(2 + 3);
  }
}
```

`#[cfg(test)]` 注解告诉 Rust 只在执行 `cargo test` 时才编译和运行测试代码，而在 `cargo build` 时不这么做。这可以减少编译产生的文件大小，并且可以节省编译时间。

#### 集成测试

在 Rust 中，集成测试对于库来说完全是外部的，其他模块只能调用一部分库中的公有 API。集成测试的目的是测试库的多个部分是否能一起正常工作。

编写集成测试，需要创建一个 `tests` 目录，并与 `src` 文件夹同级。此时，`Cargo` 就会知道如何去找这个目录中的集成测试文件了。在 `tests` 目录中创建任意多个测试文件，`Cargo` 会将每一个文件当作单独的 `crate` 来编译。

因为每一个 `tests` 目录中的测试文件都是完全独立的 `crate` ，所以需要在每一个文件中导入库，也就是在文件顶部添加 `use adder`。

```rust
use adder;

#[test]
fn testing() {
   assert!(2 + 3);
}
```

注意 ⚠️：如果一个单元测试失败了，则不会有任何集成测试和文档测试的输出，因为这些测试只会在所有单元测试都通过后才会执行。

如果想要在集成测试中实现子模块，也就是封装了一个通用函数，该函数被其他测试文件调用了，可以使用 `mod`文件路径来实现子模块：

```
├── Cargo.lock
├── Cargo.toml
├── src
│   └── lib.rs
└── tests
    ├── sub
    │   └── mod.rs
    └── testing.rs
```

这告诉了 Rust 不要将 `sub` 看作一个集成测试文件，而是一个模块，这样在测试输出中就不会出现有关 `sub` 的输出了。

单元测试独立地验证库的不同部分，也能够测试私有函数实现细节。集成测试则检查多个部分是否能结合起来正确地工作，并像其他外部代码那样测试库的公有 API。

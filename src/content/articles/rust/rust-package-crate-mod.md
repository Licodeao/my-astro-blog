---
title: Rust 模块系统
author: Licodeao
publishDate: "2024-1-14"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 模块系统

### `crate`

`crate` 是 Rust 在<font color="red">编译时最小的代码单位</font>。

> 什么是 `crate` ?

`crate` 是指<font color="red">一个编译单元或模块的单位</font>，它<font color="red">可以是一个库（library crate）或一个二进制可执行程序（binary crate）</font>。

一个 `crate` 可以包含多个模块，这些模块可以包含函数、结构体、枚举等 Rust 代码。`crate root` 是一个源文件，Rust 编译器以它为起始点，去构成你的 `crate` 的根模块。`crate root` 文件将由 `Cargo` 传递给 `rustc` 来实际构建库或者二进制项目。

每一个 `crate` 都有一个唯一的名称，同时也对应着一个 `.rs` 文件或一个目录。`crate` 的名称通常与其文件或目录的名称相匹配，`crate` 的文件或目录中的代码可以通过 `mod` 关键字来组织为模块，并使用 `pub` 关键字来指定对外可见性。

通过在 Rust 代码中使用 `use` 关键字，可以导入其他 crate 或模块的功能，使得它们可以在当前 crate 中使用。这样可以实现代码的模块化和复用，并支持构建大型的 Rust 项目。

总而言之，<font color="red">crate 是 Rust 中代码组织和封装的基本单位，可以理解为一个某个小的片段，它允许将代码组织为模块，并提供了模块化、复用和共享的机制</font>。

### 包

一个包可以包含任意多个二进制 `crate` 项、一个可选的 `crate` 库和一个 `Cargo.toml` 文件。

`Cargo.toml` 文件描述了如何去构建这些 `crate`。`Cargo` 是一个构建代码的二进制包，同时 `Cargo` 也包含这些二进制项所依赖的库。

包更倾向于包含二进制 `crate` ，可以有任意个，或至多包含一个库 `crate` ，但至少包含一个 `crate` ，无论它是库 `crate` 还是二进制 `crate`。

### 模块

模块拥有一系列规则，组织代码时可以参考这些规则：

- 从 `crate root` 根节点开始

  编译一个 `crate` 时，编译器首先在 `crate` 根文件中寻找需要被编译的代码。

  对于一个库 `crate` 而言，其文件是 `src/lib.rs` ；对于一个二进制 `crate` 而言，其文件是 `src/main.rs`

- 声明模块

  使用 `mod` 关键字声明模块，如 `mod module`，编译器会在以下路径中寻找模块代码：

  - 内联，也即当前模块内
  - 在文件 `src/module.ts`
  - 在文件 `src/module/mod.rs`

- 声明子模块

  可以在其他文件中定义子模块，如 `mod sub_module`，编译器会在以下路径中寻找模块代码：

  - 内联，也即当前模块内
  - 在文件 `src/module/sub_module.rs`
  - 在文件 `src/module/sub_module/mod.rs`

- 模块中的代码路径

  一旦一个模块是 `crate` 的一部分，那就可以通过代码路径来引用该模块的代码，如 `crate::module::sub_module::get_values`

- 私有或公有

  <font color="red">一个模块里的代码默认对其父模块私有</font>。如果要使一个模块公用，可以在声明时使用 `pub` 关键字来定义模块。

  <font color="red">模块默认私有，则没有关键字</font>。

- `use` 关键字

  `use` 关键字可以创建一个成员的快捷方式，用来减少长路径的重复。

  如 `use crate::module::sub_module::get_values` 创建了一个快捷方式，随后则可以使用 `get_values`

`mod` 关键字声明了模块，<font color="red">Rust 则会在与模块同名的文件中查找模块的代码</font>。

来写个例子尝试一下这些规则，整个文件结构为以下结构：

```rust
rust_tests
├── Cargo.lock
├── Cargo.toml
└── src
    ├── module
    │   └── sub_module.rs
    ├── module.rs
    └── main.rs
```

在 `main.rs` 中的代码为：

```rust
use crate::module::sub_module::Example;

pub mod module;

fn main() {
  let example = Example {
    name: String::from("Licodeao"),
    age: 21,
  };

  println!("Name: {}, Age: {}", example.name, example.age);
}
```

可以看到在 `main.rs` 中使用了 `pub mod module` ，这告诉了编译器应该包含 `src/module.rs` 中的代码。

`module.rs` 中代码如下：

```rust
pub mod sub_module;
```

在 `module.rs` 中又告诉编译器需要包含 `src/module/sub_module.rs` 中的代码，`sub_module.rs` 中的代码为：

```rust
pub struct Example {
  pub name: String,
  pub age: u8,
}
```

在 `sub_module.rs` 中，定义了一个公用的结构体 `Example` ，在该结构体中有 `name` 和 `age` 两个字段。

使用 `cargo run` 运行程序后，输出为：

```rust
Name: Licodeao, Age: 21
```

回顾整个过程，就会发现在 Rust 中使用 `pub mod 模块名` 的形式来让编译器不断加入模块中的代码，这似乎也是一种引用关系，有点依赖图的影子，`main.rs -> module.rs -> sub_module.rs`。

> 模块中分组

模块可以让我们将一个 `crate` 中的代码进行分组，以提高代码可读性与重用性。

```rust
mod factory {
  mod assembly_line {
    fn pick_up_goods() {}

    fn assemble_goods() {}
  }

  mod executive_room {
    fn pay_salary() {}

    fn check_company_status() {}
  }
}
```

在上方，我们定义了一个工厂模块，而工厂中又分为了流水线模块和高管办公室模块，每个模块都在干着属于自己的事情，互不相扰。这样基于分组的模块，在下次向代码中添加新功能时，显而易见地能知道放到哪里，有利于代码的组织性。

> 引用模块的路径

路径有两种方式：

- 绝对路径：以 `crate` 根开头的全路径
- 相对路径：从当前模块开始，以 `self` 、`super` 或当前模块的标识符（模块名）开头

```rust
mod factory {
  mod assembly_line {
    fn pick_up_goods() {}
  }
}

pub fn market() {
  // 绝对路径
  crate::factory::assembly_line::pick_up_goods();

  // 相对路径
  factory::assembly_line::pick_up_goods();
}
```

`market` 函数是此时 `crate` 库的一个公共 API，所以使用 `pub` 关键字来标记。

选择使用绝对路径还是相对路径，要取决于你的项目，但更倾向于使用绝对路径。

> 使用 `pub` 暴露路径

上方代码编译后，会出现以下错误：

```rust
  |
9 |     crate::factory::assembly_line::pick_up_goods();
  |                     ^^^^^^^^^^^^^  ------------- function `pick_up_goods` is not publicly re-exported
  |                     |
  |                     private module
  |
note: the module `assembly_line` is defined here
 --> src/lib.rs:2:5
  |
2 |     mod assembly_line {
  |     ^^^^^^^^^^^^^^^^^

error[E0603]: module `assembly_line` is private
  --> src/lib.rs:12:14
   |
12 |     factory::assembly_line::pick_up_goods();
   |              ^^^^^^^^^^^^^  ------------- function `pick_up_goods` is not publicly re-exported
   |              |
   |              private module
   |
note: the module `assembly_line` is defined here
  --> src/lib.rs:2:5
   |
2  |     mod assembly_line {
   |     ^^^^^^^^^^^^^^^^^
```

在 Rust 中，<font color="red">父模块中的项不能使用子模块中的私有项，但是子模块中的项可以使用它们父模块中的项</font>。这是因为子模块封装并隐藏了它们的实现详情，但是子模块可以看到它们定义的上下文。

将 `mod assembly_line` 变成公有模块试试：

```rust
mod factory {
  pub mod assembly_line {
    fn pick_up_goods() {}
  }
}

pub fn market() {
  // 绝对路径
  crate::factory::assembly_line::pick_up_goods();

  // 相对路径
  factory::assembly_line::pick_up_goods();
}
```

使用 `cargo build` 编译后，出现以下错误：

```rust
  |
9 |     crate::factory::assembly_line::pick_up_goods();
  |                                    ^^^^^^^^^^^^^ private function
  |
note: the function `pick_up_goods` is defined here
 --> src/lib.rs:3:7
  |
3 |       fn pick_up_goods() {}
  |       ^^^^^^^^^^^^^^^^^^

error[E0603]: function `pick_up_goods` is private
  --> src/lib.rs:12:29
   |
12 |     factory::assembly_line::pick_up_goods();
   |                             ^^^^^^^^^^^^^ private function
   |
note: the function `pick_up_goods` is defined here
  --> src/lib.rs:3:7
   |
3  |       fn pick_up_goods() {}
   |       ^^^^^^^^^^^^^^^^^^
```

可以发现，虽然 `mod assembly_line` 变为公有了，但是其模块内的 `pick_up_goods` 依据报错来看，依然还是私有。

这说明：<font color="red">使模块公有并不使得其内容也是公有的</font>，模块上的 `pub` 关键字<font color="red">只允许其父模块引用它，而不允许访问内部代码</font>。

```rust
mod factory {
  pub mod assembly_line {
    pub fn pick_up_goods() {}
  }
}

pub fn market() {
    // 绝对路径
    crate::factory::assembly_line::pick_up_goods();

    // 相对路径
    factory::assembly_line::pick_up_goods();
}
```

将 `pick_up_goods` 函数变为公有，再使用 `cargo build` 命令时，就不会出现错误了。

> super 开始的相对路径

在路径的开头使用 `super` ，表示<font color="red">从父模块开始构建相对路径</font>，而不是从当前模块或者 `crate` 根开始。

```rust
fn pick_up_goods() {}

mod factory {
    fn assembly_line() {
        super::pick_up_goods();
    }

    fn executive_room() {}
}
```

`assembly_line` 函数在 `factory` 模块中，所以可以使用 `super` 进入 `factory` 父模块，也就是 `crate` 根。

> use 关键字将路径引入作用域

使用 `use` 关键字创建一个短路径，然后就能够在作用域中的任何地方使用更短的名字了。

```rust
// lib.rs

mod factory {
    pub mod assembly_line {
        pub fn pick_up_goods() {}
    }
}

use crate::factory::assembly_line;

fn handle() {
    assembly_line::pick_up_goods()
}
```

注意 ⚠️：`use` 只能创建 `use` 所在的特定作用域内的短路径。

```rust
// lib.rs

mod factory {
    pub mod assembly_line {
        pub fn pick_up_goods() {}
    }
}

use crate::factory::assembly_line;

mod anthor_factory {
    pub fn handle() {
        assembly_line::pick_up_goods()
    }
}
```

使用 `cargo build` 后，会出错：

```rust
   |
11 |         assembly_line::pick_up_goods()
   |         ^^^^^^^^^^^^^ use of undeclared crate or module `assembly_line`
   |
help: consider importing this module through its public re-export
   |
10 +     use crate::assembly_line;
   |

warning: unused import: `crate::factory::assembly_line`
 --> src/lib.rs:7:5
  |
7 | use crate::factory::assembly_line;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |
  = note: `#[warn(unused_imports)]` on by default
```

> 使用 `pub use` 重导出

尽管 `use` 关键字可以将某个名称导入当前作用域，这个名称可以在此作用域内使用，但是对此作用域外还是私有的。

如果想要让此名称在某个作用域外还能够使用，可以使用 `pub use` 来定义该名称，称为 "重导出"。<font color="red">不仅将一个名称导入了当前作用域，还允许别人把它导入他们的作用域</font>。

```rust
// lib.rs

mod factory {
    pub mod assembly_line {
        pub fn pick_up_goods() {}
    }
}

pub use crate::factory::assembly_line;

pub fn handle() {
    assembly_line::pick_up_goods()
}
```

> 嵌套路径

使用嵌套路径可以消除大量的 `use` 行

```rust
use std::cmp::Ordering;
use std::io;
```

以上可以合并为一个 `use` 行：

```rust
use std::{cmp::Ordering, io};
```

在合并为一个 `use` 行时，也可以使用 `self` ，场景是一个路径是另一个的子路径！

```rust
use std::io;
use std::io::Write;
```

使用 `self` 合并后：

```rust
use std::io::{self, Write};
```

这一行便将 `std::io` 和 `std::io::Write` 同时引入作用域。

---
title: Rust 生命周期
author: Licodeao
publishDate: "2024-1-22"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 生命周期

<font color="red">生命周期确保了引用有效</font>

Rust 中每一个引用都有其生命周期（lifetime），也就是引用保持有效的作用域。正如大部分类型是可以推断的，大部分时候生命周期也是可以推断的。

### 避免悬垂引用

<font color="red">避免悬垂引用，是生命周期的主要作用</font>。回顾一下悬垂引用带来的问题：它会导致程序引用了非预期引用的数据。

```rust
fn main() {
  let x;

  {
    let y = 66;
    x = &y;
  }

  println!("x: {}", x);
}
```

在这段代码中有一个外部作用域和一个内部作用域，可能你会发现变量 `x` 并没有值，这好像与 「Rust 中并不允许有空值」的结论相悖，这取决于你有没有在它还没赋值前使用它。如果你在它还没有赋值前就使用了它，这就会报错；反之，则不会。

```rust
fn main() {
  let x: i32;

  println!("x: {}", x);
}
```

输出为：

```rust
2 |   let x: i32;
  |       - binding declared here but left uninitialized
3 |
4 |   println!("x: {}", x);
  |                     ^ `x` used here but it isn't initialized
  |
  = note: this error originates in the macro `$crate::format_args_nl` which comes from the expansion of the macro `println` (in Nightly builds, run with -Z macro-backtrace for more info)
help: consider assigning a value
  |
2 |   let x: i32 = 0;
  |              +++
```

未赋值前就使用，会在编译时出现一个错误。

再回到讨论生命周期的问题，在代码中外部作用域声明了没有初始化的变量 `x`，在内部作用域中声明了一个初始值为 `55` 的变量 `y`，并尝试将 `x` 的值设置为一个 `y` 的引用，接着打印变量 `x` 的值。使用 `cargo run ` 运行程序后：

```rust
  |
5 |     let y = 66;
  |         - binding `y` declared here
6 |     x = &y;
  |         ^^ borrowed value does not live long enough
7 |   }
  |   - `y` dropped here while still borrowed
8 |
9 |   println!("x: {}", x);
  |                     - borrow later used here
```

发现并不能通过编译器编译，因为变量 `x` 引用的值在尝试使用前就已经离开了作用域了。错误信息也说明了 `borrowed value does not live long enough` ，借用的值活的不够久，也即变量 `x` 并没有存在的足够久。原因是变量 `x` 到达第 7 行内部作用域结束时就离开了作用域，不过变量 `y` 在外部作用域仍然是有效的。

> Rust 如何避免这种情况的？

倘若我们假设出错的代码行之有效，这会造成一个问题就是变量 `x` 将会引用在 `x` 离开作用域时被释放的内存，这时尝试任何对 `x` 的操作都不能正常了。当然这是假设的情况，那么 Rust 是怎么避免这种情况的呢？这得益于借用检查器。

> 什么是借用检查器？

<font color="red">在 Rust 编译器中，存在一个借用检查器（borrow checker），它比较作用域来确保所有的借用都是有效的</font>。如何去比较？在借用检查器中，每个变量都有一个生命周期注释，<font color="red">通过生命周期注释标注的范围来进行比较</font>。比如上方代码的生命周期注释是：

```rust
fn main() {
  let x;          			// ---------+-- 'a
                        //          |
  {                     //          |
      let y = 66;  			// -+-- 'b  |
      x = &y;           //  |       |
  }                     // -+       |
                        //          |
  println!("x: {}", x); //          |
}                       // ---------+
```

这里将变量 `x` 的生命周期标记为 `'a`，将变量 `y` 的生命周期标记为 `'b` 。可以看到，变量 `x` 的生命周期是要比变量 `y` 的生命周期大的，Rust 编译器在编译时会比较这两个生命周期的大小，并发现 `'a` 的生命周期比 `'b` 的生命周期要大得多，不过变量 `x` 引用了一个拥有生命周期 `'b` 的变量，Rust 编译器发现生命周期 `'b` 要比生命周期 `'a` 小得多，也即是：<font color="red">被引用的对象的生命周期比它的引用者的生命周期还要小，这种情况编译器拒绝编译</font>。

再来看看能通过编译的正确的写法的生命周期：

```rust
fn main() {
  let x = 66;      			// ----------+-- 'b
                        //           |
  let y = &x;     			// --+-- 'a  |
                        //   |       |
  println!("y: {}", y); //   |       |
                        // --+       |
}                       // ----------+
```

从代码看出，生命周期 `'a` 比生命周期 `'b` 要小得多，而被引用的对象的生命周期是 `'b` ，而引用者的生命周期是 `'a` ，完美符合编译器的原则：<font color="red">「一个有效的引用，是被引用的对象的生命周期有着比引用者更长的生命周期」</font>，也即是：数据比引用有着更长的生命周期。其实也不难理解，被引用的对象如果生命周期过短，很容易造成引用者的指针指向被释放的内存了，这就是悬垂引用产生的原因。当然，这些生命周期注释图并不是可视化的，而是 Rust 编译器在编译时其内部判断的规则。

### 泛型生命周期参数

倘若我们有一个函数，这个函数接受两个字符串 `slice` 类型的参数，并返回一个字符串 `slice` ：

```rust
fn main() {
  fn compare_string(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
      x
    } else {
      y
    }
  }

  let s1 = String::from("hello");
  let s2 = "abcdefghijklmn";
  let result = compare_string(&s1, &s2);
  println!("The longest string is {}", result);
}
```

初看实现好像没什么问题，但是使用 `cargo run` 运行程序后会出现以下问题：

```rust
  |
2 |   fn compare_string(x: &str, y: &str) -> &str {
  |                        ----     ----     ^ expected named lifetime parameter
  |
  = help: this function's return type contains a borrowed value, but the signature does not say whether it is borrowed from `x` or `y`
help: consider introducing a named lifetime parameter
  |
2 |   fn compare_string<'a>(x: &'a str, y: &'a str) -> &'a str {
  |                    ++++     ++          ++          ++
```

错误信息提示了返回值需要一个生命周期参数，因为 Rust 并不知道返回的引用是指向 `x` 还是 `y` ，同样借用检查器也无法确认 `x` 和 `y` 的生命周期如何与返回值的生命周期相关联，解决这个问题，需要使用泛型生命周期参数来定义引用之间的关系，以便借用检查器分析。

### 生命周期注解语法

<font color="red">生命周期注解语法并不能改变任何引用的生命周期的长短，它只负责描述多个引用生命周期相互的关系</font>。与函数签名中指定了泛型类型参数后就可以接受任何类型的参数一样，<font color="red">当指定了泛型生命周期参数后，函数就可以接受任何生命周期的引用了</font>。

> 注解语法

<font color="red">生命周期参数名称以撇号 `'` 开头</font>，名称通常是小写。生命周期参数注解位于引用 `&` 之后，并用一个空格来将引用类型和生命周期注解分隔开。

```rust
&'a i32 // 显式的生命周期的引用
&'a mut i32 // 显式的生命周期的可变引用
&i32 // 引用
```

一个没有生命周期参数的 `i32` 的引用，一个有叫做 `'a` 的生命周期参数的 `i32`的引用，和一个生命周期也是 `'a` 的 `i32` 的可变引用。

给之前的 `compare_string` 函数添加上泛型生命周期注解：

```rust
fn main() {
  fn compare_string<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
      x
    } else {
      y
    }
  }

  let s1 = String::from("hello");
  let s2 = "abcdefghijklmn";
  let result = compare_string(&s1, &s2);
  println!("The longest string is {}", result);
}

// 输出
// The longest string is abcdefghijklmn
```

生命周期注解告诉了 Rust 编译器多个引用的泛型生命周期参数之间是如何相互联系的。`compare_string` 函数有一个生命周期 `'a` 的 `字符串 slice` 的引用的参数 `x`。还有另一个同样是生命周期 `'a` 的 `字符串 slice`的引用的参数 `y`。这两个生命周期注解意味着引用 `x` 和 `y` 必须与这泛型生命周期存在得一样久，函数也会返回一个同样也与生命周期 `'a` 存在的一样长的 `字符串 slice`。

在函数签名中指定生命周期参数时，并没有改变任何传入值或返回值的生命周期，而是指出任何不满足这个约束条件的值都将被借用检查器拒绝。函数签名包含生命周期意味着 Rust 编译器的工作更加简单了。<font color="red">因为我们用相同的生命周期参数 `'a` 标注了返回的引用值，所以返回的引用值就能保证在 `x` 和 `y` 中较短的那个生命周期结束之前保持有效</font>。

```rust
fn main() {
  fn compare_string<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
      x
    } else {
      y
    }
  }

  let s1 = String::from("Hello Rust");
  let result;

  {
    let s2 = String::from("Hello Cargo");
    result = compare_string(s1.as_str(), s2.as_str());
  }

  println!("The longest string is {}", result);
}
```

上面代码使用 `cargo run` 运行后：

```rust
14 |     let s2 = String::from("Hello Cargo");
   |         -- binding `s2` declared here
15 |     result = compare_string(s1.as_str(), s2.as_str());
   |                                          ^^ borrowed value does not live long enough
16 |   }
   |   - `s2` dropped here while still borrowed
17 |
18 |   println!("The longest string is {}", result);
   |                                        ------ borrow later used here
```

这个错误揭示了 `result` 的引用的生命周期必须是两个参数中较短的那个，也即函数的返回值如果是个引用值，就能保证在两个参数的生命周期之间较短的那个生命周期结束之前保持有效。通过生命周期参数告诉 Rust 的是： `compare_string` 函数返回的引用的生命周期应该与传入参数的生命周期中较短那个保持一致。

另外，`as_str()` 方法的作用是提取包含整个字符串的字符串切片，也就是说将 `String` 类型转换为 `字符串 Slice` 类型。

对于函数签名，我们<font color="red">也可以只给其中一个参数指定生命周期注解，这样这个函数就总是返回其中一个参数了</font>，而不是两个参数之间生命周期较短的引用。

```rust
#![allow(unused)]
fn main() {
  fn compare_string<'a>(x: &'a str, y: &str) -> &'a str {
    x
  }

  let s1 = String::from("hello");
  let s2 = "abcdefghijklmn";
  let result = compare_string(s1.as_str(), s2);
  println!("The longest string is {}", result);
}
```

为参数 `x` 和返回值指定了生命周期参数 `'a`，不过没有为参数 `y` 指定，因为 `y` 的生命周期与参数 `x`和返回值的生命周期没有任何关系。

<font color="red">当从函数中返回一个引用，返回值的生命周期参数需要与一个参数的生命周期参数相匹配</font>。如果返回的引用没有指向任何一个参数，那么唯一的可能是其函数内部创建的值。然而它将会是一个悬垂引用，因为它将在函数结束时离开作用域，这时指向的就是一块被释放的内存了。

```rust
#![allow(unused)]
fn main() {
  fn compare_string<'a>(x: &str, y: &str) -> &'a str {
    let result = String::from("Hello Rust");
    result.as_str()
  }
}
```

输出为：

```rust
  |
5 |     result.as_str()
  |     ------^^^^^^^^^
  |     |
  |     returns a value referencing data owned by the current function
  |     `result` is borrowed here
```

即使返回值指定了生命周期参数 `'a`，但是也仍然通不过编译，因为返回值的生命周期与参数完全没有关联。`result` 将在函数调用结束后离开作用域并被清理，而代码尝试从函数中返回一个 `result` 的引用，仍然是经典的悬垂引用问题。

总结就是<font color="red">生命周期语法用于将函数的多个参数与其返回值的生命周期进行关联</font>。一旦它们形成了某种关联，Rust 就能够阻止悬垂指针等内存安全问题了。

### 结构体中的生命周期注解

结构体定义中的每一个引用可以添加生命周期注解。

```rust
#![allow(unused)]
struct Person<'a> {
  name: &'a str,
  age: u8,
}

fn main() {
  let person = Person {
    name: String::from("Hello Rust").as_str(),
    age: 21
  };
}
```

上方代码中的结构体有一个字段 `name` ，它存放了一个 `字符串 slice` ，这是一个引用。类似于泛型参数类型，必须在结构体名称后面的尖括号中声明泛型生命周期参数，以便在结构体中定义使用生命周期参数。

### 生命周期省略

每一个引用都有一个生命周期，而且我们需要为那些使用了引用的函数或结构体指定生命周期。在早期 Rust 版本中，每一个引用都必须有明确的生命周期，当时的函数签名是这样的：

```rust
fn dep<'a>(s: &'a str) -> &'a str {
  ...
}
```

这种明确且强制的要求，导致了很多重复代码的出现，总是重复地编写一摸一样的生命周期注解。Rust 团队随后就把这些可预测的并且遵循几个明确的模式，编码进了 Rust 编译器，如此借用检查器在这些情况下就能推断出生命周期而不再强制开发者显式地增加注解。

<font color="red">被编码进 Rust 引用分析的模式被称为生命周期省略规则（lifetime elision rules）</font>。这为开发者提供了便利，这些规则是一些特定的场景，编译器会考虑如果代码符合这些场景，就无需明确指定生命周期。这些省略规则并不提供完整的推断，如果 Rust 在明确遵守这些规则的前提下变量的生命周期注解来解决错误问题的地方给出一个提示，而不是进行推断或猜测。

<font color="red">函数或方法的参数的生命周期被称为输入生命周期（input lifetimes），而返回值的生命周期被称为输出生命周期（output lifetimes）</font>。

编译器使用<font color="red">三条规则</font>来判断引用何时不需要明确的注解：

- 编译器为每一个引用参数都分配一个生命周期参数，也就是说函数有一个引用参数，就有一个生命周期参数
- 如果只有一个输入生命周期参数，那么它被赋予所有输出生命周期参数
- 如果方法有多个输入生命周期参数并且其中一个参数是 `&self` 或 `&mut self` ，说明是个对象的方法，那么所有输出生命周期参数被赋予给 `self` 的生命周期。

```rust
// 普通函数
fn dep(s: &str) -> &str {}

// 应用第一条规则
fn dep<'a>(s: &'a str) -> &str {}

// 应用第二条规则
fn dep<'a>(s: &'a str) -> &'a str {}

// 应用第三条规则(只适用于方法签名)
struct Person<'a> {
  name: &'a str,
}

impl<'a> Person<'a> {
  fn value(&self, p: &str) -> &str {
   	self.name
  }
}

// 三条规则都不适用，则会报错
fn dep<'a, 'b>(x: &'a str, y: &'b str) -> &str {}
```

### 方法中的生命周期注解

当为带有生命周期的结构体实现方法时，其语法依然类似于结构体中的生命周期注解语法。

实现方法时，结构体字段的生命周期必须总是在 `impl` 关键字后声明，并在结构体名称之后使用。

```rust
struct Person<'a> {
  name: &'a str,
}

impl<'a> Person<'a> {
  fn value(&self, p: &str) -> &str {
   	self.name
  }
}
```

`impl` 之后和类型名称之后的生命周期参数是必要的。这里有两个输入生命周期，所以 Rust 应用第一条生命周期省略规则并给予 `&self` 和 `p` 它们各自的生命周期。接着，因为其中一个参数是 `&self` ，返回值类型被赋予了 `&self` 的生命周期。

### 静态生命周期

<font color="red">静态生命周期是一种特殊的生命周期，使用 `'static` 定义，其生命周期能够存活于整个程序期间</font>。所有的字符串字面值都拥有 `'static` 生命周期。

```rust
let s: &'static str = "Hello Rust";
```

这个字符串的文本被直接存储在程序的二进制文件中，而且这个二进制文件总是可用的。

### 结合 `trait bounds`

```rust
#![allow(unused)]
use std::fmt::Display;

fn main() {
  fn value<'a, T>(
    x: &'a str,
    y: &'a str,
    z: T
  ) -> &'a str
  where
    T: Display
  {
    if x.len() > y.len() {
      x
    } else {
      y
    }
  }
}
```

因为生命周期也是泛型，所以生命周期参数 `'a` 和泛型类型参数 `T` 都位于函数名后的同一尖括号列表中。

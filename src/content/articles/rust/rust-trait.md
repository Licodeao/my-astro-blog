---
title: Rust Trait
author: Licodeao
publishDate: "2024-1-20"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## Trait

`trait` 定义了<font color="red">某个特定类型拥有可能与其他类型共享的功能</font>。通过 `trait` 以抽象的方式定义共同行为。

### 定义 `trait`

<font color="red">一个类型的行为由其可供调用的方法构成</font>。对不同类型调用相同的方法，这些类型就可以共享相同的行为了。`trait` 定义是一种将方法签名组合起来的方法。

```rust
pub trait GetInfo {
  fn value(&self) -> String;
}
```

这里使用 `trait` 关键字来声明一个 `trait` ，后面跟着的是 `trait` 的名字，同样可以设置 `trait` 是否公有。

<font color="red">`trait` 有点类似于接口，在方法签名后跟分号，而不是在大括号中提供其实现</font>。每一个实现这个 `trait` 的类型都需要提供其自定义行为的方法体。

`trait` 中可以有多个方法签名，一行一个方法签名且都以分号结尾。

### 实现 `trait`

```rust
fn main() {
  pub trait GetInfo {
    fn value(&self) -> String;
  }

  pub struct NormalInfo {
    pub title: String,
    pub content: String,
    pub author: String,
  }

  impl GetInfo for NormalInfo {
    fn value(&self) -> String {
      format!("title: {}, content: {}, author: {}", self.title, self.content, self.author)
    }
  }

  pub struct AmazingInfo {
    pub title: String,
    pub reason: String,
    pub author: String,
    pub is_important: bool,
  }

  impl GetInfo for AmazingInfo {
    fn value(&self) -> String {
      format!("title: {}, reason: {}, author: {}, is_important: {}", self.title, self.reason, self.author, self.is_important)
    }
  }
}
```

`impl` 关键字后跟着的是需要实现 `trait` 的名称，`for` 后跟着的是需要实现 `trait` 的类型的名称，也即在某个类型上实现某个 `trait`。

### 默认实现

可以为 `trait` 中的某些或全部方法提供默认的行为。这样当为某个特定类型实现 `trait` 时，可以选择保留或重载每个方法的默认行为。

```rust
pub trait GetInfo {
  fn value(&self) -> String {
    String::from("Hello Trait")
  }
}
```

这里给 `GetInfo trait` 的 `value` 方法提供了一个默认的字符串值，而不只是定义方法签名了。

> 如何使用默认实现？

通过指定一个空的 `impl` 块即可。

```rust
pub trait GetInfo {
  // 默认实现
  fn value(&self) -> String {
    String::from("Hello Trait")
  }
}

pub struct NormalInfo {
  pub title: String,
  pub content: String,
  pub author: String,
}

// 使用默认实现
impl GetInfo for NormalInfo {}
```

通过 `impl GetInfo for NormalInfo {}` 指定了一个空的 `impl` 块，以此使用默认实现。

使用了默认实现，并不代表将原来的 `trait` 方法签名给覆盖掉了，而是实例依然能够使用方法签名。

<font color="red">默认实现允许调用相同的 `trait` 中的其他方法，哪怕这些方法没有默认实现</font>。

### `trait` 作为参数

使用 `trait` 来接受多种不同类型的参数。

```rust
fn main() {
  pub trait GetInfo {
    fn value(&self) -> String;
  }

  pub fn console(item: &impl GetInfo) {
    println!("{}", item.value());
  }
}
```

参数 `item` 指定了 `impl` 关键字和 `GetInfo trait` ，该参数支持任何实现了指定 `trait` 的类型。在 `console` 函数体中，可以调用任何来自 `GetInfo trait` 的方法。

### `Trait Bound`

`trait bound` 实际上是一种较长形式的语法糖。

```rust
fn main() {
  pub trait GetInfo {
    fn value(&self) -> String;
  }

  // trait bound
  pub fn console<T: GetInfo>(item: &T) {
		println!("{}", item.value());
  }
}
```

相较于前面的例子，<font color="red">`trait bound` 与泛型参数声明在一起，位于尖括号中的冒号后面</font>。

与 `impl Trait` 相比，`trait bound` 更适合用于复杂的场景，而 `impl Trait` 适用于短小的场景：

```rust
fn main() {
  pub trait GetInfo {
    fn value(&self) -> String;
  }

  // impl trait 语法
	pub fn console(item1: &impl GetInfo, item2: &impl GetInfo) {
    println!("item1: {}, item2: {}", item1.value(), item2.value());
  }

  // trait bound 语法
  pub fn console2<T: GetInfo>(item1: &T, item2: &T) {
    println!("item1: {}, item2: {}", item1.value(), item2.value());
  }
}
```

从代码中可以看出，`impl Trait` 语法在函数参数的角度来说，确实是更长一点，并且 `item1` 和 `item2` 允许是不同类型的情况，只要它们都实现了 `GetInfo` 。而 `trait bound` 语法在函数参数的角度则更短一点，并且 `item1` 和 `item2` 是相同的类型。

> 通过 `+` 指定多个 `trait bound`

`+` 也可以适用于 `impl Trait` 语法。

```rust
fn main() {
  pub trait GetInfo {
    fn value(&self) -> String;
  }

  pub trait GetMessage {
    fn message(&self) -> String;
  }

  pub fn console(item: &(impl GetInfo + GetMessage)) {
    println!("Value: {}, Message: {}", item.value(), item.message());
  }
}
```

通过 `+` 指定多个 `trait bound`

```rust
fn main() {
  pub trait GetInfo {
    fn value(&self) -> String;
  }

  pub trait GetMessage {
    fn value(&self) -> String;
  }

  pub fn console<T: GetInfo + GetMessage>(item: &T) {
    println!("Value: {}, Message: {}", item.value(), item.message());
  }
}
```

看着还是很清晰的～

由于 `trait bound` 是一种较长形式的语法糖，所以当过多的 `trait bound` 也有缺点，每个泛型有自己的 `trait bound` ，所以有多个泛型参数的函数在函数名称和参数列表之间会有很长的 `trait bound` 信息，这导致函数签名难以阅读。于是，Rust 给出了一个解决办法——使用 `where` 简化过多的 `trait bound`

> 使用 `where` 简化 `trait bound`

未使用 `where` 简化前：

```rust
fn main() {
  pub trait GetInfo {
    fn value(&self) -> String;
  }

  pub trait GetMessage {
    fn message(&self) -> String;
  }

  pub trait GetResult {
    fn result(&self) -> String;
  }

	pub fn console<T: GetInfo + GetMessage, E: GetMessage + GetResult>(t: &T, e: &E) {
    println!("Value: {}, Message: {}, Result: {}", t.value(), t.message(), e.result());
  }
}
```

可以看到 `trait bound` 非常长，这还是只有 3 个 `trait` 的时候...

使用 `where` 简化 `trait bound`：

```rust
fn main() {
  pub trait GetInfo {
    fn value(&self) -> String;
  }

  pub trait GetMessage {
    fn message(&self) -> String;
  }

  pub trait GetResult {
    fn result(&self) -> String;
  }

  // 使用 where 简化 trait bound
	pub fn console<T, E>(t: &T, e: &E)
  where
    T: GetInfo + GetMessage,
    E: GetMessage + GetResult,
  {
    println!("Value: {}, Message: {}, Result: {}", t.value(), t.message(), e.result());
  }
}
```

看起来好像复杂了，其实也还好，但是使用 `where` 简化 `trait bound` 确实达到了目的，确实解决了之前提到的问题。

### 返回实现了 `trait` 的类型

可以<font color="red">在返回值中使用 `impl Trait` 语法，来返回实现了某个 `trait` 的类型</font>：

```rust
fn main() {
  pub trait GetInfo {
    fn value(&self) -> String;
  }

  pub struct NormalInfo {
    pub title: String,
    pub content: String,
    pub author: String,
  }

  impl GetInfo for NormalInfo {
    fn value(&self) -> String {
      format!("title: {}, content: {}, author: {}", self.title, self.content, self.author);
    }
  }

  fn reture() -> impl GetInfo {
    NormalInfo {
      title: String::from("Title"),
      content: String::from("Content"),
      author: String::from("Author"),
    }
  }
}
```

<font color="red">通过 `impl GetInfo` 作为返回值类型，指定了 `return` 函数返回某个实现了 `GetInfo trait` 的类型</font>，但是不确定具体的类型。

对任何实现了特定的 `trait` 的类型有条件地实现 `trait` ，好绕啊？你可以理解为在 `trait` 上实现 `trait`，只不过某个 `trait` 是有类型限制的。

```rust
impl<T: GetInfo> ToString for T {
  // ...
}
```

在实现了 `GetInfo trait` 的类型上实现了 `ToString trait` 。

对于任何满足特定 `trait bound` 的类型实现 `trait` ，也即在 `trait bound` 上实现 `trait` ，这种行为被称为 `blanket implementations` （一揽子实现或覆盖实现）。

这个的作用就是可以对任何实现了 `GetInfo trait` 的类型调用 `ToString` 类型的 `to_string` 方法。

## 总结

`trait` 和 `trait bound` 使用泛型类型参数来减少重复，并且泛型还拥有单态化的特性，因此泛型可以使得代码更具通用性和灵活性，以及更好的性能。编译器利用 `trait bound` 在编译时检查代码中所用到的具体类型是否提供了正确的行为，这避免了在运行时出现错误。

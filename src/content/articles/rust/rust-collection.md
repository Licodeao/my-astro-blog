---
title: Rust 常用集合
author: Licodeao
publishDate: "2024-1-16"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 常见集合

Rust 标准库中包含了一系列被称为集合（collections）的非常有用的数据结构，集合可以包含多个值，并且不同于内建的数据或元组类型，<font color="red">集合内的数据是存储在堆上的，这意味着集合内数据的数量不必在编译时知道</font>。在 Rust 中，`vector` 、字符串、`hash map` 这三个是比较常用的集合类型。

### Vector

`vector` 允许我们<font color="red">一个挨着一个地存储一系列数量可变的值</font>，其类型是 `Vec<T>`。`vector` <font color="red">只能存储相同类型的值</font>。

> 创建 vector

通过 `Vec::new` 可以创建一个空的 `vector`

```rust
let v: Vec<i32> = Vec::new();
println!("v is {}", v.len());
```

为了方便，Rust 也提供了一个更简短地创建 `vector` 的 `vec! ` 宏：

```rust
let v = vec![666, 666, 666];
println!("v = {:?}", v);
```

这里没有显式地标注类型，是因为在此时 Rust 可以自动推断类型。

还可以通过 `Vec::from` 创建一个 `vector`

```rust
let v = Vec::from([666, 666, 666]);
println!("v = {:?}", v);
```

> 修改 vector

通过 `push` 方法向 `vector` 增加元素：

```rust
let mut v = Vec::from([666, 666, 666]);
v.push(777);
println!("v = {:?}", v);
```

注意 ⚠️：这时候需要使用 `mut` 关键字使其可变，因为需要改变 `vector` 的值。

通过 `remove` 方法删除 `vector` 中某个元素，通过索引来删除具体元素：

```rust
let mut v = Vec::from([666, 666, 666]);
v.push(777);
println!("v = {:?}", v);

v.remove(3);
println!("v = {:?}", v);
```

通过 `clear` 方法直接清空 `vector` 里的元素

```rust
let mut v = Vec::from([666, 666, 666]);
v.push(777);
println!("v = {:?}", v);

v.remove(3);
println!("v = {:?}", v);

v.clear();
println!("v = {:?}", v);

// v = [666, 666, 666, 777]
// v = [666, 666, 666]
// v = []
```

可以通过 索引或 `get` 方法，来获取 `vector` 中的元素：

```rust
#![allow(unused)]
fn main() {
  let v = vec![666, 666, 666];

  // 索引方式
  let first_element = &v[0];

  println!("index pattern: {first_element}");

  // Option get方式
  let first_element: Option<&i32> =  v.get(0);

  match first_element {
      Some(ele) => println!("ele: {}", ele),
      None => println!("None"),
  }
}
```

通过索引访问一个不存在的元素，即引用一个不存在的元素时，Rust 会造成 `panic` 。

通过 `get` 方法访问一个不存在的元素时，Rust 不会造成 `panic` 而是返回 `None` ，它可以容忍偶尔出现超过 `vector` 范围的访问，也就是说这种方式下出现越界访问属于正常情况，不会造成 `panic` 。

在使用索引方式来获取 `vector` 中的元素时，需要特别注意借用规则：

```rust
#![allow(unused)]
fn main() {
  let v = vec![666, 666, 666];

  // 索引方式
  let first_element = &v[0];

  v.push(888);

  println!("index pattern: {first_element}");
}
```

上方代码通过索引方式来访问 `vector` 中元素时，就与借用规则产生了冲突，不可变引用和可变引用不能同时存在于相同作用域中。

> 那为什么 `vector` 结尾的变化会关联到第一个元素的引用？

是由于 `vector` 的工作方式，在没有足够空间并在 `vector` 的结尾增加新元素时，所有元素依次相邻存放，可能会要求分配新内存并老的元素拷贝到新空间内。这时，第一个元素的引用就指向了被释放的内存。于是，借用规则防止了这个情况的发生。

使用 `for` 循环来获取 `vector` 中的每一个元素的不可变引用

```rust
#![allow(unused)]
fn main() {
  let v = vec![666, 666, 666];

  for i in &v {
    println!("{}", i);
  }
}
```

遍历可变 `vector` 中的每一个元素的可变引用以便能改变它们

```rust
#![allow(unused)]
fn main() {
  let mut v = vec![666, 666, 666];

  for i in &mut v {
    // 为了修改可变引用所指向的值，必须使用解引用运算符 (*) 来获取 i 的值
    *i += 1;
  }

  println!("{:?}", v);
}
```

> 使用枚举来存储多种类型

`vector` 只能存储相同类型的值，这固然满足不了某些场景。结合枚举，就能在 `vector` 中存放多种类型了。由于枚举的成员都被定义为相同的枚举类型，所以当需要在 `vector` 中存储不同的类型值时，可以定义一个枚举。

```rust
fn main() {
  enum Apple {
    SmallApple(i32),
    MiddleApple(f64),
    BigApple(String),
  }

  let v = vec![
    Apple::SmallApple(6),
    Apple::MiddleApple(6.6),
    Apple::BigApple(String::from("BigApple"))
  ];

  for i in &v {
    match i {
      Apple::SmallApple(i) => println!("SmallApple: {}", i),
      Apple::MiddleApple(i) => println!("MiddleApple: {}", i),
      Apple::BigApple(i) => println!("BigApple: {}", i),
    }
  }
}

// 输出为
SmallApple: 6
MiddleApple: 6.6
BigApple: BigApple
```

Rust 在编译时就必须准确地知道 `vector` 中类型的原因是因为<font color="red">编译器需要知道存储每个元素到底需要多少内存</font>。

> `vector` 在离开作用域时会被释放

```rust
#![allow(unused)]
fn main() {
  {
    let v = vec![1, 2, 3];
  } // v 被释放掉了
}
```

<font color="red">当 `vector` 被丢弃时，所有其内容也会被丢弃！</font>

### 字符串

字符串是字符的集合。<font color="red">字符串可能指的是 `String` 或 string slice ` &str` 类型，而不仅仅是其中一种类型</font>。

通过 `String::new` 方法新建一个空的字符串

```rust
let mut s = String::new();
```

也可以通过 `String::from` 方法从字符串字面值创建 `String`

```rust
let s = String::from("Hello Rust!");
```

`String` 的大小可以增加，其内容也可以改变，因为它是一种可增长、可变、可拥有、UTF-8 编码的字符串类型。

可以使用 `push` 或 `push_str` 来更新字符串

```rust
fn main() {
  let mut s1 = String::from("Hello");
  s1.push_str(" Rust");
  println!("{}", s1);
}
```

`push` 方法获取一个<font color="red">单独的字符</font>作为参数，并附加到 `String` 中。

```rust
fn main() {
  let mut s1 = String::from("Hello");
  s1.push('!');
  println!("{}", s1);
}
```

对于复杂的字符串链接，可以使用 `format!` 宏：

```rust
fn main() {
  let s1 = String::from("Hello");
  let s2 = String::from("World");
  let s3 = String::from("!");

  let s = format!("{}-{}{}", s1, s2, s3);

  println!("{}", s);
}
```

与其他语言不一样，<font color="red">Rust 的字符串并不支持索引</font>！

### Hash Map

`Hash Map` 允许我们将值与一个特定的 `key` 相关联，其类型为 `HashMap<K, V>` 。`HashMap<K, V>` 类型存储了一个键类型 `K` 对应一个值类型 `V` 的映射。它通过一个哈希函数来实现映射，决定如何将键和值放入内存中。<font color="red">`Hash Map` 存储的数据都储存在堆上</font>。

新建一个 `Hash Map` ，可以通过 `new` 创建一个空的 `HashMap`：

```rust
use std::collections::HashMap;

fn main() {
  let mut company = HashMap::new();
  company.insert(String::from("Boss"), 56);
  company.insert(String::from("Worker"), 32);

  println!("company: {:?}", company);
}
```

可以通过 `get` 方法来从 `Hash Map` 中获取值，该方法返回 `Option<&V>`，如果某个键在 `Hash Map` 中没有对应的值，会返回 `None`：

```rust
use std::collections::HashMap;

fn main() {
  let mut company = HashMap::new();
  company.insert(String::from("Boss"), 56);
  company.insert(String::from("Worker"), 32);

  let name = String::from("Boss");
  let age = company.get(&name).copied().unwrap_or(0);
  println!("age: {:?}", age); // 输出为：56
}
```

遍历 `Hash Map`，<font color="red">会以任意顺序打印出每一个键值对</font>

```rust
use std::collections::HashMap;

fn main() {
  let mut company = HashMap::new();
  company.insert(String::from("Boss"), 56);
  company.insert(String::from("Worker"), 32);

  for (key, value) in &company {
    println!("{}: {}", key, value);
  }
}
```

> 更新 Hash Map

如果插入了一个键值对，并且<font color="red">用相同的键插入了一个不同的值，与这个值相关联的旧值将被覆盖</font>。

```rust
use std::collections::HashMap;

fn main() {
  let mut company = HashMap::new();
  company.insert(String::from("Boss"), 56);
  company.insert(String::from("Worker"), 32);

  company.insert(String::from("Boss"), 88);

  for (key, value) in &company {
    println!("{}: {}", key, value);
  }
}
```

如果哈希 `Map` 中键已经存在，则不做任何操作；如果不存在则连同值一块插入。这种判断非常常见，在 Rust 有一个专门的 API 用于描述，叫做 `entry` 。它获取我们想要检查的键作为参数，返回一个枚举 `Entry` 。

```rust
use std::collections::HashMap;

fn main() {
  let mut company = HashMap::new();
  company.insert(String::from("Boss"), 56);
  company.insert(String::from("Worker"), 32);

  company.insert(String::from("Boss"), 88);

  company.entry(String::from("Manager")).or_insert(45);

  for (key, value) in &company {
    println!("{}: {}", key, value);
  }
}
```

`Entry` 的 `or_insert` 方法<font color="red">在键对应的值存在时，就返回这个值对应的可变引用；如果不存在则将参数作为新值插入并返回新值的可变引用</font>。

输出为：

```rust
Manager: 45
Boss: 88
Worker: 32
```

注意，遍历 `Hash Map` 会以任意顺序进行输出。

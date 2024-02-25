---
title: Rust 引用与借用
author: Licodeao
publishDate: "2023-12-15"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 引用与借用

```rust
fn main() {
    let s1 = String::from("hello");

  	// 解构
    let (s2, len) = calculate_length(s1);

    println!("The length of '{}' is {}.", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len(); // len() 返回字符串的长度

    (s, length)
}
```

在上方代码里，必须要将 `String` 返回给调用函数，以便在调用 `calculate_length` 函数后仍然能使用 `String`，因为 `String` 被移动到了 `calculate_length` 中，这显然是不方便的。

### 引用

Rust 提供了一个<font color="red">不用获取所有权就可以使用值的功能，叫做 **引用**（_references_）</font>，引用像一个指针，因为它是一个地址，由此可以访问存储于该地址的其他变量的数据，同时<font color="red">引用能够确保指向某个特定类型的有效值</font>。

```rust
fn main() {
  let s1 = String::from("hello");

  let slen = calculate_string(&s1);

  println!("The length of '{}' is {}.", s1, slen);
}

fn calculate_string(s: &String) -> usize {
  s.len()
}
```

上方代码就是使用了引用。

`&String s` 指向 `String s1` 的内存示意图：

<img src="https://kaisery.github.io/trpl-zh-cn/img/trpl04-05.svg" />

```rust
  let s1 = String::from("hello");

  let slen = calculate_string(&s1);
```

`&s1` 创建了一个指向 `s1` 的引用，<font color="red">正因为是引用，所以不是拥有它。因为没有拥有，所以当引用停止使用时，它所指向的值也不会被丢弃</font>。

```rust
fn calculate_string(s: &String) -> usize {
  s.len()
}
```

同理，函数签名使用了 `&String` 表明了函数参数 `s` 是一个引用。当 `s` 停止使用时并不丢弃引用所指向的数据，因为 `s` 没有所有权。<font color="red">当函数使用引用而不是实际值作为参数，无需返回值来交还所有权</font>，因为从来没有拥有过。

### 借用

<font color="red">将创建一个引用的行为称为借用（borrowing）</font>

```rust
fn main() {
  let s1 = String::from("hello");

  change(&s1);
}

fn change(s: &String) {
  s.push_str("{}, World!");
}
```

在上面，我们尝试修改借用的值，在编译后发现行不通。

```rust
    |
105 |   s.push_str("{}, World!");
    |   ^ `s` is a `&` reference, so the data it refers to cannot be borrowed as mutable
    |
help: consider changing this to be a mutable reference
    |
104 | fn change(s: &mut String) {
    |               +++
```

<font color="red">正如变量是不可变的，引用也一样，默认不允许修改引用的值。</font>

### 可变引用

既然默认不可以改变引用的值，那么还是有办法去改变引用的值。

```rust
fn main() {
  let mut s1 = String::from("hello");

  change(&mut s1);
}

fn change(s: &mut String) {
  s.push_str("{}, World!");
}
```

将变量 `s1` 变为可变的，然后在调用 `change` 函数的地方创建一个可变引用 `&mut s1` ，同时更新 `change` 函数可以接受一个可变引用 `s: &mut String` ，这就表明了 `change` 函数将改变它所借用的值。

<font color="red">允许我们去修改一个借用的值，这就是可变引用（mutable reference）</font>

<font color="red">可变引用有一个限制：如果你有一个对该变量的可变引用，就不能再创建对该变量的引用。</font>

```rust
let mut s = String::from("Hello");

let r1 = &mut s;
let r2 = &mut s;

println!("{}, {}", r1, r2);
```

```rust
    |
101 |   let r1 = &mut s;
    |            ------ first mutable borrow occurs here
102 |   let r2 = &mut s;
    |            ^^^^^^ second mutable borrow occurs here
103 |
104 |   println!("{}, {}", r1, r2);
    |                      -- first borrow later used here
```

这个报错说明我们不能同一时间创建多个可变变量借用。第一个可变的借用在 `r1` 中，它持续到了 `println!` 。但是在 `r1` 可变引用的创建和使用之间，又创建了一个可变引用。

<font color="red">防止同一时间对同一数据存在多个可变引用，这个好处就是 Rust 可以在编译时避免数据竞争。</font>

数据竞争可以由三个行为造成：

- 两个或更多指针同时访问同一数据
- 至少有一个指针被用来写入数据
- 没有同步数据访问的机制

数据竞争会导致未定义行为的出现，难以在运行时追踪，Rust 避免了这种情况发生，因为 Rust 在编译时就不会出现数据竞争的代码！

可以<font color="red">使用大括号来创建一个新的作用域，以允许拥有多个可变引用，但是不能 "同时" 拥有</font>：

```rust
let mut s = String::from("hello");

{
    let r1 = &mut s;
} // r1 在这里离开了作用域，所以我们完全可以创建一个新的引用

let r2 = &mut s;
```

再拥有不可变引用时，又会有怎样的问题出现？

```rust
let mut s = String::from("Hello");

let r1 = &s; // 不可变引用
let r2 = &s; // 不可变引用
let r3 = &mut s; // 可变引用

println!("{}, {}, {}", r1, r2, r3);
```

错误如下：

```rust
    |
101 |   let r1 = &s; // 不可变引用
    |            -- immutable borrow occurs here
102 |   let r2 = &s; // 不可变引用
103 |   let r3 = &mut s; // 可变引用
    |            ^^^^^^ mutable borrow occurs here
104 |
105 |   println!("{}, {}, {}", r1, r2, r3);
    |                          -- immutable borrow later used here
```

我们也<font color="red">不能在拥有不可变引用时，同时拥有可变引用！</font>多个不可变引用是可以的！

```rust
let mut s = String::from("hello");

let r1 = &s; // 不可变引用
let r2 = &s; // 不可变引用
println!("{} and {}", r1, r2);
// 此位置之后 r1 和 r2 不再使用

let r3 = &mut s; // 可变引用
println!("{}", r3);
```

<font color="red">一个引用的作用域是从声明的地方开始一直持续到最后一次使用为止</font>。所以以上代码是能够通过编译的。

### 悬垂引用

在具有指针的语言，很容易出现<font color="red">释放内存时保留指向它的指针而错误地生成悬垂指针</font>。

悬垂指针是指<font color="red">其指向的内存可能已经被分配给其他持有者了</font>。在 Rust 中编译器确保引用永远不会出现悬垂指针的情况。

```rust
fn main() {
  let value = dangling_pointer();
}

fn dangling_pointer() -> &String {
  let s = String::from("hello");

  &s
}
```

会出现以下错误：

```rust
    |
101 |   fn dangling_pointer() -> &String {
    |                            ^ expected named lifetime parameter
    |
    = help: this function's return type contains a borrowed value, but there is no value for it to be borrowed from
help: consider using the `'static` lifetime
    |
101 |   fn dangling_pointer() -> &'static String {
```

这个错误揭示了 `dangling_pointer` 函数返回了一个不可变引用，但是没有找到这个引用。

为什么会这样呢？

```rust
fn main() {
  let value = dangling_pointer();
}

fn dangling_pointer() -> &String {
  let s = String::from("hello"); // 变量 s 在 dangling_pointer 方法中创建

  &s // 返回字符串 s 的不可变引用
} // 这里作用域结束，变量 s 被丢弃，其内存被释放
```

因为变量 `s` 是在 `dangling_pointer` 方法中创建的，当该方法执行完毕后，变量 `s` 也被释放了。这时返回它的引用，该引用指向的是一个无效的 `String` !

解决办法就是直接返回 `String`:

```rust
fn dangling_pointer() -> String {
  let s = String::from("hello");

  s
}
```

关于引用总结就是：

- 可变引用和不可变引用不能同时存在，同时要注意不能对同一数据创建多个可变引用
- 引用总是有效的，无效的引用会造成悬垂引用的问题

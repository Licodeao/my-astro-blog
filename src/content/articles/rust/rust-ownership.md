---
title: Rust 所有权
author: Licodeao
publishDate: "2023-12-8"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 所有权

所有权是 Rust 语言最为显著的特点，<font color="red">它让程序不用进行垃圾回收即可保证内存安全</font>。

> 所有权是什么？

有的编程语言拥有属于自己的垃圾回收机制，有的编程语言则需要开发者自己去实现垃圾回收，而 <font color="red">Rust 则是使用了第三种方式——拥有属于自己的所有权系统来管理内存</font>。

编译器在编译的时候，会根据一系列规则来进行检查，<font color="red">如果违反了某些规则，程序则不能通过编译</font>。在运行时，所有权的一系列功能都不会影响程序，从而保证了原有程序的性能。也就是说，<font color="red">所有权不影响程序的性能</font>。

理解了所有权机制，就不用纠结栈和堆的问题，<font color="red">所有权机制的主要目的是为了管理堆上的数据</font>。

### 所有权机制

1. <font color="red">Rust 中每个值都有自己的所有者（Owner），且每个值在任意时刻有且仅有一个所有者</font>
2. <font color="red">当所有者或变量离开作用域时，这个值就会被抛弃</font>

### 变量作用域

在 Rust 变量的作用域范围如下：

```rust
let name = "Hello World!";

// 作用域范围
{ // 这里是无效的，因为 name 还没有声明
	let name = "Hello World!"; // name 变量的作用域范围从这里开始
  ...
} // 作用域范围到这里结束 🔚
```

### 内存与分配

字符串字面值都是硬编码进二进制文件的，但是总有一些未知大小的字符串字面量，这些如何处理？

在 Rust 中，为了处理这些未知大小的字符串字面量，有一个 `String` 类型，它支持一个可变、可增长的文本值，并且将值分配给堆来存放内容。

这意味着：

- 必须在运行时向内存分配器申请内存空间
- 需要一个当 `String` 处理完时，将内存返还给内存分配器的方法

这看起来很像是生命周期的概念...

```rust
let name = String::from("Hello");
name.push_str(", World!");
println!("{name}");
```

依据所有权规则，`name` 变量在作用域结束时就被抛弃了，换句话说就是被自动释放了。

```rust
{
  let name = String::from("Hello"); // name 变量已声明，作用域开始

  .... // 使用 name 变量有效
} // 作用域结束，调用 drop 函数
// 使用 name 变量无效，在这里就会将 String 需要的内存返还给内存分配器
```

在变量离开作用域，即作用域结束时，Rust 提供了一个 `drop` 函数，在结尾的 `}` 处自动调用 `drop` 函数。

### 多个变量使用在堆上

#### 移动

```rust
let x = 6;
let y = x;
```

将 6 绑定到变量 x 上，并且生成一个 x 的拷贝绑定到变量 y 上

```rust
let s1 = String::from("Hello");
let s2 = s1;
```

<img src="https://kaisery.github.io/trpl-zh-cn/img/trpl04-01.svg" />

`String` 类型由三部分组成：一个指向存放字符串内容内存的指针（堆上存放内容的内存部分）、一个长度（表示当前使用了多少字节的内存）、一个容量（从内存分配器总共获取了多少字节的内存）。

将 `s1` 赋值给 `s2` ，这意味着复制了 `s1` 的指针、长度、容量，但没有复制堆上的数据。

<img src="https://kaisery.github.io/trpl-zh-cn/img/trpl04-02.svg" />

根据所有权的原则，当变量离开作用域后，Rust 会自动调用 `drop` 函数并清理变量的堆内存。此时 `s1` 和 `s2` 指向了同一个同一内存，那么当 `s1` 和 `s2` 离开作用域后，它们会尝试释放相同的内存。<font color="red">这是一个二次释放（double free）的错误。两次释放相同的内存会导致内存被污染，并导致可能存在潜在的安全漏洞</font>。

为了保证内存的安全，Rust 在 `let s2 = s1` 后，认为变量 `s1` 不再有效，因此 Rust 不需要在 `s1` 离开作用域后清理任何东西。

```rust
let s1 = String::from("Hello");
let s2 = s1;

println!("{s1}, World!");
```

```rust
99  |   let s1 = String::from("hello");
    |       -- move occurs because `s1` has type `String`, which does not implement the `Copy` trait
100 |   let s2 = s1;
    |            -- value moved here
101 |
102 |   println!("{}, world!", s1);
    |                          ^^ value borrowed here after move
```

Rust 禁止你去使用无效的引用。

<font color="red">拷贝了指针、长度、容量但没有拷贝堆上的数据，且 Rust 会同时使第一个变量无效，这被称为"移动"（move）</font>

`s1` 被移动到了 `s2` 中，具体发生了什么，下图可以解释：

<img src="https://kaisery.github.io/trpl-zh-cn/img/trpl04-04.svg" />

`s1` 变为无效的了，因为只有 `s2` 是有效的，当其离开作用域，它就释放自己的内存了。

<font color="red">Rust 永远也不会自动创建数据的 “深拷贝”。因此，任何 **自动** 的复制都可以被认为是对运行时性能影响较小的。</font>

#### 克隆

如果确实需要<font color="red">深度复制堆上的数据，而不仅仅是栈上的数据</font>，可以使用一个通用的函数 `clone`

```rust
let s1 = String::from("hello");
let s2 = s1.clone();

println!("s1 = {}, s2 = {}", s1, s2);
```

```rust
➜ cargo run
   Compiling rust_tests v0.1.0 (/Users/liaoyangwu/Desktop/Coding/Rust学习/rust_tests)
    Finished dev [unoptimized + debuginfo] target(s) in 0.43s
     Running `target/debug/rust_tests`
s1 = hello, s2 = hello
```

#### 拷贝

<font color="red">拷贝只适用于拷贝栈上的数据</font>。

```rust
let x = 6;
let y = x;

println!("x = {}, y = {}", x, y);
```

```rust
   Compiling rust_tests v0.1.0 (/Users/liaoyangwu/Desktop/Coding/Rust学习/rust_tests)
    Finished dev [unoptimized + debuginfo] target(s) in 0.07s
     Running `target/debug/rust_tests`
x = 6, y = 6
```

上面的代码看起来和之前说的有冲突呀，为什么没有调用 `clone` 函数，`x` 依然有效且没有被移动到了 `y` 呢？

原因是：像整型这样的在编译时已知大小的类型被整个存储在栈上。

Rust 有一个 `Copy trait` 的特殊注解，可以用在类似整型这样的存储在栈上的类型上。<font color="red">如果一个类型实现了 `Copy trait` ，那么一个旧的变量在赋值给其他变量后仍然可用</font>。

Rust 不允许自身或其任何部分实现了 `Drop trait` 的类型使用 `Copy trait`，以下是一些常见的 `Copy` 的类型：

- 所有整数类型
- 布尔类型
- 所有浮点数类型
- 字符类型
- 元组（当且仅当其包含的类型也都实现 `Copye` 的时候），如 `(i32, i32)` 实现了 `Copy` ，但 `(i32, String)` 就没有

### 所有权与函数

```rust
fn main() {
    let s = String::from("hello");  // s 进入作用域

    takes_ownership(s);             // s 的值移动到函数里 ...
                                    // ... 所以到这里不再有效

    let x = 5;                      // x 进入作用域

    makes_copy(x);                  // x 应该移动函数里，
                                    // 但 i32 是 Copy 的，
                                    // 所以在后面可继续使用 x

} // 这里，x 先移出了作用域，然后是 s。但因为 s 的值已被移走，
  // 没有特殊之处

fn takes_ownership(some_string: String) { // some_string 进入作用域
    println!("{}", some_string);
} // 这里，some_string 移出作用域并调用 `drop` 方法。
  // 占用的内存被释放

fn makes_copy(some_integer: i32) { // some_integer 进入作用域
    println!("{}", some_integer);
} // 这里，some_integer 移出作用域。没有特殊之处
```

### 返回值与作用域

返回值可以转移所有权

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership 将返回值
                                        // 转移给 s1

    let s2 = String::from("hello");     // s2 进入作用域

    let s3 = takes_and_gives_back(s2);  // s2 被移动到
                                        // takes_and_gives_back 中，
                                        // 它也将返回值移给 s3
} // 这里，s3 移出作用域并被丢弃。s2 也移出作用域，但已被移走，
  // 所以什么也不会发生。s1 离开作用域并被丢弃

fn gives_ownership() -> String {             // gives_ownership 会将
                                             // 返回值移动给
                                             // 调用它的函数

    let some_string = String::from("yours"); // some_string 进入作用域。

    some_string                              // 返回 some_string
                                             // 并移出给调用的函数
                                             //
}

// takes_and_gives_back 将传入字符串并返回该值
fn takes_and_gives_back(a_string: String) -> String { // a_string 进入作用域
                                                      //

    a_string  // 返回 a_string 并移出给调用的函数
}
```

变量的所有权总是遵循相同的模式：<font color="red">将值赋给另一个变量时移动它。当持有堆中数据值的变量离开作用域时，其值将通过 `drop` 被清理掉，除非数据被移动为另一个变量所有</font>

可以使用元组返回多个值：

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

以上代码可以通过引用来解决不用获取所有权就能够使用值的情况。

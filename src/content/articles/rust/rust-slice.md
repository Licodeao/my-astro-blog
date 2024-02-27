---
title: Rust slice类型
author: Licodeao
publishDate: "2023-12-22"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## slice 类型

`slice` 类型<font color="red">允许引用集合中一段连续的元素序列，而不用引用整个集合</font>。

`slice` 是一类引用，所以没有所有权。

```rust
fn main() {

  fn first_word(s: &String) -> usize {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
      if item == b' ' {
        return i;
      }
    }

    s.len()
  }

  println!("{}", first_word(&String::from("hello world")));
}
```

在上面代码，实现了一个函数，该函数接收一个用空格分隔单词的字符串，并返回在该字符串中找到的第一个单词。如果函数在该字符串中并未找到空格，则整个字符串就是一个单词，所以应该返回整个字符串。

`as_bytes()` 函数将 `String` 转化为字节数组，再通过 `iter` 方法在字节数组上创建一个迭代器。`iter` 方法会返回集合中的每一个元素，而 `enumerate` 方法包装了 `iter` 的结果，将这些元素作为元组的一部分来返回。`enumerate` 返回的元组中，第一个元素是索引，第二个元素是集合中元素的引用。在 `for` 循环中，通过字节的字面值语法来寻找代表空格的字节。

```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s); // word 的值为 5

    s.clear(); // 这清空了字符串，使其等于 ""

    // word 在此处的值仍然是 5，
    // 但是没有更多的字符串让我们可以有效地应用数值 5。word 的值现在完全无效！
}
```

以上代码会造成 `word` 索引与 `s` 中的数据不同步，这会造成问题。

如何解决这个问题呢？字符串 `slice` 可以解决。

### 字符串 slice

<font color="red">字符串 slice（string slice）是 `String` 中一部分的值的引用</font>

```rust
fn main() {
  let s = String::from("hello world");

  let hello = &s[0..5];
  let world = &s[6..11];

  println!("{} {}", hello, world)
}
```

不同于整个 `String` 的引用，`hello` 和 `world` 都是一部分 `String` 的引用，可以使用一个由中括号的 `[start_index, end_index]` 指定的 `range` 创建一个 `slice` 。

![image-20240110112236135](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240110112236135.png)

对于字符串的 `range` 语法来说：

- 如果想要从索引 `0` 开始，可以不写两个点号前面的值

  ```rust
  let s = &s[0..3];
  // 等价于
  let s = &s[..3];
  ```

- 如果 `slice` 包含 `String` 得最后一个字节，也可以不写两个点号后面的值

  ```rust
  let s = String::from("hello");

  let len = s.len();

  let slice = &s[3..len];
  // 等价于
  let slice = &s[3..];
  ```

- 也可以同时舍弃前后两个值，来获取整个字符串的 `slice`

  ```rust
  let s = String::from("hello");

  let len = s.len();

  let slice = &s[0..len];
  // 等价于
  let slice = &s[..];
  ```

<font color="red">字符串` slice` 的类型声明是 `&str`</font>

```rust
fn main() {
  fn first_world(s: &String) -> &str {
     let bytes = s.as_bytes();

     for (i, &item) in bytes.iter().enumerate() {
       if item == b' ' {
          return &s[0..i];
       }
     }

     &s[..]
  }

  println!("{}", first_world(&String::from("Hello World")));
}
```

这时当调用了 `first_world` 函数后，它会返回一个与底层数据相关联的值，这个值由一个 `slice` 开始位置的引用和 `slice` 中元素的数量组成。

再回到最开始的问题，如果这时候将 `first_world` 方法使用 `slice` 类型会怎么样？

```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s); // 值为 slice 类型

    s.clear(); // 错误！

    println!("the first word is: {}", word);
}
```

上方代码进行编译后，会出现如下错误：

```rust
    |
113 |   let word = first_word(&s);
    |                         -- immutable borrow occurs here
114 |
115 |   s.clear(); // 错误！
    |   ^^^^^^^^^ mutable borrow occurs here
116 |
117 |   println!("the first word is: {}", word);
    |                                     ---- immutable borrow later used here
```

`word` 变量是一个不可变引用，当调用 `clear` 方法后，变量 `s` 尝试获取一个可变引用。回顾一下借用原则：不可变引用不能与可变引用共存，也就是说一个值有了不可变引用，就不能再获取一个可变引用。因此导致编译失败！

<font color="red">字符串字面值就是 `slice` </font>

```rust
let s = "Hello World";
```

这里的变量 `s` 就是 `slice` 类型，即 `&str` 。它是一个指向二进制程序特定位置的 `slice` 类型，这就是为什么字符串字面值是不可变的，因为 `&str` 是一个不可变引用。

<font color="red">字符串 `slice` 作为参数</font>

```rust
fn main() {
  fn first_world(s: &str) -> &str {
    ...
  }
}
```

如果参数是一个字符串 `slice` ，则可以直接传递一个字符串 `slice` ，也可以传递整个 `String` 的 `slice` 或对 `String` 的引用。这样使得 API 更加通用且不会丢失任何功能。

---
title: Rust 泛型
author: Licodeao
publishDate: "2024-1-19"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 泛型

泛型可以<font color="red">高效处理重复概念</font>，在 Rust 中也存在着泛型（generics）的概念，<font color="red">泛型是具体类型或其他属性的抽象替代</font>。

### 函数中的泛型

泛型允许我们<font color="red">使用一个可以代表多种类型的占位符来替换特定类型</font>，依次来减少代码的冗余。

```rust
fn main() {
  let v = vec![6, 8, 10, 231, 88, 109];

  let mut largest = &v[0];

  for i in &v {
    if i > largest {
      largest = i;
    }
  }

  println!("The largest number is {}", largest);
}
```

如果我们想要在多个数组中寻找各自的最大值，可能会写多个相同的代码，重复的代码是冗余且容易出错的，更新逻辑时又不得不记住需要修改多处地方的代码。

根据这个问题，我们可以创建一层代码的的抽象，定义一个处理任意整型列表作为参数的函数。（这里只是抽象，并没有使用泛型）

```rust
fn main() {
  // 一层抽象
  fn find_largest_value(arr: &[i32]) -> &i32 {
    let mut largest = &arr[0];

    for i in arr {
      if i > largest {
        largest = i;
      }
    }

    largest
  }

  let v = vec![6, 8, 10, 231, 88, 109];
  let result_1 = find_largest_value(&v);
  println!("The largest number is {}", result_1);

  let v = vec![6, 8, 10, 231, 88, 109, 789];
  let result_2 = find_largest_value(&v);
  println!("The largest number is {}", result_2);
}

// The largest number is 231
// The largest number is 789
```

`find_largest_value` 函数有一个参数 `arr` ，它代表会传递给函数的任何具体的 `i32` 值的 `slice` 。

当使用泛型定义函数时，<font color="red">本来在函数签名中指定参数和返回值的类型的地方，会改用泛型来表示</font>。采用泛型使得代码适应性更强，从而为函数的调用者提供更多的功能，同时也避免了代码的重复。

<font color="red">Rust 类型名的命名规范是首字母大写驼峰式命名法</font>，`T` 作为 "type" 的缩写，大部分情况下是首选。

```rust
fn main() {
  // 使用泛型
  fn find_largest_value<T>(arr: &[T]) -> &T {
    let mut largest = &arr[0];

    for i in arr {
      if i > largest {
        largest = i;
      }
    }

    largest
  }

  let v = vec![6, 8, 10, 231, 88, 109];
  let result_1 = find_largest_value(&v);
  println!("The largest number is {}", result_1);

  let v = vec![6, 8, 10, 231, 88, 109, 789];
  let result_2 = find_largest_value(&v);
  println!("The largest number is {}", result_2);
}
```

在 `find_largest_value` 函数定义中：

```rust
fn find_largest_value<T>(arr: &[T]) -> &T
```

对于泛型可以这样理解，抽象地认为它是函数的一个参数（类型参数），先有了泛型 `<T>` ，所以你才可以在函数的形参、函数的返回值、函数体中使用 `T`。<font color="red">类型参数声明位于函数名称与参数列表中间的尖括号 `<>` 中</font>。

上方代码即使使用了泛型也依然不能通过编译，会出现以下错误：

```rust
  |
6 |       if i > largest {
  |          - ^ ------- &T
  |          |
  |          &T
  |
help: consider restricting type parameter `T`
  |
2 |   fn find_largest_value<T: std::cmp::PartialOrd>(arr: &[T]) -> &T {
  |
```

这个错误表明函数体并不能适用于 `T` 的所有可能的类型，Rust 编译器也给出了解决建议：将泛型的类型指定为 `std::cmp::PartialOrd` ，它其实是一个 `trait` 。

```rust
fn main() {
  fn find_largest_value<T: std::cmp::PartialOrd>(arr: &[T]) -> &T {
    let mut largest = &arr[0];

    for i in arr {
      if i > largest {
        largest = i;
      }
    }

    largest
  }

  let v = vec![6, 8, 10, 231, 88, 109];
  let result_1 = find_largest_value(&v);
  println!("The largest number is {}", result_1);

  let v = vec![6, 8, 10, 231, 88, 109, 789];
  let result_2 = find_largest_value(&v);
  println!("The largest number is {}", result_2);
}
```

将泛型的类型改为 `std::cmp::PartialOrd` 之后，就可以通过编译了。

### 结构体中的泛型

结构体中的泛型，同样可以使用一个或多个泛型参数类型字段。

```rust
struct Point<T> {
  x: T,
  y: T,
  z: T,
}
```

字段 `x` 、`y` 、`z` 都是相同类型，无论具体它是什么类型，如果尝试创建一个有不同类型值的 `Point<T>` 的实例，就不能通过编译：

```rust
struct Point<T> {
  x: T,
  y: T,
  z: T,
}

fn main() {
  let point = Point {
    x: 10,
    y: 10,
    z: 4.0
  }
}
```

会出现类型不匹配的错误：

```rust
error[E0308]: mismatched types
  --> src/main.rs:11:8
   |
11 |     z: 4.3
   |        ^^^ expected integer, found floating-point number
```

> 但是非要定义一个有字段 `x`、 `y`、 `z` 的结构体，并且结构体中的字段可以存在多种类型，这怎么办？

可以使用多个泛型类型参数来解决这个需求。

```rust
struct Point<T, U> {
  x: T,
  y: T,
  z: U
}

fn main() {
  let point = Point {
    x: 1,
    y: 2,
    z: 4.3
  };

  println!("x: {}, y: {}, z: {}", point.x, point.y, point.z)
}
```

如果代码中需要很多泛型时，这可能表明你的代码需要重构分解成更小的结构。

### 枚举中的泛型

和结构体类似，枚举也可以在成员中存放泛型数据类型。

```rust
enum Option<T> {
  Some(T),
  None,
}
```

`Option<T>` 是一个拥有泛型的枚举，它有两个成员：`Some` ，它存放了一个类型 `T` 的值，和不存在任何值的 `None` 。

同样，枚举中的泛型也可以使用多个泛型类型参数。

```rust
enum Result<T, E> {
  Ok(T),
  Err(E),
}
```

`Result` 枚举有两个泛型类型，`T` 和 `E`。`Result` 有两个成员：`Ok`，它存放一个类型 `T` 的值，而 `Err`则存放一个类型 `E` 的值。

### 方法中的泛型

在为结构体或枚举实现方法时，也可以使用泛型。

```rust
#![allow(unused)]
struct Point<T> {
  x: T,
  y: T,
}

impl<T> Point<T> {
  fn x(&self) -> &T {
    &self.x
  }
}

fn main() {
  let point = Point {
    x: 10,
    y: 20
  };

  println!("x: {}, y: {}", point.x(), point.y);
}
```

注意必须在 `impl` 后声明 `T` ，这样就可以在 `Point<T>` 上实现的方法中使用 `T` 了。在声明泛型类型参数的 `impl` 中编写的方法将会定义在该类型的任何实例上。

<font color="red">定义方法时也可以为泛型指定限制</font> ，即增加一个额外的实现，来捕获泛型外的类型。

```rust
#![allow(unused)]
struct Point<T> {
  x: T,
  y: T,
}

impl<T> Point<T> {
  fn x(&self) -> &T {
    &self.x
  }
}

// 指定限制
impl Point<f64> {
  fn p_x(&self) -> f64 {
    self.y
  }
}

fn main() {
  let point = Point {
    x: 10,
    y: 20
  };

  println!("x: {}, y: {}", point.x(), point.y);
}
```

其他 `T` 不是 `f64` 类型的 `Point<T>` 实例则没有定义 `p_x` 方法。

<font color="red">结构体定义中的泛型类型参数并不总是与结构体方法签名中使用的泛型是同一种类型</font>。

```rust
#![allow(unused)]
struct Point<TX, TY> {
  x: TX,
  y: TY,
}

impl<TX, TY> Point<TX, TY> {
  fn difference<TA, TB>(self, other: Point<TA, TB>) -> Point<TX, TB> {
    Point {
      x: self.x,
      y: other.y,
    }
  }
}

fn main() {
  let point_one = Point { x: 1, y: 2 };
  let point_two = Point { x: "a", y: "b" };

  let point_three = point_one.difference(point_two);

  println!("point_three.x = {}, point_three.y = {}", point_three.x, point_three.y);
}
```

在 `point_one` 上以 `point_two` 作为参数调用 `difference` 会返回一个 `point_three` ，它会有一个 `i32` 类型的 `x` ，`char` 类型的 `y` ，`x` 来自 `point_one` ，`y` 来自 `point_two` 。泛型参数 `TA` 和 `TB` 声明于 `fn difference` 之后，因为它们只是相对于方法本身的。

### 泛型的性能

泛型并不会使程序比具体类型运行得慢。<font color="red">Rust 通过在编译时进行泛型代码的单态化来保证效率</font>。单态化是一个通过填充编译时使用的具体类型，将通用代码转换为特定代码的过程。在这个过程中，编译器寻找所有泛型代码被调用的位置并使用泛型代码针对具体类型生成代码。

```rust
fn main() {
  let x = Some(5);
  let y = Some(6.6);
}
```

进行单态化处理，编译器会读取 `Option<T>` 的值并发现有两种 `Option<T>` : 一个对应 `i32`，一个对应 `f64` 。单态化时，会将泛型定义 `Option<T>` 展开为两个针对 `i32` 和 `f64` 的定义，接着将泛型定义转换为这两个具体的定义。

也就是说<font color="red">单态化其实就是将代码中的泛型进行单独处理，再将泛型定义转换为具体的定义</font>。

转换为以下单态化：

```rust
enum Option_i32 {
  Some(i32),
  None,
}

enum Option_f64 {
  Some(f64),
  None,
}

fn main() {
  let x = Option_i32::Some(5);
  let y = Option_f64::Some(6.6);
}
```

泛型 `Option<T>` 转换为来具体的定义，Rust 会将每种情况下的泛型代码编译为具体类型，并且使用泛型没有运行时的开销。

单态化的过程，正是 Rust 泛型在运行时高效的原因。

---
title: Rust 结构体
author: Licodeao
publishDate: "2024-1-3"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 结构体

`struct` 是一个自定义数据类型，允许你包装和命名多个相关的值，从而形成一个有意义的组合。

### 定义和实例化

结构体的每一部分都可以是不同类型，不同于元组，结构体需要命名各部分数据以便能清楚的表明其意义，有了这些名字，结构体比元组更加灵活，不需要依赖顺序来指定或访问实例中的值。

定义结构体，需要使用 `struct` 关键字，并给整个结构体提供一个名字。接着需要在结构体中定义每一部分数据的名字和类型，这些数据称为字段（field）。

```rust
struct User {
  username: String,
  age: u32,
  gender: String,
  is_active: bool,
}
```

定义好结构体后，<font color="red">通过为每个字段指定具体值来创建这个结构体的实例。实例中字段的顺序不需要和它们在结构体中声明的顺序一致</font>。

```rust
fn main() {
  let mut user = User {
    username: String::from("Licodeao"),
    age: 21,
    gender: String::from("Male"),
    is_active: true,
  };
}
```

可以使用点号从结构体中获取特定的值，修改原有值时，该结构体实例必须是可变的，不能只是某个字段是可变的，要整体可变。

```rust
struct User {
  username: String,
  age: u32,
  gender: String,
  is_active: bool,
}

fn main() {
  let mut user = User {
    username: String::from("Licodeao"),
    age: 21,
    gender: String::from("Male"),
    is_active: true,
  };

  user.username = String::from("licodeao@gmail.com");
  user.age = 30;
  user.gender = String::from("Unknown");
  user.is_active = false;
}
```

返回结构体

```rust
fn main() {
  fn return_user(username: String, gender: String) -> User {
    User {
      username: username,
      age: 21,
      gender: gender,
      is_active: true,
    }
  }

  let return_user = return_user(String::from("Licodeao"), String::from("Male"));

  println!("Username: {}", return_user.username);
}
```

字段初始化简写语法（field in shorthand）

（与 ES6 中对象增强中的属性增强简直一模一样...）

```rust
fn main() {
  fn return_user(username: String, gender: String) -> User {
    User {
      username,
      age: 21,
      gender,
      is_active: true,
    }
  }

  let return_user = return_user(String::from("Licodeao"), String::from("Male"));

  println!("Username: {}", return_user.username);
}
```

### 创建新实例

<font color="red">通过结构体创建新的实例，除了使用旧实例的大部分值但是改变其部分值来创建，还可以通过结构体更新语法（struct update syntax）</font>

（与 ES6 中的扩展运算符简直一模一样，只是少了个点...）

`..` 语法指定了剩余未显式设置值的字段应有与给定实例对应字段相同的值。

```rust
struct User {
  username: String,
  age: u32,
  gender: String,
  is_active: bool,
}

fn main() {
  let user = User {
    username: String::from("Licodeao"),
    age: 21,
    gender: String::from("Male"),
    is_active: true,
  };

  let user2 = User {
    username: String::from("licodeao@gmail.com"),
    // 结构体更新语法
    ..user
  };

  println!("User2: {}", user2.username);
}
```

⚠️：结构更新语法就像带有 `=` 的赋值，因为它移动了数据，总体上说我们在创建 `user2` 后不能就再使用 `user1` 了

### 没有命名的元组结构体

定义与元组类似的结构体，称为元组结构体。元组结构体有结构体名称，但是没有具体的字段名，只有字段类型。

```rust
struct Color(u32, u32, u32);
struct Point(i32, i32, i32);

fn main() {
  let red = Color(255, 255, 255);
  let origin = Point(100, -100, -255);
}
```

### 没有任何字段的类单元结构体

定义一个没有任何字段的结构体，称为类单元结构体（unit-like structs），因为它类似于 `()` 。

类单元结构体常常在你想要在某个类型上实现 `trait` ，但不需要在类型中存储数据时发挥作用。

```rust
struct UnitLikeStruct;

fn main() {
  let unit_like_struct = UnitLikeStruct;
}
```

### 结构体中的所有权

当结构体中存储被其他对象拥有的数据的引用时，需要用上生命周期（lifetimes）。

如果尝试在结构体中存储一个引用而不指定生命周期，这将会是无效的。

```rust
struct User {
    active: bool,
    username: &str,
    email: &str,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        active: true,
        username: "LICODEAO",
        email: "licodeao@gmail.com",
        sign_in_count: 1,
    };
}
```

会出现以下错误：

```rust
 --> src/main.rs:3:13
  |
3 |   username: &str,
  |             ^ expected named lifetime parameter
  |
help: consider introducing a named lifetime parameter
  |
1 ~ struct User<'a> {
2 |   active: bool,
3 ~   username: &'a str,
  |

error[E0106]: missing lifetime specifier
 --> src/main.rs:4:10
  |
4 |   email: &str,
  |          ^ expected named lifetime parameter
  |
help: consider introducing a named lifetime parameter
  |
1 ~ struct User<'a> {
2 |   active: bool,
3 |   username: &str,
4 ~   email: &'a str,
  |
```

编译器会提示它需要生命周期标识符...

### 打印结构体

```rust
struct Rectangle {
  width: u32,
  height: u32,
}

fn main() {
  let rect1 = Rectangle {
      width: 30,
      height: 50,
  };

  println!("rect1 is {}", rect1);
}
```

运行上方代码后，会出现以下问题：

```rust
error[E0277]: `Rectangle` doesn't implement `std::fmt::Display`
```

`println!` 宏能处理很多类型的格式，不过 `{}` 告诉 `println!` 宏使用被称为 `Display` 的格式，它像用户展示 `1` 或其他任何基本类型的唯一方式。不过对于结构体，`println!` 并没有提供一个 `Display`

在 `{}` 中加入 `:?` 提示符告诉 `println!` 使用 `Debug` 的输出格式，`Debug` 是一个 `trait`，必须显式地为结构体标注要使用 `Debug`

```rust
// 增加外部属性来派生 Debug trait
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}

fn main() {
  let rect1 = Rectangle {
      width: 30,
      height: 50,
  };

  println!("rect1 is {:?}", rect1); // rect1 is Rectangle { width: 30, height: 50 }
}
```

使用 `{:#?}` 替换 `{:?}` ，能够看到更漂亮和易读的输出

```rust
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}

fn main() {
  let rect1 = Rectangle {
      width: 30,
      height: 50,
  };

  println!("rect1 is {:#?}", rect1);
}
```

```rust
rect1 is Rectangle {
    width: 30,
    height: 50,
}
```

### 方法语法

方法与函数类似：都可以使用 `fn` 关键字和名称声明，并且可以拥有参数和返回值，同时包含在某处调用时会执行的代码。

方法与函数不同的是：方法在结构体的上下文、枚举、`trait` 对象中被定义，并且它们第一个参数永远是 `self` ，它代表调用该方法的结构体实例。

> 定义方法

```rust
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}

impl Rectangle {
  // 方法语法，self 指向 rect1这个结构体实例
  fn area(&self) -> u32 {
      self.width * self.height
  }
}

fn main() {
  let rect1 = Rectangle {
      width: 30,
      height: 50,
  };

  println!("rect1 is {:?}", rect1.area());
}
```

使用 `&self` 来替代 `rectangle: &Rectangle` ，`&self` 实际上是 `self: &Self` 的缩写。

在一个 `impl` 块中，`Self` 类型是 `impl` 块的类型的别名。方法的第一个参数必须有一个名为 `self` 的 `Self` 类型的参数。

<font color="red">方法可以与字段同名</font>：

```rust
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}

impl Rectangle {
  fn width(&self) -> bool {
    self.width > 0
  }
}

fn main() {
  let rect1 = Rectangle {
      width: 30,
      height: 50,
  };

  if rect1.width() {
    println!("rect1 width is {:?}", rect1.width);
  }
}
```

当在 `rect1.width` 后面加上括号时，Rust 知道指的是方法 `width`；当不使用圆括号时，Rust 知道指的是字段 `width`

与字段同名的方法将被定义为只返回字段中的值，而不做其他事情，这样的方法被称为 `getters`

### 关联函数

所有在 `impl` 块中定义的函数被称为关联函数，因为它们与 `impl` 后面命名的类型相关。

可以定义不以 `self` 为第一个参数的关联函数，因此它不是一个方法，因为它并不作用于一个结构体实例。

<font color="red">不是方法的关联函数经常被用作返回一个结构体新实例的构造函数</font>。

```rust
impl Rectangle {
  fn square(size: u32) -> Self {
    Self {
      width: size,
      height: size,
    }
  }
}
```

关键字 `Self` 在函数的返回类型中代指在 `impl` 关键字后出现的类型，这里指的是 `Rectangle` ，即 `Self` 指的是 `Rectangle`

使用结构体和 `::` 来调用这个关联函数，如 `Rectangle::square(6)`

### 多个 `impl` 块

每个结构体都允许有多个 `impl` 块。

每个方法有其自己的 `impl` 块。

```rust
impl Rectangle {
  fn area(&self) -> u32 {
    self.width * self.height
  }
}

impl Rectangle {
  fn can_hold(&self, other: &Rectangle) -> bool {
    self.width > other.width && self.height > other.height
  }
}
```

使用结构体能够方便地组装数据，使得代码更加清晰，但结构体并不是创建自定义类型的唯一方法，还可以使用枚举。

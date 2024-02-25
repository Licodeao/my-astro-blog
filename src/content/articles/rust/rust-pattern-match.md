---
title: Rust 模式匹配
author: Licodeao
publishDate: "2024-1-10"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 模式匹配

### match 控制流结构

在 Rust 中`match` 是一个极其强大的控制流运算符，它<font color="red">允许我们将一个值和一系列的模式进行比较，并根据相匹配的模式执行相应代码</font>。

**Rust 中的匹配是穷尽的，穷举到最后的可能性来使代码有效**。

> 为什么说它很强大？

得益于编译器，`match` 确保了所有可能的情况都得到了处理。

整个 `match` 表达式像一个分类器，`match` 的每一个模式像一个管道一样，不同的值都会掉入符合大小的管道中，进入相关联的代码块并在执行中被使用。

```rust
#![allow(unused)]
fn main() {
  enum Apple {
    HeavyApple,
    MiddleApple,
    LightApple,
    BadApple
  }

  fn classify_apple(apple: Apple) -> u8 {
    match apple {
      Apple::HeavyApple => 3,
      Apple::MiddleApple => 2,
      Apple::LightApple => 1,
      Apple::BadApple => 0
    }
  }
}
```

每个分支相关联的代码是一个表达式，而表达式的结果值将作为整个 `match` 表达式的返回值。

如果分支代码较长，则需要使用大括号；较短时，则不需要使用大括号。

```rust
#![allow(unused)]
fn main() {
  enum Apple {
    HeavyApple,
    MiddleApple,
    LightApple,
    BadApple
  }

  fn classify_apple(apple: Apple) -> u8 {
    match apple {
      Apple::HeavyApple => {
        println!("This is a heavy apple");
        3
      },
      Apple::MiddleApple => {
        println!("This is a middle apple");
        2
      },
      Apple::LightApple => 1,
      Apple::BadApple => 0
    }
  }
}
```

#### 绑定值的模式

绑定匹配模式的部分值，也就是如何<font color="red">从枚举成员中提取值</font>。

```rust
#![allow(unused)]
fn main() {
  enum Plate {
    BigPlate,
    MiddlePlate,
    SmallPlate,
    GetApple(Apple)
  }

  #[derive(Debug)]
  enum Apple {
    HeavyApple,
    MiddleApple,
    LightApple,
    BadApple
  }

  fn classify_apple(plate: Plate) -> u8 {
    match plate {
      Plate::BigPlate => {
        println!("This is a big plate");
        3
      },
      Plate::MiddlePlate => {
        println!("This is a middle plate");
        2
      },
      Plate::SmallPlate => 1,
      Plate::GetApple(apple) => {
        println!("Get the Apple is {:?}", apple);
        0
      }
    }
  }

  classify_apple(Plate::GetApple(Apple::HeavyApple));
}
```

在上方的代码中，我们在最后调用了 `classify_apple` 这个函数，并且匹配到了 `Plate::GetApple` 这个分支模式。在这个模式中，增加了一个变量 `apple` ，这个变量将会绑定 `Apple::HeavyApple` 这个枚举成员。这也就达到了从 `Plate` 枚举中提取到了值。

当然，最终的输出为：

```rust
Get the Apple is HeavyApple
```

#### 匹配 Option\<T\>

匹配 `Option<T>` ，实际上比较的是 `Option<T>` 的成员。

```rust
#![allow(unused)]
fn main() {
  fn plus(x: Option<i32>) -> Option<i32> {
    match x {
      None => None,
      Some(i) => Some(i + 1),
    }
  }

  let zero = Some(0);
  let one = plus(zero);
  let none = plus(None);

  println!("zero is {:?}, one is {:?}, none is {:?}", zero, one, none);
}
```

输出：

```rust
zero is Some(0), one is Some(1), none is None
```

#### 匹配 Some(T)

在上方代码中，这两行代码表示：

```rust
let zero = Some(0);
let one = plus(zero);
```

`plus` 函数中的 `x` 的值是 `Some(0)`，接着执行程序，其将与每个分支进行比较。

进入 `match` 表达式中，值 `Some(0)` 并不与 `None` 匹配，则进入下一个分支模式。

```rust
Some(i) => Some(i + 1)
```

`Some(0)` 与 `Some(i)` 匹配成功，所以 `i` 绑定了 `0` ，值为 `0`。接着分支的代码被执行，将 `i` 的值加一并返回一个值为 `6` 的 新 `Some` 中。

接着执行程序，来到了这一行代码：

```rust
let none = plus(None);
```

执行 `plus` 函数，进入 `match` 表达式

```rust
None => None
```

匹配成功，程序结束并返回 `=>` 右侧的值 `None` ，其他分支将不再进行比较。

#### 通配模式

通配模式常用于<font color="red">对一些特定的值采取特殊操作，对其他值采取默认操作</font>的场景。

```rust
#![allow(unused)]
fn main() {
  let guess_number = 10;

  match guess_number {
      -1 => println!("too small"),
      8 => println!("so close"),
      other => continue_guess(other),
  }

  fn continue_guess(num: i32) {
    println!("continue guess {}", num);
  }
}
```

输出：

```rust
continue guess 10
```

前两个分支涵盖了 `-1` 和 `8` 的情况，最后一个分支涵盖了所有其他可能的值。即使没有枚举出 `i32` 所有可能的值，但是这段代码依然可以通过编译，因为<font color="red">最后一个模式将匹配所有未被特殊列出的值，起到了兜底的作用</font>。这种模式即是通配模式，它满足了 `match` 必须被穷尽的要求。

⚠️ 值得注意的是：<font color="red">通配分支必须放在最后，否则 Rust 会警告通配分支之后的其他分支将永远不会被匹配到！</font>

#### 占位模式

当不想使用通配模式获取值的时候，Rust 提供了另一个模式：`_`，<font color="red">这是一个特殊的模式，可以匹配任意值而不绑定到该值</font>。

```rust
#![allow(unused)]
fn main() {
  let guess_number = 10;

  match guess_number {
      -1 => println!("too small"),
      8 => println!("so close"),
      _ => continue_guess(),
    	// 或者直接返回一个空元组
      _ => (),
  }

  fn continue_guess() {
    println!("continue");
  }
}
```

### `if let` 简洁控制流

`if let` 是一种更短的控制流编写方式。

上方代码可以使用 `if let` 简化为以下代码：

```rust
#![allow(unused)]
fn main() {
  let guess_number = Some(10);

  if let Some(num) = guess_number {
    println!("num is {}", num);
  }
}
```

输出：

```rust
num is 10
```

`if let` 语法获取通过等号分隔的一个模式和一个表达式。它的工作方式与 `match` 是完全一样的。

在这里，模式是 `Some(num)` ，表达式是 `guess_number`。

表达式对应的是 `match`，而模式对应的则是第一个分支。模式不匹配时，`if let` 块中的代码不会执行。

`if let` 虽然简洁，但是会失去 `match` 强制要求的穷尽性检查。所以需要在使用时，去权衡利弊了。

可以在 `if let` 结构中添加一个 `else` ，对应着 `match` 中的 `_` 模式。

```rust
#![allow(unused)]
fn main() {
  enum Plate {
    BigPlate,
    MiddlePlate,
    SmallPlate,
    GetApple(Apple)
  }

  #[derive(Debug)]
  enum Apple {
    HeavyApple,
    MiddleApple,
    LightApple,
    BadApple
  }

  fn classify_apple(plate: Plate) -> () {
    let big_plate = Plate::BigPlate;
    let mut count = 0;

    if let Plate::GetApple(apple) = big_plate {
      println!("Get Apple is {:?}", apple);
    } else {
      count += 1;
    }

    println!("num is {}", count)
  }

  classify_apple(Plate::GetApple(Apple::HeavyApple));
}
```

输出为：

```rust
num is 1
```

当枚举包含数据时，可以根据需要处理多少的情况来选择使用 `match` 或 `if let` 来获取并使用这些值。

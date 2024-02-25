---
title: Rust 迭代器与闭包
author: Licodeao
publishDate: "2024-1-27"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

## 迭代器与闭包

在 Rust 中，也可以看到函数式编程的影子，如闭包、迭代器等等。函数式编程风格通常包含将函数作为参数值或其他函数的返回值、将函数赋值给变量以供之后执行等等。

### 闭包

Rust 的闭包（closure）是可以<font color="red">保存在一个变量中或作为参数传递给其他函数的匿名函数</font>。

> 闭包捕获其环境

闭包可以捕获定义它环境中的值以便后续使用。在 Rust 中，闭包怎么定义？通过 `||` 双杠符号来定义，这表示一个闭包。如果闭包有参数，则参数会出现在两道竖杠之间。

例如以下例子：

```rust
#[derive(Debug, PartialEq, Copy, Clone)]
enum Number {
  Zero,
  One,
}
struct Invensity {
  shirts: Vec<Number>
}

impl Invensity {
  fn get(&self, user_profile: Option<Number>) -> Number {
    user_profile.unwrap_or_else(|| self.value())
  }

  fn value(&self) -> Number {
    let mut max_zero = 0;
    let mut max_one = 0;

    for shirt in &self.shirts {
      match shirt {
        Number::Zero => max_zero += 1,
        Number::One => max_one += 1,
      }
    }

    if max_zero > max_one {
      Number::Zero
    } else {
      Number::One
    }
  }
}

fn main() {
  let invensity = Invensity {
    shirts: vec![Number::Zero, Number::One],
  };

  let s1 = Some(Number::Zero);
  let res1 = invensity.get(s1);
  println!("result: {:?}", res1);
}
```

`unwrap_or_else` 是由标准库定义在 `Option<T>` 上的方法，它获取一个没有参数、返回值类型为 `T` 的闭包作为参数。如果 `Option<T>` 是 `Some` 成员，则 `unwrap_or_else` 返回 `Some` 中的值；如果 `Option<T>` 是 `None` 成员，则 `unwrap_or_else` 调用闭包并返回闭包返回的值。

在上方代码中，将闭包表达式 `|| self.value()` 作为方法 `unwrap_or_else` 的参数，`|| self.value()` 这个闭包表达式本身不获取参数，如果有参数则位于两道竖杠之间，闭包体调用了 `self.value()` 。之后，`unwrap_or_else` 会在需要结果的时候调用这个闭包。在 `Invensity` 实例上调用了 `self.value()` 的闭包，闭包捕获了一个 `Invensity` 实例的不可变引用到 `self` ，函数就不能以这种方式捕获其环境。

> 闭包类型推导与注解

闭包不用像函数一样在参数和返回值上都要显式地标注类型，函数是暴露给用户的接口，闭包存储在变量中并被使用，不用命名它们或暴露给库的用户使用。

闭包通常很短，并且只关联于小范围的上下文，闭包也可以添加类型注解，以达到更强的明确性。

```rust
let expression = |num: i32| -> i32 {
  println!("num is {}", num);
}
```

编译器会为闭包定义中的每个参数或返回值推断一个具体的类型。如果尝试对同一闭包使用不同类型则就会得到类型错误。

```rust
let expression = |x| x; // 闭包的一个简写形式

let string = expression(String::from("closure"));
let num = expression(10);
```

编译后输出为：

```rust
5 |   let number = expression(10);
  |                ---------- ^^- help: try using a conversion method: `.to_string()`
  |                |          |
  |                |          expected `String`, found integer
  |                arguments to this function are incorrect
  |
note: closure parameter defined here
 --> src/main.rs:2:21
  |
2 |   let expression = |x| x;
  |
```

第一次调用闭包时，编译器成功地推断出了这个闭包中 `x` 的类型以及返回值的类型是 `String`，同时这些类型被锁进了闭包 `expression` 中，因此在第二次调用闭包时，就会出现类型错误的问题了。

> 捕获引用 / 移动所有权

闭包通过三种方式捕获其环境：

- 不可变借用
- 可变借用
- 获取所有权

这也是函数获取参数的三种方式，闭包会根据函数体中如何使用被捕获的值来决定使用哪种捕获方式。

```rust
fn main() {
  let arr = vec![255, 127, 128];
  let closure_arr = || println!("closure arr: {:?}", arr);

  closure_arr();
  println!("After calling closure: {:?}", arr);
}
```

上方代码展示了变量也可以绑定闭包定义，并且之后可以使用变量名和括号调用闭包。

```rust
fn main() {
    let mut arr = vec![255, 127, 128];
    println!("closure arr: {:?}", arr);

    let mut closure_arr = || arr.push(66);

    closure_arr();
    println!("After calling closure: {:?}", arr);
}

```

闭包现在捕获了一个可变引用。

如果我们在闭包调用之前和闭包定义之后，添加一个 `println!` 宏，看看会发生什么：

```rust
fn main() {
    let mut arr = vec![255, 127, 128];
    println!("closure arr: {:?}", arr);

    let mut closure_arr = || arr.push(66); // 闭包的定义

    println!("Before calling closure: {:?}", arr);

    closure_arr(); // 闭包的调用
    println!("After calling closure: {:?}", arr);
}

```

使用编译器编译后：

```rust
5 |     let mut closure_arr = || arr.push(66);
  |                           -- --- first borrow occurs due to use of `arr` in closure
  |                           |
  |                           mutable borrow occurs here
6 |     println!("Before calling closure: {:?}", arr);
  |                                              ^^^ immutable borrow occurs here
7 |     closure_arr();
  |     ----------- mutable borrow later used here
```

得到了个错误，当 `closure_arr` 定义时，它捕获了 `arr` 的可变借用，在闭包调用结束后，可变借用就结束了。因为可变借用存在时，不允许其他借用存在，所以在闭包定义和调用之间不能有不可变借用来进行打印。

<font color="red">闭包体不严格需要所有权，如果希望闭包强制获取它用到的环境中值的所有权，可以在参数列表前面使用 `move` 关键字</font>。

```rust
use std::thread;

fn main() {
    let arr = vec![255, 127, 128];

    println!("Before calling closure: {:?}", arr);

    thread::spawn(move || println!("thread: {:?}", arr))
        .join()
        .unwrap();
}
```

在上方代码中，就通过使用了 `move` 关键字来强制闭包为线程获取 `arr` 的所有权，以便在一个新的线程而非主线程中打印 `vector`。如果主线程维护了 `arr` 的所有权但却在新线程之前结束并且丢弃了 `arr` ，则在线程中的不可变借用将失效。

> 将捕获的值移出闭包 / Fn trait

一旦闭包捕获了定义它环境中的某个值的引用或所有权，闭包体中的代码定义了之后在闭包计算时对引用或值如何操作，那么闭包体就可以做以下任何操作：

- 将一个捕获的值移出闭包
- 修改捕获的值
- 既不移动也不修改值

闭包捕获和处理环境中的值的方式影响闭包实现的 `trait` ，`trait` 是函数和结构体指定它们能用的闭包的类型的方式。取决于闭包如何处理值，闭包会自动地、渐进地实现一个、两个或三个 `Fn trait` 。

- `FnOnce` ：适用于能够被调用一次的闭包，所有闭包都至少实现了这个 `trait` ，因为所有闭包都能够被调用。一个会将捕获的值移出闭包体的闭包只实现 `FnOnce trait` ，因为它只能被调用一次。
- `FnMut`：适用于不会将捕获的值移出闭包体的闭包，但可能会修改被捕获的值。这类闭包可以调用多次。
- `Fn`：适用于既不将被捕获的值移出闭包体也不会修改被捕获的值的闭包，当然也包括不从环境中捕获值的闭包。这类闭包可以调用多次，并且不会改变它们的环境。

```rust
// Option<T> 的 unwrap_or_else 方法的实现

impl<T> Option<T> {
  pub fn unwrap_or_else<F>(self, f: F) -> T
  where
  	F: FnOnce() -> T
  {
    match self {
      Some(x) => x,
      None => f()
    }
  }
}
```

可以看到 `unwrap_or_else` 方法的实现使用了 `trait bound` ，并且该方法有第二个参数，该参数是一个闭包，因为在 `match` 表达式的 `None` 成员中进行了调用。泛型参数 `T` 是 `Option` 中 `Some` 成员的值的类型。泛型 `F` 的 `trait bound` 是 `FnOnce() -> T` ，这意味着闭包必须能够被调用一次，并且没有参数，然后返回一个 `T`。`FnOnce` 表示 `unwrap_or_else` 方法最多调用一次闭包 `f` ，如果 `Option` 是 `Some` ，`f` 不会被调用，如果 `Option` 是 `None`，`f` 将会被调用一次。

### 迭代器

<font color="red">迭代器是 Rust 零成本抽象（zero-cost）之一，这种现象意味着抽象并不会引入运行时开销</font>。

迭代器允许你对一个序列的项进行某种处理，<font color="red">负责遍历序列中的每一项和决定序列何时结束的逻辑</font>，可以类比 JS 中的迭代器。

在 Rust 中，<font color="red">迭代器是惰性的</font>，这意味着在调用方法使用迭代器之前它都不会有效果，也就是需要一把钥匙来触发迭代器，它才能生效。

```rust
fn main() {
  let arr = vec![1, 2, 3];
	let arr_iter = arr.iter();
}
```

这段代码并不会有任何用处，在这里迭代器只是被创建了，但没有选择哪种方式去使用它。一旦迭代器创建之后，可以选择多种方式利用它，比如 `for` 循环。

```rust
fn main() {
  let arr = vec![1, 2, 3];
	let arr_iter = arr.iter();

  for i in arr_iter {
    println!("item: {}", i);
  }
}
```

使用 `for` 循环遍历一个数组时，在底层会隐式地创建并接着消费一个迭代器。

> Iterator trait 和 next 方法

迭代器都实现了一个叫做 `Iterator` 的定义于标准库的 `trait` 。

```rust
fn main() {
  pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
  }
}
```

`type Item` 和 `Self::Item` ，这是定义了 `trait` 的关联类型。这段代码表明实现 `Iterator trait` 要求同时定义一个 `Item` 类型，这个 `Item` 类型被用作 `next` 方法的返回值类型。

`next` 是 `Iterator` 实现者被要求定义的唯一方法，`next` 一次返回迭代器中的一个项，封装在 `Some` 中，当迭代器结束时，它返回 `None`。

```rust
#[cfg(test)]
fn main() {
    #[test]
    fn testing() {
        let arr = vec![255, 127, 128];

        let mut arr_iter = arr.iter();

        assert_eq!(arr_iter.next(), Some(&1));
        assert_eq!(arr_iter.next(), Some(&2));
        assert_eq!(arr_iter.next(), Some(&3));
        assert_eq!(arr_iter.next(), None);
    }
}
```

在迭代器上调用了 `next` 方法改变了迭代器中用来记录序列位置的状态，换句话说，也就说代码消费了或使用了迭代器，每一个 `next` 调用都会从迭代器中消费一个项。

> 消费迭代器的方法

`Iterator trait` 有一系列不同的由标准库提供默认实现的方法，<font color="red">调用 `next` 方法的方法被称为消费适配器，因为调用它们会消耗迭代器。</font>

```rust
let arr = vec![255, 127, 128];
let arr_iter = arr.iter();
let total = arr_iter.sum();
```

比如 `sum` 方法，这个方法获取迭代器的所有权并反复调用 `next` 来遍历迭代器，所以会消费迭代器。

> 产生其他迭代器的方法

`Iterator trait` 定义了另一类方法，被称为迭代器适配器，<font color="red">它允许我们将当前迭代器变为不同类型的迭代器。</font>可以链式调用多个迭代器适配器，不过由于所有迭代器都是惰性的，因此需要调用一个消费适配器来获取迭代器适配器调用的结果。

```rust
fn main() {
  let arr = vec![255, 127, 128];
  let arr2 = arr.iter().map(|x| x + 1).collect();
}
```

调用 `map` 方法创建一个新的迭代器，接着调用 `collect` 方法消费新迭代器并创建一个 `vector`。

闭包和迭代器是 Rust 受函数式编程所启发的功能，并且它们的实现已经达到了不影响运行时开销的程度了，这正是 Rust 零抽象成本之一。

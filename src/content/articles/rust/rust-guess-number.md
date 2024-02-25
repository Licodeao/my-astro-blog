---
title: Rust 实现猜数字游戏
author: Licodeao
publishDate: "2023-9-8"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Rust
tags:
  - Rust
---

```rust
// 引入库
use std::io;
use rand::Rng;
use std::cmp::Ordering;

fn main() {
    println!("Let's play a game! Guess a number!");

    // 随机生成 1-100 的数字
    let sercet_number = rand::thread_rng().gen_range(1..=100);

    // { } 表示在宏中的占位符
    println!("The sercet_number is {sercet_number}");

    // loop关键字定义循环
    loop {
        println!("Please input your guess.");

        // 定义用户猜测的数字变量，mut 关键字表示该变量是可变的（因为在 Rust 中变量都是默认不可变的）
        let mut guess = String::new();

        // & 表示引用该变量，这样就不用重复创建相同作用的变量了
        io::stdin().read_line(&mut guess).expect("Failed to read line");

        // 使用 match 表达式来过滤非数字情况
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue
        };

        println!("Your guess number is {guess}");

        // 使用 match 表达式来检测用户的猜测是否正确
        match guess.cmp(&sercet_number) {
            Ordering::Less => println!("It's too samll"),
            Ordering::Greater => println!("It's too big"),
            Ordering::Equal => {
                println!("You got it!");
                break;
            }
        }
    }
}
```

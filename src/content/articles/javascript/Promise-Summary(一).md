---
title: Promise总结(一)
author: Licodeao
publishDate: "2022-4-01"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - ECMAScript
tags:
  - ECMAScript
  - JavaScript
---

## 什么是 Promise？

​ Promise 是 ES6 中新规定的一门技术，是 JavaScript 中进行**异步编程**的新解决方案，当然，之前的**旧方案是指：单纯使用回调函数**。因此，Promise 的出现很好地解决了"回调地狱"的情况。这么说，可能有点抽象。具体是指：1.从**语法上**来讲：**Promise 是一个构造函数** 2.从**功能上**来讲：Promise 对象**用来封装一个异步操作**并可以获取其成功或失败的结果

​ 常见的异步操作有：使用 Node.js 中的 fs 模块进行文件操作、数据库(MySQL/mongoDB)操作、Ajax 进行网络请求、定时器等。

```javascript
fs文件操作：
  require('fs').readFile('./index.html', (err, data) => { ... })
Ajax网络请求：
  $.get('/server', data => { ... })
定时器：
  setTimeout(() => { ... }, 1000)
```

​ 为什么上面用的是回调函数，而不是 Promise 呢？

## Promise 相对于之前的回调函数有什么优势吗？**(面试知识点)**

1. #### Promise**支持链式调用**，**可以解决回调地狱问题**

   ##### 什么是回调地狱？

   ​ 回调地狱即是**回调函数嵌套使用**，**外部回调函数异步执行的结果**是**嵌套的回调函数执行的条件**

   ```javascript
   asyncFunc1(opt, (...arg1) => {
      asyncFunc2(opt, (...arg2) => {
         asyncFunc3(opt, (...arg3) => {
            asyncFunc4(opt, (...arg4) => {
             ......
         })
       })
     })
   })
   ```

   ##### 回调地狱的缺点？

   ​ 不便于阅读、不便于异常处理

2. #### **指定回调函数的方式更加灵活**

​ 使用**旧方式**时，**必须在启动异步任务前指定**；而 Promise，不需要，其启动过程：启动异步任务 => **返回 Promise 对象** => **给 Promise 对象绑定回调函数**(甚至可以在异步任务结束后指定/多个)

​ 这里举个例子：使用 Promise 模拟抽奖

```javascript
<div>
   <button id="btn">点击抽奖</button>
</div>
<script>
   /**
    *  模拟需求：点击按钮，1s后显示是否中奖(30%中奖率)，若中奖则弹出"恭喜中奖"；反正，则弹出"再接再厉"
    */

    // 生成随机数
    function rand(m, n) {
       return Math.ceil(Math.random() * (n - m + 1)) + m - 1;
    }

    1.传统方法
    const btn = document.querySelector('#btn');
    btn.addEventListener('click', function() {
       setTimeout(() => {
         let n = rand(1, 100);
         if(n <= 30) {
            alert('恭喜中奖');
         } else {
            alert('再接再厉');
        }
      }, 1000)
    })

    2.Promise
      // 实例化Promise时，需要传入一个回调函数，并且函数的形参也是函数；即resolve, reject是函数类型的数据
    btn.addEventListener('click', function() {
       const p = new Promise((resolve, reject)=>{
            // 处理异步操作
            setTimeout(() => {
              let n = rand(1, 100);
              if(n <= 30) {
                 resolve(n); -> 执行resolve函数，将Promise对象设置为fulfilled（resolved）状态（已成功），可以进行传参
              } else {
                 reject(n); -> 执行reject函数，将Promise对象设置为rejected状态（已失败），可以进行传参
              }
           }, 1000)
       });
       // 执行了相应的函数并不代表能给出对应的内容，只能代表当前Promise对象处于哪种状态
       // 想要得到结果，必须调用Promise对象的then方法。同样，then方法的参数也是两个函数类型数据，分别对应Promise对象处于resolved状态和rejected状态
       p.then((value) => {
          alert('恭喜中奖，中奖号码是' + value);
       }, (reason) => {
          alert('再接再厉，号码是' + reason);
       })
    });
</script>
```
